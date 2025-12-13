"use client";

import { useEffect, useState } from "react";
import type { BrowseFilters } from "@/app/actions/listings";
import { getFilteredListings } from "@/app/actions/listings";
import ListingsSkeletonGrid from "@/components/listings/ListingsSkeletonGrid";
import ListingCard from "@/components/listings/ListingCard";
import BrowseFilters from "@/components/listings/BrowseFilters";

export default function BrowseClient() {
  const [filters, setFilters] = useState<BrowseFilters>({});
  const [listings, setListings] = useState<any[] | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setLoading(true);
    getFilteredListings(filters).then((data) => {
      setListings(data);
      setLoading(false);
    });
  }, [filters]);

  function handleFiltersChange(newFilters: BrowseFilters) {
    setFilters((prev) => ({ ...prev, ...newFilters }));
  }

  return (
    <main className="mx-auto max-w-6xl px-4 py-8">
      <h1 className="text-2xl font-semibold text-gray-900 mb-4">Browse Listings</h1>
      <BrowseFilters onChange={handleFiltersChange} values={filters} />
      <div className="mt-6">
        {loading || !listings ? (
          <ListingsSkeletonGrid />
        ) : listings.length === 0 ? (
          <div className="rounded-xl border border-gray-200 bg-white p-8 text-center">
            <p className="text-gray-700 font-medium">No listings found.</p>
            <p className="mt-1 text-sm text-gray-500">Try loosening filters or clearing search.</p>
          </div>
        ) : (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {listings.map((listing) => (
              <ListingCard key={listing.id} listing={listing} />
            ))}
          </div>
        )}
      </div>
    </main>
  );
}
