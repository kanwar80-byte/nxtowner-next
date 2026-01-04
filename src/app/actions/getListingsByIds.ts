'use server';

import { getListingByIdV16 } from "@/lib/v16/listings.repo";

/**
 * Get multiple listings by IDs using V16 canonical repo
 * Used by ComparisonQueue and other components that need to fetch multiple listings
 */
export async function getListingsByIds(ids: string[]): Promise<any[]> {
  if (!ids || ids.length === 0) {
    return [];
  }

  try {
    // Fetch all listings in parallel using V16 canonical repo
    const listings = await Promise.all(
      ids.map(id => getListingByIdV16(id))
    );

    // Filter out null results and return
    return listings.filter((listing): listing is any => listing !== null);
  } catch (error) {
    console.error('getListingsByIds error:', error);
    return [];
  }
}

