-- V16 Deal OS Core Spine Migration

-- Enums
CREATE TYPE asset_type AS ENUM ('operational', 'digital');
CREATE TYPE listing_status AS ENUM ('draft', 'published', 'paused', 'archived');
CREATE TYPE nda_status AS ENUM ('requested', 'signed', 'revoked');
CREATE TYPE deal_stage AS ENUM ('discover', 'interest', 'nda', 'deal_room', 'due_diligence', 'negotiation', 'closing', 'post_close');
CREATE TYPE event_type AS ENUM (
  'listing_created', 'listing_published', 'nda_requested', 'nda_signed', 'deal_room_created',
  'doc_uploaded', 'note_added', 'message_sent', 'stage_changed', 'score_updated',
  'deal_closed', 'deal_paused'
);

-- Tables
CREATE TABLE profiles (
  id uuid PRIMARY KEY REFERENCES auth.users(id),
  full_name text,
  role_intent text[] DEFAULT '{}',
  postal_code text,
  city text,
  province text,
  country text DEFAULT 'CA',
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  meta jsonb DEFAULT '{}'::jsonb
);

CREATE TABLE listings (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  owner_id uuid REFERENCES profiles(id),
  asset_type asset_type NOT NULL,
  status listing_status DEFAULT 'draft',
  title text NOT NULL,
  asking_price numeric,
  currency text DEFAULT 'CAD',
  postal_code text,
  city text,
  province text,
  country text DEFAULT 'CA',
  category text,
  subcategory text,
  revenue_annual numeric,
  cashflow_annual numeric,
  ebitda_annual numeric,
  verification jsonb DEFAULT '{}'::jsonb,
  meta jsonb DEFAULT '{}'::jsonb,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

CREATE TABLE ndas (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  listing_id uuid REFERENCES listings(id) ON DELETE CASCADE,
  buyer_id uuid REFERENCES profiles(id) ON DELETE CASCADE,
  status nda_status DEFAULT 'requested',
  signed_at timestamptz,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  UNIQUE(listing_id, buyer_id)
);

CREATE TABLE deal_rooms (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  listing_id uuid REFERENCES listings(id) ON DELETE CASCADE,
  buyer_id uuid REFERENCES profiles(id) ON DELETE CASCADE,
  stage deal_stage DEFAULT 'deal_room',
  is_active boolean DEFAULT true,
  opened_at timestamptz DEFAULT now(),
  closed_at timestamptz,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  UNIQUE(listing_id, buyer_id)
);

CREATE TABLE events (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  deal_room_id uuid REFERENCES deal_rooms(id) ON DELETE CASCADE,
  listing_id uuid REFERENCES listings(id) ON DELETE CASCADE,
  actor_id uuid REFERENCES profiles(id),
  type event_type NOT NULL,
  payload jsonb DEFAULT '{}'::jsonb,
  created_at timestamptz DEFAULT now()
);

CREATE TABLE scores (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  entity_type text NOT NULL,
  entity_id uuid NOT NULL,
  scope text NOT NULL DEFAULT 'private',
  score_key text NOT NULL,
  score_value numeric NOT NULL DEFAULT 0,
  breakdown jsonb DEFAULT '{}'::jsonb,
  updated_at timestamptz DEFAULT now(),
  UNIQUE(entity_type, entity_id, scope, score_key)
);

-- RLS
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE listings ENABLE ROW LEVEL SECURITY;
ALTER TABLE ndas ENABLE ROW LEVEL SECURITY;
ALTER TABLE deal_rooms ENABLE ROW LEVEL SECURITY;
ALTER TABLE events ENABLE ROW LEVEL SECURITY;
ALTER TABLE scores ENABLE ROW LEVEL SECURITY;

-- Profiles RLS
CREATE POLICY select_own_profile ON profiles FOR SELECT USING (id = auth.uid());
CREATE POLICY update_own_profile ON profiles FOR UPDATE USING (id = auth.uid());

-- Listings RLS
CREATE POLICY select_published_listings ON listings FOR SELECT USING (status = 'published' OR owner_id = auth.uid());
CREATE POLICY update_own_listings ON listings FOR UPDATE USING (owner_id = auth.uid());

-- NDAs RLS
CREATE POLICY select_own_ndas ON ndas FOR SELECT USING (buyer_id = auth.uid() OR listing_id IN (SELECT id FROM listings WHERE owner_id = auth.uid()));
CREATE POLICY insert_own_ndas ON ndas FOR INSERT WITH CHECK (buyer_id = auth.uid());
CREATE POLICY update_own_ndas ON ndas FOR UPDATE USING (buyer_id = auth.uid());

-- Deal Rooms RLS
CREATE POLICY select_own_deal_rooms ON deal_rooms FOR SELECT USING (buyer_id = auth.uid() OR listing_id IN (SELECT id FROM listings WHERE owner_id = auth.uid()));

-- Events RLS
CREATE POLICY select_own_events ON events FOR SELECT USING (
  deal_room_id IN (SELECT id FROM deal_rooms WHERE buyer_id = auth.uid() OR listing_id IN (SELECT id FROM listings WHERE owner_id = auth.uid()))
);
CREATE POLICY insert_own_events ON events FOR INSERT WITH CHECK (
  actor_id = auth.uid()
);

-- Scores RLS
CREATE POLICY select_own_scores ON scores FOR SELECT USING (
  (entity_type = 'profile' AND entity_id = auth.uid()) OR
  (entity_type = 'listing' AND entity_id IN (SELECT id FROM listings WHERE owner_id = auth.uid())) OR
  (entity_type = 'deal_room' AND entity_id IN (SELECT id FROM deal_rooms WHERE buyer_id = auth.uid() OR listing_id IN (SELECT id FROM listings WHERE owner_id = auth.uid())))
);

-- Triggers for updated_at
CREATE OR REPLACE FUNCTION set_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER set_profiles_updated_at BEFORE UPDATE ON profiles FOR EACH ROW EXECUTE FUNCTION set_updated_at();
CREATE TRIGGER set_listings_updated_at BEFORE UPDATE ON listings FOR EACH ROW EXECUTE FUNCTION set_updated_at();
CREATE TRIGGER set_ndas_updated_at BEFORE UPDATE ON ndas FOR EACH ROW EXECUTE FUNCTION set_updated_at();
CREATE TRIGGER set_deal_rooms_updated_at BEFORE UPDATE ON deal_rooms FOR EACH ROW EXECUTE FUNCTION set_updated_at();
