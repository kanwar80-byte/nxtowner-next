import { createClient } from "@/utils/supabase/server";
import { normalizeId } from "@/utils/normalizeId";
import { mapListingDetailV16, mapListingTeaserV16 } from "./mappers";
import type { BrowseFiltersV16, ListingDetailV16, ListingTeaserV16 } from "./types";

const DEBUG_LISTINGS = process.env.NEXT_PUBLIC_DEBUG_LISTINGS === "1";

// Centralized public status list for all public listing reads (V17 Phase 3.1.2)
export const PUBLIC_VISIBLE_STATUSES = ["published", "teaser"] as const;

// Normalize asset type input to canonical "operational" | "digital" | undefined
export function normalizeAssetType(input: unknown): "operational" | "digital" | undefined {
  if (!input) return undefined;
  const s = String(input).trim().toLowerCase();
  if (s === "operational" || s === "operational assets" || s === "ops") return "operational";
  if (s === "digital" || s === "digital assets" || s === "saas") return "digital";
  return undefined;
}

type PublicTeaserRow = {
  id: string;
  title: string | null;
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
  status: string | null;
  created_at: string | null;
};

// ---------- Facets (V17 public view) ----------
export async function getBrowseFacetsV16(filters: BrowseFiltersV16): Promise<any> {
  const supabase = await createClient();

  let query = supabase
    .from("listings_public_teaser")
    .select("asset_type, category_id, subcategory_id, status");

  if (filters.query) {
    query = query.ilike("title", `%${filters.query}%`);
  }

  // Normalize asset type (handle "Operational Assets", "type" field, etc.)
  const assetType = normalizeAssetType(filters.assetType ?? (filters as any).type);
  
  // Apply filter: strict match (no NULL values allowed)
  if (assetType === "operational") {
    query = query.eq("asset_type", "operational");
  } else if (assetType === "digital") {
    query = query.eq("asset_type", "digital");
  }

  // Normalize category/subcategory IDs defensively (belt + suspenders)
  // Accept both categoryId and legacy category/subcategory for backward compatibility
  const categoryId = normalizeId((filters as any).categoryId ?? (filters as any).category);
  const subcategoryId = normalizeId((filters as any).subcategoryId ?? (filters as any).subcategory);

  // Only use normalized IDs in query
  if (categoryId) query = query.eq("category_id", categoryId);
  if (subcategoryId) query = query.eq("subcategory_id", subcategoryId);

  const { data, error } = await query;

  if (error || !data) {
    if (DEBUG_LISTINGS) console.error("Facet Fetch Error:", error);
    return { assetTypeCounts: {}, categoryCounts: {}, subcategoryCounts: {}, total: 0 };
  }

  const inc = (map: Record<string, number>, key: string | null | undefined) => {
    if (!key) return;
    map[key] = (map[key] || 0) + 1;
  };

  const assetTypeCounts: Record<string, number> = {};
  const categoryCounts: Record<string, number> = {};
  const subcategoryCounts: Record<string, number> = {};

  for (const row of data as any[]) {
    inc(assetTypeCounts, row.asset_type);
    inc(categoryCounts, row.category_id);
    inc(subcategoryCounts, row.subcategory_id);
  }

  return { assetTypeCounts, categoryCounts, subcategoryCounts, total: data.length };
}

// ---------- Browse/Search (V17 public view) ----------
export async function searchListingsV16(filters: BrowseFiltersV16): Promise<ListingTeaserV16[]> {
  const supabase = await createClient();

  let query = supabase.from("listings_public_teaser").select(
    [
      "id",
      "title",
      "asset_type",
      "category_id",
      "subcategory_id",
      "city",
      "province",
      "country",
      "asking_price",
      "revenue_annual",
      "cash_flow",
      "hero_image_url",
      "status",
      "created_at",
    ].join(", ")
  );

  // Filter by visible statuses
  query = query.in("status", [...PUBLIC_VISIBLE_STATUSES]);

  if (filters.query) {
    query = query.ilike("title", `%${filters.query}%`);
  }

  // Normalize asset type (handle "Operational Assets", "type" field, etc.)
  const assetType = normalizeAssetType(filters.assetType ?? (filters as any).type);
  
  // Apply filter: strict match (no NULL values allowed)
  if (assetType === "operational") {
    query = query.eq("asset_type", "operational");
  } else if (assetType === "digital") {
    query = query.eq("asset_type", "digital");
  }

  // Normalize category/subcategory IDs defensively (belt + suspenders)
  // Accept both categoryId and legacy category/subcategory for backward compatibility
  const categoryId = normalizeId((filters as any).categoryId ?? (filters as any).category);
  const subcategoryId = normalizeId((filters as any).subcategoryId ?? (filters as any).subcategory);

  // Only use normalized IDs in query
  if (categoryId) query = query.eq("category_id", categoryId);
  if (subcategoryId) query = query.eq("subcategory_id", subcategoryId);

  if (filters.minPrice) query = query.gte("asking_price", filters.minPrice);
  if (filters.maxPrice) query = query.lte("asking_price", filters.maxPrice);

  if (filters.sort === "price_asc") query = query.order("asking_price", { ascending: true });
  else if (filters.sort === "price_desc") query = query.order("asking_price", { ascending: false });
  else query = query.order("created_at", { ascending: false });

  const { data, error } = await query;

  if (error) {
    if (DEBUG_LISTINGS) console.error("Error searching listings_public_teaser:", error);
    return [];
  }

  if (!data) return [];
  return (data as unknown as PublicTeaserRow[]).map(mapListingTeaserV16);
}

// ---------- Single listing detail (deal room permissive) ----------
export async function getListingByIdV16(id: string): Promise<ListingDetailV16 | null> {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("listings_v16")
    .select("*")
    .eq("id", id)
    .maybeSingle();

  if (error || !data) return null;

  return mapListingDetailV16(data);
}

// ---------- Featured listings (Homepage) ----------
export async function getFeaturedListingsV16({
  assetMode,
  limit = 12,
  categoryId,
  subcategoryId,
  query: searchQuery,
}: {
  assetMode: "operational" | "digital";
  limit?: number;
  categoryId?: string;
  subcategoryId?: string;
  query?: string;
}): Promise<ListingTeaserV16[]> {
  const supabase = await createClient();

  try {
    let query = supabase.from("listings_public_teaser").select(
      [
        "id",
        "title",
        "asset_type",
        "category_id",
        "subcategory_id",
        "city",
        "province",
        "country",
        "asking_price",
        "revenue_annual",
        "cash_flow",
        "hero_image_url",
        "status",
        "created_at",
      ].join(", ")
    );

    // Filter by visible statuses
    query = query.in("status", [...PUBLIC_VISIBLE_STATUSES]);

    // Asset mode filter: strict match (no NULL values allowed)
    if (assetMode === "operational") {
      query = query.eq("asset_type", "operational");
    } else {
      query = query.eq("asset_type", "digital");
    }

    // Category filter (UUID)
    if (categoryId) {
      query = query.eq("category_id", categoryId);
    }

    // Subcategory filter (UUID)
    if (subcategoryId) {
      query = query.eq("subcategory_id", subcategoryId);
    }

    // Text search filter
    if (searchQuery) {
      query = query.ilike("title", `%${searchQuery}%`);
    }

    query = query.order("created_at", { ascending: false }).limit(limit);

    const { data, error } = await query;

    if (error) {
      if (DEBUG_LISTINGS) {
        console.error(`[getFeaturedListingsV16] ${assetMode}:`, error);
      }
      return [];
    }

    if (!data || data.length === 0) {
      if (DEBUG_LISTINGS) {
        console.log(`[getFeaturedListingsV16] Featured loaded: 0 rows (assetType=${assetMode})`);
      }
      return [];
    }

    const result = (data as unknown as PublicTeaserRow[]).map(mapListingTeaserV16);
    
    if (DEBUG_LISTINGS) {
      console.log(`[getFeaturedListingsV16] Featured loaded: ${result.length} rows (assetType=${assetMode}${categoryId ? `, categoryId=${categoryId}` : ''}${subcategoryId ? `, subcategoryId=${subcategoryId}` : ''}${searchQuery ? `, query="${searchQuery}"` : ''})`);
    }

    return result;
  } catch (err: any) {
    if (DEBUG_LISTINGS) {
      console.error(`[getFeaturedListingsV16] ${assetMode}:`, err?.message || "unexpected error");
    }
    return [];
  }
}
