import "server-only";

import { createClient } from "@/utils/supabase/server";
import type { ListingTeaserV17, SearchFiltersV17 } from "./types";

const DEBUG_LISTINGS = process.env.NEXT_PUBLIC_DEBUG_LISTINGS === "1";

// Re-export types for convenience
export type { ListingTeaserV17, SearchFiltersV17 };

// Raw row type from public.listings
type ListingRow = {
  id: string;
  title: string;
  asset_type: string | null;
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
};

/**
 * Maps database row to ListingTeaserV17
 */
function mapListingRow(row: ListingRow): ListingTeaserV17 {
  return {
    id: row.id,
    title: row.title,
    asset_type: row.asset_type === "operational" || row.asset_type === "digital" 
      ? row.asset_type 
      : null,
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
 * Get featured listings from public.listings (SERVER-ONLY)
 * Source: public.listings
 * Filter: status = 'teaser'
 * Order: created_at desc
 */
export async function getFeaturedListingsV17({
  asset_type,
  limit = 12,
  category_id,
  subcategory_id,
}: {
  asset_type?: "operational" | "digital";
  limit?: number;
  category_id?: string;
  subcategory_id?: string;
}): Promise<ListingTeaserV17[]> {
  const supabase = await createClient();

  try {
    let query = supabase
      .from("listings")
      .select(
        "id, title, asset_type, category_id, subcategory_id, city, province, country, asking_price, revenue_annual, cash_flow, hero_image_url, status, created_at"
      )
      .eq("status", "teaser");

    // Filter by asset_type
    if (asset_type) {
      query = query.eq("asset_type", asset_type);
    }

    // Filter by category_id (UUID)
    if (category_id) {
      query = query.eq("category_id", category_id);
    }

    // Filter by subcategory_id (UUID)
    if (subcategory_id) {
      query = query.eq("subcategory_id", subcategory_id);
    }

    // Order by created_at desc
    query = query.order("created_at", { ascending: false }).limit(limit);

    const { data, error } = await query;

    if (error) {
      if (DEBUG_LISTINGS) {
        console.error("[getFeaturedListingsV17] Error:", error);
      }
      return [];
    }

    if (!data || data.length === 0) {
      if (DEBUG_LISTINGS) {
        console.log(
          `[getFeaturedListingsV17] Featured loaded: 0 rows (asset_type=${asset_type ?? "all"})`
        );
      }
      return [];
    }

    const result = (data as ListingRow[]).map(mapListingRow);

    if (DEBUG_LISTINGS) {
      console.log(
        `[getFeaturedListingsV17] Featured loaded: ${result.length} rows (asset_type=${asset_type ?? "all"}${category_id ? `, category_id=${category_id}` : ""}${subcategory_id ? `, subcategory_id=${subcategory_id}` : ""})`
      );
    }

    return result;
  } catch (err: any) {
    if (DEBUG_LISTINGS) {
      console.error("[getFeaturedListingsV17] Unexpected error:", err?.message || "unknown");
    }
    return [];
  }
}

/**
 * Search listings from public.listings (SERVER-ONLY)
 * Supports: asset_type, category_id, full-text search
 */
export async function searchListingsV17(
  filters: SearchFiltersV17
): Promise<ListingTeaserV17[]> {
  const supabase = await createClient();

  try {
    let query = supabase
      .from("listings")
      .select(
        "id, title, asset_type, category_id, subcategory_id, city, province, country, asking_price, revenue_annual, cash_flow, hero_image_url, status, created_at"
      )
      .in("status", ["teaser", "published"]);

    // Filter by asset_type
    if (filters.asset_type) {
      query = query.eq("asset_type", filters.asset_type);
    }

    // Filter by category_id (UUID)
    if (filters.category_id) {
      query = query.eq("category_id", filters.category_id);
    }

    // Filter by subcategory_id (UUID)
    if (filters.subcategory_id) {
      query = query.eq("subcategory_id", filters.subcategory_id);
    }

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

    return (data as ListingRow[]).map(mapListingRow);
  } catch (err: any) {
    if (DEBUG_LISTINGS) {
      console.error("[searchListingsV17] Unexpected error:", err?.message || "unknown");
    }
    return [];
  }
}

