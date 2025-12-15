"use client";

import React, { useTransition } from "react";
import { createCheckoutSession } from "@/app/actions/stripe";
import { Loader2, CreditCard } from "lucide-react";
import { useRouter } from "next/navigation";

interface StripeButtonProps {
  priceId: string;
  label?: string;
}

export default function StripeButton({ priceId, label = "Buy Now" }: StripeButtonProps) {
  const [isPending, startTransition] = useTransition();
  const router = useRouter();

  const handleBuy = () => {
    startTransition(async () => {
      try {
        const { url } = await createCheckoutSession(priceId);
        if (url) {
          router.push(url);
        }
      } catch (error) {
        console.error("Stripe Checkout Error:", error);
      }
    });
  };

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