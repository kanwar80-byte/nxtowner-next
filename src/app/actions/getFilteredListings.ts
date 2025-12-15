"use server";

import { supabaseServer } from "@/lib/supabase/server";

// 1. UPDATED TYPE DEFINITION
export type SearchFilters = {
  query?: string;
  category?: string;
  minPrice?: number;
  maxPrice?: number;
  minCashflow?: number;
  minRevenue?: number;
  
  // These MUST be here to match the frontend
  assetType?: string; 
  location?: string;  // <--- This is the missing field causing your error
  sort?: string;      
  
  // Safety catch-all
  [key: string]: any; 
};

export async function getFilteredListings(filters: SearchFilters) {
  const supabase = await supabaseServer();

  let query = supabase.from("listings").select("*");

  // --- TEXT SEARCH ---
  if (filters.query) {
    query = query.ilike("title", `%${filters.query}%`);
  }

  // --- FILTERS ---
  if (filters.category && filters.category !== "all" && filters.category !== "All Categories") {
    query = query.eq("category", filters.category);
  }

  if (filters.assetType && filters.assetType !== "all") {
    query = query.eq("deal_type", filters.assetType);
  }

  // Fix: Add Location Search
  if (filters.location) {
    query = query.ilike("location", `%${filters.location}%`);
  }

  // Price Range
  if (filters.minPrice) query = query.gte("price", filters.minPrice);
  if (filters.maxPrice) query = query.lte("price", filters.maxPrice);

  // Financials
  if (filters.minCashflow) query = query.gte("cashflow_numeric", filters.minCashflow);
  if (filters.minRevenue) query = query.gte("revenue", filters.minRevenue);

  // --- SORTING ---
  let sortColumn = "created_at";
  let ascending = false;

  if (filters.sort === "oldest") {
    ascending = true;
  } else if (filters.sort === "lowest_price") {
    sortColumn = "price";
    ascending = true;
  } else if (filters.sort === "highest_price") {
    sortColumn = "price";
    ascending = false;
  } else if (filters.sort === "highest_cashflow") {
    sortColumn = "cashflow_numeric";
    ascending = false;
  }

  // Execute Query
  const { data, error } = await query.order(sortColumn, { ascending });

  if (error) {
    console.error("Search Error:", error);
    return [];
  }

  return data;
}