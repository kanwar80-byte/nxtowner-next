"use server";

import { getBrowseFacetsV16 as getBrowseFacetsV16Impl } from "@/lib/v16/listings.repo";

// ✅ 1. Define Types & Interfaces (Once, clearly)
export interface FacetFiltersV16 {
  q?: string;
  assetType?: string; // Changed from strict union to string to allow URL param flexibility
  categoryId?: string;
  subcategoryId?: string;
  province?: string;
  city?: string;
  minPrice?: number;
  maxPrice?: number;
}

export interface BrowseFacetsV16 {
  assetTypeCounts: Record<string, number>;
  categoryCounts: Record<string, number>;
  subcategoryCounts: Record<string, number>;
  total: number;
}

// ✅ 2. Helper function (Outside of types/functions)
function inc(map: Record<string, number>, key: string | null | undefined) {
  if (!key) return;
  map[key] = (map[key] || 0) + 1;
}

// ✅ 3. Main Logic (Single consolidated function)
// Route to canonical implementation in listings.repo.ts
export async function getBrowseFacetsV16(filters: any) {
  return getBrowseFacetsV16Impl(filters);
}