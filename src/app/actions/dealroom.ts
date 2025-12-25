'use server';

/**
 * Server actions for deal room messages and offers
 */

import { supabase } from '@/lib/supabase';
import type { DealRoom, Message, Offer } from '@/types/database';
import { revalidatePath } from 'next/cache';
import { createClient } from "@/utils/supabase/server";

// ============================================================================
// MESSAGES
// ============================================================================

export async function sendMessage(
  roomId: string,
  body: string
): Promise<{ success: boolean; error?: string }> {
  try {
    const { data: { user }, error: authError } = await supabase.auth.getUser();

    if (authError || !user) {
      return { success: false, error: 'Not authenticated' };
    }

    // Verify user is a member of this room
    const { data: membership, error: memberError } = await supabase
      .from('deal_room_members')
      .select('id')
      .eq('deal_room_id', roomId)
      .eq('user_id', user.id)
      .single();

    if (memberError || !membership) {
      return { success: false, error: 'Not authorized to send messages in this room' };
    }

    const { error } = await supabase
      .from('messages')
      .insert({ deal_room_id: roomId, sender_id: user.id, body } as never);

    if (error) throw error;

    revalidatePath(`/deal-room/${roomId}`);
    return { success: true };
  } catch (error) {
    console.error('sendMessage error:', error);
    return { success: false, error: 'Failed to send message' };
  }
}

export async function getMessagesForRoom(roomId: string): Promise<Message[]> {
  try {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return [];

    // Verify user is a member
    const { data: membership } = await supabase
      .from('deal_room_members')
      .select('id')
      .eq('deal_room_id', roomId)
      .eq('user_id', user.id)
      .single();

    if (!membership) return [];

    const { data, error } = await supabase
      .from('messages')
      .select('*')
      .eq('deal_room_id', roomId)
      .order('created_at', { ascending: true });

    if (error) throw error;
    return data || [];
  } catch (error) {
    console.error('getMessagesForRoom error:', error);
    return [];
  }
}

// ============================================================================
// OFFERS
// ============================================================================

export async function submitOffer(
  roomId: string,
  amount: number,
  notes?: string
): Promise<{ success: boolean; id?: string; error?: string }> {
  try {
    const { data: { user }, error: authError } = await supabase.auth.getUser();

    if (authError || !user) {
      return { success: false, error: 'Not authenticated' };
    }

    // Verify user is a member of this room
    const { data: membership, error: memberError } = await supabase
      .from('deal_room_members')
      .select('id')
      .eq('deal_room_id', roomId)
      .eq('user_id', user.id)
      .single();

    if (memberError || !membership) {
      return { success: false, error: 'Not authorized to submit offers in this room' };
    }

    const offerPayload = {
      deal_room_id: roomId,
      bidder_id: user.id,
      amount,
      currency: 'CAD',
      status: 'pending',
      notes: notes || null,
    };

    const { data, error } = await supabase
      .from('offers')
      .insert(offerPayload as never)
      .select('id')
      .single();

    if (error) throw error;

    const typedData = data as { id: string };

    revalidatePath(`/deal-room/${roomId}`);
    return { success: true, id: typedData.id };
  } catch (error) {
    console.error('submitOffer error:', error);
    return { success: false, error: 'Failed to submit offer' };
  }
}

export async function updateOfferStatus(
  offerId: string,
  status: 'accepted' | 'rejected' | 'withdrawn'
): Promise<{ success: boolean; error?: string }> {
  try {
    const { data: { user }, error: authError } = await supabase.auth.getUser();

    if (authError || !user) {
      return { success: false, error: 'Not authenticated' };
    }

    // Get offer to verify permissions
    const { data: offer, error: fetchError } = await supabase
      .from('offers')
      .select('*, deal_rooms!inner(listing_id, listings!inner(owner_id))')
      .eq('id', offerId)
      .single();

    if (fetchError) throw fetchError;

    // Only bidder can withdraw, only seller can accept/reject
    type OfferWithListing = Offer & { deal_rooms: { listings: { owner_id: string } } };
    const offerWithListing = offer as OfferWithListing;
    const isBidder = offerWithListing.bidder_id === user.id;
    const isSeller = offerWithListing.deal_rooms.listings.owner_id === user.id;

    if (status === 'withdrawn' && !isBidder) {
      return { success: false, error: 'Only bidder can withdraw offer' };
    }

    if ((status === 'accepted' || status === 'rejected') && !isSeller) {
      return { success: false, error: 'Only seller can accept/reject offer' };
    }

    const { error } = await supabase
      .from('offers')
      .update({ status } as never)
      .eq('id', offerId);

    if (error) throw error;

    revalidatePath(`/deal-room/${offerWithListing.deal_room_id}`);
    return { success: true };
  } catch (error) {
    console.error('updateOfferStatus error:', error);
    return { success: false, error: 'Failed to update offer status' };
  }
}

export async function getOffersForRoom(roomId: string): Promise<Offer[]> {
  try {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return [];

    // Verify user is a member
    const { data: membership } = await supabase
      .from('deal_room_members')
      .select('id')
      .eq('deal_room_id', roomId)
      .eq('user_id', user.id)
      .single();

    if (!membership) return [];

    const { data, error } = await supabase
      .from('offers')
      .select('*')
      .eq('deal_room_id', roomId)
      .order('created_at', { ascending: false });

    if (error) throw error;
    return data || [];
  } catch (error) {
    console.error('getOffersForRoom error:', error);
    return [];
  }
}

// ============================================================================
// DEAL ROOM INFO
// ============================================================================

export async function getDealRoomById(roomId: string): Promise<DealRoom | null> {
  try {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return null;

    // Verify user is a member
    const { data: membership } = await supabase
      .from('deal_room_members')
      .select('id')
      .eq('deal_room_id', roomId)
      .eq('user_id', user.id)
      .single();

    if (!membership) return null;

    const { data, error } = await supabase
      .from('deal_rooms')
      .select('*')
      .eq('id', roomId)
      .single();

    if (error) throw error;
    return data as DealRoom;
  } catch (error) {
    console.error('getDealRoomById error:', error);
    return null;
  }
}

export async function getUserDealRooms(userId: string): Promise<DealRoom[]> {
  try {
    const supabaseServer = await createClient();

    const { data, error } = await supabaseServer
      .from("deal_rooms")
      .select("id, listing_id, status, created_at")
      .eq("buyer_id", userId)
      .order("created_at", { ascending: false });

    if (error) {
      console.error("getUserDealRooms error:", error);
      return [];
    }

    return (data || []) as DealRoom[];
  } catch (err) {
    console.error("getUserDealRooms fatal:", err);
    return [];
  }
}
