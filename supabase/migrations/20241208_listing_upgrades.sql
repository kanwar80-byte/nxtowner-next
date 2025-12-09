-- NxtOwner Listing Upgrades Migration
-- Adds featured and AI-verified flags to listings for premium visibility

-- Add upgrade flags to listings
alter table public.listings
  add column if not exists is_featured boolean default false,
  add column if not exists is_ai_verified boolean default false,
  add column if not exists featured_until timestamptz,
  add column if not exists ai_verified_at timestamptz;

-- Create indexes for faster filtering
create index if not exists idx_listings_is_featured on public.listings(is_featured);
create index if not exists idx_listings_is_ai_verified on public.listings(is_ai_verified);
create index if not exists idx_listings_featured_until on public.listings(featured_until) where is_featured = true;

-- Add comments documenting the new fields
comment on column public.listings.is_featured is 'Whether listing is featured for premium placement';
comment on column public.listings.is_ai_verified is 'Whether listing has been AI-verified for trust';
comment on column public.listings.featured_until is 'Timestamp when featured status expires';
comment on column public.listings.ai_verified_at is 'Timestamp when listing was AI-verified';
