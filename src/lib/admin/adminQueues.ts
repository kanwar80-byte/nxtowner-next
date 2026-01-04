import "server-only";
import { createClient } from "@/utils/supabase/server";

export type QueueItem = {
  id: string;
  title: string;
  subtitle?: string;
  metadata?: Record<string, any>;
  created_at?: string;
};

export type AdminQueues = {
  listingsPendingReview: QueueItem[];
  highRiskListings: QueueItem[];
  ndasPendingExpiring: QueueItem[];
  paymentFailures: QueueItem[];
};

export async function getAdminQueues(): Promise<AdminQueues> {
  const supabase = await createClient();
  const sb: any = supabase;

  try {
    // 1. Listings Pending Review
    let listingsPendingReview: QueueItem[] = [];
    try {
      const { data, error } = await sb
        .from('listings_v16')
        .select('id, title, created_at, status, meta')
        .or('status.eq.draft,status.eq.pending_review')
        .order('created_at', { ascending: false })
        .limit(10);

      if (!error && data) {
        listingsPendingReview = data.map((item: any) => ({
          id: item.id,
          title: item.title || 'Untitled Listing',
          subtitle: item.status === 'draft' ? 'Draft' : 'Pending Review',
          created_at: item.created_at,
        }));
      }
    } catch (err) {
      console.error("[getAdminQueues] listingsPendingReview error:", err);
    }

    // 2. High Risk Listings (check meta.risk_score or similar)
    let highRiskListings: QueueItem[] = [];
    try {
      const { data, error } = await sb
        .from('listings_v16')
        .select('id, title, created_at, meta')
        .eq('status', 'active')
        .order('created_at', { ascending: false })
        .limit(50);

      if (!error && data) {
        highRiskListings = data
          .filter((item: any) => {
            const meta = item.meta || {};
            const riskScore = meta.risk_score || meta.risk || 0;
            return typeof riskScore === 'number' && riskScore >= 7;
          })
          .slice(0, 10)
          .map((item: any) => ({
            id: item.id,
            title: item.title || 'Untitled Listing',
            subtitle: 'High Risk',
            created_at: item.created_at,
          }));
      }
    } catch (err) {
      console.error("[getAdminQueues] highRiskListings error:", err);
    }

    // 3. NDAs Pending / Expiring
    let ndasPendingExpiring: QueueItem[] = [];
    try {
      const now = new Date();
      const sevenDaysFromNow = new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000);

      // Check nda_signatures table for pending/expiring
      // nda_signatures schema: id, deal_room_id, user_id, role, signed_at, signature_hash, pdf_url
      const { data: ndasData, error: ndasError } = await sb
        .from('nda_signatures')
        .select('id, deal_room_id, signed_at, created_at')
        .is('signed_at', null)
        .order('created_at', { ascending: false })
        .limit(10);

      if (!ndasError && ndasData) {
        // Get listing titles via deal_rooms
        const dealRoomIds = ndasData.map((n: any) => n.deal_room_id).filter(Boolean);
        if (dealRoomIds.length > 0) {
          const { data: dealRooms } = await sb
            .from('deal_rooms')
            .select('id, listing_id')
            .in('id', dealRoomIds)
            .not('listing_id', 'is', null);

          if (dealRooms && dealRooms.length > 0) {
            const listingIds = dealRooms.map((d: any) => d.listing_id).filter(Boolean);
            if (listingIds.length > 0) {
              const { data: listings } = await sb
                .from('listings_v16')
                .select('id, title')
                .in('id', listingIds);

              const listingMap = new Map((listings || []).map((l: any) => [l.id, l.title]));
              const dealRoomMap = new Map((dealRooms || []).map((d: any) => [d.id, d.listing_id]));

              ndasPendingExpiring = ndasData.map((nda: any) => {
                const listingId = dealRoomMap.get(nda.deal_room_id);
                return {
                  id: nda.id,
                  title: listingId ? (listingMap.get(listingId) || 'Unknown Listing') : 'Unknown Listing',
                  subtitle: 'NDA Pending',
                  created_at: nda.created_at,
                };
              });
            }
          }
        }
      }
    } catch (err) {
      console.error("[getAdminQueues] ndasPendingExpiring error:", err);
    }

    // 4. Payment Failures (check if stripe webhook events table exists, or use a placeholder)
    let paymentFailures: QueueItem[] = [];
    try {
      // Try to query a payments or stripe_events table if it exists
      const { data, error } = await sb
        .from('stripe_events')
        .select('id, event_type, created_at, data')
        .eq('event_type', 'payment_intent.payment_failed')
        .order('created_at', { ascending: false })
        .limit(10);

      if (!error && data) {
        paymentFailures = data.map((item: any) => ({
          id: item.id,
          title: 'Payment Failed',
          subtitle: item.data?.customer_email || 'Unknown Customer',
          created_at: item.created_at,
        }));
      }
    } catch (err) {
      // Table doesn't exist - that's okay, we'll show empty
      console.error("[getAdminQueues] paymentFailures error (table may not exist):", err);
    }

    return {
      listingsPendingReview,
      highRiskListings,
      ndasPendingExpiring,
      paymentFailures,
    };
  } catch (error) {
    console.error("[getAdminQueues] Error:", error);
    return {
      listingsPendingReview: [],
      highRiskListings: [],
      ndasPendingExpiring: [],
      paymentFailures: [],
    };
  }
}

