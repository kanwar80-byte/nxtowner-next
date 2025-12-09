-- NxtOwner Subscriptions Migration
-- Adds Stripe integration fields to profiles table

-- Add subscription fields to profiles
alter table public.profiles
  add column if not exists stripe_customer_id text,
  add column if not exists stripe_subscription_id text,
  add column if not exists plan_renews_at timestamptz;

-- Create index for faster lookups
create index if not exists idx_profiles_stripe_customer on public.profiles(stripe_customer_id);
create index if not exists idx_profiles_stripe_subscription on public.profiles(stripe_subscription_id);

-- Add comment documenting the subscription fields
comment on column public.profiles.stripe_customer_id is 'Stripe customer ID for this user';
comment on column public.profiles.stripe_subscription_id is 'Active Stripe subscription ID (if on paid plan)';
comment on column public.profiles.plan_renews_at is 'Date when current subscription plan renews';
