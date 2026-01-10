import { Suspense } from "react";
import { notFound } from "next/navigation";
import { Monitor, Briefcase } from "lucide-react";

// --- V17 BRAIN (The New Engine) ---
import { searchListingsV17, type SearchFiltersV17 } from "@/lib/v17/listings.repo";
import { ASSET_TYPE_LABEL } from "@/lib/v17/uiLabels";
import type { AssetTypeV17 } from "@/lib/v17/types";

// Mapper: Convert Track/route values to AssetTypeV17 (real_world => operational)
const toAssetTypeV17 = (trackOrAsset?: string): AssetTypeV17 | undefined => {
  if (!trackOrAsset) return undefined;
  if (trackOrAsset === "real_world") return "operational";
  if (trackOrAsset === "operational") return "operational";
  if (trackOrAsset === "digital") return "digital";
  return undefined;
};

// --- V16 FALLBACKS (Facets/Taxonomy) ---
// We keep these until you migrate facets to V17
import { getBrowseFacetsV16 } from "@/lib/v16/facets.repo";
import { getCategoryIdByCode, getSubcategoryIdByCode } from "@/lib/v16/taxonomy.repo";

// --- CLIENT COMPONENTS ---
import BrowseClientShell from "@/components/platform/BrowseClientShell";
import FilterSidebar from "@/components/platform/FilterSidebar";

interface BrowseTrackPageProps {
  params: { track: string };
  searchParams: { [key: string]: string | string[] | undefined };
}

export default async function BrowseTrackPage({
  params,
  searchParams,
}: BrowseTrackPageProps) {
  const { track: trackParam } = params;
  const sp = searchParams || {};

  // 1. VALIDATION - Accept 'real-world' and 'digital' only
  const normalizedTrack = trackParam?.toLowerCase();
  if (normalizedTrack !== 'real-world' && normalizedTrack !== 'digital') {
    notFound();
  }
  
  // Map URL param to DB asset_type value (keep for UI logic)
  const assetTypeRoute: "real_world" | "digital" = normalizedTrack === 'real-world' ? 'real_world' : 'digital';
  const isRealWorld = assetTypeRoute === 'real_world';
  // Map to AssetTypeV17 for filters
  const assetTypeV17 = toAssetTypeV17(assetTypeRoute)!;

  // 2. FILTER TRANSLATION (URL -> V17 Filters)
  const categoryCode = sp.category as string | undefined;
  const subcategoryCode = sp.subcategory as string | undefined;

  // Resolve IDs (Legacy V16 logic, kept for safety)
  let categoryId: string | undefined;
  let subcategoryId: string | undefined;

  if (categoryCode) {
     try { categoryId = await getCategoryIdByCode(categoryCode) || undefined; } catch(e) {}
  }
  if (subcategoryCode) {
     try { subcategoryId = await getSubcategoryIdByCode(subcategoryCode) || undefined; } catch(e) {}
  }

  // Construct V17 Filters - use AssetTypeV17 (operational/digital)
  const v17Filters: SearchFiltersV17 = {
    query: sp.q as string,
    asset_type: assetTypeV17, // Mapped to AssetTypeV17: 'operational' or 'digital'
    min_price: sp.min_price ? Number(sp.min_price) : undefined,
    max_price: sp.max_price ? Number(sp.max_price) : undefined,
    category_id: categoryId,
    subcategory_id: subcategoryId,
    sort: (sp.sort as 'newest' | 'price_low' | 'price_high') || 'newest',
    limit: 20, // Default page size
    offset: sp.page ? (Number(sp.page) - 1) * 20 : undefined
  };

  // 3. DATA FETCHING (V17 Query)
  let listings: any[] = [];
  let total = 0;
  try {
    const result = await searchListingsV17(v17Filters);
    listings = result.items || [];
    total = result.total || 0;
  } catch (err) {
    console.warn("V17 Listing Fetch Error:", err);
    listings = [];
    total = 0;
  }

  // B. Facets come from V16 (Legacy)
  // We map the V17 filters back to V16 shape for the sidebar counts
  const v16FiltersForFacets = {
    assetType: assetTypeRoute === 'real_world' ? 'Operational' : 'Digital', // V16 uses Capitalized
    categoryId,
    subcategoryId,
    minPrice: v17Filters.min_price,
    maxPrice: v17Filters.max_price,
    query: v17Filters.query
  };

  let facets: any = { categoryCounts: {}, subcategoryCounts: {}, assetTypeCounts: {}, total: 0 };
  try {
    facets = await getBrowseFacetsV16(v16FiltersForFacets) || facets;
  } catch (err) {
    console.warn("V16 Facet Fetch Error:", err);
  }

  // 4. UI RENDER (Dark Mode to match Homepage)
  // Theme Engine
  const theme = {
    accent: isRealWorld ? 'text-amber-500' : 'text-teal-400',
    bg: isRealWorld ? 'bg-amber-500/10' : 'bg-teal-500/10',
    icon: isRealWorld ? Briefcase : Monitor
  };
  const Icon = theme.icon;
  const hasResults = listings.length > 0;

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
              {isRealWorld ? `${ASSET_TYPE_LABEL.real_world} Acquisitions` : `${ASSET_TYPE_LABEL.digital} Assets`}
            </h1>
          </div>
          <p className="text-slate-400 max-w-2xl">
            {isRealWorld 
              ? 'Discover verified gas stations, franchises, and industrial businesses.'
              : 'Discover vetted SaaS, e-commerce brands, and agency opportunities.'}
          </p>
        </div>

        <div className="flex gap-8 items-start">
          {/* SIDEBAR */}
          <aside className="w-64 shrink-0 sticky top-28 h-[calc(100vh-120px)] overflow-y-auto hidden md:block border-r border-slate-800 pr-4">
            {/* Note: FilterSidebar might need CSS updates for Dark Mode, but data flows here */}
            <FilterSidebar categoryCounts={facets.categoryCounts} />
          </aside>

          {/* MAIN GRID */}
          <main className="flex-1 min-w-0">
            <Suspense fallback={<div className="animate-pulse text-slate-500">Loading verified listings...</div>}>
              <BrowseClientShell 
                listings={listings} 
                emptyStateReason={!hasResults ? "no_results" : null}
                track={assetTypeRoute}
              />
            </Suspense>
          </main>
        </div>
      </div>
    </div>
  );
}