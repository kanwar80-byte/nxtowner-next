import "server-only";

import { createClient } from '@/utils/supabase/server';
import { redirect } from 'next/navigation';
import { requireEntitlement as requireEntitlementInRepo } from '@/lib/billing/entitlements';
import type { Entitlement } from '@/types/billing';

/**
 * Require authenticated user - throws/redirects if not authenticated
 * @returns The authenticated user object
 * @throws Redirects to /login if not authenticated
 */
export async function requireUser() {
  const supabase = await createClient();
  const { data: { user }, error } = await supabase.auth.getUser();
  
  if (error || !user) {
    redirect('/login');
  }
  
  return user;
}

/**
 * Require user to have a specific entitlement
 * @param entitlement The entitlement to check
 * @returns The authenticated user object and their plan info
 * @throws Redirects to /login if not authenticated, throws 403 error if not entitled
 */
export async function requireEntitlement(entitlement: Entitlement) {
  const user = await requireUser();
  
  try {
    const planInfo = await requireEntitlementInRepo(user.id, entitlement);
    return {
      user,
      ...planInfo,
    };
  } catch (error: any) {
    // Re-throw with proper error structure
    if (error.statusCode === 403) {
      throw error;
    }
    // If it's not a 403, it's likely an auth error - redirect to login
    redirect('/login');
  }
}
