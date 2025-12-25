
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
