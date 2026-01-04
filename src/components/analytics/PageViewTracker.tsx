"use client";

import { useEffect, useRef } from "react";
import { usePathname, useSearchParams } from "next/navigation";
import { track } from "@/lib/analytics/client";

/**
 * Tracks page views and visits.
 * - Logs "page_view" on every route change
 * - Logs "visit" once per browser session (using sessionStorage)
 * - Logs "search_results_viewed" when search params are present (once per distinct query string per session)
 */
export default function PageViewTracker() {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const hasLoggedVisit = useRef(false);
  const loggedSearchQueries = useRef<Set<string>>(new Set());

  useEffect(() => {
    // Log "visit" once per browser session
    if (!hasLoggedVisit.current) {
      const visitLogged = sessionStorage.getItem("nx_visit_logged");
      if (!visitLogged) {
        track("visit", {
          properties: {
            path: pathname,
            query: searchParams.toString(),
          },
        });
        sessionStorage.setItem("nx_visit_logged", "true");
        hasLoggedVisit.current = true;
      }
    }

    // Log "page_view" on every route change
    track("page_view", {
      properties: {
        path: pathname,
        query: searchParams.toString(),
      },
    });

    // Log "search_results_viewed" if search params are present
    const queryString = searchParams.toString();
    const hasSearchParams = searchParams.has("q") || 
                           searchParams.has("category") || 
                           searchParams.has("subcategory") ||
                           searchParams.has("min_price") ||
                           searchParams.has("max_price") ||
                           searchParams.has("asset_type") ||
                           searchParams.has("assetType");

    if (hasSearchParams && queryString) {
      // De-dup per session per query string
      const sessionKey = `nx_search_${queryString}`;
      const alreadyLogged = sessionStorage.getItem(sessionKey);
      
      if (!alreadyLogged && !loggedSearchQueries.current.has(queryString)) {
        // Infer track from URL or asset_type param
        let trackValue: "operational" | "digital" | null = null;
        const assetType = searchParams.get("asset_type") || searchParams.get("assetType");
        if (assetType?.toLowerCase() === "operational" || pathname.includes("/operational")) {
          trackValue = "operational";
        } else if (assetType?.toLowerCase() === "digital" || pathname.includes("/digital")) {
          trackValue = "digital";
        }

        track("search_results_viewed", {
          properties: {
            results_count: null, // Will be filled by server if available
            track: trackValue,
          },
        });

        sessionStorage.setItem(sessionKey, "true");
        loggedSearchQueries.current.add(queryString);
      }
    }
  }, [pathname, searchParams]);

  return null;
}

