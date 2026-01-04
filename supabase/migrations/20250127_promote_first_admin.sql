-- NXTOWNER V17 — ONE-TIME: Promote first admin by email
-- 
-- USAGE:
-- Replace 'kanwar80@gmail.com' with the actual admin email address
-- Run this ONCE in Supabase SQL Editor after the role column migration
--
-- This SQL works whether profiles uses 'id' or 'user_id' as the key column

-- ============================================================================
-- PROMOTE ADMIN BY EMAIL
-- ============================================================================

-- Option 1: If profiles.id references auth.users(id) directly
UPDATE public.profiles
SET role = 'admin'
WHERE id IN (
  SELECT id 
  FROM auth.users 
  WHERE email = 'kanwar80@gmail.com'
);

-- Option 2: If profiles has a separate user_id column (V16 schema)
-- Uncomment this if Option 1 doesn't work:
-- UPDATE public.profiles
-- SET role = 'admin'
-- WHERE user_id IN (
--   SELECT id 
--   FROM auth.users 
--   WHERE email = 'kanwar80@gmail.com'
-- );

-- ============================================================================
-- VERIFICATION
-- ============================================================================

-- Verify the admin was promoted
SELECT 
  p.id,
  p.role,
  u.email,
  u.created_at
FROM public.profiles p
JOIN auth.users u ON p.id = u.id
WHERE u.email = 'kanwar80@gmail.com';

-- Expected result: role should be 'admin'


