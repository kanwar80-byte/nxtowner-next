import "server-only";
import { createClient } from "@supabase/supabase-js";
import { getYesterdayTorontoDate, getTorontoDayRange } from "./time";
import type { Database } from "@/types/database";

/**
 * Analytics aggregation helpers.
 * These functions compute daily aggregates from events and core tables.
 */

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const SUPABASE_SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY!;

/**
 * Get service role Supabase client for cron job.
 */
function getServiceClient() {
  if (!SUPABASE_URL || !SUPABASE_SERVICE_ROLE_KEY) {
    throw new Error("Missing SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY");
  }
  return createClient<Database>(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY, {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
    },
  });
}

/**
 * Compute analytics_daily aggregates for a given Toronto date.
 */
export async function computeAnalyticsDaily(torontoDate: string) {
  const supabase = getServiceClient();
  const sb: any = supabase;
  const { startUTC, endUTC } = getTorontoDayRange(torontoDate);

  try {
    // Get events for the day (using UTC boundaries)
    // Note: We'll query events with timezone conversion in PostgreSQL
    // For now, we'll use a simple date range and let PostgreSQL handle it
    
    // Query events for the day
    // We need to convert Toronto date to UTC range
    // Using a simpler approach: query by date string and let PostgreSQL handle conversion
    
    const startDate = new Date(`${startUTC}Z`);
    const endDate = new Date(`${endUTC}Z`);
    
    // Adjust for Toronto timezone offset (approximately UTC-5, but DST varies)
    // For accuracy, we'll query a wider range and filter in application
    // Or use PostgreSQL timezone functions
    
    // For now, use a simple approach: query events where created_at date matches
    // This is approximate but works for daily aggregates
    
    // Visitors: distinct actor_id from visit/page_view events
    // TODO(schema): events.type enum values unknown - using string literals with cast
    const { data: visitorEvents } = await sb
      .from('events')
      .select('actor_id')
      .in('type', ['visit', 'page_view'] as any)
      .gte('created_at', startDate.toISOString())
      .lt('created_at', new Date(endDate.getTime() + 24 * 60 * 60 * 1000).toISOString());
    
    const visitors = new Set((visitorEvents || []).map((e: any) => e.actor_id).filter(Boolean)).size;
    const sessions = visitors; // Same as visitors for now

    // Page views
    const { count: pageViews } = await sb
      .from('events')
      .select('*', { count: 'exact', head: true })
      .eq('type', 'page_view' as any)
      .gte('created_at', startDate.toISOString())
      .lt('created_at', new Date(endDate.getTime() + 24 * 60 * 60 * 1000).toISOString());

    // Listing views
    const { count: listingViews } = await sb
      .from('events')
      .select('*', { count: 'exact', head: true })
      .eq('type', 'listing_view' as any)
      .gte('created_at', startDate.toISOString())
      .lt('created_at', new Date(endDate.getTime() + 24 * 60 * 60 * 1000).toISOString());

    // Registrations: profiles created on this day
    const { count: registrations } = await sb
      .from('profiles')
      .select('*', { count: 'exact', head: true })
      .gte('created_at', startDate.toISOString())
      .lt('created_at', new Date(endDate.getTime() + 24 * 60 * 60 * 1000).toISOString());

    // NDA requested
    const { count: ndaRequested } = await sb
      .from('events')
      .select('*', { count: 'exact', head: true })
      .eq('type', 'nda_requested' as any)
      .gte('created_at', startDate.toISOString())
      .lt('created_at', new Date(endDate.getTime() + 24 * 60 * 60 * 1000).toISOString());

    // NDA signed
    const { count: ndaSigned } = await sb
      .from('events')
      .select('*', { count: 'exact', head: true })
      .eq('type', 'nda_signed' as any)
      .gte('created_at', startDate.toISOString())
      .lt('created_at', new Date(endDate.getTime() + 24 * 60 * 60 * 1000).toISOString());

    // Enquiries
    const { count: enquiries } = await sb
      .from('events')
      .select('*', { count: 'exact', head: true })
      .eq('type', 'enquiry_sent' as any)
      .gte('created_at', startDate.toISOString())
      .lt('created_at', new Date(endDate.getTime() + 24 * 60 * 60 * 1000).toISOString());

    // Deal rooms created
    const { count: dealRoomsCreated } = await sb
      .from('events')
      .select('*', { count: 'exact', head: true })
      .eq('type', 'deal_room_created' as any)
      .gte('created_at', startDate.toISOString())
      .lt('created_at', new Date(endDate.getTime() + 24 * 60 * 60 * 1000).toISOString());

    // Messages sent
    const { count: messagesSent } = await sb
      .from('events')
      .select('*', { count: 'exact', head: true })
      .eq('type', 'message_sent' as any)
      .gte('created_at', startDate.toISOString())
      .lt('created_at', new Date(endDate.getTime() + 24 * 60 * 60 * 1000).toISOString());

    // TODO(schema): analytics_daily table does not exist - removed upsert, just return computed values

    return {
      day: torontoDate,
      visitors,
      sessions,
      page_views: pageViews || 0,
      listing_views: listingViews || 0,
      registrations: registrations || 0,
      nda_requested: ndaRequested || 0,
      nda_signed: ndaSigned || 0,
      enquiries: enquiries || 0,
      deal_rooms_created: dealRoomsCreated || 0,
      messages_sent: messagesSent || 0,
    };
  } catch (error) {
    console.error(`[computeAnalyticsDaily] Error for ${torontoDate}:`, error);
    throw error;
  }
}

/**
 * Compute analytics_funnel_daily aggregates for a given Toronto date.
 */
export async function computeFunnelDaily(torontoDate: string) {
  const supabase = getServiceClient();
  const sb: any = supabase;
  const { startUTC, endUTC } = getTorontoDayRange(torontoDate);
  const startDate = new Date(`${startUTC}Z`);
  const endDate = new Date(`${endUTC}Z`);

  try {
    const steps = [
      { step: 'visitor', eventNames: ['visit', 'page_view'], distinctSession: true },
      { step: 'registered', table: 'profiles', distinctSession: false },
      { step: 'listing_viewed', eventName: 'listing_view', distinctSession: false },
      { step: 'nda_requested', eventName: 'nda_requested', distinctSession: false },
      { step: 'nda_signed', eventName: 'nda_signed', distinctSession: false },
      { step: 'enquiry_sent', eventName: 'enquiry_sent', distinctSession: false },
      { step: 'deal_room_created', eventName: 'deal_room_created', distinctSession: false },
      { step: 'message_sent', eventName: 'message_sent', distinctSession: false },
    ];

    const funnelData: Array<{ step: string; count: number }> = [];

    for (const stepDef of steps) {
      let count = 0;

      if (stepDef.step === 'visitor') {
        // TODO(schema): events.type enum values unknown - using string literals with cast
        const { data: events } = await sb
          .from('events')
          .select('actor_id')
          .in('type', stepDef.eventNames! as any)
          .gte('created_at', startDate.toISOString())
          .lt('created_at', new Date(endDate.getTime() + 24 * 60 * 60 * 1000).toISOString());
        count = new Set((events || []).map((e: any) => e.actor_id).filter(Boolean)).size;
      } else if (stepDef.step === 'registered') {
        const { count: regCount } = await sb
          .from('profiles')
          .select('*', { count: 'exact', head: true })
          .gte('created_at', startDate.toISOString())
          .lt('created_at', new Date(endDate.getTime() + 24 * 60 * 60 * 1000).toISOString());
        count = regCount || 0;
      } else if (stepDef.eventName) {
        // TODO(schema): events.type enum values unknown - using string literals with cast
        const { count: eventCount } = await sb
          .from('events')
          .select('*', { count: 'exact', head: true })
          .eq('type', stepDef.eventName as any)
          .gte('created_at', startDate.toISOString())
          .lt('created_at', new Date(endDate.getTime() + 24 * 60 * 60 * 1000).toISOString());
        count = eventCount || 0;
      }

      funnelData.push({ step: stepDef.step, count });

      // TODO(schema): analytics_funnel_daily table does not exist - removed upsert, just return computed values
    }

    return funnelData;
  } catch (error) {
    console.error(`[computeFunnelDaily] Error for ${torontoDate}:`, error);
    throw error;
  }
}

/**
 * Compute analytics_feature_daily aggregates for a given Toronto date.
 */
export async function computeFeatureDaily(torontoDate: string) {
  const supabase = getServiceClient();
  const sb: any = supabase;
  const { startUTC, endUTC } = getTorontoDayRange(torontoDate);
  const startDate = new Date(`${startUTC}Z`);
  const endDate = new Date(`${endUTC}Z`);

  try {
    // Features to track (only compute if events exist)
    const features = [
      { feature: 'search_submitted', eventName: 'search' },
      { feature: 'valuation_used', eventName: 'valuation_started' },
    ];

    const featureData: Array<{ feature: string; count: number }> = [];

    for (const featureDef of features) {
      try {
        // TODO(schema): events.type enum values unknown - using string literals with cast
        const { count } = await sb
          .from('events')
          .select('*', { count: 'exact', head: true })
          .eq('type', featureDef.eventName as any)
          .gte('created_at', startDate.toISOString())
          .lt('created_at', new Date(endDate.getTime() + 24 * 60 * 60 * 1000).toISOString());

        const countValue = count || 0;
        featureData.push({ feature: featureDef.feature, count: countValue });

        // TODO(schema): analytics_feature_daily table does not exist - removed upsert, just return computed values
      } catch (error) {
        // Feature event doesn't exist, skip it
        if (process.env.NODE_ENV === "development") {
          console.warn(`[computeFeatureDaily] Feature ${featureDef.feature} not available:`, error);
        }
      }
    }

    return featureData;
  } catch (error) {
    console.error(`[computeFeatureDaily] Error for ${torontoDate}:`, error);
    throw error;
  }
}

/**
 * Compute analytics_revenue_daily aggregates for a given Toronto date.
 */
export async function computeRevenueDaily(torontoDate: string) {
  const supabase = getServiceClient();
  const sb: any = supabase;
  const { startUTC, endUTC } = getTorontoDayRange(torontoDate);
  const startDate = new Date(`${startUTC}Z`);
  const endDate = new Date(`${endUTC}Z`);

  try {
    let paidUsers: number | null = null;
    let mrr: number | null = null;
    let arr: number | null = null;
    const upgradesRevenue: number | null = null;

    // Try to get paid users from profiles
    try {
      const { count } = await sb
        .from('profiles')
        .select('*', { count: 'exact', head: true })
        .or('subscription_tier.neq.free,tier.neq.free')
        .not('subscription_tier', 'is', null)
        .gte('created_at', startDate.toISOString())
        .lt('created_at', new Date(endDate.getTime() + 24 * 60 * 60 * 1000).toISOString());
      paidUsers = count || 0;
    } catch {
      // profiles table may not have tier columns
    }

    // Try to get MRR from subscriptions table
    try {
      const { data: subscriptions } = await sb
        .from('subscriptions')
        .select('amount, interval')
        .eq('status', 'active')
        .gte('created_at', startDate.toISOString())
        .lt('created_at', new Date(endDate.getTime() + 24 * 60 * 60 * 1000).toISOString());

      if (subscriptions && subscriptions.length > 0) {
        mrr = subscriptions.reduce((sum: number, sub: any) => {
          const amount = Number(sub.amount ?? 0);
          const interval = sub.interval ?? 'month';
          if (interval === 'month') {
            return sum + amount;
          } else if (interval === 'year') {
            return sum + (amount / 12);
          }
          return sum;
        }, 0);
        arr = (mrr ?? 0) * 12;
      }
    } catch {
      // subscriptions table may not exist
    }

    // TODO(schema): analytics_revenue_daily table does not exist - removed upsert, just return computed values

    return {
      day: torontoDate,
      paid_users: paidUsers,
      mrr,
      arr,
      upgrades_revenue: upgradesRevenue,
    };
  } catch (error) {
    console.error(`[computeRevenueDaily] Error for ${torontoDate}:`, error);
    throw error;
  }
}

/**
 * Compute all daily aggregates for yesterday (Toronto time).
 */
export async function computeAllDailyAggregates() {
  const yesterdayDate = getYesterdayTorontoDate();

  try {
    const [analytics, funnel, features, revenue] = await Promise.all([
      computeAnalyticsDaily(yesterdayDate),
      computeFunnelDaily(yesterdayDate),
      computeFeatureDaily(yesterdayDate),
      computeRevenueDaily(yesterdayDate),
    ]);

    return {
      day: yesterdayDate,
      analytics,
      funnel,
      features,
      revenue,
    };
  } catch (error) {
    console.error("[computeAllDailyAggregates] Error:", error);
    throw error;
  }
}

