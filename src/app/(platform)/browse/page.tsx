import BrowseClientShell from "@/components/platform/BrowseClientShell";
import FilterSidebar from "@/components/platform/FilterSidebar";
import { getBrowseFacetsV16 } from "@/lib/v16/facets.repo";
import { searchListingsV16 } from "@/lib/v16/listings.repo";
import { getCategoryIdByCode, getSubcategoryIdByCode } from "@/lib/v16/taxonomy.repo";
import { Suspense } from "react";



export default async function BrowsePage({
  searchParams,
}: {
  searchParams: { [key: string]: string | string[] | undefined };
}) {
  // --- START TRANSLATION LAYER ---
  const sp = searchParams || {};

  // 1. Normalize Asset Type (Handle 'physical' vs 'Operational' mismatch)
  let assetTypeFilter: string | undefined;
  // Check both camelCase (new) and snake_case (old) params
  const rawType = (sp.assetType || sp.asset_type) as string | undefined;
  if (rawType?.toLowerCase() === 'physical') assetTypeFilter = 'Operational';
  else if (rawType?.toLowerCase() === 'digital') assetTypeFilter = 'Digital';
  else if (rawType === 'Operational' || rawType === 'Digital') assetTypeFilter = rawType;

  // 2. Normalize Prices
  const minPrice = sp.min_price ? Number(sp.min_price) : undefined;
  const maxPrice = sp.max_price ? Number(sp.max_price) : undefined;

  // 3. Resolve category/subcategory codes to UUIDs (fail-soft)
  let categoryId: string | undefined = undefined;
  let subcategoryId: string | undefined = undefined;
  const categoryCode = sp.category as string | undefined;
  const subcategoryCode = sp.subcategory as string | undefined;
  if (categoryCode) {
    categoryId = await getCategoryIdByCode(categoryCode) || undefined;
  }
  if (subcategoryCode) {
    subcategoryId = await getSubcategoryIdByCode(subcategoryCode) || undefined;
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

  // NOW PASS THE CLEAN 'filters' OBJECT
  const listings = await searchListingsV16(filters);
  const facets = await getBrowseFacetsV16(filters);

  return (
    <div className="flex flex-col min-h-screen pt-20 bg-slate-50/50">
      <div className="max-w-[1600px] mx-auto w-full px-6 py-8">
        <div className="mb-8 border-b pb-6">
          <h1 className="text-3xl font-bold text-slate-900">Marketplace</h1>
          <p className="text-slate-500 mt-1">
            Discover and acquire vetted business opportunities.
          </p>
        </div>

        <div className="flex gap-8 items-start">
          <aside className="w-64 flex-shrink-0 sticky top-28 h-[calc(100vh-120px)] overflow-y-auto hidden md:block">
            <FilterSidebar categoryCounts={facets.categoryCounts} />
          </aside>

          <main className="flex-1 min-w-0">
            <Suspense fallback={<div className="animate-pulse space-y-4">Loading listings...</div>}>
              <BrowseClientShell listings={listings || []} />
            </Suspense>
          </main>
        </div>
      </div>
    </div>
  );
}
