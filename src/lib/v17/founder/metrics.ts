import "server-only";

import { createSupabaseServerClient } from '@/utils/supabase/server';
import type { FounderMetricsV17, MetricsWindow } from '@/types/v17/founder';

/**
 * V17 Canonical Founder Metrics Service
 * Returns aggregated metrics for founder dashboard
 */

/**
 * Get founder metrics for specified time window
 * Uses real database queries with defensive error handling
 */
export async function getFounderMetrics(
  window: MetricsWindow
): Promise<FounderMetricsV17> {
  const supabase = await createSupabaseServerClient();
  const days = window === '7d' ? 7 : 30;
  const since = new Date();
  since.setDate(since.getDate() - days);

  // Marketplace Health Metrics
  let total_listings = 0;
  let active_listings_window = 0;
  let new_listings_window = 0;
  let verified_listings_pct = 0;
  let nda_required_pct = 0;
  let avg_rank_score = 0;

  try {
    // Total listings (from listings_public_teaser_v17)
    // Note: Using (supabase as any) as a temporary bridge until Supabase types are regenerated
    const { count: totalCount } = await (supabase as any)
      .from('listings_public_teaser_v17')
      .select('*', { count: 'exact', head: true })
      .in('status', ['published', 'teaser']);
    total_listings = totalCount ?? 0;

    // Active listings (updated_at >= since)
    // Note: If view doesn't have updated_at, we'll use created_at as fallback
    const { count: activeCount } = await (supabase as any)
      .from('listings_public_teaser_v17')
      .select('*', { count: 'exact', head: true })
      .in('status', ['published', 'teaser'])
      .gte('created_at', since.toISOString());
    active_listings_window = activeCount ?? 0;

    // New listings (created_at >= since)
    const { count: newCount } = await (supabase as any)
      .from('listings_public_teaser_v17')
      .select('*', { count: 'exact', head: true })
      .in('status', ['published', 'teaser'])
      .gte('created_at', since.toISOString());
    new_listings_window = newCount ?? 0;

    // Verified listings percentage (if verification_status column exists)
    // For now, use status='published' as proxy for verified
    if (total_listings > 0) {
      const { count: verifiedCount } = await (supabase as any)
        .from('listings_public_teaser_v17')
        .select('*', { count: 'exact', head: true })
        .eq('status', 'published');
      verified_listings_pct = ((verifiedCount ?? 0) / total_listings) * 100;
    }
  } catch (error) {
    console.error('[founder/metrics] Marketplace query error:', error);
    // Return zeros on error
  }

  // Funnel Metrics
  let lead_submits_window = 0;
  let nda_requests_window = 0;
  let nda_signed_window = 0;
  let deal_room_opens_window = 0;

  try {
    // Leads (try listing_leads table first, then leads as fallback)
    // Note: Using (supabase as any) as a temporary bridge until Supabase types are regenerated
    const { count: listingLeadsCount } = await (supabase as any)
      .from('listing_leads')
      .select('*', { count: 'exact', head: true })
      .gte('created_at', since.toISOString());
    lead_submits_window = listingLeadsCount ?? 0;
  } catch (error) {
    // Try alternative table name
    try {
      const { count: leadsCount } = await supabase
        .from('leads')
        .select('*', { count: 'exact', head: true })
        .gte('created_at', since.toISOString());
      lead_submits_window = leadsCount ?? 0;
    } catch (error2) {
      // Both tables may not exist - safe to ignore
    }
  }

  try {
    // NDA requests (created_at >= since)
    const { count: ndaRequestsCount } = await supabase
      .from('ndas')
      .select('*', { count: 'exact', head: true })
      .gte('created_at', since.toISOString());
    nda_requests_window = ndaRequestsCount ?? 0;

    // NDA signed (signed_at >= since AND status='signed')
    const { count: ndaSignedCount } = await supabase
      .from('ndas')
      .select('*', { count: 'exact', head: true })
      .eq('status', 'signed')
      .gte('signed_at', since.toISOString());
    nda_signed_window = ndaSignedCount ?? 0;
  } catch (error) {
    console.error('[founder/metrics] NDA query error:', error);
  }

  try {
    // Deal room opens (if deal_room_activity table exists)
    // Note: Using (supabase as any) as a temporary bridge until Supabase types are regenerated
    const { count: opensCount } = await (supabase as any)
      .from('deal_room_activity')
      .select('*', { count: 'exact', head: true })
      .eq('event_type', 'opened')
      .gte('created_at', since.toISOString());
    deal_room_opens_window = opensCount ?? 0;
  } catch (error) {
    // Table may not exist - safe to ignore
  }

  // Revenue Metrics (defensive - tables may not exist)
  let upgrades_sold_window = 0;
  let subscription_signups_window = 0;

  try {
    // Upgrades (if listing_upgrades table exists)
    // Note: Using (supabase as any) as a temporary bridge until Supabase types are regenerated
    const { count: upgradesCount } = await (supabase as any)
      .from('listing_upgrades')
      .select('*', { count: 'exact', head: true })
      .gte('created_at', since.toISOString());
    upgrades_sold_window = upgradesCount ?? 0;
  } catch (error) {
    // Table may not exist
  }

  // Risk Metrics (defensive - tables may not exist)
  let flagged_listings_window = 0;

  try {
    // Risk flags (if risk_flags table exists)
    // Note: Using (supabase as any) as a temporary bridge until Supabase types are regenerated
    const { count: flagsCount } = await (supabase as any)
      .from('risk_flags')
      .select('*', { count: 'exact', head: true })
      .gte('created_at', since.toISOString());
    flagged_listings_window = flagsCount ?? 0;
  } catch (error) {
    // Table may not exist
  }

  // Map window-specific values (interface uses _7d suffix but supports both windows)
  // For now, use the same value for both windows (the query already filters by the window)
  const active_listings_value = active_listings_window;
  const new_listings_value = new_listings_window;
  const lead_submits_value = lead_submits_window;
  const nda_requests_value = nda_requests_window;
  const nda_signed_value = nda_signed_window;
  const deal_room_opens_value = deal_room_opens_window;
  const upgrades_sold_value = upgrades_sold_window;
  const subscription_signups_value = subscription_signups_window;
  const flagged_listings_value = flagged_listings_window;

  return {
    window,
    marketplace: {
      total_listings,
      active_listings_7d: active_listings_value,
      new_listings_7d: new_listings_value,
      verified_listings_pct,
      nda_required_pct, // TODO: Calculate from listings with nda_required flag
      avg_rank_score, // TODO: Calculate if rank_score column exists
    },
    funnel: {
      visits_7d: 0, // TODO: Implement from events/analytics table
      listing_views_7d: 0, // TODO: Implement from events/analytics table
      lead_submits_7d: lead_submits_value,
      nda_requests_7d: nda_requests_value,
      nda_signed_7d: nda_signed_value,
      deal_room_opens_7d: deal_room_opens_value,
    },
    revenue: {
      upgrades_sold_7d: upgrades_sold_value,
      subscription_signups_7d: subscription_signups_value,
      mrr_estimate: 0, // TODO: Calculate from subscriptions
      arpa_estimate: 0, // TODO: Calculate from revenue/subscriptions
    },
    risk: {
      flagged_listings_7d: flagged_listings_value,
      blocked_users_7d: 0, // TODO: Implement from profiles with blocked status
      abnormal_edit_spikes_7d: 0, // TODO: Implement from edit logs
      duplicate_contact_detected_7d: 0, // TODO: Implement from contact analysis
    },
  };
}

