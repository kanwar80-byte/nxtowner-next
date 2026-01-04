import { Suspense } from 'react';
import { checkAdmin } from '@/lib/auth/requireAdmin';
import AdminShell from '@/components/admin/AdminShell';
import AccessDenied from '@/components/admin/AccessDenied';

export const dynamic = "force-dynamic";

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { isAdmin } = await checkAdmin();

  if (!isAdmin) {
    return <AccessDenied />;
  }

  return (
    <AdminShell>
      <Suspense fallback={<div className="p-6 text-sm text-slate-500">Loading…</div>}>
        {children}
      </Suspense>
    </AdminShell>
  );
}

