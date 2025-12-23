
import { createClient } from '@/utils/supabase/server';
import { redirect } from 'next/navigation';

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
