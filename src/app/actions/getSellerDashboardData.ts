"use server";

import { supabaseServer } from "@/lib/supabase/server";

export type SellerDashboardData = {
    listingId: string;
    title: string;
    views: number;
    ndasSigned: number;
    qualifiedBuyers: number;
    timeOnMarketDays: number;
    listingStatus: 'Live' | 'Draft' | 'Closed' | 'Review';
    aiVerificationStatus: 'Verified' | 'Pending' | 'Rejected';
};

export type SellerSummary = {
    totalActiveListings: number;
    totalNDAsSigned: number;
    totalRevenue: number;
    platformAvgTimeOnMarket: number;
    listingPerformance: SellerDashboardData[];
};

/**
 * MOCK: Fetches key seller performance metrics and analytics.
 */
export async function getSellerDashboardData(): Promise<SellerSummary | null> {
    const supabase = await supabaseServer();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
        return null;
    }

    // --- MOCK DATA START ---
    // In a real application, you would filter listings by user.id and join with
    // an analytics table to get views, NDAs, etc.

    const mockListings: SellerDashboardData[] = [
        {
            listingId: 'listing-123',
            title: 'High-Margin Car Wash Portfolio',
            views: 450,
            ndasSigned: 12,
            qualifiedBuyers: 5,
            timeOnMarketDays: 35,
            listingStatus: 'Live',
            aiVerificationStatus: 'Verified',
        },
        {
            listingId: 'listing-456',
            title: 'SaaS E-commerce Tool (Acquisition)',
            views: 180,
            ndasSigned: 2,
            qualifiedBuyers: 1,
            timeOnMarketDays: 10,
            listingStatus: 'Live',
            aiVerificationStatus: 'Pending',
        },
        {
            listingId: 'listing-789',
            title: 'Neighborhood Cafe & Bakery',
            views: 50,
            ndasSigned: 0,
            qualifiedBuyers: 0,
            timeOnMarketDays: 1,
            listingStatus: 'Draft',
            aiVerificationStatus: 'Pending',
        },
    ];

    const summary: SellerSummary = {
        totalActiveListings: mockListings.filter(l => l.listingStatus === 'Live').length,
        totalNDAsSigned: mockListings.reduce((sum, l) => sum + l.ndasSigned, 0),
        totalRevenue: 2500, // Mock: Placeholder for total revenue/fees earned
        platformAvgTimeOnMarket: 45,
        listingPerformance: mockListings,
    };
    
    return summary;
    // --- MOCK DATA END ---
}
