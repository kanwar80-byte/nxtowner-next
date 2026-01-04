import "server-only";

import { createClient } from '@/utils/supabase/server';
import { redirect } from 'next/navigation';

export type Profile = {
  id: string;
  role: string | null;
  roles: string[] | null;
  onboarding_status: string | null;
  preferred_track: string | null;
  full_name: string | null;
  company_name: string | null;
  email: string | null;
};

/**
 * Get user profile or create a basic one if missing.
 * Returns user and profile, or redirects if no user.
 * 
 * @param currentPath - Optional current path for login redirect
 */
export async function getProfileOrCreate(currentPath?: string): Promise<{ user: { id: string; email?: string | null }; profile: Profile }> {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    const loginUrl = currentPath ? `/login?next=${encodeURIComponent(currentPath)}` : '/login';
    redirect(loginUrl);
  }

  // Fetch profile
  let { data: profile, error } = await supabase
    .from('profiles')
    .select('id, role, roles, onboarding_status, preferred_track, full_name, company_name, email')
    .eq('id', user.id)
    .single();

  // If profile doesn't exist, create a basic one
  if (error || !profile) {
    const { data: newProfile, error: createError } = await supabase
      .from('profiles')
      .insert({
        id: user.id,
        email: user.email,
        role: null,
        roles: null,
        onboarding_status: 'new',
        preferred_track: null,
        full_name: null,
        company_name: null,
      })
      .select('id, role, roles, onboarding_status, preferred_track, full_name, company_name, email')
      .single();

    if (createError || !newProfile) {
      console.error('[getProfileOrCreate] Error creating profile:', createError);
      // Return a minimal profile structure
      profile = {
        id: user.id,
        role: null,
        roles: null,
        onboarding_status: 'new',
        preferred_track: null,
        full_name: null,
        company_name: null,
        email: user.email || null,
      };
    } else {
      profile = newProfile;
    }
  }

  return {
    user: { id: user.id, email: user.email },
    profile: profile as Profile,
  };
}

/**
 * Require a specific role. Redirects to /login if not authenticated,
 * or to /dashboard if role doesn't match.
 * 
 * @param requiredRole - The role required to access the route
 * @param currentPath - Optional current path for login redirect
 * @returns { user, profile } if role matches
 */
export async function requireRole(
  requiredRole: 'buyer' | 'seller' | 'partner' | 'admin' | 'founder',
  currentPath?: string
): Promise<{ user: { id: string; email?: string | null }; profile: Profile }> {
  const { user, profile } = await getProfileOrCreate(currentPath);

  // Check if role matches
  if (profile.role !== requiredRole) {
    // Redirect to /dashboard (role router) instead of showing 404
    redirect('/dashboard');
  }

  return { user, profile };
}

