import BrowseClientShell from "@/components/platform/BrowseClientShell";
import FilterSidebar from "@/components/platform/FilterSidebar";
import { fetchListings } from "@/lib/db/listings";
import { Suspense } from "react";

type BrowseSearchParams = {
  assetType?: string;
  asset_type?: string;
  q?: string;
  category?: string;
  ai_verified?: string;
};

function normalizeAssetType(sp: BrowseSearchParams) {
  const raw = (sp.asset_type || sp.assetType || "all").toLowerCase().trim();
  if (raw === "physical") return "Operational";
  if (raw === "operational") return "Operational";
  if (raw === "digital") return "Digital";
  return "all";
}

function normalizeCategory(raw?: string) {
  if (!raw) return "";
  const s = raw.trim();
  if (!s) return "";
  if (s.includes("-")) {
    return s
      .split("-")
      .filter(Boolean)
      .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
      .join(" ");
  }
  return s;
}

function truthy(v?: string) {
  if (!v) return false;
  const s = v.toLowerCase().trim();
  return s === "1" || s === "true" || s === "yes";
}

  // NOTE: Adapter currently only supports full fetch. Filtering can be added to adapter if needed.
  const { data: listings, error } = await fetchListings();
  if (error) console.error(error);

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
            <FilterSidebar />
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

