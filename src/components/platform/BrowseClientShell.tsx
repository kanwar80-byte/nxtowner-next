"use client";

import dynamic from "next/dynamic";
import ListingRow from "./ListingRow";

// Bridge to handle dynamic client components without SSR errors
const ComparisonQueue = dynamic(() => import("./ComparisonQueue"), { 
  ssr: false,
  loading: () => <div className="w-80 h-64 bg-slate-50 animate-pulse rounded-lg" />
});

export default function BrowseClientShell({ listings }: { listings: any[] }) {
  return (
    <div className="flex gap-8 items-start w-full">
      {/* Scrollable container for high-density rows */}
      <div className="flex-1 min-w-0 bg-white rounded-xl border shadow-sm overflow-hidden">
        {/* min-w-[1024px] ensures metrics (Price, EBITDA, Multiples) don't squash */}
        <div className="overflow-x-auto">
          <div className="min-w-[1024px]">
            {listings.length > 0 ? (
              listings.map((item) => (
                <ListingRow key={item.id} listing={item} />
              ))
            ) : (
              <div className="p-20 text-center text-slate-500">No matching deals found.</div>
            )}
          </div>
        </div>
      </div>
      
      {/* Sticky Intelligence Sidebar (Right Column) */}
      <aside className="hidden lg:block w-80 sticky top-28 h-fit">
        <ComparisonQueue />
      </aside>
    </div>
  );
}