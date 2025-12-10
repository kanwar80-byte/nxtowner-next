import { NextResponse, NextRequest } from "next/server";
import { createClient } from "@supabase/supabase-js";

const SUPABASE_URL = process.env.SUPABASE_URL;
const SUPABASE_SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;

export async function DELETE(request: NextRequest, context: { params: Promise<{ id: string }> }) {
  const { params } = context;
  const { id } = await params;
  if (!SUPABASE_URL || !SUPABASE_SERVICE_ROLE_KEY) {
    console.error("Admin /api/admin/valuations/[id] error: Supabase not configured");
    return NextResponse.json({ error: "Supabase not configured" }, { status: 500 });
  }
  if (!id) {
    console.error("Admin /api/admin/valuations/[id] error: Missing valuation id");
    return NextResponse.json({ error: "Missing valuation id" }, { status: 400 });
  }
  const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);
  const { error } = await supabase.from("valuations").delete().eq("id", id);
  if (error) {
    console.error("Admin /api/admin/valuations/[id] error: Supabase delete error", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
  return NextResponse.json({ success: true });
}
