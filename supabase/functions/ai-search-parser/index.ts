// Supabase Edge Function: AI Search Parser
// Parses natural language search queries into structured filters for NxtOwner.ca

import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
};

interface SearchRequest {
  query: string;
  mode: "operational" | "digital";
}

interface ParsedFilters {
  category?: string;
  location?: string;
  min_value?: number;
  is_verified?: boolean;
  type: "operational" | "digital";
}

interface SearchResponse {
  filters: ParsedFilters;
  raw_query: string;
}

/**
 * Lightweight NLP parser for extracting structured data from natural language queries
 */
function parseQuery(query: string, mode: "operational" | "digital"): ParsedFilters {
  const lowerQuery = query.toLowerCase();
  const filters: ParsedFilters = {
    type: mode,
  };

  // Extract category keywords
  const operationalCategories = [
    { keywords: ["gas station", "gas stations", "fuel station"], name: "Gas Stations" },
    { keywords: ["car wash", "car washes"], name: "Car Washes" },
    { keywords: ["franchise", "franchises"], name: "Franchise Resales" },
    { keywords: ["convenience store", "convenience stores"], name: "Convenience Stores" },
    { keywords: ["retail", "retail store"], name: "Retail" },
    { keywords: ["restaurant", "restaurants"], name: "Restaurants" },
    { keywords: ["logistics", "transport"], name: "Logistics" },
    { keywords: ["industrial", "manufacturing"], name: "Industrial" },
  ];

  const digitalCategories = [
    { keywords: ["saas", "software", "app", "application"], name: "SaaS" },
    { keywords: ["e-commerce", "ecommerce", "online store", "shopify"], name: "E-Commerce" },
    { keywords: ["ai tool", "ai tools", "artificial intelligence"], name: "AI Tools" },
    { keywords: ["content site", "content sites", "blog", "website"], name: "Content Sites" },
    { keywords: ["agency", "agencies"], name: "Agencies" },
    { keywords: ["mobile app", "mobile apps"], name: "Mobile Apps" },
  ];

  const categories = mode === "operational" ? operationalCategories : digitalCategories;

  for (const cat of categories) {
    if (cat.keywords.some((kw) => lowerQuery.includes(kw))) {
      filters.category = cat.name;
      break;
    }
  }

  // Extract location (Canadian provinces and major cities)
  const locations = [
    { keywords: ["ontario", "toronto", "gta", "greater toronto"], name: "Ontario" },
    { keywords: ["quebec", "montreal"], name: "Quebec" },
    { keywords: ["british columbia", "bc", "vancouver"], name: "British Columbia" },
    { keywords: ["alberta", "calgary", "edmonton"], name: "Alberta" },
    { keywords: ["manitoba", "winnipeg"], name: "Manitoba" },
    { keywords: ["saskatchewan", "regina"], name: "Saskatchewan" },
    { keywords: ["nova scotia", "halifax"], name: "Nova Scotia" },
    { keywords: ["new brunswick"], name: "New Brunswick" },
    { keywords: ["newfoundland"], name: "Newfoundland" },
    { keywords: ["remote", "remote work", "work from home"], name: "Remote" },
  ];

  for (const loc of locations) {
    if (loc.keywords.some((kw) => lowerQuery.includes(kw))) {
      filters.location = loc.name;
      break;
    }
  }

  // Extract financial metrics based on mode
  if (mode === "operational") {
    // EBITDA patterns: "over $500k EBITDA", "$500k+ ebitda", "ebitda > 500000"
    const ebitdaMatch = lowerQuery.match(
      /(?:over|above|more than|>|greater than)\s*\$?(\d+(?:\.\d+)?)\s*(k|thousand|m|million)?\s*(?:ebitda|cash flow|profit|sde)/i
    );
    if (ebitdaMatch) {
      let value = parseFloat(ebitdaMatch[1]);
      const unit = ebitdaMatch[2]?.toLowerCase();
      if (unit === "k" || unit === "thousand") value *= 1000;
      if (unit === "m" || unit === "million") value *= 1000000;
      filters.min_value = value;
    }
  } else {
    // MRR patterns: "$20k MRR", "mrr > 20000", "minimum $20k monthly"
    const mrrMatch =
      lowerQuery.match(
        /(?:mrr|monthly recurring revenue|monthly revenue).*?(?:over|above|>|minimum|min|at least)\s*\$?(\d+(?:\.\d+)?)\s*(k|thousand)?/i
      ) ||
      lowerQuery.match(/\$?(\d+(?:\.\d+)?)\s*(k|thousand)?\s*(?:mrr|monthly recurring)/i);
    if (mrrMatch) {
      let value = parseFloat(mrrMatch[1] || mrrMatch[2]);
      const unit = (mrrMatch[2] || mrrMatch[3])?.toLowerCase();
      if (unit === "k" || unit === "thousand") value *= 1000;
      filters.min_value = value;
    }
  }

  // Extract verification status
  const verifiedKeywords = ["verified", "vetted", "audited", "certified", "validated"];
  filters.is_verified = verifiedKeywords.some((kw) => lowerQuery.includes(kw));

  return filters;
}

/**
 * Optional: Use OpenAI/Groq for more advanced parsing (if API key is configured)
 */
async function parseWithAI(
  query: string,
  mode: "operational" | "digital",
  apiKey?: string,
  provider: "openai" | "groq" = "openai"
): Promise<ParsedFilters | null> {
  if (!apiKey) return null;

  try {
    const systemPrompt = `You are an AI assistant that parses business acquisition search queries.
Extract structured data from natural language queries about ${mode} assets.
Return ONLY a JSON object with: { category, location, min_value, is_verified, type }.
- category: Business category (e.g., "Gas Stations", "SaaS")
- location: Geographic location (e.g., "Ontario", "Remote")
- min_value: Minimum financial metric (EBITDA for operational, MRR for digital)
- is_verified: Boolean if user mentions verification
- type: "${mode}"`;

    const url =
      provider === "openai"
        ? "https://api.openai.com/v1/chat/completions"
        : "https://api.groq.com/openai/v1/chat/completions";

    const response = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model: provider === "openai" ? "gpt-3.5-turbo" : "mixtral-8x7b-32768",
        messages: [
          { role: "system", content: systemPrompt },
          { role: "user", content: query },
        ],
        temperature: 0.3,
        max_tokens: 200,
      }),
    });

    if (!response.ok) {
      console.error(`AI API error: ${response.statusText}`);
      return null;
    }

    const data = await response.json();
    const content = data.choices[0]?.message?.content;
    if (!content) return null;

    // Extract JSON from response (handle markdown code blocks)
    const jsonMatch = content.match(/\{[\s\S]*\}/);
    if (!jsonMatch) return null;

    const parsed = JSON.parse(jsonMatch[0]);
    return {
      ...parsed,
      type: mode,
    };
  } catch (error) {
    console.error("AI parsing error:", error);
    return null;
  }
}

serve(async (req) => {
  // Handle CORS preflight
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  try {
    // Get environment variables
    const supabaseUrl = Deno.env.get("SUPABASE_URL") ?? "";
    const supabaseKey = Deno.env.get("SUPABASE_ANON_KEY") ?? "";
    const openaiKey = Deno.env.get("OPENAI_API_KEY");
    const groqKey = Deno.env.get("GROQ_API_KEY");

    // Parse request body
    const { query, mode }: SearchRequest = await req.json();

    if (!query || typeof query !== "string") {
      return new Response(
        JSON.stringify({ error: "Missing or invalid 'query' parameter" }),
        {
          status: 400,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        }
      );
    }

    if (!mode || (mode !== "operational" && mode !== "digital")) {
      return new Response(
        JSON.stringify({
          error: "Missing or invalid 'mode' parameter. Must be 'operational' or 'digital'",
        }),
        {
          status: 400,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        }
      );
    }

    // Try AI parsing first (if configured), fallback to lightweight parser
    let filters: ParsedFilters;
    if (openaiKey) {
      const aiResult = await parseWithAI(query, mode, openaiKey, "openai");
      filters = aiResult || parseQuery(query, mode);
    } else if (groqKey) {
      const aiResult = await parseWithAI(query, mode, groqKey, "groq");
      filters = aiResult || parseQuery(query, mode);
    } else {
      // Use lightweight parser
      filters = parseQuery(query, mode);
    }

    const response: SearchResponse = {
      filters,
      raw_query: query,
    };

    return new Response(JSON.stringify(response), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("Error processing request:", error);
    return new Response(
      JSON.stringify({
        error: "Internal server error",
        message: error instanceof Error ? error.message : "Unknown error",
      }),
      {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      }
    );
  }
});


