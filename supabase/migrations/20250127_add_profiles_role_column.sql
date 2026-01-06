-- NXTOWNER V17 — ADMIN SETUP: profiles.role column
-- Idempotent migration: adds role column if missing, ensures correct defaults and constraints

-- ============================================================================
-- STEP 1: Add role column if it doesn't exist
-- ============================================================================

DO $$
BEGIN
  -- Check if role column exists
  IF NOT EXISTS (
    SELECT 1 
    FROM information_schema.columns 
    WHERE table_schema = 'public' 
      AND table_name = 'profiles' 
      AND column_name = 'role'
  ) THEN
    -- Add role column with default 'user'
    ALTER TABLE public.profiles 
      ADD COLUMN role text NOT NULL DEFAULT 'user';
    
    RAISE NOTICE 'Added role column to profiles table';
  ELSE
    RAISE NOTICE 'Role column already exists in profiles table';
  END IF;
END $$;

-- ============================================================================
-- STEP 2: Ensure default is 'user' (update existing NULLs and change default)
-- ============================================================================

-- Update any NULL roles to 'user'
UPDATE public.profiles 
SET role = 'user' 
WHERE role IS NULL;

-- Change default to 'user' if it's different
ALTER TABLE public.profiles 
  ALTER COLUMN role SET DEFAULT 'user';

-- ============================================================================
-- STEP 3: Add or replace CHECK constraint for role values
-- ============================================================================

-- Drop existing constraint if it exists (to allow updating it)
DO $$
BEGIN
  IF EXISTS (
    SELECT 1 
    FROM pg_constraint 
    WHERE conname = 'profiles_role_check'
  ) THEN
    ALTER TABLE public.profiles 
      DROP CONSTRAINT profiles_role_check;
  END IF;
END $$;

-- Add CHECK constraint with allowed values
ALTER TABLE public.profiles 
  ADD CONSTRAINT profiles_role_check 
  CHECK (role IN ('user', 'admin', 'seller', 'buyer', 'partner'));

-- ============================================================================
-- STEP 4: Add index on role for performance
-- ============================================================================

-- Create index if it doesn't exist
CREATE INDEX IF NOT EXISTS idx_profiles_role 
  ON public.profiles(role);

-- ============================================================================
-- STEP 5: Normalize existing role values (if any are outside allowed set)
-- ============================================================================

-- Normalize any invalid role values to 'user'
UPDATE public.profiles 
SET role = 'user' 
WHERE role NOT IN ('user', 'admin', 'seller', 'buyer', 'partner');

-- ============================================================================
-- VERIFICATION
-- ============================================================================

-- Verify the column exists and has correct default
DO $$
DECLARE
  col_default text;
BEGIN
  SELECT column_default INTO col_default
  FROM information_schema.columns
  WHERE table_schema = 'public'
    AND table_name = 'profiles'
    AND column_name = 'role';
  
  IF col_default = '''user'''::text THEN
    RAISE NOTICE '✓ Role column verified: default is ''user''';
  ELSE
    RAISE WARNING 'Role column default is: %', col_default;
  END IF;
END $$;




