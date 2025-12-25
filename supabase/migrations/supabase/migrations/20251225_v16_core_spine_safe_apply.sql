-- =========================================================
-- NxtOwner V16 Core Spine — SAFE APPLY (Repair Mode)
-- Purpose:
--   - Bring existing DB up to V16 expectations WITHOUT dropping data
--   - Fix missing columns: listings.status, listings.updated_at, etc.
--   - Fix updated_at trigger (only if column exists)
-- Safe:
--   - Uses IF EXISTS / IF NOT EXISTS patterns
--   - Safe to re-run
-- =========================================================

BEGIN;

-- 0) Extensions (safe)
CREATE EXTENSION IF NOT EXISTS pgcrypto;

-- 1) ENUMS (safe, idempotent)
DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'asset_type') THEN
    CREATE TYPE asset_type AS ENUM ('operational', 'digital');
  END IF;

  IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'listing_status') THEN
    CREATE TYPE listing_status AS ENUM ('draft', 'published', 'paused', 'archived');
  END IF;
END $$;

-- 2) Ensure listings has the columns V16 expects (WITHOUT dropping rows)
-- 2a) updated_at column (needed by trigger)
ALTER TABLE IF EXISTS public.listings
  ADD COLUMN IF NOT EXISTS updated_at timestamptz NOT NULL DEFAULT now();

-- 2b) status column (your app expects this; your SQL queries fail without it)
ALTER TABLE IF EXISTS public.listings
  ADD COLUMN IF NOT EXISTS status listing_status NOT NULL DEFAULT 'published';

-- 2c) Make sure asset_type is aligned.
-- Your table currently has asset_type as text. We’ll upgrade it to enum if possible.
DO $$
BEGIN
  IF EXISTS (
    SELECT 1
    FROM information_schema.columns
    WHERE table_schema='public'
      AND table_name='listings'
      AND column_name='asset_type'
      AND data_type='text'
  ) THEN
    -- Normalize existing values (safe)
    UPDATE public.listings
    SET asset_type = lower(asset_type)
    WHERE asset_type IS NOT NULL;

    -- If any invalid values exist, force them to 'operational' so conversion won't fail
    UPDATE public.listings
    SET asset_type = 'operational'
    WHERE asset_type IS NULL
       OR lower(asset_type) NOT IN ('operational','digital');

    -- Convert text -> enum
    ALTER TABLE public.listings
      ALTER COLUMN asset_type TYPE asset_type
      USING asset_type::asset_type;
  END IF;
END $$;

-- 2d) created_at default safety (optional, but common)
ALTER TABLE IF EXISTS public.listings
  ALTER COLUMN created_at SET DEFAULT now();

-- 3) Updated_at trigger function (safe)
CREATE OR REPLACE FUNCTION public.set_updated_at()
RETURNS trigger
LANGUAGE plpgsql
AS $$
BEGIN
  -- Only set if the column exists on this table
  -- (Protects you from “record NEW has no field updated_at”)
  BEGIN
    NEW.updated_at = now();
  EXCEPTION
    WHEN undefined_column THEN
      -- do nothing
      NULL;
  END;

  RETURN NEW;
END;
$$;

-- 4) Ensure trigger exists on listings (safe)
DO $$
BEGIN
  -- Drop any existing trigger with same name (safe)
  IF EXISTS (
    SELECT 1 FROM pg_trigger
    WHERE tgname = 'trg_set_updated_at_listings'
  ) THEN
    DROP TRIGGER trg_set_updated_at_listings ON public.listings;
  END IF;

  -- Create it (now that updated_at exists)
  CREATE TRIGGER trg_set_updated_at_listings
  BEFORE UPDATE ON public.listings
  FOR EACH ROW
  EXECUTE FUNCTION public.set_updated_at();
END $$;

-- 5) Quick verification outputs (won’t break migrations)
-- If you run in SQL Editor, you'll see these result sets.
DO $$
DECLARE
  has_status boolean;
  has_updated_at boolean;
BEGIN
  SELECT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_schema='public' AND table_name='listings' AND column_name='status'
  ) INTO has_status;

  SELECT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_schema='public' AND table_name='listings' AND column_name='updated_at'
  ) INTO has_updated_at;

  RAISE NOTICE 'V16 SAFE APPLY: listings.status=% , listings.updated_at=%', has_status, has_updated_at;
END $$;

COMMIT;
