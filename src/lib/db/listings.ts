// DEPRECATED: public reads must go through src/lib/v16/listings.repo.ts (V17 Phase 3.1.1).

import { getListingByIdV16, searchListingsV16 } from "@/lib/v16/listings.repo";


// Thin wrapper for canonical V16 detail read
export async function fetchListingById(id: string) {
  return getListingByIdV16(id);
}


// Thin wrapper for canonical V16 teaser list
export async function fetchListings(filters = {}) {
  const data = await searchListingsV16(filters);
  return { data, error: null };
}
