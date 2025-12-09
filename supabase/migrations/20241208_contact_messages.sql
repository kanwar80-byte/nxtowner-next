create table if not exists public.contact_messages (
  id uuid primary key default gen_random_uuid(),
  profile_id uuid references public.profiles (id) on delete set null,
  name text not null,
  email text not null,
  topic text not null constraint contact_messages_topic_check check (topic in ('support', 'sales', 'partnership', 'other')),
  subject text,
  message text not null,
  created_at timestamptz default now(),
  status text not null default 'new' constraint contact_messages_status_check check (status in ('new', 'read', 'archived'))
);

alter table public.contact_messages
  enable row level security;

create policy "Allow anyone to submit contact messages"
  on public.contact_messages
  for insert
  using (true)
  with check (true);

create index if not exists contact_messages_created_at_idx on public.contact_messages (created_at desc);
create index if not exists contact_messages_status_idx on public.contact_messages (status);
