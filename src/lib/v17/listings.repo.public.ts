import { createSupabaseBrowserClient } from "@/utils/supabase/client";
import type { ListingTeaserV17, SearchFiltersV17 } from "./types";

const DEBUG_LISTINGS = process.env.NEXT_PUBLIC_DEBUG_LISTINGS === "1";

// Re-export types for convenience
export type { ListingTeaserV17, SearchFiltersV17 };

// Raw row type from listings_public_teaser_v17
// Note: View has category/subcategory (strings), not category_id/subcategory_id (UUIDs)
// We'll select what's available and map appropriately
type ListingRow = {
  id: string | null;
  title: string | null;
  asset_type: string | null;
  category: string | null; // View has category (string), not category_id
  subcategory: string | null; // View has subcategory (string), not subcategory_id
  city: string | null;
  province: string | null;
  country: string | null;
  asking_price: number | null;
  revenue_annual: number | null;
  cash_flow: number | null;
  hero_image_url: string | null;
  status: string | null;
  created_at: string | null;
};

/**
 * Maps database row to ListingTeaserV17
 * Note: View has category/subcategory (strings), so category_id/subcategory_id will be null
 * Client components should resolve category names to UUIDs if needed
 */
function mapListingRow(row: ListingRow): ListingTeaserV17 | null {
  if (!row.id || !row.title) return null;

  return {
    id: row.id,
    title: row.title,
    asset_type: (row.asset_type === "operational" || row.asset_type === "digital" || row.asset_type === "real_world")
      ? (row.asset_type === "real_world" ? "operational" : row.asset_type)
      : null,
    category_id: null, // View doesn't have category_id, only category (string)
    subcategory_id: null, // View doesn't have subcategory_id, only subcategory (string)
    city: row.city ?? null,
    province: row.province ?? null,
    country: row.country ?? null,
    asking_price: row.asking_price ?? null,
    revenue_annual: row.revenue_annual ?? null,
    cash_flow: row.cash_flow ?? null,
    hero_image_url: row.hero_image_url ?? null,
    status: row.status ?? "teaser",
    created_at: row.created_at ?? new Date().toISOString(),
  };
}

/**
 * Search listings from listings_public_teaser_v17 (CLIENT-SAFE)
 * Supports: asset_type, category_id, full-text search
 */
export async function searchListingsV17(
  filters: SearchFiltersV17
): Promise<ListingTeaserV17[]> {
  const supabase = createSupabaseBrowserClient();

  try {
    // Use listings_public_teaser_v17 view (public, client-safe)
    // Note: View has category/subcategory (strings), not category_id/subcategory_id (UUIDs)
    let query = supabase
      .from("listings_public_teaser_v17")
      .select(
        "id, title, asset_type, category, subcategory, city, province, country, asking_price, revenue_annual, cash_flow, hero_image_url, status, created_at"
      );

    // Filter by status (teaser, published)
    query = query.in("status", ["teaser", "published"]);

    // Filter by asset_type
    if (filters.asset_type) {
      query = query.eq("asset_type", filters.asset_type);
    }

    // Note: View doesn't support category_id/subcategory_id filtering directly
    // Client-side filtering by category_id would require resolving UUID to category name first
    // For now, we skip category_id/subcategory_id filtering in client repo
    // (Server repo handles this via public.listings which has category_id/subcategory_id)

    // Full-text search using ilike
    if (filters.query) {
      query = query.ilike("title", `%${filters.query}%`);
    }

    // Order by created_at desc
    query = query.order("created_at", { ascending: false });

    // Apply limit/offset
    if (filters.limit) {
      query = query.limit(filters.limit);
    }
    if (filters.offset) {
      query = query.range(filters.offset, filters.offset + (filters.limit || 20) - 1);
    }

    const { data, error } = await query;

    if (error) {
      if (DEBUG_LISTINGS) {
        console.error("[searchListingsV17] Error:", error);
      }
      return [];
    }

    if (!data) return [];

    // Map and filter out nulls
    return (data as ListingRow[])
      .map(mapListingRow)
      .filter((item): item is ListingTeaserV17 => item !== null);
  } catch (err: any) {
    if (DEBUG_LISTINGS) {
      console.error("[searchListingsV17] Unexpected error:", err?.message || "unknown");
    }
    return [];
  }
}

