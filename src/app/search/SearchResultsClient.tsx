"use client";

import { useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import { aiSearch, manualSearch } from '@/lib/v17/search/client';
import SearchResultsV17 from '@/components/SearchResultsV17';
import { Loader2, AlertCircle } from 'lucide-react';
import type { SearchResponse } from '@/lib/v17/search/client';

/**
 * Client component that handles search logic based on URL params
 */
export default function SearchResultsClient() {
  const searchParams = useSearchParams();
  const [loading, setLoading] = useState(true);
  const [results, setResults] = useState<SearchResponse | null>(null);

  useEffect(() => {
    async function performSearch() {
      setLoading(true);
      
      const q = searchParams.get('q');
      const hasQuery = Boolean(q?.trim());
      
      // Check for manual filters - listing_type MUST be included as a real filter
      const params = searchParams;
      const hasManualFilters =
        Boolean(params.get('listing_type')) ||
        Boolean(params.get('category')) ||
        Boolean(params.get('subcategory')) ||
        Boolean(params.get('province')) ||
        Boolean(params.get('city')) ||
        Boolean(params.get('min_price')) ||
        Boolean(params.get('max_price')) ||
        Boolean(params.get('min_revenue')) ||
        Boolean(params.get('max_revenue')) ||
        Boolean(params.get('min_ebitda')) ||
        Boolean(params.get('max_ebitda')) ||
        Boolean(params.get('min_cashflow')) ||
        Boolean(params.get('max_cashflow')) ||
        Boolean(params.get('sort'));
      
      // Guard: Only call API if hasQuery or hasManualFilters
      if (!hasQuery && !hasManualFilters) {
        setResults(null);
        setLoading(false);
        return;
      }
      
      try {
        let response: SearchResponse;
        
        // Priority: If q exists, run AI search; else run manual search
        if (hasQuery) {
          response = await aiSearch(q!);
        } else {
          // Build filters from URL params
          const filters: Record<string, unknown> = {};
          
          const listingType = searchParams.get('listing_type');
          if (listingType) filters.listing_type = listingType;
          
          const category = searchParams.get('category');
          if (category) filters.category = category;
          
          const subcategory = searchParams.get('subcategory');
          if (subcategory) filters.subcategory = subcategory;
          
          const minPrice = searchParams.get('min_price');
          if (minPrice) filters.min_price = Number.parseFloat(minPrice);
          
          const maxPrice = searchParams.get('max_price');
          if (maxPrice) filters.max_price = Number.parseFloat(maxPrice);
          
          const province = searchParams.get('province');
          if (province) filters.province = province;
          
          const city = searchParams.get('city');
          if (city) filters.city = city;
          
          const minRevenue = searchParams.get('min_revenue');
          if (minRevenue) filters.min_revenue = Number.parseFloat(minRevenue);
          
          const maxRevenue = searchParams.get('max_revenue');
          if (maxRevenue) filters.max_revenue = Number.parseFloat(maxRevenue);
          
          const minEbitda = searchParams.get('min_ebitda');
          if (minEbitda) filters.min_ebitda = Number.parseFloat(minEbitda);
          
          const maxEbitda = searchParams.get('max_ebitda');
          if (maxEbitda) filters.max_ebitda = Number.parseFloat(maxEbitda);
          
          const minCashflow = searchParams.get('min_cashflow');
          if (minCashflow) filters.min_cashflow = Number.parseFloat(minCashflow);
          
          const maxCashflow = searchParams.get('max_cashflow');
          if (maxCashflow) filters.max_cashflow = Number.parseFloat(maxCashflow);
          
          const sort = searchParams.get('sort');
          if (sort) filters.sort = sort;
          
          const page = searchParams.get('page');
          if (page) filters.page = Number.parseInt(page, 10);
          
          const pageSize = searchParams.get('page_size');
          if (pageSize) filters.page_size = Number.parseInt(pageSize, 10);
          
          response = await manualSearch(filters);
        }
        
        setResults(response);
      } catch (error) {
        console.error('[SearchResultsClient] Error:', error);
        setResults({
          items: [],
          total: 0,
          page: 1,
          page_size: 24,
          error: 'Search failed',
        });
      } finally {
        setLoading(false);
      }
    }

    performSearch();
  }, [searchParams]);

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <Loader2 className="w-8 h-8 animate-spin text-slate-400" />
      </div>
    );
  }

  if (!results) {
    return (
      <div className="py-20 text-center">
        <p className="text-slate-400">Type a search above or apply filters to begin.</p>
      </div>
    );
  }

  return (
    <div>
      {/* Applied Filters Info */}
      {results.filters_applied && Object.keys(results.filters_applied).length > 0 && (
        <div className="mb-6 p-4 bg-slate-50 dark:bg-zinc-900 rounded-lg border border-slate-200 dark:border-zinc-800">
          <h3 className="text-sm font-medium mb-2">Applied Filters</h3>
          <div className="flex flex-wrap gap-2">
            {Object.entries(results.filters_applied).map(([key, value]) => {
              if (value === undefined || value === null || value === '') return null;
              return (
                <span
                  key={key}
                  className="px-2 py-1 text-xs bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 rounded"
                >
                  {key}: {String(value)}
                </span>
              );
            })}
          </div>
        </div>
      )}

      {/* Result Reason (if empty) */}
      {results.items.length === 0 && results.result_reason && (
        <div className="mb-6 p-4 bg-amber-50 dark:bg-amber-900/20 rounded-lg border border-amber-200 dark:border-amber-800">
          <div className="flex items-center gap-2 text-amber-700 dark:text-amber-300">
            <AlertCircle className="w-5 h-5" />
            <p className="font-medium">
              {results.result_reason === 'invalid_filters'
                ? 'Invalid filters applied - some categories were removed'
                : results.result_reason === 'parse_failed'
                ? 'Could not parse search query'
                : 'No results found'}
            </p>
          </div>
        </div>
      )}

      {/* Error Message */}
      {results.error && (
        <div className="mb-6 p-4 bg-red-50 dark:bg-red-900/20 rounded-lg border border-red-200 dark:border-red-800">
          <p className="text-red-700 dark:text-red-300">{results.error}</p>
        </div>
      )}

      {/* Results Count */}
      <div className="mb-4">
        <p className="text-slate-600 dark:text-slate-400">
          Found {results.total} {results.total === 1 ? 'listing' : 'listings'}
        </p>
      </div>

      {/* Results Grid */}
      <SearchResultsV17 items={results.items} />
    </div>
  );
}

