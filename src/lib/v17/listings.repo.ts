import "server-only";

import { createSupabaseServerClient } from "@/utils/supabase/server";
import { normalizeId } from "@/utils/normalizeId";
import type { ListingTeaserV17, SearchFiltersV17 } from "@/lib/v17/types";

// Re-export types for convenience
export type { SearchFiltersV17 };

// Raw row type from listings_public_teaser_v17 view
// Note: View may have category/subcategory as strings, or category_id/subcategory_id as UUIDs
// We'll handle both cases
type ListingRow = {
  id: string;
  title: string;
  asset_type: string | null;
  category_id?: string | null;
  subcategory_id?: string | null;
  category?: string | null; // View might have category as string
  subcategory?: string | null; // View might have subcategory as string
  city: string | null;
  province: string | null;
  country: string | null;
  asking_price: number | null;
  revenue_annual: number | null;
  cash_flow: number | null;
  hero_image_url: string | null;
  status: string;
  created_at: string;
};

/**
 * Maps database row to ListingTeaserV17
 */
function mapListingRow(row: ListingRow): ListingTeaserV17 {
  // Map asset_type: accept 'operational', 'real_world', or 'digital' from DB, output 'operational' or 'digital'
  const assetType = row.asset_type === "digital"
    ? "digital"
    : (row.asset_type === "operational" || row.asset_type === "real_world")
      ? "operational"
      : null;

  return {
    id: row.id,
    title: row.title,
    asset_type: assetType as "operational" | "digital" | null,
    category_id: row.category_id ?? null,
    subcategory_id: row.subcategory_id ?? null,
    city: row.city ?? null,
    province: row.province ?? null,
    country: row.country ?? null,
    asking_price: row.asking_price ?? null,
    revenue_annual: row.revenue_annual ?? null,
    cash_flow: row.cash_flow ?? null,
    hero_image_url: row.hero_image_url ?? null,
    status: row.status,
    created_at: row.created_at,
  };
}

/**
 * Get featured listings from listings_public_teaser_v17 (SERVER-ONLY)
 * Source: listings_public_teaser_v17 view
 * Filter: status = 'teaser'
 * Order: created_at desc
 */
export async function getFeaturedListingsV17({
  asset_type,
  limit = 12,
  category_id,
  subcategory_id,
}: {
  asset_type?: "operational" | "digital" | "real_world"; // Accept both for backward compatibility
  limit?: number;
  category_id?: string;
  subcategory_id?: string;
}): Promise<ListingTeaserV17[]> {
  const supabase = await createSupabaseServerClient();

  // Note: Using (supabase as any) as a temporary bridge until Supabase types are regenerated
  let query = (supabase as any)
    .from("listings_public_teaser_v17")
    .select(
      "id, title, asset_type, category_id, subcategory_id, city, province, country, asking_price, revenue_annual, cash_flow, hero_image_url, status, created_at"
    )
    .eq("status", "teaser");

  // Filter by asset_type (accept "operational" or "real_world", query DB with either)
  if (asset_type) {
    // Database may use "real_world" or "operational", try both
    const dbAssetType = asset_type === "operational" ? "real_world" : asset_type;
    query = query.eq("asset_type", dbAssetType);
  }

  // Filter by category_id (UUID) if available in view
  if (category_id) {
    query = query.eq("category_id", category_id);
  }

  // Filter by subcategory_id (UUID) if available in view
  if (subcategory_id) {
    query = query.eq("subcategory_id", subcategory_id);
  }

  // Order by created_at desc
  query = query.order("created_at", { ascending: false }).limit(limit);

  const { data, error } = await query;

  if (error) throw error;
  if (!data) return [];

  return (data as ListingRow[]).map(mapListingRow);
}

/**
 * Search listings from listings_public_teaser_v17 (SERVER-ONLY)
 * Supports: asset_type, category_id, subcategory_id, price range, sorting, pagination
 * Returns paginated result with items, total, page, page_size
 */
export async function searchListingsV17(
  filters: SearchFiltersV17
): Promise<{
  items: ListingTeaserV17[];
  total: number;
  page: number;
  page_size: number;
}> {
  const supabase = await createSupabaseServerClient();

  // Normalize category/subcategory IDs defensively
  const category_id = normalizeId(filters.category_id);
  const subcategory_id = normalizeId(filters.subcategory_id);

  // Build base query from V17 teaser view
  // Note: Using (supabase as any) as a temporary bridge until Supabase types are regenerated
  let query = (supabase as any)
    .from("listings_public_teaser_v17")
    .select(
      "id, title, asset_type, category_id, subcategory_id, city, province, country, asking_price, revenue_annual, cash_flow, hero_image_url, status, created_at",
      { count: 'exact' }
    )
    .in("status", ["teaser", "published"]);

  // Filter by asset_type (accept "operational" or "real_world", query DB with "real_world")
  if (filters.asset_type) {
    const dbAssetType = filters.asset_type === "operational" ? "real_world" : filters.asset_type;
    query = query.eq("asset_type", dbAssetType);
  }

  // Filter by category_id (UUID) if available in view
  if (category_id) {
    query = query.eq("category_id", category_id);
  }

  // Filter by subcategory_id (UUID) if available in view
  if (subcategory_id) {
    query = query.eq("subcategory_id", subcategory_id);
  }

  // Filter by price range
  if (filters.min_price !== undefined) {
    query = query.gte("asking_price", filters.min_price);
  }
  if (filters.max_price !== undefined) {
    query = query.lte("asking_price", filters.max_price);
  }

  // Full-text search using ilike
  if (filters.query) {
    query = query.ilike("title", `%${filters.query}%`);
  }

  // Calculate pagination
  const page_size = filters.limit || 20;
  const page = filters.offset !== undefined && filters.limit 
    ? Math.floor(filters.offset / filters.limit) + 1 
    : 1;
  const offset = filters.offset !== undefined ? filters.offset : (page - 1) * page_size;

  // Apply sorting
  if (filters.sort === 'price_low') {
    query = query.order("asking_price", { ascending: true, nullsFirst: false });
  } else if (filters.sort === 'price_high') {
    query = query.order("asking_price", { ascending: false, nullsFirst: false });
  } else {
    // Default: newest (created_at desc)
    query = query.order("created_at", { ascending: false });
  }

  // Apply pagination (must be after ordering)
  query = query.range(offset, offset + page_size - 1);

  const { data, error, count } = await query;

  if (error) throw error;
  if (!data) {
    return {
      items: [],
      total: 0,
      page,
      page_size,
    };
  }

  // Map results and filter out nulls
  const items = (data as ListingRow[])
    .map(mapListingRow)
    .filter((item): item is ListingTeaserV17 => item !== null && item.id !== undefined);

  return {
    items,
    total: count || items.length,
    page,
    page_size,
  };
}
