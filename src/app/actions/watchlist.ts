'use server';

/**
 * Server actions for watchlist management
 * These can be called directly from client components
 */

import { supabase } from '@/lib/supabase';
import { revalidatePath } from 'next/cache';

export async function toggleWatchlist(listingId: string): Promise<{ success: boolean; isWatchlisted: boolean; error?: string }> {
  try {
    // Get current user
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    
    if (authError || !user) {
      return { success: false, isWatchlisted: false, error: 'Not authenticated' };
    }

    // Check if already watchlisted
    const { data: existing, error: checkError } = await supabase
      .from('watchlist')
      .select('id')
      .eq('user_id', user.id)
      .eq('listing_id', listingId)
      .single();

    if (checkError && checkError.code !== 'PGRST116') {
      // PGRST116 = no rows returned, which is fine
      throw checkError;
    }

    if (existing) {
      // Remove from watchlist
      const { error: deleteError } = await supabase
        .from('watchlist')
        .delete()
        .eq('user_id', user.id)
        .eq('listing_id', listingId);

      if (deleteError) throw deleteError;

      revalidatePath('/browse');
      revalidatePath(`/listing/${listingId}`);
      
      return { success: true, isWatchlisted: false };
    } else {
      // Add to watchlist
      const watchlistPayload = { user_id: user.id, listing_id: listingId };
      const { error: insertError } = await supabase
        .from('watchlist')
        .insert(watchlistPayload as never);

      if (insertError) throw insertError;

      revalidatePath('/browse');
      revalidatePath(`/listing/${listingId}`);
      
      return { success: true, isWatchlisted: true };
    }
  } catch (error) {
    console.error('toggleWatchlist error:', error);
    return { success: false, isWatchlisted: false, error: 'Failed to toggle watchlist' };
  }
}

export async function isListingWatchlisted(listingId: string): Promise<boolean> {
  try {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return false;

    const { data, error } = await supabase
      .from('watchlist')
      .select('id')
      .eq('user_id', user.id)
      .eq('listing_id', listingId)
      .single();

    if (error && error.code !== 'PGRST116') {
      console.error('isListingWatchlisted error:', error);
      return false;
    }

    return !!data;
  } catch (error) {
    console.error('isListingWatchlisted error:', error);
    return false;
  }
}

export async function getWatchlistForUser(): Promise<{ listing_id: string; created_at: string }[]> {
  try {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return [];

    const { data, error } = await supabase
      .from('watchlist')
      .select('listing_id, created_at')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false });

    if (error) throw error;
    return data || [];
  } catch (error) {
    console.error('getWatchlistForUser error:', error);
    return [];
  }
}
