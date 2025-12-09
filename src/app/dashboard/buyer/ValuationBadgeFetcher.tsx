"use client";
import { ListingAIBadge } from "@/components/listings/ListingAIBadge";
import { useEffect, useState } from "react";


export function ValuationBadgeFetcher({ listingId }: { listingId: string }) {
  const [valuation, setValuation] = useState<null | {
    ai_output_range_min: number;
    ai_output_range_max: number;
    ai_output_currency: string;
    ai_output_narrative?: string;
  }>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchValuation() {
      setLoading(true);
      setError(null);
      try {
        const res = await fetch(`/api/valuation-for-listing?id=${listingId}`);
        if (!res.ok) {
          const data = await res.json();
          throw new Error(data.error || 'No valuation found');
        }
        const data = await res.json();
        if (data && data.ai_output_range_min && data.ai_output_range_max) {
          setValuation(data);
        } else {
          setError('No valuation found');
        }
      } catch (err: unknown) {
        setError(err instanceof Error ? err.message : String(err));
      } finally {
        setLoading(false);
      }
    }
    fetchValuation();
  }, [listingId]);

  if (loading) {
    return (
      <span className="inline-block animate-pulse bg-orange-100 rounded px-2 py-1 text-xs text-orange-600">Loading AI Valuation…</span>
    );
  }
  if (error) {
    return (
      <span className="inline-block rounded px-2 py-1 text-xs text-red-500" title={error}>No AI Valuation</span>
    );
  }
  if (!valuation) return null;
  return (
    <ListingAIBadge
      valuationMin={valuation.ai_output_range_min}
      valuationMax={valuation.ai_output_range_max}
      currency={valuation.ai_output_currency}
      narrative={valuation.ai_output_narrative}
    />
  );
}
