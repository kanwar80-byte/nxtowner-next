/**
 * Shared types for public marketplace listings
 * Used by /browse and /listing/[id] pages
 */

export type PublicListing = {
  id: string;
  title: string;
  summary: string | null;
  type: 'asset' | 'digital';
  status: 'draft' | 'active' | 'under_offer' | 'closed';
  asking_price: number | null;
  annual_revenue: number | null;
  annual_cashflow: number | null;
  country: string | null;
  region: string | null;
  is_verified: boolean;
  created_at: string;
  updated_at: string;
  meta: Record<string, unknown> | null;
};
