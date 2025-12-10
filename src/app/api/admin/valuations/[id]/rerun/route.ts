import { NextResponse, NextRequest } from "next/server";
import { GoogleGenerativeAI } from "@google/generative-ai";
import { createClient } from "@supabase/supabase-js";
import { cleanJsonString } from "@/lib/cleanJsonString";
import { valuationAISchema } from "@/lib/valuationSchema";

const GEMINI_API_KEY = process.env.GEMINI_API_KEY;
const SUPABASE_URL = process.env.SUPABASE_URL;
const SUPABASE_SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;

export async function POST(request: NextRequest, context: { params: Promise<{ id: string }> }) {
  const { params } = context;
  const { id } = await params;
  if (!GEMINI_API_KEY || !SUPABASE_URL || !SUPABASE_SERVICE_ROLE_KEY) {
    console.error("Admin /api/admin/valuations/[id]/rerun error: Service not configured");
    return NextResponse.json({ error: "Service not configured" }, { status: 500 });
  }
  if (!id) {
    console.error("Admin /api/admin/valuations/[id]/rerun error: Missing valuation id");
    return NextResponse.json({ error: "Missing valuation id" }, { status: 400 });
  }
  const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);
  // Fetch the existing valuation row
  const { data: row, error: fetchError } = await supabase.from("valuations").select("*").eq("id", id).single();
  if (fetchError || !row) {
    console.error("Admin /api/admin/valuations/[id]/rerun error: Supabase fetch error", fetchError);
    return NextResponse.json({ error: fetchError?.message || "Valuation not found" }, { status: 404 });
  }
  // Build prompt from row
  const prompt = `You are NexusAI, an expert business valuation analyst. Given the following business details, estimate a conservative and optimistic valuation range in CAD, and provide a short narrative. Respond STRICTLY in JSON format as follows: {\n  \"valuation_min\": number,\n  \"valuation_max\": number,\n  \"currency\": \"CAD\",\n  \"revenue_multiple\": number,\n  \"profit_multiple\": number,\n  \"narrative\": string\n}\nBusiness details:\nAsset type: ${row.asset_type}\nBusiness type: ${row.business_type}\nTitle: ${row.title}\nCountry: ${row.country}\nRegion: ${row.region}\nAnnual revenue: ${row.annual_revenue}\nAnnual profit: ${row.annual_profit}\nAsking price: ${row.asking_price}\nKey metrics: ${JSON.stringify(row.key_metrics)}\nNotes: ${row.notes}`;
  let aiResult, parsed;
  try {
    const genAI = new GoogleGenerativeAI(GEMINI_API_KEY);
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
    const result = await model.generateContent(prompt);
    const text = result.response.text();
    const cleanedValue = cleanJsonString(text);
    try {
      parsed = JSON.parse(cleanedValue);
    } catch (error) {
      console.error("Admin /api/admin/valuations/[id]/rerun error: JSON parse error", error, cleanedValue);
      return NextResponse.json({ error: "AI returned invalid JSON. Please try again." }, { status: 500 });
    }
    try {
      aiResult = valuationAISchema.parse(parsed);
    } catch (error) {
      console.error("Admin /api/admin/valuations/[id]/rerun error: schema validation error", error, parsed);
      return NextResponse.json({ error: "AI returned data in an unexpected format. Please try again." }, { status: 500 });
    }
  } catch (err) {
    console.error("Admin /api/admin/valuations/[id]/rerun error: AI valuation failed", err);
    return NextResponse.json({ error: "AI valuation failed.", details: String(err) }, { status: 500 });
  }
  // Update the row with new AI output
  const { error: updateError } = await supabase.from("valuations").update({
    ai_output_range_min: aiResult.valuation.range_low,
    ai_output_range_max: aiResult.valuation.range_high,
    ai_output_currency: "CAD",
    ai_output_multiples: { method: aiResult.valuation.method },
    ai_output_narrative: aiResult.valuation.notes,
    status: "completed",
    error_message: null
  }).eq("id", id);
  if (updateError) {
    console.error("Admin /api/admin/valuations/[id]/rerun error: Supabase update error", updateError);
    return NextResponse.json({ error: updateError.message }, { status: 500 });
  }
  return NextResponse.json({ success: true });
}
