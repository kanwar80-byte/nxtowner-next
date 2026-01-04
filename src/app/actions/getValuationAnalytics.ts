'use server';

import { createClient } from '@/utils/supabase/server';
import { isAdmin } from '@/lib/auth';

/**
 * Admin-only: Get valuation funnel analytics
 */
export interface ValuationKPIs {
  starts_7d: number;
  starts_30d: number;
  step1_views_7d: number;
  step1_views_30d: number;
  step1_completes_7d: number;
  step1_completes_30d: number;
  completed_7d: number;
  completed_30d: number;
  completion_rate_7d: number;
  completion_rate_30d: number;
  median_time_to_complete_7d: number | null; // in seconds
  median_time_to_complete_30d: number | null;
}

export interface FunnelStep {
  step_id: string;
  step_index: number;
  viewed_count: number;
  completed_count: number;
  drop_off: number;
  drop_off_rate: number;
  track_operational_viewed: number;
  track_operational_completed: number;
  track_digital_viewed: number;
  track_digital_completed: number;
}

export interface TrackBreakdown {
  track: 'operational' | 'digital' | null;
  starts: number;
  completed: number;
  completion_rate: number;
}

export interface RecentCompletion {
  created_at: string;
  track: 'operational' | 'digital' | null;
  readiness_score: number | null;
  valuation_id: string | null;
  user_id: string;
}

export interface ValuationAnalytics {
  kpis: ValuationKPIs;
  funnel: FunnelStep[];
  trackBreakdown: TrackBreakdown[];
  recentCompletions: RecentCompletion[];
}

/**
 * Check if user is admin (server-side)
 * Uses centralized isAdmin() helper
 */
async function requireAdmin() {
  const userIsAdmin = await isAdmin();
  
  if (!userIsAdmin) {
    throw new Error('Admin access required');
  }
}

/**
 * Get valuation funnel analytics (admin only)
 */
export async function getValuationAnalytics(): Promise<ValuationAnalytics | null> {
  try {
    await requireAdmin();
    const supabase = await createClient();

    const now = new Date();
    const sevenDaysAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
    const thirtyDaysAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);

    // Helper to safely extract payload (previously props)
    const getProp = (payload: any, key: string): any => {
      if (!payload || typeof payload !== 'object') return null;
      return payload[key] ?? null;
    };

    // 1. KPI Cards
    // Get all valuation events
    // TODO(schema): events.type enum values unknown - using string literals with cast
    const { data: allEvents, error: eventsError } = await supabase
      .from('events')
      .select('type, payload, created_at, actor_id')
      .in('type', ['valuation_started', 'valuation_step_viewed', 'valuation_step_completed', 'valuation_completed'] as any)
      .gte('created_at', thirtyDaysAgo.toISOString())
      .order('created_at', { ascending: false });

    if (eventsError) {
      console.error('Error fetching events:', eventsError);
      return null;
    }

    const events = allEvents || [];

    // Filter by date ranges
    const events7d = events.filter(e => new Date(e.created_at) >= sevenDaysAgo);
    const events30d = events;

    // Calculate KPIs
    const starts7d = events7d.filter(e => String(e.type) === 'valuation_started').length;
    const starts30d = events30d.filter(e => String(e.type) === 'valuation_started').length;

    // Step 1 = track selection (step_id = 'track', step_index = 1)
    const step1Views7d = events7d.filter(e => 
      String(e.type) === 'valuation_step_viewed' && getProp(e.payload, 'step_id') === 'track'
    ).length;
    const step1Views30d = events30d.filter(e => 
      String(e.type) === 'valuation_step_viewed' && getProp(e.payload, 'step_id') === 'track'
    ).length;

    const step1Completes7d = events7d.filter(e => 
      String(e.type) === 'valuation_step_completed' && getProp(e.payload, 'step_id') === 'track'
    ).length;
    const step1Completes30d = events30d.filter(e => 
      String(e.type) === 'valuation_step_completed' && getProp(e.payload, 'step_id') === 'track'
    ).length;

    const completed7d = events7d.filter(e => String(e.type) === 'valuation_completed').length;
    const completed30d = events30d.filter(e => String(e.type) === 'valuation_completed').length;

    const completionRate7d = starts7d > 0 ? (completed7d / starts7d) * 100 : 0;
    const completionRate30d = starts30d > 0 ? (completed30d / starts30d) * 100 : 0;

    // Calculate median time to complete
    const calculateMedianTime = (events: any[]): number | null => {
      const completions = events.filter(e => String(e.type) === 'valuation_completed');
      const starts = events.filter(e => String(e.type) === 'valuation_started');

      // Group by valuation_id
      const completionMap = new Map<string, Date>();
      const startMap = new Map<string, Date>();

      completions.forEach(e => {
        const valuationId = getProp(e.payload, 'valuation_id');
        if (valuationId) {
          completionMap.set(valuationId, new Date(e.created_at));
        }
      });

      starts.forEach(e => {
        const valuationId = getProp(e.payload, 'valuation_id');
        if (valuationId) {
          startMap.set(valuationId, new Date(e.created_at));
        }
      });

      const times: number[] = [];
      completionMap.forEach((completionTime, valuationId) => {
        const startTime = startMap.get(valuationId);
        if (startTime) {
          const diffSeconds = (completionTime.getTime() - startTime.getTime()) / 1000;
          if (diffSeconds > 0) {
            times.push(diffSeconds);
          }
        }
      });

      if (times.length === 0) return null;
      times.sort((a, b) => a - b);
      const mid = Math.floor(times.length / 2);
      return times.length % 2 === 0
        ? (times[mid - 1] + times[mid]) / 2
        : times[mid];
    };

    const medianTime7d = calculateMedianTime(events7d);
    const medianTime30d = calculateMedianTime(events30d);

    const kpis: ValuationKPIs = {
      starts_7d: starts7d,
      starts_30d: starts30d,
      step1_views_7d: step1Views7d,
      step1_views_30d: step1Views30d,
      step1_completes_7d: step1Completes7d,
      step1_completes_30d: step1Completes30d,
      completed_7d: completed7d,
      completed_30d: completed30d,
      completion_rate_7d: Math.round(completionRate7d * 100) / 100,
      completion_rate_30d: Math.round(completionRate30d * 100) / 100,
      median_time_to_complete_7d: medianTime7d,
      median_time_to_complete_30d: medianTime30d,
    };

    // 2. Funnel Table (by step_id)
    const stepOrder = ['intent', 'track', 'profile', 'financials', 'risk', 'valuation_preview', 'readiness', 'next_actions'];
    const funnel: FunnelStep[] = [];

    stepOrder.forEach((stepId, index) => {
      const viewed = events30d.filter(e => 
        String(e.type) === 'valuation_step_viewed' && getProp(e.payload, 'step_id') === stepId
      );
      const completed = events30d.filter(e => 
        String(e.type) === 'valuation_step_completed' && getProp(e.payload, 'step_id') === stepId
      );

      const viewedCount = viewed.length;
      const completedCount = completed.length;
      const dropOff = viewedCount - completedCount;
      const dropOffRate = viewedCount > 0 ? (dropOff / viewedCount) * 100 : 0;

      // Split by track
      const operationalViewed = viewed.filter(e => getProp(e.payload, 'track') === 'operational').length;
      const operationalCompleted = completed.filter(e => getProp(e.payload, 'track') === 'operational').length;
      const digitalViewed = viewed.filter(e => getProp(e.payload, 'track') === 'digital').length;
      const digitalCompleted = completed.filter(e => getProp(e.payload, 'track') === 'digital').length;

      funnel.push({
        step_id: stepId,
        step_index: index,
        viewed_count: viewedCount,
        completed_count: completedCount,
        drop_off: dropOff,
        drop_off_rate: Math.round(dropOffRate * 100) / 100,
        track_operational_viewed: operationalViewed,
        track_operational_completed: operationalCompleted,
        track_digital_viewed: digitalViewed,
        track_digital_completed: digitalCompleted,
      });
    });

    // 3. Track Breakdown
    const trackBreakdown: TrackBreakdown[] = [];

    // Operational
    const operationalStarts = events30d.filter(e => 
      String(e.type) === 'valuation_started' && getProp(e.payload, 'track') === 'operational'
    ).length;
    const operationalCompleted = events30d.filter(e => 
      String(e.type) === 'valuation_completed' && getProp(e.payload, 'track') === 'operational'
    ).length;
    trackBreakdown.push({
      track: 'operational',
      starts: operationalStarts,
      completed: operationalCompleted,
      completion_rate: operationalStarts > 0 ? Math.round((operationalCompleted / operationalStarts) * 100 * 100) / 100 : 0,
    });

    // Digital
    const digitalStarts = events30d.filter(e => 
      String(e.type) === 'valuation_started' && getProp(e.payload, 'track') === 'digital'
    ).length;
    const digitalCompleted = events30d.filter(e => 
      String(e.type) === 'valuation_completed' && getProp(e.payload, 'track') === 'digital'
    ).length;
    trackBreakdown.push({
      track: 'digital',
      starts: digitalStarts,
      completed: digitalCompleted,
      completion_rate: digitalStarts > 0 ? Math.round((digitalCompleted / digitalStarts) * 100 * 100) / 100 : 0,
    });

    // Null/Unknown
    const nullStarts = events30d.filter(e => 
      String(e.type) === 'valuation_started' && (getProp(e.payload, 'track') === null || getProp(e.payload, 'track') === undefined)
    ).length;
    const nullCompleted = events30d.filter(e => 
      String(e.type) === 'valuation_completed' && (getProp(e.payload, 'track') === null || getProp(e.payload, 'track') === undefined)
    ).length;
    trackBreakdown.push({
      track: null,
      starts: nullStarts,
      completed: nullCompleted,
      completion_rate: nullStarts > 0 ? Math.round((nullCompleted / nullStarts) * 100 * 100) / 100 : 0,
    });

    // 4. Recent Completions (last 20)
    const completions = events30d
      .filter(e => String(e.type) === 'valuation_completed')
      .slice(0, 20)
      .map(e => ({
        created_at: e.created_at,
        track: getProp(e.payload, 'track') as 'operational' | 'digital' | null,
        readiness_score: getProp(e.payload, 'readiness_score') as number | null,
        valuation_id: getProp(e.payload, 'valuation_id') as string | null,
        user_id: e.actor_id || '',
      }));

    // readiness_score comes from event payload only (valuations table doesn't have this column)
    const recentCompletions: RecentCompletion[] = completions;

    return {
      kpis,
      funnel,
      trackBreakdown,
      recentCompletions,
    };
  } catch (err) {
    console.error('Error fetching valuation analytics:', err);
    return null;
  }
}

