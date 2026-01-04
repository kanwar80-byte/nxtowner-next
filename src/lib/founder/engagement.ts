import "server-only";
import { createClient } from "@/utils/supabase/server";
import { getListingTrack } from "@/lib/track";

export type EngagementMetrics = {
  sessionsPerDay: number | null;
  pageViewsPerSession: number | null;
  listingViews: number | null;
  avgSessionDuration: number | null; // minutes (estimated)
  topPages: Array<{ path: string; views: number }>;
  dataQualityNote?: string;
};

function toNumber(v: unknown): number {
  if (typeof v === "number") return v;
  if (typeof v === "bigint") return Number(v);
  if (typeof v === "string" && v.trim() !== "" && !Number.isNaN(Number(v))) return Number(v);
  return 0;
}

/**
 * Get engagement metrics from events.
 * Computes session-based metrics and page view patterns.
 */
export async function getEngagementMetrics(period: '7d' | '30d' = '30d', track: 'all' | 'operational' | 'digital' = 'all'): Promise<EngagementMetrics> {
  const supabase = await createClient();
  const sb: any = supabase;
  const now = new Date();
  const days = period === '7d' ? 7 : 30;
  const startDate = new Date(now.getTime() - days * 24 * 60 * 60 * 1000);

  try {
    // Try analytics_daily first
    const startDateStr = startDate.toISOString().split('T')[0];
    let sessionsPerDay: number | null = null;
    let pageViewsPerSession: number | null = null;
    let listingViews: number | null = null;

    try {
      const { data: analyticsData, error: analyticsError } = await sb
        .from('analytics_daily')
        .select('sessions, page_views, listing_views')
        .gte('day', startDateStr)
        .order('day', { ascending: false });

      if (!analyticsError && analyticsData && analyticsData.length > 0) {
        const totalSessions = analyticsData.reduce((sum: number, row: { sessions?: number | null }) => sum + toNumber(row.sessions || 0), 0);
        const totalPageViews = analyticsData.reduce((sum: number, row: { page_views?: number | null }) => sum + toNumber(row.page_views || 0), 0);
        const totalListingViews = analyticsData.reduce((sum: number, row: { listing_views?: number | null }) => sum + toNumber(row.listing_views || 0), 0);

        sessionsPerDay = days > 0 ? Math.round((totalSessions / days) * 10) / 10 : null;
        pageViewsPerSession = totalSessions > 0 ? Math.round((totalPageViews / totalSessions) * 10) / 10 : null;
        listingViews = totalListingViews;
      }

      if (sessionsPerDay === null) {
        throw new Error("No aggregate data, using events");
      }
    } catch {
      // Fallback to events
      const { data: events, error } = await sb
        .from('events')
        .select('session_id, event_name, path, created_at')
        .gte('created_at', startDate.toISOString())
        .order('created_at', { ascending: false });

      if (error) {
        if (process.env.NODE_ENV === "development") {
          console.warn("[getEngagementMetrics] events not available:", error.message);
        }
        return {
          sessionsPerDay: null,
          pageViewsPerSession: null,
          listingViews: null,
          avgSessionDuration: null,
          topPages: [],
          dataQualityNote: "Insufficient data captured for engagement metrics",
        };
      }

      if (!events || events.length === 0) {
        return {
          sessionsPerDay: null,
          pageViewsPerSession: null,
          listingViews: null,
          avgSessionDuration: null,
          topPages: [],
          dataQualityNote: "No events captured in this period",
        };
      }

      // Count unique sessions
      const uniqueSessions = new Set(events.map((e: any) => e.session_id));
      const sessionCount = uniqueSessions.size;
      sessionsPerDay = days > 0 ? Math.round((sessionCount / days) * 10) / 10 : null;

      // Count page views
      const pageViews = events.filter((e: any) => e.event_name === 'page_view').length;
      pageViewsPerSession = sessionCount > 0 ? Math.round((pageViews / sessionCount) * 10) / 10 : null;

      // Count listing views
      // Filter listing views by track if needed
      let listingViewEvents = events.filter((e: any) => e.event_name === 'listing_view');
      if (track !== 'all' && listingViewEvents.length > 0) {
        // Get listing IDs and filter by track
        const listingIds = listingViewEvents
          .map((e: any) => e.listing_id)
          .filter(Boolean);
        if (listingIds.length > 0) {
          try {
            const { data: listings } = await sb
              .from('listings_v16')
              .select('id, asset_type, meta, track, tax_category, category')
              .in('id', listingIds);
            if (listings) {
              const trackFilteredIds = new Set(
                listings
                  .filter((l: any) => getListingTrack(l) === track)
                  .map((l: any) => l.id)
              );
              listingViewEvents = listingViewEvents.filter(
                (e: any) => !e.listing_id || trackFilteredIds.has(e.listing_id)
              );
            }
          } catch {
            // listings_v16 may not exist, use all events
          }
        }
      }
      listingViews = listingViewEvents.length;

      // Estimate session duration (rough: first to last event per session, max 30 min)
      const sessionDurations: number[] = [];
      const sessionEvents = new Map<string, Array<{ created_at: string }>>();
      
      events.forEach((e: any) => {
        if (!sessionEvents.has(e.session_id)) {
          sessionEvents.set(e.session_id, []);
        }
        sessionEvents.get(e.session_id)!.push({ created_at: e.created_at });
      });

      sessionEvents.forEach((sessionEventsList) => {
        if (sessionEventsList.length > 1) {
          const first = new Date(sessionEventsList[sessionEventsList.length - 1].created_at);
          const last = new Date(sessionEventsList[0].created_at);
          const durationMinutes = (last.getTime() - first.getTime()) / (1000 * 60);
          if (durationMinutes > 0 && durationMinutes < 30) {
            sessionDurations.push(durationMinutes);
          }
        }
      });

      const avgSessionDuration = sessionDurations.length > 0
        ? Math.round((sessionDurations.reduce((a, b) => a + b, 0) / sessionDurations.length) * 10) / 10
        : null;

      // Top pages (by path) - only available from events
      const pageViewCounts = new Map<string, number>();
      events
        .filter((e: any) => e.event_name === 'page_view' && e.path)
        .forEach((e: any) => {
          const path = e.path || '/';
          pageViewCounts.set(path, (pageViewCounts.get(path) || 0) + 1);
        });

      const topPages = Array.from(pageViewCounts.entries())
        .map(([path, views]) => ({ path, views }))
        .sort((a, b) => b.views - a.views)
        .slice(0, 10);

      return {
        sessionsPerDay,
        pageViewsPerSession,
        listingViews,
        avgSessionDuration,
        topPages,
      };
    }

    // If we used aggregates, we still need to get top pages from events
    const { data: pageViewEvents } = await sb
      .from('events')
      .select('path')
      .eq('event_name', 'page_view')
      .not('path', 'is', null)
      .gte('created_at', startDate.toISOString())
      .limit(1000);

    const pageViewCounts = new Map<string, number>();
    (pageViewEvents || []).forEach((e: any) => {
      const path = e.path || '/';
      pageViewCounts.set(path, (pageViewCounts.get(path) || 0) + 1);
    });

    const topPages = Array.from(pageViewCounts.entries())
      .map(([path, views]) => ({ path, views }))
      .sort((a, b) => b.views - a.views)
      .slice(0, 10);

    return {
      sessionsPerDay,
      pageViewsPerSession,
      listingViews,
      avgSessionDuration: null, // Not available from aggregates
      topPages,
    };
  } catch (error) {
    if (process.env.NODE_ENV === "development") {
      console.warn("[getEngagementMetrics] Error:", error);
    }
    return {
      sessionsPerDay: null,
      pageViewsPerSession: null,
      listingViews: null,
      avgSessionDuration: null,
      topPages: [],
      dataQualityNote: "Insufficient data captured for engagement metrics",
    };
  }
}

