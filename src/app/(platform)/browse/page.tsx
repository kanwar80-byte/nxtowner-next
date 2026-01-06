import BrowseClientShell from "@/components/platform/BrowseClientShell";
import FilterSidebar from "@/components/platform/FilterSidebar";
import { getBrowseFacetsV16, type BrowseFacetsV16 } from "@/lib/v16/facets.repo";
import { searchListingsV16, normalizeAssetType } from "@/lib/v16/listings.repo";
import { getCategoryIdByCode, getSubcategoryIdByCode, getCategoryIdByName } from "@/lib/v16/taxonomy.repo";
import type { ListingTeaserV16 } from "@/lib/v16/types";
import { Suspense } from "react";



export default async function BrowsePage({
  searchParams,
}: {
  searchParams: { [key: string]: string | string[] | undefined };
}) {
  // --- START TRANSLATION LAYER ---
  const sp = searchParams || {};

  // 1. Normalize Asset Type (read from listing_type, assetType, type, asset_type params)
  // Priority: listing_type (V17 canonical) > assetType > type > asset_type
  const rawType = (sp.listing_type || sp.assetType || sp.type || sp.asset_type) as string | undefined;
  const assetTypeFilter = normalizeAssetType(rawType); // Returns "operational" | "digital" | undefined

  // 2. Normalize Prices
  const minPrice = sp.min_price ? Number(sp.min_price) : undefined;
  const maxPrice = sp.max_price ? Number(sp.max_price) : undefined;

  // 3. Read categoryId/subcategoryId from URL (UUIDs) or resolve category/subcategory codes to UUIDs
  let categoryId: string | undefined = undefined;
  let subcategoryId: string | undefined = undefined;
  
  // Priority 1: Use categoryId/subcategoryId if provided directly (UUIDs)
  const categoryIdParam = sp.categoryId as string | undefined;
  const subcategoryIdParam = sp.subcategoryId as string | undefined;
  if (categoryIdParam) categoryId = categoryIdParam;
  if (subcategoryIdParam) subcategoryId = subcategoryIdParam;
  
  // Priority 2: If not provided, try to resolve category/subcategory codes or canonical names to UUIDs
  const categoryCode = sp.category as string | undefined;
  const subcategoryCode = sp.subcategory as string | undefined;
  if (!categoryId && categoryCode && typeof categoryCode === 'string') {
    try {
      // Try resolving as code first (e.g., "saas_software")
      let resolvedId = await getCategoryIdByCode(categoryCode);
      // If code resolution fails, try resolving as canonical name (e.g., "SaaS", "E-Commerce")
      if (!resolvedId) {
        resolvedId = await getCategoryIdByName(categoryCode);
      }
      if (resolvedId) {
        categoryId = resolvedId;
      }
    } catch (err) {
      // Category code/name resolution failed - this is fine
      console.warn(`Category resolution failed for "${categoryCode}":`, err);
    }
  }
  if (!subcategoryId && subcategoryCode && typeof subcategoryCode === 'string') {
    try {
      const resolvedId = await getSubcategoryIdByCode(subcategoryCode);
      if (resolvedId) {
        subcategoryId = resolvedId;
      }
    } catch (err) {
      // Subcategory code not found or error - this is fine
      console.warn(`Subcategory code resolution failed for "${subcategoryCode}":`, err);
    }
  }

  // 4. Build Clean Filter Object (UUID preferred)
  const filters = {
    query: sp.q as string | undefined,
    assetType: assetTypeFilter,
    categoryId,
    subcategoryId,
    minPrice,
    maxPrice,
    sort: (sp.sort as string) || 'newest',
  };
  // --- END TRANSLATION LAYER ---

  // Debug: Log filters (only in debug mode)
  if (process.env.NEXT_PUBLIC_DEBUG_LISTINGS === "1") {
    console.log('[browse/page] searchListingsV16 filters:', JSON.stringify(filters, null, 2));
  }

  // Fetch listings and facets (will return empty array if no matches, not 404)
  // NEVER throw or call notFound() - always render the page
  let listings: ListingTeaserV16[] = [];
  let facets: BrowseFacetsV16 = { 
    categoryCounts: {}, 
    subcategoryCounts: {}, 
    assetTypeCounts: {}, 
    total: 0 
  };

  try {
    listings = await searchListingsV16(filters) || [];
  } catch (err) {
    // If fetch fails, show empty state (not 404)
    console.warn('Error fetching listings:', err);
    listings = [];
  }

  try {
    facets = await getBrowseFacetsV16(filters) || facets;
  } catch (err) {
    // If facets fetch fails, use empty facets (not 404)
    console.warn('Error fetching facets:', err);
    facets = { categoryCounts: {}, subcategoryCounts: {}, assetTypeCounts: {}, total: 0 };
  }

  // Determine if we have an unknown category
  const hasCategoryFilter = Boolean(categoryCode);
  const isUnknownCategory = hasCategoryFilter && !categoryId && listings.length === 0;

  return (
    <div className="flex flex-col min-h-screen pt-20 bg-slate-50/50">
      <div className="max-w-[1600px] mx-auto w-full px-6 py-8">
        <div className="mb-8 border-b pb-6">
          <h1 className="text-3xl font-bold text-slate-900">Marketplace</h1>
          <p className="text-slate-500 mt-1">
            Discover and acquire vetted business opportunities.
          </p>
          {isUnknownCategory && categoryCode && (
            <div className="mt-4 p-4 bg-amber-50 border border-amber-200 rounded-lg">
              <p className="text-sm text-amber-800">
                <strong>Category not found:</strong> No listings found for category &quot;{categoryCode}&quot;. 
                Showing all listings instead.
              </p>
            </div>
          )}
          {hasCategoryFilter && !isUnknownCategory && listings.length === 0 && (
            <div className="mt-4 p-4 bg-slate-50 border border-slate-200 rounded-lg">
              <p className="text-sm text-slate-700">
                No listings found for this category.
              </p>
            </div>
          )}
        </div>

        <div className="flex gap-8 items-start">
          <aside className="w-64 flex-shrink-0 sticky top-28 h-[calc(100vh-120px)] overflow-y-auto hidden md:block">
            <FilterSidebar categoryCounts={facets.categoryCounts} />
          </aside>

          <main className="flex-1 min-w-0">
            <Suspense fallback={<div className="animate-pulse space-y-4">Loading listings...</div>}>
              <BrowseClientShell 
                listings={listings || []} 
                emptyStateReason={
                  isUnknownCategory 
                    ? "no_results" 
                    : listings.length === 0 
                      ? (hasCategoryFilter ? "no_results" : null)
                      : null
                }
              />
            </Suspense>
          </main>
        </div>
      </div>
    </div>
  );
}
