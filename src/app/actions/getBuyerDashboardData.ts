"use server";

import { createClient } from "@/utils/supabase/server";

export type BuyerMatchedDeal = {
    listingId: string;
    title: string;
    category: string;
    location: string;
    askingPrice: number;
    cashflow: number;
    matchScore: 'Strong' | 'Medium' | 'Stretch';
    matchReason: string;
};

export type BuyerSummary = {
    totalDealsViewed: number;
    totalNDAsSigned: number;
    savedListingsCount: number;
    aiMatchedDeals: BuyerMatchedDeal[];
};

/**
 * MOCK: Fetches buyer activity summary and the list of AI matched deals.
 */
export async function getBuyerDashboardData(): Promise<BuyerSummary | null> {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
        return null;
    }

    // --- MOCK DATA START ---
    // In production, this would use AI Pillar 3 logic to score and rank
    // all available listings against the buyer's profile (budget, industry, risk).

    const mockMatches: BuyerMatchedDeal[] = [
        {
            listingId: 'listing-123',
            title: 'High-Growth Digital Marketing Agency',
            category: 'Agency & Service',
            location: 'Remote',
            askingPrice: 850000,
            cashflow: 250000,
            matchScore: 'Strong',
            matchReason: "Matches high budget and 'Agency' preference.",
        },
        {
            listingId: 'listing-301',
            title: 'Multi-Unit QSR Franchise Portfolio',
            category: 'Food & Beverage',
            location: 'Toronto, ON',
            askingPrice: 3200000,
            cashflow: 900000,
            matchScore: 'Strong',
            matchReason: "Matches high budget and 'Investor' profile.",
        },
        {
            listingId: 'listing-456',
            title: 'Small Retail Vape Shop',
            category: 'Retail',
            location: 'Vancouver, BC',
            askingPrice: 150000,
            cashflow: 60000,
            matchScore: 'Medium',
            matchReason: "Matches location but below target budget.",
        },
        {
            listingId: 'listing-888',
            title: 'Micro-SaaS HR Tool',
            category: 'SaaS & Software',
            location: 'Remote',
            askingPrice: 400000,
            cashflow: 120000,
            matchScore: 'Stretch',
            matchReason: "Digital asset, slightly above budget preference.",
        },
    ];

    const summary: BuyerSummary = {
        totalDealsViewed: 42,
        totalNDAsSigned: 5,
        savedListingsCount: 8,
        aiMatchedDeals: mockMatches,
    };
    
    return summary;
    // --- MOCK DATA END ---
}
