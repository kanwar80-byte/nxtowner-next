-- NxtOwner Leads & CRM-lite Migration
-- Captures buyer interest on listings and partner consultation requests

-- ============================================================================
-- LISTING LEADS TABLE
-- ============================================================================
create table if not exists public.listing_leads (
  id uuid primary key default gen_random_uuid(),
  listing_id uuid not null references public.listings (id) on delete cascade,
  buyer_id uuid not null references public.profiles (id) on delete cascade,
  message text,
  status text not null default 'new' check (status in ('new', 'contacted', 'qualified', 'closed_lost', 'closed_won')),
  created_at timestamptz default now(),
  updated_at timestamptz default now(),
  unique(listing_id, buyer_id)
);

create index idx_listing_leads_listing on public.listing_leads(listing_id);
create index idx_listing_leads_buyer on public.listing_leads(buyer_id);
create index idx_listing_leads_status on public.listing_leads(status);
create index idx_listing_leads_created on public.listing_leads(created_at desc);

-- RLS policies for listing_leads
alter table public.listing_leads enable row level security;

-- Buyers: see their own leads
create policy "listing_leads_buyer_read"
  on public.listing_leads
  for select
  using (auth.uid() = buyer_id);

-- Buyers: can insert leads for themselves
create policy "listing_leads_buyer_insert"
  on public.listing_leads
  for insert
  with check (auth.uid() = buyer_id);

-- Sellers: see leads for their own listings
create policy "listing_leads_seller_read"
  on public.listing_leads
  for select
  using (
    exists (
      select 1
      from public.listings l
      where l.id = listing_leads.listing_id
        and l.owner_id = auth.uid()
    )
  );

-- Admin: read all via service role (no special policy needed).

-- ============================================================================
-- PARTNER LEADS TABLE
-- ============================================================================
create table if not exists public.partner_leads (
  id uuid primary key default gen_random_uuid(),
  partner_profile_id uuid not null references public.partner_profiles (id) on delete cascade,
  requester_profile_id uuid references public.profiles (id) on delete set null,
  requester_name text,
  requester_email text,
  requester_role text, -- 'buyer' | 'seller' | 'partner' | 'guest'
  message text,
  created_at timestamptz default now(),
  status text not null default 'new' -- 'new' | 'contacted' | 'closed'
);

alter table public.partner_leads
  enable row level security;

-- Requesters (authenticated): can see their own leads
create policy "partner_leads_requester_read"
  on public.partner_leads
  for select
  using (auth.uid() = requester_profile_id);

-- Anyone (including guests): can create leads
create policy "partner_leads_anyone_insert"
  on public.partner_leads
  for insert
  with check (true);

-- Partners: can read leads for their profile
create policy "partner_leads_partner_read"
  on public.partner_leads
  for select
  using (
    exists (
      select 1
      from public.partner_profiles pp
      where pp.id = partner_leads.partner_profile_id
        and pp.profile_id = auth.uid()
    )
  );

-- Partners: can update leads for their profile
create policy "partner_leads_partner_update"
  on public.partner_leads
  for update
  using (
    exists (
      select 1
      from public.partner_profiles pp
      where pp.id = partner_leads.partner_profile_id
        and pp.profile_id = auth.uid()
    )
  );

-- Admins: read all via service role (no special policy needed).

-- ============================================================================
-- HELPER FUNCTIONS
-- ============================================================================

-- Apply updated_at triggers
drop trigger if exists update_listing_leads_updated_at on public.listing_leads;
create trigger update_listing_leads_updated_at
  before update on public.listing_leads
  for each row execute function public.update_updated_at_column();
