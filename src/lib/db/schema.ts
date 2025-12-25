// V16 table types (minimal)
export type V16Listing = {
  id: string;
  title: string;
  status: string;
  created_at: string;
};

export type V16ListingDetails = {
  id: string;
  listing_id: string;
  description: string;
  details_json: any;
};

export type V16Score = {
  id: string;
  listing_id: string;
  score: number;
  updated_at: string;
};
