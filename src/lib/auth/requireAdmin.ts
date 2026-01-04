import "server-only";

import { createClient } from '@/utils/supabase/server';

/**
 * Check if the current user is an admin (without redirecting).
 * Returns { isAdmin: boolean, user: User | null }
 * Use this when you want to conditionally render content instead of redirecting.
 */
export async function checkAdmin() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  
  if (!user) {
    return { isAdmin: false, user: null };
  }

  // Try both column names (id and user_id) to handle different schema versions
  let { data: profile, error } = await supabase
    .from('profiles')
    .select('role')
    .eq('id', user.id)
    .single();

  // If that fails, try with 'user_id' (V16 schema)
  if (error || !profile) {
    const result = await supabase
      .from('profiles')
      .select('role')
      .eq('user_id', user.id)
      .single();
    
    profile = result.data;
    error = result.error;
  }

  // Check primary role
  if (profile?.role === 'admin') {
    return { isAdmin: true, user };
  }

  // Check user_roles table for admin role (multi-role support)
  if (profile) {
    const profileId = user.id;
    
    const { data: userRoles } = await supabase
      .from('user_roles')
      .select('role')
      .eq('user_id', profileId)
      .eq('role', 'admin')
      .limit(1);

    if ((userRoles?.length ?? 0) > 0) {
      return { isAdmin: true, user };
    }
  }

  return { isAdmin: false, user };
}

/**
 * Require admin access. Redirects to home if not authenticated or not admin.
 * Use this in server components and server actions when you want to redirect.
 */
export async function requireAdmin() {
  const { isAdmin, user } = await checkAdmin();
  if (!isAdmin || !user) {
    const { redirect } = await import('next/navigation');
    redirect('/');
  }
  return user;
}

