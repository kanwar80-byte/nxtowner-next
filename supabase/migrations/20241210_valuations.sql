create table if not exists public.valuations (
  id uuid primary key default gen_random_uuid(),
  profile_id uuid references public.profiles (id) on delete set null,
  listing_id uuid references public.listings (id) on delete set null,
  asset_type text not null, -- 'physical' | 'digital'
  business_type text,       -- 'gas_station', 'qsr', 'saas', 'ecommerce', etc.
  title text not null,
  country text,
  region text,
  annual_revenue numeric,
  annual_profit numeric,
  asking_price numeric,
  key_metrics jsonb,        -- e.g., { "fuel_volume_lpy": 4500000, "wash_revenue": 600000, "mrr": 20000, ... }
  notes text,               -- freeform owner notes/context
  ai_input_summary text,    -- what we sent to AI (short summary)
  ai_output_range_min numeric,
  ai_output_range_max numeric,
  ai_output_currency text default 'CAD',
  ai_output_multiples jsonb, -- e.g., { "revenue_multiple": 2.5, "profit_multiple": 4.0 }
  ai_output_narrative text, -- explanation from AI in human language
  status text not null default 'completed', -- 'queued' | 'running' | 'completed' | 'failed'
  error_message text,
  created_at timestamptz default now()
);

alter table public.valuations
  enable row level security;

create policy "valuations_owner_read"
  on public.valuations
  for select
  using (auth.uid() = profile_id);

create policy "valuations_owner_insert"
  on public.valuations
  for insert
  with check (auth.uid() = profile_id);
