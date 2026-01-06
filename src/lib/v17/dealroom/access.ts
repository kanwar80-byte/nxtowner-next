import "server-only";

import { createSupabaseServerClient } from '@/utils/supabase/server';
import type { DocumentVisibility } from '@/types/v17/dealroom';

/**
 * V17 Deal Room Access Helpers
 * Pure helpers for checking buyer access to deal rooms and documents
 */

/**
 * Check if buyer can access deal room for a listing
 * Returns true if NDA is signed for that buyer+listing
 * 
 * @param params.buyer_profile_id - Buyer profile UUID (maps to buyer_id column in ndas table)
 * @param params.listing_id - Listing UUID
 */
export async function canBuyerAccessDealRoom(params: {
  buyer_profile_id: string; // API uses buyer_profile_id, but ndas table column is buyer_id
  listing_id: string;
}): Promise<boolean> {
  try {
    const supabase = await createSupabaseServerClient();

    // Check if NDA is signed for this buyer+listing
    // Note: Parameter is buyer_profile_id for API consistency, but ndas table column is buyer_id
    const { data, error } = await supabase
      .from('ndas')
      .select('status, signed_at')
      .eq('listing_id', params.listing_id)
      .eq('buyer_id', params.buyer_profile_id) // Map buyer_profile_id param to buyer_id column
      .maybeSingle();

    if (error || !data) {
      return false;
    }

    // NDA must be signed
    return data.status === 'signed' && data.signed_at !== null;
  } catch (error) {
    console.error('[dealroom/access] Error checking deal room access:', error);
    return false;
  }
}

/**
 * Check if buyer can access a specific document
 * Returns true if visibility allows access and NDA requirements are met
 */
export async function canBuyerAccessDoc(params: {
  buyer_profile_id: string;
  listing_id: string;
  visibility: DocumentVisibility;
}): Promise<boolean> {
  // If visibility is seller_only, buyer cannot access
  if (params.visibility === 'seller_only') {
    return false;
  }

  // If visibility requires NDA, check NDA status
  if (params.visibility === 'nda_required' || params.visibility === 'buyer_post_nda') {
    return canBuyerAccessDealRoom({
      buyer_profile_id: params.buyer_profile_id,
      listing_id: params.listing_id,
    });
  }

  // Default: no access (should not happen with valid visibility values)
  return false;
}

