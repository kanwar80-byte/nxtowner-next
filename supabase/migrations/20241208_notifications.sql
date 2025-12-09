create table if not exists public.notifications (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.profiles (id) on delete cascade,
  type text not null, -- 'listing_lead' | 'partner_lead' | 'deal_room_created' | 'saved_search' | 'system'
  title text not null,
  body text,
  listing_id uuid references public.listings (id) on delete set null,
  deal_room_id uuid references public.deal_rooms (id) on delete set null,
  saved_search_id uuid references public.saved_searches (id) on delete set null,
  is_read boolean not null default false,
  created_at timestamptz default now()
);

alter table public.notifications
  enable row level security;

create policy "notifications_user_read"
  on public.notifications
  for select
  using (auth.uid() = user_id);

create policy "notifications_user_update"
  on public.notifications
  for update
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);
