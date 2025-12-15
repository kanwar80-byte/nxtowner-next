'use server'

import { createClient } from '@/utils/supabase/client';

export type SearchFilters = {
  query?: string;
  category?: string;
  minPrice?: number;
  maxPrice?: number;
  assetType?: string; // 'asset' (Operational) or 'digital'
  minCashflow?: number;
  minRevenue?: number;
};

export async function getListings(filters: SearchFilters) {
  const supabase = createClient();
  
  let query = supabase.from('listings').select('*');

  // 1. Text Search
  if (filters.query) {
    query = query.ilike('title', `%${filters.query}%`);
  }

  // 2. Main Filters
  if (filters.category && filters.category !== 'All Categories') {
    query = query.eq('category', filters.category);
  }

  // 3. Asset Type (The Split: Operational vs Digital)
  if (filters.assetType && filters.assetType !== 'all') {
    query = query.eq('deal_type', filters.assetType); 
  }

  // 4. Price Logic
  if (filters.minPrice) query = query.gte('price', filters.minPrice);
  if (filters.maxPrice) query = query.lte('price', filters.maxPrice);

  // 5. Financial Filters (The "Serious Buyer" logic)
  if (filters.minCashflow) query = query.gte('cashflow_numeric', filters.minCashflow);
  if (filters.minRevenue) query = query.gte('revenue', filters.minRevenue);

  // Execute
  const { data, error } = await query.order('created_at', { ascending: false });

  if (error) {
    console.error('Search Error:', error);
    return [];
  }

  return data;
}
