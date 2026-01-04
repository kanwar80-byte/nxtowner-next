
"use server";
import { sendMessage as sendDealRoomMessage } from "@/app/actions/dealroom";
import { createClient } from "@/utils/supabase/server";

// --- getDealState for deal-room page ---
export async function getDealState(dealRoomId: string) {
  const supabase = await createClient();
  
  // Get current user for filtering NDA signatures
  const {
    data: { user },
  } = await supabase.auth.getUser();
  
  // Fetch NDA signature status for the deal room and current user
  let ndaQuery = supabase
    .from("nda_signatures")
    .select("id, signed_at")
    .eq("deal_room_id", dealRoomId);
  
  // Only filter by user_id if user is authenticated
  if (user?.id) {
    ndaQuery = ndaQuery.eq("user_id", user.id);
  }
  
  const { data: nda, error: ndaError } = await ndaQuery.maybeSingle();
  
  // Fetch LOI status for the deal room
  // Only select id since submitted_at column may not exist
  const { data: loi, error: loiError } = await supabase
    .from("lois")
    .select("id")
    .eq("deal_room_id", dealRoomId)
    .maybeSingle();
  
  return {
    ndaSigned: !!nda?.signed_at,
    loiSubmitted: !!loi, // Check if LOI exists (submitted_at not available)
  };
}



// --- Real NDA/LOI actions using canonical API ---

/**
 * Signs the NDA for a listing by calling the canonical API route.
 */
export async function signNDA(listingId: string): Promise<{ roomId: string }> {
  const res = await fetch("/api/nda/sign", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ listingId }),
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err?.error || "Failed to sign NDA");
  }
  const data = await res.json();
  if (!data.roomId) throw new Error("No roomId returned");
  return { roomId: data.roomId };
}

/**
 * LOI submission is not implemented yet.
 */
export async function submitLOI(formData: FormData) {
  throw new Error("LOI submission is not implemented yet.");
}

/**
 * Sends a message
 */
export async function sendMessage(formData: FormData) {
  const body = String(formData.get("message") ?? "").trim();
  const roomId = String(
    formData.get("dealRoomId") ??
    formData.get("roomId") ??
    formData.get("dealId") ?? ""
  ).trim();
  if (!roomId) throw new Error("Missing dealRoomId (or roomId/dealId) in formData");
  if (!body) throw new Error("Missing message in formData");
  await sendDealRoomMessage(roomId, body);
  return { success: true };
}


