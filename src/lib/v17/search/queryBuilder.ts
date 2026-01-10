import "server-only";

import type { SearchFiltersV17, SortOption } from '@/types/v17/search';

/**
 * V17 Canonical Query Builder
 * Converts SearchFiltersV17 into Supabase query constraints
 * 
 * NOTE: Currently unused - searchService wraps V16 repo (searchListingsV16) which handles
 * query building. This module is kept for future direct-table querying when we migrate
 * away from the V16 wrapper pattern. Post-filtering in searchService is intentional
 * to maintain consistency with V16 repo semantics.
 */

/**
 * Apply search filters to Supabase query
 * Validates listing_type, category, subcategory before applying
 * 
 * Temporary typing bridge; queryBuilder currently unused; will be tightened when V17 direct-table querying is enabled.
 */
export function applySearchFilters(
  query: any,
  filters: SearchFiltersV17
): any {
  let q = query;

  // Listing type filter
  if (filters.listing_type === 'operational') {
    q = q.or('asset_type.eq.operational,asset_type.is.null') as typeof q;
  } else if (filters.listing_type === 'digital') {
    q = q.eq('asset_type', 'digital') as typeof q;
  }

  // Note: category/subcategory are strings in SearchFiltersV17
  // They need to be resolved to UUIDs before querying (handled in searchService)

  // Price filters
  if (filters.min_price !== undefined) {
    q = q.gte('asking_price', filters.min_price) as typeof q;
  }
  if (filters.max_price !== undefined) {
    q = q.lte('asking_price', filters.max_price) as typeof q;
  }

  // Revenue filters
  if (filters.min_revenue !== undefined) {
    q = q.gte('revenue_annual', filters.min_revenue) as typeof q;
  }
  if (filters.max_revenue !== undefined) {
    q = q.lte('revenue_annual', filters.max_revenue) as typeof q;
  }

  // Location filters (country/province/city equals)
  if (filters.country) {
    q = q.eq('country', filters.country) as typeof q;
  }
  if (filters.province) {
    q = q.eq('province', filters.province) as typeof q;
  }
  if (filters.city) {
    q = q.eq('city', filters.city) as typeof q;
  }
  // Note: radius_km not supported yet (requires PostGIS)

  // Verification filters
  if (filters.verification_status) {
    // Map to status field if available, otherwise skip
    // Note: verification_status may not exist in all tables
    // This is a safe fallback - only apply if column exists
  }

  // Operational-only filters (apply only when listing_type='operational')
  if (filters.listing_type === 'operational') {
    // Note: These fields may not exist in listings_public_teaser
    // Apply defensively or skip if column doesn't exist
    // fuel_volume_min_lpy, fuel_margin_min_cents, car_wash_present, ev_charging_present
  }

  // Digital-only filters (apply only when listing_type='digital')
  if (filters.listing_type === 'digital') {
    // Note: These fields may not exist in listings_public_teaser
    // min_mrr, max_mrr, min_arr, max_arr, max_churn_pct, min_gross_margin_pct, traffic_min_monthly
  }

  return q;
}

/**
 * Apply sorting to Supabase query
 * Canonical sorting rules:
 * - relevance = rank_score DESC, updated_at DESC
 * - newest = created_at DESC
 * - price_low/high = asking_price ASC/DESC
 * - revenue_high = annual_revenue DESC
 * - cashflow_high = owner_cashflow DESC
 * 
 * Temporary typing bridge; queryBuilder currently unused; will be tightened when V17 direct-table querying is enabled.
 */
export function applySorting(
  query: any,
  sort?: SortOption
): any {
  let q = query;

  if (!sort || sort === 'relevance') {
    // Default: rank_score DESC, updated_at DESC
    // Note: rank_score may not exist, fallback to updated_at DESC
    q = q.order('updated_at', { ascending: false }) as typeof q;
  } else if (sort === 'newest') {
    q = q.order('created_at', { ascending: false }) as typeof q;
  } else if (sort === 'price_low') {
    q = q.order('asking_price', { ascending: true }) as typeof q;
  } else if (sort === 'price_high') {
    q = q.order('asking_price', { ascending: false }) as typeof q;
  } else if (sort === 'revenue_high') {
    q = q.order('revenue_annual', { ascending: false }) as typeof q;
  } else if (sort === 'cashflow_high') {
    q = q.order('cash_flow', { ascending: false }) as typeof q;
  }

  return q;
}

/**
 * Apply pagination to Supabase query
 * 
 * Temporary typing bridge; queryBuilder currently unused; will be tightened when V17 direct-table querying is enabled.
 */
export function applyPaging(
  query: any,
  page?: number,
  page_size?: number
): any {
  let q = query;

  const pageNum = page && page > 0 ? page : 1;
  const pageSize = page_size && page_size > 0 && page_size <= 60 ? page_size : 24;
  const offset = (pageNum - 1) * pageSize;

  q = q.range(offset, offset + pageSize - 1) as typeof q;

  return q;
}

