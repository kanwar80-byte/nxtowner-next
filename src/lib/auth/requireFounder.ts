import "server-only";

import { createClient } from '@/utils/supabase/server';

/**
 * Check if the current user is a founder or admin (without redirecting).
 * Returns { isFounder: boolean, user: User | null }
 * 
 * Note: If 'founder' role doesn't exist yet, this allows 'admin' for now.
 * To enable founder role later, ensure profiles.role can be 'founder' and update this check.
 */
export async function checkFounder() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  
  if (!user) {
    return { isFounder: false, user: null };
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

  // Check primary role: allow 'admin' or 'founder'
  // If 'founder' role doesn't exist yet, admin is allowed as fallback
  if (profile?.role === 'admin' || profile?.role === 'founder') {
    return { isFounder: true, user };
  }

  // Check user_roles table for admin/founder role (multi-role support)
  if (profile) {
    const profileId = user.id;
    
    const { data: userRoles } = await supabase
      .from('user_roles')
      .select('role')
      .eq('user_id', profileId)
      .in('role', ['admin', 'founder'])
      .limit(1);

    if ((userRoles?.length ?? 0) > 0) {
      return { isFounder: true, user };
    }
  }

  return { isFounder: false, user };
}

/**
 * Require founder/admin access. Redirects to home if not authenticated or not founder/admin.
 * Use this in server components and server actions when you want to redirect.
 */
export async function requireFounder() {
  const { isFounder, user } = await checkFounder();
  if (!isFounder || !user) {
    const { redirect } = await import('next/navigation');
    redirect('/');
  }
  return user;
}


