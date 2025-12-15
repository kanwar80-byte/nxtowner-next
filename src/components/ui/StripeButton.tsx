"use client";

import React, { useTransition } from "react";
import { createCheckoutSession } from "@/app/actions/stripe";
import { Loader2, CreditCard } from "lucide-react";

interface StripeButtonProps {
  priceId: string;
  label?: string;
  listingId?: number;
}

export default function StripeButton({ priceId, label = "Upgrade Now", listingId }: StripeButtonProps) {
  const [isPending, startTransition] = useTransition();

  const handleBuy = () => {
    startTransition(async () => {
      await createCheckoutSession(priceId, listingId);
    });
  };

  return (
    <button
      disabled={isPending}
      onClick={() =>
        startTransition(async () => {
          const res = await createCheckoutSession({
            priceId,
            successUrl,
            cancelUrl,
          });
          if (res?.url) window.location.href = res.url;
        })
      }
      className="flex items-center justify-center gap-2 bg-orange-500 hover:bg-orange-600 text-white font-bold py-3 px-6 rounded-xl transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-md hover:shadow-lg w-full md:w-auto"
    >
      {isPending ? (
        <>
          <Loader2 className="animate-spin" size={20} />
          Processing...
        </>
      ) : (
        <>
          <CreditCard size={20} />
          {label}
        </>
      )}
    </button>
  );
}
export function StripeButton({ priceId, successUrl, cancelUrl }: { priceId: string; successUrl: string; cancelUrl: string }) {
  const [isPending, startTransition] = useTransition();

  return (
    <button
      disabled={isPending}
      onClick={() =>
        startTransition(async () => {
          const res = await createCheckoutSession({
            priceId,
            successUrl,
            cancelUrl,
          });
          if (res?.url) window.location.href = res.url;
        })
      }
      className="w-full bg-blue-600 text-white font-bold py-3 rounded-xl hover:bg-blue-700 transition-all shadow-md active:scale-95"
    >
      {isPending ? "Loading..." : "Pay"}
    </button>
  );
}
  return (
    <button
      onClick={handleBuy}
      disabled={isPending}
      className="flex items-center justify-center gap-2 bg-orange-500 hover:bg-orange-600 text-white font-bold py-3 px-6 rounded-xl transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-md hover:shadow-lg w-full md:w-auto"
    >
      {isPending ? (
        <>
          <Loader2 className="animate-spin" size={20} />
          Processing...
        </>
      ) : (
        <>
          <CreditCard size={20} />
          {label}
        </>
      )}
    </button>
  );
}
