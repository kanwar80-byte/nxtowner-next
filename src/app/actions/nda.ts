"use server";

import { createDealRoomWithNda } from "@/lib/dealRoom";
import { createClient } from "@/utils/supabase/server";

type SignNdaInput = {
  listingId: string;
  signedPdfUrl?: string | null;
  initialMessage?: string | null;
};

type SignNdaResult = { roomId: string } | { error: string };

function normalizeError(err: unknown): string {
  if (err instanceof Error) return err.message;
  if (typeof err === "string") return err;
  try {
    return JSON.stringify(err);
  } catch {
    return "Unknown error";
  }
}

export async function signNdaAndCreateDealRoom(input: SignNdaInput): Promise<SignNdaResult> {
  try {
    const supabase = await createClient();

    const { data, error: authError } = await supabase.auth.getUser();
    const user = data?.user;

    if (authError || !user) {
      return { error: "Not authenticated" };
    }

    const { listingId, signedPdfUrl = null, initialMessage = null } = input;

    const { roomId } = await createDealRoomWithNda({
      listingId,
      buyerId: user.id,
      ...(signedPdfUrl ? { signedPdfUrl } : {}),
      initialMessage,
    });

    return { roomId };
  } catch (err) {
    return { error: normalizeError(err) };
  }
}
