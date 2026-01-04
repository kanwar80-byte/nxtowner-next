"use server";

import { createClient } from "@/utils/supabase/server";

export type UserAccessTier = 'FREE' | 'PRO' | 'ELITE' | 'NO_AUTH';

/**
 * MOCK FUNCTION: In a real app, this queries the user's subscription table
 * to determine their current paid plan (Buyer Pro, Buyer Elite).
 */
export async function getBuyerAccessTier(): Promise<UserAccessTier> {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
        return 'NO_AUTH'; // User is not logged in
    }

    // --- MOCK LOGIC START ---
    // This is where you would look up the user's profile or subscription record.
    
    // Example: Query your 'user_subscriptions' table
    // const { data: subscription, error } = await supabase
    //     .from('user_subscriptions')
    //     .select('plan_name')
    //     .eq('user_id', user.id)
    //     .maybeSingle();

    // if (subscription?.plan_name === 'Buyer Elite') {
    //     return 'ELITE';
    // }
    // if (subscription?.plan_name === 'Buyer Pro') {
    //     return 'PRO';
    // }
    
    // For now, let's pretend a user is ELITE if their email starts with 'pro'
    if (user.email?.startsWith('elite')) {
        return 'ELITE';
    }
    if (user.email?.startsWith('pro')) {
        return 'PRO';
    }
    
    // Default tier for any logged-in user without a paid plan
    return 'FREE';
    // --- MOCK LOGIC END ---
}
