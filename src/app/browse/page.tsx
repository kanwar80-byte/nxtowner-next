
"use client";

import { useEffect, useState, useCallback } from "react";
import { getFilteredListings, type BrowseFilters } from "@/app/actions/listings";
import Link from "next/link";
import { PublicListing } from "@/types/listing";
import { WatchlistButton } from "@/components/listings/WatchlistButton";
import ListingBadges from "@/components/ListingBadges";
import clsx from "clsx";

type SearchMode = "default" | "ai";

const CATEGORIES = [
  { value: "all", label: "All Categories" },
  { value: "gas_station", label: "Gas Stations & C-Stores" },
  { value: "car_wash", label: "Car Wash & Auto" },
  // ...add more as needed
];

// Inline formatPrice helper (shared with listing/[id]/page.tsx)
const formatPrice = (price: number | null | undefined) => {
  if (price == null) return "$—";
  return price.toLocaleString("en-CA", {
    style: "currency",
    currency: "CAD",
    maximumFractionDigits: 0,
  });
};

// ListingCard component
function ListingCard({ listing }: { listing: PublicListing }) {
  return (
    <Link
      href={`/listing/${listing.id}`}
      className="group block rounded-xl border border-gray-200 bg-white shadow-sm hover:shadow-lg transition overflow-hidden"
    >
      <div className="p-6 pb-3 flex flex-col gap-2">
        <div className="flex items-center gap-2 mb-2">
          <ListingBadges
            isAiVerified={listing.is_ai_verified}
            aiVerifiedAt={listing.ai_verified_at}
            isFeatured={listing.is_featured}
            featuredUntil={listing.featured_until}
          />
        </div>
        <h3 className="text-lg font-semibold text-brand-text mb-1 line-clamp-2">
          {listing.title}
        </h3>
        <p className="text-2xl font-bold text-brand-orange">
          {formatPrice(listing.asking_price)}
        </p>
        {/* Metrics */}
        {(listing.annual_revenue || listing.annual_cashflow) && (
          <div className="grid grid-cols-2 gap-3 p-3 bg-gray-50 rounded-lg">
            {listing.annual_revenue && (
              <div>
                <p className="text-xs text-brand-muted uppercase font-semibold">Revenue</p>
                <p className="text-sm font-bold text-brand-text">{formatPrice(listing.annual_revenue)}</p>
              </div>
            )}
            {listing.annual_cashflow && (
              <div>
                <p className="text-xs text-brand-muted uppercase font-semibold">Cashflow</p>
                <p className="text-sm font-bold text-brand-text">{formatPrice(listing.annual_cashflow)}</p>
              </div>
            )}
          </div>
        )}
        {/* Summary */}
        {listing.summary && (
          <p className="text-sm text-brand-muted line-clamp-3">{listing.summary}</p>
        )}
      </div>
      {/* Footer CTA */}
      <div className="p-6 pt-4 border-t border-gray-100 bg-gray-50 group-hover:bg-brand-orange group-hover:bg-opacity-5 transition">
        <span className="inline-flex items-center text-brand-orange font-semibold group-hover:translate-x-1 transition-transform">
          View Details
          <span className="ml-2">→</span>
        </span>
      </div>
    </Link>
  );
}

// Main BrowsePage component
export default function BrowsePage() {
  // TODO: DEV ONLY - remove sampleListings when real data is available
  const sampleListings: PublicListing[] = [
      {
        id: "sample-1",
        title: "Sample Gas Station",
        summary: "High-traffic location, strong financials, turnkey operation.",
        type: "asset",
        status: "active",
        asking_price: 850000,
        annual_revenue: 1200000,
        annual_cashflow: 180000,
        country: "Canada",
        region: "Ontario",
        is_verified: true,
        is_featured: true,
        is_ai_verified: false,
        featured_until: null,
        ai_verified_at: null,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
        meta: null,
      },
      {
        id: "sample-2",
        title: "Sample SaaS Business",
        summary: "Profitable B2B SaaS, 500+ customers, recurring revenue.",
        type: "digital",
        status: "active",
        asking_price: 420000,
        annual_revenue: 210000,
        annual_cashflow: 95000,
        country: "USA",
        region: "California",
        is_verified: true,
        is_featured: false,
        is_ai_verified: true,
        featured_until: null,
        ai_verified_at: new Date().toISOString(),
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
        meta: null,
      },
    ];
  const [listings, setListings] = useState<PublicListing[]>([]);
  const [loading, setLoading] = useState(true);
  const [segment, setSegment] = useState<'all' | 'asset' | 'digital'>('all');
  const [category, setCategory] = useState<string>('All Categories');
        // Removed duplicate declarations. Use the top-level sampleListings and listings only.

        // TODO: DEV ONLY - remove effectiveListings fallback when real data is available
        const effectiveListings: PublicListing[] = listings.length > 0 ? listings : sampleListings;

  // Example: fetch all listings on mount (replace with actual filter/search logic as needed)
  useEffect(() => {
    async function fetchListings() {
      setLoading(true);
      try {
        const results = await getFilteredListings({});
        setListings(Array.isArray(results) ? results : []);
      } catch (e) {
        console.error("[Browse] listings query error:", e);
        setListings([]);
      } finally {
        setLoading(false);
      }
    }
    fetchListings();
  }, []);

  // Inline FiltersSidebar component (restyle only, keep logic as is)
  function FiltersSidebar() {
    return (
      <div className="space-y-6 rounded-xl border border-slate-200 bg-white p-4 text-sm shadow-sm">
        <div>
          <h3 className="text-xs font-semibold uppercase tracking-wide text-slate-500 mb-2">Filters</h3>
          {/* Place filter controls here, e.g. price, location, etc. */}
          {/* ...existing filter controls... */}
          <div className="mb-3">
            <label className="block text-xs font-medium text-slate-600 mb-1">Location</label>
            <input className="w-full rounded-md border border-slate-200 px-2 py-1.5 text-sm focus:border-nx-primary focus:ring-1 focus:ring-nx-primary" placeholder="City, region, etc." />
          </div>
          <div className="mb-3">
            <label className="block text-xs font-medium text-slate-600 mb-1">Price Range</label>
            <input className="w-full rounded-md border border-slate-200 px-2 py-1.5 text-sm focus:border-nx-primary focus:ring-1 focus:ring-nx-primary" placeholder="Min - Max" />
          </div>
        </div>
        {/* Add more filter sections as needed */}
      </div>
    );
  }

  // Category labels for chips
  const CATEGORY_LABELS = [
    "All Categories",
    "Gas Station",
    "SaaS",
    "Car Wash",
    "E-Commerce",
    "Franchise",
    "Restaurant / QSR",
    "Content Site",
    "Manufacturing",
    "Agency",
    "Other",
  ];

  return (
    <div className="min-h-screen bg-slate-50">
      {/* HERO */}
      <section className="px-4 py-12 sm:py-16 bg-slate-950 text-white">
        <div className="mx-auto max-w-6xl px-4 py-6 lg:py-8">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
            <div>
              <h1 className="text-2xl font-semibold lg:text-3xl text-white">Browse Listings</h1>
              <p className="mt-1 text-sm text-white/70">
                Discover verified digital and operational businesses across Canada and beyond.
              </p>
            </div>
            {/* toolbar: search + sort */}
            <div className="flex w-full flex-col gap-3 lg:w-auto lg:flex-row lg:items-center">
              {/* Add search input and sort select here if needed */}
              <div className="w-full max-w-xs">
                <input
                  type="text"
                  placeholder="Search businesses..."
                  className="
                    w-full rounded-full border border-white/20 bg-white/10 px-4 py-2 text-sm
                    text-white placeholder-white/60 backdrop-blur-sm
                    focus:bg-white focus:text-slate-900 focus:placeholder-slate-400
                    focus:border-slate-300 shadow-sm transition
                  "
                  // reuse existing value/onChange if present
                />
              </div>
            </div>
          </div>
          {/* Segment tabs */}
          <div className="mt-4 flex flex-wrap items-center justify-between gap-3">
            <div className="inline-flex rounded-full bg-white/10 p-1 text-xs">
              {['all', 'asset', 'digital'].map((seg) => (
                <button
                  key={seg}
                  type="button"
                  className={clsx(
                    "px-4 py-1.5 text-sm rounded-full transition",
                    segment === seg
                      ? "bg-white text-primary font-medium shadow-sm"
                      : "text-white/80 hover:bg-white/10"
                  )}
                  onClick={() => setSegment(seg as typeof segment)}
                >
                  {seg === 'all' ? 'All' : seg.charAt(0).toUpperCase() + seg.slice(1)}
                </button>
              ))}
            </div>
          </div>
          {/* Category chips row */}
          <div className="mt-3 flex gap-2 overflow-x-auto pb-1">
            {CATEGORY_LABELS.map((label) => {
              const active = category === label;
              return (
                <button
                  key={label}
                  type="button"
                  className={clsx(
                    "whitespace-nowrap rounded-full border px-3 py-1 text-xs font-medium transition",
                    active
                      ? "border-white bg-white text-primary shadow-sm"
                      : "border-white/20 bg-white/5 text-white/80 hover:bg-white/10"
                  )}
                  onClick={() => setCategory(label)}
                >
                  {label}
                </button>
              );
            })}
          </div>
        </div>
      </section>

      {/* BODY */}
      <section className="border-t border-slate-200">
        <div className="mx-auto flex max-w-6xl gap-6 px-4 py-6 lg:py-8">
          {/* Sidebar (desktop only) */}
          <aside className="hidden w-64 shrink-0 lg:block">
            <FiltersSidebar />
          </aside>

          {/* Main content */}
          <main className="flex-1">
            {/* Filters button for mobile */}
            <button className="mb-4 inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white px-3 py-1.5 text-xs font-medium text-slate-700 lg:hidden">
              Filters
            </button>
            {/* top result summary row */}
            <div className="mb-4 flex items-center justify-between gap-3">
              <p className="text-xs text-slate-500">
                Found <span className="font-semibold text-slate-900">{listings.length}</span> businesses
              </p>
              {/* optional secondary sort dropdown (if our sort control lives here instead of hero) */}
            </div>
            {/* empty-state or grid + pagination */}
            {loading ? (
              <div className="flex h-64 flex-col items-center justify-center rounded-xl border border-dashed border-slate-300 bg-white text-center">
                <p className="text-sm font-medium text-slate-800">Loading listings…</p>
              </div>
            ) : listings.length === 0 ? (
              <div className="flex h-64 flex-col items-center justify-center rounded-xl border border-dashed border-slate-300 bg-white text-center">
                <p className="text-sm font-medium text-slate-800">No listings found.</p>
                <p className="mt-1 max-w-md text-xs text-slate-500">
                  Try adjusting your filters, changing the category, or clearing the search to see more opportunities.
                </p>
              </div>
            ) : (
              <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
                {listings.map((listing) => (
                  <ListingCard key={listing.id} listing={listing} />
                ))}
              </div>
            )}
            {/* pagination stays below, but only show it when listings.length > 0 if needed */}
          </main>
        </div>
      </section>
    </div>
  );
}

// BrowsePage: restored main component wrapper, wired listings.map to ListingCard, and fixed formatPrice import.
