import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

const SUPABASE_URL = process.env.SUPABASE_URL;
const SUPABASE_SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const listingId = searchParams.get("id");
  if (!listingId) {
    return NextResponse.json({ error: "Missing listing id" }, { status: 400 });
  }
  if (!SUPABASE_URL || !SUPABASE_SERVICE_ROLE_KEY) {
    return NextResponse.json({ error: "Supabase not configured" }, { status: 500 });
  }
  const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);
  const { data, error } = await supabase
    .from("valuations")
    .select("ai_output_range_min, ai_output_range_max, ai_output_currency, ai_output_narrative")
    .eq("listing_id", listingId)
    .eq("status", "completed")
    .order("created_at", { ascending: false })
    .limit(1)
    .single();
  if (error || !data) {
    return NextResponse.json({ error: error?.message || "No valuation found" }, { status: 404 });
  }
  return NextResponse.json(data);
}
