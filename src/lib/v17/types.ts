// Shared types for V17 listings (used by both server and client repos)

// V17 Listing Teaser (minimal fields for browse/featured)
export interface ListingTeaserV17 {
  id: string;
  title: string;
  asset_type: "operational" | "digital" | null;
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
}

// V17 Search Filters
// V17 RULE: category_id / subcategory_id are ALWAYS string | null
// UI may hydrate category objects, but repos accept IDs only
// Never pass category objects into repo filters
export interface SearchFiltersV17 {
  asset_type?: "operational" | "digital";
  country?: string | null;
  province?: string | null;
  city?: string | null;
  is_remote?: boolean;
  min_price?: number;
  max_price?: number;
  min_revenue?: number;
  max_revenue?: number;
  // ✅ IDs ONLY (do not accept objects)
  category_id?: string | null;
  subcategory_id?: string | null;
  // Optional: allow code-based filtering if you use it
  category_code?: string | null;
  subcategory_code?: string | null;
  query?: string; // Full-text search
  limit?: number;
  offset?: number;
  sort?: string;
}

