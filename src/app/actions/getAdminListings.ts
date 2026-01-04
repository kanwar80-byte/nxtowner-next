'use server';

import { createClient } from "@/utils/supabase/server";

/**
 * Get all active listings for admin use
 * This bypasses the V16 repo's public status filter since admins need to see all active listings
 * Uses listings_v16 table directly
 */
export async function getAdminListings(): Promise<any[]> {
  try {
    const supabase = await createClient();
    
    // Admin can see all active listings (not just published/teaser)
    const { data, error } = await supabase
      .from('listings_v16')
      .select(
        'id, title, asking_price, is_featured, featured_until, is_ai_verified, ai_verified_at, status, created_at'
      )
      .eq('status', 'active')
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching admin listings:', error);
      return [];
    }

    return data || [];
  } catch (error) {
    console.error('getAdminListings error:', error);
    return [];
  }
}

