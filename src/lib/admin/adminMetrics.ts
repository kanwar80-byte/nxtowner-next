import "server-only";
import { createClient } from "@/utils/supabase/server";
import { getListingTrack } from "@/lib/track";

export type KpiMetric = {
  label: string;
  value7d: number | null;
  value30d: number | null;
  deltaAbs: number | null;
  deltaPct: number | null;
  splits?: {
    operational: { value7d: number | null; value30d: number | null };
    digital: { value7d: number | null; value30d: number | null };
  };
};

export type AdminMetrics = {
  newListings: KpiMetric;
  newUsers: KpiMetric;
  ndaRequests: KpiMetric;
  dealRoomsCreated: KpiMetric;
};

function calculateDelta(value30d: number | null, valuePrev30d: number | null): { deltaAbs: number | null; deltaPct: number | null } {
  // Only compute delta when both values are available
  if (value30d === null || valuePrev30d === null) {
    return { deltaAbs: null, deltaPct: null };
  }

  const deltaAbs = value30d - valuePrev30d;
  
  // Avoid divide-by-zero: if previous is 0, deltaPct is null
  if (valuePrev30d === 0) {
    return { deltaAbs, deltaPct: null };
  }

  const deltaPct = Math.round((deltaAbs / valuePrev30d) * 100);
  return { deltaAbs, deltaPct };
}

export async function getAdminMetrics(): Promise<AdminMetrics> {
  const supabase = await createClient();
  const now = new Date();
  const sevenDaysAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
  const thirtyDaysAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
  const sixtyDaysAgo = new Date(now.getTime() - 60 * 24 * 60 * 60 * 1000);

  try {
    // New Listings (7d, 30d, and previous 30d for delta)
    let listings7d: number | null = null;
    try {
      const { count, error } = await supabase
        .from('listings_v16')
        .select('*', { count: 'exact', head: true })
        .gte('created_at', sevenDaysAgo.toISOString());
      if (error) {
        listings7d = null;
      } else {
        listings7d = count ?? 0; // 0 is valid if query succeeded
      }
    } catch {
      listings7d = null;
    }

    let listings30d: number | null = null;
    try {
      const { count, error } = await supabase
        .from('listings_v16')
        .select('*', { count: 'exact', head: true })
        .gte('created_at', thirtyDaysAgo.toISOString());
      if (error) {
        listings30d = null;
      } else {
        listings30d = count ?? 0; // 0 is valid if query succeeded
      }
    } catch {
      listings30d = null;
    }

    let listingsPrev30d: number | null = null;
    try {
      const { count, error } = await supabase
        .from('listings_v16')
        .select('*', { count: 'exact', head: true })
        .gte('created_at', sixtyDaysAgo.toISOString())
        .lt('created_at', thirtyDaysAgo.toISOString());
      if (error) {
        listingsPrev30d = null;
      } else {
        listingsPrev30d = count ?? 0; // 0 is valid if query succeeded
      }
    } catch {
      listingsPrev30d = null;
    }

    const listingsDelta = calculateDelta(listings30d, listingsPrev30d);

    // New Listings track splits
    let listings7dOperational: number | null = null;
    let listings7dDigital: number | null = null;
    let listings30dOperational: number | null = null;
    let listings30dDigital: number | null = null;

    try {
      const { data: listings7dData } = await supabase
        .from('listings_v16')
        .select('id, asset_type, meta, track, tax_category, category')
        .gte('created_at', sevenDaysAgo.toISOString());

      if (listings7dData) {
        const operational = listings7dData.filter((l: any) => getListingTrack(l) === 'operational').length;
        const digital = listings7dData.filter((l: any) => getListingTrack(l) === 'digital').length;
        listings7dOperational = operational;
        listings7dDigital = digital;
      }
    } catch {
      // Track splits unavailable
    }

    try {
      const { data: listings30dData } = await supabase
        .from('listings_v16')
        .select('id, asset_type, meta, track, tax_category, category')
        .gte('created_at', thirtyDaysAgo.toISOString());

      if (listings30dData) {
        const operational = listings30dData.filter((l: any) => getListingTrack(l) === 'operational').length;
        const digital = listings30dData.filter((l: any) => getListingTrack(l) === 'digital').length;
        listings30dOperational = operational;
        listings30dDigital = digital;
      }
    } catch {
      // Track splits unavailable
    }

    // New Users (7d, 30d, and previous 30d for delta)
    let users7d: number | null = null;
    try {
      const { count, error } = await supabase
        .from('profiles')
        .select('*', { count: 'exact', head: true })
        .gte('created_at', sevenDaysAgo.toISOString());
      if (error) {
        users7d = null;
      } else {
        users7d = count ?? 0; // 0 is valid if query succeeded
      }
    } catch {
      users7d = null;
    }

    let users30d: number | null = null;
    try {
      const { count, error } = await supabase
        .from('profiles')
        .select('*', { count: 'exact', head: true })
        .gte('created_at', thirtyDaysAgo.toISOString());
      if (error) {
        users30d = null;
      } else {
        users30d = count ?? 0; // 0 is valid if query succeeded
      }
    } catch {
      users30d = null;
    }

    let usersPrev30d: number | null = null;
    try {
      const { count, error } = await supabase
        .from('profiles')
        .select('*', { count: 'exact', head: true })
        .gte('created_at', sixtyDaysAgo.toISOString())
        .lt('created_at', thirtyDaysAgo.toISOString());
      if (error) {
        usersPrev30d = null;
      } else {
        usersPrev30d = count ?? 0; // 0 is valid if query succeeded
      }
    } catch {
      usersPrev30d = null;
    }

    const usersDelta = calculateDelta(users30d, usersPrev30d);

    // NDA Requests (7d, 30d, and previous 30d for delta)
    let ndas7d: number | null = null;
    try {
      const { count, error } = await supabase
        .from('nda_signatures')
        .select('*', { count: 'exact', head: true })
        .gte('signed_at', sevenDaysAgo.toISOString());
      if (error) {
        ndas7d = null;
      } else {
        ndas7d = count ?? 0; // 0 is valid if query succeeded
      }
    } catch {
      ndas7d = null;
    }

    let ndas30d: number | null = null;
    try {
      const { count, error } = await supabase
        .from('nda_signatures')
        .select('*', { count: 'exact', head: true })
        .gte('signed_at', thirtyDaysAgo.toISOString());
      if (error) {
        ndas30d = null;
      } else {
        ndas30d = count ?? 0; // 0 is valid if query succeeded
      }
    } catch {
      ndas30d = null;
    }

    let ndasPrev30d: number | null = null;
    try {
      const { count, error } = await supabase
        .from('nda_signatures')
        .select('*', { count: 'exact', head: true })
        .gte('signed_at', sixtyDaysAgo.toISOString())
        .lt('signed_at', thirtyDaysAgo.toISOString());
      if (error) {
        ndasPrev30d = null;
      } else {
        ndasPrev30d = count ?? 0; // 0 is valid if query succeeded
      }
    } catch {
      ndasPrev30d = null;
    }

    const ndasDelta = calculateDelta(ndas30d, ndasPrev30d);

    // NDA Requests track splits (by listing track)
    let ndas7dOperational: number | null = null;
    let ndas7dDigital: number | null = null;
    let ndas30dOperational: number | null = null;
    let ndas30dDigital: number | null = null;

    try {
      // Get NDAs and join via deal_rooms to get listing_id
      const { data: ndas7dData } = await supabase
        .from('nda_signatures')
        .select('deal_room_id')
        .gte('signed_at', sevenDaysAgo.toISOString());

      if (ndas7dData && ndas7dData.length > 0) {
        const dealRoomIds = ndas7dData.map((n: any) => n.deal_room_id).filter(Boolean);
        if (dealRoomIds.length > 0) {
          const { data: dealRooms } = await supabase
            .from('deal_rooms')
            .select('listing_id')
            .in('id', dealRoomIds)
            .not('listing_id', 'is', null);

          if (dealRooms && dealRooms.length > 0) {
            const listingIds = dealRooms.map((d: any) => d.listing_id).filter(Boolean);
            if (listingIds.length > 0) {
              const { data: listings } = await supabase
                .from('listings_v16')
                .select('id, asset_type, meta, track, tax_category, category')
                .in('id', listingIds);

              if (listings) {
                const operational = listings.filter((l: any) => getListingTrack(l) === 'operational').length;
                const digital = listings.filter((l: any) => getListingTrack(l) === 'digital').length;
                ndas7dOperational = operational;
                ndas7dDigital = digital;
              }
            }
          }
        }
      }
    } catch {
      // Track splits unavailable
    }

    try {
      // Get NDAs and join via deal_rooms to get listing_id
      const { data: ndas30dData } = await supabase
        .from('nda_signatures')
        .select('deal_room_id')
        .gte('signed_at', thirtyDaysAgo.toISOString());

      if (ndas30dData && ndas30dData.length > 0) {
        const dealRoomIds = ndas30dData.map((n: any) => n.deal_room_id).filter(Boolean);
        if (dealRoomIds.length > 0) {
          const { data: dealRooms } = await supabase
            .from('deal_rooms')
            .select('listing_id')
            .in('id', dealRoomIds)
            .not('listing_id', 'is', null);

          if (dealRooms && dealRooms.length > 0) {
            const listingIds = dealRooms.map((d: any) => d.listing_id).filter(Boolean);
            if (listingIds.length > 0) {
              const { data: listings } = await supabase
                .from('listings_v16')
                .select('id, asset_type, meta, track, tax_category, category')
                .in('id', listingIds);

              if (listings) {
                const operational = listings.filter((l: any) => getListingTrack(l) === 'operational').length;
                const digital = listings.filter((l: any) => getListingTrack(l) === 'digital').length;
                ndas30dOperational = operational;
                ndas30dDigital = digital;
              }
            }
          }
        }
      }
    } catch {
      // Track splits unavailable
    }

    // Deal Rooms Created (7d, 30d, and previous 30d for delta)
    let dealRooms7d: number | null = null;
    try {
      const { count, error } = await supabase
        .from('deal_rooms')
        .select('*', { count: 'exact', head: true })
        .gte('created_at', sevenDaysAgo.toISOString());
      if (error) {
        dealRooms7d = null;
      } else {
        dealRooms7d = count ?? 0; // 0 is valid if query succeeded
      }
    } catch {
      dealRooms7d = null;
    }

    let dealRooms30d: number | null = null;
    try {
      const { count, error } = await supabase
        .from('deal_rooms')
        .select('*', { count: 'exact', head: true })
        .gte('created_at', thirtyDaysAgo.toISOString());
      if (error) {
        dealRooms30d = null;
      } else {
        dealRooms30d = count ?? 0; // 0 is valid if query succeeded
      }
    } catch {
      dealRooms30d = null;
    }

    let dealRoomsPrev30d: number | null = null;
    try {
      const { count, error } = await supabase
        .from('deal_rooms')
        .select('*', { count: 'exact', head: true })
        .gte('created_at', sixtyDaysAgo.toISOString())
        .lt('created_at', thirtyDaysAgo.toISOString());
      if (error) {
        dealRoomsPrev30d = null;
      } else {
        dealRoomsPrev30d = count ?? 0; // 0 is valid if query succeeded
      }
    } catch {
      dealRoomsPrev30d = null;
    }

    const dealRoomsDelta = calculateDelta(dealRooms30d, dealRoomsPrev30d);

    // Deal Rooms track splits (by listing track)
    let dealRooms7dOperational: number | null = null;
    let dealRooms7dDigital: number | null = null;
    let dealRooms30dOperational: number | null = null;
    let dealRooms30dDigital: number | null = null;

    try {
      const { data: dealRooms7dData } = await supabase
        .from('deal_rooms')
        .select('listing_id')
        .gte('created_at', sevenDaysAgo.toISOString());

      if (dealRooms7dData && dealRooms7dData.length > 0) {
        const listingIds = dealRooms7dData.map((d: any) => d.listing_id).filter(Boolean);
        if (listingIds.length > 0) {
          const { data: listings } = await supabase
            .from('listings_v16')
            .select('id, asset_type, meta, track, tax_category, category')
            .in('id', listingIds);

          if (listings) {
            const operational = listings.filter((l: any) => getListingTrack(l) === 'operational').length;
            const digital = listings.filter((l: any) => getListingTrack(l) === 'digital').length;
            dealRooms7dOperational = operational;
            dealRooms7dDigital = digital;
          }
        }
      }
    } catch {
      // Track splits unavailable
    }

    try {
      const { data: dealRooms30dData } = await supabase
        .from('deal_rooms')
        .select('listing_id')
        .gte('created_at', thirtyDaysAgo.toISOString());

      if (dealRooms30dData && dealRooms30dData.length > 0) {
        const listingIds = dealRooms30dData.map((d: any) => d.listing_id).filter(Boolean);
        if (listingIds.length > 0) {
          const { data: listings } = await supabase
            .from('listings_v16')
            .select('id, asset_type, meta, track, tax_category, category')
            .in('id', listingIds);

          if (listings) {
            const operational = listings.filter((l: any) => getListingTrack(l) === 'operational').length;
            const digital = listings.filter((l: any) => getListingTrack(l) === 'digital').length;
            dealRooms30dOperational = operational;
            dealRooms30dDigital = digital;
          }
        }
      }
    } catch {
      // Track splits unavailable
    }

    return {
      newListings: {
        label: "New Listings",
        value7d: listings7d,
        value30d: listings30d,
        ...listingsDelta,
        splits: {
          operational: { value7d: listings7dOperational, value30d: listings30dOperational },
          digital: { value7d: listings7dDigital, value30d: listings30dDigital },
        },
      },
      newUsers: {
        label: "New Users",
        value7d: users7d,
        value30d: users30d,
        ...usersDelta,
      },
      ndaRequests: {
        label: "NDA Requests",
        value7d: ndas7d,
        value30d: ndas30d,
        ...ndasDelta,
        splits: {
          operational: { value7d: ndas7dOperational, value30d: ndas30dOperational },
          digital: { value7d: ndas7dDigital, value30d: ndas30dDigital },
        },
      },
      dealRoomsCreated: {
        label: "Deal Rooms Created",
        value7d: dealRooms7d,
        value30d: dealRooms30d,
        ...dealRoomsDelta,
        splits: {
          operational: { value7d: dealRooms7dOperational, value30d: dealRooms30dOperational },
          digital: { value7d: dealRooms7dDigital, value30d: dealRooms30dDigital },
        },
      },
    };
  } catch (error) {
    console.error("[getAdminMetrics] Error:", error);
    return {
      newListings: { label: "New Listings", value7d: null, value30d: null, deltaAbs: null, deltaPct: null },
      newUsers: { label: "New Users", value7d: null, value30d: null, deltaAbs: null, deltaPct: null },
      ndaRequests: { label: "NDA Requests", value7d: null, value30d: null, deltaAbs: null, deltaPct: null },
      dealRoomsCreated: { label: "Deal Rooms Created", value7d: null, value30d: null, deltaAbs: null, deltaPct: null },
    };
  }
}

