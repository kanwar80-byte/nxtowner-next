"use server";

import { searchListingsV16 } from "@/lib/v16/listings.repo";
import type { BrowseFiltersV16 } from "@/lib/v16/types";
import {
  getCategoryIdByCode,
  getSubcategoryIdByCode,
} from "@/lib/v17/categoryResolver";

// 1. UPDATED TYPE DEFINITION
export type SearchFilters = {
  query?: string;
  categoryId?: string | null; // UUID
  subcategoryId?: string | null; // UUID
  categoryCode?: string | null; // Code (will be resolved to UUID)
  subcategoryCode?: string | null; // Code (will be resolved to UUID)
  minPrice?: number;
  maxPrice?: number;
  minCashflow?: number;
  minRevenue?: number;
  
  // These MUST be here to match the frontend
  assetType?: string; 
  location?: string;
  sort?: string;      
  
  // Safety catch-all
  [key: string]: any; 
};

/**
 * Get filtered listings using V16 canonical repo
 * Maps V15 filter format to V16 and applies additional client-side filtering
 */
export async function getFilteredListings(filters: SearchFilters) {
  try {
    // Resolve category codes to UUIDs if provided
    let categoryId: string | null | undefined = filters.categoryId;
    let subcategoryId: string | null | undefined = filters.subcategoryId;

    if (filters.categoryCode && !categoryId) {
      categoryId = await getCategoryIdByCode(filters.categoryCode);
    }
    if (filters.subcategoryCode && !subcategoryId) {
      subcategoryId = await getSubcategoryIdByCode(filters.subcategoryCode);
    }

    // Map V15 filters to V16 format
    const v16Filters: BrowseFiltersV16 = {
      query: filters.query,
      assetType: filters.assetType === 'asset' ? 'Operational' 
        : filters.assetType === 'digital' ? 'Digital' 
        : undefined,
      categoryId: categoryId ?? undefined,
      subcategoryId: subcategoryId ?? undefined,
      minPrice: filters.minPrice,
      maxPrice: filters.maxPrice,
      sort: filters.sort === 'oldest' ? 'newest' // V16 doesn't have oldest, use newest
        : filters.sort === 'lowest_price' || filters.sort === 'highest_price' 
        ? (filters.sort === 'lowest_price' ? 'price_asc' : 'price_desc')
        : 'newest',
    };

    // Use V16 canonical repo
    let listings = await searchListingsV16(v16Filters);

    // Apply additional filters that V16 repo doesn't support directly (client-side filtering)
    if (filters.location) {
      const locationLower = filters.location.toLowerCase();
      listings = listings.filter((item: any) => {
        const city = (item.city || '').toLowerCase();
        const province = (item.province || '').toLowerCase();
        const country = (item.country || '').toLowerCase();
        return city.includes(locationLower) || province.includes(locationLower) || country.includes(locationLower);
      });
    }

    if (filters.minCashflow !== undefined) {
      listings = listings.filter((item: any) => (item.cash_flow || 0) >= filters.minCashflow!);
    }

    if (filters.minRevenue !== undefined) {
      listings = listings.filter((item: any) => (item.revenue_annual || 0) >= filters.minRevenue!);
    }

    return listings;
  } catch (error) {
    console.error("Search Error:", error);
    return [];
  }
}