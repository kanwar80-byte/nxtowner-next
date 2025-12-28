import { createClient } from "@/utils/supabase/server";

// Centralized public status list for all public listing reads (V17 Phase 3.1.2)
export const PUBLIC_VISIBLE_STATUSES = ["published", "live"] as const;
// Canonical facets fetch for browse (V17 Phase 3.1.1)
export async function getBrowseFacetsV16(filters) {
  const supabase = await createClient();
  let query = supabase
    .from("listings_v16")
    .select("category, asset_type, subcategory, status")
    .in("status", PUBLIC_VISIBLE_STATUSES);

  if (filters.q) {
    query = query.ilike("title", `%${filters.q}%`);
  }
  if (filters.assetType) {
    query = query.eq("asset_type", filters.assetType);
  }
  if (filters.categoryId) {
    query = query.eq("category", filters.categoryId);
  }
  if (filters.subcategoryId) {
    query = query.eq("subcategory", filters.subcategoryId);
  }

  const { data, error } = await query;
  if (error || !data) {
    console.error("Facet Fetch Error:", error);
    return {
      assetTypeCounts: {},
      categoryCounts: {},
      subcategoryCounts: {},
      total: 0,
    };
  }

  function inc(map, key) {
    if (!key) return;
    map[key] = (map[key] || 0) + 1;
  }
  const assetTypeCounts = {};
  const categoryCounts = {};
  const subcategoryCounts = {};
  for (const row of data) {
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
// Canonical public read API for listings_v16 (V17 Phase 3.1.1)

// Returns a list of listing teasers (browse/search)
export async function searchListingsV16(filters) {
  const supabase = await createClient();
  let query = supabase
    .from("listings_v16")
    .select(`
      id, title, asset_type, category, subcategory, 
      city, province, country, 
      asking_price, revenue_annual, cash_flow,
      hero_image_url, 
      status, created_at
    `)
    .in("status", PUBLIC_VISIBLE_STATUSES);

  if (filters.query) {
    query = query.ilike("title", `%${filters.query}%`);
  }
  if (filters.assetType) {
    query = query.eq("asset_type", filters.assetType);
  }
  if (filters.category) {
    query = query.eq("category", filters.category);
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
    console.error("Error searching V16 listings:", error);
    return [];
  }
  return data.map((item) => ({
    ...item,
    image_url: item.hero_image_url,
  }));
}

// Returns full detail for a single listing
export async function getListingByIdV16(id) {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("listings_v16")
    .select(`
      id,
      title,
      asking_price,
      revenue_annual,
      cash_flow,
      hero_image_url,
      city,
      province,
      country,
      status,
      category,
      subcategory,
      asset_type,
      meta_operational,
      listing_tier,
      deal_stage,
      created_at
    `)
    .eq("id", id)
    .in("status", PUBLIC_VISIBLE_STATUSES)
    .maybeSingle();

  if (error) {
    console.error("Error fetching listing V16:", error);
    return null;
  }
  if (data) {
    return {
      ...data,
      image_url: data.hero_image_url
    };
  }
  return null;
}

export async function getFeaturedListingsV16() {
  // Reuse the search function for consistency
  return searchListingsV16({});
}