-- Fix deal_room_members RLS and add transactional helper for NDA -> Deal Room
-- Run this in Supabase SQL Editor or via: supabase db push

-- Allow membership inserts by the authenticated user
drop policy if exists "deal_room_members_insert_self" on public.deal_room_members;
create policy "deal_room_members_insert_self"
  on public.deal_room_members
  for insert
  with check (auth.uid() = user_id);

-- Allow select for members, listing owners (sellers), or admins
-- Note: references public.profiles.role = 'admin'
drop policy if exists "deal_room_members_select_allowed" on public.deal_room_members;
create policy "deal_room_members_select_allowed"
  on public.deal_room_members
  for select
  using (
    auth.uid() = user_id
    or exists (
      select 1
      from public.deal_rooms dr
      join public.listings l on l.id = dr.listing_id
      left join public.profiles p on p.id = auth.uid()
      where dr.id = deal_room_members.deal_room_id
        and (l.owner_id = auth.uid() or p.role = 'admin')
    )
  );

-- Helper function: create deal room, memberships, NDA signature, optional first message
-- Uses current tables: deal_rooms, deal_room_members, nda_signatures, messages
create or replace function public.create_deal_room_with_nda(
  _listing_id uuid,
  _buyer_id uuid,
  _signed_pdf_url text,
  _initial_message text default null
) returns uuid
language plpgsql
security definer
set search_path = public
as $$
declare
  _room_id uuid := gen_random_uuid();
  _seller_id uuid;
begin
  select owner_id into _seller_id from listings where id = _listing_id;

  insert into deal_rooms (id, listing_id, buyer_id, status, created_by)
  values (_room_id, _listing_id, _buyer_id, 'pending', _buyer_id);

  insert into deal_room_members (id, deal_room_id, user_id, role)
  values (gen_random_uuid(), _room_id, _buyer_id, 'buyer');

  if _seller_id is not null then
    insert into deal_room_members (id, deal_room_id, user_id, role)
    values (gen_random_uuid(), _room_id, _seller_id, 'seller')
    on conflict do nothing;
  end if;

  insert into nda_signatures (id, deal_room_id, listing_id, signer_id, signed_pdf_url, signed_at)
  values (gen_random_uuid(), _room_id, _listing_id, _buyer_id, _signed_pdf_url, now());

  if _initial_message is not null then
    insert into messages (id, deal_room_id, sender_id, body)
    values (gen_random_uuid(), _room_id, _buyer_id, _initial_message);
  end if;

  return _room_id;
end;
$$;

-- Restrict public invocation; intended for service role
alter function public.create_deal_room_with_nda owner to postgres;
revoke all on function public.create_deal_room_with_nda from public;
