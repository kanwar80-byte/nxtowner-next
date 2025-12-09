"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { PublicListing } from "@/types/listing";
import { WatchlistButton } from "@/components/listings/WatchlistButton";
import ListingBadges from "@/components/ListingBadges";
import ListingInterestModal from "@/components/listings/ListingInterestModal";
import { hasUserSignedNda, signNdaAndCreateDealRoom, getDealRoomForListing } from "@/app/actions/nda";

// TODO: Wire NexusAI filters + NDA/Deal Room gating later (data layer already Supabase-backed).

interface ListingDetailPageProps {
  params: Promise<{
    id: string;
  }>;
}

export default function ListingDetailPage({ params }: ListingDetailPageProps) {
  const router = useRouter();
  const [listing, setListing] = useState<PublicListing | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [hasSigned, setHasSigned] = useState(false);
  const [dealRoomId, setDealRoomId] = useState<string | null>(null);
  const [ndaLoading, setNdaLoading] = useState(false);
  const [showNdaModal, setShowNdaModal] = useState(false);
  const [ndaMessage, setNdaMessage] = useState("");
  const [showInterestModal, setShowInterestModal] = useState(false);

  useEffect(() => {
    async function fetchListing() {
      try {
        const { id } = await params;
        setLoading(true);
        setError(null);

        // Check auth status
        const { data: { session } } = await supabase.auth.getSession();
        setIsAuthenticated(!!session);

        const { data, error: fetchError } = await supabase
          .from("listings")
          .select(
            "id, title, summary, type, status, asking_price, annual_revenue, annual_cashflow, country, region, is_verified, is_featured, is_ai_verified, featured_until, ai_verified_at, created_at, updated_at, meta"
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

          // Check NDA status if authenticated
          if (session) {
            const signed = await hasUserSignedNda(id);
            setHasSigned(signed);

            if (signed) {
              const room = await getDealRoomForListing(id);
              setDealRoomId(room);
            }
          }
        }
      } catch {
        setError("Failed to load listing.");
      } finally {
        setLoading(false);
      }
    }

    fetchListing();
  }, [params]);

  async function handleSignNda() {
    if (!listing) return;

    setNdaLoading(true);
    const result = await signNdaAndCreateDealRoom(listing.id, ndaMessage);
    
    if (result.success && (result.dealRoomId || result.roomId)) {
      setShowNdaModal(false);
      const targetRoomId = result.dealRoomId || result.roomId;
      router.push(`/deal-room/${targetRoomId}`);
    } else {
      alert(result.error || "Failed to sign NDA");
    }
    setNdaLoading(false);
  }

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
        <div className="flex items-center justify-between">
          <Link
            href="/browse"
            className="inline-flex items-center text-brand-navy hover:text-slate-900 font-medium transition"
          >
            ← Back to Browse
          </Link>
          {isAuthenticated && listing && (
            <WatchlistButton listingId={listing.id} />
          )}
        </div>

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

          <div className="mt-4 mb-4">
            <ListingBadges
              isFeatured={listing.is_featured || false}
              featuredUntil={listing.featured_until}
              isAiVerified={listing.is_ai_verified || false}
              aiVerifiedAt={listing.ai_verified_at}
            />
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

        {/* CTA Section - Dynamic based on auth & NDA status */}
        <div className="bg-brand-card border border-brand-border rounded-2xl shadow-sm p-8">
          {!isAuthenticated ? (
            <>
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
            </>
          ) : hasSigned && dealRoomId ? (
            <>
              <h2 className="text-xl font-semibold text-brand-text mb-4">
                🔓 Data Room Unlocked
              </h2>
              <p className="text-brand-muted mb-6">
                You have access to the secure deal room with detailed financials, documents, and messaging.
              </p>
              <Link
                href={`/deal-room/${dealRoomId}`}
                className="inline-block px-6 py-3 bg-brand-navy text-white rounded-md font-medium hover:bg-slate-900 transition"
              >
                Enter Deal Room →
              </Link>
            </>
          ) : (
            <>
              <h2 className="text-xl font-semibold text-brand-text mb-4">
                🔒 Unlock Data Room
              </h2>
              <p className="text-brand-muted mb-6">
                Sign the NDA to access detailed financials, documents, and communicate directly with the seller.
              </p>
              <div className="flex gap-3">
                <button
                  onClick={() => setShowNdaModal(true)}
                  className="flex-1 px-6 py-3 bg-brand-orange text-white rounded-md font-medium hover:bg-orange-700 transition"
                >
                  Sign NDA & Unlock
                </button>
                <button
                  onClick={() => setShowInterestModal(true)}
                  className="flex-1 px-6 py-3 bg-slate-200 text-slate-900 rounded-md font-medium hover:bg-slate-300 transition"
                >
                  Express Interest
                </button>
              </div>
            </>
          )}
        </div>
      </div>

      {/* NDA Modal */}
      {showNdaModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl max-w-2xl w-full p-8 shadow-2xl">
            <h2 className="text-2xl font-bold text-brand-text mb-4">
              Non-Disclosure Agreement
            </h2>
            <div className="bg-slate-50 border border-slate-200 rounded-lg p-6 mb-6 max-h-64 overflow-y-auto">
              <p className="text-sm text-slate-700 mb-3">
                By signing this NDA, you agree to:
              </p>
              <ul className="text-sm text-slate-700 space-y-2 list-disc pl-5">
                <li>Keep all information shared confidential</li>
                <li>Use information only for evaluating this business opportunity</li>
                <li>Not share information with third parties without written consent</li>
                <li>Return or destroy all materials if deal does not proceed</li>
                <li>Comply with all applicable laws and regulations</li>
              </ul>
              <p className="text-xs text-slate-500 mt-4">
                This is a legally binding agreement. Full NDA terms will be provided in the deal room.
              </p>
            </div>

            <div className="mb-6">
              <label className="block text-sm font-medium text-brand-text mb-2">
                Optional: Message to Seller
              </label>
              <textarea
                value={ndaMessage}
                onChange={(e) => setNdaMessage(e.target.value)}
                rows={3}
                className="w-full px-4 py-2 border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-brand-navy"
                placeholder="Introduce yourself and explain your interest in this business..."
              />
            </div>

            <div className="flex gap-3">
              <button
                onClick={() => setShowNdaModal(false)}
                disabled={ndaLoading}
                className="flex-1 px-6 py-3 border border-slate-300 text-slate-700 rounded-md font-medium hover:bg-slate-50 transition disabled:opacity-50"
              >
                Cancel
              </button>
              <button
                onClick={handleSignNda}
                disabled={ndaLoading}
                className="flex-1 px-6 py-3 bg-brand-navy text-white rounded-md font-medium hover:bg-slate-900 transition disabled:opacity-50"
              >
                {ndaLoading ? "Signing..." : "I Agree & Sign"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Interest Modal */}
      <ListingInterestModal
        listingId={listing?.id || ""}
        isOpen={showInterestModal}
        onClose={() => setShowInterestModal(false)}
      />
    </main>
  );
}
