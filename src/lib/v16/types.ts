// Canonical browse/search filter type for V16
export interface BrowseFiltersV16 {
  query?: string;
  assetType?: string;
  category?: string; // legacy string code
  subcategory?: string; // legacy string code
  categoryId?: string; // UUID
  subcategoryId?: string; // UUID
  minPrice?: number;
  maxPrice?: number;
  sort?: string;
}
// Domain types for V16 adapter

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
  heroImageUrl: string;
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
