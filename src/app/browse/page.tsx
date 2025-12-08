"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";

type Listing = {
  id: string;
  title: string;
  asset_type: string;
  location: string;
  asking_price: number | null;
  summary: string | null;
};

export default function BrowsePage() {
  const [listings, setListings] = useState<Listing[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchListings() {
      setLoading(true);
      setError(null);

      const { data, error: fetchError } = await supabase
        .from("listings")
        .select("id, title, asset_type, location, asking_price, summary")
        .order("created_at", { ascending: false });

      if (fetchError) {
        setError(fetchError.message);
      } else {
        setListings(data || []);
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
    <main className="py-16 max-w-6xl mx-auto px-4">
      <header className="mb-10">
        <h1 className="text-3xl font-bold text-nxt-primary">
          Browse Listings
        </h1>
        <p className="text-gray-600 mt-2">
          Explore verified physical and digital businesses ready for new owners.
        </p>
      </header>

      {/* Simple filter bar (static for now) */}
      <section className="mb-8 flex flex-col md:flex-row gap-4">
        <input
          className="flex-1 px-4 py-2 rounded-md border border-gray-300"
          placeholder="Search by name, type, or location..."
        />
        <select className="px-4 py-2 rounded-md border border-gray-300">
          <option>All Asset Types</option>
          <option>Gas Stations &amp; C-Stores</option>
          <option>Car Wash &amp; Auto</option>
          <option>QSR &amp; Restaurants</option>
          <option>SaaS &amp; Software</option>
          <option>E-commerce &amp; DTC</option>
        </select>
        <select className="px-4 py-2 rounded-md border border-gray-300">
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
          <p className="col-span-full text-center text-gray-500">
            Loading listings...
          </p>
        )}

        {error && (
          <div className="col-span-full bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-md">
            {error}
          </div>
        )}

        {!loading && !error && listings.length === 0 && (
          <p className="col-span-full text-center text-gray-500">
            No listings yet. Be the first to list your business.
          </p>
        )}

        {!loading &&
          !error &&
          listings.map((listing) => (
            <div
              key={listing.id}
              className="bg-white shadow-sm rounded-xl p-6 hover:shadow-md transition"
            >
              <h3 className="font-semibold text-lg text-nxt-primary">
                {listing.title}
              </h3>
              <p className="text-gray-500 text-sm mt-1">
                {listing.location} • {listing.asset_type}
              </p>
              <p className="mt-3 font-semibold text-gray-900">
                {formatPrice(listing.asking_price)} Asking
              </p>
              <p className="text-gray-500 text-sm mt-2">
                {truncateSummary(listing.summary)}
              </p>
            </div>
          ))}
      </section>
    </main>
  );
}
