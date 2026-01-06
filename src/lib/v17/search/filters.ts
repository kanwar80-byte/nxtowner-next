import type { SearchFiltersV17, ListingType, SortOption } from '@/types/v17/search';

/**
 * V17 Canonical Filter Sanitization & Validation
 * Ensures all filters conform to SearchFiltersV17 contract
 */

// Canonical category list (placeholder - should be loaded from taxonomy table)
export const CANONICAL_CATEGORIES = new Set([
  'Gas Stations',
  'Car Washes',
  'Franchise Resales',
  'Convenience Stores',
  'SaaS',
  'E-Commerce',
  'AI Tools',
  'Content Sites',
  // Add more as taxonomy is finalized
]);

// Canonical subcategories by category (placeholder)
export const CANONICAL_SUBCATEGORIES: Record<string, Set<string>> = {
  'Gas Stations': new Set(['Gas Station', 'Gas Station + Convenience', 'Truck Stops']),
  'Car Washes': new Set(['Tunnel Car Wash', 'Self-Serve', 'Automatic']),
  'SaaS': new Set(['B2B SaaS', 'Micro-SaaS', 'AI Tools']),
  'E-Commerce': new Set(['Shopify / DTC', 'Amazon FBA', 'Dropshipping']),
  // Add more as taxonomy is finalized
};

/**
 * Sanitize and coerce input to SearchFiltersV17
 * Drops unknown keys, validates types, normalizes values
 */
export function sanitizeFilters(input: unknown): SearchFiltersV17 {
  if (!input || typeof input !== 'object') {
    return {};
  }

  const raw = input as Record<string, unknown>;
  const filters: SearchFiltersV17 = {};

  // Listing type
  if (raw.listing_type === 'operational' || raw.listing_type === 'digital') {
    filters.listing_type = raw.listing_type;
  }

  // Taxonomy (validated against canonical list)
  // Normalize: trim whitespace, but keep case-sensitive for now (canonical list is case-sensitive)
  if (typeof raw.category === 'string') {
    const normalizedCategory = raw.category.trim();
    if (normalizedCategory && CANONICAL_CATEGORIES.has(normalizedCategory)) {
      filters.category = normalizedCategory;
    }
    // Unknown category is dropped (not added to filters)
  }
  if (typeof raw.subcategory === 'string' && filters.category) {
    const normalizedSubcategory = raw.subcategory.trim();
    if (normalizedSubcategory) {
      const validSubcats = CANONICAL_SUBCATEGORIES[filters.category];
      if (validSubcats && validSubcats.has(normalizedSubcategory)) {
        filters.subcategory = normalizedSubcategory;
      }
      // Invalid subcategory is dropped (not added to filters)
    }
  }

  // Price & financials (normalize numbers)
  filters.min_price = normalizeNumber(raw.min_price);
  filters.max_price = normalizeNumber(raw.max_price);
  filters.min_revenue = normalizeNumber(raw.min_revenue);
  filters.max_revenue = normalizeNumber(raw.max_revenue);
  filters.min_ebitda = normalizeNumber(raw.min_ebitda);
  filters.max_ebitda = normalizeNumber(raw.max_ebitda);
  filters.min_cashflow = normalizeNumber(raw.min_cashflow);
  filters.max_cashflow = normalizeNumber(raw.max_cashflow);

  // Location
  if (raw.country === 'Canada') {
    filters.country = 'Canada';
  }
  if (typeof raw.province === 'string' && raw.province.trim()) {
    filters.province = raw.province.trim();
  }
  if (typeof raw.city === 'string' && raw.city.trim()) {
    filters.city = raw.city.trim();
  }
  filters.radius_km = normalizeNumber(raw.radius_km);

  // Verification / gating
  if (
    raw.verification_status === 'unverified' ||
    raw.verification_status === 'pending' ||
    raw.verification_status === 'verified'
  ) {
    filters.verification_status = raw.verification_status;
  }
  if (typeof raw.ai_verified === 'boolean') {
    filters.ai_verified = raw.ai_verified;
  }
  if (typeof raw.nda_required === 'boolean') {
    filters.nda_required = raw.nda_required;
  }

  // Asset characteristics
  if (typeof raw.property_included === 'boolean') {
    filters.property_included = raw.property_included;
  }
  filters.rent_income_min = normalizeNumber(raw.rent_income_min);

  // Operational extensions
  filters.fuel_volume_min_lpy = normalizeNumber(raw.fuel_volume_min_lpy);
  filters.fuel_margin_min_cents = normalizeNumber(raw.fuel_margin_min_cents);
  if (typeof raw.car_wash_present === 'boolean') {
    filters.car_wash_present = raw.car_wash_present;
  }
  if (typeof raw.ev_charging_present === 'boolean') {
    filters.ev_charging_present = raw.ev_charging_present;
  }

  // Digital extensions
  filters.min_mrr = normalizeNumber(raw.min_mrr);
  filters.max_mrr = normalizeNumber(raw.max_mrr);
  filters.min_arr = normalizeNumber(raw.min_arr);
  filters.max_arr = normalizeNumber(raw.max_arr);
  filters.max_churn_pct = normalizeNumber(raw.max_churn_pct);
  filters.min_gross_margin_pct = normalizeNumber(raw.min_gross_margin_pct);
  filters.traffic_min_monthly = normalizeNumber(raw.traffic_min_monthly);

  // Meta
  const validSorts: SortOption[] = [
    'relevance',
    'newest',
    'price_low',
    'price_high',
    'revenue_high',
    'cashflow_high',
  ];
  if (typeof raw.sort === 'string' && validSorts.includes(raw.sort as SortOption)) {
    filters.sort = raw.sort as SortOption;
  }
  // Page defaults to 1 if invalid/undefined
  filters.page = normalizePositiveInteger(raw.page, 1) ?? 1;
  // Page size defaults to 24 if invalid/undefined, max 60
  filters.page_size = normalizePositiveInteger(raw.page_size, 1, 60) ?? 24;

  // Remove undefined values
  return Object.fromEntries(
    Object.entries(filters).filter(([_, v]) => v !== undefined)
  ) as SearchFiltersV17;
}

/**
 * Validate taxonomy fields against canonical list
 * Returns sanitized filters with invalid category/subcategory dropped
 * 
 * IMPORTANT: Unknown categories MUST be dropped to prevent silent "no results"
 * This function is a safety net in case sanitizeFilters didn't catch everything
 */
export function validateTaxonomy(filters: SearchFiltersV17): SearchFiltersV17 {
  const validated = { ...filters };

  // Normalize and validate category
  if (validated.category) {
    const normalized = typeof validated.category === 'string' 
      ? validated.category.trim() 
      : String(validated.category).trim();
    
    if (!normalized || !CANONICAL_CATEGORIES.has(normalized)) {
      // Drop unknown category (critical: prevents silent "no results")
      delete validated.category;
      // Also drop subcategory if category is invalid
      delete validated.subcategory;
    } else {
      // Update to normalized value
      validated.category = normalized;
    }
  }

  // Validate subcategory (only if category is valid)
  if (validated.subcategory) {
    if (!validated.category) {
      // Subcategory without category is invalid - drop it
      delete validated.subcategory;
    } else {
      const normalized = typeof validated.subcategory === 'string'
        ? validated.subcategory.trim()
        : String(validated.subcategory).trim();
      
      const validSubcats = CANONICAL_SUBCATEGORIES[validated.category];
      if (!normalized || !validSubcats || !validSubcats.has(normalized)) {
        // Drop invalid subcategory
        delete validated.subcategory;
      } else {
        // Update to normalized value
        validated.subcategory = normalized;
      }
    }
  }

  return validated;
}

/**
 * Normalize number input (string or number) to number or undefined
 * Handles currency symbols ($) and commas (123,000 -> 123000)
 * Rejects NaN, Infinity, -Infinity, negative numbers
 * Returns undefined for invalid inputs (NOT 0)
 */
function normalizeNumber(value: unknown): number | undefined {
  if (typeof value === 'number') {
    // Reject NaN, Infinity, -Infinity, negative numbers
    if (!Number.isFinite(value) || value < 0) {
      return undefined;
    }
    return value;
  }
  if (typeof value === 'string') {
    // Remove currency symbols, commas, and whitespace
    const cleaned = value.replace(/[$,\s]/g, '');
    const parsed = Number.parseFloat(cleaned);
    // Reject NaN, Infinity, -Infinity, negative numbers
    if (!Number.isFinite(parsed) || parsed < 0) {
      return undefined;
    }
    return parsed;
  }
  return undefined;
}

/**
 * Normalize positive integer with min/max bounds
 * Returns undefined for invalid inputs (NOT 0)
 * Clamps to max if provided, rejects values below min
 */
function normalizePositiveInteger(
  value: unknown,
  min: number,
  max?: number
): number | undefined {
  const num = normalizeNumber(value);
  if (num === undefined) return undefined;
  const int = Math.floor(num);
  // Reject values below minimum (no 0, no negative)
  if (int < min) return undefined;
  // Clamp to maximum if provided (no 5000 if max is 60)
  if (max !== undefined && int > max) return max;
  return int;
}

