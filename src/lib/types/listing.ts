export type Listing = {
  id: string;
  slug: string;
  title: string;
  asset_type: string | null;
  status: string;
  verification_level: number | null;
  is_verified?: boolean | null; // legacy
  is_ai_verified?: boolean | null; // legacy
  // ...add other fields as needed
};

export type ListingFinancials = {
  id: string;
  listing_id: string;
  revenue: number | null;
  profit: number | null;
  // ...add other fields as needed
};
