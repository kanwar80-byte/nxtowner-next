import "server-only";
import { createClient } from "@/utils/supabase/server";
import { getListingTrack } from "@/lib/track";

export type FunnelStep = {
  step: string;
  label: string;
  count: number;
  conversionRate: number; // Percentage from previous step
  dropOff: number; // Number of users who dropped off
  dropOffRate: number; // Percentage who dropped off
  sampleSize?: number; // Denominator for confidence calculation (previous step count)
  isLowVolume?: boolean; // True if sample size < 20
};

export type FunnelData = {
  steps: FunnelStep[];
  period: '7d' | '30d';
  isEstimated?: boolean;
};

function toNumber(v: unknown): number {
  if (typeof v === "number") return v;
  if (typeof v === "bigint") return Number(v);
  if (typeof v === "string" && v.trim() !== "" && !Number.isNaN(Number(v))) return Number(v);
  return 0;
}

/**
 * Get funnel data from analytics_funnel_daily if available, otherwise compute from core tables.
 * If track filter is active, filter steps that have listing_id by listing track.
 */
export async function getFunnelData(period: '7d' | '30d' = '30d', track: 'all' | 'operational' | 'digital' = 'all'): Promise<FunnelData> {
  const supabase = await createClient();
  const now = new Date();
  const days = period === '7d' ? 7 : 30;
  const startDate = new Date(now.getTime() - days * 24 * 60 * 60 * 1000);

  try {
    // TODO(schema): analytics_funnel_daily table does not exist - compute from core tables

    // Compute from core tables
    let isEstimated = false;

    // 1. Visitors (unique actor_id from events)
    let visitors = 0;
    try {
      // TODO(schema): events.type enum values unknown - replace 'visit'/'page_view' with correct enum values
      const { data: sessions } = await supabase
        .from('events')
        .select('actor_id')
        .in('type', ['visit', 'page_view'] as any)
        .gte('created_at', startDate.toISOString());
      visitors = new Set((sessions || []).map((e: any) => e.actor_id).filter(Boolean)).size;
    } catch {
      // Estimate from profiles (rough proxy)
      try {
        const { count } = await supabase
          .from('profiles')
          .select('*', { count: 'exact', head: true })
          .gte('created_at', startDate.toISOString());
        visitors = toNumber(count || 0) * 10; // Rough estimate
        isEstimated = true;
      } catch {
        visitors = 0;
        isEstimated = true;
      }
    }

    // 2. Registered
    let registered = 0;
    try {
      const { count: registeredCount, error: registeredError } = await supabase
        .from('profiles')
        .select('*', { count: 'exact', head: true })
        .gte('created_at', startDate.toISOString());
      registered = registeredError ? 0 : toNumber(registeredCount || 0);
    } catch {
      registered = 0;
    }

    // 3. Listing Viewed (from events)
    // If track filter is active, filter by listing track
    let listingViewed = 0;
    try {
      // TODO(schema): events.type enum value for 'listing_view' unknown
      if (track === 'all') {
        const { count } = await supabase
          .from('events')
          .select('*', { count: 'exact', head: true })
          .eq('type', 'listing_view' as any)
          .gte('created_at', startDate.toISOString());
        listingViewed = toNumber(count || 0);
      } else {
        // Track filter: get listing views and filter by listing track
        const { data: listingViewEvents } = await supabase
          .from('events')
          .select('listing_id')
          .eq('type', 'listing_view' as any)
          .gte('created_at', startDate.toISOString())
          .not('listing_id', 'is', null);

        if (listingViewEvents && listingViewEvents.length > 0) {
          const listingIds = listingViewEvents.map((e: any) => e.listing_id).filter(Boolean);
          if (listingIds.length > 0) {
            const { data: listings } = await supabase
              .from('listings_v16')
              .select('id, asset_type, meta, track, tax_category, category')
              .in('id', listingIds);

            if (listings) {
              listingViewed = listings.filter((l: any) => getListingTrack(l) === track).length;
            }
          }
        }
      }
    } catch {
      // No data available
    }

    // 4. NDA Requested (from events)
    // If track filter is active, filter by listing track
    let ndaRequested = 0;
    try {
      // TODO(schema): events.type enum value for 'nda_requested' unknown
      if (track === 'all') {
        const { count } = await supabase
          .from('events')
          .select('*', { count: 'exact', head: true })
          .eq('type', 'nda_requested' as any)
          .gte('created_at', startDate.toISOString());
        ndaRequested = toNumber(count || 0);
      } else {
        // Track filter: get NDA requests with listing_id and filter by track
        const { data: ndaRequestEvents } = await supabase
          .from('events')
          .select('listing_id')
          .eq('type', 'nda_requested' as any)
          .gte('created_at', startDate.toISOString())
          .not('listing_id', 'is', null);

        if (ndaRequestEvents && ndaRequestEvents.length > 0) {
          const listingIds = ndaRequestEvents.map((e: any) => e.listing_id).filter(Boolean);
          if (listingIds.length > 0) {
            const { data: listings } = await supabase
              .from('listings_v16')
              .select('id, asset_type, meta, track, tax_category, category')
              .in('id', listingIds);

            if (listings) {
              ndaRequested = listings.filter((l: any) => getListingTrack(l) === track).length;
            }
          }
        }
      }
    } catch {
      // Fallback: try nda_signatures table (only for "all" track)
      if (track === 'all') {
        try {
          const { count } = await supabase
            .from('nda_signatures')
            .select('*', { count: 'exact', head: true })
            .gte('signed_at', startDate.toISOString());
          ndaRequested = toNumber(count || 0);
        } catch {}
      }
    }

    // 5. NDA Signed (from events, fallback to signed_ndas)
    // If track filter is active, filter by listing track
    let ndaSigned = 0;
    try {
      // TODO(schema): events.type enum value for 'nda_signed' unknown
      if (track === 'all') {
        const { count } = await supabase
          .from('events')
          .select('*', { count: 'exact', head: true })
          .eq('type', 'nda_signed' as any)
          .gte('created_at', startDate.toISOString());
        ndaSigned = toNumber(count || 0);
      } else {
        // Track filter: get NDAs with listing_id and filter by track
        const { data: ndaSignedEvents } = await supabase
          .from('events')
          .select('listing_id')
          .eq('type', 'nda_signed' as any)
          .gte('created_at', startDate.toISOString())
          .not('listing_id', 'is', null);

        if (ndaSignedEvents && ndaSignedEvents.length > 0) {
          const listingIds = ndaSignedEvents.map((e: any) => e.listing_id).filter(Boolean);
          if (listingIds.length > 0) {
            const { data: listings } = await supabase
              .from('listings_v16')
              .select('id, asset_type, meta, track, tax_category, category')
              .in('id', listingIds);

            if (listings) {
              ndaSigned = listings.filter((l: any) => getListingTrack(l) === track).length;
            }
          }
        }
      }
    } catch {
      // Fallback: try nda_signatures table (only for "all" track)
      if (track === 'all') {
        try {
          const { count } = await supabase
            .from('nda_signatures')
            .select('*', { count: 'exact', head: true })
            .not('signed_at', 'is', null)
            .gte('signed_at', startDate.toISOString());
          ndaSigned = toNumber(count || 0);
        } catch {}
      }
    }

    // 6. Enquiry Sent (from events, fallback to listing_leads)
    // If track filter is active, filter by listing track
    let enquirySent = 0;
    try {
      // TODO(schema): events.type enum value for 'enquiry_sent' unknown
      if (track === 'all') {
        const { count } = await supabase
          .from('events')
          .select('*', { count: 'exact', head: true })
          .eq('type', 'enquiry_sent' as any)
          .gte('created_at', startDate.toISOString());
        enquirySent = toNumber(count || 0);
      } else {
        // Track filter: get enquiries with listing_id and filter by track
        const { data: enquiryEvents } = await supabase
          .from('events')
          .select('listing_id')
          .eq('type', 'enquiry_sent' as any)
          .gte('created_at', startDate.toISOString())
          .not('listing_id', 'is', null);

        if (enquiryEvents && enquiryEvents.length > 0) {
          const listingIds = enquiryEvents.map((e: any) => e.listing_id).filter(Boolean);
          if (listingIds.length > 0) {
            const { data: listings } = await supabase
              .from('listings_v16')
              .select('id, asset_type, meta, track, tax_category, category')
              .in('id', listingIds);

            if (listings) {
              enquirySent = listings.filter((l: any) => getListingTrack(l) === track).length;
            }
          }
        }
      }
    } catch {
      // TODO(schema): listing_leads table does not exist
      enquirySent = 0;
    }

    // 7. Deal Room Created
    // If track filter is active, filter by listing track
    let dealRoomCreated = 0;
    try {
      if (track === 'all') {
        const { count, error } = await supabase
          .from('deal_rooms')
          .select('*', { count: 'exact', head: true })
          .gte('created_at', startDate.toISOString());
        dealRoomCreated = error ? 0 : toNumber(count || 0);
      } else {
        // Track filter: get deal rooms with listing_id and filter by track
        const { data: dealRoomsData } = await supabase
          .from('deal_rooms')
          .select('listing_id')
          .gte('created_at', startDate.toISOString())
          .not('listing_id', 'is', null);

        if (dealRoomsData && dealRoomsData.length > 0) {
          const listingIds = dealRoomsData.map((d: any) => d.listing_id).filter(Boolean);
          if (listingIds.length > 0) {
            const { data: listings } = await supabase
              .from('listings_v16')
              .select('id, asset_type, meta, track, tax_category, category')
              .in('id', listingIds);

            if (listings) {
              dealRoomCreated = listings.filter((l: any) => getListingTrack(l) === track).length;
            }
          }
        }
      }
    } catch {
      dealRoomCreated = 0;
    }

    // 8. Message Sent (from events, fallback to messages table)
    // If track filter is active, filter by deal room's listing track
    let messageSent = 0;
    try {
      // TODO(schema): events.type enum value for 'message_sent' unknown
      if (track === 'all') {
        const { count } = await supabase
          .from('events')
          .select('*', { count: 'exact', head: true })
          .eq('type', 'message_sent' as any)
          .gte('created_at', startDate.toISOString());
        messageSent = toNumber(count || 0);
      } else {
        // Track filter: get messages with deal_room_id, then get deal rooms, then filter by listing track
        const { data: messageEvents } = await supabase
          .from('events')
          .select('deal_room_id')
          .eq('type', 'message_sent' as any)
          .gte('created_at', startDate.toISOString());

        if (messageEvents && messageEvents.length > 0) {
          const dealRoomIds = messageEvents
            .map((e: any) => e.deal_room_id)
            .filter(Boolean);

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
                  messageSent = listings.filter((l: any) => getListingTrack(l) === track).length;
                }
              }
            }
          }
        }
      }
    } catch {
      // Fallback: try messages table (only for "all" track)
      if (track === 'all') {
        try {
          const { count } = await supabase
            .from('messages')
            .select('*', { count: 'exact', head: true })
            .gte('created_at', startDate.toISOString());
          messageSent = toNumber(count || 0);
        } catch {}
      }
    }

    // Build funnel steps with conversion rates
    const steps: FunnelStep[] = [];
    const counts = [
      { step: 'visitor', label: 'Visitor', count: visitors },
      { step: 'registered', label: 'Registered', count: registered },
      { step: 'listing_viewed', label: 'Listing Viewed', count: listingViewed },
      { step: 'nda_requested', label: 'NDA Requested', count: ndaRequested },
      { step: 'nda_signed', label: 'NDA Signed', count: ndaSigned },
      { step: 'enquiry_sent', label: 'Enquiry Sent', count: enquirySent },
      { step: 'deal_room_created', label: 'Deal Room Created', count: dealRoomCreated },
      { step: 'message_sent', label: 'Message Sent', count: messageSent },
    ];

    counts.forEach((current, index) => {
      const previousCount = index > 0 ? counts[index - 1].count : current.count;
      const conversionRate = previousCount > 0 ? Math.round((current.count / previousCount) * 100) : 0;
      const dropOff = previousCount - current.count;
      const dropOffRate = previousCount > 0 ? Math.round((dropOff / previousCount) * 100) : 0;
      const isLowVolume = previousCount < 20;

      steps.push({
        step: current.step,
        label: current.label,
        count: current.count,
        conversionRate: index === 0 ? 100 : conversionRate,
        dropOff: index === 0 ? 0 : dropOff,
        dropOffRate: index === 0 ? 0 : dropOffRate,
        sampleSize: previousCount,
        isLowVolume,
      });
    });

    return {
      steps,
      period,
      isEstimated,
    };
  } catch (error) {
    if (process.env.NODE_ENV === "development") {
      console.warn("[getFunnelData] Error:", error);
    }
    return {
      steps: [],
      period,
      isEstimated: true,
    };
  }
}

