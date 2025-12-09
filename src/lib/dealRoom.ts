import { supabaseAdmin } from "./supabaseAdmin";

type CreateDealRoomWithNdaParams = {
  listingId: string;
  buyerId: string;
  signedPdfUrl: string;
  initialMessage?: string | null;
};

type CreateDealRoomWithNdaResult = {
  roomId: string;
};

/**
 * Server-side helper to invoke the RPC that creates a deal room, members, NDA signature, and optional first message.
 * Requires the Supabase service role key; do not call from the client.
 */
export async function createDealRoomWithNda({
  listingId,
  buyerId,
  signedPdfUrl,
  initialMessage,
}: CreateDealRoomWithNdaParams): Promise<CreateDealRoomWithNdaResult> {
  const { data, error } = await supabaseAdmin.rpc("create_deal_room_with_nda", {
    _listing_id: listingId,
    _buyer_id: buyerId,
    _signed_pdf_url: signedPdfUrl,
    _initial_message: initialMessage ?? null,
  });

  if (error || !data) {
    throw new Error(`create_deal_room_with_nda failed: ${error?.message ?? "unknown error"}`);
  }

  return { roomId: data as string };
}
