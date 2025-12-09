alter table public.profiles
  add column if not exists stripe_customer_id text,
  add column if not exists stripe_subscription_id text,
  add column if not exists plan_expires_at timestamptz;

-- plan already exists in most builds; if not:
-- alter table public.profiles add column if not exists plan text not null default 'free';
