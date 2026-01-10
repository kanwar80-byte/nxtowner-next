import { NextRequest, NextResponse } from 'next/server';
import { GoogleGenerativeAI } from '@google/generative-ai';
import { getFilterExtractionPrompt } from '@/lib/v17/ai/prompts';
import { searchListingsV17 } from '@/lib/v17/search/searchService';
import { sanitizeFilters, validateTaxonomy } from '@/lib/v17/search/filters';
import { V17AISearchRequestSchema } from '@/lib/validation/api.schemas';
import type { SearchFiltersV17 } from '@/types/v17/search';

export const dynamic = 'force-dynamic';

// Initialize Gemini AI (server-side only)
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || '');

/**
 * V17 Canonical AI Search API
 * POST /api/v17/ai-search
 * Input: { query: string }
 * Output: { extracted_filters, items, total }
 */
export async function POST(request: NextRequest) {
  let query = '';
  try {
    const rawBody = await request.json();

    // Validate request body with Zod
    const validationResult = V17AISearchRequestSchema.safeParse(rawBody);
    if (!validationResult.success) {
      return NextResponse.json(
        {
          error: 'Validation failed',
          details: validationResult.error.issues.map((err) => ({
            path: err.path.join('.'),
            message: err.message,
          })),
        },
        { status: 400 }
      );
    }

    query = validationResult.data.query;

    let extractedFilters: SearchFiltersV17 = {};

    // Try to use Gemini if API key is available
    const geminiApiKey = process.env.GEMINI_API_KEY;
    if (geminiApiKey) {
      try {
        const model = genAI.getGenerativeModel({ model: 'gemini-pro' });
        const prompt = getFilterExtractionPrompt(query);
        
        const result = await model.generateContent(prompt);
        const response = await result.response;
        const text = response.text();

        // Parse JSON from response (strip markdown fences if present)
        try {
          // Remove markdown code fences if present
          let cleaned = text.trim();
          if (cleaned.startsWith('```json')) {
            cleaned = cleaned.replace(/^```json\s*/, '').replace(/\s*```$/, '');
          } else if (cleaned.startsWith('```')) {
            cleaned = cleaned.replace(/^```\s*/, '').replace(/\s*```$/, '');
          }
          cleaned = cleaned.trim();
          
          // Extract JSON object
          const jsonMatch = cleaned.match(/\{[\s\S]*\}/);
          let parsed: unknown = null;
          
          if (jsonMatch) {
            parsed = JSON.parse(jsonMatch[0]);
          } else {
            // Try parsing entire cleaned response
            parsed = JSON.parse(cleaned);
          }
          
          // Normalize: Handle Gemini returning { "filters": { ... } } wrapper
          if (parsed && typeof parsed === 'object' && 'filters' in parsed && typeof parsed.filters === 'object') {
            extractedFilters = parsed.filters as SearchFiltersV17;
          } else {
            extractedFilters = parsed as SearchFiltersV17;
          }
        } catch (parseError) {
          console.error('[v17/ai-search] Failed to parse Gemini response:', parseError);
          // Return error response with empty results
          return NextResponse.json({
            query,
            extracted_filters: {},
            filters_applied: {},
            items: [],
            total: 0,
            page: 1,
            page_size: 24,
            result_reason: 'parse_failed' as const,
            error: 'Could not parse filters',
          });
        }
      } catch (geminiError) {
        console.error('[v17/ai-search] Gemini API error:', geminiError);
        // Continue with empty filters
      }
    }

    // Sanitize extracted filters (drops invalid categories/subcategories)
    const sanitized = sanitizeFilters(extractedFilters);
    // Safety net: validate taxonomy (drops unknown categories to prevent silent "no results")
    const validated = validateTaxonomy(sanitized);

    // Guard: If query exists but clean filters are empty, return error without calling search
    if (query && Object.keys(validated).length === 0) {
      return NextResponse.json({
        query,
        extracted_filters: extractedFilters || {},
        filters_applied: {},
        items: [],
        total: 0,
        page: 1,
        page_size: 24,
        result_reason: 'invalid_filters' as const,
        error: 'Could not infer any valid filters from query',
      });
    }

    // Search listings
    const result = await searchListingsV17(validated);

    // Determine result reason if items are empty
    let result_reason: 'no_results' | 'invalid_filters' | 'parse_failed' | undefined = undefined;
    if (result.items.length === 0) {
      // Check if filters were invalid (category/subcategory dropped)
      const hadCategory = extractedFilters.category || extractedFilters.subcategory;
      const hasCategory = validated.category || validated.subcategory;
      if (hadCategory && !hasCategory) {
        result_reason = 'invalid_filters';
      } else {
        result_reason = 'no_results';
      }
    }

    return NextResponse.json({
      query,
      extracted_filters: extractedFilters, // Raw extracted (before sanitization)
      filters_applied: validated, // After sanitize + validateTaxonomy
      items: result.items,
      total: result.total,
      page: result.page,
      page_size: result.page_size,
      ...(result_reason && { result_reason }),
    });
  } catch (error) {
    console.error('[v17/ai-search] Error:', error);
    return NextResponse.json(
      {
        query,
        extracted_filters: {},
        filters_applied: {},
        items: [],
        total: 0,
        page: 1,
        page_size: 24,
        result_reason: 'parse_failed' as const,
        error: 'AI search failed',
      },
      { status: 500 }
    );
  }
}

