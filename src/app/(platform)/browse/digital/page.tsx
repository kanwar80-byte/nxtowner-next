import BrowseClientShell from "@/components/platform/BrowseClientShell";
import FilterSidebar from "@/components/platform/FilterSidebar";
import { getBrowseFacetsV16 } from "@/lib/v16/facets.repo";
import { searchListingsV16 } from "@/lib/v16/listings.repo";
import { getCategoryIdByCode, getSubcategoryIdByCode } from "@/lib/v16/taxonomy.repo";
import { Suspense } from "react";

export default async function BrowseDigitalPage({
  searchParams,
}: {
  searchParams: { [key: string]: string | string[] | undefined };
}) {
  // Track is fixed to 'digital'
  const assetTypeFilter = 'Digital';
  const sp = searchParams || {};

  // --- START TRANSLATION LAYER ---
  // 1. Asset Type is already set to 'Digital'
  // 2. Normalize Prices
  const minPrice = sp.min_price ? Number(sp.min_price) : undefined;
  const maxPrice = sp.max_price ? Number(sp.max_price) : undefined;

  // 3. Resolve category/subcategory codes to UUIDs (fail-soft - never throw)
  let categoryId: string | undefined = undefined;
  let subcategoryId: string | undefined = undefined;
  const categoryCode = sp.category as string | undefined;
  const subcategoryCode = sp.subcategory as string | undefined;
  
  // Try to resolve category code (fail-soft: if code doesn't exist, categoryId stays undefined)
  // NEVER throw or call notFound() - always render the page
  if (categoryCode && typeof categoryCode === 'string') {
    try {
      const resolvedId = await getCategoryIdByCode(categoryCode);
      if (resolvedId) {
        categoryId = resolvedId;
      }
      // If resolvedId is null, categoryId stays undefined - this is fine
    } catch (err) {
      // Category code not found or error - this is fine, we'll filter by code string instead
      // Do NOT throw - just log and continue
      console.warn(`Category code resolution failed for "${categoryCode}":`, err);
    }
  }
  if (subcategoryCode && typeof subcategoryCode === 'string') {
    try {
      const resolvedId = await getSubcategoryIdByCode(subcategoryCode);
      if (resolvedId) {
        subcategoryId = resolvedId;
      }
      // If resolvedId is null, subcategoryId stays undefined - this is fine
    } catch (err) {
      // Subcategory code not found or error - this is fine
      // Do NOT throw - just log and continue
      console.warn(`Subcategory code resolution failed for "${subcategoryCode}":`, err);
    }
  }

  // 4. Build Clean Filter Object (UUID preferred, fallback to string)
  const filters = {
    query: sp.q as string | undefined,
    assetType: assetTypeFilter,
    category: categoryId ? undefined : categoryCode,
    subcategory: subcategoryId ? undefined : subcategoryCode,
    categoryId,
    subcategoryId,
    minPrice,
    maxPrice,
    sort: (sp.sort as string) || 'newest',
  };
  // --- END TRANSLATION LAYER ---

  // Fetch listings and facets (will return empty array if no matches, not 404)
  // NEVER throw or call notFound() - always render the page
  let listings: any[] = [];
  let facets: any = { categoryCounts: {}, subcategoryCounts: {}, assetTypeCounts: {}, total: 0 };

  try {
    listings = await searchListingsV16(filters) || [];
  } catch (err) {
    // If fetch fails, show empty state (not 404)
    // Do NOT throw - just log and continue with empty array
    console.warn('Error fetching listings:', err);
    listings = [];
  }

  try {
    facets = await getBrowseFacetsV16(filters) || facets;
  } catch (err) {
    // If facets fetch fails, use empty facets (not 404)
    // Do NOT throw - just log and continue with empty facets
    console.warn('Error fetching facets:', err);
    facets = { categoryCounts: {}, subcategoryCounts: {}, assetTypeCounts: {}, total: 0 };
  }

  // Determine if we have an unknown category
  // Unknown category = category code provided but not found in taxonomy AND no results
  const hasCategoryFilter = Boolean(categoryCode);
  const isUnknownCategory = hasCategoryFilter && !categoryId && listings.length === 0;

  return (
    <div className="flex flex-col min-h-screen pt-20 bg-slate-50/50">
      <div className="max-w-[1600px] mx-auto w-full px-6 py-8">
        <div className="mb-8 border-b pb-6">
          <h1 className="text-3xl font-bold text-slate-900">💻 Digital Assets</h1>
          <p className="text-slate-500 mt-1">
            Discover SaaS, online businesses, and digital products.
          </p>
          {isUnknownCategory && categoryCode && (
            <div className="mt-4 p-4 bg-amber-50 border border-amber-200 rounded-lg">
              <p className="text-sm text-amber-800">
                <strong>Category not found:</strong> No listings found for category "{categoryCode}". 
                Showing all digital listings instead.
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
                track="digital"
              />
            </Suspense>
          </main>
        </div>
      </div>
    </div>
  );
}


