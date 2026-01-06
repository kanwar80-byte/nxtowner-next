'use server';

/**
 * Server actions for listing management
 * 
 * READ operations: Use canonical V16 repo (src/lib/v16/listings.repo.ts)
 * WRITE operations: V15-only, query listings table directly
 */

import { handleEvent } from '@/lib/automation/eventHandler';
import { supabase } from '@/utils/supabase/client';
import { supabaseAdmin } from '@/lib/supabaseAdmin';
import { revalidatePath } from 'next/cache';
import { searchListingsV16, getListingByIdV16, getFeaturedListingsV16, getBrowseFacetsV16 } from '@/lib/v16/listings.repo';
import type { BrowseFiltersV16 } from '@/lib/v16/types';
import { writeAuditEvent } from '@/lib/audit/auditWriter';
import {
  getCategoryIdByCode,
  getSubcategoryIdByCode,
} from '@/lib/v17/categoryResolver';

type Listing = {
  id: string;
  owner_id?: string | null;
  status?: string | null;
  asset_type?: string | null;
  title?: string | null;
  created_at?: string | null;
  updated_at?: string | null;
  [key: string]: any;
};

type ListingInsert = Partial<Listing>;
type ListingUpdate = Partial<Listing>;

type PublicListing = {
  id: string;
  title?: string | null;
  asset_type?: string | null;
  status?: string | null;
  hero_image_url?: string | null;
  created_at?: string | null;
  [key: string]: any;
};

// ============================================================================
// READ OPERATIONS (V16 Canonical Repo)
// ============================================================================

export type BrowseFilters = {
  type?: string; // 'asset' | 'digital' | 'all'
  categoryId?: string | null; // UUID
  subcategoryId?: string | null; // UUID
  categoryCode?: string | null; // Code (will be resolved to UUID)
  subcategoryCode?: string | null; // Code (will be resolved to UUID)
  minPrice?: number;
  maxPrice?: number;
  location?: string;
  sort?: string; // 'newest' | 'price_asc' | 'price_desc' | 'revenue' | 'cashflow'
};

/**
 * Get filtered listings using V16 canonical repo
 * Maps V16 results to PublicListing format for backward compatibility
 */
export async function getFilteredListings(
  filters: BrowseFilters
): Promise<PublicListing[]> {
  try {
    // Resolve category codes to UUIDs if provided
    let categoryId: string | null | undefined = filters.categoryId;
    let subcategoryId: string | null | undefined = filters.subcategoryId;

    if (filters.categoryCode && !categoryId) {
      categoryId = await getCategoryIdByCode(filters.categoryCode);
    }
    if (filters.subcategoryCode && !subcategoryId) {
      subcategoryId = await getSubcategoryIdByCode(filters.subcategoryCode);
    }

    // Map V15 filters to V16 filters
    const v16Filters: BrowseFiltersV16 = {
      query: undefined, // V15 BrowseFilters doesn't have query, but V16 supports it
      assetType: filters.type && filters.type !== 'all' 
        ? (filters.type === 'asset' ? 'Operational' : filters.type === 'digital' ? 'Digital' : undefined)
        : undefined,
      categoryId: categoryId ?? undefined,
      subcategoryId: subcategoryId ?? undefined,
      minPrice: filters.minPrice,
      maxPrice: filters.maxPrice,
      sort: filters.sort === 'price_asc' ? 'price_asc' 
        : filters.sort === 'price_desc' ? 'price_desc'
        : 'newest', // Default to newest
    };

    const v16Results = await searchListingsV16(v16Filters);

    // Map V16 results to PublicListing format
    return v16Results.map((item: any): PublicListing => ({
      id: item.id,
      title: item.title || null,
      asset_type: item.asset_type || null,
      status: item.status || null,
      hero_image_url: item.hero_image_url || item.image_url || null,
      created_at: item.created_at || null,
      // Map additional fields that callers might expect
      asking_price: item.asking_price,
      revenue_annual: item.revenue_annual,
      annual_revenue: item.revenue_annual, // Alias for backward compat
      annual_cashflow: item.cash_flow,
      category_id: item.category_id,
      subcategory_id: item.subcategory_id,
      country: item.country,
      // Note: Some V15 fields may not exist in V16 (summary, region, is_verified, etc.)
      // These will be undefined, which is acceptable for backward compatibility
    }));
  } catch (error) {
    console.error('getFilteredListings exception:', error);
    return [];
  }
}

// ============================================================================
// WRITE OPERATIONS (V15-only, query listings table directly)
// ============================================================================

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

    // If the listing is being published (status set to 'active'), trigger automation
    if (updates.status === 'active') {
      await handleEvent({
        type: 'LISTING_CREATED_OR_UPDATED',
        listingId: id,
        userId: user.id,
      });
    }

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

/**
 * Get listings for owner using V16 canonical repo
 * Note: V16 repo doesn't support owner_id filtering, so we fetch all and filter client-side
 * This is a temporary workaround until V16 repo supports owner filtering
 */
export async function getListingsForOwner(): Promise<Listing[]> {
  try {
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    if (authError || !user) {
      return [];
    }

    // Use V16 repo to get all listings, then filter by owner_id client-side
    // This is inefficient but maintains V16 canonical read layer
    const allListings = await searchListingsV16({});
    
    // Filter by owner_id and map to Listing format
    return allListings
      .filter((item: any) => item.owner_id === user.id)
      .map((item: any): Listing => ({
        id: item.id,
        title: item.title || null,
        asset_type: item.asset_type || null,
        status: item.status || null,
        created_at: item.created_at || null,
        owner_id: item.owner_id || null,
        ...item,
      }));
  } catch (error) {
    console.error('getListingsForOwner error:', error);
    return [];
  }
}

/**
 * Get listing by ID using V16 canonical repo
 * Maps V16 result to Listing format for backward compatibility
 */
export async function getListingById(id: string): Promise<Listing | null> {
  try {
    const v16Listing = await getListingByIdV16(id);
    
    if (!v16Listing) {
      return null;
    }

    // Map V16 result to Listing format
    return {
      // Spread first to get all fields from V16
      ...v16Listing,
      // Then override with explicit mappings (ensures correct types and null handling)
      id: v16Listing.id,
      title: v16Listing.title || null,
      asset_type: v16Listing.asset_type || null,
      status: v16Listing.status || null,
      created_at: v16Listing.created_at || null,
      owner_id: v16Listing.owner_id || null,
    } as Listing;
  } catch (error) {
    console.error('getListingById error:', error);
    return null;
  }
}

/**
 * Get active listings using V16 canonical repo
 * Maps V16 results to Listing format for backward compatibility
 */
export async function getActiveListings(filters?: {
  type?: 'asset' | 'digital';
  categoryId?: string | null;
  subcategoryId?: string | null;
  categoryCode?: string | null;
  subcategoryCode?: string | null;
  minPrice?: number;
  maxPrice?: number;
  minRevenue?: number;
  location?: string;
}): Promise<Listing[]> {
  try {
    // Resolve category codes to UUIDs if provided
    let categoryId: string | null | undefined = filters?.categoryId;
    let subcategoryId: string | null | undefined = filters?.subcategoryId;

    if (filters?.categoryCode && !categoryId) {
      categoryId = await getCategoryIdByCode(filters.categoryCode);
    }
    if (filters?.subcategoryCode && !subcategoryId) {
      subcategoryId = await getSubcategoryIdByCode(filters.subcategoryCode);
    }

    // Map filters to V16 format
    const v16Filters: BrowseFiltersV16 = {
      assetType: filters?.type === 'asset' ? 'Operational' 
        : filters?.type === 'digital' ? 'Digital' 
        : undefined,
      categoryId: categoryId ?? undefined,
      subcategoryId: subcategoryId ?? undefined,
      minPrice: filters?.minPrice,
      maxPrice: filters?.maxPrice,
      sort: 'newest',
    };

    const v16Results = await searchListingsV16(v16Filters);

    // Map V16 results to Listing format
    return v16Results.map((item: any): Listing => ({
      id: item.id,
      title: item.title || null,
      asset_type: item.asset_type || null,
      status: item.status || null,
      created_at: item.created_at || null,
      owner_id: item.owner_id || null,
      // Map all other fields from V16
      ...item,
    }));
  } catch (error) {
    console.error('getActiveListings error:', error);
    return [];
  }
}

// ============================================================================
// WRITE OPERATIONS (V15-only, query listings table directly)
// ============================================================================

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

    // Get current listing status before update
    const { data: currentListing } = await supabaseAdmin
      .from('listings')
      .select('status')
      .eq('id', id)
      .single();

    const fromStatus = (currentListing as { status?: string } | null)?.status || 'unknown';

    const { error } = await supabaseAdmin
      .from('listings')
      .update({ status: 'active', is_verified: true } as never)
      .eq('id', id);

    if (error) throw error;

    // Audit log: listing approved
    await writeAuditEvent({
      action: 'listing.status.update',
      entityType: 'listing',
      entityId: id,
      summary: `Listing status changed: ${fromStatus} → active`,
      metadata: {
        listingId: id,
        fromStatus,
        toStatus: 'active',
        isVerified: true,
      },
    });

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

    // Get current listing status before update
    const { data: currentListing } = await supabaseAdmin
      .from('listings')
      .select('status')
      .eq('id', id)
      .single();

    const fromStatus = (currentListing as { status?: string } | null)?.status || 'unknown';

    const { error } = await supabaseAdmin
      .from('listings')
      .update({ status: 'draft' } as never)
      .eq('id', id);

    if (error) throw error;

    // Audit log: listing rejected
    await writeAuditEvent({
      action: 'listing.status.update',
      entityType: 'listing',
      entityId: id,
      summary: `Listing status changed: ${fromStatus} → draft`,
      metadata: {
        listingId: id,
        fromStatus,
        toStatus: 'draft',
      },
    });

    revalidatePath('/admin');
    
    return { success: true };
  } catch (error) {
    console.error('rejectListingAdmin error:', error);
    return { success: false, error: 'Failed to reject listing' };
  }
}

/**
 * Get pending listings for admin using V16 canonical repo
 * Note: V16 uses 'published'/'teaser' status, not 'pending_review'
 * This function returns empty array as V16 doesn't have pending_review status
 * For admin review, use V15 write operations or implement V16 draft status filtering
 */
export async function getPendingListingsAdmin(): Promise<Listing[]> {
  try {
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

    // V16 doesn't have 'pending_review' status - it uses 'published'/'teaser'/'draft'
    // For now, return empty array as V16 canonical repo only exposes published/teaser
    // Admin review workflow should use V15 write operations or V16 draft status
    console.warn('getPendingListingsAdmin: V16 repo does not support pending_review status');
    return [];
  } catch (error) {
    console.error('getPendingListingsAdmin error:', error);
    return [];
  }
}
