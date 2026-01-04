// src/lib/dealRoom.ts
import { supabaseAdmin } from "./supabaseAdmin";

/**
 * Valid deal room status values matching the database constraint.
 * Constraint: status in ('draft', 'nda_requested', 'nda_signed', 'active', 'closed')
 */
export type DealRoomStatus = "draft" | "nda_requested" | "nda_signed" | "active" | "closed";

export const DEAL_ROOM_STATUS = {
  DRAFT: "draft" as const,
  NDA_REQUESTED: "nda_requested" as const,
  NDA_SIGNED: "nda_signed" as const,
  ACTIVE: "active" as const,
  CLOSED: "closed" as const,
} as const;

type RequestNdaAndEnsureDealRoomParams = {
  listingId: string;
  buyerId: string;
  initialMessage?: string | null;
};

type RequestNdaAndEnsureDealRoomResult = {
  roomId: string;
};

function uuid(): string {
  // Node/Edge compatible (Node 18+ has global crypto)
  return crypto.randomUUID();
}

/**
 * V17 canonical:
 * - NO RPC (avoids schema cache + overload collisions)
 * - Upsert NDA row (requested)
 * - Upsert Deal Room with status = 'nda_requested'
 * - Ensure deal_room_members includes buyer + seller
 * - Returns a stable roomId for redirect
 *
 * Requires service role key (supabaseAdmin). Never call from client.
 */
export async function requestNdaAndEnsureDealRoom({
  listingId,
  buyerId,
  initialMessage,
}: RequestNdaAndEnsureDealRoomParams): Promise<RequestNdaAndEnsureDealRoomResult> {
  if (!supabaseAdmin) {
    throw new Error("Supabase admin client is not configured. Ensure SUPABASE_SERVICE_ROLE_KEY is set.");
  }
  if (!listingId || !buyerId) {
    throw new Error("Missing listingId or buyerId.");
  }

  // 1) Resolve seller_id from listings.owner_id (same as your prior DB function)
  const { data: listing, error: listingErr } = await (supabaseAdmin as any)
    .from("listings")
    .select("owner_id")
    .eq("id", listingId)
    .maybeSingle();

  if (listingErr) {
    throw new Error(`Failed to load listing owner: ${listingErr.message}`);
  }
  const sellerId = (listing as any)?.owner_id as string | undefined;
  if (!sellerId) {
    throw new Error("Listing not found or has no owner_id.");
  }

  // 2) Upsert NDA request (minimal columns to avoid schema mismatch)
  // Assumes unique(listing_id,buyer_id) exists (your codebase uses onConflict listing_id,buyer_id elsewhere)
  const { error: ndaErr } = await (supabaseAdmin as any)
    .from("ndas")
    .upsert(
      {
        listing_id: listingId,
        buyer_id: buyerId,
        status: "requested",
      },
      { onConflict: "listing_id,buyer_id" }
    );

  if (ndaErr) {
    throw new Error(`Failed to upsert NDA request: ${ndaErr.message}`);
  }

  // 3) Upsert deal room with allowed status (CRITICAL: do NOT use 'open')
  // We want a stable id back every time.
  // If it already exists, keep existing id; if not, create a new one.
  const newRoomId = uuid();

  const { data: roomRows, error: roomErr } = await (supabaseAdmin as any)
    .from("deal_rooms")
    .upsert(
      {
        id: newRoomId,
        listing_id: listingId,
        buyer_id: buyerId,
        seller_id: sellerId,
        status: DEAL_ROOM_STATUS.NDA_REQUESTED,
        created_by: buyerId,
      },
      { onConflict: "listing_id,buyer_id" }
    )
    .select("id")
    .limit(1);

  if (roomErr) {
    throw new Error(`Failed to upsert deal room: ${roomErr.message}`);
  }

  const roomId = roomRows?.[0]?.id as string | undefined;
  if (!roomId) {
    // Fallback: query latest room (this should almost never happen, but keeps UX sane)
    const { data: room, error: qErr } = await (supabaseAdmin as any)
      .from("deal_rooms")
      .select("id")
      .eq("listing_id", listingId)
      .eq("buyer_id", buyerId)
      .order("created_at", { ascending: false })
      .limit(1)
      .maybeSingle();

    if (qErr) throw new Error(`Deal room upsert succeeded but fallback query failed: ${qErr.message}`);
    if (!room?.id) throw new Error("Deal room created but could not retrieve room ID.");
    return { roomId: room.id };
  }

  // 4) Ensure membership (upsert buyer + seller)
  // Use onConflict if you have a unique constraint; if not, this may error.
  // We'll try upsert with onConflict=deal_room_id,user_id (common pattern).
  const buyerMember = { id: uuid(), deal_room_id: roomId, user_id: buyerId, role: "buyer" };
  const sellerMember = { id: uuid(), deal_room_id: roomId, user_id: sellerId, role: "seller" };

  const { error: memberErr } = await (supabaseAdmin as any)
    .from("deal_room_members")
    .upsert([buyerMember, sellerMember], { onConflict: "deal_room_id,user_id" });

  if (memberErr) {
    // Fail-soft on membership: room+nda is the critical path for redirect.
    // But still surface error in dev.
    if (process.env.NODE_ENV !== "production") {
      console.error("[requestNdaAndEnsureDealRoom] member upsert failed:", memberErr);
    }
  }

  // 5) Optional initial message (if messages table exists and is wired)
  if (initialMessage && initialMessage.trim().length > 0) {
    const { error: msgErr } = await (supabaseAdmin as any)
      .from("messages")
      .insert({ id: uuid(), deal_room_id: roomId, sender_id: buyerId, body: initialMessage.trim() });

    if (msgErr && process.env.NODE_ENV !== "production") {
      console.error("[requestNdaAndEnsureDealRoom] message insert failed:", msgErr);
    }
  }

  return { roomId };
}
