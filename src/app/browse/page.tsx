"use client";

import { useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import { getFilteredListings } from "@/app/actions/getFilteredListings";
import { ListingRow } from "@/components/listings/ListingRow";
import { FilterSidebar } from "@/components/browse/FilterSidebar";
import { PublicListing } from "@/types/listing";
import { Search } from "lucide-react";

// Define the asset types for validation
type AssetType = "physical" | "digital";

export default function BrowsePage() {
  const searchParams = useSearchParams();
  const urlAssetType = searchParams.get('assetType') as AssetType | null;
  // 🚨 NEW: Get the category parameter from the URL
  const urlCategory = searchParams.get('category') || 'all';

  // Determine the initial asset type filter based on the URL parameter
  const initialAssetType: AssetType = (
      urlAssetType && (urlAssetType === "physical" || urlAssetType === "digital")
  ) ? urlAssetType : "physical"; // Default to physical

  const [listings, setListings] = useState<PublicListing[]>([]);
  const [loading, setLoading] = useState(true);

  // Central Filter State - Initialized using the URL parameters
  const [filters, setFilters] = useState({
      type: initialAssetType, 
      // 🚨 CRITICAL CHANGE: Use the URL category for initial state
      category: urlCategory,
      // Price Filters
      minPrice: "",
      maxPrice: "",
      // Cash Flow Filters
      minCashFlow: "", 
      maxCashFlow: "",
      // Financing Filter
      hasFinancing: false,
      location: "",
      query: "",
      sort: "newest", 
  });

  // FIX for Initial Load: If the URL changes (e.g., switching assetType), reset filters
  useEffect(() => {
      const currentUrlAssetType = searchParams.get('assetType') as AssetType | null;
      const currentUrlCategory = searchParams.get('category') || 'all';
      
      if (currentUrlAssetType !== filters.type || currentUrlCategory !== filters.category) {
          setFilters(prevFilters => ({
              ...prevFilters,
              type: currentUrlAssetType && (currentUrlAssetType === "physical" || currentUrlAssetType === "digital") ? currentUrlAssetType : prevFilters.type,
              category: currentUrlCategory, // Set the specific category
          }));
      }
  }, [searchParams]);

  // Fetch Logic
  useEffect(() => {
    const fetchListings = async () => {
      setLoading(true);
      const payload: any = {
        query: filters.query,
        category: filters.category === "all" ? undefined : filters.category,
        // Pass the assetType filter
        assetType: filters.type,
        location: filters.location || undefined,
        minPrice: filters.minPrice ? Number(filters.minPrice) : undefined,
        maxPrice: filters.maxPrice ? Number(filters.maxPrice) : undefined,
      };

      try {
        const data = await getFilteredListings(payload);
        setListings(data as PublicListing[]);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    const timer = setTimeout(fetchListings, 400);
    return () => clearTimeout(timer);
  }, [filters]);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* 🔹 1. THEME HEADER (Dark Navy) */}
      <div className="bg-[#0B1120] pt-28 pb-12 text-white">
        <div className="container mx-auto px-4">
          <h1 className="text-3xl font-bold mb-2">Marketplace</h1>
          <p className="text-gray-400">
            {filters.type === "physical"
              ? "Discover verified physical assets and operational businesses."
              : "Explore SaaS, e-commerce, and digital assets."}
          </p>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* 🔹 2. LEFT SIDEBAR (The Smart Brain) */}
          <FilterSidebar filters={filters} setFilters={setFilters} />

          {/* 🔹 3. RIGHT CONTENT (Results) */}
          <main className="flex-grow">
            {/* Search Bar & Sort */}
            <div className="mb-6 flex gap-4">
              <div className="relative flex-grow">
                <Search
                  className="absolute left-4 top-3.5 text-gray-400"
                  size={20}
                />
                <input
                  type="text"
                  placeholder={`Search ${
                    filters.type === "physical"
                      ? "gas stations, retail..."
                      : "SaaS, apps..."
                  }`}
                  className="w-full pl-12 p-3.5 rounded-xl border border-gray-200 shadow-sm focus:ring-2 focus:ring-blue-600 outline-none"
                  value={filters.query}
                  onChange={(e) =>
                    setFilters({ ...filters, query: e.target.value })
                  }
                />
              </div>
              <select 
                className="hidden md:block w-48 p-3.5 rounded-xl border border-gray-200 bg-white font-medium text-gray-700"
                value={filters.sort}
                onChange={(e) => setFilters({...filters, sort: e.target.value})}
              >
                <option value="newest">Sort: Newest</option>
                <option value="price_asc">Price: Low to High</option>
                <option value="price_desc">Price: High to Low</option>
                <option value="cashflow_desc">Cashflow: High to Low</option> 
              </select>
            </div>

            {/* Active Filters Summary */}
            <div className="mb-4 flex flex-wrap gap-2">
              {filters.category !== "all" && (
                <span className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-xs font-bold flex items-center">
                  {filters.category}
                  <button
                    className="ml-2 hover:text-blue-900"
                    onClick={() => setFilters({ ...filters, category: "all" })}
                  >
                    ×
                  </button>
                </span>
              )}
              {filters.location && (
                <span className="px-3 py-1 bg-gray-100 text-gray-800 rounded-full text-xs font-bold">
                  📍 {filters.location}
                </span>
              )}
            </div>

            {/* Results List */}
            <div className="space-y-4">
              {loading ? (
                <div className="py-20 text-center">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#F97316] mx-auto mb-4"></div>
                  <p className="text-gray-500 text-sm">Sourcing deals...</p>
                </div>
              ) : listings.length === 0 ? (
                <div className="text-center py-20 bg-white rounded-xl border border-gray-200 border-dashed">
                  <p className="text-lg font-medium text-gray-900">
                    No matches found.
                  </p>
                  <p className="text-sm text-gray-500 mt-1">
                    Adjust your filters to see more opportunities.
                  </p>
                  <button
                    onClick={() =>
                      setFilters({
                        ...filters,
                        category: "all",
                        minPrice: "",
                        location: "",
                      })
                    }
                    className="mt-4 text-[#F97316] font-bold text-sm hover:underline"
                  >
                    Clear all filters
                  </button>
                </div>
              ) : (
                listings.map((listing) => (
                  <ListingRow key={listing.id} listing={listing} />
                ))
              )}
            </div>
          </main>
        </div>
      </div>
    </div>
  );
}