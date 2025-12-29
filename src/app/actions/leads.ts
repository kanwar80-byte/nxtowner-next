'use server';

/**
 * Server actions for lead management (CRM-lite)
 */

import { supabase } from '@/lib/supabase';

type ListingLead = {
  id: string;
  listing_id?: string | null;
  buyer_id?: string | null;
  name?: string | null;
  email?: string | null;
  phone?: string | null;
  message?: string | null;
  created_at?: string | null;
  [key: string]: any;
};

type PartnerLead = {
  id: string;
  partner_id?: string | null;
  user_id?: string | null;
  name?: string | null;
  email?: string | null;
  phone?: string | null;
  message?: string | null;
  created_at?: string | null;
  [key: string]: any;
};

// ============================================================================
// LISTING LEADS
// ============================================================================

/**
 * Create a new listing lead (buyer interest)
 */
export async function createListingLead(
  listingId: string,
  message?: string
): Promise<{ success: boolean; id?: string; error?: string }> {
  try {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      return { success: false, error: 'Not authenticated' };
    }

    const { data, error } = await supabase
      .from('listing_leads')
      // Note: column may not exist in older schemas
      .insert({
        listing_id: listingId,
        buyer_id: user.id,
        message: message || null,
        status: 'new',
      })
      .select()
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      .single() as { data: { id: string } | null; error: any };

    if (error) throw error;

    return { success: true, id: data?.id };
  } catch (error) {
    console.error('createListingLead error:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to create lead',
    };
  }
}

/**
 * Get listing leads for a seller (for their listings)
 */
export async function getListingLeadsForSeller(): Promise<
  Array<ListingLead & { listing: { title: string; id: string }; buyer: { full_name: string } }>
> {
  try {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return [];

    // First get seller's listing IDs
    const { data: listings, error: listingsError } = await supabase
      .from('listings')
      .select('id') as { data: Array<{ id: string }> | null; error: any }; // eslint-disable-line @typescript-eslint/no-explicit-any

    if (listingsError) throw listingsError;

    const listingIds = listings?.map((l) => l.id) || [];
    if (listingIds.length === 0) return [];

    // Get leads for those listings
    const { data, error } = await supabase
      .from('listing_leads')
      .select(
        `
        id,
        listing_id,
        buyer_id,
        message,
        status,
        created_at,
        updated_at,
        listing:listings (id, title),
        buyer:profiles!listing_leads_buyer_id_fkey (full_name)
        `
      )
      .in('listing_id', listingIds)
      .order('created_at', { ascending: false });

    if (error) throw error;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    return (data || []) as any;
  } catch (error) {
    console.error('getListingLeadsForSeller error:', error);
    return [];
  }
}

/**
 * Get listing leads for a buyer (their own leads)
 */
export async function getListingLeadsForBuyer(): Promise<
  Array<ListingLead & { listing: { title: string; id: string } }>
> {
  try {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return [];

    const { data, error } = await supabase
      .from('listing_leads')
      .select(
        `
        id,
        listing_id,
        buyer_id,
        message,
        status,
        created_at,
        updated_at,
        listing:listings (id, title)
        `
      )
      .eq('buyer_id', user.id)
      .order('created_at', { ascending: false });

    if (error) throw error;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    return (data || []) as any;
  } catch (error) {
    console.error('getListingLeadsForBuyer error:', error);
    return [];
  }
}

/**
 * Get all listing leads for admin
 */
export async function getListingLeadsForAdmin(filters?: {
  status?: string;
  limit?: number;
}): Promise<
  Array<ListingLead & { listing: { title: string; id: string }; buyer: { full_name: string } }>
> {
  try {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return [];

    // Check admin role
    const { data: profile } = await supabase
      .from('profiles')
      .select('role')
      .eq('id', user.id)
      .single() as { data: { role: string } | null };

    if (!profile || profile.role !== 'admin') {
      return [];
    }

    let query = supabase
      .from('listing_leads')
      .select(
        `
        id,
        listing_id,
        buyer_id,
        message,
        status,
        created_at,
        updated_at,
        listing:listings (id, title),
        buyer:profiles!listing_leads_buyer_id_fkey (full_name)
        `
      );

    if (filters?.status) {
      query = query.eq('status', filters.status);
    }

    query = query.order('created_at', { ascending: false });

    if (filters?.limit) {
      query = query.limit(filters.limit);
    }

    const { data, error } = await query;

    if (error) throw error;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    return (data || []) as any;
  } catch (error) {
    console.error('getListingLeadsForAdmin error:', error);
    return [];
  }
}

/**
 * Update listing lead status (seller or admin only)
 */
export async function updateListingLeadStatus(
  leadId: string,
  status: 'new' | 'contacted' | 'qualified' | 'closed_lost' | 'closed_won'
): Promise<{ success: boolean; error?: string }> {
  try {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      return { success: false, error: 'Not authenticated' };
    }

    const { error } = await supabase
      .from('listing_leads')
      // Note: schema may differ across environments
      .update({ status })
      .eq('id', leadId);

    if (error) throw error;
    return { success: true };
  } catch (error) {
    console.error('updateListingLeadStatus error:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to update lead',
    };
  }
}

// ============================================================================
// PARTNER LEADS
// ============================================================================

/**
 * Create a new partner lead (consultation request)
 */
export async function createPartnerLead(input: {
  partnerProfileId: string;
  requesterName: string;
  requesterEmail: string;
  requesterPhone?: string;
  message?: string;
  listingId?: string;
}): Promise<{ success: boolean; id?: string; error?: string }> {
  try {
    const { data: { user } } = await supabase.auth.getUser();

    const { data, error } = await supabase
      .from('partner_leads')
  
      .insert({
        partner_profile_id: input.partnerProfileId,
        requester_id: user?.id || null,
        requester_name: input.requesterName,
        requester_email: input.requesterEmail,
        requester_phone: input.requesterPhone || null,
        message: input.message || null,
        listing_id: input.listingId || null,
        status: 'new',
      })
      .select()
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      .single() as { data: { id: string } | null; error: any };

    if (error) throw error;

    return { success: true, id: data?.id };
  } catch (error) {
    console.error('createPartnerLead error:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to create lead',
    };
  }
}

/**
 * Get partner leads for a specific partner
 */
export async function getPartnerLeadsForPartner(): Promise<
  Array<PartnerLead & { requester?: { full_name: string } }>
> {
  try {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return [];

    // Get the partner profile for this user
    const { data: partnerProfile } = await supabase
      .from('partner_profiles')
      .select('id')
      .eq('profile_id', user.id)
      .single() as { data: { id: string } | null };

    if (!partnerProfile) return [];

    const { data, error } = await supabase
      .from('partner_leads')
      .select(
        `
        id,
        partner_profile_id,
        requester_id,
        requester_name,
        requester_email,
        requester_phone,
        message,
        listing_id,
        status,
        created_at,
        updated_at,
        requester:profiles!partner_leads_requester_id_fkey (full_name)
        `
      )
      .eq('partner_profile_id', partnerProfile.id)
      .order('created_at', { ascending: false });

    if (error) throw error;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    return (data || []) as any;
  } catch (error) {
    console.error('getPartnerLeadsForPartner error:', error);
    return [];
  }
}

/**
 * Get all partner leads for admin
 */
export async function getPartnerLeadsForAdmin(filters?: {
  status?: string;
  limit?: number;
}): Promise<Array<PartnerLead & { partner?: { firm_name: string }; requester?: { full_name: string } }>> {
  try {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return [];

    // Check admin role
    const { data: profile } = await supabase
      .from('profiles')
      .select('role')
      .eq('id', user.id)
      .single() as { data: { role: string } | null };

    if (!profile || profile.role !== 'admin') {
      return [];
    }

    let query = supabase
      .from('partner_leads')
      .select(
        `
        id,
        partner_profile_id,
        requester_id,
        requester_name,
        requester_email,
        requester_phone,
        message,
        listing_id,
        status,
        created_at,
        updated_at,
        partner:partner_profiles (firm_name),
        requester:profiles!partner_leads_requester_id_fkey (full_name)
        `
      );

    if (filters?.status) {
      query = query.eq('status', filters.status);
    }

    query = query.order('created_at', { ascending: false });

    if (filters?.limit) {
      query = query.limit(filters.limit);
    }

    const { data, error } = await query;

    if (error) throw error;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    return (data || []) as any;
  } catch (error) {
    console.error('getPartnerLeadsForAdmin error:', error);
    return [];
  }
}

/**
 * Update partner lead status
 */
export async function updatePartnerLeadStatus(
  leadId: string,
  status: 'new' | 'contacted' | 'qualified' | 'closed_lost' | 'closed_won'
): Promise<{ success: boolean; error?: string }> {
  try {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      return { success: false, error: 'Not authenticated' };
    }

    const { error } = await supabase
      .from('partner_leads')
      .update({ status })
      .eq('id', leadId);

    if (error) throw error;
    return { success: true };
  } catch (error) {
    console.error('updatePartnerLeadStatus error:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to update lead',
    };
  }
}
