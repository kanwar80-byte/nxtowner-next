-- V17 Onboarding Foundation: Add non-breaking columns to profiles table
-- This migration is safe to run on existing data

ALTER TABLE public.profiles
  ADD COLUMN IF NOT EXISTS roles text[] NULL,
  ADD COLUMN IF NOT EXISTS preferred_track text NULL DEFAULT 'all',
  ADD COLUMN IF NOT EXISTS onboarding_status text NULL DEFAULT 'new',
  ADD COLUMN IF NOT EXISTS onboarding_step text NULL DEFAULT 'role',
  ADD COLUMN IF NOT EXISTS profile_meta jsonb NULL DEFAULT '{}'::jsonb;

-- Optional: Add CHECK constraint for preferred_track
ALTER TABLE public.profiles
  DROP CONSTRAINT IF EXISTS profiles_preferred_track_check;

ALTER TABLE public.profiles
  ADD CONSTRAINT profiles_preferred_track_check 
  CHECK (preferred_track IS NULL OR preferred_track IN ('all', 'operational', 'digital'));

-- Create index for common queries
CREATE INDEX IF NOT EXISTS idx_profiles_onboarding_status ON public.profiles(onboarding_status);
CREATE INDEX IF NOT EXISTS idx_profiles_roles ON public.profiles USING GIN(roles);

-- Comment on columns
COMMENT ON COLUMN public.profiles.roles IS 'Array of user roles (buyer, seller, partner). Supports multi-role users.';
COMMENT ON COLUMN public.profiles.preferred_track IS 'User preferred track: all, operational, or digital';
COMMENT ON COLUMN public.profiles.onboarding_status IS 'Onboarding completion status: new, in_progress, completed';
COMMENT ON COLUMN public.profiles.onboarding_step IS 'Current onboarding step: role, track, profile, done';
COMMENT ON COLUMN public.profiles.profile_meta IS 'Additional profile metadata as JSONB';




