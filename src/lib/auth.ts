import { supabase } from './supabase';
import { redirect } from 'next/navigation';
import type { User } from '@supabase/supabase-js';

export type UserProfile = {
  id: string;
  email?: string;
  full_name?: string;
  role: 'buyer' | 'seller' | 'partner' | 'admin';
  created_at: string;
  updated_at: string;
};

export async function requireAuth(): Promise<User> {
  const { data: { user }, error } = await supabase.auth.getUser();
  
  if (error || !user) {
    redirect('/login');
  }
  
  return user;
}

export async function getUserProfile(): Promise<{ user: User; profile: UserProfile | null }> {
  const user = await requireAuth();
  
  const { data: profile } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', user.id)
    .single();
  
  return { user, profile: profile as UserProfile | null };
}
