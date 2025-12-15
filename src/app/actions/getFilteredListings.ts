"use server";

import { supabaseServer } from "@/lib/supabase/server";

export type SearchFilters = {
  category?: string;
  minPrice?: number;
  maxPrice?: number;
  assetType?: string; // 'asset' or 'digital'
  minCashflow?: number;
  minRevenue?: number;
  query?: string;
};

export async function getFilteredListings(filters: SearchFilters) {
  // Initialize the Server Client
  const supabase = await supabaseServer();

  // Start with all listings
  let query = supabase.from("listings").select("*");

  // 1. Text Search
  if (filters.query) {
    query = query.ilike("title", `%${filters.query}%`);
  }

  // 2. Category Filter
  if (filters.category && filters.category !== "All Categories") {
    query = query.eq("category", filters.category);
  }

  // 3. Asset Type (Operational vs Digital)
  if (filters.assetType && filters.assetType !== "all") {
    query = query.eq("deal_type", filters.assetType);
  }

  // 4. Price Range
  if (filters.minPrice) {
    query = query.gte("price", filters.minPrice);
  }
  if (filters.maxPrice) {
    query = query.lte("price", filters.maxPrice);
  }

  // 5. Financial Filters
  if (filters.minCashflow) {
    query = query.gte("cashflow_numeric", filters.minCashflow);
  }
  if (filters.minRevenue) {
    query = query.gte("revenue", filters.minRevenue);
  }

  // Execute Query
  const { data, error } = await query.order("created_at", { ascending: false });

  if (error) {
    console.error("Server Action Error:", error);
    return [];
  }

  return data;
}