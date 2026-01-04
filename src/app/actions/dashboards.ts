"use server";

import { createClient } from "@/utils/supabase/server";

export type DashboardProfile = {
  id: string;
  email: string | null;
  full_name: string | null;
  role: string | null;
  tier?: string | null;
};

export type SellerListingsSummary = {
  total: number;
  published: number;
  drafts: number;
};

/**
 * Get user profile for dashboard display
 */
export async function getDashboardProfile(): Promise<DashboardProfile | null> {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    
    if (!user) {
      return null;
    }

    // Fetch profile from profiles table
    const { data: profile, error } = await supabase
      .from('profiles')
      .select('id, email, full_name, role')
      .eq('id', user.id)
      .maybeSingle();

    if (error && error.code !== 'PGRST116') {
      console.error('Error fetching profile:', error);
      return null;
    }

    // Return profile with user email as fallback
    return {
      id: user.id,
      email: profile?.email ?? user.email ?? null,
      full_name: profile?.full_name ?? null,
      role: profile?.role ?? null,
      tier: null, // Tier/subscription not implemented yet
    };
  } catch (error) {
    console.error('getDashboardProfile error:', error);
    return null;
  }
}

/**
 * Get seller listings summary (total, published, drafts)
 * Fails gracefully if table/columns don't exist
 */
export async function getSellerListingsSummary(userId: string): Promise<SellerListingsSummary> {
  try {
    const supabase = await createClient();
    
    // Try 'listings' table first (V16 canonical table)
    let { data, error } = await supabase
      .from('listings')
      .select('status')
      .eq('owner_id', userId);

    // If that fails, try 'listings_v16' as fallback (view doesn't have owner_id, so skip)
    // Note: listings_v16 is a view and may not have owner_id column
    // We only use listings table for owner_id queries

    if (error || !data) {
      // Table or column doesn't exist, return safe defaults
      return { total: 0, published: 0, drafts: 0 };
    }

    // Map to ensure status is always a string (coalesce null to 'unknown')
    const listings: { status: string }[] = data.map(l => ({
      status: l.status ?? 'unknown'
    }));
    // Handle both V16 status enums ('published', 'draft', 'paused', 'archived')
    // and legacy status values ('active', 'teaser', etc.)
    const published = listings.filter(l => 
      l.status === 'published' || 
      l.status === 'teaser' || 
      l.status === 'active'
    ).length;
    const drafts = listings.filter(l => l.status === 'draft').length;

    return {
      total: listings.length,
      published,
      drafts,
    };
  } catch (error) {
    // Silently fail - return safe defaults
    return { total: 0, published: 0, drafts: 0 };
  }
}

