// Shared types for V17 listings (used by both server and client repos)

export type AssetTypeV17 = "operational" | "digital";

// V17 Listing Teaser (minimal fields for browse/featured)
export interface ListingTeaserV17 {
  id: string;
  title: string;
  asset_type: AssetTypeV17 | null;
  category_id: string | null;
  subcategory_id: string | null;
  city: string | null;
  province: string | null;
  country: string | null;
  asking_price: number | null;
  revenue_annual: number | null;
  cash_flow: number | null;
  hero_image_url: string | null;
  status: string;
  created_at: string;
  // Optional fields for teaser UI compatibility
  price?: number | null;
  summary?: string | null;
  short_description?: string | null;
}

export type SearchFiltersV17 = {
  asset_type?: AssetTypeV17;
  query?: string;
  category_id?: string | null;
  subcategory_id?: string | null;
  min_price?: number;
  max_price?: number;
  sort?: 'newest' | 'price_low' | 'price_high';
  limit?: number;
  offset?: number;
};

