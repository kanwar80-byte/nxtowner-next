import { createClient } from "@/utils/supabase/server";
import { mapListingDetailV16, mapListingTeaserV16 } from "./mappers";
import type { BrowseFiltersV16, ListingDetailV16, ListingTeaserV16 } from "./types";

const DEBUG_LISTINGS = process.env.NEXT_PUBLIC_DEBUG_LISTINGS === "1";

// Centralized public status list for all public listing reads (V17 Phase 3.1.2)
export const PUBLIC_VISIBLE_STATUSES = ["published", "teaser"] as const;

// Canonical facets fetch for browse (V17 Phase 3.1.1)
export async function getBrowseFacetsV16(filters: BrowseFiltersV16): Promise<any> {
  const supabase = await createClient();
  let query = supabase
    .from("listings_public_teaser")
    .select("category_id as category, asset_type, subcategory_id as subcategory, status");

  if (filters.query) {
    query = query.ilike("title", `%${filters.query}%`);
  }
  // Safety net: normalize assetType to lowercase (prevents drift from UI sending "Operational")
  const assetType = filters.assetType?.toLowerCase();
  if (assetType === "operational" || assetType === "digital") {
    query = query.eq("asset_type", assetType);
  }
  if (filters.categoryId) {
    query = query.eq("category_id", filters.categoryId);
  }
  if (filters.subcategoryId) {
    query = query.eq("subcategory_id", filters.subcategoryId);
  }

  const { data, error } = await query;
  if (error || !data) {
    if (DEBUG_LISTINGS) {
       
      console.error("Facet Fetch Error:", error);
    }
    return {
      assetTypeCounts: {},
      categoryCounts: {},
      subcategoryCounts: {},
      total: 0,
    };
  }

  function inc(map: Record<string, number>, key: string | null | undefined): void {
    if (!key) return;
    map[key] = (map[key] || 0) + 1;
  }
  const assetTypeCounts = {};
  const categoryCounts = {};
  const subcategoryCounts = {};
  for (const row of data as any[]) {
    inc(assetTypeCounts, row.asset_type);
    inc(categoryCounts, row.category);
    inc(subcategoryCounts, row.subcategory);
  }
  return {
    assetTypeCounts,
    categoryCounts,
    subcategoryCounts,
    total: data.length,
  };
}

// Canonical public read API for listings_public_teaser (V17 Phase 3.1.1)

// Returns a list of listing teasers (browse/search)
export async function searchListingsV16(filters: BrowseFiltersV16): Promise<ListingTeaserV16[]> {
  const supabase = await createClient();
  let query = supabase
    .from("listings_public_teaser")
    .select(`
      id, title, asset_type,
      category_id as category, subcategory_id as subcategory,
      city, province, country,
      asking_price, revenue_annual,
      null::numeric as cash_flow,
      null::text as hero_image_url,
      status, created_at
    `);

  if (filters.query) {
    query = query.ilike("title", `%${filters.query}%`);
  }
  // Safety net: normalize assetType to lowercase (prevents drift from UI sending "Operational")
  const assetType = filters.assetType?.toLowerCase();
  if (assetType === "operational" || assetType === "digital") {
    query = query.eq("asset_type", assetType);
  }
  // Prefer UUID-based filtering, fallback to string-based for backward compatibility
  if (filters.categoryId) {
    query = query.eq("category_id", filters.categoryId);
  } else if (filters.category) {
    query = query.eq("category_id", filters.category);
  }
  if (filters.subcategoryId) {
    query = query.eq("subcategory_id", filters.subcategoryId);
  } else if (filters.subcategory) {
    query = query.eq("subcategory_id", filters.subcategory);
  }
  if (filters.minPrice) {
    query = query.gte("asking_price", filters.minPrice);
  }
  if (filters.maxPrice) {
    query = query.lte("asking_price", filters.maxPrice);
  }
  if (filters.sort === "price_asc") {
    query = query.order("asking_price", { ascending: true });
  } else if (filters.sort === "price_desc") {
    query = query.order("asking_price", { ascending: false });
  } else {
    query = query.order("created_at", { ascending: false });
  }

  const { data, error } = await query;
  if (error) {
    if (DEBUG_LISTINGS) {
       
      console.error("Error searching V16 listings:", error);
    }
    return [];
  }
  
  // Use canonical mapper to ensure consistent shape
  return (data as any[]).map(mapListingTeaserV16);
}

// Returns full detail for a single listing
export async function getListingByIdV16(id: string): Promise<ListingDetailV16 | null> {
  const supabase = await createClient();

  // 1. RAW FETCH - No filters, no status checks (permissive for deal-room access)
  const { data, error } = await supabase
    .from('listings')
    .select('*') // Select everything
    .eq('id', id)
    .maybeSingle(); // Use maybeSingle to avoid 406 errors

  if (error) {
    return null;
  }

  if (!data) {
    return null;
  }
  
  // Use canonical mapper to ensure consistent shape
  return mapListingDetailV16(data);
}

export async function getFeaturedListingsV16(): Promise<ListingTeaserV16[]> {
  const supabase = await createClient();
  
  // 1. Try to find actual "featured" items if the column exists
  // We use .maybeSingle() logic or just sort by price to be safe
  const { data, error } = await supabase
    .from('listings_public_teaser') // Public view handles status filtering
    .select('*')
    //.eq('is_featured', true) // <--- COMMENT THIS OUT (Likely the crasher)
    .order('asking_price', { ascending: false }) // Show expensive/premium items first
    .limit(3);

  if (error) {
    if (DEBUG_LISTINGS) {
       
      console.error("Supabase Error in getFeaturedListingsV16:", error.message);
    }
    return [];
  }

  if (!data || data.length === 0) {
    return [];
  }

  // Use canonical mapper to ensure consistent shape
  return data.map(mapListingTeaserV16);
}
