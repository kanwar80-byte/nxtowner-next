import "server-only";
import { createClient } from "@/utils/supabase/server";

export type RevenueMetrics = {
  paidUsers: {
    count: number | null;
    delta7d: number | null;
    delta30d: number | null;
  };
  mrr: {
    value: number | null;
    isEstimated: boolean;
    note?: string;
  };
  arr: {
    value: number | null;
    isEstimated: boolean;
    note?: string;
  };
  revenueByTier: Array<{ tier: string; count: number; mrr: number | null }>;
  dataQualityNote?: string;
};

function toNumber(v: unknown): number {
  if (typeof v === "number") return v;
  if (typeof v === "bigint") return Number(v);
  if (typeof v === "string" && v.trim() !== "" && !Number.isNaN(Number(v))) return Number(v);
  return 0;
}

/**
 * Get revenue metrics from profiles and subscription tables.
 * Best-effort: falls back gracefully if subscription data doesn't exist.
 * Track parameter is for future use (revenue by track if profiles/listings mapping exists).
 */
export async function getRevenueMetrics(track: 'all' | 'operational' | 'digital' = 'all'): Promise<RevenueMetrics> {
  const supabase = await createClient();
  const now = new Date();
  const sevenDaysAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
  const thirtyDaysAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
  const sixtyDaysAgo = new Date(now.getTime() - 60 * 24 * 60 * 60 * 1000);

  try {
    // TODO(schema): analytics_revenue_daily and subscriptions tables do not exist
    let paidUsersCount: number | null = null;
    let paidUsers7d: number | null = null;
    let paidUsers30d: number | null = null;
    let mrr: number | null = null;
    let arr: number | null = null;
    const mrrEstimated = true;
    let mrrNote: string | undefined;

    // Paid Users: Try profiles.tier or subscription_tier column
    try {
      // Check if profiles has tier/subscription_tier column
      const { data: allProfiles } = await supabase
        .from('profiles')
        .select('id, subscription_tier, tier, created_at')
        .limit(1);

      if (allProfiles && allProfiles.length > 0) {
        const profile = allProfiles[0] as any;
        const hasTier = 'subscription_tier' in profile || 'tier' in profile;

        if (hasTier) {
          const tierField = 'subscription_tier' in profile ? 'subscription_tier' : 'tier';
          
          // Total paid users
          const { count: totalCount } = await supabase
            .from('profiles')
            .select('*', { count: 'exact', head: true })
            .or(`${tierField}.neq.free,${tierField}.neq.null`)
            .not(tierField, 'is', null);
          paidUsersCount = toNumber(totalCount || 0);

          // Paid users created in 7d
          const { count: count7d } = await supabase
            .from('profiles')
            .select('*', { count: 'exact', head: true })
            .or(`${tierField}.neq.free,${tierField}.neq.null`)
            .not(tierField, 'is', null)
            .gte('created_at', sevenDaysAgo.toISOString());
          paidUsers7d = toNumber(count7d || 0);

          // Paid users created in 30d
          const { count: count30d } = await supabase
            .from('profiles')
            .select('*', { count: 'exact', head: true })
            .or(`${tierField}.neq.free,${tierField}.neq.null`)
            .not(tierField, 'is', null)
            .gte('created_at', thirtyDaysAgo.toISOString());
          paidUsers30d = toNumber(count30d || 0);
        }
      }
    } catch {
      // Profiles tier data not available
    }

    // MRR/ARR: Estimate from paid users
    if (paidUsersCount !== null) {
      mrr = paidUsersCount * 50; // Rough estimate: $50/month average
      arr = mrr * 12;
      mrrNote = "Estimated from paid user count (assumes $50/month average)";
    } else {
      mrrNote = "Insufficient data captured for MRR calculation";
    }

    // Revenue by tier
    const revenueByTier: Array<{ tier: string; count: number; mrr: number | null }> = [];
    try {
      const { data: profiles } = await supabase
        .from('profiles')
        .select('subscription_tier, tier')
        .limit(1000);

      if (profiles) {
        const tierCounts = new Map<string, number>();
        profiles.forEach((p: any) => {
          const tier = p.subscription_tier || p.tier || 'free';
          if (tier !== 'free') {
            tierCounts.set(tier, (tierCounts.get(tier) || 0) + 1);
          }
        });

        tierCounts.forEach((count, tier) => {
          revenueByTier.push({
            tier,
            count,
            mrr: count * 50, // Estimated
          });
        });
      }
    } catch {
      // Tier breakdown not available
    }

    return {
      paidUsers: {
        count: paidUsersCount,
        delta7d: paidUsers7d,
        delta30d: paidUsers30d,
      },
      mrr: {
        value: mrr,
        isEstimated: mrrEstimated,
        note: mrrNote,
      },
      arr: {
        value: arr,
        isEstimated: mrrEstimated,
        note: mrrNote,
      },
      revenueByTier,
      dataQualityNote: paidUsersCount === null ? "Insufficient data captured for revenue metrics" : undefined,
    };
  } catch (error) {
    if (process.env.NODE_ENV === "development") {
      console.warn("[getRevenueMetrics] Error:", error);
    }
    return {
      paidUsers: { count: null, delta7d: null, delta30d: null },
      mrr: { value: null, isEstimated: true, note: "Insufficient data captured for MRR calculation" },
      arr: { value: null, isEstimated: true, note: "Insufficient data captured for ARR calculation" },
      revenueByTier: [],
      dataQualityNote: "Insufficient data captured for revenue metrics",
    };
  }
}

