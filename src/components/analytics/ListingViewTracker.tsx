"use client";

import { useEffect } from "react";
import { track } from "@/lib/analytics/client";

interface ListingViewTrackerProps {
  listingId: string;
  listingData?: any; // Optional listing data to infer track
}

/**
 * Tracks listing_view event when a listing page is opened.
 * Includes track and source metadata for funnel analysis.
 */
export default function ListingViewTracker({ listingId, listingData }: ListingViewTrackerProps) {
  useEffect(() => {
    if (listingId) {
      // Infer track from listing data if available (client-side helper)
      let trackValue: "operational" | "digital" | null = null;
      if (listingData) {
        // Client-side track inference (simplified)
        const assetType = listingData?.asset_type?.toLowerCase();
        if (assetType === "operational") {
          trackValue = "operational";
        } else if (assetType === "digital") {
          trackValue = "digital";
        } else if (listingData?.meta?.track) {
          const metaTrack = String(listingData.meta.track).toLowerCase();
          if (metaTrack === "operational" || metaTrack === "digital") {
            trackValue = metaTrack;
          }
        }
      }

      // Infer source from referrer (best-effort)
      let source: "search" | "browse" | "direct" | "unknown" = "unknown";
      if (typeof window !== "undefined") {
        const referrer = document.referrer;
        const urlParams = new URLSearchParams(window.location.search);
        const srcParam = urlParams.get("src");

        if (srcParam === "search") {
          source = "search";
        } else if (referrer) {
          if (referrer.includes("/browse") || referrer.includes("/search")) {
            source = "search";
          } else if (referrer.includes(window.location.origin)) {
            source = "browse";
          } else {
            source = "direct";
          }
        } else {
          source = "direct";
        }
      }

      track("listing_view", {
        listing_id: listingId,
        properties: {
          track: trackValue,
          source,
        },
      });
    }
  }, [listingId, listingData]);

  return null;
}

