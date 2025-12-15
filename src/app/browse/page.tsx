"use client";

import { useEffect, useState, useCallback } from "react";
import { getFilteredListings, type BrowseFilters } from "@/app/actions/listings";
import Link from "next/link";
import { PublicListing } from "@/types/listing";
import { WatchlistButton } from "@/components/listings/WatchlistButton";
import ListingBadges from "@/components/ListingBadges";

type SearchMode = "default" | "ai";

const CATEGORIES = [
  { value: "all", label: "All Categories" },
  { value: "gas_station", label: "Gas Stations & C-Stores" },
  { value: "car_wash", label: "Car Wash & Auto" },
  { value: "qsr", label: "QSR & Restaurants" },
  { value: "saas", label: "SaaS & Software" },
  { value: "ecommerce", label: "E-commerce & DTC" },
  { value: "other", label: "Other" },
];

const TYPES = [
  { value: "all", label: "All Types" },
  { value: "asset", label: "Physical Asset" },
  { value: "digital", label: "Digital Business" },
];

const SORT_OPTIONS = [
  { value: "featured", label: "Featured First" },
  { value: "newest", label: "Newest First" },
  { value: "price_asc", label: "Price: Low to High" },
  { value: "price_desc", label: "Price: High to Low" },
  { value: "revenue", label: "Highest Revenue" },
  { value: "cashflow", label: "Highest Cashflow" },
];

const PRICE_RANGES = [
  { label: "Any Price", min: undefined, max: undefined },
  { label: "Under $250k", min: undefined, max: 250000 },
  { label: "$250k – $1M", min: 250000, max: 1000000 },
  { label: "$1M – $5M", min: 1000000, max: 5000000 },
  { label: "$5M+", min: 5000000, max: undefined },
];

export default function BrowsePage() {
  const [listings, setListings] = useState<PublicListing[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // AI search state
  const [searchMode, setSearchMode] = useState<SearchMode>("default");
  const [aiQuery, setAiQuery] = useState("");
  const [aiLoading, setAiLoading] = useState(false);
  const [aiError, setAiError] = useState<string | null>(null);

  // Filter state
  const [filters, setFilters] = useState<BrowseFilters>({
    type: "all",
    category: "all",
    sort: "newest",
    minPrice: undefined,
    maxPrice: undefined,
    location: "",
  });

  const [showAdvancedFilters, setShowAdvancedFilters] = useState(false);

  // Fetch listings with current filters
  const fetchListings = useCallback(async () => {
    setLoading(true);
    setError(null);

    // ✅ normalize "all" → undefined so server action doesn't filter wrongly
    const normalized: BrowseFilters = {
      ...filters,
      type: filters.type === "all" ? undefined : filters.type,
      category: filters.category === "all" ? undefined : filters.category,
      sort: filters.sort || "newest",
      location: (filters.location || "").trim(),
    };

    const data = await getFilteredListings(normalized);
    setListings(data);
    setLoading(false);
  }, [filters]);

  // Load initial listings
  useEffect(() => {
    if (searchMode === "default") {
      fetchListings();
    }
  }, [searchMode, fetchListings]);

  const handleFilterChange = (newFilters: Partial<BrowseFilters>) => {
    setFilters((prev) => ({ ...prev, ...newFilters }));
  };

  const handleResetFilters = () => {
    setFilters({
      type: undefined,
      category: undefined,
      sort: "newest",
      minPrice: undefined,
      maxPrice: undefined,
      location: "",
    });
  };

  const handleAISearch = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!aiQuery.trim()) {
      setAiError("Please enter a search query");
      return;
    }

    setAiLoading(true);
    setAiError(null);
    setError(null);

    try {
      const response = await fetch("/api/ai-search-listings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ query: aiQuery }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "AI search failed");
      }

      if (data.success) {
        setListings(data.results as PublicListing[]);
        setSearchMode("ai");

        if (data.results.length === 0) {
          setAiError(
            "No results found for this AI query. Try another phrase or use regular filters."
          );
        }
      } else {
        throw new Error("Unexpected response from AI search");
      }
    } catch (err) {
      console.error("AI search error:", err);
      setAiError(
        err instanceof Error
          ? err.message
          : "Failed to process AI search"
      );
    } finally {
      setAiLoading(false);
    }
  };

  const handleClearAISearch = () => {
    setSearchMode("default");
    setAiQuery("");
    setAiError(null);
    setListings([]);
  };

  const formatPrice = (price: number | null) => {
    if (price === null) return "Price on request";
    return price.toLocaleString("en-CA", {
      style: "currency",
      currency: "CAD",
      maximumFractionDigits: 0,
    });
  };

  const isFiltersActive =
    !!filters.type ||
    !!filters.category ||
    filters.minPrice !== undefined ||
    filters.maxPrice !== undefined ||
    (filters.location && filters.location.trim());

  return (
    <main className="bg-brand-bg min-h-screen py-16 md:py-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-10">
          <h1 className="text-3xl md:text-4xl font-bold text-brand-text">
            Browse Listings
          </h1>
          <p className="text-brand-muted mt-2">
            Explore verified physical and digital businesses ready for new owners.
          </p>
        </div>

        {/* AI Search Section */}
        <section className="mb-8 bg-white rounded-xl border border-brand-border p-6 shadow-sm">
          <form onSubmit={handleAISearch} className="flex flex-col md:flex-row gap-3">
            <div className="flex-1">
              <label
                htmlFor="ai-search"
                className="block text-sm font-medium text-brand-text mb-2"
              >
                🤖 AI-Powered Search
              </label>
              <input
                id="ai-search"
                type="text"
                value={aiQuery}
                onChange={(e) => setAiQuery(e.target.value)}
                className="w-full px-4 py-3 rounded-md border border-brand-border bg-white text-brand-text placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-brand-orange"
                placeholder="Try: 'profitable gas station under 3M in Ontario' or 'SaaS business with recurring revenue'"
                disabled={aiLoading}
              />
            </div>
            <div className="flex gap-2 items-end">
              <button
                type="submit"
                disabled={aiLoading || !aiQuery.trim()}
                className="px-6 py-3 bg-brand-orange text-white font-semibold rounded-md hover:bg-orange-600 transition disabled:opacity-50 disabled:cursor-not-allowed whitespace-nowrap"
              >
                {aiLoading ? "Searching..." : "AI Search"}
              </button>
              {searchMode === "ai" && (
                <button
                  type="button"
                  onClick={handleClearAISearch}
                  className="px-6 py-3 bg-gray-100 text-brand-text font-semibold rounded-md hover:bg-gray-200 transition whitespace-nowrap"
                >
                  Clear
                </button>
              )}
            </div>
          </form>

          {aiError && (
            <div className="mt-3 bg-yellow-50 border border-yellow-200 text-yellow-800 px-4 py-2 rounded-md text-sm">
              {aiError}
            </div>
          )}

          {searchMode === "ai" && !aiError && (
            <div className="mt-3 text-sm text-brand-muted">
              ✨ Showing AI-filtered results for:{" "}
              <span className="font-medium text-brand-text">&quot;{aiQuery}&quot;</span>
            </div>
          )}
        </section>

        {/* Filter Section - Only show in default mode */}
        {searchMode === "default" && (
          <section className="mb-8 space-y-4">
            {/* Quick Filters */}
            <div className="bg-white rounded-xl border border-brand-border p-4 md:p-6 shadow-sm">
              <div className="grid grid-cols-1 md:grid-cols-5 gap-4 mb-4">
                {/* Type */}
                <div>
                  <label className="block text-xs font-semibold text-brand-text uppercase tracking-wide mb-2">
                    Business Type
                  </label>
                  <select
                    value={filters.type ?? "all"}
                    onChange={(e) =>
                      handleFilterChange({ type: e.target.value === "all" ? undefined : e.target.value })
                    }
                    className="w-full px-3 py-2 rounded-md border border-brand-border bg-white text-sm text-brand-text focus:outline-none focus:ring-2 focus:ring-brand-orange"
                  >
                    {TYPES.map((t) => (
                      <option key={t.value} value={t.value}>
                        {t.label}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Category */}
                <div>
                  <label className="block text-xs font-semibold text-brand-text uppercase tracking-wide mb-2">
                    Category
                  </label>
                  <select
                    value={filters.category ?? "all"}
                    onChange={(e) =>
                      handleFilterChange({ category: e.target.value === "all" ? undefined : e.target.value })
                    }
                    className="w-full px-3 py-2 rounded-md border border-brand-border bg-white text-sm text-brand-text focus:outline-none focus:ring-2 focus:ring-brand-orange"
                  >
                    {CATEGORIES.map((c) => (
                      <option key={c.value} value={c.value}>
                        {c.label}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Price Range */}
                <div>
                  <label className="block text-xs font-semibold text-brand-text uppercase tracking-wide mb-2">
                    Price Range
                  </label>
                  <select
                    value={
                      filters.minPrice === undefined && filters.maxPrice === undefined
                        ? "all"
                        : `${filters.minPrice}-${filters.maxPrice}`
                    }
                    onChange={(e) => {
                      const range = PRICE_RANGES.find((r) =>
                        e.target.value === "all"
                          ? r.min === undefined && r.max === undefined
                          : `${r.min}-${r.max}` === e.target.value
                      );
                      if (range) {
                        handleFilterChange({
                          minPrice: range.min,
                          maxPrice: range.max,
                        });
                      }
                    }}
                    className="w-full px-3 py-2 rounded-md border border-brand-border bg-white text-sm text-brand-text focus:outline-none focus:ring-2 focus:ring-brand-orange"
                  >
                    {PRICE_RANGES.map((r) => (
                      <option
                        key={r.label}
                        value={
                          r.min === undefined && r.max === undefined
                            ? "all"
                            : `${r.min}-${r.max}`
                        }
                      >
                        {r.label}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Sort */}
                <div>
                  <label className="block text-xs font-semibold text-brand-text uppercase tracking-wide mb-2">
                    Sort By
                  </label>
                  <select
                    value={filters.sort || "newest"}
                    onChange={(e) =>
                      handleFilterChange({ sort: e.target.value })
                    }
                    className="w-full px-3 py-2 rounded-md border border-brand-border bg-white text-sm text-brand-text focus:outline-none focus:ring-2 focus:ring-brand-orange"
                  >
                    {SORT_OPTIONS.map((s) => (
                      <option key={s.value} value={s.value}>
                        {s.label}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Advanced Toggle */}
                <div className="flex items-end">
                  <button
                    type="button"
                    onClick={() => setShowAdvancedFilters(!showAdvancedFilters)}
                    className="w-full px-3 py-2 text-sm font-medium text-brand-orange border border-brand-orange rounded-md hover:bg-orange-50 transition"
                  >
                    {showAdvancedFilters ? "Hide" : "More Filters"}
                  </button>
                </div>
              </div>

              {/* Advanced Filters */}
              {showAdvancedFilters && (
                <div className="border-t border-brand-border pt-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {/* Location */}
                    <div>
                      <label className="block text-xs font-semibold text-brand-text uppercase tracking-wide mb-2">
                        Location (City/Region)
                      </label>
                      <input
                        type="text"
                        value={filters.location || ""}
                        onChange={(e) =>
                          handleFilterChange({ location: e.target.value })
                        }
                        placeholder="e.g., Ontario, Toronto, Alberta"
                        className="w-full px-3 py-2 rounded-md border border-brand-border bg-white text-sm text-brand-text placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-brand-orange"
                      />
                    </div>

                    {/* Custom Price Range */}
                    <div className="space-y-2">
                      <label className="block text-xs font-semibold text-brand-text uppercase tracking-wide">
                        Custom Price Range
                      </label>
                      <div className="flex gap-2">
                        <input
                          type="number"
                          value={filters.minPrice || ""}
                          onChange={(e) =>
                            handleFilterChange({
                              minPrice: e.target.value
                                ? parseFloat(e.target.value)
                                : undefined,
                            })
                          }
                          placeholder="Min"
                          className="flex-1 px-3 py-2 rounded-md border border-brand-border bg-white text-sm text-brand-text placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-brand-orange"
                        />
                        <input
                          type="number"
                          value={filters.maxPrice || ""}
                          onChange={(e) =>
                            handleFilterChange({
                              maxPrice: e.target.value
                                ? parseFloat(e.target.value)
                                : undefined,
                            })
                          }
                          placeholder="Max"
                          className="flex-1 px-3 py-2 rounded-md border border-brand-border bg-white text-sm text-brand-text placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-brand-orange"
                        />
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Active Filters Display & Reset */}
            {isFiltersActive && (
              <div className="flex items-center justify-between bg-blue-50 border border-blue-200 rounded-lg px-4 py-3">
                <span className="text-sm font-medium text-blue-900">
                  Filters applied • Results: {listings.length}
                </span>
                <button
                  onClick={handleResetFilters}
                  className="text-sm font-medium text-blue-600 hover:text-blue-800 transition"
                >
                  Reset All
                </button>
              </div>
            )}
          </section>
        )}

        {/* Results Count */}
        {!loading && (
          <div className="mb-6 text-sm text-brand-muted">
            {listings.length === 0
              ? "No listings found"
              : `Found ${listings.length} listing${listings.length !== 1 ? "s" : ""}`}
          </div>
        )}

        {/* Listings Grid */}
        <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {loading && (
            <p className="col-span-full text-center text-brand-muted py-12">
              Loading listings...
            </p>
          )}

          {error && (
            <div className="col-span-full bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-md">
              {error}
            </div>
          )}

          {!loading && !error && listings.length === 0 && (
            <div className="col-span-full text-center py-12">
              <p className="text-brand-muted text-lg">
                {searchMode === "ai"
                  ? "No results found for your AI search"
                  : "No listings match your filters"}
              </p>
              {searchMode === "default" && isFiltersActive && (
                <button
                  onClick={handleResetFilters}
                  className="mt-4 px-4 py-2 bg-brand-orange text-white rounded-md hover:bg-orange-600 transition"
                >
                  Reset Filters
                </button>
              )}
            </div>
          )}

          {!loading &&
            !error &&
            listings.map((listing) => (
              <Link
                key={listing.id}
                href={`/listing/${listing.id}`}
                className="group"
              >
                <div className="bg-white border border-brand-border rounded-xl overflow-hidden hover:shadow-lg transition-shadow duration-300 h-full flex flex-col">
                  {/* Header with Watchlist */}
                  <div className="p-6 pb-4 border-b border-gray-100 flex items-start justify-between gap-4">
                    <div className="flex-1">
                      <h3 className="font-bold text-lg text-brand-text group-hover:text-brand-orange transition line-clamp-2">
                        {listing.title}
                      </h3>
                      <div className="mt-2 flex flex-col gap-2">
                        {listing.is_verified && (
                          <span className="inline-block px-2 py-1 bg-green-100 text-green-800 text-xs rounded font-semibold w-fit">
                            ✓ Verified
                          </span>
                        )}
                        <ListingBadges
                          isFeatured={listing.is_featured || false}
                          featuredUntil={listing.featured_until}
                          isAiVerified={listing.is_ai_verified || false}
                          aiVerifiedAt={listing.ai_verified_at}
                        />
                      </div>
                    </div>
                    <div className="pt-1 flex-shrink-0">
                      <WatchlistButton listingId={listing.id} />
                    </div>
                  </div>

                  {/* Main Content */}
                  <div className="flex-1 p-6 space-y-4">
                    {/* Location & Type */}
                    <div className="text-sm text-brand-muted">
                      📍 {listing.region || listing.country || "Location TBD"} •{" "}
                      <span className="inline-block px-2 py-0.5 bg-gray-100 text-gray-800 rounded text-xs font-medium">
                        {listing.type === "asset" ? "Physical" : "Digital"}
                      </span>
                    </div>

                    {/* Price */}
                    <div className="pt-2 border-t border-gray-100">
                      <p className="text-sm text-brand-muted mb-1">Asking Price</p>
                      <p className="text-2xl font-bold text-brand-orange">
                        {formatPrice(listing.asking_price)}
                      </p>
                    </div>

                    {/* Metrics */}
                    {(listing.annual_revenue || listing.annual_cashflow) && (
                      <div className="grid grid-cols-2 gap-3 p-3 bg-gray-50 rounded-lg">
                        {listing.annual_revenue && (
                          <div>
                            <p className="text-xs text-brand-muted uppercase font-semibold">
                              Revenue
                            </p>
                            <p className="text-sm font-bold text-brand-text">
                              {formatPrice(listing.annual_revenue)}
                            </p>
                          </div>
                        )}
                        {listing.annual_cashflow && (
                          <div>
                            <p className="text-xs text-brand-muted uppercase font-semibold">
                              Cashflow
                            </p>
                            <p className="text-sm font-bold text-brand-text">
                              {formatPrice(listing.annual_cashflow)}
                            </p>
                          </div>
                        )}
                      </div>
                    )}

                    {/* Summary */}
                    {listing.summary && (
                      <p className="text-sm text-brand-muted line-clamp-3">
                        {listing.summary}
                      </p>
                    )}
                  </div>

                  {/* Footer CTA */}
                  <div className="p-6 pt-4 border-t border-gray-100 bg-gray-50 group-hover:bg-brand-orange group-hover:bg-opacity-5 transition">
                    <span className="inline-flex items-center text-brand-orange font-semibold group-hover:translate-x-1 transition-transform">
                      View Details
                      <span className="ml-2">→</span>
                    </span>
                  </div>
                </div>
              </Link>
            ))}
        </section>
      </div>
    </main>
  );
}
