import "server-only";
import { createClient } from "@/utils/supabase/server";

export type DealMetrics = {
  dealRoomsCreated: {
    count7d: number | null;
    count30d: number | null;
    count90d: number | null;
  };
  activeDealRooms: {
    count: number | null;
    activeIn14d: number | null; // Deal rooms with message_sent in last 14d
  };
  avgTimeToEnquiry: {
    hours: number | null; // Average time from nda_signed to enquiry_sent
    note?: string;
  };
  dealVelocity: {
    ndaToEnquiry: number | null; // % of NDAs that lead to enquiry within 7 days
    enquiryToDealRoom: number | null; // % of enquiries that lead to deal room within 7 days
  };
  dataQualityNote?: string;
};

function toNumber(v: unknown): number {
  if (typeof v === "number") return v;
  if (typeof v === "bigint") return Number(v);
  if (typeof v === "string" && v.trim() !== "" && !Number.isNaN(Number(v))) return Number(v);
  return 0;
}

/**
 * Get deal velocity metrics (legal-safe, no PII).
 * Computes from events and deal_rooms tables.
 * Track parameter filters by listing track where applicable.
 */
export async function getDealMetrics(period: '7d' | '30d' = '30d', track: 'all' | 'operational' | 'digital' = 'all'): Promise<DealMetrics> {
  const supabase = await createClient();
  const now = new Date();
  const sevenDaysAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
  const thirtyDaysAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
  const ninetyDaysAgo = new Date(now.getTime() - 90 * 24 * 60 * 60 * 1000);
  const fourteenDaysAgo = new Date(now.getTime() - 14 * 24 * 60 * 60 * 1000);

  try {
    // Deal Rooms Created
    let dealRooms7d: number | null = null;
    let dealRooms30d: number | null = null;
    let dealRooms90d: number | null = null;

    try {
      const { count: count7d } = await supabase
        .from('deal_rooms')
        .select('*', { count: 'exact', head: true })
        .gte('created_at', sevenDaysAgo.toISOString());
      dealRooms7d = toNumber(count7d || 0);

      const { count: count30d } = await supabase
        .from('deal_rooms')
        .select('*', { count: 'exact', head: true })
        .gte('created_at', thirtyDaysAgo.toISOString());
      dealRooms30d = toNumber(count30d || 0);

      const { count: count90d } = await supabase
        .from('deal_rooms')
        .select('*', { count: 'exact', head: true })
        .gte('created_at', ninetyDaysAgo.toISOString());
      dealRooms90d = toNumber(count90d || 0);
    } catch {
      // Fallback: try events
      try {
        const { count: count7d } = await supabase
          .from('events')
          .select('*', { count: 'exact', head: true })
          .eq('event_name', 'deal_room_created')
          .gte('created_at', sevenDaysAgo.toISOString());
        dealRooms7d = toNumber(count7d || 0);

        const { count: count30d } = await supabase
          .from('events')
          .select('*', { count: 'exact', head: true })
          .eq('event_name', 'deal_room_created')
          .gte('created_at', thirtyDaysAgo.toISOString());
        dealRooms30d = toNumber(count30d || 0);

        const { count: count90d } = await supabase
          .from('events')
          .select('*', { count: 'exact', head: true })
          .eq('event_name', 'deal_room_created')
          .gte('created_at', ninetyDaysAgo.toISOString());
        dealRooms90d = toNumber(count90d || 0);
      } catch {}
    }

    // Active Deal Rooms
    let activeCount: number | null = null;
    let activeIn14d: number | null = null;

    try {
      const { count } = await supabase
        .from('deal_rooms')
        .select('*', { count: 'exact', head: true })
        .eq('status', 'active');
      activeCount = toNumber(count || 0);
    } catch {}

    // Active in last 14 days (has message_sent event)
    try {
      const { data: messageEvents } = await supabase
        .from('events')
        .select('payload')
        .eq('type', 'message_sent')
        .gte('created_at', fourteenDaysAgo.toISOString());

      if (messageEvents) {
        // Count unique deal rooms (from payload.room_id if available, or deal_room_id from row)
        const activeRooms = new Set<string>();
        messageEvents.forEach((e: any) => {
          const payload = e.payload && typeof e.payload === 'object' && !Array.isArray(e.payload)
            ? e.payload as Record<string, unknown>
            : {};
          const roomId = typeof payload.room_id === 'string' 
            ? payload.room_id 
            : typeof payload.deal_room_id === 'string'
              ? payload.deal_room_id
              : typeof e.deal_room_id === 'string'
                ? e.deal_room_id
                : null;
          if (roomId) activeRooms.add(roomId);
        });
        activeIn14d = activeRooms.size;
      }
    } catch {}

    // Average time from NDA signed to enquiry sent
    let avgTimeToEnquiry: number | null = null;
    let avgTimeNote: string | undefined;

    try {
      // Get NDAs signed with timestamps
      // Events table uses actor_id, not user_id
      const { data: ndaEvents } = await supabase
        .from('events')
        .select('created_at, listing_id, actor_id')
        .eq('type', 'nda_signed')
        .gte('created_at', thirtyDaysAgo.toISOString())
        .order('created_at', { ascending: false });

      // Get enquiries sent with timestamps (using message_sent as semantic match)
      const { data: enquiryEvents } = await supabase
        .from('events')
        .select('created_at, listing_id, actor_id')
        .eq('type', 'message_sent')
        .gte('created_at', thirtyDaysAgo.toISOString())
        .order('created_at', { ascending: false });

      if (ndaEvents && enquiryEvents && ndaEvents.length > 0 && enquiryEvents.length > 0) {
        // Match NDAs to enquiries by listing_id and actor_id
        const timeDiffs: number[] = [];
        ndaEvents.forEach((nda: any) => {
          const matchingEnquiry = enquiryEvents.find(
            (e: any) =>
              e.listing_id === nda.listing_id &&
              e.actor_id === nda.actor_id &&
              new Date(e.created_at) > new Date(nda.created_at)
          );
          if (matchingEnquiry) {
            const diffHours = (new Date(matchingEnquiry.created_at).getTime() - new Date(nda.created_at).getTime()) / (1000 * 60 * 60);
            if (diffHours > 0 && diffHours < 168) { // Within 7 days
              timeDiffs.push(diffHours);
            }
          }
        });

        if (timeDiffs.length > 0) {
          avgTimeToEnquiry = Math.round((timeDiffs.reduce((a, b) => a + b, 0) / timeDiffs.length) * 10) / 10;
        } else {
          avgTimeNote = "No matching NDA-to-enquiry pairs found in this period";
        }
      } else {
        avgTimeNote = "Insufficient data captured for time-to-enquiry calculation";
      }
    } catch {
      avgTimeNote = "Insufficient data captured for time-to-enquiry calculation";
    }

    // Deal velocity: NDA to enquiry conversion
    let ndaToEnquiry: number | null = null;
    let enquiryToDealRoom: number | null = null;

    try {
      const { count: ndaCount } = await supabase
        .from('events')
        .select('*', { count: 'exact', head: true })
        .eq('type', 'nda_signed')
        .gte('created_at', thirtyDaysAgo.toISOString());

      const { count: enquiryCount } = await supabase
        .from('events')
        .select('*', { count: 'exact', head: true })
        .eq('type', 'message_sent')
        .gte('created_at', thirtyDaysAgo.toISOString());

      const { count: dealRoomCount } = await supabase
        .from('events')
        .select('*', { count: 'exact', head: true })
        .eq('type', 'deal_room_created')
        .gte('created_at', thirtyDaysAgo.toISOString());

      const ndas = toNumber(ndaCount || 0);
      const enquiries = toNumber(enquiryCount || 0);
      const dealRooms = toNumber(dealRoomCount || 0);

      ndaToEnquiry = ndas > 0 ? Math.round((enquiries / ndas) * 100) : null;
      enquiryToDealRoom = enquiries > 0 ? Math.round((dealRooms / enquiries) * 100) : null;
    } catch {}

    return {
      dealRoomsCreated: {
        count7d: dealRooms7d,
        count30d: dealRooms30d,
        count90d: dealRooms90d,
      },
      activeDealRooms: {
        count: activeCount,
        activeIn14d: activeIn14d,
      },
      avgTimeToEnquiry: {
        hours: avgTimeToEnquiry,
        note: avgTimeNote,
      },
      dealVelocity: {
        ndaToEnquiry,
        enquiryToDealRoom,
      },
    };
  } catch (error) {
    if (process.env.NODE_ENV === "development") {
      console.warn("[getDealMetrics] Error:", error);
    }
    return {
      dealRoomsCreated: { count7d: null, count30d: null, count90d: null },
      activeDealRooms: { count: null, activeIn14d: null },
      avgTimeToEnquiry: { hours: null, note: "Insufficient data captured" },
      dealVelocity: { ndaToEnquiry: null, enquiryToDealRoom: null },
      dataQualityNote: "Insufficient data captured for deal metrics",
    };
  }
}

