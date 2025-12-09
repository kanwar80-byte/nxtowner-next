import { redirect } from 'next/navigation';
import { getUserProfile } from '@/lib/auth';

export const revalidate = 0; // Render on demand, not at build time

export default async function DashboardPage() {
  const { profile } = await getUserProfile();
  
  // Redirect based on user role
  if (profile?.role === 'admin') {
    redirect('/admin');
  } else if (profile?.role === 'seller') {
    redirect('/dashboard/seller');
  } else if (profile?.role === 'partner') {
    redirect('/dashboard/partner');
  } else {
    // Default to buyer dashboard
    redirect('/dashboard/buyer');
  }
}
