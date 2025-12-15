'use server';

/**
 * Server actions for listing management
 */

import { supabase } from '@/lib/supabase';
import { supabaseAdmin } from '@/lib/supabaseAdmin';
import type { ListingInsert, ListingUpdate, Listing } from '@/types/database';
import type { PublicListing } from '@/types/listing';
import { revalidatePath } from 'next/cache';

// ============================================================================
// BROWSE & FILTER QUERIES
// ============================================================================

export type BrowseFilters = {
  type?: string; // 'asset' | 'digital' | 'all'
  category?: string;
  minPrice?: number;
  maxPrice?: number;
  location?: string;
  sort?: string; // 'newest' | 'price_asc' | 'price_desc' | 'revenue' | 'cashflow'
};

export async function getFilteredListings(
  filters: BrowseFilters
): Promise<PublicListing[]> {
  try {
    let query = supabase
      .from('listings')
      .select(
        'id, title, summary, type, status, asking_price, annual_revenue, annual_cashflow, category, country, region, is_verified, is_featured, is_ai_verified, featured_until, ai_verified_at, created_at, updated_at, meta'
      )
      .in('status', ['active', 'pending_review']);

    // Apply filters
    if (filters.type && filters.type !== 'all') {
      query = query.eq('type', filters.type);
    }

    if (filters.category && filters.category !== 'all') {
      query = query.eq('category', filters.category);
    }

    if (filters.minPrice !== undefined && filters.minPrice > 0) {
      query = query.gte('asking_price', filters.minPrice);
    }

    if (filters.maxPrice !== undefined && filters.maxPrice > 0) {
      query = query.lte('asking_price', filters.maxPrice);
    }

    if (filters.location && filters.location.trim()) {
      query = query.or(
        `region.ilike.%${filters.location}%,country.ilike.%${filters.location}%`
      );
    }

    // Apply sorting
    const sortMap = {
      featured: { column: 'is_featured', ascending: false },
      newest: { column: 'created_at', ascending: false },
      oldest: { column: 'created_at', ascending: true },
      price_asc: { column: 'asking_price', ascending: true },
      price_desc: { column: 'asking_price', ascending: false },
      revenue: { column: 'annual_revenue', ascending: false },
      cashflow: { column: 'annual_cashflow', ascending: false },
    };

    const sort = sortMap[filters.sort as keyof typeof sortMap] || sortMap.newest;
    query = query.order(sort.column, { ascending: sort.ascending, nullsFirst: false });

    const { data, error } = await query.limit(100);

    if (error) {
      console.error('getFilteredListings error:', error);
      return [];
    }

    return (data || []) as PublicListing[];
  } catch (error) {
    console.error('getFilteredListings exception:', error);
    return [];
  }
}

export async function createListing(
  listing: Omit<ListingInsert, 'owner_id' | 'status'> & { status?: ListingInsert['status'] }
): Promise<{ success: boolean; id?: string; error?: string }> {
  try {
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    
    if (authError || !user) {
      return { success: false, error: 'Not authenticated' };
    }

    const listingPayload = {
      ...listing,
      owner_id: user.id,
      status: 'draft', // Always start as draft
    };

    const { data, error } = await supabase
      .from('listings')
      .insert(listingPayload as never)
      .select('id')
      .single();

    if (error) throw error;

    const typedData = data as { id: string };

    revalidatePath('/browse');
    revalidatePath('/dashboard');
    revalidatePath('/dashboard/seller');
    
    return { success: true, id: typedData.id };
  } catch (error) {
    console.error('createListing error:', error);
    return { success: false, error: 'Failed to create listing' };
  }
}

export async function updateListing(id: string, updates: ListingUpdate): Promise<{ success: boolean; error?: string }> {
  try {
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    
    if (authError || !user) {
      return { success: false, error: 'Not authenticated' };
    }

    // Verify ownership
    const { data: existing, error: fetchError } = await supabase
      .from('listings')
      .select('owner_id')
      .eq('id', id)
      .single();

    if (fetchError) throw fetchError;
    
    const typedExisting = existing as { owner_id: string };
    if (typedExisting.owner_id !== user.id) {
      return { success: false, error: 'Not authorized to update this listing' };
    }

    const { error } = await supabase
      .from('listings')
      .update(updates as never)
      .eq('id', id);

    if (error) throw error;

    revalidatePath('/browse');
    revalidatePath(`/listing/${id}`);
    revalidatePath('/dashboard');
    revalidatePath('/dashboard/seller');
    
    return { success: true };
  } catch (error) {
    console.error('updateListing error:', error);
    return { success: false, error: 'Failed to update listing' };
  }
}

export async function submitListingForReview(id: string): Promise<{ success: boolean; error?: string }> {
  return updateListing(id, { status: 'pending_review' });
}

export async function getListingsForOwner(): Promise<Listing[]> {
  try {
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    if (authError || !user) {
      return [];
    }

    const { data, error } = await supabase
      .from('listings')
      .select('*')
      .eq('owner_id', user.id)
      .order('created_at', { ascending: false });

    if (error) throw error;
    return data || [];
  } catch (error) {
    console.error('getListingsForOwner error:', error);
    return [];
  }
}

export async function getListingById(id: string): Promise<Listing | null> {
  try {
    const { data, error } = await supabase
      .from('listings')
      .select('*')
      .eq('id', id)
      .single();

    if (error) throw error;
    return data;
  } catch (error) {
    console.error('getListingById error:', error);
    return null;
  }
}

export async function getActiveListings(filters?: {
  type?: 'asset' | 'digital';
  category?: string;
  minPrice?: number;
  maxPrice?: number;
  minRevenue?: number;
  location?: string;
}): Promise<Listing[]> {
  try {
    let query = supabase
      .from('listings')
      .select('*')
      .eq('status', 'active')
      .order('created_at', { ascending: false });

    if (filters?.type) {
      query = query.eq('type', filters.type);
    }
    if (filters?.category) {
      query = query.eq('category', filters.category);
    }
    if (filters?.minPrice !== undefined) {
      query = query.gte('asking_price', filters.minPrice);
    }
    if (filters?.maxPrice !== undefined) {
      query = query.lte('asking_price', filters.maxPrice);
    }
    if (filters?.minRevenue !== undefined) {
      query = query.gte('annual_revenue', filters.minRevenue);
    }
    if (filters?.location) {
      query = query.ilike('location', `%${filters.location}%`);
    }

    const { data, error } = await query;

    if (error) throw error;
    return data || [];
  } catch (error) {
    console.error('getActiveListings error:', error);
    return [];
  }
}

// Admin actions (use supabaseAdmin for privileged operations)
export async function approveListingAdmin(id: string): Promise<{ success: boolean; error?: string }> {
  try {
    if (!supabaseAdmin) {
      return { success: false, error: 'Admin operations not available' };
    }

    const { data: { user }, error: authError } = await supabase.auth.getUser();
    
    if (authError || !user) {
      return { success: false, error: 'Not authenticated' };
    }

    // Check if user is admin
    const { data: profile, error: profileError } = await supabase
      .from('profiles')
      .select('role')
      .eq('id', user.id)
      .single();

    const typedProfile = profile as { role: string } | null;
    if (profileError || typedProfile?.role !== 'admin') {
      return { success: false, error: 'Not authorized' };
    }

    const { error } = await supabaseAdmin
      .from('listings')
      .update({ status: 'active', is_verified: true } as never)
      .eq('id', id);

    if (error) throw error;

    revalidatePath('/admin');
    revalidatePath('/browse');
    revalidatePath(`/listing/${id}`);
    
    return { success: true };
  } catch (error) {
    console.error('approveListingAdmin error:', error);
    return { success: false, error: 'Failed to approve listing' };
  }
}

export async function rejectListingAdmin(id: string): Promise<{ success: boolean; error?: string }> {
  try {
    if (!supabaseAdmin) {
      return { success: false, error: 'Admin operations not available' };
    }

    const { data: { user }, error: authError } = await supabase.auth.getUser();
    
    if (authError || !user) {
      return { success: false, error: 'Not authenticated' };
    }

    // Check if user is admin
    const { data: profile, error: profileError } = await supabase
      .from('profiles')
      .select('role')
      .eq('id', user.id)
      .single();

    const typedProfile = profile as { role: string } | null;
    if (profileError || typedProfile?.role !== 'admin') {
      return { success: false, error: 'Not authorized' };
    }

    const { error } = await supabaseAdmin
      .from('listings')
      .update({ status: 'draft' } as never)
      .eq('id', id);

    if (error) throw error;

    revalidatePath('/admin');
    
    return { success: true };
  } catch (error) {
    console.error('rejectListingAdmin error:', error);
    return { success: false, error: 'Failed to reject listing' };
  }
}

export async function getPendingListingsAdmin(): Promise<Listing[]> {
  try {
    if (!supabaseAdmin) {
      console.warn('Admin client not available');
      return [];
    }

    const { data: { user }, error: authError } = await supabase.auth.getUser();
    
    if (authError || !user) {
      return [];
    }

    // Check if user is admin
    const { data: profile, error: profileError } = await supabase
      .from('profiles')
      .select('role')
      .eq('id', user.id)
      .single();

    const typedProfile = profile as { role: string } | null;
    if (profileError || typedProfile?.role !== 'admin') {
      return [];
    }

    const { data, error } = await supabaseAdmin
      .from('listings')
      .select('*')
      .eq('status', 'pending_review')
      .order('created_at', { ascending: true });

    if (error) throw error;
    return data || [];
  } catch (error) {
    console.error('getPendingListingsAdmin error:', error);
    return [];
  }
}
