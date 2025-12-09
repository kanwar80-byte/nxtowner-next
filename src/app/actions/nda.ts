'use server';

/**
 * Server actions for NDA signing and deal room creation
 */

import { supabase } from '@/lib/supabase';
import { createDealRoomWithNda } from '@/lib/dealRoom';
import type { NdaInsert } from '@/types/database';
import { revalidatePath } from 'next/cache';

export async function signNdaAndCreateDealRoom(
  listingId: string,
  initialMessage?: string
): Promise<{ success: boolean; roomId?: string; dealRoomId?: string; error?: string }> {
  try {
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    
    if (authError || !user) {
      return { success: false, error: 'Not authenticated' };
    }

    // Check if NDA already exists
    const { data: existingNda, error: ndaCheckError } = await supabase
      .from('ndas')
      .select('id')
      .eq('listing_id', listingId)
      .eq('buyer_id', user.id)
      .eq('status', 'signed')
      .single();

    if (ndaCheckError && ndaCheckError.code !== 'PGRST116') {
      throw ndaCheckError;
    }

    // Check if deal room already exists
    const { data: existingRoom, error: roomCheckError } = await supabase
      .from('deal_rooms')
      .select('id')
      .eq('listing_id', listingId)
      .eq('buyer_id', user.id)
      .single();

    if (roomCheckError && roomCheckError.code !== 'PGRST116') {
      throw roomCheckError;
    }

    const existingRoomId = (existingRoom as { id?: string } | null)?.id;

    if (existingRoomId) {
      // Room already exists, just return it
      revalidatePath(`/deal-room/${existingRoomId}`);
      return { success: true, roomId: existingRoomId, dealRoomId: existingRoomId };
    }

    // Use the helper function to create everything in one transaction
    const signedPdfUrl = ''; // In production, generate/store actual NDA PDF
    const { roomId } = await createDealRoomWithNda({
      listingId,
      buyerId: user.id,
      signedPdfUrl,
      initialMessage: initialMessage || null,
    });

    // Also create entry in ndas table for compatibility
    if (!existingNda) {
      const ndaPayload: NdaInsert = {
        listing_id: listingId,
        buyer_id: user.id,
        status: 'signed',
      };

      await supabase
        .from('ndas')
        .insert(ndaPayload as never);
    }

    revalidatePath(`/listing/${listingId}`);
    revalidatePath(`/deal-room/${roomId}`);
    
    return { success: true, roomId, dealRoomId: roomId };
  } catch (error) {
    console.error('signNdaAndCreateDealRoom error:', error);
    return { success: false, error: 'Failed to sign NDA and create deal room' };
  }
}

export async function hasUserSignedNda(listingId: string): Promise<boolean> {
  try {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return false;

    const { data, error } = await supabase
      .from('ndas')
      .select('id')
      .eq('listing_id', listingId)
      .eq('buyer_id', user.id)
      .eq('status', 'signed')
      .single();

    if (error && error.code !== 'PGRST116') {
      console.error('hasUserSignedNda error:', error);
      return false;
    }

    return !!data;
  } catch (error) {
    console.error('hasUserSignedNda error:', error);
    return false;
  }
}

export async function getDealRoomForListing(listingId: string): Promise<string | null> {
  try {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return null;

    const { data, error } = await supabase
      .from('deal_rooms')
      .select('id')
      .eq('listing_id', listingId)
      .eq('buyer_id', user.id)
      .single();

    if (error && error.code !== 'PGRST116') {
      console.error('getDealRoomForListing error:', error);
      return null;
    }

    const roomId = (data as { id?: string } | null)?.id;
    return roomId || null;
  } catch (error) {
    console.error('getDealRoomForListing error:', error);
    return null;
  }
}
