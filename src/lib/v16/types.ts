// Canonical browse/search filter type for V16
// V17 RULE:
// - listings.category_id / subcategory_id are ALWAYS string | null
// - UI may hydrate category objects, but repos accept IDs only
// - Never pass category objects into repo filters
export interface BrowseFiltersV16 {
  query?: string;
  assetType?: string; // Will be canonicalized to lowercase in repo layer
  // ✅ IDs ONLY (do not accept objects)
  categoryId?: string | null; // UUID
  subcategoryId?: string | null; // UUID
  // Optional: allow code-based filtering if you use it
  category_code?: string | null;
  subcategory_code?: string | null;
  minPrice?: number;
  maxPrice?: number;
  sort?: string;
}

// V16 Canonical Asset Type (lowercase)
export type AssetTypeV16 = 'operational' | 'digital';

// Listing Teaser (used by browse cards/grids)
export interface ListingTeaserV16 {
  id: string;
  title: string;
  asset_type: AssetTypeV16; // Canonical lowercase
  category_id: string | null; // UUID reference to tax_categories
  subcategory_id: string | null; // UUID reference to tax_subcategories
  city: string | null;
  province: string | null;
  country: string | null;
  asking_price: number | null;
  revenue_annual: number | null;
  cash_flow: number | null;
  hero_image_url: string | null;
  heroImageUrl: string | null; // camelCase alias
  image_url: string | null; // Legacy alias
  status: string | null;
  created_at: string | null;
}

// Listing Detail (full detail used by /listing/[id])
export interface ListingDetailV16 extends ListingTeaserV16 {
  description: string | null;
  deal_structure: string | null;
  business_status: string | null;
  images: string[]; // Gallery array
  meta: Record<string, unknown> | null; // Full meta object
  currency: string | null;
  listing_tier: string | null;
  deal_stage: string | null;
  // Additional fields that may exist in DB
  [key: string]: unknown;
}

// Legacy types (kept for backward compatibility during migration)
export type AssetType = "Operational" | "Digital";
export type ListingStatus = "draft" | "published" | "live" | "archived";

export interface ListingCard {
  id: string;
  title: string;
  assetType: AssetType;
  categoryId: string;
  subcategoryId: string;
  categoryLabel: string;
  subcategoryLabel?: string;
  city?: string;
  province?: string;
  country?: string;
  askingPrice: number;
  revenueAnnual?: number;
  cashFlowAnnual?: number;
  ebitdaAnnual?: number;
  /** Canonical image URL field (camelCase). Use this for new code. */
  heroImageUrl: string;
  /** @deprecated Use heroImageUrl instead. This alias is provided for backward compatibility and will be removed in a future version. */
  hero_image_url?: string;
  galleryUrls: string[];
  verificationLevel?: string;
  listingTier?: string;
  status?: ListingStatus;
  tags: string[];
  specs: Record<string, unknown>;
}

export interface ListingDetail extends ListingCard {
  postalCode?: string;
  dealStructure?: string;
  businessStatus?: string;
  description?: string;
}
