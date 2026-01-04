/**
 * Client-safe helper to determine listing track.
 * No server-only imports or APIs.
 */

export type ListingTrack = "operational" | "digital";

/**
 * Normalize a string value to "operational" or "digital"
 */
function normalizeTrackValue(value: string | null | undefined): ListingTrack {
  if (!value) return "operational";
  
  const normalized = String(value).toLowerCase().trim();
  
  // Digital indicators
  if (
    normalized.includes("dig") ||
    normalized === "saas" ||
    normalized === "ecommerce"
  ) {
    return "digital";
  }
  
  // Default to operational
  return "operational";
}

/**
 * Determine the track (platform type) for a listing.
 * Returns "operational" | "digital"
 * 
 * Priority order:
 * 1. listing.track
 * 2. listing.platform
 * 3. listing.meta?.track
 * 4. listing.meta?.platform
 * 5. listing.category_track
 * 6. default to "operational"
 */
export function determineTrack(listing: Record<string, unknown>): ListingTrack {
  // Priority 1: listing.track
  if (listing?.track && typeof listing.track === 'string') {
    return normalizeTrackValue(listing.track);
  }

  // Priority 2: listing.platform
  if (listing?.platform && typeof listing.platform === 'string') {
    return normalizeTrackValue(listing.platform);
  }

  // Priority 3: listing.meta?.track
  const meta = listing?.meta as Record<string, unknown> | undefined;
  if (meta?.track && typeof meta.track === 'string') {
    return normalizeTrackValue(meta.track);
  }

  // Priority 4: listing.meta?.platform
  if (meta?.platform && typeof meta.platform === 'string') {
    return normalizeTrackValue(meta.platform);
  }

  // Priority 5: listing.category_track
  if (listing?.category_track && typeof listing.category_track === 'string') {
    return normalizeTrackValue(listing.category_track);
  }

  // Priority 6: default to "operational"
  return "operational";
}

/**
 * Backward compatibility alias for getListingTrack.
 * Returns "operational" | "digital" | "unknown" for compatibility.
 */
export function getListingTrack(listingRow: Record<string, unknown>): "operational" | "digital" | "unknown" {
  const track = determineTrack(listingRow);
  // Return "unknown" is not possible with determineTrack, but keep for type compatibility
  return track;
}

/**
 * Filter listings by track.
 * Returns true if listing matches the track filter.
 */
export function matchesTrack(listingRow: Record<string, unknown>, track: "all" | "operational" | "digital"): boolean {
  if (track === "all") {
    return true;
  }
  const listingTrack = determineTrack(listingRow);
  return listingTrack === track;
}

