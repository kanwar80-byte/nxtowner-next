import { NextResponse } from "next/server";
import { GoogleGenerativeAI } from "@google/generative-ai";
import { createClient } from "@supabase/supabase-js";
import { cleanJsonString } from "@/lib/cleanJsonString";
import { valuationAISchema } from "@/lib/valuationSchema";

const GEMINI_API_KEY = process.env.GEMINI_API_KEY;
const SUPABASE_URL = process.env.SUPABASE_URL;
const SUPABASE_SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!GEMINI_API_KEY) {
  console.warn("GEMINI_API_KEY not set – /api/ai-valuation will return error.");
}
if (!SUPABASE_URL || !SUPABASE_SERVICE_ROLE_KEY) {
  console.warn("Supabase env vars not set – /api/ai-valuation will not persist results.");
}

export async function POST(req: Request) {
  if (!GEMINI_API_KEY) {
    console.error("NexusAI /api/ai-valuation error: GEMINI_API_KEY not set");
    return NextResponse.json(
      { error: "Valuation service is not configured." },
      { status: 500 }
    );
  }

  let body;
  try {
    body = await req.json();
  } catch (err) {
    console.error("NexusAI /api/ai-valuation error: Invalid JSON body", err);
    return NextResponse.json({ error: "Invalid JSON body." }, { status: 400 });
  }

  // Minimal required fields
  const {
    profile_id,
    listing_id,
    asset_type,
    business_type,
    title,
    country,
    region,
    annual_revenue,
    annual_profit,
    asking_price,
    key_metrics,
    notes,
  } = body;

  if (!profile_id || !asset_type || !title) {
    console.error("NexusAI /api/ai-valuation error: Missing required fields", { profile_id, asset_type, title });
    return NextResponse.json({ error: "Missing required fields." }, { status: 400 });
  }

  // Build prompt
  const prompt = `You are NexusAI, an expert business valuation analyst. Given the following business details, estimate a conservative and optimistic valuation range in CAD, and provide a short narrative. Respond STRICTLY in JSON format as follows: {\n  \"valuation_min\": number,\n  \"valuation_max\": number,\n  \"currency\": \"CAD\",\n  \"revenue_multiple\": number,\n  \"profit_multiple\": number,\n  \"narrative\": string\n}\nBusiness details:\nAsset type: ${asset_type}\nBusiness type: ${business_type}\nTitle: ${title}\nCountry: ${country}\nRegion: ${region}\nAnnual revenue: ${annual_revenue}\nAnnual profit: ${annual_profit}\nAsking price: ${asking_price}\nKey metrics: ${JSON.stringify(key_metrics)}\nNotes: ${notes}`;

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
      console.error("NexusAI /api/ai-valuation error: JSON parse error", error, cleanedValue);
      return NextResponse.json({ error: "AI returned invalid JSON. Please try again." }, { status: 500 });
    }
    // Zod validation
    try {
      aiResult = valuationAISchema.parse(parsed);
    } catch (error) {
      console.error("NexusAI /api/ai-valuation error: schema validation error", error, parsed);
      return NextResponse.json({ error: "AI returned data in an unexpected format. Please try again." }, { status: 500 });
    }
  } catch (err) {
    return NextResponse.json({ error: "AI valuation failed.", details: String(err) }, { status: 500 });
  }

  // Persist to Supabase
  let supabase, dbResult;
  if (SUPABASE_URL && SUPABASE_SERVICE_ROLE_KEY) {
    supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);
    try {
      const { data, error }: { data: unknown; error: { message?: string } | null } = await supabase.from("valuations").insert([
        {
          profile_id,
          listing_id,
          asset_type,
          business_type,
          title,
          country,
          region,
          annual_revenue,
          annual_profit,
          asking_price,
          key_metrics,
          notes,
          ai_input_summary: prompt.slice(0, 500),
          ai_output_range_min: aiResult.valuation.range_low,
          ai_output_range_max: aiResult.valuation.range_high,
          ai_output_currency: "CAD",
          ai_output_multiples: {
            method: aiResult.valuation.method,
          },
          ai_output_narrative: aiResult.valuation.notes,
          status: "completed",
        },
      ]);
      if (error) {
        dbResult = { error: error.message };
      } else if (Array.isArray(data) && data.length > 0 && 'id' in data[0]) {
        dbResult = { id: (data[0] as { id?: string }).id };
      } else {
        dbResult = { id: undefined };
      }
    } catch (err) {
      console.error("NexusAI /api/ai-valuation error: Supabase insert error", err);
      dbResult = { error: String(err) };
    }
  }

  return NextResponse.json({ ...aiResult, db: dbResult });
}
