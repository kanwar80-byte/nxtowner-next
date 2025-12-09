import { NextRequest, NextResponse } from 'next/server';
import { GoogleGenerativeAI } from '@google/generative-ai';
import { supabase } from '@/lib/supabase';

// Initialize Gemini AI (server-side only)
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || '');

interface SearchFilters {
  type?: 'asset' | 'digital';
  category?: string;
  min_price?: number;
  max_price?: number;
  min_revenue?: number;
  max_revenue?: number;
  location?: string;
}

export async function POST(request: NextRequest) {
  try {
    const { query } = await request.json();

    if (!query || typeof query !== 'string') {
      return NextResponse.json(
        { error: 'Query parameter is required' },
        { status: 400 }
      );
    }

    // Use Gemini to extract structured filters from natural language
    const model = genAI.getGenerativeModel({ model: 'gemini-pro' });
    
    const prompt = `You are a search filter extraction assistant for a Canadian business marketplace.
Extract structured search filters from the following natural language query.

Query: "${query}"

Return a JSON object with the following fields (only include fields that are mentioned or implied):
{
  "type": "asset" or "digital" (asset = physical businesses like gas stations, car washes, restaurants; digital = SaaS, e-commerce, agencies),
  "category": specific category like "gas station", "car wash", "restaurant", "saas", "e-commerce", etc.,
  "min_price": minimum asking price in dollars,
  "max_price": maximum asking price in dollars,
  "min_revenue": minimum annual revenue in dollars,
  "max_revenue": maximum annual revenue in dollars,
  "location": location/region/province in Canada (e.g., "Ontario", "Toronto", "Vancouver")
}

Examples:
- "profitable car wash under 1M in Ontario" -> {"type": "asset", "category": "car wash", "max_price": 1000000, "location": "Ontario"}
- "SaaS business making over 500k revenue" -> {"type": "digital", "category": "saas", "min_revenue": 500000}
- "gas station in BC" -> {"type": "asset", "category": "gas station", "location": "BC"}

Return ONLY the JSON object, no other text.`;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();

    // Parse the Gemini response
    let filters: SearchFilters = {};
    try {
      // Extract JSON from response (Gemini might wrap it in markdown)
      const jsonMatch = text.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        filters = JSON.parse(jsonMatch[0]);
      }
    } catch (parseError) {
      console.error('Failed to parse Gemini response:', parseError);
      // Fallback to empty filters
    }

    // Query Supabase with extracted filters
    let supabaseQuery = supabase
      .from('listings')
      .select('*')
      .eq('status', 'active')
      .order('created_at', { ascending: false })
      .limit(20);

    if (filters.type) {
      supabaseQuery = supabaseQuery.eq('type', filters.type);
    }
    if (filters.category) {
      supabaseQuery = supabaseQuery.ilike('category', `%${filters.category}%`);
    }
    if (filters.min_price !== undefined) {
      supabaseQuery = supabaseQuery.gte('asking_price', filters.min_price);
    }
    if (filters.max_price !== undefined) {
      supabaseQuery = supabaseQuery.lte('asking_price', filters.max_price);
    }
    if (filters.min_revenue !== undefined) {
      supabaseQuery = supabaseQuery.gte('annual_revenue', filters.min_revenue);
    }
    if (filters.max_revenue !== undefined) {
      supabaseQuery = supabaseQuery.lte('annual_revenue', filters.max_revenue);
    }
    if (filters.location) {
      supabaseQuery = supabaseQuery.or(`location.ilike.%${filters.location}%,region.ilike.%${filters.location}%,country.ilike.%${filters.location}%`);
    }

    const { data: listings, error: dbError } = await supabaseQuery;

    if (dbError) {
      throw dbError;
    }

    return NextResponse.json({
      success: true,
      filters,
      results: listings || [],
      count: listings?.length || 0,
    });

  } catch (error) {
    console.error('AI search error:', error);
    return NextResponse.json(
      { error: 'Failed to process AI search' },
      { status: 500 }
    );
  }
}
