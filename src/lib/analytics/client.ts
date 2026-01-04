"use client";

/**
 * Client-side event tracking helper.
 * Posts events to /api/events endpoint.
 * Swallows all errors to never break the UI.
 */
export async function track(
  event_name: string,
  options: {
    listing_id?: string;
    properties?: Record<string, unknown>;
    path?: string;
  } = {}
): Promise<void> {
  try {
    // Auto-fill path if not provided (client-side only)
    let path = options.path;
    if (!path && typeof window !== "undefined") {
      path = window.location.pathname + window.location.search;
    }

    await fetch("/api/events", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        event_name,
        listing_id: options.listing_id,
        path,
        properties: options.properties || {},
      }),
    });
  } catch (error) {
    // Silently fail - never break the UI
    if (process.env.NODE_ENV === "development") {
      console.warn("[track] Failed to log event:", event_name, error);
    }
  }
}

