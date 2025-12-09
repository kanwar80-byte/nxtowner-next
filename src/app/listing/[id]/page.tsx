"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import Link from "next/link";
import { PublicListing } from "@/types/listing";

// TODO: Wire NexusAI filters + NDA/Deal Room gating later (data layer already Supabase-backed).

interface ListingDetailPageProps {
  params: Promise<{
    id: string;
  }>;
}

export default function ListingDetailPage({ params }: ListingDetailPageProps) {
  const [listing, setListing] = useState<PublicListing | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchListing() {
      try {
        const { id } = await params;
        setLoading(true);
        setError(null);

        const { data, error: fetchError } = await supabase
          .from("listings")
          .select(
            "id, title, summary, type, status, asking_price, annual_revenue, annual_cashflow, country, region, is_verified, created_at, updated_at, meta"
          )
          .eq("id", id)
          .eq("status", "active")
          .single();

        if (fetchError) {
          if (fetchError.code === "PGRST116") {
            setError("Listing not found or no longer available.");
          } else {
            setError(fetchError.message);
          }
        } else {
          setListing((data || null) as PublicListing | null);
        }
      } catch {
        setError("Failed to load listing.");
      } finally {
        setLoading(false);
      }
    }

    fetchListing();
  }, [params]);

  const formatPrice = (price: number | null) => {
    if (price === null) return "$—";
    return price.toLocaleString("en-CA", {
      style: "currency",
      currency: "CAD",
      maximumFractionDigits: 0,
    });
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-CA", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  if (loading) {
    return (
      <main className="bg-brand-bg min-h-screen py-16">
        <div className="max-w-4xl mx-auto px-4">
          <div className="text-center text-brand-muted">Loading listing...</div>
        </div>
      </main>
    );
  }

  if (error || !listing) {
    return (
      <main className="bg-brand-bg min-h-screen py-16">
        <div className="max-w-4xl mx-auto px-4">
          <div className="bg-brand-card border border-brand-border rounded-2xl shadow-sm p-8">
            <h1 className="text-2xl font-bold text-brand-text mb-4">
              Listing Not Found
            </h1>
            <p className="text-brand-muted mb-6">
              {error || "This listing is not available or has been removed."}
            </p>
            <Link
              href="/browse"
              className="inline-block px-4 py-2 bg-brand-navy text-white rounded-md font-medium hover:bg-slate-900 transition"
            >
              Back to Browse
            </Link>
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className="bg-brand-bg min-h-screen py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
        {/* Back Link */}
        <Link
          href="/browse"
          className="inline-flex items-center text-brand-navy hover:text-slate-900 font-medium transition"
        >
          ← Back to Browse
        </Link>

        {/* Header */}
        <div className="bg-brand-card border border-brand-border rounded-2xl shadow-sm p-8">
          <div className="flex items-start justify-between gap-4 mb-4">
            <div>
              <h1 className="text-3xl font-bold text-brand-text">
                {listing.title}
              </h1>
              <p className="text-brand-muted mt-2">
                {listing.region}, {listing.country} •{" "}
                {listing.type === "asset" ? "Asset-Based" : "Digital"} Business
              </p>
            </div>
            {listing.is_verified && (
              <div className="px-3 py-1 bg-brand-green text-white rounded font-semibold text-sm">
                ✓ Verified
              </div>
            )}
          </div>

          {listing.summary && (
            <p className="text-brand-text mt-4">{listing.summary}</p>
          )}
        </div>

        {/* Key Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-brand-card border border-brand-border rounded-lg p-6">
            <p className="text-xs text-brand-muted uppercase mb-2">
              Asking Price
            </p>
            <p className="text-2xl font-bold text-brand-navy">
              {formatPrice(listing.asking_price)}
            </p>
          </div>

          {listing.annual_revenue !== null && (
            <div className="bg-brand-card border border-brand-border rounded-lg p-6">
              <p className="text-xs text-brand-muted uppercase mb-2">
                Annual Revenue
              </p>
              <p className="text-2xl font-bold text-brand-navy">
                {formatPrice(listing.annual_revenue)}
              </p>
            </div>
          )}

          {listing.annual_cashflow !== null && (
            <div className="bg-brand-card border border-brand-border rounded-lg p-6">
              <p className="text-xs text-brand-muted uppercase mb-2">
                Annual Cashflow
              </p>
              <p className="text-2xl font-bold text-brand-navy">
                {formatPrice(listing.annual_cashflow)}
              </p>
            </div>
          )}
        </div>

        {/* Details */}
        <div className="bg-brand-card border border-brand-border rounded-2xl shadow-sm p-8">
          <h2 className="text-xl font-semibold text-brand-text mb-6">Details</h2>

          <div className="space-y-4">
            <div>
              <p className="text-xs text-brand-muted uppercase mb-1">Type</p>
              <p className="text-brand-text">
                {listing.type === "asset" ? "Asset-Based Business" : "Digital Business"}
              </p>
            </div>

            <div>
              <p className="text-xs text-brand-muted uppercase mb-1">Location</p>
              <p className="text-brand-text">
                {listing.region}, {listing.country}
              </p>
            </div>

            <div>
              <p className="text-xs text-brand-muted uppercase mb-1">Posted</p>
              <p className="text-brand-text">{formatDate(listing.created_at)}</p>
            </div>

            {listing.meta && Object.keys(listing.meta).length > 0 && (
              <div>
                <p className="text-xs text-brand-muted uppercase mb-2">
                  Additional Info
                </p>
                <p className="text-sm text-brand-muted italic">
                  TODO: Render additional metrics from meta field (e.g. MRR, churn, asset count)
                </p>
              </div>
            )}
          </div>
        </div>

        {/* CTA Section */}
        <div className="bg-brand-card border border-brand-border rounded-2xl shadow-sm p-8">
          <h2 className="text-xl font-semibold text-brand-text mb-4">
            Interested?
          </h2>
          <p className="text-brand-muted mb-6">
            Sign in to view detailed metrics, financials, and to initiate contact with the seller.
          </p>
          <div className="flex gap-3">
            <Link
              href="/login"
              className="px-6 py-3 border border-brand-navy text-brand-navy rounded-md font-medium hover:bg-brand-navy hover:text-white transition"
            >
              Sign In
            </Link>
            <Link
              href="/signup"
              className="px-6 py-3 bg-brand-orange text-white rounded-md font-medium hover:bg-orange-700 transition"
            >
              Create Account
            </Link>
          </div>
        </div>
      </div>
    </main>
  );
}
