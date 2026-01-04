"use client";

import { signNdaAndCreateDealRoom } from "@/app/actions/nda";
import { createSupabaseBrowserClient } from "@/utils/supabase/client";
import { TABLES } from "@/lib/spine/constants";
import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";

export default function SignNDAButton({ listingId }: { listingId: string }) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [checking, setChecking] = useState(true);
  const [roomId, setRoomId] = useState<string | null>(null);

  // Check if NDA is already signed (idempotent check)
  useEffect(() => {
    const checkNdaStatus = async () => {
      try {
        const supabase = createSupabaseBrowserClient();
        const { data: { user } } = await supabase.auth.getUser();
        
        if (!user) {
          setChecking(false);
          return;
        }

        // Try to find deal room for this listing and user
        const sb: any = supabase;
        const { data: dealRoom, error: dealRoomError } = await sb
          .from(TABLES.deal_rooms)
          .select("id")
          .eq("listing_id", listingId)
          .eq("buyer_id", user.id)
          .maybeSingle();

        if (dealRoomError || !dealRoom) {
          setChecking(false);
          return;
        }

        const dealRoomId = typeof dealRoom === 'object' && dealRoom !== null && 'id' in dealRoom
          ? String(dealRoom.id)
          : null;

        if (!dealRoomId) {
          setChecking(false);
          return;
        }

        // Verify user is a member
        const { data: member, error: memberError } = await sb
          .from(TABLES.deal_room_members)
          .select("id")
          .eq("deal_room_id", dealRoomId)
          .eq("user_id", user.id)
          .maybeSingle();

        if (!memberError && member) {
          setRoomId(dealRoomId);
        }
      } catch (err) {
        console.error("NDA check error:", err);
        // Fail-soft: continue as if not signed
      } finally {
        setChecking(false);
      }
    };

    checkNdaStatus();
  }, [listingId]);

  const handleSignNDA = async () => {
    // If already signed, just redirect
    if (roomId) {
      router.push(`/deal-room/${roomId}`);
      return;
    }

    setLoading(true);
    setError(null);
    try {
      const res = await signNdaAndCreateDealRoom({ listingId });
      if ("error" in res) throw new Error(res.error);
      router.push(`/deal-room/${res.roomId}`);
    } catch (err) {
      const msg =
        err instanceof Error
          ? err.message
          : typeof err === "string"
          ? err
          : JSON.stringify(err);
      console.error("Signing Error:", msg);
      setError(msg);
    } finally {
      setLoading(false);
    }
  };

  if (checking) {
    return (
      <div className="w-full">
        <button
          disabled
          className="w-full rounded-md bg-amber-400 px-4 py-3 font-semibold text-slate-900 opacity-60"
        >
          Checking...
        </button>
      </div>
    );
  }

  return (
    <div className="w-full">
      <button
        type="button"
        onClick={handleSignNDA}
        disabled={loading}
        className="w-full rounded-md bg-amber-400 px-4 py-3 font-semibold text-slate-900 disabled:opacity-60"
      >
        {loading 
          ? "Processing..." 
          : roomId 
          ? "Go to Deal Room" 
          : "Sign NDA"}
      </button>

      {error ? (
        <p className="mt-2 text-sm text-red-400">{error}</p>
      ) : null}
    </div>
  );
}
