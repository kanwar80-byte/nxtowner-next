'use server';

import { requestNdaAndEnsureDealRoom } from "@/lib/dealRoom";
import { supabaseAdmin } from "@/lib/supabaseAdmin";

/**
 * Server action to finalize an NDA and create a deal room.
 * Expected to be invoked after the NDA is signed and the signed PDF is available.
 */
export async function completeNdaAndCreateDealRoom(params: {
  listingId: string;
  buyerId: string;
  signedPdfUrl: string;
  initialMessage?: string | null;
}) {
  // First, ensure deal room exists (requestNdaAndEnsureDealRoom creates it with status='nda_requested')
  const { roomId } = await requestNdaAndEnsureDealRoom({
    listingId: params.listingId,
    buyerId: params.buyerId,
    initialMessage: params.initialMessage,
  });

  // Update NDA status to 'signed' and update deal room status to 'nda_signed'
  if (supabaseAdmin) {
    // Update NDA status
    await (supabaseAdmin as any)
      .from("ndas")
      .update({ status: "signed", signed_pdf_url: params.signedPdfUrl })
      .eq("listing_id", params.listingId)
      .eq("buyer_id", params.buyerId);

    // Update deal room status
    await (supabaseAdmin as any)
      .from("deal_rooms")
      .update({ status: "nda_signed" })
      .eq("id", roomId);
  }

  return { roomId };
}
