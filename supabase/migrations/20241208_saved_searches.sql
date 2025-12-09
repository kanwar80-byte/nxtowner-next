create table if not exists public.saved_searches (
  id uuid primary key default gen_random_uuid(),
  buyer_id uuid not null references public.profiles (id) on delete cascade,
  name text not null,
  filters jsonb not null,
  created_at timestamptz default now(),
  last_checked_at timestamptz,
  last_match_count int default 0
);

alter table public.saved_searches
  enable row level security;
