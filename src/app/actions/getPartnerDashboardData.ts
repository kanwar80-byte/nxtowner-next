"use server";

import { createClient } from "@/utils/supabase/server";

export type PartnerReferral = {
    referralId: string;
    type: 'Seller' | 'Buyer';
    status: 'Pending' | 'Active' | 'Closed';
    potentialCommission: number;
    listingTitle?: string;
};

export type PartnerSummary = {
    totalActiveLeads: number;
    totalReferralsClosed: number;
    estimatedMonthlyEarnings: number;
    profileViews: number;
    activeReferrals: PartnerReferral[];
};

/**
 * MOCK: Fetches key partner performance metrics and referral data.
 */
export async function getPartnerDashboardData(): Promise<PartnerSummary | null> {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    // Check if the user is authenticated and is a 'Partner' (or similar role)
    if (!user) {
        return null;
    }

    // --- MOCK DATA START ---
    // In production, this would query a dedicated 'referrals' or 'partner_analytics' table.

    const mockReferrals: PartnerReferral[] = [
        {
            referralId: 'ref-001',
            type: 'Seller',
            status: 'Active',
            potentialCommission: 15000,
            listingTitle: 'Mid-sized Trucking & Logistics Firm',
        },
        {
            referralId: 'ref-002',
            type: 'Buyer',
            status: 'Pending',
            potentialCommission: 0,
        },
        {
            referralId: 'ref-003',
            type: 'Seller',
            status: 'Closed',
            potentialCommission: 25000,
            listingTitle: 'Franchise Restaurant Chain',
        },
    ];

    const summary: PartnerSummary = {
        totalActiveLeads: mockReferrals.filter(r => r.status === 'Active' || r.status === 'Pending').length,
        totalReferralsClosed: mockReferrals.filter(r => r.status === 'Closed').length,
        estimatedMonthlyEarnings: 5000,
        profileViews: 120,
        activeReferrals: mockReferrals,
    };
    
    return summary;
    // --- MOCK DATA END ---
}
