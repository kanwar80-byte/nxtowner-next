"use client";

import { signNdaAndCreateDealRoom } from "@/app/actions/nda";
import { useRouter } from "next/navigation";
import { useState } from "react";

export default function SignNDAButton({ listingId }: { listingId: string }) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSignNDA = async () => {
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

  return (
    <div className="w-full">
      <button
        type="button"
        onClick={handleSignNDA}
        disabled={loading}
        className="w-full rounded-md bg-amber-400 px-4 py-3 font-semibold text-slate-900 disabled:opacity-60"
      >
        {loading ? "Processing..." : "Sign NDA"}
      </button>

      {error ? (
        <p className="mt-2 text-sm text-red-400">{error}</p>
      ) : null}
    </div>
  );
}
