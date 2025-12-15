"use client";

import { useEffect, useState, useCallback } from "react";
// Fix: Import the correct type we defined in the server action
import { getFilteredListings, type SearchFilters } from "@/app/actions/getFilteredListings";
import Link from "next/link";
import { PublicListing } from "@/types/listing";
import { WatchlistButton } from "@/components/listings/WatchlistButton";
import Image from "next/image";

// Fix: Define the local state type exactly as we want it
type BrowseFiltersState = {
  assetType: string; // Matches 'deal_type'
  category: string;
  sort: string;
  minPrice?: number;
  maxPrice?: number;
  minCashflow?: number;
  minRevenue?: number;
  query: string;
  location: string; // Added location to state
};

export default function BrowsePage() {
  const [listings, setListings] = useState<PublicListing[]>([]);
  const [loading, setLoading] = useState(true);

  // Fix: Initialize state with all required fields
  const [filters, setFilters] = useState<BrowseFiltersState>({
    assetType: "all",
    category: "All Categories",
    sort: "newest",
    minPrice: undefined,
    maxPrice: undefined,
    minCashflow: undefined,
    minRevenue: undefined,
    query: "",
    location: "", // Initialize location
  });

  // Debounce helper to prevent too many API calls while typing
  useEffect(() => {
    const fetchListings = async () => {
      setLoading(true);
      try {
        // Fix: Map local state to Server Action payload
        // This removes any extra fields that might confuse the server
        const payload: SearchFilters = {
          assetType: filters.assetType === "all" ? undefined : filters.assetType,
          category: filters.category === "All Categories" ? undefined : filters.category,
          sort: filters.sort,
          minPrice: filters.minPrice,
          maxPrice: filters.maxPrice,
          minCashflow: filters.minCashflow,
          minRevenue: filters.minRevenue,
          query: filters.query || undefined,
          location: filters.location || undefined,
        };

        const data = await getFilteredListings(payload);
        setListings(data as PublicListing[]);
      } catch (error) {
        console.error("Failed to fetch listings:", error);
      } finally {
        setLoading(false);
      }
    };

    const debounceTimer = setTimeout(() => {
      fetchListings();
    }, 500); // Wait 500ms after last change

    return () => clearTimeout(debounceTimer);
  }, [filters]);

  const handleFilterChange = (key: keyof BrowseFiltersState, value: any) => {
    setFilters((prev) => ({ ...prev, [key]: value }));
  };

  return (
    <div className="min-h-screen bg-gray-50 pb-20 pt-24">
      <div className="container mx-auto px-4">
        
        {/* HEADER & FILTERS */}
        <div className="mb-8 rounded-xl bg-white p-6 shadow-sm">
          <h1 className="mb-6 text-3xl font-bold text-gray-900">Browse Listings</h1>
          
          {/* Top Row: Search & Location */}
          <div className="mb-4 grid gap-4 md:grid-cols-2">
            <input
              type="text"
              placeholder="Search by keyword..."
              className="rounded-lg border border-gray-300 p-3"
              value={filters.query}
              onChange={(e) => handleFilterChange("query", e.target.value)}
            />
            <input
              type="text"
              placeholder="Location (e.g. Toronto, Remote)"
              className="rounded-lg border border-gray-300 p-3"
              value={filters.location}
              onChange={(e) => handleFilterChange("location", e.target.value)}
            />
          </div>

          {/* Bottom Row: Dropdowns */}
          <div className="grid gap-4 md:grid-cols-4">
            <select
              className="rounded-lg border border-gray-300 p-3"
              value={filters.assetType}
              onChange={(e) => handleFilterChange("assetType", e.target.value)}
            >
              <option value="all">All Types</option>
              <option value="asset">Physical Business</option>
              <option value="digital">Digital / Online</option>
            </select>

            <select
              className="rounded-lg border border-gray-300 p-3"
              value={filters.category}
              onChange={(e) => handleFilterChange("category", e.target.value)}
            >
              <option value="All Categories">All Categories</option>
              <option value="Retail">Retail</option>
              <option value="SaaS">SaaS</option>
              <option value="E-commerce">E-commerce</option>
              <option value="Service">Service</option>
              <option value="Restaurant">Restaurant</option>
            </select>

            <select
              className="rounded-lg border border-gray-300 p-3"
              value={filters.sort}
              onChange={(e) => handleFilterChange("sort", e.target.value)}
            >
              <option value="newest">Newest Listed</option>
              <option value="oldest">Oldest Listed</option>
              <option value="lowest_price">Lowest Price</option>
              <option value="highest_price">Highest Price</option>
            </select>
          </div>
        </div>

        {/* LISTINGS GRID */}
        {loading ? (
          <div className="py-20 text-center text-gray-500">Loading listings...</div>
        ) : listings.length === 0 ? (
          <div className="py-20 text-center text-gray-500">
            No listings found matching your criteria.
          </div>
        ) : (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {listings.map((listing) => (
              <Link
                key={listing.id}
                href={`/listings/${listing.id}`}
                className="group relative block overflow-hidden rounded-xl bg-white shadow-sm transition hover:shadow-md"
              >
                {/* Image Area */}
                <div className="relative h-48 bg-gray-200">
                  {listing.image_url ? (
                    <Image
                      src={listing.image_url}
                      alt={listing.title}
                      fill
                      className="object-cover transition group-hover:scale-105"
                    />
                  ) : (
                    <div className="flex h-full items-center justify-center text-gray-400">
                      No Image
                    </div>
                  )}
                  <div className="absolute top-2 right-2">
                    <WatchlistButton listingId={listing.id} />
                  </div>
                </div>

                {/* Content Area */}
                <div className="p-5">
                  <div className="mb-2 flex items-center justify-between">
                    <span className="text-xs font-semibold uppercase tracking-wider text-blue-600">
                      {listing.category}
                    </span>
                    <span className="text-xs text-gray-500">
                      {listing.deal_type === 'digital' ? '🌐 Online' : '🏢 ' + listing.location}
                    </span>
                  </div>
                  
                  <h3 className="mb-2 text-lg font-bold text-gray-900 group-hover:text-blue-600">
                    {listing.title}
                  </h3>

                  <div className="mt-4 border-t border-gray-100 pt-4">
                    <p className="text-xl font-bold text-gray-900">
                      ${listing.price?.toLocaleString() ?? "Contact"}
                    </p>
                    {listing.cashflow_numeric && (
                      <p className="text-sm text-green-600">
                        Cashflow: ${listing.cashflow_numeric.toLocaleString()}
                      </p>
                    )}
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}