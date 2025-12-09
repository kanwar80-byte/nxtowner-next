# Supabase RLS Configuration Required

Your profiles table needs proper Row Level Security (RLS) policies for authenticated users to read their own profiles.

## Required RLS Policies for `public.profiles` table:

### Policy 1: Allow users to SELECT their own profile

**Name:** `Enable users to select own profile`
**Permissions:** SELECT
**Target roles:** authenticated
**Using expression:**
```sql
(SELECT auth.uid()) = user_id
```

### Policy 2: Allow users to UPDATE their own profile

**Name:** `Enable users to update own profile`
**Permissions:** UPDATE
**Target roles:** authenticated
**Using expression:**
```sql
(SELECT auth.uid()) = user_id
```

## Steps to add these policies in Supabase:

1. Go to your Supabase project dashboard
2. Click **"Authentication"** → **"Policies"** (or **"SQL Editor"**)
3. Open the `profiles` table settings
4. Click **"Enable RLS"** if not already enabled
5. Click **"New Policy"** and create both policies above

## Alternative: Run this SQL directly

Go to **"SQL Editor"** in Supabase and run:

```sql
-- Enable RLS on profiles table
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

-- Policy to allow users to read their own profile
CREATE POLICY "Enable users to select own profile" ON public.profiles
  FOR SELECT
  USING ((SELECT auth.uid()) = user_id);

-- Policy to allow users to update their own profile
CREATE POLICY "Enable users to update own profile" ON public.profiles
  FOR UPDATE
  USING ((SELECT auth.uid()) = user_id)
  WITH CHECK ((SELECT auth.uid()) = user_id);
```

## Table Structure Required

Your `profiles` table must have these columns:

```sql
CREATE TABLE public.profiles (
  user_id uuid PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email text,
  full_name text,
  role text CHECK (role IN ('buyer', 'seller', 'partner', 'admin')),
  avatar_url text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);
```

After setting up RLS policies, try accessing /admin again.
