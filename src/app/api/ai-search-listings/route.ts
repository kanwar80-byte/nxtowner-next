import { NextRequest, NextResponse } from 'next/server';
import { GoogleGenerativeAI } from '@google/generative-ai';
import { searchListingsV16 } from "@/lib/v16/listings.repo";
import {
  getCategoryIdByCode,
  getSubcategoryIdByCode,
} from "@/lib/v17/categoryResolver";
import { AISearchListingsRequestSchema } from '@/lib/validation/api.schemas';

// Initialize Gemini AI (server-side only)
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || '');

interface SearchFilters {
  type?: 'operational' | 'digital';
  categoryCode?: string;
  subcategoryCode?: string;
  min_price?: number;
  max_price?: number;
  min_revenue?: number;
  max_revenue?: number;
  location?: string;
  is_verified?: boolean;
}

export async function POST(request: NextRequest) {
  try {
    const rawBody = await request.json();

    // Validate request body with Zod
    const validationResult = AISearchListingsRequestSchema.safeParse(rawBody);
    if (!validationResult.success) {
      return NextResponse.json(
        {
          error: 'Validation failed',
          details: validationResult.error.errors.map((err) => ({
            path: err.path.join('.'),
            message: err.message,
          })),
        },
        { status: 400 }
      );
    }

    const { query, mode, location: requestLocation } = validationResult.data;

    const raw_query = query;
    let filters: SearchFilters = {};
    let suggestedMode: 'operational' | 'digital' | null = null;

    // Try to use Gemini if API key is available
    const geminiApiKey = process.env.GEMINI_API_KEY;
    if (geminiApiKey) {
      try {
        // Use Gemini to extract structured filters from natural language
        const model = genAI.getGenerativeModel({ model: 'gemini-pro' });
        
        const prompt = `You are a search filter extraction assistant for a Canadian business marketplace.
Extract structured search filters from the following natural language query.

Query: "${query}"

Return a JSON object with the following fields (only include fields that are mentioned or implied):
{
  "type": "operational" or "digital" (operational = physical businesses like gas stations, car washes, restaurants; digital = SaaS, e-commerce, agencies),
  "categoryCode": category code like "fuel_auto", "retail_franchise", "saas_software", "ecommerce", etc. (use snake_case codes, not display names),
  "subcategoryCode": optional subcategory code like "gas_stations", "car_washes", "b2b_saas", etc. (use snake_case codes),
  "min_price": minimum asking price in dollars,
  "max_price": maximum asking price in dollars,
  "min_revenue": minimum annual revenue in dollars,
  "max_revenue": maximum annual revenue in dollars,
  "location": location/region/province in Canada (e.g., "Ontario", "Toronto", "Vancouver")
}

Examples:
- "profitable car wash under 1M in Ontario" -> {"type": "operational", "categoryCode": "fuel_auto", "subcategoryCode": "car_washes", "max_price": 1000000, "location": "Ontario"}
- "SaaS business making over 500k revenue" -> {"type": "digital", "categoryCode": "saas_software", "subcategoryCode": "b2b_saas", "min_revenue": 500000}
- "gas station in BC" -> {"type": "operational", "categoryCode": "fuel_auto", "subcategoryCode": "gas_stations", "location": "BC"}

Return ONLY the JSON object, no other text.`;

        const result = await model.generateContent(prompt);
        const response = await result.response;
        const text = response.text();

        // Parse the Gemini response
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

        // Check for mode mismatch
        if (filters.type && mode && filters.type !== mode) {
          suggestedMode = filters.type as 'operational' | 'digital';
        }
      } catch (geminiError) {
        console.error('Gemini API error:', geminiError);
        // Continue with basic search below
      }
    }

    // Use request location if provided and not in filters
    if (requestLocation && !filters.location) {
      filters.location = requestLocation;
    }

    // Resolve category codes to UUIDs
    const categoryId = filters.categoryCode
      ? await getCategoryIdByCode(filters.categoryCode)
      : null;
    const subcategoryId = filters.subcategoryCode
      ? await getSubcategoryIdByCode(filters.subcategoryCode)
      : null;

    // Map AI filters to V16 Filters and use canonical V16 repo
    const v16Filters = {
      assetType: filters.type === 'operational' 
        ? 'Operational' as const
        : filters.type === 'digital' 
          ? 'Digital' as const
          : (mode === 'operational' ? 'Operational' as const : mode === 'digital' ? 'Digital' as const : undefined),
      categoryId: categoryId ?? undefined,
      subcategoryId: subcategoryId ?? undefined,
      minPrice: filters.min_price,
      maxPrice: filters.max_price,
      sort: 'newest' as const,
    };

    // Use V16 canonical repo
    const v16Results = await searchListingsV16(v16Filters);

    // Apply additional filters that V16 repo doesn't support directly (client-side filtering)
    let listings = v16Results;

    // Filter by revenue (if specified) - V16 repo doesn't have revenue filtering yet
    if (filters.min_revenue !== undefined) {
      listings = listings.filter((item) => (item.revenue_annual ?? 0) >= filters.min_revenue!);
    }
    if (filters.max_revenue !== undefined) {
      listings = listings.filter((item) => (item.revenue_annual ?? 0) <= filters.max_revenue!);
    }

    // Filter by location (if specified) - V16 repo doesn't have location filtering yet
    if (filters.location) {
      const locationLower = filters.location.toLowerCase();
      listings = listings.filter((item) => {
        const city = (item.city ?? '').toLowerCase();
        const province = (item.province ?? '').toLowerCase();
        const country = (item.country ?? '').toLowerCase();
        return city.includes(locationLower) || province.includes(locationLower) || country.includes(locationLower);
      });
    }

    // Use the first 20 results for the AI context
    listings = listings.slice(0, 20);

    return NextResponse.json({
      success: true,
      raw_query,
      suggestedMode,
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
