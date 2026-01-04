-- Migration: Create deal_room_with_nda RPC function and required tables
-- Date: 2025-12-30
-- Purpose: Fix runtime error "Could not find the function public.create_deal_room_with_nda"

-- ============================================================================
-- 1. CREATE TABLES (idempotent with IF NOT EXISTS)
-- ============================================================================

-- Deal Rooms table
create table if not exists public.deal_rooms (
  id uuid primary key default gen_random_uuid(),
  listing_id uuid not null,
  created_by uuid not null references auth.users on delete cascade,
  created_at timestamptz default now(),
  status text default 'active',
  constraint deal_rooms_listing_fk foreign key (listing_id) references public.listings_v16(id) on delete cascade
);

-- Deal Room Members table
create table if not exists public.deal_room_members (
  deal_room_id uuid not null references public.deal_rooms(id) on delete cascade,
  user_id uuid not null references auth.users on delete cascade,
  role text default 'buyer',
  created_at timestamptz default now(),
  primary key (deal_room_id, user_id)
);

-- Signed NDAs table
create table if not exists public.signed_ndas (
  id uuid primary key default gen_random_uuid(),
  listing_id uuid not null,
  user_id uuid not null references auth.users on delete cascade,
  signed_at timestamptz default now(),
  unique(listing_id, user_id),
  constraint signed_ndas_listing_fk foreign key (listing_id) references public.listings_v16(id) on delete cascade
);

-- ============================================================================
-- 2. CREATE INDEXES
-- ============================================================================

create index if not exists idx_deal_rooms_listing on public.deal_rooms(listing_id);
create index if not exists idx_deal_rooms_created_by on public.deal_rooms(created_by);
create index if not exists idx_deal_room_members_room on public.deal_room_members(deal_room_id);
create index if not exists idx_deal_room_members_user on public.deal_room_members(user_id);
create index if not exists idx_signed_ndas_listing on public.signed_ndas(listing_id);
create index if not exists idx_signed_ndas_user on public.signed_ndas(user_id);

-- ============================================================================
-- 3. ENABLE RLS
-- ============================================================================

alter table public.deal_rooms enable row level security;
alter table public.deal_room_members enable row level security;
alter table public.signed_ndas enable row level security;

-- ============================================================================
-- 4. CREATE RLS POLICIES
-- ============================================================================

-- Signed NDAs policies
do $$
begin
  if not exists (
    select 1 from pg_policies 
    where schemaname = 'public' 
    and tablename = 'signed_ndas' 
    and policyname = 'signed_ndas_insert_own'
  ) then
    create policy "signed_ndas_insert_own"
      on public.signed_ndas
      for insert
      to authenticated
      with check (user_id = auth.uid());
  end if;
end $$;

do $$
begin
  if not exists (
    select 1 from pg_policies 
    where schemaname = 'public' 
    and tablename = 'signed_ndas' 
    and policyname = 'signed_ndas_select_own'
  ) then
    create policy "signed_ndas_select_own"
      on public.signed_ndas
      for select
      to authenticated
      using (user_id = auth.uid());
  end if;
end $$;

-- Deal Rooms policies
do $$
begin
  if not exists (
    select 1 from pg_policies 
    where schemaname = 'public' 
    and tablename = 'deal_rooms' 
    and policyname = 'deal_rooms_select_members'
  ) then
    create policy "deal_rooms_select_members"
      on public.deal_rooms
      for select
      to authenticated
      using (
        exists (
          select 1 from public.deal_room_members
          where deal_room_id = deal_rooms.id
          and user_id = auth.uid()
        )
      );
  end if;
end $$;

-- Deal Room Members policies
do $$
begin
  if not exists (
    select 1 from pg_policies 
    where schemaname = 'public' 
    and tablename = 'deal_room_members' 
    and policyname = 'deal_room_members_select_own'
  ) then
    create policy "deal_room_members_select_own"
      on public.deal_room_members
      for select
      to authenticated
      using (user_id = auth.uid());
  end if;
end $$;

-- ============================================================================
-- 5. CREATE RPC FUNCTION
-- ============================================================================
-- Note: Function signature matches error message: (_buyer_id, _initial_message, _listing_id)
-- The code calls with (_listing_id, _buyer_id, _signed_pdf_url, _initial_message)
-- We create overloaded versions to support both call patterns

-- Version 1: Match the error message signature (3 params)
create or replace function public.create_deal_room_with_nda(
  _buyer_id uuid,
  _initial_message text,
  _listing_id uuid
) returns uuid
language plpgsql
security definer
set search_path = public
as $$
declare
  _room_id uuid := gen_random_uuid();
begin
  -- Security check: require _buyer_id = auth.uid()
  if _buyer_id != auth.uid() then
    raise exception 'Buyer ID must match authenticated user';
  end if;

  -- Create deal room with initial status 'nda_requested'
  insert into public.deal_rooms (id, listing_id, created_by, status)
  values (_room_id, _listing_id, _buyer_id, 'nda_requested');

  -- Insert buyer as member
  insert into public.deal_room_members (deal_room_id, user_id, role)
  values (_room_id, _buyer_id, 'buyer')
  on conflict (deal_room_id, user_id) do nothing;

  -- Optional: Store initial message if messages table exists
  -- (Commented out for now as per requirements - do NOT require messages table)
  -- if _initial_message is not null then
  --   insert into public.messages (deal_room_id, sender_id, body)
  --   values (_room_id, _buyer_id, _initial_message);
  -- end if;

  return _room_id;
end;
$$;

-- Version 2: Match the code's call signature (4 params with _signed_pdf_url)
create or replace function public.create_deal_room_with_nda(
  _listing_id uuid,
  _buyer_id uuid,
  _signed_pdf_url text default null,
  _initial_message text default null
) returns uuid
language plpgsql
security definer
set search_path = public
as $$
declare
  _room_id uuid;
  _existing_room_id uuid;
  _final_status text;
begin
  -- Security check: require _buyer_id = auth.uid()
  if _buyer_id != auth.uid() then
    raise exception 'Buyer ID must match authenticated user';
  end if;

  -- Determine status based on whether NDA is being signed
  if _signed_pdf_url is not null and _signed_pdf_url != '' then
    _final_status := 'nda_signed';
  else
    _final_status := 'nda_requested';
  end if;

  -- Check if deal room already exists for this listing and buyer
  select id into _existing_room_id
  from public.deal_rooms
  where listing_id = _listing_id
    and created_by = _buyer_id
  limit 1;

  if _existing_room_id is not null then
    -- Update existing deal room status
    update public.deal_rooms
    set status = _final_status
    where id = _existing_room_id;
    _room_id := _existing_room_id;
  else
    -- Create new deal room with appropriate status
    _room_id := gen_random_uuid();
    insert into public.deal_rooms (id, listing_id, created_by, status)
    values (_room_id, _listing_id, _buyer_id, _final_status);
  end if;

  -- Upsert NDA record (insert or update signed_at if exists)
  -- Only create/update signed_ndas if _signed_pdf_url is provided
  if _signed_pdf_url is not null and _signed_pdf_url != '' then
    insert into public.signed_ndas (listing_id, user_id, signed_at)
    values (_listing_id, _buyer_id, now())
    on conflict (listing_id, user_id) 
    do update set signed_at = now();
  end if;

  -- Insert buyer as member
  insert into public.deal_room_members (deal_room_id, user_id, role)
  values (_room_id, _buyer_id, 'buyer')
  on conflict (deal_room_id, user_id) do nothing;

  -- Optional: Store initial message if messages table exists
  -- (Commented out for now as per requirements - do NOT require messages table)
  -- if _initial_message is not null then
  --   insert into public.messages (deal_room_id, sender_id, body)
  --   values (_room_id, _buyer_id, _initial_message);
  -- end if;

  return _room_id;
end;
$$;

-- ============================================================================
-- 6. SET FUNCTION PERMISSIONS
-- ============================================================================

-- Revoke all permissions from public for both function signatures
revoke all on function public.create_deal_room_with_nda(uuid, text, uuid) from public;
revoke all on function public.create_deal_room_with_nda(uuid, uuid, text, text) from public;
revoke all on function public.create_deal_room_with_nda(uuid, uuid, text default null, text default null) from public;

-- Grant execute to authenticated users for both signatures
grant execute on function public.create_deal_room_with_nda(uuid, text, uuid) to authenticated;
grant execute on function public.create_deal_room_with_nda(uuid, uuid, text default null, text default null) to authenticated;

-- Set owner to postgres (for SECURITY DEFINER)
alter function public.create_deal_room_with_nda(uuid, text, uuid) owner to postgres;
alter function public.create_deal_room_with_nda(uuid, uuid, text default null, text default null) owner to postgres;

