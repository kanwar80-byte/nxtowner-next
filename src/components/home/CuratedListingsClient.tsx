/**
 * PURPOSE: Renders the "Curated Opportunities" section on the homepage
 * NOTE: Legacy filename retained to avoid breaking imports
 * TODO (post-V17): Consider renaming to CuratedOpportunitiesClient.tsx for consistency
 */
'use client';

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { useSearchParams } from "next/navigation";
import { useTrack } from "@/contexts/TrackContext";
import type { ListingTeaserV16 } from "@/lib/v16/types";

export default function CuratedListingsClient({ listings }: { listings: ListingTeaserV16[] }) {
  const DEBUG_LISTINGS = process.env.NEXT_PUBLIC_DEBUG_LISTINGS === "1";
  const { track } = useTrack();

  // Normalize selection state
  const [selectedCategoryId, setSelectedCategoryId] = useState<string>("all");
  const [selectedSubcategoryId, setSelectedSubcategoryId] = useState<string>("all");

  const searchParams = useSearchParams();

  // Sync selection from query params (if pills use links); default to 'all'
  useEffect(() => {
    const categoryParam =
      searchParams.get("category_id") ||
      searchParams.get("category") ||
      "all";
    const subcategoryParam =
      searchParams.get("subcategory_id") ||
      searchParams.get("subcategory") ||
      "all";
    setSelectedCategoryId(categoryParam);
    setSelectedSubcategoryId(subcategoryParam);
  }, [searchParams]);

  // Filter listings based on track
  // Track is determined by: listing.asset_type (field: 'operational' | 'digital')
  const assetMode = track === "digital" ? "digital" : "operational";

  const filteredListings = useMemo(() => {
    const byAsset = listings.filter((listing) => {
      if (assetMode === "digital") return listing.asset_type === "digital";
      return listing.asset_type === "operational" || listing.asset_type == null;
    });

    const byCategory = byAsset.filter((listing) => {
      const categoryOk = selectedCategoryId === "all" || listing.category_id === selectedCategoryId;
      const subcategoryOk = selectedSubcategoryId === "all" || listing.subcategory_id === selectedSubcategoryId;
      return categoryOk && subcategoryOk;
    });

    if (DEBUG_LISTINGS) {
      console.log("[CuratedListingsClient] filter", {
        assetMode,
        selectedCategoryId,
        selectedSubcategoryId,
        total: listings.length,
        filtered: byCategory.length,
      });
    }

    return byCategory;
  }, [assetMode, listings, selectedCategoryId, selectedSubcategoryId, DEBUG_LISTINGS]);

  // Limit to 3 listings for display (standardized grid)
  const displayListings = filteredListings.slice(0, 3);

  if (displayListings.length === 0) {
    return (
      <section className="py-14 lg:py-20 bg-[#F8FAFC]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center py-12">
            <h2 className="text-3xl md:text-4xl font-extrabold text-[#0A122A] mb-4">
              Curated Opportunities
            </h2>
            <p className="text-slate-600 mb-6">No featured {track !== 'all' ? track : ''} listings available at this time.</p>
            <Link
              href={track === 'all' ? '/browse' : `/browse?asset_type=${track}`}
              className="inline-flex items-center gap-1 text-sm font-semibold text-orange-500 hover:text-orange-600 transition"
            >
              Browse all listings <span aria-hidden>→</span>
            </Link>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="py-14 lg:py-20 bg-[#F8FAFC] border-t border-slate-200/60">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row md:items-start justify-between gap-4 mb-6 lg:mb-8">
          <div>
            <div className="text-xs uppercase tracking-widest text-orange-400/90 font-bold mb-2">
              Featured Collection
            </div>
            <h2 className="text-3xl md:text-4xl font-extrabold text-[#0A122A]">
              Curated Opportunities
            </h2>
            <p className="text-sm md:text-base text-slate-600 mt-3 max-w-2xl">
              Hand-picked operational and digital assets that match what acquisition-focused buyers are looking for right now.
            </p>
          </div>
          <Link
            href={track === 'all' ? '/browse' : `/browse?asset_type=${track}`}
            className="inline-flex items-center gap-1 text-sm font-semibold text-orange-500 hover:text-orange-600 transition"
          >
            View all <span aria-hidden>→</span>
          </Link>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {displayListings.map((listing, idx) => {
            // Format price
            const price = listing.asking_price 
              ? `$${listing.asking_price.toLocaleString()}` 
              : 'Confidential';
            
            // Format revenue (from revenue_annual)
            const revenue = listing.revenue_annual 
              ? `$${(listing.revenue_annual / 1000000).toFixed(1)}M` 
              : 'N/A';
            
            // Format profit (from cash_flow)
            const profit = listing.cash_flow 
              ? `$${(listing.cash_flow / 1000).toFixed(0)}K` 
              : 'N/A';
            
            // Format location
            const location = [listing.city, listing.province].filter(Boolean).join(', ') || 'Canada';
            
            // Get image URL
            const imageUrl = listing.hero_image_url || listing.heroImageUrl || listing.image_url;
            
            return (
              <Link
                key={listing.id}
                href={`/listing/${listing.id}`}
                className="bg-white rounded-2xl border border-white/10 shadow-sm hover:shadow-md hover:-translate-y-1 transition-all duration-300 overflow-hidden group flex flex-col h-full"
                style={{ animationDelay: `${idx * 80}ms` }}
              >
                <div className="relative aspect-[16/9] bg-gray-200 overflow-hidden">
                  {imageUrl ? (
                    <Image
                      src={imageUrl}
                      alt={listing.title || "Listing"}
                      fill
                      className="object-cover group-hover:scale-105 transition-transform duration-500"
                      sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-slate-200 to-slate-400 text-slate-500 text-sm">
                      No Image
                    </div>
                  )}
                  <div className="absolute top-3 left-3 flex gap-2">
                    {/* Track badge - only show when track = 'all' */}
                    {track === 'all' && listing.asset_type && (
                      <span className={`px-2 py-1 text-xs font-semibold rounded ${
                        listing.asset_type === 'operational' 
                          ? 'bg-blue-100 text-blue-700' 
                          : 'bg-purple-100 text-purple-700'
                      }`}>
                        {listing.asset_type === 'operational' ? 'Operational' : 'Digital'}
                      </span>
                    )}
                  </div>
                </div>
                <div className="p-5 flex flex-col flex-1 min-h-[160px]">
                  <div className="text-2xl font-semibold text-[#F97316]">{price}</div>
                  <h3 className="font-semibold text-gray-900 leading-snug line-clamp-2">
                    {listing.title || "Untitled Listing"}
                  </h3>
                  <div className="text-sm text-gray-600 space-y-1 pt-1">
                    <div className="flex justify-between">
                      <span>Revenue:</span>
                      <span className="font-semibold">{revenue}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Cash Flow:</span>
                      <span className="font-semibold">{profit}</span>
                    </div>
                    <div className="text-gray-500 pt-1">📍 {location}</div>
                  </div>
                  <div className="pt-3 mt-auto">
                    <span className="inline-flex items-center gap-2 text-sm font-semibold text-[#0A122A]">
                      View Details <span aria-hidden>→</span>
                    </span>
                  </div>
                </div>
              </Link>
            );
          })}
        </div>
      </div>
    </section>
  );
}


