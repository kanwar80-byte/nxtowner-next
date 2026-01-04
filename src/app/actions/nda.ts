"use server";

import { requestNdaAndEnsureDealRoom } from "@/lib/dealRoom";
import { createClient } from "@/utils/supabase/server";
import { trackEventFromServer } from "@/lib/analytics/server";

type Input = { listingId: string };

export async function signNdaAndCreateDealRoom({ listingId }: Input): Promise<{ roomId?: string; error?: string }> {
  try {
    const supabase = await createClient();
    const {
      data: { user },
      error: userErr,
    } = await supabase.auth.getUser();

    if (userErr) return { error: userErr.message };
    if (!user) return { error: "You must be signed in to request an NDA." };
    if (!listingId) return { error: "Missing listingId." };

    // Track intent
    await trackEventFromServer("nda_requested", { listing_id: listingId });

    const { roomId } = await requestNdaAndEnsureDealRoom({
      listingId,
      buyerId: user.id,
      initialMessage: null,
    });

    return { roomId };
  } catch (err) {
    const msg = err instanceof Error ? err.message : "Failed to request NDA.";
    return { error: msg };
  }
}
