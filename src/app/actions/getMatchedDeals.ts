"use server";

import { createClient } from "@/utils/supabase/server";

export type MatchedDeal = {
    listingId: string;
    title: string;
    category: string;
    askingPrice: number;
    cashflow: number;
    matchScore: 'Strong' | 'Medium' | 'Stretch';
    matchReason: string[];
};

/**
 * MOCK: Simulates AI Pillar 3: Buyer-Deal Matching.
 * This function returns a list of deals that match a specific seller's listing.
 * In a real application, this would query a dedicated AI table/service.
 */
export async function getMatchedBuyersForListing(listingId: string): Promise<{ qualifiedCount: number, buyerMatches: any[] }> {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
        return { qualifiedCount: 0, buyerMatches: [] };
    }

    // --- MOCK DATA START ---
    // In production, this would be a complex query joining buyers' profiles/preferences
    // with the listing's characteristics (price, category, location, risk tolerance).
    
    // Simulating results for a high-value listing:
    if (listingId === 'listing-123') {
         return {
            qualifiedCount: 5,
            buyerMatches: [
                { id: 'b-1', budget: '$5M', industry: 'Car Wash', score: 'Strong' },
                { id: 'b-2', budget: '$3M', industry: 'Auto Service', score: 'Strong' },
                { id: 'b-3', budget: '$1M', industry: 'Investor', score: 'Medium' },
                { id: 'b-4', budget: '$500k', industry: 'Retail', score: 'Stretch' },
            ]
        }
    }

    // Simulating results for a low-value or new listing:
    return {
        qualifiedCount: Math.floor(Math.random() * 3), // 0, 1, or 2
        buyerMatches: []
    }
    // --- MOCK DATA END ---
}
