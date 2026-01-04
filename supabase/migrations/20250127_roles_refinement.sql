-- NXTOWNER V17 — USERS/ROLES REFINEMENT
-- Refines user roles setup with multi-role support, auto-profile creation, and RLS alignment
-- SAFE: Does NOT change any UIDs or existing relationships

-- ============================================================================
-- PART A: Role enum verification and normalization
-- ============================================================================

-- Step 1: Ensure role column exists and has correct default
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
    ALTER TABLE public.profiles 
      ADD COLUMN role text NOT NULL DEFAULT 'user';
    RAISE NOTICE 'Added role column to profiles table';
  END IF;
END $$;

-- Step 2: Normalize NULL roles to 'user'
UPDATE public.profiles 
SET role = 'user' 
WHERE role IS NULL;

-- Step 3: Ensure default is 'user'
ALTER TABLE public.profiles 
  ALTER COLUMN role SET DEFAULT 'user';

-- Step 4: Update CHECK constraint to include all required roles
DO $$
BEGIN
  -- Drop existing constraint if it exists
  IF EXISTS (
    SELECT 1 
    FROM pg_constraint 
    WHERE conname = 'profiles_role_check'
  ) THEN
    ALTER TABLE public.profiles 
      DROP CONSTRAINT profiles_role_check;
  END IF;
END $$;

-- Add comprehensive CHECK constraint
ALTER TABLE public.profiles 
  ADD CONSTRAINT profiles_role_check 
  CHECK (role IN ('user', 'buyer', 'seller', 'partner', 'admin'));

-- Step 5: Normalize any invalid role values
UPDATE public.profiles 
SET role = 'user' 
WHERE role NOT IN ('user', 'buyer', 'seller', 'partner', 'admin');

-- Step 6: Ensure email column exists (best effort, don't break if missing)
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 
    FROM information_schema.columns 
    WHERE table_schema = 'public' 
      AND table_name = 'profiles' 
      AND column_name = 'email'
  ) THEN
    ALTER TABLE public.profiles 
      ADD COLUMN email text;
    RAISE NOTICE 'Added email column to profiles table';
  END IF;
END $$;

-- ============================================================================
-- PART B: Auto-create profiles on signup (trigger)
-- ============================================================================

-- Function to handle new user signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  -- Insert into profiles if it doesn't already exist (idempotent)
  INSERT INTO public.profiles (id, email, role, created_at, updated_at)
  VALUES (
    NEW.id,
    NEW.email,
    'user', -- Default role
    NOW(),
    NOW()
  )
  ON CONFLICT (id) DO NOTHING; -- Safe if profile already exists
  
  RETURN NEW;
END;
$$;

-- Drop trigger if it exists (idempotent)
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;

-- Create trigger on auth.users insert
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_new_user();

-- ============================================================================
-- PART C: Multi-role support table (future-proof)
-- ============================================================================

-- Create user_roles table for multi-role capability
CREATE TABLE IF NOT EXISTS public.user_roles (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  role text NOT NULL CHECK (role IN ('user', 'buyer', 'seller', 'partner', 'admin')),
  created_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE(user_id, role)
);

-- Index for performance
CREATE INDEX IF NOT EXISTS idx_user_roles_user_id ON public.user_roles(user_id);
CREATE INDEX IF NOT EXISTS idx_user_roles_role ON public.user_roles(role);

-- Enable RLS on user_roles
ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;

-- RLS Policies for user_roles

-- Users can select their own roles
CREATE POLICY "Users can select own roles"
  ON public.user_roles FOR SELECT
  USING (user_id = auth.uid());

-- Admins can select all roles
CREATE POLICY "Admins can select all roles"
  ON public.user_roles FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.profiles
      WHERE id = auth.uid() AND role = 'admin'
    )
  );

-- Users can insert their own roles (except admin)
CREATE POLICY "Users can insert own non-admin roles"
  ON public.user_roles FOR INSERT
  WITH CHECK (
    user_id = auth.uid() 
    AND role != 'admin'
  );

-- Only admins can grant admin role
CREATE POLICY "Only admins can grant admin role"
  ON public.user_roles FOR INSERT
  WITH CHECK (
    role = 'admin' AND
    EXISTS (
      SELECT 1 FROM public.profiles
      WHERE id = auth.uid() AND role = 'admin'
    )
  );

-- Users can delete their own non-admin roles
CREATE POLICY "Users can delete own non-admin roles"
  ON public.user_roles FOR DELETE
  USING (
    user_id = auth.uid() 
    AND role != 'admin'
  );

-- Admins can delete any role
CREATE POLICY "Admins can delete any role"
  ON public.user_roles FOR DELETE
  USING (
    EXISTS (
      SELECT 1 FROM public.profiles
      WHERE id = auth.uid() AND role = 'admin'
    )
  );

-- ============================================================================
-- PART D: User capabilities view (helper for queries)
-- ============================================================================

CREATE OR REPLACE VIEW public.v_user_capabilities AS
SELECT 
  p.id AS user_id,
  p.role AS primary_role,
  COALESCE(
    ARRAY_AGG(ur.role) FILTER (WHERE ur.role IS NOT NULL),
    ARRAY[]::text[]
  ) AS roles,
  (p.role = 'admin' OR 'admin' = ANY(
    COALESCE(
      ARRAY_AGG(ur.role) FILTER (WHERE ur.role IS NOT NULL),
      ARRAY[]::text[]
    )
  )) AS is_admin
FROM public.profiles p
LEFT JOIN public.user_roles ur ON p.id = ur.user_id
GROUP BY p.id, p.role;

-- Grant SELECT to authenticated users (they can see their own capabilities via RLS)
GRANT SELECT ON public.v_user_capabilities TO authenticated;

-- RLS on view (users can only see their own capabilities)
ALTER VIEW public.v_user_capabilities SET (security_invoker = true);

-- Note: Views don't support RLS directly, but the underlying tables do.
-- For admin checks, use the isAdmin() server function which queries profiles directly.

-- ============================================================================
-- PART E: Align RLS on listings table (if needed)
-- ============================================================================

-- Ensure listings table has proper RLS
ALTER TABLE public.listings ENABLE ROW LEVEL SECURITY;

-- Drop existing policies if they conflict (we'll recreate them)
DO $$
DECLARE
  pol text;
BEGIN
  FOR pol IN 
    SELECT policyname 
    FROM pg_policies 
    WHERE schemaname = 'public' 
      AND tablename = 'listings'
      AND policyname IN (
        'listings_seller_insert',
        'listings_seller_update',
        'listings_seller_delete',
        'listings_admin_all'
      )
  LOOP
    EXECUTE format('DROP POLICY IF EXISTS %I ON public.listings', pol);
  END LOOP;
END $$;

-- Sellers can insert their own listings
CREATE POLICY "listings_seller_insert"
  ON public.listings FOR INSERT
  WITH CHECK (
    owner_id = auth.uid() OR
    EXISTS (
      SELECT 1 FROM public.profiles
      WHERE id = auth.uid() 
      AND (role = 'seller' OR role = 'admin')
    )
  );

-- Sellers can update their own listings
CREATE POLICY "listings_seller_update"
  ON public.listings FOR UPDATE
  USING (
    owner_id = auth.uid() OR
    EXISTS (
      SELECT 1 FROM public.profiles
      WHERE id = auth.uid() AND role = 'admin'
    )
  )
  WITH CHECK (
    owner_id = auth.uid() OR
    EXISTS (
      SELECT 1 FROM public.profiles
      WHERE id = auth.uid() AND role = 'admin'
    )
  );

-- Sellers can delete their own listings
CREATE POLICY "listings_seller_delete"
  ON public.listings FOR DELETE
  USING (
    owner_id = auth.uid() OR
    EXISTS (
      SELECT 1 FROM public.profiles
      WHERE id = auth.uid() AND role = 'admin'
    )
  );

-- Admins can do everything (already covered above, but explicit for clarity)
-- Note: Admin policies are already included in the above policies via EXISTS checks

-- ============================================================================
-- VERIFICATION
-- ============================================================================

-- Verify role column
DO $$
DECLARE
  col_default text;
  constraint_exists boolean;
BEGIN
  -- Check default
  SELECT column_default INTO col_default
  FROM information_schema.columns
  WHERE table_schema = 'public'
    AND table_name = 'profiles'
    AND column_name = 'role';
  
  IF col_default = '''user'''::text THEN
    RAISE NOTICE '✓ Role column default verified: ''user''';
  ELSE
    RAISE WARNING 'Role column default is: %', col_default;
  END IF;

  -- Check constraint
  SELECT EXISTS (
    SELECT 1 FROM pg_constraint
    WHERE conname = 'profiles_role_check'
  ) INTO constraint_exists;

  IF constraint_exists THEN
    RAISE NOTICE '✓ Role CHECK constraint exists';
  ELSE
    RAISE WARNING 'Role CHECK constraint missing!';
  END IF;
END $$;

-- Verify trigger
DO $$
DECLARE
  trigger_exists boolean;
BEGIN
  SELECT EXISTS (
    SELECT 1 FROM pg_trigger
    WHERE tgname = 'on_auth_user_created'
  ) INTO trigger_exists;

  IF trigger_exists THEN
    RAISE NOTICE '✓ Auto-profile creation trigger exists';
  ELSE
    RAISE WARNING 'Auto-profile creation trigger missing!';
  END IF;
END $$;

-- Verify user_roles table
DO $$
DECLARE
  table_exists boolean;
BEGIN
  SELECT EXISTS (
    SELECT 1 FROM information_schema.tables
    WHERE table_schema = 'public'
      AND table_name = 'user_roles'
  ) INTO table_exists;

  IF table_exists THEN
    RAISE NOTICE '✓ user_roles table exists';
  ELSE
    RAISE WARNING 'user_roles table missing!';
  END IF;
END $$;

-- Verify capabilities view
DO $$
DECLARE
  view_exists boolean;
BEGIN
  SELECT EXISTS (
    SELECT 1 FROM information_schema.views
    WHERE table_schema = 'public'
      AND view_name = 'v_user_capabilities'
  ) INTO view_exists;

  IF view_exists THEN
    RAISE NOTICE '✓ v_user_capabilities view exists';
  ELSE
    RAISE WARNING 'v_user_capabilities view missing!';
  END IF;
END $$;


