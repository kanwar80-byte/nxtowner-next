"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import Link from "next/link";
import { PublicListing } from "@/types/listing";

// TODO: Wire NexusAI filters + NDA/Deal Room gating later (data layer already Supabase-backed).

export default function BrowsePage() {
  const [listings, setListings] = useState<PublicListing[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchListings() {
      setLoading(true);
      setError(null);

      const { data, error: fetchError } = await supabase
        .from("listings")
        .select(
          "id, title, summary, type, status, asking_price, annual_revenue, annual_cashflow, country, region, is_verified, created_at, updated_at, meta"
        )
        .eq("status", "active")
        .order("created_at", { ascending: false })
        .limit(60);

      if (fetchError) {
        setError(fetchError.message);
      } else {
        setListings((data || []) as PublicListing[]);
      }

      setLoading(false);
    }

    fetchListings();
  }, []);

  const truncateSummary = (text: string | null, maxLength = 120) => {
    if (!text) return "";
    return text.length > maxLength ? text.slice(0, maxLength) + "..." : text;
  };

  const formatPrice = (price: number | null) => {
    if (price === null) return "Price on request";
    return price.toLocaleString("en-CA", {
      style: "currency",
      currency: "CAD",
      maximumFractionDigits: 0,
    });
  };

  return (
    <main className="bg-brand-bg min-h-screen py-16 md:py-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-10">
          <h1 className="text-3xl font-bold text-brand-text">
            Browse Listings
          </h1>
          <p className="text-brand-muted mt-2">
            Explore verified physical and digital businesses ready for new owners.
          </p>
        </div>

        {/* Simple filter bar (static for now) */}
        <section className="mb-8 flex flex-col md:flex-row gap-4">
          {/* TODO: Implement filters — industry, price, region */}
          <input
            className="flex-1 px-4 py-2 rounded-md border border-brand-border bg-white text-brand-text placeholder:text-gray-400"
            placeholder="Search by name, type, or location..."
          />
          <select className="px-4 py-2 rounded-md border border-brand-border bg-white text-brand-text">
            <option>All Asset Types</option>
            <option>Gas Stations &amp; C-Stores</option>
            <option>Car Wash &amp; Auto</option>
            <option>QSR &amp; Restaurants</option>
            <option>SaaS &amp; Software</option>
            <option>E-commerce &amp; DTC</option>
          </select>
          <select className="px-4 py-2 rounded-md border border-brand-border bg-white text-brand-text">
            <option>Any Price</option>
            <option>Under $250k</option>
            <option>$250k – $1M</option>
            <option>$1M – $5M</option>
            <option>$5M+</option>
          </select>
        </section>

        {/* Listings Section */}
        <section className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {loading && (
            <p className="col-span-full text-center text-brand-muted">
              Loading listings...
            </p>
          )}

          {error && (
            <div className="col-span-full bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-md">
              {error}
            </div>
          )}

          {!loading && !error && listings.length === 0 && (
            <p className="col-span-full text-center text-brand-muted">
              No listings yet. Be the first to list your business.
            </p>
          )}

          {!loading &&
            !error &&
            listings.map((listing) => (
              <Link
                key={listing.id}
                href={`/listing/${listing.id}`}
                className="bg-brand-card border border-brand-border shadow-sm rounded-xl p-6 hover:shadow-md transition block"
              >
                <div className="flex items-start justify-between mb-2">
                  <h3 className="font-semibold text-lg text-brand-text flex-1">
                    {listing.title}
                  </h3>
                  {listing.is_verified && (
                    <span className="ml-2 px-2 py-1 bg-brand-green text-white text-xs rounded font-semibold">
                      ✓ Verified
                    </span>
                  )}
                </div>
                <p className="text-brand-muted text-sm mt-1">
                  {listing.region}, {listing.country} • {listing.type === 'asset' ? 'Asset' : 'Digital'}
                </p>
                <p className="mt-3 font-semibold text-brand-text">
                  {formatPrice(listing.asking_price)}
                </p>
                {listing.annual_revenue && (
                  <p className="text-sm text-brand-muted mt-1">
                    Annual Revenue: {formatPrice(listing.annual_revenue)}
                  </p>
                )}
                <p className="text-brand-muted text-sm mt-2">
                  {truncateSummary(listing.summary)}
                </p>
              </Link>
            ))}
        </section>
      </div>
    </main>
  );
}
