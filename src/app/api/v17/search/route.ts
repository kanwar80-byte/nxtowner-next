import { NextRequest, NextResponse } from 'next/server';
import { searchListingsV17 } from '@/lib/v17/search/searchService';
import { sanitizeFilters, validateTaxonomy } from '@/lib/v17/search/filters';
import type { SearchFiltersV17 } from '@/types/v17/search';

export const dynamic = 'force-dynamic';

/**
 * V17 Canonical Search API
 * POST /api/v17/search
 * Input: { filters: SearchFiltersV17 }
 * Output: { items, total, page, page_size, filters_applied }
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    if (!body || typeof body !== 'object' || !body.filters) {
      return NextResponse.json(
        { error: 'Missing filters object' },
        { status: 400 }
      );
    }

    // Sanitize and validate filters
    const sanitized = sanitizeFilters(body.filters);
    // Safety net: validate taxonomy (drops unknown categories to prevent silent "no results")
    const validated = validateTaxonomy(sanitized);

    // Search listings
    const result = await searchListingsV17(validated);

    return NextResponse.json({
      items: result.items,
      total: result.total,
      page: result.page,
      page_size: result.page_size,
      filters_applied: validated,
    });
  } catch (error) {
    // Never leak Supabase errors
    console.error('[v17/search] Error:', error);
    return NextResponse.json(
      { error: 'Search failed' },
      { status: 500 }
    );
  }
}

