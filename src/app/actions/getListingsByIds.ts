"use server";

/**
 * Get multiple listings by their IDs using V16 canonical repository
 * Used by ComparisonQueue component to fetch details for selected listings
 */

import { createClient } from "@/utils/supabase/server";
import { mapListingTeaserV16 } from "@/lib/v16/mappers";
import type { ListingTeaserV16 } from "@/lib/v16/types";
import { PUBLIC_VISIBLE_STATUSES } from "@/lib/v16/listings.repo";

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

/**
 * Helper: check if value is an object
 */
function isObject(v: unknown): v is Record<string, unknown> {
  return typeof v === "object" && v !== null;
}

/**
 * Type guard to verify data is a valid array of PublicTeaserRow
 * Checks required fields (id, title, asset_type, category_id) exist on first element
 */
function isPublicTeaserRowArray(x: unknown): x is PublicTeaserRow[] {
  if (!Array.isArray(x)) {
    return false;
  }
  
  // If array is empty, consider it valid (empty arrays are acceptable)
  if (x.length === 0) {
    return true;
  }
  
  // Check first element for required fields
  const r = x[0];
  if (!isObject(r)) {
    return false;
  }
  
  // Check required fields exist and have correct types
  // id must be string
  if (typeof r.id !== "string") {
    return false;
  }
  
  // title must be string (allow null as per type definition)
  if (typeof r.title !== "string" && r.title !== null) {
    return false;
  }
  
  // asset_type must be string (allow null as per type definition)
  if (typeof r.asset_type !== "string" && r.asset_type !== null) {
    return false;
  }
  
  // category_id must exist (can be string or null)
  if (!("category_id" in r)) {
    return false;
  }
  
  return true;
}

/**
 * Fetch multiple listings by their IDs
 * @param ids Array of listing IDs to fetch
 * @returns Array of listing teasers (empty array if no matches or error)
 */
export async function getListingsByIds(ids: string[]): Promise<ListingTeaserV16[]> {
  try {
    // Validate input
    if (!ids || ids.length === 0) {
      return [];
    }

    // Filter out invalid IDs (null, undefined, empty strings)
    const validIds = ids.filter((id) => id && typeof id === "string" && id.trim().length > 0);
    
    if (validIds.length === 0) {
      return [];
    }

    const supabase = await createClient();

    // Fetch from public teaser view (same source as searchListingsV16)
    // Filter by IDs and visible statuses
    const { data, error } = await supabase
      .from("listings_public_teaser")
      .select(
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
      )
      .in("id", validIds)
      .in("status", [...PUBLIC_VISIBLE_STATUSES]);

    if (error) {
      console.warn("Error fetching listings by IDs:", error);
      return [];
    }

    if (!data || data.length === 0) {
      return [];
    }

    // Cast to unknown first, then narrow with type guard
    const unknownData: unknown = data;
    
    // Narrow to rows with explicit type
    const rows: PublicTeaserRow[] = isPublicTeaserRowArray(unknownData) ? unknownData : [];
    
    if (rows.length === 0) {
      console.warn("Invalid data structure received from database");
      return [];
    }

    // Map to V16 teaser format and preserve order of requested IDs
    const listingsMap = new Map(
      rows.map((row) => [row.id, mapListingTeaserV16(row)])
    );

    // Return listings in the order they were requested
    return validIds
      .map((id) => listingsMap.get(id))
      .filter((listing): listing is ListingTeaserV16 => listing !== undefined);
  } catch (error) {
    console.error("getListingsByIds exception:", error);
    return [];
  }
}
