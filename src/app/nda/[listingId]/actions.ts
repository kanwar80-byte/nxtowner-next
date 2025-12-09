'use server';

import { createDealRoomWithNda } from "@/lib/dealRoom";

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
  // Calls the service-role RPC that creates the room, members, NDA record, and optional first message.
  const result = await createDealRoomWithNda({
    listingId: params.listingId,
    buyerId: params.buyerId,
    signedPdfUrl: params.signedPdfUrl,
    initialMessage: params.initialMessage,
  });

  return result; // { roomId }
}
