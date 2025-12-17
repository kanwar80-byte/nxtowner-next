// src/app/actions/getFilteredListings.ts
"use server";

import { supabaseServer } from "@/lib/supabase/server";
import { BrowseFiltersInput, PublicListing } from "@/types/listing";

export interface PaginatedListings {
    listings: PublicListing[];
    totalCount: number;
    pageSize: number;
}

export async function getFilteredListings(
    filters: BrowseFiltersInput,
    page: number = 1
): Promise<PaginatedListings> {
    const supabase = await supabaseServer();
    const PAGE_SIZE = 20;
    const OFFSET = (page - 1) * PAGE_SIZE;

    // Start the query
    // We select * and get the exact count of matching rows
    let q = supabase.from("listings").select("*", { count: 'exact' });

    // --- 1. ASSET TYPE FILTER ---
    // If user picks 'physical' or 'digital', filter by it. 
    // If 'all', we don't filter (show everything).
    if (filters.assetType && filters.assetType !== 'all') {
        q = q.eq('asset_type', filters.assetType);
    }

    // --- 2. CATEGORY FILTER (Smart Logic) ---
    // If user picks a Main Category (like "Fuel & Auto"), use main_category column.
    // If user picks a specific sub-category (like "Car Wash"), use category column.
    if (filters.category && filters.category !== 'all') {
        const MAIN_CATEGORIES = [
            'Fuel & Auto',
            'Food & Beverage',
            'Digital Assets',
            'Industrial & Logistics',
            'Retail',
            'Service Businesses'
        ];

        if (MAIN_CATEGORIES.includes(filters.category)) {
            // Broad Filter
            q = q.eq('main_category', filters.category);
        } else {
            // Specific Filter
            q = q.eq('category', filters.category);
        }
    }

    // --- 3. PRICE RANGE FILTERS ---
    if (filters.minPrice) {
        q = q.gte('asking_price', filters.minPrice);
    }
    if (filters.maxPrice) {
        q = q.lte('asking_price', filters.maxPrice);
    }

    // --- 4. LOCATION FILTER ---
    if (filters.location && filters.location !== 'all') {
        // Use ILIKE for partial text match (e.g. "Toronto" matches "Toronto, ON")
        q = q.ilike('location', `%${filters.location}%`);
    }

    // --- 5. STATUS FILTER ---
    // If status is 'all', show everything. Otherwise filter by status (e.g. 'active')
    if (filters.status && filters.status !== 'all') {
        q = q.eq('status', filters.status);
    }

    // --- 6. SORTING & PAGINATION ---
    // Show newest listings first
    q = q.order('created_at', { ascending: false });
    
    // Apply Pagination limits
    q = q.range(OFFSET, OFFSET + PAGE_SIZE - 1);

    // Execute the query
    const { data, count, error } = await q;

    if (error) {
        console.error("Error fetching listings:", error);
        throw new Error(error.message);
    }

    return {
        listings: (data as PublicListing[]) || [],
        totalCount: count || 0,
        pageSize: PAGE_SIZE,
    };
}