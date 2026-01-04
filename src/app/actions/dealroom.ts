'use server';

import { TABLES } from '@/lib/spine/constants';
import { createClient } from '@/utils/supabase/server';
import { revalidatePath } from 'next/cache';

// Legacy tables fallback names (if TABLES points to newer names in some env)
const LEGACY_TABLES = {
  deal_rooms: 'deal_rooms',
  deal_room_members: 'deal_room_members',
  messages: 'messages',
  offers: 'offers',
} as const;

type FromResult<T> = { data: T | null; error: any };

async function fromWithFallback<T>(
  supabase: any,
  primaryTable: string,
  fallbackTable: string,
  build: (q: any) => any
): Promise<FromResult<T>> {
  const run = async (table: string): Promise<FromResult<T>> => {
    const q = supabase.from(table);
    const built = build(q);
    const res = await built;
    return { data: (res as any).data ?? null, error: (res as any).error ?? null };
  };

  const primary = await run(primaryTable);
  if (!primary.error) return primary;

  const fb = await run(fallbackTable);
  return fb;
}

type DealRoom = {
  id: string;
  listing_id?: string | null;
  buyer_id?: string | null;
  seller_id?: string | null;
  status?: string | null;
  created_at?: string | null;
  [key: string]: any;
};

type Message = {
  id: string;
  deal_room_id?: string | null;
  sender_id?: string | null;
  body?: string | null;
  created_at?: string | null;
  [key: string]: any;
};

type Offer = {
  id: string;
  deal_room_id?: string | null;
  buyer_id?: string | null;
  bidder_id?: string | null;
  status?: string | null;
  amount?: number | null;
  currency?: string | null;
  notes?: string | null;
  created_at?: string | null;
  [key: string]: any;
};

type MembershipRow = { id: string };

async function getAuthedServerClient() {
  const supabase = await createClient();
  const {
    data: { user },
    error: authError,
  } = await supabase.auth.getUser();

  return { supabase, user, authError };
}

// ============================================================================
// MESSAGES
// ============================================================================

export async function sendMessage(
  roomId: string,
  body: string
): Promise<{ success: boolean; error?: string }> {
  try {
    const { supabase, user, authError } = await getAuthedServerClient();
    if (authError || !user) return { success: false, error: 'Not authenticated' };

    const { data: membership, error: memberError } = await fromWithFallback<MembershipRow>(
      supabase,
      TABLES.deal_room_members,
      LEGACY_TABLES.deal_room_members,
      (q) => q.select('id').eq('deal_room_id', roomId).eq('user_id', user.id).single()
    );

    if (memberError || !membership) {
      return { success: false, error: 'Not authorized to send messages in this room' };
    }

    const { error } = await fromWithFallback<any>(
      supabase,
      TABLES.messages,
      LEGACY_TABLES.messages,
      (q) => q.insert({ deal_room_id: roomId, sender_id: user.id, body })
    );

    if (error) throw error;

    revalidatePath(`/deal-room/${roomId}`);
    return { success: true };
  } catch (err) {
    console.log('sendMessage error:', err);
    return { success: false, error: 'Failed to send message' };
  }
}

export async function getMessagesForRoom(roomId: string): Promise<Message[]> {
  try {
    const { supabase, user } = await getAuthedServerClient();
    if (!user) return [];

    const { data: membership } = await fromWithFallback<MembershipRow>(
      supabase,
      TABLES.deal_room_members,
      LEGACY_TABLES.deal_room_members,
      (q) => q.select('id').eq('deal_room_id', roomId).eq('user_id', user.id).single()
    );

    if (!membership) return [];

    const { data, error } = await fromWithFallback<Message[]>(
      supabase,
      TABLES.messages,
      LEGACY_TABLES.messages,
      (q) =>
        q
          .select('*')
          .eq('deal_room_id', roomId)
          .order('created_at', { ascending: true })
    );

    if (error) throw error;
    return (data ?? []) as Message[];
  } catch (err) {
    console.log('getMessagesForRoom error:', err);
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
    const { supabase, user, authError } = await getAuthedServerClient();
    if (authError || !user) return { success: false, error: 'Not authenticated' };

    const { data: membership, error: memberError } = await fromWithFallback<MembershipRow>(
      supabase,
      TABLES.deal_room_members,
      LEGACY_TABLES.deal_room_members,
      (q) => q.select('id').eq('deal_room_id', roomId).eq('user_id', user.id).single()
    );

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

    const { data, error } = await fromWithFallback<{ id: string }>(
      supabase,
      TABLES.offers,
      LEGACY_TABLES.offers,
      (q) => q.insert(offerPayload).select('id').single()
    );

    if (error) throw error;

    revalidatePath(`/deal-room/${roomId}`);
    return { success: true, id: data?.id };
  } catch (err) {
    console.log('submitOffer error:', err);
    return { success: false, error: 'Failed to submit offer' };
  }
}

export async function updateOfferStatus(
  offerId: string,
  status: 'accepted' | 'rejected' | 'withdrawn'
): Promise<{ success: boolean; error?: string }> {
  try {
    const { supabase, user, authError } = await getAuthedServerClient();
    if (authError || !user) return { success: false, error: 'Not authenticated' };

    // 1) Fetch offer
    const { data: offer, error: fetchError } = await fromWithFallback<Offer>(
      supabase,
      TABLES.offers,
      LEGACY_TABLES.offers,
      (q) => q.select('id, deal_room_id, buyer_id, bidder_id, status').eq('id', offerId).single()
    );

    if (fetchError || !offer) throw fetchError ?? new Error('Offer not found');

    const dealRoomId = offer.deal_room_id;
    if (!dealRoomId) throw new Error('Offer missing deal_room_id');

    // 2) Fetch deal room
    const { data: room, error: roomError } = await fromWithFallback<DealRoom>(
      supabase,
      TABLES.deal_rooms,
      LEGACY_TABLES.deal_rooms,
      (q) => q.select('id, listing_id, buyer_id').eq('id', dealRoomId).single()
    );

    if (roomError || !room) throw roomError ?? new Error('Deal room not found');

    // Runtime guard: ensure listing_id exists before querying
    if (!room?.listing_id) throw new Error("Deal room is missing listing_id");

    // 3) Fetch listing owner (no FK required)
    const { data: listing, error: listingError } = await supabase
      .from('listings')
      .select('owner_id')
      .eq('id', room.listing_id)
      .single();

    if (listingError || !listing) throw listingError ?? new Error('Listing not found');

    // 4) Permission: user must be listing owner OR buyer in the room
    const isOwner = listing.owner_id === user.id;
    const isBuyer = room.buyer_id === user.id;

    if (!isOwner && !isBuyer) throw new Error('Not authorized');

    const { error: updateError } = await fromWithFallback<any>(
      supabase,
      TABLES.offers,
      LEGACY_TABLES.offers,
      (q) => q.update({ status }).eq('id', offerId)
    );

    if (updateError) throw updateError;

    revalidatePath(`/deal-room/${dealRoomId}`);
    return { success: true };
  } catch (err) {
    console.log('updateOfferStatus error:', err);
    return { success: false, error: 'Failed to update offer status' };
  }
}

export async function getOffersForRoom(roomId: string): Promise<Offer[]> {
  try {
    const { supabase, user } = await getAuthedServerClient();
    if (!user) return [];

    const { data: membership } = await fromWithFallback<MembershipRow>(
      supabase,
      TABLES.deal_room_members,
      LEGACY_TABLES.deal_room_members,
      (q) => q.select('id').eq('deal_room_id', roomId).eq('user_id', user.id).single()
    );

    if (!membership) return [];

    const { data, error } = await fromWithFallback<Offer[]>(
      supabase,
      TABLES.offers,
      LEGACY_TABLES.offers,
      (q) =>
        q
          .select('*')
          .eq('deal_room_id', roomId)
          .order('created_at', { ascending: false })
    );

    if (error) throw error;
    return (data ?? []) as Offer[];
  } catch (err) {
    console.log('getOffersForRoom error:', err);
    return [];
  }
}

// ============================================================================
// DEAL ROOM INFO
// ============================================================================

export async function getDealRoomById(roomId: string): Promise<DealRoom | null> {
  try {
    const { supabase, user } = await getAuthedServerClient();
    if (!user) return null;

    const { data: membership } = await fromWithFallback<MembershipRow>(
      supabase,
      TABLES.deal_room_members,
      LEGACY_TABLES.deal_room_members,
      (q) => q.select('id').eq('deal_room_id', roomId).eq('user_id', user.id).single()
    );

    if (!membership) return null;

    const { data, error } = await fromWithFallback<DealRoom>(
      supabase,
      TABLES.deal_rooms,
      LEGACY_TABLES.deal_rooms,
      (q) => q.select('*').eq('id', roomId).single()
    );

    if (error) throw error;
    return data as DealRoom;
  } catch (err) {
    console.log('getDealRoomById error:', err);
    return null;
  }
}

export async function getUserDealRooms(userId: string): Promise<DealRoom[]> {
  try {
    const supabase = await createClient();

    const { data, error } = await fromWithFallback<DealRoom[]>(
      supabase,
      TABLES.deal_rooms,
      LEGACY_TABLES.deal_rooms,
      (q) =>
        q
          .select('id, listing_id, status, created_at')
          .eq('buyer_id', userId)
          .order('created_at', { ascending: false })
    );

    if (error) {
      const errAny = error as any;
      console.log('getUserDealRooms error:', {
        message: errAny?.message,
        code: errAny?.code,
        details: errAny?.details,
        hint: errAny?.hint,
        status: errAny?.status,
      });
      return [];
    }

    return (data ?? []) as DealRoom[];
  } catch (err) {
    console.log('getUserDealRooms fatal:', err);
    return [];
  }
}

// ============================================================================
// NDA STATUS FOR LISTING
// ============================================================================

export type NdaStatusResult = {
  hasDealRoom: boolean;
  dealRoomId: string | null;
  dealRoomStatus: string | null;
  hasSignedNda: boolean;
  ndaState: 'none' | 'requested' | 'signed';
};

/**
 * Get NDA and deal room status for a listing for the current user.
 * Returns state to determine UI: none, requested, or signed.
 */
export async function getNdaStatusForListing(listingId: string): Promise<{ ndaState: "none" | "requested" | "signed"; dealRoomId: string | null }> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return { ndaState: "none", dealRoomId: null };
  }

  // 1) Prefer deal_rooms status (canonical for redirect)
  const { data: room, error: roomErr } = await supabase
    .from("deal_rooms")
    .select("id,status")
    .eq("listing_id", listingId)
    .eq("buyer_id", user.id)
    .order("created_at", { ascending: false })
    .limit(1)
    .maybeSingle();

  if (!roomErr && room?.id) {
    const status = String(room.status || "");
    if (status === "nda_signed" || status === "active") {
      return { ndaState: "signed", dealRoomId: room.id };
    }
    if (status === "nda_requested") {
      return { ndaState: "requested", dealRoomId: room.id };
    }
  }

  // 2) Fallback to ndas table (in case deal room missing for some reason)
  const { data: nda, error: ndaErr } = await supabase
    .from("ndas")
    .select("status")
    .eq("listing_id", listingId)
    .eq("buyer_id", user.id)
    .maybeSingle();

  if (ndaErr || !nda?.status) {
    return { ndaState: "none", dealRoomId: null };
  }

  const ndaStatus = String(nda.status);
  if (ndaStatus === "signed") return { ndaState: "signed", dealRoomId: null };
  if (ndaStatus === "requested") return { ndaState: "requested", dealRoomId: null };

  return { ndaState: "none", dealRoomId: null };
}
