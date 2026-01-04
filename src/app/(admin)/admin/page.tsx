import { requireRole } from '@/lib/auth/getProfile';
import { getAdminMetrics } from '@/lib/admin/adminMetrics';
import { getAdminQueues } from '@/lib/admin/adminQueues';
import { getAdminUserKpis, getAdminUsersList } from '@/app/actions/admin';
import type { AdminMetrics } from '@/lib/admin/adminMetrics';
import type { AdminQueues } from '@/lib/admin/adminQueues';
import type { UserKpiData } from '@/lib/admin/queries';
import type { UserTableRow } from '@/lib/admin/queries';
import AdminKpiTiles from '@/components/admin/AdminKpiTiles';
import AdminKpiCards from '@/components/admin/AdminKpiCards';
import AdminUsersTable from '@/components/admin/users/AdminUsersTable';
import AdminQueuePanel from '@/components/admin/AdminQueuePanel';

export default async function AdminPage() {
  // Enforce admin role - redirects to /dashboard if role doesn't match
  await requireRole('admin', '/admin');
  let metrics: AdminMetrics;
  let queues: AdminQueues;
  let userKpis: UserKpiData;
  let usersList: UserTableRow[];
  let errorMessage: string | null = null;

  try {
    [metrics, queues, userKpis, usersList] = await Promise.all([
      getAdminMetrics(),
      getAdminQueues(),
      getAdminUserKpis(),
      getAdminUsersList(),
    ]);
  } catch (err) {
    console.error("[AdminPage] Error loading data:", err);
    errorMessage = err instanceof Error ? err.message : "Unknown error";
    metrics = {
      newListings: { label: "New Listings", value7d: null, value30d: null, deltaAbs: null, deltaPct: null },
      newUsers: { label: "New Users", value7d: null, value30d: null, deltaAbs: null, deltaPct: null },
      ndaRequests: { label: "NDA Requests", value7d: null, value30d: null, deltaAbs: null, deltaPct: null },
      dealRoomsCreated: { label: "Deal Rooms Created", value7d: null, value30d: null, deltaAbs: null, deltaPct: null },
    };
    queues = {
      listingsPendingReview: [],
      highRiskListings: [],
      ndasPendingExpiring: [],
      paymentFailures: [],
    };
    userKpis = {
      authTotal: null,
      profilesTotal: 0,
      buyersCount: 0,
      sellersCount: 0,
      partnersCount: 0,
      adminsFoundersCount: 0,
      profilesHealth: null,
    };
    usersList = [];
  }

  return (
    <div className="p-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-slate-900">Admin • Overview</h1>
        <p className="text-slate-600 mt-1">Operational control system for moderation, compliance, and support.</p>
        {errorMessage && (
          <p className="text-sm text-amber-600 mt-2">
            ⚠️ Unable to load some data: {errorMessage}
          </p>
        )}
      </div>

      <section className="mb-8">
        <h2 className="text-lg font-semibold text-slate-900 mb-4">User KPIs</h2>
        <AdminKpiCards kpis={userKpis} />
      </section>

      <section className="mb-8">
        <h2 className="text-lg font-semibold text-slate-900 mb-4">Key Metrics (Last 7d / 30d)</h2>
        <AdminKpiTiles metrics={metrics} />
      </section>

      <section className="mb-8">
        <h2 className="text-lg font-semibold text-slate-900 mb-4">Latest Users (Latest 50)</h2>
        <AdminUsersTable users={usersList} />
      </section>

      <section>
        <h2 className="text-lg font-semibold text-slate-900 mb-4">Action Queues</h2>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <AdminQueuePanel
            title="Listings Pending Review"
            items={queues.listingsPendingReview}
            href="/admin/listings?status=pending_review"
            emptyMessage="No listings pending review"
          />
          <AdminQueuePanel
            title="High Risk Listings"
            items={queues.highRiskListings}
            href="/admin/listings?risk=high"
            emptyMessage="No high risk listings"
          />
          <AdminQueuePanel
            title="NDAs Pending / Expiring"
            items={queues.ndasPendingExpiring}
            href="/admin/ndas?state=pending"
            emptyMessage="No NDAs pending or expiring"
          />
          <AdminQueuePanel
            title="Payment Failures"
            items={queues.paymentFailures}
            href="/admin/monetization?state=failed"
            emptyMessage="No payment failures"
          />
        </div>
      </section>
    </div>
  );
}

