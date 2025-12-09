# Admin Access & Profile Loading - Fixed

## Summary of Changes

### Files Modified

1. **src/hooks/useProfile.ts**
   - Already using correct `user_id` field (not `id`)
   - Enhanced error logging to show detailed debug info
   - Logs: userId, email, query result, error code, error details
   - Shows actual error messages from Supabase RLS policies

2. **src/components/auth/AuthGate.tsx**
   - Enhanced debug logging to verify:
     - User authentication state
     - Profile role value
     - Admin requirement check result
     - Any query errors
   - Logs all parameters for debugging admin access issues

3. **src/app/debug/page.tsx** (NEW)
   - Diagnostic page at `/debug` to inspect:
     - useUserProfile hook output
     - Raw Supabase query result
     - Query errors and error codes
   - Use this to diagnose RLS policy issues

4. **SUPABASE_RLS_SETUP.md** (NEW)
   - Complete guide to set up Supabase RLS policies
   - Copy-paste SQL for required policies
   - Table structure validation

## Current Code Status

### Profile Query (CORRECT)
```typescript
const { data, error: profileError } = await supabase
  .from('profiles')
  .select('user_id, email, full_name, role, avatar_url, created_at, updated_at')
  .eq('user_id', authUser.id)  // ✓ Using user_id, not id
  .single();
```

### AuthGate Admin Check (CORRECT)
```typescript
// Check admin requirement
if (requireAdmin && profile?.role !== "admin") {
  // Show "Access Denied" UI
}
```

### Admin Page Wrapping (CORRECT)
```typescript
export default function AdminPage() {
  return (
    <AuthGate requireAdmin={true}>
      {/* Admin content */}
    </AuthGate>
  );
}
```

## The Problem (Most Likely)

Your Supabase `profiles` table does NOT have RLS policies enabled, OR the policies don't allow authenticated users to read their own profiles.

When you query with the anon key (which is what the browser client uses), Supabase blocks all reads by default without explicit RLS policies.

## Solution Steps

1. **Open Supabase Console**
   - Go to https://app.supabase.com
   - Select your project
   - Go to **Authentication** → **Policies** or **SQL Editor**

2. **Enable RLS on profiles table**
   - Navigate to Table Editor → `public.profiles`
   - Click the lock icon
   - Enable RLS

3. **Add READ policy**
   - Click "New Policy"
   - Name: "Enable users to select own profile"
   - Permissions: SELECT
   - Target roles: authenticated
   - Using expression: `(SELECT auth.uid()) = user_id`
   - Click Create

4. **Test**
   - Go to http://localhost:3000/debug
   - Open DevTools Console (F12)
   - Look for `[useProfile] Query debug:` logs
   - Check if profile.role shows "admin"

5. **Verify Admin Access**
   - Go to http://localhost:3000/admin
   - Should show admin dashboard (not "Access Denied")
   - Open DevTools Console
   - Look for `[AuthGate]` log showing `passesCheck: true`

## Debug Output Examples

### SUCCESS (User is admin)
```
[useProfile] Query debug: {
  userId: "abc123...",
  authEmail: "kanwar80@gmail.com",
  data: {
    user_id: "abc123...",
    role: "admin",
    email: "kanwar80@gmail.com",
    ...
  },
  error: null
}

[AuthGate] {
  hasUser: true,
  userId: "abc123...",
  hasProfile: true,
  role: "admin",
  requireAdmin: true,
  passesCheck: true,
  error: null
}
```

### FAILURE (RLS policy missing)
```
[useProfile] Query debug: {
  userId: "abc123...",
  authEmail: "kanwar80@gmail.com",
  data: null,
  error: "new row violates row-level security policy",
  errorCode: "PGRST100",
  ...
}
```

## Quick RLS Setup (SQL)

Copy and paste this in Supabase SQL Editor:

```sql
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Enable users to select own profile" ON public.profiles
  FOR SELECT
  USING ((SELECT auth.uid()) = user_id);

CREATE POLICY "Enable users to update own profile" ON public.profiles
  FOR UPDATE
  USING ((SELECT auth.uid()) = user_id)
  WITH CHECK ((SELECT auth.uid()) = user_id);
```

## Build Status

✅ Build succeeds (19 routes, 0 TypeScript errors)
✅ Lint passes (0 ESLint errors)
✅ All admin pages wrapped with `<AuthGate requireAdmin={true}>`
✅ Profile hook uses correct `user_id` field
✅ Debug logging in place for troubleshooting

## Next Steps

1. Add RLS policies to Supabase (see instructions above)
2. Visit http://localhost:3000/debug while logged in
3. Check browser console for debug logs
4. Verify profile.role === "admin"
5. Visit http://localhost:3000/admin
6. Should show admin dashboard without "Access Denied"
