import "server-only";

import { createSupabaseServerClient } from '@/utils/supabase/server';
import { searchListingsV16 } from '@/lib/v16/listings.repo';
import { getCategoryIdByCode, getSubcategoryIdByCode } from '@/lib/v17/categoryResolver';
import { getCategoryNameById, getSubcategoryNameById } from '@/lib/v16/taxonomy.repo';
import type { SearchFiltersV17, ListingTeaserV17 } from '@/types/v17/search';
import type { BrowseFiltersV16 } from '@/lib/v16/types';

/**
 * V17 Canonical Search Service
 * Wraps V16 repo and maps to V17 canonical types
 */

/**
 * Map V16 listing to V17 ListingTeaserV17
 * Resolves category/subcategory IDs to names
 */
async function mapToV17Teaser(v16Item: {
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
}): Promise<ListingTeaserV17> {
  // Resolve category/subcategory names from IDs
  const [categoryName, subcategoryName] = await Promise.all([
    v16Item.category_id ? getCategoryNameById(v16Item.category_id) : Promise.resolve(null),
    v16Item.subcategory_id ? getSubcategoryNameById(v16Item.subcategory_id) : Promise.resolve(null),
  ]);

  // Determine listing_type from asset_type
  // V16 mapper normalizes asset_type, but handle edge cases:
  // - 'digital' → 'digital'
  // - 'asset', 'operational', 'physical', null, or any other value → 'operational'
  const assetTypeLower = v16Item.asset_type?.toLowerCase() || '';
  const listing_type: 'operational' | 'digital' = 
    assetTypeLower === 'digital' ? 'digital' : 'operational';

  // Map verification_status (default 'unverified' if not available)
  const verification_status: 'unverified' | 'pending' | 'verified' = 
    v16Item.status === 'verified' ? 'verified' :
    v16Item.status === 'pending' ? 'pending' : 'unverified';

  // Extract teaser from title or use empty string
  const teaser = v16Item.title ? v16Item.title.substring(0, 150) : '';

  return {
    id: v16Item.id,
    listing_type,
    category: categoryName || 'Uncategorized',
    subcategory: subcategoryName || 'General',
    title: v16Item.title || '',
    teaser,
    asking_price: v16Item.asking_price,
    location_city: v16Item.city,
    location_province: v16Item.province,
    verification_status,
    featured_level: 'none', // Default - may not exist in current schema
    rank_score: 0, // Default - may not exist in current schema
    created_at: v16Item.created_at || new Date().toISOString(),
    updated_at: v16Item.created_at || new Date().toISOString(), // Fallback if updated_at not available
    annual_revenue: v16Item.revenue_annual,
    annual_ebitda: null, // May not exist in teaser view
    owner_cashflow: v16Item.cash_flow,
    hero_image_url: v16Item.hero_image_url, // Include image URL for card rendering
  };
}

/**
 * Search listings using V17 canonical filters
 * Wraps V16 repo and maps results to V17 types
 * Note: validateTaxonomy should be called in API route before this function
 */
export async function searchListingsV17(
  filters: SearchFiltersV17
): Promise<{
  items: ListingTeaserV17[];
  total: number;
  page: number;
  page_size: number;
}> {
  try {
    // Resolve category/subcategory strings to UUIDs
    let categoryId: string | null | undefined = undefined;
    let subcategoryId: string | null | undefined = undefined;

    if (filters.category) {
      // Try to resolve category name/code to UUID
      categoryId = await getCategoryIdByCode(filters.category);
      // If code lookup fails, category filter will be skipped
    }

    if (filters.subcategory) {
      subcategoryId = await getSubcategoryIdByCode(filters.subcategory);
    }

    // Convert SearchFiltersV17 to BrowseFiltersV16 format
    // Map listing_type to assetType: 'operational' → 'Operational', 'digital' → 'Digital'
    const v16Filters: BrowseFiltersV16 = {
      query: undefined, // V17 doesn't have query in SearchFiltersV17
      assetType: filters.listing_type === 'operational' ? 'Operational' :
                 filters.listing_type === 'digital' ? 'Digital' : undefined,
      categoryId: categoryId ?? undefined,
      subcategoryId: subcategoryId ?? undefined,
      minPrice: filters.min_price,
      maxPrice: filters.max_price,
      sort: filters.sort === 'price_low' ? 'price_asc' :
            filters.sort === 'price_high' ? 'price_desc' :
            filters.sort === 'newest' ? 'newest' : 'newest',
    };

    // Call V16 repo to get all matching results
    const v16Results = await searchListingsV16(v16Filters);

    // Post-filter for additional V17 filters not supported by V16 repo
    let filtered = v16Results;

    // Filter by revenue if specified
    if (filters.min_revenue !== undefined) {
      filtered = filtered.filter(item => (item.revenue_annual ?? 0) >= filters.min_revenue!);
    }
    if (filters.max_revenue !== undefined) {
      filtered = filtered.filter(item => (item.revenue_annual ?? 0) <= filters.max_revenue!);
    }

    // Filter by location (province/city)
    if (filters.province) {
      filtered = filtered.filter(item => 
        item.province?.toLowerCase() === filters.province!.toLowerCase()
      );
    }
    if (filters.city) {
      filtered = filtered.filter(item => 
        item.city?.toLowerCase() === filters.city!.toLowerCase()
      );
    }

    // Get total count before pagination
    const total = filtered.length;

    // Apply pagination
    const page = filters.page && filters.page > 0 ? filters.page : 1;
    const page_size = filters.page_size && filters.page_size > 0 && filters.page_size <= 60 
      ? filters.page_size : 24;
    const offset = (page - 1) * page_size;

    const paginated = filtered.slice(offset, offset + page_size);

    // Map to V17 format
    const items = await Promise.all(
      paginated.map(item => mapToV17Teaser({
        id: item.id,
        title: item.title,
        asset_type: item.asset_type,
        category_id: item.category_id,
        subcategory_id: item.subcategory_id,
        city: item.city,
        province: item.province,
        country: item.country,
        asking_price: item.asking_price,
        revenue_annual: item.revenue_annual,
        cash_flow: item.cash_flow,
        hero_image_url: item.hero_image_url,
        status: item.status,
        created_at: item.created_at,
      }))
    );

    return {
      items,
      total,
      page,
      page_size,
    };
  } catch (error) {
    // Never throw raw Supabase errors to caller
    console.error('[searchListingsV17] Error:', error);
    throw new Error('Failed to search listings');
  }
}

