'use server';

/**
 * Server actions for lead management (CRM-lite)
 * Uses deal_rooms (deals) + messages (deal_messages) instead of listing_leads/partner_leads
 */

import { createClient } from '@/utils/supabase/server';
import { trackEventFromServer } from '@/lib/analytics/server';
import type { Database } from '@/types/database.types';

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
 * Uses deal_rooms (deals) + messages (deal_messages) instead of listing_leads
 */
export async function createListingLead(
  listingId: string,
  message?: string
): Promise<{ success: boolean; id?: string; error?: string }> {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      return { success: false, error: 'Not authenticated' };
    }

    // Get seller_id from listing owner_id
    const { data: listing } = await supabase
      .from('listings')
      .select('owner_id')
      .eq('id', listingId)
      .single();

    if (!listing?.owner_id) {
      throw new Error('Listing not found or has no owner');
    }

    // Create or get deal_room (represents buyer interest)
    // Use upsert to handle case where deal_room already exists
    const dealRoomPayload = {
      listing_id: listingId,
      buyer_id: user.id,
      seller_id: listing.owner_id,
      status: 'nda_requested', // Initial status for a lead
      created_by: user.id,
    } as any; // Use 'as any' since deal_rooms type may not be fully defined

    const { data: dealRoom, error: dealRoomError } = await supabase
      .from('deal_rooms')
      .upsert(dealRoomPayload, {
        onConflict: 'listing_id,buyer_id',
      })
      .select()
      .single();

    if (dealRoomError) throw dealRoomError;

    const dealRoomId = dealRoom?.id;
    if (!dealRoomId) {
      throw new Error('Failed to create or retrieve deal room');
    }

    // Store message in messages table if provided
    if (message && message.trim()) {
      const messagePayload: Database["public"]["Tables"]["messages"]["Insert"] = {
        deal_id: dealRoomId,
        sender_id: user.id,
        content: message.trim(),
      };

      const { error: messageError } = await supabase
        .from('messages')
        .insert(messagePayload);

      if (messageError) {
        // Log but don't fail - deal room creation is the critical part
        console.error('createListingLead: Failed to insert message:', messageError);
      }
    }

    // Track enquiry sent
    await trackEventFromServer("enquiry_sent", {
      listing_id: listingId,
    });

    return { success: true, id: dealRoomId };
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
 * Uses deal_rooms (deals) + messages (deal_messages) instead of listing_leads
 */
export async function getListingLeadsForSeller(): Promise<
  Array<ListingLead & { listing: { title: string; id: string }; buyer: { full_name: string } }>
> {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return [];

    // First get seller's listing IDs using V16 canonical repo
    // Note: V16 repo doesn't support owner_id filtering, so we fetch all and filter client-side
    const { searchListingsV16 } = await import("@/lib/v16/listings.repo");
    const allListings = await searchListingsV16({});
    // Filter by owner_id client-side (temporary until V16 repo supports owner filtering)
    const sellerListings = allListings.filter((item: any) => item.owner_id === user.id);
    const listingIds = sellerListings.map((l: any) => l.id);
    if (listingIds.length === 0) return [];

    // Get deal_rooms (leads) for those listings
    // Join with messages to get the initial message
    const { data: dealRooms, error: dealRoomsError } = await supabase
      .from('deal_rooms')
      .select(
        `
        id,
        listing_id,
        buyer_id,
        status,
        created_at,
        updated_at,
        listing:listings_v16!deal_rooms_listing_id_fkey (id, title),
        buyer:profiles!deal_rooms_buyer_id_fkey (full_name)
        `
      )
      .in('listing_id', listingIds)
      .order('created_at', { ascending: false });

    if (dealRoomsError) throw dealRoomsError;

    // Get first message for each deal room to populate the "message" field
    const dealRoomIds = (dealRooms || []).map((dr: any) => dr.id).filter(Boolean);
    const messagesMap = new Map<string, string>();
    if (dealRoomIds.length > 0) {
      const { data: messages } = await supabase
        .from('messages')
        .select('deal_id, content')
        .in('deal_id', dealRoomIds)
        .order('created_at', { ascending: true });

      // Get first message per deal room
      if (messages) {
        const seenRooms = new Set<string>();
        for (const msg of messages) {
          const dealId = msg.deal_id;
          if (dealId && !seenRooms.has(dealId)) {
            messagesMap.set(dealId, msg.content || '');
            seenRooms.add(dealId);
          }
        }
      }
    }

    // Transform deal_rooms to ListingLead format
    const leads = (dealRooms || []).map((dr: any) => ({
      id: dr.id,
      listing_id: dr.listing_id,
      buyer_id: dr.buyer_id,
      message: messagesMap.get(dr.id) || null,
      status: dr.status || 'new',
      created_at: dr.created_at,
      updated_at: dr.updated_at,
      listing: dr.listing,
      buyer: dr.buyer,
    }));

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    return leads as any;
  } catch (error) {
    console.error('getListingLeadsForSeller error:', error);
    return [];
  }
}

/**
 * Get listing leads for a buyer (their own leads)
 * Uses deal_rooms (deals) + messages (deal_messages) instead of listing_leads
 */
export async function getListingLeadsForBuyer(): Promise<
  Array<ListingLead & { listing: { title: string; id: string } }>
> {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return [];

    // Get deal_rooms (leads) for this buyer
    const { data: dealRooms, error: dealRoomsError } = await supabase
      .from('deal_rooms')
      .select(
        `
        id,
        listing_id,
        buyer_id,
        status,
        created_at,
        updated_at,
        listing:listings_v16!deal_rooms_listing_id_fkey (id, title)
        `
      )
      .eq('buyer_id', user.id)
      .order('created_at', { ascending: false });

    if (dealRoomsError) throw dealRoomsError;

    // Get first message for each deal room
    const dealRoomIds = (dealRooms || []).map((dr: any) => dr.id).filter(Boolean);
    const messagesMap = new Map<string, string>();
    if (dealRoomIds.length > 0) {
      const { data: messages } = await supabase
        .from('messages')
        .select('deal_id, content')
        .in('deal_id', dealRoomIds)
        .order('created_at', { ascending: true });

      if (messages) {
        const seenRooms = new Set<string>();
        for (const msg of messages) {
          const dealId = msg.deal_id;
          if (dealId && !seenRooms.has(dealId)) {
            messagesMap.set(dealId, msg.content || '');
            seenRooms.add(dealId);
          }
        }
      }
    }

    // Transform deal_rooms to ListingLead format
    const leads = (dealRooms || []).map((dr: any) => ({
      id: dr.id,
      listing_id: dr.listing_id,
      buyer_id: dr.buyer_id,
      message: messagesMap.get(dr.id) || null,
      status: dr.status || 'new',
      created_at: dr.created_at,
      updated_at: dr.updated_at,
      listing: dr.listing,
    }));

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    return leads as any;
  } catch (error) {
    console.error('getListingLeadsForBuyer error:', error);
    return [];
  }
}

/**
 * Get all listing leads for admin
 * Uses deal_rooms (deals) + messages (deal_messages) instead of listing_leads
 */
export async function getListingLeadsForAdmin(filters?: {
  status?: string;
  limit?: number;
}): Promise<
  Array<ListingLead & { listing: { title: string; id: string }; buyer: { full_name: string } }>
> {
  try {
    const supabase = await createClient();
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
      .from('deal_rooms')
      .select(
        `
        id,
        listing_id,
        buyer_id,
        status,
        created_at,
        updated_at,
        listing:listings_v16!deal_rooms_listing_id_fkey (id, title),
        buyer:profiles!deal_rooms_buyer_id_fkey (full_name)
        `
      );

    if (filters?.status) {
      query = query.eq('status', filters.status);
    }

    query = query.order('created_at', { ascending: false });

    if (filters?.limit) {
      query = query.limit(filters.limit);
    }

    const { data: dealRooms, error } = await query;

    if (error) throw error;

    // Get first message for each deal room
    const dealRoomIds = (dealRooms || []).map((dr: any) => dr.id).filter(Boolean);
    const messagesMap = new Map<string, string>();
    if (dealRoomIds.length > 0) {
      const { data: messages } = await supabase
        .from('messages')
        .select('deal_id, content')
        .in('deal_id', dealRoomIds)
        .order('created_at', { ascending: true });

      if (messages) {
        const seenRooms = new Set<string>();
        for (const msg of messages) {
          const dealId = msg.deal_id;
          if (dealId && !seenRooms.has(dealId)) {
            messagesMap.set(dealId, msg.content || '');
            seenRooms.add(dealId);
          }
        }
      }
    }

    // Transform deal_rooms to ListingLead format
    const leads = (dealRooms || []).map((dr: any) => ({
      id: dr.id,
      listing_id: dr.listing_id,
      buyer_id: dr.buyer_id,
      message: messagesMap.get(dr.id) || null,
      status: dr.status || 'new',
      created_at: dr.created_at,
      updated_at: dr.updated_at,
      listing: dr.listing,
      buyer: dr.buyer,
    }));

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    return leads as any;
  } catch (error) {
    console.error('getListingLeadsForAdmin error:', error);
    return [];
  }
}

/**
 * Update listing lead status (seller or admin only)
 * Uses deal_rooms (deals) instead of listing_leads
 */
export async function updateListingLeadStatus(
  leadId: string,
  status: 'new' | 'contacted' | 'qualified' | 'closed_lost' | 'closed_won'
): Promise<{ success: boolean; error?: string }> {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      return { success: false, error: 'Not authenticated' };
    }

    // Map lead status to deal_room status
    // deal_rooms.status values: 'draft', 'nda_requested', 'nda_signed', 'active', 'closed'
    let dealRoomStatus: string = status;
    if (status === 'closed_lost' || status === 'closed_won') {
      dealRoomStatus = 'closed';
    } else if (status === 'new') {
      dealRoomStatus = 'nda_requested';
    } else if (status === 'qualified') {
      dealRoomStatus = 'active';
    } else {
      // 'contacted' -> keep as 'nda_requested' or 'active' based on context
      dealRoomStatus = 'nda_requested';
    }

    const { error } = await supabase
      .from('deal_rooms')
      .update({ status: dealRoomStatus as any })
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
// TODO(schema): Partner leads functionality removed - partner_leads table does not exist
// Partner consultation requests should be implemented using a different mechanism
// (e.g., events table, consultation_requests table, or messages in a partner-specific deal room)

/**
 * Create a new partner lead (consultation request)
 * NOTE: Partner leads are not supported - partner_leads table does not exist
 * Returns error indicating this feature is not available
 */
export async function createPartnerLead(input: {
  partnerProfileId: string;
  requesterName: string;
  requesterEmail: string;
  requesterPhone?: string;
  message?: string;
  listingId?: string;
}): Promise<{ success: boolean; id?: string; error?: string }> {
  return {
    success: false,
    error: 'Partner leads are not currently supported. Please use the contact form or messaging system.',
  };
}

/**
 * Get partner leads for a specific partner
 * NOTE: Partner leads are not supported - partner_leads table does not exist
 */
export async function getPartnerLeadsForPartner(): Promise<
  Array<PartnerLead & { requester?: { full_name: string } }>
> {
  // Partner leads functionality removed - return empty array
  return [];
}

/**
 * Get all partner leads for admin
 * NOTE: Partner leads are not supported - partner_leads table does not exist
 */
export async function getPartnerLeadsForAdmin(filters?: {
  status?: string;
  limit?: number;
}): Promise<Array<PartnerLead & { partner?: { firm_name: string }; requester?: { full_name: string } }>> {
  // Partner leads functionality removed - return empty array
  return [];
}

/**
 * Update partner lead status
 * NOTE: Partner leads are not supported - partner_leads table does not exist
 */
export async function updatePartnerLeadStatus(
  leadId: string,
  status: 'new' | 'contacted' | 'qualified' | 'closed_lost' | 'closed_won'
): Promise<{ success: boolean; error?: string }> {
  return {
    success: false,
    error: 'Partner leads are not currently supported.',
  };
}
