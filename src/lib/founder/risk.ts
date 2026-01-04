import "server-only";
import { createClient } from "@/utils/supabase/server";
import { getListingTrack } from "@/lib/track";

export type RiskSignal = {
  type: 'high_risk_session' | 'suspicious_pattern' | 'low_quality_listing';
  severity: 'high' | 'medium' | 'low';
  count: number;
  reasons: string[];
};

export type RiskMetrics = {
  highRiskSessions: number | null;
  suspiciousPatterns: number | null;
  lowQualityListings: number | null;
  signals: RiskSignal[];
  dataQualityNote?: string;
};

function toNumber(v: unknown): number {
  if (typeof v === "number") return v;
  if (typeof v === "bigint") return Number(v);
  if (typeof v === "string" && v.trim() !== "" && !Number.isNaN(Number(v))) return Number(v);
  return 0;
}

/**
 * Get risk metrics from events table and listing metadata.
 * Identifies high-risk sessions, suspicious patterns, and low-quality listings.
 */
export async function getRiskMetrics(track: 'all' | 'operational' | 'digital' = 'all'): Promise<RiskMetrics> {
  const supabase = await createClient();
  const now = new Date();
  const thirtyDaysAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);

  try {
    // Get events for risk analysis
    const { data: events, error: eventsError } = await supabase
      .from('events')
      .select('session_id, event_name, listing_id, created_at')
      .gte('created_at', thirtyDaysAgo.toISOString())
      .order('created_at', { ascending: false });

    if (eventsError || !events) {
      // Return safe defaults without console spam
      return {
        highRiskSessions: null,
        suspiciousPatterns: null,
        lowQualityListings: null,
        signals: [],
        dataQualityNote: "Insufficient data captured for risk metrics",
      };
    }

    // Analyze sessions for risk patterns
    const sessionActivity = new Map<string, {
      listingViews: number;
      enquiries: number;
      listingIds: Set<string>;
      timestamps: Date[];
    }>();

    events.forEach((e: any) => {
      const sessionId = e.session_id;
      if (!sessionActivity.has(sessionId)) {
        sessionActivity.set(sessionId, {
          listingViews: 0,
          enquiries: 0,
          listingIds: new Set(),
          timestamps: [],
        });
      }
      const activity = sessionActivity.get(sessionId)!;

      if (e.event_name === 'listing_view') {
        activity.listingViews++;
        if (e.listing_id) activity.listingIds.add(e.listing_id);
        activity.timestamps.push(new Date(e.created_at));
      } else if (e.event_name === 'enquiry_sent') {
        activity.enquiries++;
      }
    });

    // High-risk sessions: many listing views with zero enquiries
    let highRiskSessions = 0;
    const highRiskReasons: string[] = [];
    sessionActivity.forEach((activity, sessionId) => {
      if (activity.listingViews >= 10 && activity.enquiries === 0) {
        highRiskSessions++;
        if (highRiskReasons.length < 3) {
          highRiskReasons.push(`Session viewed ${activity.listingViews} listings but sent no enquiries`);
        }
      }
    });

    // Suspicious patterns: repeated listing_view bursts (same listing viewed many times quickly)
    let suspiciousPatterns = 0;
    const suspiciousReasons: string[] = [];
    const listingViewBursts = new Map<string, Array<Date>>();

    events
      .filter((e: any) => e.event_name === 'listing_view' && e.listing_id)
      .forEach((e: any) => {
        const listingId = e.listing_id;
        if (!listingViewBursts.has(listingId)) {
          listingViewBursts.set(listingId, []);
        }
        listingViewBursts.get(listingId)!.push(new Date(e.created_at));
      });

    // If track filter is active, get listing tracks for filtering
    let listingTracks: Map<string, 'operational' | 'digital' | 'unknown'> | null = null;
    if (track !== 'all') {
      const listingIds = Array.from(listingViewBursts.keys());
      if (listingIds.length > 0) {
        try {
          const { data: listings } = await supabase
            .from('listings_v16')
            .select('id, asset_type, meta, track, tax_category, category')
            .in('id', listingIds);
          if (listings) {
            listingTracks = new Map();
            listings.forEach((l: any) => {
              listingTracks!.set(l.id, getListingTrack(l));
            });
          }
        } catch {
          // listings_v16 may not exist
        }
      }
    }

    listingViewBursts.forEach((timestamps, listingId) => {
      // Filter by track if needed
      if (track !== 'all' && listingTracks) {
        const listingTrack = listingTracks.get(listingId);
        if (listingTrack !== track) return;
      }

      // Check for bursts: 5+ views within 1 hour
      timestamps.sort((a, b) => a.getTime() - b.getTime());
      for (let i = 0; i < timestamps.length - 4; i++) {
        const windowStart = timestamps[i];
        const windowEnd = new Date(windowStart.getTime() + 60 * 60 * 1000); // 1 hour
        const viewsInWindow = timestamps.filter(ts => ts >= windowStart && ts <= windowEnd).length;
        if (viewsInWindow >= 5) {
          suspiciousPatterns++;
          if (suspiciousReasons.length < 3) {
            suspiciousReasons.push(`Listing ${listingId.substring(0, 8)}... viewed ${viewsInWindow} times in 1 hour`);
          }
          break; // Count each listing once
        }
      }
    });

    // Low quality listings: from listings_v16 metadata or heuristic
    let lowQualityListings = 0;
    const lowQualityReasons: string[] = [];

    try {
      const { data: listings } = await supabase
        .from('listings_v16')
        .select('id, title, description, asking_price, meta, status')
        .eq('status', 'published')
        .limit(1000);

      if (listings) {
        listings.forEach((listing: any) => {
          // Filter by track if needed
          if (track !== 'all' && getListingTrack(listing) !== track) {
            return;
          }

          const issues: string[] = [];
          
          // Check for missing critical fields
          if (!listing.title || listing.title.trim() === '') {
            issues.push('missing title');
          }
          if (!listing.description || listing.description.trim() === '') {
            issues.push('missing description');
          }
          if (!listing.asking_price || listing.asking_price <= 0) {
            issues.push('missing or invalid price');
          }

          // Check meta.ai for quality score if available
          const meta = listing.meta || {};
          if (meta.ai && typeof meta.ai === 'object') {
            const qualityScore = meta.ai.quality_score || meta.ai.quality;
            if (qualityScore !== undefined && qualityScore < 0.5) {
              issues.push('low AI quality score');
            }
          }

          if (issues.length >= 2) {
            lowQualityListings++;
            if (lowQualityReasons.length < 3) {
              lowQualityReasons.push(`Listing ${listing.id.substring(0, 8)}...: ${issues.join(', ')}`);
            }
          }
        });
      }
    } catch {
      // listings_v16 table may not exist or have different schema
    }

    const signals: RiskSignal[] = [];
    if (highRiskSessions > 0) {
      signals.push({
        type: 'high_risk_session',
        severity: highRiskSessions > 50 ? 'high' : 'medium',
        count: highRiskSessions,
        reasons: highRiskReasons.slice(0, 3),
      });
    }
    if (suspiciousPatterns > 0) {
      signals.push({
        type: 'suspicious_pattern',
        severity: suspiciousPatterns > 10 ? 'high' : 'medium',
        count: suspiciousPatterns,
        reasons: suspiciousReasons.slice(0, 3),
      });
    }
    if (lowQualityListings > 0) {
      signals.push({
        type: 'low_quality_listing',
        severity: lowQualityListings > 20 ? 'high' : 'medium',
        count: lowQualityListings,
        reasons: lowQualityReasons.slice(0, 3),
      });
    }

    return {
      highRiskSessions,
      suspiciousPatterns,
      lowQualityListings,
      signals,
    };
  } catch (error) {
    if (process.env.NODE_ENV === "development") {
      console.warn("[getRiskMetrics] Error:", error);
    }
    return {
      highRiskSessions: null,
      suspiciousPatterns: null,
      lowQualityListings: null,
      signals: [],
      dataQualityNote: "Insufficient data captured for risk metrics",
    };
  }
}

