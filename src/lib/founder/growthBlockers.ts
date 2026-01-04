import "server-only";
import { createClient } from "@/utils/supabase/server";
import { GrowthBlocker } from "@/components/founder/FounderBlockers";

/**
 * Compute growth blockers from heuristics (no AI yet).
 * Returns top blockers based on simple rules.
 */
export async function computeGrowthBlockers(): Promise<GrowthBlocker[]> {
  const supabase = await createClient();
  const blockers: GrowthBlocker[] = [];

  try {
    // Heuristic 1: Low registration rate (if we have visitor data)
    try {
      // TODO(schema): events.type enum value for 'visit' unknown
      const { count: visitorCount } = await supabase
        .from('events')
        .select('*', { count: 'exact', head: true })
        .eq('type', 'visit' as any)
        .gte('created_at', new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString());

      const { count: regCount } = await supabase
        .from('profiles')
        .select('*', { count: 'exact', head: true })
        .gte('created_at', new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString());

      const visitorNum = typeof visitorCount === 'number' ? visitorCount : 0;
      const regNum = typeof regCount === 'number' ? regCount : 0;

      if (visitorNum > 100 && regNum > 0) {
        const conversionRate = (regNum / visitorNum) * 100;
        if (conversionRate < 2) {
          blockers.push({
            id: 'low_registration_rate',
            title: 'Low Registration Conversion Rate',
            description: `Only ${conversionRate.toFixed(1)}% of visitors are registering. Consider improving signup flow or value proposition.`,
            severity: conversionRate < 1 ? 'high' : 'medium',
            category: 'conversion',
          });
        }
      }
    } catch {}

    // Heuristic 2: Low NDA to Enquiry conversion
    try {
      const { count: ndaCount } = await supabase
        .from('nda_signatures')
        .select('*', { count: 'exact', head: true })
        .gte('signed_at', new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString());

      // TODO(schema): events.type enum value for 'enquiry_sent' unknown
      const { count: enquiryCount } = await supabase
        .from('events')
        .select('*', { count: 'exact', head: true })
        .eq('type', 'enquiry_sent' as any)
        .gte('created_at', new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString());

      const ndaNum = typeof ndaCount === 'number' ? ndaCount : 0;
      const enquiryNum = typeof enquiryCount === 'number' ? enquiryCount : 0;

      if (ndaNum > 10 && enquiryNum > 0) {
        const conversionRate = (enquiryNum / ndaNum) * 100;
        if (conversionRate < 30) {
          blockers.push({
            id: 'low_nda_to_enquiry',
            title: 'Low NDA to Enquiry Conversion',
            description: `Only ${conversionRate.toFixed(1)}% of NDA signers are sending enquiries. Review listing quality and buyer experience.`,
            severity: conversionRate < 20 ? 'high' : 'medium',
            category: 'conversion',
          });
        }
      }
    } catch {}

    // Heuristic 3: Low paid user conversion
    try {
      const { count: totalUsers } = await supabase
        .from('profiles')
        .select('*', { count: 'exact', head: true });

      const { count: paidUsers } = await supabase
        .from('profiles')
        .select('*', { count: 'exact', head: true })
        .or('subscription_tier.neq.free,plan.neq.free');

      const totalNum = typeof totalUsers === 'number' ? totalUsers : 0;
      const paidNum = typeof paidUsers === 'number' ? paidUsers : 0;

      if (totalNum > 50 && paidNum > 0) {
        const paidRate = (paidNum / totalNum) * 100;
        if (paidRate < 5) {
          blockers.push({
            id: 'low_paid_conversion',
            title: 'Low Paid User Conversion',
            description: `Only ${paidRate.toFixed(1)}% of users are on paid plans. Consider improving pricing strategy or value proposition.`,
            severity: paidRate < 2 ? 'high' : 'medium',
            category: 'monetization',
          });
        }
      }
    } catch {}

    // Heuristic 4: Low deal room activity
    try {
      const { count: dealRooms } = await supabase
        .from('deal_rooms')
        .select('*', { count: 'exact', head: true })
        .eq('status', 'active');

      const { count: ndaCount } = await supabase
        .from('nda_signatures')
        .select('*', { count: 'exact', head: true })
        .gte('signed_at', new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString());

      const roomsNum = typeof dealRooms === 'number' ? dealRooms : 0;
      const ndaNum = typeof ndaCount === 'number' ? ndaCount : 0;

      if (ndaNum > 20 && roomsNum < ndaNum * 0.5) {
        blockers.push({
          id: 'low_deal_room_activity',
          title: 'Low Deal Room Activity',
          description: `Only ${roomsNum} active deal rooms from ${ndaNum} NDAs signed. Review deal room creation flow.`,
          severity: 'medium',
          category: 'engagement',
        });
      }
    } catch {}

    // Heuristic 5: Low listing quality (if we have verification data)
    try {
      const { count: totalListings } = await supabase
        .from('listings_v16')
        .select('*', { count: 'exact', head: true })
        .eq('status', 'active');

      const { count: verifiedListings } = await supabase
        .from('listings_v16')
        .select('*', { count: 'exact', head: true })
        .eq('status', 'active')
        .eq('is_ai_verified', true);

      const totalNum = typeof totalListings === 'number' ? totalListings : 0;
      const verifiedNum = typeof verifiedListings === 'number' ? verifiedListings : 0;

      if (totalNum > 10 && verifiedNum > 0) {
        const verifiedRate = (verifiedNum / totalNum) * 100;
        if (verifiedRate < 50) {
          blockers.push({
            id: 'low_listing_verification',
            title: 'Low Listing Verification Rate',
            description: `Only ${verifiedRate.toFixed(0)}% of active listings are verified. Improve listing quality standards.`,
            severity: verifiedRate < 30 ? 'high' : 'medium',
            category: 'engagement',
          });
        }
      }
    } catch {}

  } catch (error) {
    if (process.env.NODE_ENV === "development") {
      console.warn("[computeGrowthBlockers] Error:", error);
    }
  }

  // Sort by severity (high first) and return top 5
  return blockers
    .sort((a, b) => {
      const severityOrder = { high: 3, medium: 2, low: 1 };
      return severityOrder[b.severity] - severityOrder[a.severity];
    })
    .slice(0, 5);
}

