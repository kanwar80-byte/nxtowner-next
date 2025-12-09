# Supabase Phase 2 Helpers

This document adds: (a) a seed RPC helper to create a deal room with an NDA in one call, and (b) a consistent Realtime channel naming convention for `deal_messages`.

## 1) Seed RPC: `create_deal_room_with_nda`

Create this function in the Supabase SQL editor. It wires a deal room, NDA record, members, and an optional first message in one transaction.

```sql
-- Dependencies: tables deal_rooms, nda_signatures, deal_room_members, deal_messages, listings (with owner_id)
-- Adjust column names to match your schema if they differ.

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
  -- Create room
  insert into deal_rooms (id, listing_id, buyer_id, status, created_by)
  values (_room_id, _listing_id, _buyer_id, 'pending', _buyer_id);

  -- Add buyer as member
  insert into deal_room_members (id, deal_room_id, user_id, role)
  values (gen_random_uuid(), _room_id, _buyer_id, 'buyer');

  -- Add seller (listing owner) as member if available
  insert into deal_room_members (id, deal_room_id, user_id, role)
  select gen_random_uuid(), _room_id, owner_id, 'seller'
  from listings
  where id = _listing_id
  on conflict do nothing;

  -- Record NDA signature
  insert into nda_signatures (id, deal_room_id, listing_id, signer_id, signed_pdf_url, signed_at)
  values (gen_random_uuid(), _room_id, _listing_id, _buyer_id, _signed_pdf_url, now());

  -- Optional first message
  if _initial_message is not null then
    insert into deal_messages (id, deal_room_id, sender_id, body)
    values (gen_random_uuid(), _room_id, _buyer_id, _initial_message);
  end if;

  return _room_id;
end;
$$;

-- Permission: only service role should call this; do NOT expose to anon.
alter function public.create_deal_room_with_nda owner to postgres;
```

Usage (server-side / service key):

```ts
const { data, error } = await supabase
  .rpc('create_deal_room_with_nda', {
    _listing_id: '...',
    _buyer_id: '...',
    _signed_pdf_url: 'https://.../signed-nda.pdf',
    _initial_message: 'Excited to discuss this deal.'
  });
```

## 2) Realtime channel naming for `deal_messages`

Use per-room channel names so authorization stays simple and fan-out is contained. Convention:

- `deal_room:{room_id}:messages` for chat.
- `deal_room:{room_id}:documents` if you later broadcast document uploads/updates.

Example subscription for messages:

```ts
const roomId = '...';
const channel = supabase.channel(`deal_room:${roomId}:messages`);

channel
  .on(
    'postgres_changes',
    { event: '*', schema: 'public', table: 'deal_messages', filter: `deal_room_id=eq.${roomId}` },
    (payload) => {
      // handle insert/update/delete
    }
  )
  .subscribe();
```

RLS reminder: ensure `deal_messages` policies require membership in the room. Example policy shape (adapt as needed):

```sql
create policy "Members can read their room messages" on public.deal_messages
  for select using (exists (
    select 1 from public.deal_room_members m
    where m.deal_room_id = deal_messages.deal_room_id
      and m.user_id = auth.uid()
  ));
```

Keep channel names stable; never expose other users' room IDs in a shared channel.
