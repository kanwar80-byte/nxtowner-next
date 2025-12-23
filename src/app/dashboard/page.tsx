
import { requireAuth } from '@/lib/auth';
import { createClient } from '@/utils/supabase/server';
import Link from 'next/link';

export const revalidate = 0;

export default async function DashboardPage() {
  // 1. Require authentication
  const user = await requireAuth();
  const supabase = await createClient();

  // 2. Fetch user's active deals
  const { data: deals, error } = await supabase
    .from('deals')
    .select(`id, current_stage, created_at, listing:listings(title, lane)`)
    .or(`buyer_id.eq.${user.id},seller_id.eq.${user.id}`)
    .order('created_at', { ascending: false });

  return (
    <div className="max-w-3xl mx-auto py-12 px-4">
      <h1 className="text-2xl font-bold mb-6">My Active Deals</h1>
      {deals && deals.length > 0 ? (
        <ul className="space-y-4">
          {deals.map((deal: any) => (
            <li key={deal.id} className="bg-white rounded-lg shadow border p-4 flex flex-col md:flex-row md:items-center md:justify-between">
              <div>
                <div className="text-lg font-semibold text-gray-900">{deal.listing?.title || 'Untitled Listing'}</div>
                <div className="text-sm text-gray-500 mt-1">Stage: <span className="font-medium text-blue-700">{deal.current_stage.replace(/[0-9]_/, '').toUpperCase()}</span></div>
              </div>
              <Link href={`/deals/${deal.id}`} className="mt-3 md:mt-0 inline-block px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors font-medium">View Deal</Link>
            </li>
          ))}
        </ul>
      ) : (
        <div className="text-gray-500 text-center py-12">No active deals found.</div>
      )}
    </div>
  );
}
