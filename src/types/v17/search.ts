/**
 * V17 Canonical Search & Filter Types
 * Single source of truth for search/filter contracts
 */

export type ListingType = 'operational' | 'digital';

export type VerificationStatus = 'unverified' | 'pending' | 'verified';

export type FeaturedLevel = 'none' | 'boost' | 'premium';

export type SortOption =
  | 'relevance'
  | 'newest'
  | 'price_low'
  | 'price_high'
  | 'revenue_high'
  | 'cashflow_high';

/**
 * Canonical Filter Object (wire format)
 * Used by UI browse pages, API endpoints, Supabase queries, AI extraction
 */
export interface SearchFiltersV17 {
  listing_type?: ListingType;

  // Taxonomy (canonical only)
  category?: string;
  subcategory?: string;

  // Price & financials (all numbers are annual unless noted)
  min_price?: number;
  max_price?: number;
  min_revenue?: number;
  max_revenue?: number;
  min_ebitda?: number;
  max_ebitda?: number;
  min_cashflow?: number; // owner_cashflow / SDE
  max_cashflow?: number;

  // Location
  country?: 'Canada';
  province?: string;
  city?: string;
  radius_km?: number;

  // Verification / gating
  verification_status?: VerificationStatus;
  ai_verified?: boolean; // derived; can be filtered
  nda_required?: boolean;

  // Asset characteristics
  property_included?: boolean; // operational only
  rent_income_min?: number;

  // Operational extensions
  fuel_volume_min_lpy?: number;
  fuel_margin_min_cents?: number;
  car_wash_present?: boolean;
  ev_charging_present?: boolean;

  // Digital extensions
  min_mrr?: number;
  max_mrr?: number;
  min_arr?: number;
  max_arr?: number;
  max_churn_pct?: number;
  min_gross_margin_pct?: number;
  traffic_min_monthly?: number;

  // Meta
  sort?: SortOption;
  page?: number; // 1-based
  page_size?: number; // default 24, max 60
}

/**
 * Canonical Result Shape (teaser)
 * Used for browse grids, search results, featured sections
 */
export interface ListingTeaserV17 {
  id: string;
  listing_type: ListingType;
  category: string;
  subcategory: string;
  title: string;
  teaser: string;
  asking_price: number | null;
  location_city: string | null;
  location_province: string | null;
  verification_status: VerificationStatus;
  featured_level: FeaturedLevel;
  rank_score: number;
  created_at: string;
  updated_at: string;

  // Gated previews (may be null depending on access)
  annual_revenue?: number | null;
  annual_ebitda?: number | null;
  owner_cashflow?: number | null;

  // Image URLs (optional, for card rendering)
  hero_image_url?: string | null;
  image_url?: string | null;
  cover_image_url?: string | null;
}

