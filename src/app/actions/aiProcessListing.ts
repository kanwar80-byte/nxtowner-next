"use server";

import { createClient } from "@/utils/supabase/server";

/**
 * MOCK: Simulates the two core AI Pillars running on a listing.
 * In production, this would call a dedicated ML service/serverless function.
 */
export async function aiProcessListing(listingId: string): Promise<boolean> {
    const supabase = await createClient();
    
    // --- 1. AI Pillar 1: Listing Intelligence (Financial Normalization) ---
    // Simulate complex calculations and data checks
    const normalizedSDE = Math.floor(Math.random() * 500000) + 100000;
    const isVerified = Math.random() > 0.3;
    const aiHighlights = isVerified 
        ? "Excellent 3-year margin stability and 100% verifiable financials."
        : "Initial review flagged inconsistencies in add-backs; further documentation required.";

    // --- 2. AI Pillar 2: Valuation & Pricing Engine ---
    // Simulate valuation model output
    const baseValuation = normalizedSDE * 3.5;
    const aiValuationLow = baseValuation * 0.9;
    const aiValuationHigh = baseValuation * 1.1;

    // --- 3. Update Database with AI Results ---
    // Update the listings table (not the view)
    const { error } = await supabase
        .from("listings")
        .update({
            is_ai_verified: isVerified,
            sde: normalizedSDE,
            ai_summary: aiHighlights,
            ai_valuation_rating: aiValuationLow && aiValuationHigh 
                ? `${aiValuationLow}-${aiValuationHigh}` 
                : null,
            updated_at: new Date().toISOString(),
        })
        .eq("id", listingId);

    if (error) {
        console.error("AI Processing Failed:", error);
        return false;
    }

    // --- 4. Trigger Next Steps (Automation) ---
    // In a real app, this would trigger an email to the seller or an Admin alert.
    console.log(`Listing ${listingId} processed. Status: ${isVerified ? 'VERIFIED' : 'PENDING REVIEW'}`);

    return true;
}
