"use server";

import { createClient } from "@/utils/supabase/server";

export type AdminSystemFlag = {
    flagId: string;
    type: 'Low Quality' | 'Spam' | 'Dispute' | 'AI Anomaly';
    description: string;
    targetId: string;
    severity: 'High' | 'Medium' | 'Low';
    status: 'Open' | 'Resolved';
};

export type PlatformMetrics = {
    totalListings: number;
    listingsPendingReview: number;
    newUsersLast7Days: number;
    aiFlagsOpen: number;
    totalRevenueLast30Days: number;
    averageListingQualityScore: number;
    systemFlags: AdminSystemFlag[];
};

/**
 * MOCK: Fetches platform-wide health and quality assurance metrics.
 * This directly supports AI Pillar 5 (Platform Intelligence).
 */
export async function getAdminDashboardData(): Promise<PlatformMetrics | null> {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    // CRITICAL: In production, check if the user has an 'ADMIN' role here.
    if (!user || !user.email?.endsWith('@nxtowner.com')) { 
        return null;
    }

    // --- MOCK DATA START ---
    const mockFlags: AdminSystemFlag[] = [
        {
            flagId: 'flag-001',
            type: 'AI Anomaly',
            description: 'Listing-456: Cashflow ratio is 4 standard deviations from mean.',
            targetId: 'listing-456',
            severity: 'High',
            status: 'Open',
        },
        {
            flagId: 'flag-002',
            type: 'Low Quality',
            description: 'Listing-789: Missing primary image and description is under 50 words.',
            targetId: 'listing-789',
            severity: 'Medium',
            status: 'Open',
        },
        {
            flagId: 'flag-003',
            type: 'Spam',
            description: 'User-011: Attempted to upload 10 listings in 1 hour.',
            targetId: 'user-011',
            severity: 'High',
            status: 'Open',
        },
    ];

    const metrics: PlatformMetrics = {
        totalListings: 1240,
        listingsPendingReview: 45,
        newUsersLast7Days: 312,
        aiFlagsOpen: mockFlags.filter(f => f.status === 'Open').length,
        totalRevenueLast30Days: 18500, // From Seller Pro, Buyer Pro, AI Tools
        averageListingQualityScore: 4.2, // On a scale of 1-5
        systemFlags: mockFlags,
    };
    
    return metrics;
    // --- MOCK DATA END ---
}
