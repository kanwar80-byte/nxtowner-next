import { Suspense } from "react";
import { Monitor, Briefcase } from "lucide-react";

// --- V17 BRAIN (New Database Connection) ---
import { searchListingsV17, type SearchFiltersV17 } from "@/lib/v17/listings.repo";
import type { AssetTypeV17 } from "@/lib/v17/types";

// Mapper: Convert Track/route values to AssetTypeV17 (real_world => operational)
const toAssetTypeV17 = (trackOrAsset?: string): AssetTypeV17 | undefined => {
  if (!trackOrAsset) return undefined;
  if (trackOrAsset === "real_world") return "operational";
  if (trackOrAsset === "operational") return "operational";
  if (trackOrAsset === "digital") return "digital";
  return undefined;
};

// --- V16 FALLBACK (Facets Only - Keep until V17 Facets are ready) ---
import { getBrowseFacetsV16 } from "@/lib/v16/facets.repo";
import { getCategoryIdByCode, getSubcategoryIdByCode } from "@/lib/v16/taxonomy.repo";

// --- UI COMPONENTS ---
import BrowseClientShell from "@/components/platform/BrowseClientShell";
import FilterSidebar from "@/components/platform/FilterSidebar";

export default async function BrowsePage({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  // 1. Await Params (Next.js 16)
  const sp = (await searchParams) || {};

  // 2. Parse Asset Type (No default - undefined means show ALL assets)
  // Keep raw value for UI logic, map to AssetTypeV17 for filters
  const rawType = sp.asset_type as string | undefined;
  const assetTypeFilterRoute: 'real_world' | 'digital' | undefined = 
    rawType === 'real_world' ? 'real_world' 
    : rawType === 'digital' ? 'digital' 
    : undefined; // undefined = show all assets
  
  const assetTypeFilterV17 = toAssetTypeV17(assetTypeFilterRoute);
  const isRealWorld = assetTypeFilterRoute === 'real_world';
  const isDigital = assetTypeFilterRoute === 'digital';
  const showAllAssets = assetTypeFilterRoute === undefined;

  // 3. Resolve Categories (V16 Taxonomy Bridge)
  const categoryCode = sp.category as string | undefined;
  const subcategoryCode = sp.subcategory as string | undefined;
  let categoryId: string | undefined;
  let subcategoryId: string | undefined;

  // Fail-soft ID resolution
  if (categoryCode) {
     try { categoryId = await getCategoryIdByCode(categoryCode) || undefined; } catch(e) {}
  }
  if (subcategoryCode) {
     try { subcategoryId = await getSubcategoryIdByCode(subcategoryCode) || undefined; } catch(e) {}
  }

  // 4. Construct V17 Filters
  const v17Filters: SearchFiltersV17 = {
    query: sp.q as string,
    asset_type: assetTypeFilterV17, // Mapped to AssetTypeV17: 'operational' or 'digital' or undefined
    min_price: sp.min_price ? Number(sp.min_price) : undefined,
    max_price: sp.max_price ? Number(sp.max_price) : undefined,
    category_id: categoryId,
    subcategory_id: subcategoryId,
    sort: (sp.sort as 'newest' | 'price_low' | 'price_high') || 'newest',
    limit: 20,
    offset: sp.page ? (Number(sp.page) - 1) * 20 : undefined
  };

  // 5. FETCH DATA (V17 Engine) - Returns paginated shape
  let listings: any[] = [];
  let total = 0;
  try {
    const result = await searchListingsV17(v17Filters);
    listings = result.items || [];
    total = result.total || 0;
  } catch (err) {
    console.warn("V17 Fetch Error:", err);
    listings = [];
    total = 0;
  }

  // 6. FETCH FACETS (V16 Bridge)
  // We map V17 filters back to V16 shape for the sidebar counts
  // Note: When showing all assets, don't filter facets by asset type
  const v16FiltersForFacets = {
    assetType: showAllAssets ? undefined : (isRealWorld ? 'Operational' : 'Digital'), // V16 uses Capitalized
    categoryId,
    subcategoryId,
    minPrice: v17Filters.min_price,
    maxPrice: v17Filters.max_price,
    query: v17Filters.query
  };

  let facets: any = { categoryCounts: {}, subcategoryCounts: {}, assetTypeCounts: {}, total: 0 };
  try {
    facets = await getBrowseFacetsV16(v16FiltersForFacets) || facets;
  } catch (err) { console.warn("Facet Fetch Error:", err); }

  // 7. THEME ENGINE (Dark Mode)
  // When showing all assets, use a neutral theme (default to amber for consistency)
  const theme = {
    accent: showAllAssets ? 'text-slate-300' : (isRealWorld ? 'text-amber-500' : 'text-teal-400'),
    bg: showAllAssets ? 'bg-slate-500/10' : (isRealWorld ? 'bg-amber-500/10' : 'bg-teal-400/10'),
    icon: showAllAssets ? Briefcase : (isRealWorld ? Briefcase : Monitor)
  };
  const Icon = theme.icon;

  return (
    <div className="flex flex-col min-h-screen pt-24 bg-[#050505] text-slate-200">
      <div className="max-w-[1600px] mx-auto w-full px-4 md:px-6 py-8">
        
        {/* HEADER */}
        <div className="mb-8 border-b border-slate-800 pb-6">
          <div className="flex items-center gap-3 mb-2">
            <div className={`p-2 rounded-lg ${theme.bg} ${theme.accent}`}>
              <Icon className="w-6 h-6" />
            </div>
            <h1 className="text-3xl font-bold text-white">
              {showAllAssets 
                ? 'All Assets' 
                : (isRealWorld ? 'Real World Acquisitions' : 'Digital Assets')}
            </h1>
          </div>
          <p className="text-slate-400 max-w-2xl">
            {showAllAssets
              ? 'Browse all verified businesses across Real World and Digital assets.'
              : (isRealWorld 
                  ? 'Discover verified gas stations, franchises, and industrial businesses.'
                  : 'Discover vetted SaaS, e-commerce brands, and agency opportunities.')}
          </p>
        </div>

        <div className="flex gap-8 items-start">
          <aside className="w-64 shrink-0 sticky top-28 h-[calc(100vh-120px)] overflow-y-auto hidden md:block border-r border-slate-800 pr-4">
            <FilterSidebar categoryCounts={facets.categoryCounts} />
          </aside>

          <main className="flex-1 min-w-0">
            <Suspense fallback={<div className="animate-pulse text-slate-500">Loading listings...</div>}>
              <BrowseClientShell 
                listings={listings} 
                emptyStateReason={listings.length === 0 ? "no_results" : null}
                track={assetTypeFilterRoute || null}
              />
            </Suspense>
          </main>
        </div>
      </div>
    </div>
  );
}