import "server-only";
import { createClient } from "@/utils/supabase/server";
import { getListingTrack } from "@/lib/track";

export type KpiMetric = {
  label: string;
  value7d: number;
  value30d: number;
  delta?: number;
  deltaPercent?: number;
  isEstimated?: boolean;
};

export type FounderMetrics = {
  visitors: KpiMetric;
  registrations: KpiMetric;
  paidUsers: KpiMetric;
  mrr: KpiMetric;
  ndaSigned: KpiMetric;
  enquiries: KpiMetric;
  dealRoomsActive: KpiMetric;
};

function toNumber(v: unknown): number {
  if (typeof v === "number") return v;
  if (typeof v === "bigint") return Number(v);
  if (typeof v === "string" && v.trim() !== "" && !Number.isNaN(Number(v))) return Number(v);
  return 0;
}

function calculateDelta(current: number, previous: number): { delta: number; deltaPercent: number } {
  const delta = current - previous;
  const deltaPercent = previous > 0 ? Math.round((delta / previous) * 100) : (current > 0 ? 100 : 0);
  return { delta, deltaPercent };
}

export async function getFounderMetrics(track: 'all' | 'operational' | 'digital' = 'all'): Promise<FounderMetrics> {
  const supabase = await createClient();
  const now = new Date();
  const sevenDaysAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
  const thirtyDaysAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
  const sixtyDaysAgo = new Date(now.getTime() - 60 * 24 * 60 * 60 * 1000);

  try {
    // 1. Visitors (from events table)
    let visitors7d = 0;
    let visitors30d = 0;
    let visitorsPrev30d = 0;
    let visitorsEstimated = false;

    try {
      // TODO(schema): events.type enum values unknown - replace 'visit'/'page_view' with correct enum values
      const { data: sessions7d } = await supabase
        .from('events')
        .select('actor_id')
        .in('type', ['visit', 'page_view'] as any)
        .gte('created_at', sevenDaysAgo.toISOString());

      const { data: sessions30d } = await supabase
        .from('events')
        .select('actor_id')
        .in('type', ['visit', 'page_view'] as any)
        .gte('created_at', thirtyDaysAgo.toISOString());

      const { data: sessionsPrev30d } = await supabase
        .from('events')
        .select('actor_id')
        .in('type', ['visit', 'page_view'] as any)
        .gte('created_at', sixtyDaysAgo.toISOString())
        .lt('created_at', thirtyDaysAgo.toISOString());

      visitors7d = new Set((sessions7d || []).map((e: any) => e.actor_id).filter(Boolean)).size;
      visitors30d = new Set((sessions30d || []).map((e: any) => e.actor_id).filter(Boolean)).size;
      visitorsPrev30d = new Set((sessionsPrev30d || []).map((e: any) => e.actor_id).filter(Boolean)).size;
      visitorsEstimated = true;
    } catch {
      // Final fallback: estimate from profiles
      visitorsEstimated = true;
      try {
        const { count: count7d } = await supabase
          .from('profiles')
          .select('*', { count: 'exact', head: true })
          .gte('created_at', sevenDaysAgo.toISOString());
        visitors7d = toNumber(count7d || 0) * 10;
        visitors30d = visitors7d * 4;
        visitorsPrev30d = visitors30d;
      } catch {
        visitors7d = 0;
        visitors30d = 0;
        visitorsPrev30d = 0;
      }
    }

    const visitorsDelta = calculateDelta(visitors30d, visitorsPrev30d);

    // 2. Registrations (from profiles)
    let reg7d = 0;
    let reg30d = 0;
    let regPrev30d = 0;

    try {
      const { count: reg7dCount, error: reg7dError } = await supabase
        .from('profiles')
        .select('*', { count: 'exact', head: true })
        .gte('created_at', sevenDaysAgo.toISOString());
      reg7d = reg7dError ? 0 : toNumber(reg7dCount || 0);
    } catch {
      reg7d = 0;
    }

    try {
      const { count: reg30dCount, error: reg30dError } = await supabase
        .from('profiles')
        .select('*', { count: 'exact', head: true })
        .gte('created_at', thirtyDaysAgo.toISOString());
      reg30d = reg30dError ? 0 : toNumber(reg30dCount || 0);
    } catch {
      reg30d = 0;
    }

    try {
      const { count: regPrev30dCount, error: regPrev30dError } = await supabase
        .from('profiles')
        .select('*', { count: 'exact', head: true })
        .gte('created_at', sixtyDaysAgo.toISOString())
        .lt('created_at', thirtyDaysAgo.toISOString());
      regPrev30d = regPrev30dError ? 0 : toNumber(regPrev30dCount || 0);
    } catch {
      regPrev30d = 0;
    }
    const regDelta = calculateDelta(reg30d, regPrev30d);

    // 3. Paid Users (from profiles with subscription_tier or plan)
    let paid7d = 0;
    let paid30d = 0;
    let paidPrev30d = 0;
    try {
      try {
        const { count: count7d, error: error7d } = await supabase
          .from('profiles')
          .select('*', { count: 'exact', head: true })
          .or('subscription_tier.neq.free,plan.neq.free')
          .gte('created_at', sevenDaysAgo.toISOString());
        paid7d = error7d ? 0 : toNumber(count7d || 0);
      } catch {
        paid7d = 0;
      }

      try {
        const { count: count30d, error: error30d } = await supabase
          .from('profiles')
          .select('*', { count: 'exact', head: true })
          .or('subscription_tier.neq.free,plan.neq.free')
          .gte('created_at', thirtyDaysAgo.toISOString());
        paid30d = error30d ? 0 : toNumber(count30d || 0);
      } catch {
        paid30d = 0;
      }

      try {
        const { count: countPrev30d, error: errorPrev30d } = await supabase
          .from('profiles')
          .select('*', { count: 'exact', head: true })
          .or('subscription_tier.neq.free,plan.neq.free')
          .gte('created_at', sixtyDaysAgo.toISOString())
          .lt('created_at', thirtyDaysAgo.toISOString());
        paidPrev30d = errorPrev30d ? 0 : toNumber(countPrev30d || 0);
      } catch {
        paidPrev30d = 0;
      }
    } catch {
      // No paid users data available
    }
    const paidDelta = calculateDelta(paid30d, paidPrev30d);

    // 4. MRR (Monthly Recurring Revenue) - placeholder/estimated
    let mrr7d = 0;
    let mrr30d = 0;
    let mrrPrev30d = 0;
    const mrrEstimated = true;
    // TODO: Calculate from actual subscription data when available
    // For now, estimate: paid users * average subscription price
    mrr30d = paid30d * 50; // Rough estimate
    mrr7d = paid7d * 50;
    mrrPrev30d = paidPrev30d * 50;
    const mrrDelta = calculateDelta(mrr30d, mrrPrev30d);

    // 5. NDAs Signed (prefer analytics_daily, fallback to signed_ndas/events)
    // If track filter is active, we need to filter by listing track
    let nda7d = 0;
    let nda30d = 0;
    let ndaPrev30d = 0;

    try {
      const sevenDaysAgoDate = sevenDaysAgo.toISOString().split('T')[0];
      const thirtyDaysAgoDate = thirtyDaysAgo.toISOString().split('T')[0];
      const sixtyDaysAgoDate = sixtyDaysAgo.toISOString().split('T')[0];

      // If track is "all", query nda_signatures directly
      if (track === 'all') {
        try {
          const { count: nda7dCount, error: nda7dError } = await supabase
            .from('nda_signatures')
            .select('*', { count: 'exact', head: true })
            .gte('signed_at', sevenDaysAgo.toISOString());
          nda7d = nda7dError ? 0 : toNumber(nda7dCount || 0);
        } catch {
          nda7d = 0;
        }

        try {
          const { count: nda30dCount, error: nda30dError } = await supabase
            .from('nda_signatures')
            .select('*', { count: 'exact', head: true })
            .gte('signed_at', thirtyDaysAgo.toISOString());
          nda30d = nda30dError ? 0 : toNumber(nda30dCount || 0);
        } catch {
          nda30d = 0;
        }

        try {
          const { count: ndaPrev30dCount, error: ndaPrev30dError } = await supabase
            .from('nda_signatures')
            .select('*', { count: 'exact', head: true })
            .gte('signed_at', sixtyDaysAgo.toISOString())
            .lt('signed_at', thirtyDaysAgo.toISOString());
          ndaPrev30d = ndaPrev30dError ? 0 : toNumber(ndaPrev30dCount || 0);
        } catch {
          ndaPrev30d = 0;
        }

        if (nda7d === 0 && nda30d === 0) {
          throw new Error("No aggregate data, using fallback");
        }
      } else {
        // Track filter active - need to filter by listing track
        throw new Error("Track filter requires listing join");
      }
    } catch {
      // Fallback to nda_signatures or events
      // If track filter is active, filter by listing track
      try {
        if (track === 'all') {
          try {
            const { count: nda7dCount, error: nda7dError } = await supabase
              .from('nda_signatures')
              .select('*', { count: 'exact', head: true })
              .gte('signed_at', sevenDaysAgo.toISOString());
            nda7d = nda7dError ? 0 : toNumber(nda7dCount || 0);
          } catch {
            nda7d = 0;
          }

          try {
            const { count: nda30dCount, error: nda30dError } = await supabase
              .from('nda_signatures')
              .select('*', { count: 'exact', head: true })
              .gte('signed_at', thirtyDaysAgo.toISOString());
            nda30d = nda30dError ? 0 : toNumber(nda30dCount || 0);
          } catch {
            nda30d = 0;
          }

          try {
            const { count: ndaPrev30dCount, error: ndaPrev30dError } = await supabase
              .from('nda_signatures')
              .select('*', { count: 'exact', head: true })
              .gte('signed_at', sixtyDaysAgo.toISOString())
              .lt('signed_at', thirtyDaysAgo.toISOString());
            ndaPrev30d = ndaPrev30dError ? 0 : toNumber(ndaPrev30dCount || 0);
          } catch {
            ndaPrev30d = 0;
          }
        } else {
          // Track filter: get NDAs via deal_rooms and filter by listing track
          try {
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
                      nda7d = listings.filter((l: any) => getListingTrack(l) === track).length;
                    }
                  }
                }
              }
            }
          } catch {
            nda7d = 0;
          }

          try {
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
                      nda30d = listings.filter((l: any) => getListingTrack(l) === track).length;
                    }
                  }
                }
              }
            }
          } catch {
            nda30d = 0;
          }

          try {
            const { data: ndasPrev30dData } = await supabase
              .from('nda_signatures')
              .select('deal_room_id')
              .gte('signed_at', sixtyDaysAgo.toISOString())
              .lt('signed_at', thirtyDaysAgo.toISOString());

            if (ndasPrev30dData && ndasPrev30dData.length > 0) {
              const dealRoomIds = ndasPrev30dData.map((n: any) => n.deal_room_id).filter(Boolean);
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
                      ndaPrev30d = listings.filter((l: any) => getListingTrack(l) === track).length;
                    }
                  }
                }
              }
            }
          } catch {
            ndaPrev30d = 0;
          }
        }
      } catch {
        // Final fallback: events
        // TODO(schema): events.type enum value for 'nda_signed' unknown
        try {
          const { count: nda7dCount, error: nda7dError } = await supabase
            .from('events')
            .select('*', { count: 'exact', head: true })
            .eq('type', 'nda_signed' as any)
            .gte('created_at', sevenDaysAgo.toISOString());
          nda7d = nda7dError ? 0 : toNumber(nda7dCount || 0);
        } catch {
          nda7d = 0;
        }

        try {
          const { count: nda30dCount, error: nda30dError } = await supabase
            .from('events')
            .select('*', { count: 'exact', head: true })
            .eq('type', 'nda_signed' as any)
            .gte('created_at', thirtyDaysAgo.toISOString());
          nda30d = nda30dError ? 0 : toNumber(nda30dCount || 0);
        } catch {
          nda30d = 0;
        }

        try {
          const { count: ndaPrev30dCount, error: ndaPrev30dError } = await supabase
            .from('events')
            .select('*', { count: 'exact', head: true })
            .eq('type', 'nda_signed' as any)
            .gte('created_at', sixtyDaysAgo.toISOString())
            .lt('created_at', thirtyDaysAgo.toISOString());
          ndaPrev30d = ndaPrev30dError ? 0 : toNumber(ndaPrev30dCount || 0);
        } catch {
          ndaPrev30d = 0;
        }
      }
    }
    const ndaDelta = calculateDelta(nda30d, ndaPrev30d);

    // 6. Enquiries (from events)
    // If track filter is active, filter by listing track
    let enquiries7d = 0;
    let enquiries30d = 0;
    let enquiriesPrev30d = 0;

    try {
      // TODO(schema): events.type enum value for 'enquiry_sent' unknown
      if (track === 'all') {
        const { count: count7d } = await supabase
          .from('events')
          .select('*', { count: 'exact', head: true })
          .eq('type', 'enquiry_sent' as any)
          .gte('created_at', sevenDaysAgo.toISOString());

        const { count: count30d } = await supabase
          .from('events')
          .select('*', { count: 'exact', head: true })
          .eq('type', 'enquiry_sent' as any)
          .gte('created_at', thirtyDaysAgo.toISOString());

        const { count: countPrev30d } = await supabase
          .from('events')
          .select('*', { count: 'exact', head: true })
          .eq('type', 'enquiry_sent' as any)
          .gte('created_at', sixtyDaysAgo.toISOString())
          .lt('created_at', thirtyDaysAgo.toISOString());

        enquiries7d = toNumber(count7d || 0);
        enquiries30d = toNumber(count30d || 0);
        enquiriesPrev30d = toNumber(countPrev30d || 0);
      } else {
        // Track filter: get enquiries with listing_id and filter by track
        const { data: enquiries7dData } = await supabase
          .from('events')
          .select('listing_id')
          .eq('type', 'enquiry_sent' as any)
          .gte('created_at', sevenDaysAgo.toISOString())
          .not('listing_id', 'is', null);

        if (enquiries7dData && enquiries7dData.length > 0) {
          const listingIds = enquiries7dData.map((e: any) => e.listing_id).filter(Boolean);
          if (listingIds.length > 0) {
            const { data: listings } = await supabase
              .from('listings_v16')
              .select('id, asset_type, meta, track, tax_category, category')
              .in('id', listingIds);

            if (listings) {
              enquiries7d = listings.filter((l: any) => getListingTrack(l) === track).length;
            }
          }
        }

        const { data: enquiries30dData } = await supabase
          .from('events')
          .select('listing_id')
          .eq('type', 'enquiry_sent' as any)
          .gte('created_at', thirtyDaysAgo.toISOString())
          .not('listing_id', 'is', null);

        if (enquiries30dData && enquiries30dData.length > 0) {
          const listingIds = enquiries30dData.map((e: any) => e.listing_id).filter(Boolean);
          if (listingIds.length > 0) {
            const { data: listings } = await supabase
              .from('listings_v16')
              .select('id, asset_type, meta, track, tax_category, category')
              .in('id', listingIds);

            if (listings) {
              enquiries30d = listings.filter((l: any) => getListingTrack(l) === track).length;
            }
          }
        }

        const { data: enquiriesPrev30dData } = await supabase
          .from('events')
          .select('listing_id')
          .eq('type', 'enquiry_sent' as any)
          .gte('created_at', sixtyDaysAgo.toISOString())
          .lt('created_at', thirtyDaysAgo.toISOString())
          .not('listing_id', 'is', null);

        if (enquiriesPrev30dData && enquiriesPrev30dData.length > 0) {
          const listingIds = enquiriesPrev30dData.map((e: any) => e.listing_id).filter(Boolean);
          if (listingIds.length > 0) {
            const { data: listings } = await supabase
              .from('listings_v16')
              .select('id, asset_type, meta, track, tax_category, category')
              .in('id', listingIds);

            if (listings) {
              enquiriesPrev30d = listings.filter((l: any) => getListingTrack(l) === track).length;
            }
          }
        }
      }
    } catch {
      // TODO(schema): listing_leads table does not exist - set to 0
      enquiries7d = 0;
      enquiries30d = 0;
      enquiriesPrev30d = 0;
    }
    const enquiriesDelta = calculateDelta(enquiries30d, enquiriesPrev30d);

    // 7. Deal Rooms Active (count created in periods, show current active as main value)
    // If track filter is active, filter by listing track
    let dealRoomsActive = 0;
    try {
      if (track === 'all') {
        const { count: activeCount, error: activeError } = await supabase
          .from('deal_rooms')
          .select('*', { count: 'exact', head: true })
          .eq('status', 'active');
        dealRoomsActive = activeError ? 0 : toNumber(activeCount || 0);
      } else {
        // Track filter: get deal rooms and filter by listing track
        const { data: dealRoomsData } = await supabase
          .from('deal_rooms')
          .select('listing_id')
          .eq('status', 'active')
          .not('listing_id', 'is', null);

        if (dealRoomsData && dealRoomsData.length > 0) {
          const listingIds = dealRoomsData.map((d: any) => d.listing_id).filter(Boolean);
          if (listingIds.length > 0) {
            const { data: listings } = await supabase
              .from('listings_v16')
              .select('id, asset_type, meta, track, tax_category, category')
              .in('id', listingIds);

            if (listings) {
              dealRoomsActive = listings.filter((l: any) => getListingTrack(l) === track).length;
            }
          }
        }
      }
    } catch {
      dealRoomsActive = 0;
    }
    
    // For trend, count created in periods
    let dealRooms7d = 0;
    let dealRooms30dCreated = 0;
    let dealRoomsPrev30dCreated = 0;

    try {
      if (track === 'all') {
        const { count: created7dCount, error: created7dError } = await supabase
          .from('deal_rooms')
          .select('*', { count: 'exact', head: true })
          .gte('created_at', sevenDaysAgo.toISOString());
        dealRooms7d = created7dError ? 0 : toNumber(created7dCount || 0);
      } else {
        const { data: dealRooms7dData } = await supabase
          .from('deal_rooms')
          .select('listing_id')
          .gte('created_at', sevenDaysAgo.toISOString())
          .not('listing_id', 'is', null);

        if (dealRooms7dData && dealRooms7dData.length > 0) {
          const listingIds = dealRooms7dData.map((d: any) => d.listing_id).filter(Boolean);
          if (listingIds.length > 0) {
            const { data: listings } = await supabase
              .from('listings_v16')
              .select('id, asset_type, meta, track, tax_category, category')
              .in('id', listingIds);

            if (listings) {
              dealRooms7d = listings.filter((l: any) => getListingTrack(l) === track).length;
            }
          }
        }
      }
    } catch {
      dealRooms7d = 0;
    }

    try {
      if (track === 'all') {
        const { count: created30dCount, error: created30dError } = await supabase
          .from('deal_rooms')
          .select('*', { count: 'exact', head: true })
          .gte('created_at', thirtyDaysAgo.toISOString());
        dealRooms30dCreated = created30dError ? 0 : toNumber(created30dCount || 0);
      } else {
        const { data: dealRooms30dData } = await supabase
          .from('deal_rooms')
          .select('listing_id')
          .gte('created_at', thirtyDaysAgo.toISOString())
          .not('listing_id', 'is', null);

        if (dealRooms30dData && dealRooms30dData.length > 0) {
          const listingIds = dealRooms30dData.map((d: any) => d.listing_id).filter(Boolean);
          if (listingIds.length > 0) {
            const { data: listings } = await supabase
              .from('listings_v16')
              .select('id, asset_type, meta, track, tax_category, category')
              .in('id', listingIds);

            if (listings) {
              dealRooms30dCreated = listings.filter((l: any) => getListingTrack(l) === track).length;
            }
          }
        }
      }
    } catch {
      dealRooms30dCreated = 0;
    }

    try {
      if (track === 'all') {
        const { count: createdPrev30dCount, error: createdPrev30dError } = await supabase
          .from('deal_rooms')
          .select('*', { count: 'exact', head: true })
          .gte('created_at', sixtyDaysAgo.toISOString())
          .lt('created_at', thirtyDaysAgo.toISOString());
        dealRoomsPrev30dCreated = createdPrev30dError ? 0 : toNumber(createdPrev30dCount || 0);
      } else {
        const { data: dealRoomsPrev30dData } = await supabase
          .from('deal_rooms')
          .select('listing_id')
          .gte('created_at', sixtyDaysAgo.toISOString())
          .lt('created_at', thirtyDaysAgo.toISOString())
          .not('listing_id', 'is', null);

        if (dealRoomsPrev30dData && dealRoomsPrev30dData.length > 0) {
          const listingIds = dealRoomsPrev30dData.map((d: any) => d.listing_id).filter(Boolean);
          if (listingIds.length > 0) {
            const { data: listings } = await supabase
              .from('listings_v16')
              .select('id, asset_type, meta, track, tax_category, category')
              .in('id', listingIds);

            if (listings) {
              dealRoomsPrev30dCreated = listings.filter((l: any) => getListingTrack(l) === track).length;
            }
          }
        }
      }
    } catch {
      dealRoomsPrev30dCreated = 0;
    }
    const dealRoomsDelta = calculateDelta(dealRooms30dCreated, dealRoomsPrev30dCreated);

    return {
      visitors: {
        label: "Visitors",
        value7d: visitors7d,
        value30d: visitors30d,
        ...visitorsDelta,
        isEstimated: visitorsEstimated,
      },
      registrations: {
        label: "Registrations",
        value7d: reg7d,
        value30d: reg30d,
        ...regDelta,
      },
      paidUsers: {
        label: "Paid Users",
        value7d: paid7d,
        value30d: paid30d,
        ...paidDelta,
      },
      mrr: {
        label: "MRR",
        value7d: mrr7d,
        value30d: mrr30d,
        ...mrrDelta,
        isEstimated: mrrEstimated,
      },
      ndaSigned: {
        label: "NDAs Signed",
        value7d: nda7d,
        value30d: nda30d,
        ...ndaDelta,
      },
      enquiries: {
        label: "Enquiries",
        value7d: enquiries7d,
        value30d: enquiries30d,
        ...enquiriesDelta,
      },
      dealRoomsActive: {
        label: "Deal Rooms Active",
        value7d: dealRooms7d, // Created in last 7d
        value30d: dealRoomsActive, // Current active count
        ...dealRoomsDelta, // Trend based on created counts
      },
    };
  } catch (error) {
    if (process.env.NODE_ENV === "development") {
      console.warn("[getFounderMetrics] Error:", error);
    }
    return {
      visitors: { label: "Visitors", value7d: 0, value30d: 0, isEstimated: true },
      registrations: { label: "Registrations", value7d: 0, value30d: 0 },
      paidUsers: { label: "Paid Users", value7d: 0, value30d: 0 },
      mrr: { label: "MRR", value7d: 0, value30d: 0, isEstimated: true },
      ndaSigned: { label: "NDAs Signed", value7d: 0, value30d: 0 },
      enquiries: { label: "Enquiries", value7d: 0, value30d: 0 },
      dealRoomsActive: { label: "Deal Rooms Active", value7d: 0, value30d: 0 },
    };
  }
}

