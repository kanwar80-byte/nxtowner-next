-- Supabase Phase 2: seed RPC and RLS helpers
-- Run in Supabase SQL Editor or via supabase migration
-- Adjust column/table names if your schema differs.

-- Function: create_deal_room_with_nda
-- Creates a deal_room, members, NDA signature, and optional first message in one transaction.
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
begin
  insert into deal_rooms (id, listing_id, buyer_id, status, created_by)
  values (_room_id, _listing_id, _buyer_id, 'pending', _buyer_id);

  insert into deal_room_members (id, deal_room_id, user_id, role)
  values (gen_random_uuid(), _room_id, _buyer_id, 'buyer');

  insert into deal_room_members (id, deal_room_id, user_id, role)
  select gen_random_uuid(), _room_id, owner_id, 'seller'
  from listings
  where id = _listing_id
  on conflict do nothing;

  insert into nda_signatures (id, deal_room_id, listing_id, signer_id, signed_pdf_url, signed_at)
  values (gen_random_uuid(), _room_id, _listing_id, _buyer_id, _signed_pdf_url, now());

  if _initial_message is not null then
    insert into deal_messages (id, deal_room_id, sender_id, body)
    values (gen_random_uuid(), _room_id, _buyer_id, _initial_message);
  end if;

  return _room_id;
end;
$$;

-- Restrict RPC invocation: intended for service role only
alter function public.create_deal_room_with_nda owner to postgres;
revoke all on function public.create_deal_room_with_nda from public;

-- Baseline RLS helpers (modify if your schema differs)
-- Require room membership for messages
create policy if not exists "Members can read their room messages" on public.deal_messages
  for select using (exists (
    select 1 from public.deal_room_members m
    where m.deal_room_id = deal_messages.deal_room_id
      and m.user_id = auth.uid()
  ));

create policy if not exists "Members can send room messages" on public.deal_messages
  for insert with check (exists (
    select 1 from public.deal_room_members m
    where m.deal_room_id = deal_messages.deal_room_id
      and m.user_id = auth.uid()
  ));

-- Require membership to see or add documents (if you have deal_documents table)
-- Uncomment/adapt as needed
-- create policy if not exists "Members can read room documents" on public.deal_documents
--   for select using (exists (
--     select 1 from public.deal_room_members m
--     where m.deal_room_id = deal_documents.deal_room_id
--       and m.user_id = auth.uid()
--   ));
--
-- create policy if not exists "Members can add room documents" on public.deal_documents
--   for insert with check (exists (
--     select 1 from public.deal_room_members m
--     where m.deal_room_id = deal_documents.deal_room_id
--       and m.user_id = auth.uid()
--   ));

-- Realtime channel naming convention for deal_messages (reference):
--   deal_room:{room_id}:messages
-- Example filter: filter => `deal_room_id=eq.{room_id}`
