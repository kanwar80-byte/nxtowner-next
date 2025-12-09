-- NxtOwner Core Schema Migration
-- Run this in Supabase SQL Editor or via: supabase db push

-- Enable UUID extension
create extension if not exists "uuid-ossp";

-- ============================================================================
-- 1. PROFILES TABLE
-- ============================================================================
create table if not exists public.profiles (
  id uuid primary key references auth.users on delete cascade,
  full_name text,
  role text not null default 'buyer' check (role in ('buyer', 'seller', 'partner', 'admin')),
  plan text default 'free' check (plan in ('free', 'pro', 'enterprise')),
  avatar_url text,
  verification_status text default 'unverified' check (verification_status in ('unverified', 'pending', 'verified', 'rejected')),
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- RLS policies for profiles
alter table public.profiles enable row level security;

create policy "Users can read their own profile"
  on public.profiles for select
  using (auth.uid() = id);

create policy "Users can update their own profile"
  on public.profiles for update
  using (auth.uid() = id);

create policy "Admins can read all profiles"
  on public.profiles for select
  using (
    exists (
      select 1 from public.profiles
      where id = auth.uid() and role = 'admin'
    )
  );

-- ============================================================================
-- 2. LISTINGS TABLE
-- ============================================================================
create table if not exists public.listings (
  id uuid primary key default uuid_generate_v4(),
  owner_id uuid not null references auth.users on delete cascade,
  title text not null,
  description text,
  summary text,
  asking_price numeric,
  annual_revenue numeric,
  annual_cashflow numeric,
  category text,
  type text not null check (type in ('asset', 'digital')),
  status text not null default 'draft' check (
    status in ('draft', 'pending_review', 'active', 'under_nda', 'under_offer', 'closed')
  ),
  location text,
  country text,
  region text,
  is_verified boolean default false,
  metrics jsonb,
  meta jsonb,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

create index idx_listings_owner on public.listings(owner_id);
create index idx_listings_status on public.listings(status);
create index idx_listings_type on public.listings(type);

-- RLS policies for listings
alter table public.listings enable row level security;

create policy "Anyone can read active listings"
  on public.listings for select
  using (status = 'active');

create policy "Owners can read their own listings"
  on public.listings for select
  using (auth.uid() = owner_id);

create policy "Owners can create listings"
  on public.listings for insert
  with check (auth.uid() = owner_id);

create policy "Owners can update their own listings"
  on public.listings for update
  using (auth.uid() = owner_id);

create policy "Admins can read all listings"
  on public.listings for select
  using (
    exists (
      select 1 from public.profiles
      where id = auth.uid() and role = 'admin'
    )
  );

create policy "Admins can update all listings"
  on public.listings for update
  using (
    exists (
      select 1 from public.profiles
      where id = auth.uid() and role = 'admin'
    )
  );

-- ============================================================================
-- 3. WATCHLIST TABLE
-- ============================================================================
create table if not exists public.watchlist (
  id uuid primary key default uuid_generate_v4(),
  user_id uuid not null references auth.users on delete cascade,
  listing_id uuid not null references public.listings on delete cascade,
  created_at timestamptz default now(),
  unique(user_id, listing_id)
);

create index idx_watchlist_user on public.watchlist(user_id);
create index idx_watchlist_listing on public.watchlist(listing_id);

-- RLS policies for watchlist
alter table public.watchlist enable row level security;

create policy "Users can read their own watchlist"
  on public.watchlist for select
  using (auth.uid() = user_id);

create policy "Users can add to their watchlist"
  on public.watchlist for insert
  with check (auth.uid() = user_id);

create policy "Users can remove from their watchlist"
  on public.watchlist for delete
  using (auth.uid() = user_id);

-- ============================================================================
-- 4. NDAS TABLE
-- ============================================================================
create table if not exists public.ndas (
  id uuid primary key default uuid_generate_v4(),
  listing_id uuid not null references public.listings on delete cascade,
  buyer_id uuid not null references auth.users on delete cascade,
  status text not null default 'signed' check (status in ('signed', 'revoked')),
  signed_at timestamptz default now(),
  created_at timestamptz default now(),
  unique(listing_id, buyer_id)
);

create index idx_ndas_buyer on public.ndas(buyer_id);
create index idx_ndas_listing on public.ndas(listing_id);

-- RLS policies for ndas
alter table public.ndas enable row level security;

create policy "Buyers can read their own NDAs"
  on public.ndas for select
  using (auth.uid() = buyer_id);

create policy "Sellers can read NDAs for their listings"
  on public.ndas for select
  using (
    exists (
      select 1 from public.listings
      where id = ndas.listing_id and owner_id = auth.uid()
    )
  );

create policy "Buyers can create NDAs"
  on public.ndas for insert
  with check (auth.uid() = buyer_id);

-- ============================================================================
-- 5. DEAL ROOMS TABLE
-- ============================================================================
create table if not exists public.deal_rooms (
  id uuid primary key default uuid_generate_v4(),
  listing_id uuid not null references public.listings on delete cascade,
  buyer_id uuid not null references auth.users on delete cascade,
  status text not null default 'open' check (
    status in ('pending', 'open', 'under_offer', 'closed', 'abandoned')
  ),
  created_by uuid references auth.users,
  created_at timestamptz default now(),
  updated_at timestamptz default now(),
  unique(listing_id, buyer_id)
);

create index idx_deal_rooms_buyer on public.deal_rooms(buyer_id);
create index idx_deal_rooms_listing on public.deal_rooms(listing_id);

-- RLS policies for deal_rooms
alter table public.deal_rooms enable row level security;

create policy "Buyers can read their own deal rooms"
  on public.deal_rooms for select
  using (auth.uid() = buyer_id);

create policy "Sellers can read deal rooms for their listings"
  on public.deal_rooms for select
  using (
    exists (
      select 1 from public.listings
      where id = deal_rooms.listing_id and owner_id = auth.uid()
    )
  );

create policy "Admins can read all deal rooms"
  on public.deal_rooms for select
  using (
    exists (
      select 1 from public.profiles
      where id = auth.uid() and role = 'admin'
    )
  );

-- ============================================================================
-- 6. DEAL ROOM MEMBERS TABLE
-- ============================================================================
create table if not exists public.deal_room_members (
  id uuid primary key default uuid_generate_v4(),
  deal_room_id uuid not null references public.deal_rooms on delete cascade,
  user_id uuid not null references auth.users on delete cascade,
  role text not null check (role in ('buyer', 'seller', 'admin')),
  created_at timestamptz default now(),
  unique(deal_room_id, user_id)
);

create index idx_deal_room_members_room on public.deal_room_members(deal_room_id);
create index idx_deal_room_members_user on public.deal_room_members(user_id);

-- RLS policies for deal_room_members
alter table public.deal_room_members enable row level security;

create policy "Members can read their room memberships"
  on public.deal_room_members for select
  using (auth.uid() = user_id);

-- ============================================================================
-- 7. MESSAGES TABLE (renamed from deal_messages to messages)
-- ============================================================================
create table if not exists public.messages (
  id uuid primary key default uuid_generate_v4(),
  deal_room_id uuid not null references public.deal_rooms on delete cascade,
  sender_id uuid not null references auth.users on delete cascade,
  body text not null,
  created_at timestamptz default now()
);

create index idx_messages_room on public.messages(deal_room_id);
create index idx_messages_sender on public.messages(sender_id);

-- RLS policies for messages
alter table public.messages enable row level security;

create policy "Members can read their room messages"
  on public.messages for select
  using (
    exists (
      select 1 from public.deal_room_members
      where deal_room_id = messages.deal_room_id and user_id = auth.uid()
    )
  );

create policy "Members can send room messages"
  on public.messages for insert
  with check (
    auth.uid() = sender_id and
    exists (
      select 1 from public.deal_room_members
      where deal_room_id = messages.deal_room_id and user_id = auth.uid()
    )
  );

-- ============================================================================
-- 8. OFFERS TABLE
-- ============================================================================
create table if not exists public.offers (
  id uuid primary key default uuid_generate_v4(),
  deal_room_id uuid not null references public.deal_rooms on delete cascade,
  bidder_id uuid not null references auth.users on delete cascade,
  amount numeric not null,
  currency text default 'CAD',
  status text not null default 'pending' check (
    status in ('pending', 'accepted', 'rejected', 'withdrawn')
  ),
  notes text,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

create index idx_offers_room on public.offers(deal_room_id);
create index idx_offers_bidder on public.offers(bidder_id);

-- RLS policies for offers
alter table public.offers enable row level security;

create policy "Members can read room offers"
  on public.offers for select
  using (
    exists (
      select 1 from public.deal_room_members
      where deal_room_id = offers.deal_room_id and user_id = auth.uid()
    )
  );

create policy "Buyers can create offers in their rooms"
  on public.offers for insert
  with check (
    auth.uid() = bidder_id and
    exists (
      select 1 from public.deal_room_members
      where deal_room_id = offers.deal_room_id and user_id = auth.uid()
    )
  );

create policy "Bidders can update their own offers"
  on public.offers for update
  using (auth.uid() = bidder_id);

create policy "Sellers can update offers in their listing rooms"
  on public.offers for update
  using (
    exists (
      select 1 from public.deal_rooms dr
      join public.listings l on dr.listing_id = l.id
      where dr.id = offers.deal_room_id and l.owner_id = auth.uid()
    )
  );

-- ============================================================================
-- 9. NDA SIGNATURES TABLE (for the SQL helper function)
-- ============================================================================
create table if not exists public.nda_signatures (
  id uuid primary key default uuid_generate_v4(),
  deal_room_id uuid not null references public.deal_rooms on delete cascade,
  listing_id uuid not null references public.listings on delete cascade,
  signer_id uuid not null references auth.users on delete cascade,
  signed_pdf_url text,
  signed_at timestamptz default now(),
  created_at timestamptz default now()
);

create index idx_nda_signatures_room on public.nda_signatures(deal_room_id);
create index idx_nda_signatures_signer on public.nda_signatures(signer_id);

-- RLS policies for nda_signatures
alter table public.nda_signatures enable row level security;

create policy "Signers can read their own signatures"
  on public.nda_signatures for select
  using (auth.uid() = signer_id);

create policy "Sellers can read signatures for their listings"
  on public.nda_signatures for select
  using (
    exists (
      select 1 from public.listings
      where id = nda_signatures.listing_id and owner_id = auth.uid()
    )
  );

-- ============================================================================
-- 10. HELPER FUNCTIONS
-- ============================================================================

-- Updated trigger for updating updated_at timestamps
create or replace function public.update_updated_at_column()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

-- Apply updated_at triggers
drop trigger if exists update_profiles_updated_at on public.profiles;
create trigger update_profiles_updated_at
  before update on public.profiles
  for each row execute function public.update_updated_at_column();

drop trigger if exists update_listings_updated_at on public.listings;
create trigger update_listings_updated_at
  before update on public.listings
  for each row execute function public.update_updated_at_column();

drop trigger if exists update_deal_rooms_updated_at on public.deal_rooms;
create trigger update_deal_rooms_updated_at
  before update on public.deal_rooms
  for each row execute function public.update_updated_at_column();

drop trigger if exists update_offers_updated_at on public.offers;
create trigger update_offers_updated_at
  before update on public.offers
  for each row execute function public.update_updated_at_column();

-- ============================================================================
-- 11. SEED ADMIN USER (Optional - uncomment and update email)
-- ============================================================================
-- insert into public.profiles (id, full_name, role, verification_status)
-- values (
--   (select id from auth.users where email = 'admin@nxtowner.ca' limit 1),
--   'Admin User',
--   'admin',
--   'verified'
-- ) on conflict (id) do update set role = 'admin', verification_status = 'verified';
