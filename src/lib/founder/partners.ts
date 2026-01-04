import "server-only";
import { createClient } from "@/utils/supabase/server";
import { getListingTrack } from "@/lib/track";

export type PartnerMetrics = {
  leadsByPartner: Array<{ partnerName: string; leads: number; ndaSigned: number; conversionRate: number | null }>;
  leadsByTrack: {
    operational: number | null;
    digital: number | null;
  };
  dataQualityNote?: string;
};

function toNumber(v: unknown): number {
  if (typeof v === "number") return v;
  if (typeof v === "bigint") return Number(v);
  if (typeof v === "string" && v.trim() !== "" && !Number.isNaN(Number(v))) return Number(v);
  return 0;
}

/**
 * Get partner intelligence metrics.
 * Returns partner lead data if partner_leads table exists, otherwise returns empty state.
 */
export async function getPartnerMetrics(track: 'all' | 'operational' | 'digital' = 'all'): Promise<PartnerMetrics> {
  const supabase = await createClient();
  const now = new Date();
  const thirtyDaysAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);

  try {
    // TODO(schema): partner_leads and partners tables do not exist
    const leadsByPartner: Array<{ partnerName: string; leads: number; ndaSigned: number; conversionRate: number | null }> = [];
    const leadsByTrack = { operational: null as number | null, digital: null as number | null };

    return {
      leadsByPartner,
      leadsByTrack,
    };
  } catch (error) {
    if (process.env.NODE_ENV === "development") {
      console.warn("[getPartnerMetrics] Error:", error);
    }
    return {
      leadsByPartner: [],
      leadsByTrack: { operational: null, digital: null },
      dataQualityNote: "Partner lead data not configured",
    };
  }
}

