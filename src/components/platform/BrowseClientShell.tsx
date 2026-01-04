"use client";

import dynamic from "next/dynamic";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import ListingRow from "./ListingRow";

// Bridge to handle dynamic client components without SSR errors
const ComparisonQueue = dynamic(() => import("./ComparisonQueue"), { 
  ssr: false,
  loading: () => <div className="w-80 h-64 bg-slate-50 animate-pulse rounded-lg" />
});

type EmptyStateReason = "no_public_listings" | "fetch_error" | "no_results" | null;

interface BrowseClientShellProps {
  listings: any[];
  emptyStateReason?: EmptyStateReason;
  track?: 'operational' | 'digital' | null;
}

export default function BrowseClientShell({ 
  listings,
  emptyStateReason = null,
  track = null
}: BrowseClientShellProps) {
  const router = useRouter();
  const [isSeeding, setIsSeeding] = useState(false);

  const handleSeed = async () => {
    setIsSeeding(true);
    try {
      const response = await fetch('/api/dev/seed', { method: 'POST' });
      if (response.ok) {
        // Wait a moment for seed to complete, then refresh
        setTimeout(() => {
          router.refresh();
        }, 1000);
      } else {
        const data = await response.json().catch(() => ({}));
        alert(data.error || 'Seed failed. Check console for details.');
      }
    } catch (error) {
      alert('Seed request failed.');
    } finally {
      setIsSeeding(false);
    }
  };

  // Show empty state if no listings and we have a reason
  if (listings.length === 0 && emptyStateReason) {
    return (
      <div className="flex gap-8 items-start w-full">
        <div className="flex-1 min-w-0 bg-white rounded-xl border shadow-sm overflow-hidden">
          <div className="p-16 text-center">
            {emptyStateReason === "no_public_listings" ? (
              <>
                <div className="max-w-md mx-auto">
                  <h2 className="text-2xl font-bold text-slate-900 mb-3">
                    No listings published yet.
                  </h2>
                  <p className="text-slate-600 mb-8">
                    Be the first to list your business opportunity on NxtOwner.
                  </p>
                  <div className="flex flex-col sm:flex-row gap-4 justify-center">
                    <button
                      onClick={() => router.push("/sell")}
                      className="inline-flex items-center justify-center px-6 py-3 bg-[#0B1221] text-white font-semibold rounded-lg hover:bg-[#0F172A] transition-colors"
                    >
                      Create a Listing
                    </button>
                    {process.env.NODE_ENV === "development" && (
                      <button
                        onClick={handleSeed}
                        disabled={isSeeding}
                        className="inline-flex items-center justify-center px-6 py-3 bg-orange-500 text-white font-semibold rounded-lg hover:bg-orange-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        {isSeeding ? "Seeding..." : "Run Sample Seed (Dev)"}
                      </button>
                    )}
                  </div>
                </div>
              </>
            ) : emptyStateReason === "fetch_error" ? (
              <>
                <div className="max-w-md mx-auto">
                  <h2 className="text-2xl font-bold text-slate-900 mb-3">
                    We couldn&apos;t load listings right now.
                  </h2>
                  <p className="text-slate-600 mb-8">
                    Please try again in a moment.
                  </p>
                  <div className="flex flex-col sm:flex-row gap-4 justify-center">
                    <button
                      onClick={() => router.refresh()}
                      className="inline-flex items-center justify-center px-6 py-3 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition-colors"
                    >
                      Retry
                    </button>
                    <Link
                      href="/contact"
                      className="inline-flex items-center justify-center px-6 py-3 bg-slate-100 text-slate-900 font-semibold rounded-lg hover:bg-slate-200 transition-colors"
                    >
                      Contact support
                    </Link>
                  </div>
                </div>
              </>
            ) : (
              <>
                <div className="max-w-md mx-auto">
                  <h2 className="text-2xl font-bold text-slate-900 mb-3">
                    No listings match your filters.
                  </h2>
                  <p className="text-slate-600 mb-8">
                    Try adjusting your search criteria or browse all listings.
                  </p>
                  <div className="flex flex-col sm:flex-row gap-4 justify-center">
                    <button
                      onClick={() => {
                        // Reset to track-specific browse page if on track route, otherwise general browse
                        const resetUrl = track ? `/browse/${track}` : '/browse';
                        router.push(resetUrl);
                      }}
                      className="inline-flex items-center justify-center px-6 py-3 bg-[#0B1221] text-white font-semibold rounded-lg hover:bg-[#0F172A] transition-colors"
                    >
                      Reset Filters
                    </button>
                  </div>
                </div>
              </>
            )}
          </div>
        </div>
        
        {/* Sticky Intelligence Sidebar (Right Column) */}
        <aside className="hidden lg:block w-80 sticky top-28 h-fit">
          <ComparisonQueue />
        </aside>
      </div>
    );
  }

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
