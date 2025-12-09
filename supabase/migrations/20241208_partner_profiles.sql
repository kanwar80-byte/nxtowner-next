-- NxtOwner Partner Profiles Migration
-- Adds partner_profiles table for brokers, CPAs, lawyers, lenders, consultants

-- ============================================================================
-- PARTNER PROFILES TABLE
-- ============================================================================
create table if not exists public.partner_profiles (
  id uuid primary key default uuid_generate_v4(),
  profile_id uuid not null references public.profiles (id) on delete cascade,
  firm_name text not null,
  partner_type text not null check (partner_type in ('broker', 'cpa', 'lawyer', 'lender', 'consultant')),
  specialties text[] default '{}',
  regions text[] default '{}',
  years_experience int,
  website_url text,
  contact_email text not null,
  contact_phone text,
  bio text,
  is_featured boolean default false,
  status text not null default 'pending' check (status in ('pending', 'approved', 'rejected')),
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- Add unique constraint on profile_id (one partner profile per user)
alter table public.partner_profiles
  add constraint partner_profiles_profile_id_unique unique (profile_id);

-- Add indexes for performance
create index idx_partner_profiles_profile_id on public.partner_profiles(profile_id);
create index idx_partner_profiles_partner_type on public.partner_profiles(partner_type);
create index idx_partner_profiles_status on public.partner_profiles(status);
create index idx_partner_profiles_is_featured on public.partner_profiles(is_featured);

-- Enable RLS
alter table public.partner_profiles enable row level security;

-- ============================================================================
-- RLS POLICIES FOR PARTNER PROFILES
-- ============================================================================

-- Partners can read their own profile
create policy "partner_profiles_self_read"
  on public.partner_profiles for select
  using (profile_id = auth.uid());

-- Partners can insert their own profile (profile_id = auth.uid())
create policy "partner_profiles_self_insert"
  on public.partner_profiles for insert
  with check (profile_id = auth.uid());

-- Partners can update their own profile
create policy "partner_profiles_self_update"
  on public.partner_profiles for update
  using (profile_id = auth.uid())
  with check (profile_id = auth.uid());

-- Public can read ONLY approved partner profiles for directory
create policy "partner_profiles_public_directory"
  on public.partner_profiles for select
  using (status = 'approved');

-- Admins can read all partner profiles
create policy "partner_profiles_admin_read"
  on public.partner_profiles for select
  using (
    exists (
      select 1 from public.profiles
      where id = auth.uid() and role = 'admin'
    )
  );

-- Admins can update all partner profiles (for approval/rejection)
create policy "partner_profiles_admin_update"
  on public.partner_profiles for update
  using (
    exists (
      select 1 from public.profiles
      where id = auth.uid() and role = 'admin'
    )
  );

-- ============================================================================
-- TRIGGERS
-- ============================================================================

-- Apply updated_at trigger to partner_profiles
drop trigger if exists update_partner_profiles_updated_at on public.partner_profiles;
create trigger update_partner_profiles_updated_at
  before update on public.partner_profiles
  for each row execute function public.update_updated_at_column();

-- ============================================================================
-- CONSULTATION REQUESTS TABLE
-- ============================================================================
create table if not exists public.consultation_requests (
  id uuid primary key default uuid_generate_v4(),
  partner_profile_id uuid not null references public.partner_profiles(id) on delete cascade,
  requester_id uuid references auth.users on delete set null,
  requester_name text not null,
  requester_email text not null,
  requester_phone text,
  message text not null,
  listing_id uuid references public.listings(id) on delete set null,
  status text not null default 'pending' check (status in ('pending', 'contacted', 'completed', 'cancelled')),
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- Add indexes
create index idx_consultation_requests_partner on public.consultation_requests(partner_profile_id);
create index idx_consultation_requests_requester on public.consultation_requests(requester_id);
create index idx_consultation_requests_status on public.consultation_requests(status);

-- Enable RLS
alter table public.consultation_requests enable row level security;

-- ============================================================================
-- RLS POLICIES FOR CONSULTATION REQUESTS
-- ============================================================================

-- Partners can read consultation requests for their profile
create policy "consultation_requests_partner_read"
  on public.consultation_requests for select
  using (
    exists (
      select 1 from public.partner_profiles
      where id = consultation_requests.partner_profile_id and profile_id = auth.uid()
    )
  );

-- Partners can update status of their consultation requests
create policy "consultation_requests_partner_update"
  on public.consultation_requests for update
  using (
    exists (
      select 1 from public.partner_profiles
      where id = consultation_requests.partner_profile_id and profile_id = auth.uid()
    )
  );

-- Authenticated users can create consultation requests
create policy "consultation_requests_authenticated_insert"
  on public.consultation_requests for insert
  with check (auth.uid() = requester_id or auth.uid() is not null);

-- Requesters can read their own consultation requests
create policy "consultation_requests_requester_read"
  on public.consultation_requests for select
  using (auth.uid() = requester_id);

-- Admins can read all consultation requests
create policy "consultation_requests_admin_read"
  on public.consultation_requests for select
  using (
    exists (
      select 1 from public.profiles
      where id = auth.uid() and role = 'admin'
    )
  );

-- Apply updated_at trigger to consultation_requests
drop trigger if exists update_consultation_requests_updated_at on public.consultation_requests;
create trigger update_consultation_requests_updated_at
  before update on public.consultation_requests
  for each row execute function public.update_updated_at_column();
