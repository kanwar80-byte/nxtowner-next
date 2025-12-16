"use server";

import { supabaseServer } from "@/lib/supabase/server";

import type { PublicListing } from "@/types/listing";
// 🚨 NEW IMPORT: Import the helper function
import { getSubCategoriesForMainCategory } from "@/lib/categories";

export type BrowseFiltersInput = {
  assetType?: string;
  category?: string;
  minPrice?: number;
  maxPrice?: number;
  location?: string;
  sort?: string;
};

/**
 * Helper to centralize and normalize base filters (status and asset type)
 */
function applyBaseFilters(q: any, filters: BrowseFiltersInput) {
  // Status: Ensure only publishable statuses are included.
  q = q.in("status", ["published", "active"]);

  // Asset type normalization:
  if (filters.assetType === "digital") {
    // Only fetch listings explicitly marked as 'digital'
    q = q.eq("asset_type", "digital");
  } else if (filters.assetType === "physical") {
    // Fetch listings marked as 'physical' OR 'asset' OR where asset_type is NULL
    q = q.or("asset_type.eq.physical,asset_type.eq.asset,asset_type.is.null");
  }
  return q;
}

export async function getFilteredListings(
  filters: BrowseFiltersInput
): Promise<PublicListing[]> {
  const supabase = await supabaseServer();

  let q = supabase
    .from("listings")
    .select("*");

  // 1. APPLY BASE FILTERS (Status and Asset Type)
  if (filters.assetType && filters.assetType !== "all") {
    // This is correct: apply the asset_type filter first.
    q = q.eq("asset_type", filters.assetType);
    q = q.in("status", ["published", "active"]);
  } else {
    q = q.in("status", ["published", "active"]); 
  }

  // 2. APPLY CATEGORY FILTER (using subCategories)
  if (filters.category && filters.category !== 'all') {
    const subCategories = getSubCategoriesForMainCategory(filters.category);
    if (subCategories && subCategories.length > 0) {
      // CRITICAL FIX: Include the Main Category name itself for maximum sync.
      const searchCategories = [filters.category, ...subCategories];
      // This query now searches for listings whose category column
      // is any of: ("Fuel & Auto", "Gas Stations", "Truck Stops")
      q = q.in("category", searchCategories); 
    } else {
      // Fallback: If no sub-categories defined, search by the category name directly
      q = q.eq("category", filters.category); 
    }
  }

  // Price Filters
  if (typeof filters.minPrice === "number")
    q = q.gte("asking_price", filters.minPrice);
  if (typeof filters.maxPrice === "number")
    q = q.lte("asking_price", filters.maxPrice);

  // **NEW** Cash Flow Filters
  if (typeof filters.minCashFlow === "number")
    q = q.gte("cashflow_numeric", filters.minCashFlow);
  if (typeof filters.maxCashFlow === "number")
    q = q.lte("cashflow_numeric", filters.maxCashFlow);

  // **NEW** Seller Financing Filter
  if (filters.hasFinancing)
    q = q.eq("seller_financing", true);

  // Location Filter
  if (filters.location) q = q.ilike("location", `%${filters.location}%`);

  // 3. APPLY SORTING
  // **NEW** Cashflow sorting option
  if (filters.sort === "cashflow_desc")
    q = q.order("cashflow_numeric", { ascending: false });
  if (filters.sort === "newest")
    q = q.order("created_at", { ascending: false });
  if (filters.sort === "price_asc")
    q = q.order("asking_price", { ascending: true });
  if (filters.sort === "price_desc")
    q = q.order("asking_price", { ascending: false });

  // Fallback sort if none is specified
  if (!filters.sort) q = q.order("created_at", { ascending: false });

  const { data, error } = await q;

  if (error) {
    console.error("getFilteredListings error:", error);
    return [];
  }

  return (data ?? []) as PublicListing[];
}

export type BrowseMeta = {
  categories: string[];
};

// Keep this function as is, since it was already using applyBaseFilters correctly.
export async function getBrowseMeta(
  filters: BrowseFiltersInput
): Promise<BrowseMeta> {
  const supabase = await supabaseServer();

  let q = supabase
    .from("listings")
    .select("category", { count: "exact", head: false })
    .not("category", "is", null);

  q = applyBaseFilters(q, filters);

  const { data, error } = await q;
  if (error) {
    console.error("[getBrowseMeta] error:", error);
    return { categories: [] };
  }

  // unique, cleaned, sorted
  const categories = Array.from(
    new Set((data ?? []).map((r: any) => String(r.category).trim()).filter(Boolean))
  ).sort((a, b) => a.localeCompare(b));

  return { categories };
}