import { Suspense } from 'react';
import { getAuditEvents } from '@/lib/audit/auditRepo';
import AdminAuditTable from '@/components/admin/audit/AdminAuditTable';
import AdminAuditFilters from '@/components/admin/audit/AdminAuditFilters';
import { AuditAction } from '@/lib/audit/types';

export const dynamic = "force-dynamic";

interface AdminAuditLogPageProps {
  searchParams: {
    action?: string;
    start_date?: string;
    end_date?: string;
    actor_id?: string;
    entity_type?: string;
  };
}

export default async function AdminAuditLogPage({ searchParams }: AdminAuditLogPageProps) {
  const filters = {
    action: (searchParams.action as AuditAction | 'all') || 'all',
    start_date: searchParams.start_date,
    end_date: searchParams.end_date,
    actor_id: searchParams.actor_id,
    entity_type: searchParams.entity_type,
    limit: 100,
  };

  const result = await getAuditEvents(filters);

  return (
    <div className="p-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-slate-900">Admin • Audit Log</h1>
        <p className="text-slate-600 mt-1">View immutable audit trail of admin actions.</p>
      </div>

      <div className="rounded-2xl border bg-white p-6 shadow-sm">
        <Suspense fallback={<div className="p-6 text-sm text-slate-500">Loading filters…</div>}>
          <AdminAuditFilters />
        </Suspense>
        {result.status === "unavailable" && (
          <div className="mt-4 px-4 py-2 bg-amber-50 border border-amber-200 rounded-lg">
            <p className="text-sm text-amber-800">
              {result.message || "Audit log is not configured yet (table/policies missing)."}
            </p>
          </div>
        )}
        <div className="mt-6">
          <AdminAuditTable events={result.events} />
        </div>
      </div>
    </div>
  );
}
