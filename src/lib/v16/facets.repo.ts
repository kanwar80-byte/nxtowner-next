"use server";

import { getBrowseFacetsV16 as getBrowseFacetsV16Impl } from "@/lib/v16/listings.repo";
import { getCategoryNameById, getSubcategoryNameById } from "@/lib/v16/taxonomy.repo";

// UUID regex pattern
const UUID_REGEX = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

function isUUID(value: string | null | undefined): boolean {
  if (!value || typeof value !== "string") return false;
  return UUID_REGEX.test(value);
}

// ✅ 1. Define Types & Interfaces
export interface FacetFiltersV16 {
  q?: string;
  assetType?: string;
  categoryId?: string;
  subcategoryId?: string;
  province?: string;
  city?: string;
  minPrice?: number;
  maxPrice?: number;
}

export interface BrowseFacetsV16 {
  assetTypeCounts: Record<string, number>;
  categoryCounts: Record<string, { count: number; label: string }>;
  subcategoryCounts: Record<string, { count: number; label: string }>;
  total: number;
}

// ✅ 2. Main Logic - Returns display-ready facets with human-readable labels
export async function getBrowseFacetsV16(filters: any): Promise<BrowseFacetsV16> {
  // Get raw facets from canonical repo
  const rawFacets = await getBrowseFacetsV16Impl(filters);
  
  // Build in-memory cache for label resolution (only for keys present in facets)
  const categoryKeys = Object.keys(rawFacets.categoryCounts || {});
  const subcategoryKeys = Object.keys(rawFacets.subcategoryCounts || {});
  
  // Resolve all category labels in parallel
  const categoryLabelPromises = categoryKeys.map(async (key) => {
    if (isUUID(key)) {
      const name = await getCategoryNameById(key);
      return { key, label: name || key }; // Fallback to key if not found
    }
    return { key, label: key }; // Use key as label for codes/strings
  });
  
  // Resolve all subcategory labels in parallel
  const subcategoryLabelPromises = subcategoryKeys.map(async (key) => {
    if (isUUID(key)) {
      const name = await getSubcategoryNameById(key);
      return { key, label: name || key }; // Fallback to key if not found
    }
    return { key, label: key }; // Use key as label for codes/strings
  });
  
  const categoryLabels = await Promise.all(categoryLabelPromises);
  const subcategoryLabels = await Promise.all(subcategoryLabelPromises);
  
  // Build label maps
  const categoryLabelMap = Object.fromEntries(
    categoryLabels.map(({ key, label }) => [key, label])
  );
  const subcategoryLabelMap = Object.fromEntries(
    subcategoryLabels.map(({ key, label }) => [key, label])
  );
  
  // Transform raw facets to display-ready format
  const categoryCounts: Record<string, { count: number; label: string }> = {};
  for (const [key, count] of Object.entries(rawFacets.categoryCounts || {})) {
    categoryCounts[key] = {
      count: count as number,
      label: categoryLabelMap[key] || key, // Fallback to key if label missing
    };
  }
  
  const subcategoryCounts: Record<string, { count: number; label: string }> = {};
  for (const [key, count] of Object.entries(rawFacets.subcategoryCounts || {})) {
    subcategoryCounts[key] = {
      count: count as number,
      label: subcategoryLabelMap[key] || key, // Fallback to key if label missing
    };
  }
  
  return {
    assetTypeCounts: rawFacets.assetTypeCounts || {},
    categoryCounts,
    subcategoryCounts,
    total: rawFacets.total || 0,
  };
}
