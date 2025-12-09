create table if not exists public.articles (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique,
  title text not null,
  excerpt text,
  content text not null,
  status text not null default 'draft', -- 'draft' | 'published'
  category text, -- e.g. 'Buying', 'Selling', 'Valuation', 'Financing'
  reading_time_minutes int,
  published_at timestamptz,
  author_id uuid references public.profiles (id) on delete set null,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

alter table public.articles
  enable row level security;
create policy "articles_public_read_published"
  on public.articles
  for select
  using (status = 'published');
