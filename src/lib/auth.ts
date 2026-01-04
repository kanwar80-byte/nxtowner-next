import "server-only";

import { createClient } from '@/utils/supabase/server';
import { redirect } from 'next/navigation';

// Thin helper to fetch user profile (returns null if not found)
export async function getUserProfile() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return null;
  // You may want to fetch from a 'profiles' table if needed, but for now just return user
  return user;
}

// Require authentication, redirect if not logged in
export async function requireAuth() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) {
    redirect('/login');
  }
  return user;
}

// Get user or null (no redirect)
export async function getUser() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  return user || null;
}

/**
 * Check if the current authenticated user is an admin.
 * Reads profiles.role from the database (server-side only).
 * Also checks user_roles table for multi-role support.
 * 
 * @returns {Promise<boolean>} true if user is admin, false otherwise
 */
export async function isAdmin(): Promise<boolean> {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  
  if (!user) {
    return false;
  }

  // Try both column names (id and user_id) to handle different schema versions
  // First, try with 'id' (old schema)
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
    return true;
  }

  // Check user_roles table for admin role (multi-role support)
  // user_roles.user_id references profiles.id, so use the profile id
  if (profile) {
    // Try to get profile id (could be 'id' or we need to use user.id)
    const profileId = user.id; // profiles.id = auth.users.id
    
    const { data: userRoles } = await supabase
      .from('user_roles')
      .select('role')
      .eq('user_id', profileId)
      .eq('role', 'admin')
      .limit(1);

    return (userRoles?.length ?? 0) > 0;
  }

  return false;
}
