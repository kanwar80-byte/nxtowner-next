"use client";

import type { SearchFiltersV17, ListingTeaserV17 } from '@/types/v17/search';

/**
 * V17 Search Client Helpers
 * Client-side fetch functions for V17 search APIs
 */

export interface SearchResponse {
  items: ListingTeaserV17[];
  total: number;
  page: number;
  page_size: number;
  filters_applied?: SearchFiltersV17;
  extracted_filters?: SearchFiltersV17;
  result_reason?: 'no_results' | 'invalid_filters' | 'parse_failed';
  error?: string;
}

/**
 * AI Search - calls /api/v17/ai-search
 */
export async function aiSearch(query: string): Promise<SearchResponse> {
  // Guard: If query is empty, return error without calling API
  if (!query || !query.trim()) {
    return {
      items: [],
      total: 0,
      page: 1,
      page_size: 24,
      result_reason: 'invalid_filters',
      error: 'Query is required',
    };
  }

  try {
    const response = await fetch('/api/v17/ai-search', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ query }),
      cache: 'no-store',
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      return {
        items: [],
        total: 0,
        page: 1,
        page_size: 24,
        result_reason: 'parse_failed',
        error: errorData.error || 'AI search failed',
      };
    }

    const data = await response.json();
    return {
      items: data.items || [],
      total: data.total || 0,
      page: data.page || 1,
      page_size: data.page_size || 24,
      filters_applied: data.filters_applied,
      extracted_filters: data.extracted_filters,
      result_reason: data.result_reason,
      error: data.error,
    };
  } catch (error) {
    console.error('[aiSearch] Error:', error);
    return {
      items: [],
      total: 0,
      page: 1,
      page_size: 24,
      result_reason: 'parse_failed',
      error: 'Network error',
    };
  }
}

/**
 * Manual Search - calls /api/v17/search
 */
export async function manualSearch(filters: Record<string, unknown>): Promise<SearchResponse> {
  // Strip empty/null/undefined values before POST
  // IMPORTANT: Never strip listing_type - it's a required filter
  const cleanedFilters: Record<string, unknown> = {};
  for (const [key, value] of Object.entries(filters)) {
    // Preserve listing_type even if it's an empty string (will be handled by API validation)
    if (key === 'listing_type') {
      cleanedFilters[key] = value;
    } else if (
      value === '' ||
      value === null ||
      value === undefined
    ) {
      // Skip empty/null/undefined values for other keys
      continue;
    } else {
      cleanedFilters[key] = value;
    }
  }

  // Hard guard: If no valid filters remain after cleaning, return error without calling API
  if (Object.keys(cleanedFilters).length === 0) {
    return {
      items: [],
      total: 0,
      page: 1,
      page_size: 24,
      result_reason: 'invalid_filters',
      error: 'No valid filters provided',
    };
  }

  try {
    const response = await fetch('/api/v17/search', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ filters: cleanedFilters }),
      cache: 'no-store',
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      return {
        items: [],
        total: 0,
        page: 1,
        page_size: 24,
        error: errorData.error || 'Search failed',
      };
    }

    const data = await response.json();
    return {
      items: data.items || [],
      total: data.total || 0,
      page: data.page || 1,
      page_size: data.page_size || 24,
      filters_applied: data.filters_applied,
      error: data.error,
    };
  } catch (error) {
    console.error('[manualSearch] Error:', error);
    return {
      items: [],
      total: 0,
      page: 1,
      page_size: 24,
      error: 'Network error',
    };
  }
}

