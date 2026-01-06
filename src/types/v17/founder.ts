/**
 * V17 Canonical Founder Dashboard Metrics Types
 */

export type MetricsWindow = '7d' | '30d';

/**
 * Marketplace Health Metrics
 */
export interface MarketplaceHealthMetrics {
  total_listings: number;
  active_listings_7d: number; // updated_at within 7d
  new_listings_7d: number;
  verified_listings_pct: number;
  nda_required_pct: number;
  avg_rank_score: number;
}

/**
 * Funnel Metrics
 */
export interface FunnelMetrics {
  visits_7d: number;
  listing_views_7d: number;
  lead_submits_7d: number;
  nda_requests_7d: number;
  nda_signed_7d: number;
  deal_room_opens_7d: number;
}

/**
 * Revenue & Monetization Metrics
 */
export interface RevenueMetrics {
  upgrades_sold_7d: number; // boost/premium
  subscription_signups_7d: number; // buyer/seller/partner
  mrr_estimate: number;
  arpa_estimate: number; // Average Revenue Per Account
}

/**
 * Risk / Fraud Metrics
 */
export interface RiskMetrics {
  flagged_listings_7d: number;
  blocked_users_7d: number;
  abnormal_edit_spikes_7d: number;
  duplicate_contact_detected_7d: number;
}

/**
 * Canonical Founder Metrics Output
 */
export interface FounderMetricsV17 {
  window: MetricsWindow;
  marketplace: MarketplaceHealthMetrics;
  funnel: FunnelMetrics;
  revenue: RevenueMetrics;
  risk: RiskMetrics;
}


