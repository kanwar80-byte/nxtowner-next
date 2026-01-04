"use client";

import { signNdaAndCreateDealRoom } from "@/app/actions/nda";
import { getNdaStatusForListing } from "@/app/actions/dealroom";
import { createSupabaseBrowserClient } from "@/utils/supabase/client";
import { useRouter } from "next/navigation";
import { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import { track } from "@/lib/analytics/client";
import { toggleSaved, isSaved } from "@/lib/buyer/savedListings";
import { determineTrack } from "@/lib/track";
import { Bookmark, BookmarkCheck } from "lucide-react";
import type { Database } from "@/types/database";
import type { SupabaseClient } from "@supabase/supabase-js";

type ListingActionsBarProps = {
  listingId: string;
  listingData?: unknown; // Listing data for track inference and display
};

type AuthState = "checking" | "logged-out" | "logged-in";
type NdaState = "checking" | "none" | "requested" | "signed" | "error";
type DealRoomInfo = { roomId: string } | null;
type ActionStatus = "nda_signed" | "enquiry_sent" | null;

export default function ListingActionsBar({ listingId, listingData }: ListingActionsBarProps) {
  const router = useRouter();
  const [authState, setAuthState] = useState<AuthState>("checking");
  const [ndaState, setNdaState] = useState<NdaState>("checking");
  const [dealRoomInfo, setDealRoomInfo] = useState<DealRoomInfo>(null);
  const [signingNda, setSigningNda] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isListingSaved, setIsListingSaved] = useState(false);
  const [actionStatus, setActionStatus] = useState<ActionStatus>(null);

  // Check NDA status using server action
  const checkNdaStatus = useCallback(async () => {
    try {
      setNdaState("checking");
      const status = await getNdaStatusForListing(listingId);
      
      if (status.ndaState === 'signed' && status.dealRoomId) {
        setDealRoomInfo({ roomId: status.dealRoomId });
        setNdaState("signed");
      } else if (status.ndaState === 'requested') {
        setNdaState("requested");
      } else {
        setNdaState("none");
      }
    } catch (err) {
      console.error("NDA check error:", err);
      // Fail-soft: treat as none
      setNdaState("none");
    }
  }, [listingId]);

  // Check saved status
  useEffect(() => {
    setIsListingSaved(isSaved(listingId));
  }, [listingId]);

  // Check authentication status and NDA state
  useEffect(() => {
    const checkAuth = async () => {
      try {
        const supabase = createSupabaseBrowserClient() as SupabaseClient<Database>;
        const { data: { user } } = await supabase.auth.getUser();
        setAuthState(user ? "logged-in" : "logged-out");

        // If logged in, check NDA status via server action
        if (user) {
          await checkNdaStatus();
        } else {
          setNdaState("none");
        }
      } catch (err) {
        console.error("Auth check error:", err);
        setAuthState("logged-out");
        setNdaState("none");
      }
    };

    checkAuth();
  }, [listingId, checkNdaStatus]);

  const handleSaveListing = () => {
    const nowSaved = toggleSaved(listingId);
    setIsListingSaved(nowSaved);
    
    // Track save action
    const trackValue = listingData && typeof listingData === 'object' && listingData !== null
      ? determineTrack(listingData as Record<string, unknown>)
      : null;
    const properties: Record<string, unknown> = {
      cta: "save_listing",
      track: trackValue,
    };
    track("cta_click", {
      listing_id: listingId,
      properties,
    });
  };

  const handleSignNda = async () => {
    // Track CTA click (intent, not outcome)
    const trackValue = listingData && typeof listingData === 'object' && listingData !== null
      ? determineTrack(listingData as Record<string, unknown>)
      : null;
    const properties: Record<string, unknown> = {
      cta: "request_nda",
      track: trackValue,
    };
    track("cta_click", {
      listing_id: listingId,
      properties,
    });

    setSigningNda(true);
    setError(null);

    try {
      const result = await signNdaAndCreateDealRoom({ listingId });
      
      if ("error" in result) {
        setError(result.error ?? null);
        setSigningNda(false);
        return;
      }

      // Success - navigate immediately to deal room
      if (result.roomId) {
        setDealRoomInfo({ roomId: result.roomId });
        setNdaState("requested");
        router.push(`/deal-room/${result.roomId}`);
      } else {
        setError("Deal room created but room ID is missing");
        setSigningNda(false);
      }
    } catch (err) {
      const msg = err instanceof Error ? err.message : "Failed to request NDA. Please try again.";
      setError(msg);
      setSigningNda(false);
    }
  };


  const handleSendEnquiry = () => {
    // This would typically open an enquiry form or modal
    // For now, just track the intent
    const trackValue = listingData && typeof listingData === 'object' && listingData !== null
      ? determineTrack(listingData as Record<string, unknown>)
      : null;
    const properties: Record<string, unknown> = {
      cta: "send_enquiry",
      track: trackValue,
    };
    track("cta_click", {
      listing_id: listingId,
      properties,
    });
    // TODO: Implement enquiry flow
    setActionStatus("enquiry_sent");
  };

  // Loading state
  if (authState === "checking" || ndaState === "checking") {
    return (
      <div className="bg-white border border-slate-200 rounded-lg p-4 mb-6">
        <div className="animate-pulse space-y-2">
          <div className="h-4 bg-slate-200 rounded w-3/4"></div>
          <div className="h-10 bg-slate-100 rounded"></div>
        </div>
      </div>
    );
  }

  // Logged out state
  if (authState === "logged-out") {
    return (
      <div className="bg-slate-50 border border-slate-200 rounded-lg p-4 mb-6">
        <p className="text-sm text-slate-600 mb-3">
          Sign in to save listings & access Deal Rooms.
        </p>
        <div className="flex flex-col sm:flex-row gap-2">
          <Link
            href="/login"
            className="inline-flex items-center justify-center px-4 py-2 bg-[#0B1221] text-white text-sm font-semibold rounded-lg hover:bg-[#0F172A] transition-colors"
          >
            Sign in
          </Link>
          <Link
            href="/browse"
            className="inline-flex items-center justify-center px-4 py-2 bg-slate-100 text-slate-900 text-sm font-semibold rounded-lg hover:bg-slate-200 transition-colors"
          >
            Browse
          </Link>
        </div>
      </div>
    );
  }

  // Logged in state
  const ndaRequired = true; // Assume NDA is required for now

  return (
    <div className="bg-white border border-slate-200 rounded-lg p-4 mb-6">
      {/* CTA Ladder */}
      <div className="flex flex-col gap-3">
        {/* Save Button (First) */}
        <div className="flex items-center gap-2">
          <button
            onClick={handleSaveListing}
            className={`inline-flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
              isListingSaved
                ? 'bg-green-50 text-green-700 border border-green-200'
                : 'bg-slate-50 text-slate-700 border border-slate-200 hover:bg-slate-100'
            }`}
          >
            {isListingSaved ? (
              <>
                <BookmarkCheck className="w-4 h-4" />
                Saved
              </>
            ) : (
              <>
                <Bookmark className="w-4 h-4" />
                Save Listing
              </>
            )}
          </button>
        </div>

        {/* NDA Callout (if required and not signed) */}
        {ndaRequired && ndaState === "none" && (
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 text-sm text-blue-800">
            <p className="font-medium mb-1">NDA required to access full details</p>
            <p className="text-xs text-blue-600">Takes ~30 seconds. Unlocks Deal Room and financials.</p>
          </div>
        )}

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-2">
          {ndaState === "signed" && dealRoomInfo ? (
            <>
              <button
                onClick={handleSendEnquiry}
                className="inline-flex items-center justify-center px-6 py-2 bg-blue-600 text-white text-sm font-semibold rounded-lg hover:bg-blue-700 transition-colors"
              >
                Send Enquiry
              </button>
              <Link
                href={`/deal-room/${dealRoomInfo.roomId}`}
                className="inline-flex items-center justify-center px-6 py-2 bg-orange-500 text-white text-sm font-semibold rounded-lg hover:bg-orange-600 transition-colors"
              >
                Open Deal Room
              </Link>
            </>
          ) : ndaState === "requested" ? (
            <>
              <button
                disabled={true}
                className="inline-flex items-center justify-center px-6 py-2 bg-slate-300 text-slate-500 text-sm font-semibold rounded-lg cursor-not-allowed"
              >
                NDA Requested
              </button>
              <button
                onClick={handleSendEnquiry}
                disabled={true}
                className="inline-flex items-center justify-center px-6 py-2 bg-slate-300 text-slate-500 text-sm font-semibold rounded-lg cursor-not-allowed"
                title="NDA must be signed to contact seller"
              >
                Send Enquiry
              </button>
            </>
          ) : (
            <>
              <button
                onClick={handleSignNda}
                disabled={signingNda}
                className="inline-flex items-center justify-center px-6 py-2 bg-orange-500 text-white text-sm font-semibold rounded-lg hover:bg-orange-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {signingNda ? "Processing..." : "Request NDA"}
              </button>
              <button
                onClick={handleSendEnquiry}
                disabled={true}
                className="inline-flex items-center justify-center px-6 py-2 bg-slate-300 text-slate-500 text-sm font-semibold rounded-lg cursor-not-allowed"
                title="Sign NDA to contact seller"
              >
                Send Enquiry
              </button>
            </>
          )}
        </div>
      </div>

      {/* Post-action Status */}
      {actionStatus === "nda_signed" && (
        <div className="mt-3 p-2 bg-green-50 border border-green-200 rounded text-sm text-green-700">
          ✓ NDA signed. Next: Send enquiry
        </div>
      )}
      {actionStatus === "enquiry_sent" && (
        <div className="mt-3 p-2 bg-green-50 border border-green-200 rounded text-sm text-green-700">
          ✓ Enquiry sent. Next: Open deal room
        </div>
      )}

      {error && (
        <div className="mt-3 p-2 bg-red-50 border border-red-200 rounded text-sm text-red-700">
          {error}
        </div>
      )}
    </div>
  );
}

