import { Suspense } from 'react';
import { getUsersList } from '@/lib/admin/usersRepo';
import AdminUsersTable from '@/components/admin/users/AdminUsersTable';
import AdminUsersFilters from '@/components/admin/users/AdminUsersFilters';

interface AdminUsersPageProps {
  searchParams: {
    search?: string;
    role?: string;
    tier?: string;
    status?: string;
  };
}

export default async function AdminUsersPage({ searchParams }: AdminUsersPageProps) {
  const filters = {
    search: searchParams.search,
    role: searchParams.role,
    tier: searchParams.tier,
    status: searchParams.status,
  };

  const users = await getUsersList(filters);

  return (
    <div className="p-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-slate-900">Admin • Users</h1>
        <p className="text-slate-600 mt-1">View user accounts, manage permissions, and handle disputes.</p>
      </div>

      <div className="rounded-2xl border bg-white p-6 shadow-sm">
        <Suspense fallback={<div className="text-slate-500">Loading filters...</div>}>
          <AdminUsersFilters />
        </Suspense>
        <div className="mt-6">
          <AdminUsersTable users={users} />
        </div>
      </div>
    </div>
  );
}
