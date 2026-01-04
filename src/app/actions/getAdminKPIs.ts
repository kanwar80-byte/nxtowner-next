import "server-only";
import { createClient } from "@/utils/supabase/server";

export type AdminKPIs = {
  total_listings: number;
  total_users: number;
  pending_reviews: number;
  active_deals: number;
};

function toNumber(v: unknown): number {
  if (typeof v === "number") return v;
  if (typeof v === "bigint") return Number(v);
  if (typeof v === "string" && v.trim() !== "" && !Number.isNaN(Number(v))) return Number(v);
  return 0;
}

export async function getAdminKPIs(): Promise<AdminKPIs> {
  const supabase = await createClient();

  const { data, error } = await supabase.rpc("get_admin_kpis");
  if (error) throw error;

  const row = data?.[0];
  if (!row) {
    // non-admin (or admin check failed upstream) => return zeros
    return { total_listings: 0, total_users: 0, pending_reviews: 0, active_deals: 0 };
  }

  return {
    total_listings: toNumber((row as any).total_listings),
    total_users: toNumber((row as any).total_users),
    pending_reviews: toNumber((row as any).pending_reviews),
    active_deals: toNumber((row as any).active_deals),
  };
}
