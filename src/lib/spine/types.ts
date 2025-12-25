export type Profile = {
  id: string;
  full_name: string | null;
  role_intent: string[];
  postal_code: string | null;
  city: string | null;
  province: string | null;
  country: string;
  created_at: string;
  updated_at: string;
  meta: Record<string, any>;
};

export type Listing = {
  id: string;
  owner_id: string;
  asset_type: 'operational' | 'digital';
  status: 'draft' | 'published' | 'paused' | 'archived';
  title: string;
  asking_price: number | null;
  currency: string;
  postal_code: string | null;
  city: string | null;
  province: string | null;
  country: string;
  category: string | null;
  subcategory: string | null;
  revenue_annual: number | null;
  cashflow_annual: number | null;
  ebitda_annual: number | null;
  verification: Record<string, any>;
  meta: Record<string, any>;
  created_at: string;
  updated_at: string;
};

export type Nda = {
  id: string;
  listing_id: string;
  buyer_id: string;
  status: 'requested' | 'signed' | 'revoked';
  signed_at: string | null;
  created_at: string;
  updated_at: string;
};

export type DealRoom = {
  id: string;
  listing_id: string;
  buyer_id: string;
  stage: string;
  is_active: boolean;
  opened_at: string;
  closed_at: string | null;
  created_at: string;
  updated_at: string;
};

export type Event = {
  id: string;
  deal_room_id: string;
  listing_id: string;
  actor_id: string;
  type: string;
  payload: Record<string, any>;
  created_at: string;
};

export type Score = {
  id: string;
  entity_type: string;
  entity_id: string;
  scope: string;
  score_key: string;
  score_value: number;
  breakdown: Record<string, any>;
  updated_at: string;
};
