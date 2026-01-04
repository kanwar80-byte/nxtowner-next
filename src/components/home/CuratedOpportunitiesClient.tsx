/**
 * PURPOSE: Renders the "Featured Opportunities" section on the homepage
 * NOTE: Legacy filename (CuratedOpportunitiesClient) retained to avoid breaking imports
 * TODO (post-V17): Rename file to FeaturedOpportunitiesClient.tsx for clarity
 */
'use client';

import { ArrowRight } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { useTrack } from "@/contexts/TrackContext";
import type { ListingTeaserV16 } from "@/lib/v16/types";

export default function CuratedOpportunitiesClient({ listings }: { listings: ListingTeaserV16[] }) {
  const { track } = useTrack();

  // Filter listings based on track
  // Track is determined by: listing.asset_type (field: 'operational' | 'digital')
  // If asset_type is missing/null, mapper normalizes to 'operational' by default
  const filteredListings = listings.filter((listing) => {
    if (track === 'all') return true;
    // Defensive: if asset_type is missing, treat as 'operational' (safer default)
    const listingTrack = listing.asset_type || 'operational';
    return listingTrack === track;
  });

  // Limit to 3 for display (standardized grid)
  const displayListings = filteredListings.slice(0, 3);

  if (displayListings.length === 0) {
    return (
      <section className="py-14 lg:py-20 bg-[#0B1221]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold text-white mb-4">Featured Opportunities</h2>
          <p className="text-slate-400 mb-6">No featured {track !== 'all' ? track : ''} listings found right now.</p>
          <Link
            href={track === 'all' ? '/browse' : `/browse?asset_type=${track}`}
            className="inline-block px-6 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition"
          >
            Browse All Listings
          </Link>
        </div>
      </section>
    );
  }

  return (
    <section className="py-14 lg:py-20 bg-[#0B1221] border-t border-white/10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-start mb-6 lg:mb-8">
          <div>
            <h2 className="text-3xl font-bold text-white">Featured Opportunities</h2>
            <p className="text-slate-400 mt-2">Hand-picked for financial health and readiness.</p>
          </div>
          <Link
            href={track === 'all' ? '/browse?sort=newest' : `/browse?asset_type=${track}&sort=newest`}
            className="text-blue-500 font-bold flex items-center gap-1 hover:text-blue-400 hover:gap-2 transition-all text-sm"
          >
            View All <ArrowRight size={16} />
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {displayListings.map((deal) => (
            <Link
              key={deal.id}
              href={`/listing/${deal.id}`}
              className="block bg-white rounded-2xl overflow-hidden hover:-translate-y-1 transition-transform h-full"
            >
              <div className="aspect-[4/3] bg-slate-200 relative w-full">
                {deal.hero_image_url ? (
                  <Image
                    src={deal.hero_image_url}
                    fill
                    className="object-cover"
                    alt={deal.title || "Listing"}
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-slate-200 to-slate-400 text-slate-500 text-sm">
                    No Image
                  </div>
                )}
                <div className="absolute top-4 left-4 flex gap-2">
                  {deal.subcategory || deal.category ? (
                    <div className="bg-white/90 px-2 py-1 rounded text-xs font-bold">
                      {deal.subcategory || deal.category || "Business"}
                    </div>
                  ) : null}
                  {/* Track badge - only show when track = 'all' */}
                  {track === 'all' && deal.asset_type && (
                    <div className={`px-2 py-1 rounded text-xs font-bold ${
                      deal.asset_type === 'operational' 
                        ? 'bg-blue-100 text-blue-700' 
                        : 'bg-purple-100 text-purple-700'
                    }`}>
                      {deal.asset_type === 'operational' ? 'Operational' : 'Digital'}
                    </div>
                  )}
                </div>
              </div>

              <div className="p-5">
                <h3 className="font-bold text-slate-900 mb-2 line-clamp-1">
                  {deal.title || "Untitled Listing"}
                </h3>
                {(() => {
                  const loc = [deal.city, deal.province].filter(Boolean).join(", ");
                  return <p className="text-xs text-slate-500 mb-2">{loc || "Canada"}</p>;
                })()}

                <div className="flex justify-between pt-4 border-t border-slate-100">
                  <div>
                    <p className="text-xs text-slate-500 uppercase">Price</p>
                    <p className="font-bold">
                      {typeof deal.asking_price === "number" ? `$${deal.asking_price.toLocaleString()}` : "Confidential"}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-xs text-slate-500 uppercase">Cash Flow</p>
                    <p className="font-bold text-green-600">
                      {typeof deal.cash_flow === "number" ? `$${deal.cash_flow.toLocaleString()}` : "-"}
                    </p>
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}

