import { redirect } from "next/navigation";
import { isAdmin } from "@/lib/auth";
import { getAdminKPIs } from "@/app/actions/getAdminKPIs";
import { AuthGate } from "@/components/auth/AuthGate";
import { createClient } from "@/utils/supabase/server";

export default async function AdminPage() {
  const userIsAdmin = await isAdmin();

  // IMPORTANT: never redirect non-admins back to /admin
  if (!userIsAdmin) redirect("/");

  let kpis = { total_listings: 0, total_users: 0, pending_reviews: 0, active_deals: 0 };
  let errorMessage: string | null = null;

  try {
    kpis = await getAdminKPIs();
  } catch (err) {
    console.error("[AdminPage] getAdminKPIs failed:", err);
    errorMessage = err instanceof Error ? err.message : "Unknown error";
  }

  // Fetch users/profiles
  let profiles: any[] = [];
  let hasCreatedAt = false;
  let hasUpdatedAt = false;
  
  try {
    const supabase = await createClient();
    const { data, error } = await supabase
      .from('profiles')
      .select('id, email, role, created_at, updated_at')
      .order('updated_at', { ascending: false, nullsFirst: false })
      .order('created_at', { ascending: false })
      .limit(50);

    if (error) {
      console.error("[AdminPage] Error fetching profiles:", error);
    } else if (data) {
      profiles = data;
      // Sort by coalesce(updated_at, created_at) desc
      profiles.sort((a, b) => {
        const aDate = a.updated_at || a.created_at;
        const bDate = b.updated_at || b.created_at;
        if (!aDate && !bDate) return 0;
        if (!aDate) return 1;
        if (!bDate) return -1;
        return new Date(bDate).getTime() - new Date(aDate).getTime();
      });
      
      // Check if columns exist by checking if any row has these fields
      hasCreatedAt = data.length > 0 && 'created_at' in (data[0] || {});
      hasUpdatedAt = data.length > 0 && 'updated_at' in (data[0] || {});
    }
  } catch (err) {
    console.error("[AdminPage] Error fetching profiles:", err);
  }

  return (
    <AuthGate requireAdmin={true}>
      <main className="min-h-[70vh] bg-slate-50">
        <div className="max-w-6xl mx-auto px-4 py-10">
          <header className="mb-6">
            <h1 className="text-3xl font-bold text-slate-900">Admin Dashboard</h1>
            <p className="text-slate-600 mt-1">Platform health snapshot</p>
            {errorMessage && (
              <p className="text-sm text-amber-600 mt-2">
                ⚠️ Unable to load latest KPIs: {errorMessage}
              </p>
            )}
          </header>

          <section className="mt-6">
            <div className="rounded-2xl border bg-white p-6 shadow-sm">
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                {/* Total Listings */}
                <div className="rounded-xl border bg-slate-50 p-4">
                  <div className="text-sm font-medium text-slate-600 mb-1">Total Listings</div>
                  <div className="text-3xl font-bold text-slate-900">{kpis.total_listings}</div>
                </div>

                {/* Total Users */}
                <div className="rounded-xl border bg-slate-50 p-4">
                  <div className="text-sm font-medium text-slate-600 mb-1">Total Users</div>
                  <div className="text-3xl font-bold text-slate-900">{kpis.total_users}</div>
                </div>

                {/* Pending Reviews */}
                <div className="rounded-xl border bg-slate-50 p-4">
                  <div className="text-sm font-medium text-slate-600 mb-1">Pending Reviews</div>
                  <div className="text-3xl font-bold text-orange-600">{kpis.pending_reviews}</div>
                </div>

                {/* Active Deals */}
                <div className="rounded-xl border bg-slate-50 p-4">
                  <div className="text-sm font-medium text-slate-600 mb-1">Active Deals</div>
                  <div className="text-3xl font-bold text-green-600">{kpis.active_deals}</div>
                </div>
              </div>
            </div>
          </section>

          <section className="mt-6">
            <div className="rounded-2xl border bg-white p-6 shadow-sm">
              <div className="mb-4">
                <h2 className="text-xl font-bold text-slate-900">Users</h2>
                <p className="text-sm text-slate-600 mt-1">Profiles currently in the system</p>
              </div>

              {profiles.length === 0 ? (
                <p className="text-slate-500 text-center py-8">No profiles found.</p>
              ) : (
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-slate-200">
                    <thead className="bg-slate-50">
                      <tr>
                        <th className="px-4 py-3 text-left text-xs font-medium text-slate-700 uppercase tracking-wider">
                          Email
                        </th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-slate-700 uppercase tracking-wider">
                          Role
                        </th>
                        {hasCreatedAt && (
                          <th className="px-4 py-3 text-left text-xs font-medium text-slate-700 uppercase tracking-wider">
                            Created
                          </th>
                        )}
                        {hasUpdatedAt && (
                          <th className="px-4 py-3 text-left text-xs font-medium text-slate-700 uppercase tracking-wider">
                            Updated
                          </th>
                        )}
                        <th className="px-4 py-3 text-left text-xs font-medium text-slate-700 uppercase tracking-wider">
                          ID
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-slate-200">
                      {profiles.map((profile) => (
                        <tr key={profile.id} className="hover:bg-slate-50">
                          <td className="px-4 py-3 whitespace-nowrap text-sm text-slate-900">
                            {profile.email || '—'}
                          </td>
                          <td className="px-4 py-3 whitespace-nowrap">
                            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                              {profile.role || 'user'}
                            </span>
                          </td>
                          {hasCreatedAt && (
                            <td className="px-4 py-3 whitespace-nowrap text-sm text-slate-600">
                              {profile.created_at
                                ? new Date(profile.created_at).toLocaleDateString('en-US', {
                                    year: 'numeric',
                                    month: 'short',
                                    day: 'numeric',
                                  })
                                : '—'}
                            </td>
                          )}
                          {hasUpdatedAt && (
                            <td className="px-4 py-3 whitespace-nowrap text-sm text-slate-600">
                              {profile.updated_at
                                ? new Date(profile.updated_at).toLocaleDateString('en-US', {
                                    year: 'numeric',
                                    month: 'short',
                                    day: 'numeric',
                                  })
                                : '—'}
                            </td>
                          )}
                          <td className="px-4 py-3 whitespace-nowrap text-sm text-slate-500 font-mono">
                            {profile.id ? `${profile.id.substring(0, 8)}...` : '—'}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </section>

          <div className="h-10" />
        </div>
      </main>
    </AuthGate>
  );
}
