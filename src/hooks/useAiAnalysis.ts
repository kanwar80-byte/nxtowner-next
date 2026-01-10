import { useState, useEffect, useCallback } from "react";
import { createSupabaseBrowserClient } from "@/utils/supabase/client";

export interface AiAnalysis {
  summary_one_liner: string;
  deal_grade: "A" | "B" | "C";
  buyer_insight: string;
  growth_vector: string;
  red_flags: string[];
  green_lights: string[];
  valuation_comment: string;
}

export interface UseAiAnalysisResult {
  analysis: AiAnalysis | null;
  loading: boolean;
  error: Error | null;
  refetch: () => Promise<void>;
}

/**
 * Custom hook to fetch AI analysis from the analyze-listing Edge Function
 */
export function useAiAnalysis(listingId: string | null): UseAiAnalysisResult {
  const [analysis, setAnalysis] = useState<AiAnalysis | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  const fetchAnalysis = useCallback(async () => {
    if (!listingId) {
      setAnalysis(null);
      setLoading(false);
      setError(null);
      return;
    }

    try {
      setLoading(true);
      setError(null);

      const supabase = createSupabaseBrowserClient();

      // Call the Edge Function using supabase.functions.invoke
      const { data, error: invokeError } = await supabase.functions.invoke("analyze-listing", {
        body: { listing_id: listingId },
      });

      if (invokeError) {
        throw new Error(invokeError.message || "Failed to fetch AI analysis");
      }

      if (!data) {
        throw new Error("No analysis data returned");
      }

      // Validate the response structure
      if (
        typeof data.summary_one_liner !== "string" ||
        !["A", "B", "C"].includes(data.deal_grade) ||
        typeof data.buyer_insight !== "string" ||
        typeof data.growth_vector !== "string" ||
        !Array.isArray(data.red_flags) ||
        !Array.isArray(data.green_lights) ||
        typeof data.valuation_comment !== "string"
      ) {
        throw new Error("Invalid analysis data structure");
      }

      setAnalysis(data as AiAnalysis);
    } catch (err) {
      console.error("Error fetching AI analysis:", err);
      setError(err instanceof Error ? err : new Error("Failed to load analysis"));
      setAnalysis(null);
    } finally {
      setLoading(false);
    }
  }, [listingId]);

  useEffect(() => {
    fetchAnalysis();
  }, [fetchAnalysis]);

  return {
    analysis,
    loading,
    error,
    refetch: fetchAnalysis,
  };
}

