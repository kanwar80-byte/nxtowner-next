import "server-only";

import { createClient } from '@/utils/supabase/server';
import type { SellerDashboardData } from '@/types/sellerDashboard';

/**
 * Repository for Seller Dashboard operations
 * 
 * TODO: Ensure the following tables/analytics exist:
 * - listings (user_id, id, title, asking_price, status, etc.)
 * - listing_analytics (views, saves, etc.)
 * - nda_requests (listing_id, user_id, status)
 * - ai_valuations (listing_id, low, mid, high)
 */

/**
 * Get seller dashboard data for authenticated user
 */
export async function getSellerDashboardData(
  userId: string
): Promise<SellerDashboardData | null> {
  const supabase = await createClient();
  
  // TODO: Implement actual database queries when tables exist
  // const { data: listings, error: listingsError } = await supabase
  //   .from('listings')
  //   .select('id, title, asking_price, status, created_at')
  //   .eq('user_id', userId)
  //   .in('status', ['draft', 'published', 'under_review']);
  //
  // if (listingsError) {
  //   console.error('Error fetching listings:', listingsError);
  //   return null;
  // }
  //
  // // Fetch analytics for each listing
  // const listingIds = listings.map(l => l.id);
  // const { data: analytics } = await supabase
  //   .from('listing_analytics')
  //   .select('listing_id, views_7d, views_30d, saves')
  //   .in('listing_id', listingIds);
  //
  // // Fetch NDA requests
  // const { data: ndaRequests } = await supabase
  //   .from('nda_requests')
  //   .select('listing_id, status')
  //   .in('listing_id', listingIds)
  //   .eq('status', 'pending');
  //
  // // Fetch AI valuations
  // const { data: valuations } = await supabase
  //   .from('ai_valuations')
  //   .select('listing_id, low, mid, high')
  //   .in('listing_id', listingIds);
  //
  // // Aggregate KPIs
  // const kpis = {
  //   views7d: analytics?.reduce((sum, a) => sum + (a.views_7d || 0), 0) || 0,
  //   views30d: analytics?.reduce((sum, a) => sum + (a.views_30d || 0), 0) || 0,
  //   saves: analytics?.reduce((sum, a) => sum + (a.saves || 0), 0) || 0,
  //   ndaRequests: ndaRequests?.length || 0,
  //   aiFitScore: 75, // Calculate from AI analysis
  // };
  
  // Mock data for skeleton implementation
  return {
    kpis: {
      views7d: 45,
      views30d: 182,
      saves: 12,
      ndaRequests: 3,
      aiFitScore: 78,
    },
    listings: [
      {
        id: "listing-1",
        title: "High-Margin Car Wash Portfolio",
        status: "published",
        askingPrice: 850000,
        health: {
          listingId: "listing-1",
          listingTitle: "High-Margin Car Wash Portfolio",
          healthScore: 85,
          issues: [],
          dataCompleteness: 90,
        },
        valuationBand: {
          listingId: "listing-1",
          low: 750000,
          mid: 825000,
          high: 900000,
          yourAsk: 850000,
          askVsValuation: "at",
        },
        dataCompleteness: {
          listingId: "listing-1",
          overall: 90,
          items: [
            { id: "financials", label: "Financial Statements", status: "complete", importance: "high" },
            { id: "lease", label: "Lease Agreement", status: "complete", importance: "high" },
            { id: "licenses", label: "Business Licenses", status: "complete", importance: "medium" },
            { id: "photos", label: "Photos (10+)", status: "partial", importance: "medium" },
          ],
        },
      },
      {
        id: "listing-2",
        title: "SaaS E-commerce Tool",
        status: "published",
        askingPrice: 450000,
        health: {
          listingId: "listing-2",
          listingTitle: "SaaS E-commerce Tool",
          healthScore: 72,
          issues: ["Missing lease documentation", "Only 3 photos"],
          dataCompleteness: 65,
        },
        valuationBand: {
          listingId: "listing-2",
          low: 400000,
          mid: 475000,
          high: 550000,
          yourAsk: 450000,
          askVsValuation: "below",
        },
        dataCompleteness: {
          listingId: "listing-2",
          overall: 65,
          items: [
            { id: "financials", label: "Financial Statements", status: "complete", importance: "high" },
            { id: "lease", label: "Lease Agreement", status: "missing", importance: "high" },
            { id: "licenses", label: "Business Licenses", status: "partial", importance: "medium" },
            { id: "photos", label: "Photos (10+)", status: "partial", importance: "medium" },
          ],
        },
      },
    ],
    buyerSignals: [
      {
        type: "comparing",
        label: "Buyers comparing you",
        count: 5,
        message: "5 buyers are comparing this listing with others",
        listingId: "listing-1",
      },
      {
        type: "pro_interest",
        label: "Interest from Pro buyers",
        count: 2,
        message: "2 verified professional buyers have shown interest",
        listingId: "listing-1",
      },
      {
        type: "price_sensitivity",
        label: "Price sensitivity",
        message: "Buyers are viewing similar listings priced 10-15% lower",
        listingId: "listing-2",
      },
    ],
  };
}
