import "server-only";
import { createClient } from "@/utils/supabase/server";

export type UserListItem = {
  id: string;
  email: string | null;
  full_name: string | null;
  role: string | null;
  subscription_tier?: string | null;
  is_verified?: boolean | null;
  created_at: string | null;
  last_sign_in?: string | null;
};

export type UserFilters = {
  search?: string;
  role?: string;
  tier?: string;
  status?: string;
};

export async function getUsersList(filters: UserFilters = {}): Promise<UserListItem[]> {
  const supabase = await createClient();
  const sb: any = supabase;

  try {
    let query = sb
      .from('profiles')
      .select('id, email, full_name, role, created_at, updated_at')
      .order('created_at', { ascending: false });

    // Search filter (email or name)
    if (filters.search) {
      const searchTerm = filters.search.toLowerCase();
      query = query.or(`email.ilike.%${searchTerm}%,full_name.ilike.%${searchTerm}%`);
    }

    // Role filter
    if (filters.role && filters.role !== 'all') {
      query = query.eq('role', filters.role);
    }

    // Try to add subscription_tier and is_verified if columns exist
    try {
      const { data, error } = await query;

      if (error) throw error;

      // Enrich with auth.users data for email and last_sign_in
      const userIds = (data || []).map((u: any) => u.id);
      const enrichedUsers: UserListItem[] = [];

      for (const user of data || []) {
        // Note: last_sign_in requires admin client - skip for now
        const lastSignIn: string | null = null;

        enrichedUsers.push({
          id: user.id,
          email: user.email || null,
          full_name: user.full_name || null,
          role: user.role || null,
          subscription_tier: (user as any).subscription_tier || null,
          is_verified: (user as any).is_verified || null,
          created_at: user.created_at || null,
          last_sign_in: lastSignIn,
        });
      }

      // Apply tier filter if specified
      if (filters.tier && filters.tier !== 'all') {
        return enrichedUsers.filter(u => u.subscription_tier === filters.tier);
      }

      // Apply status filter if specified
      if (filters.status && filters.status !== 'all') {
        if (filters.status === 'verified') {
          return enrichedUsers.filter(u => u.is_verified === true);
        } else if (filters.status === 'unverified') {
          return enrichedUsers.filter(u => u.is_verified === false || !u.is_verified);
        }
      }

      return enrichedUsers;
    } catch (err) {
      console.error("[getUsersList] Query error:", err);
      return [];
    }
  } catch (error) {
    console.error("[getUsersList] Error:", error);
    return [];
  }
}

export type UserDetail = {
  id: string;
  email: string | null;
  full_name: string | null;
  role: string | null;
  subscription_tier?: string | null;
  is_verified?: boolean | null;
  created_at: string | null;
  updated_at?: string | null;
  last_sign_in?: string | null;
  activity: {
    listingsViewed?: number;
    searches?: number;
    ndasSigned?: number;
    enquiriesSent?: number;
    dealRoomsInvolved?: number;
  };
  entities: {
    listingsOwned?: number;
    leads?: number;
    ndas?: number;
    dealRooms?: number;
  };
};

export async function getUserDetail(userId: string): Promise<UserDetail | null> {
  const supabase = await createClient();
  const sb: any = supabase;

  try {
    // Get profile
    const { data: profile, error: profileError } = await sb
      .from('profiles')
      .select('*')
      .eq('id', userId)
      .single();

    if (profileError || !profile) {
      return null;
    }

    // Note: last_sign_in requires admin client - skip for now
    const lastSignIn: string | null = null;

    // Activity snapshot (if analytics tables exist)
    const activity = {
      listingsViewed: 0,
      searches: 0,
      ndasSigned: 0,
      enquiriesSent: 0,
      dealRoomsInvolved: 0,
    };

    try {
      const { count } = await sb
        .from('analytics_events')
        .select('*', { count: 'exact', head: true })
        .eq('user_id', userId)
        .eq('event_name', 'listing_view');
      activity.listingsViewed = typeof count === 'number' ? count : 0;
    } catch {}

    try {
      const { count } = await sb
        .from('analytics_events')
        .select('*', { count: 'exact', head: true })
        .eq('user_id', userId)
        .eq('event_name', 'search');
      activity.searches = typeof count === 'number' ? count : 0;
    } catch {}

    try {
      const { count } = await sb
        .from('signed_ndas')
        .select('*', { count: 'exact', head: true })
        .eq('user_id', userId);
      activity.ndasSigned = typeof count === 'number' ? count : 0;
    } catch {}

    try {
      const { count } = await sb
        .from('analytics_events')
        .select('*', { count: 'exact', head: true })
        .eq('user_id', userId)
        .eq('event_name', 'enquiry_sent');
      activity.enquiriesSent = typeof count === 'number' ? count : 0;
    } catch {}

    try {
      const { count } = await sb
        .from('deal_room_members')
        .select('*', { count: 'exact', head: true })
        .eq('user_id', userId);
      activity.dealRoomsInvolved = typeof count === 'number' ? count : 0;
    } catch {}

    // Entities
    const entities = {
      listingsOwned: 0,
      leads: 0,
      ndas: 0,
      dealRooms: 0,
    };

    try {
      const { count } = await sb
        .from('listings_v16')
        .select('*', { count: 'exact', head: true })
        .eq('owner_id', userId);
      entities.listingsOwned = typeof count === 'number' ? count : 0;
    } catch {}

    try {
      const { count } = await sb
        .from('listing_leads')
        .select('*', { count: 'exact', head: true })
        .eq('buyer_id', userId);
      entities.leads = typeof count === 'number' ? count : 0;
    } catch {}

    try {
      const { count } = await sb
        .from('signed_ndas')
        .select('*', { count: 'exact', head: true })
        .eq('user_id', userId);
      entities.ndas = typeof count === 'number' ? count : 0;
    } catch {}

    try {
      const { count } = await sb
        .from('deal_room_members')
        .select('*', { count: 'exact', head: true })
        .eq('user_id', userId);
      entities.dealRooms = typeof count === 'number' ? count : 0;
    } catch {}

    return {
      id: profile.id,
      email: profile.email || null,
      full_name: profile.full_name || null,
      role: profile.role || null,
      subscription_tier: (profile as any).subscription_tier || null,
      is_verified: (profile as any).is_verified || null,
      created_at: profile.created_at || null,
      updated_at: profile.updated_at || null,
      last_sign_in: lastSignIn,
      activity,
      entities,
    };
  } catch (error) {
    console.error("[getUserDetail] Error:", error);
    return null;
  }
}

