export interface Listing {
  id: string;
  owner_id: string; // references auth.users
  title: string;
  description: string | null;
  summary: string | null;
  asking_price: number | null;
  annual_revenue: number | null;
  annual_cashflow: number | null;
  category: string | null;
  type: ListingType; // Ensure you have ListingType defined above or imported
  status: ListingStatus; // Ensure you have ListingStatus defined above or imported
  location: string | null;
  country: string | null;
  region: string | null;
  is_verified: boolean;
  is_featured: boolean;
  is_ai_verified: boolean;
  featured_until: string | null;
  ai_verified_at: string | null;
  metrics: Record<string, unknown> | null;
  meta: Record<string, unknown> | null;
  created_at: string;
  updated_at: string;
  // --- NEW FIELDS ADDED BELOW ---
  nxt_score: number | null;       // 0-100 score for financial health
  has_deal_room: boolean;         // Whether the listing has an active data room
}