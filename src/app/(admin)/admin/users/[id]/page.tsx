import { notFound } from 'next/navigation';
import { getUserDetail } from '@/lib/admin/usersRepo';
import AdminUserHeader from '@/components/admin/users/AdminUserHeader';
import AdminUserActivity from '@/components/admin/users/AdminUserActivity';
import AdminUserEntities from '@/components/admin/users/AdminUserEntities';

interface AdminUserDetailPageProps {
  params: {
    id: string;
  };
}

export default async function AdminUserDetailPage({ params }: AdminUserDetailPageProps) {
  const user = await getUserDetail(params.id);

  if (!user) {
    notFound();
  }

  return (
    <div className="p-6">
      <AdminUserHeader user={user} />

      <div className="space-y-6">
        <div className="rounded-xl border bg-white p-5 shadow-sm">
          <h3 className="text-lg font-semibold text-slate-900 mb-4">Profile</h3>
          <dl className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <dt className="text-sm font-medium text-slate-500">Role</dt>
              <dd className="mt-1 text-sm text-slate-900">{user.role || 'N/A'}</dd>
            </div>
            <div>
              <dt className="text-sm font-medium text-slate-500">Subscription Tier</dt>
              <dd className="mt-1 text-sm text-slate-900">{user.subscription_tier || 'N/A'}</dd>
            </div>
            <div>
              <dt className="text-sm font-medium text-slate-500">Status</dt>
              <dd className="mt-1 text-sm text-slate-900">
                {user.is_verified ? 'Verified' : 'Unverified'}
              </dd>
            </div>
            <div>
              <dt className="text-sm font-medium text-slate-500">Created At</dt>
              <dd className="mt-1 text-sm text-slate-900">
                {user.created_at
                  ? new Date(user.created_at).toLocaleString()
                  : 'N/A'}
              </dd>
            </div>
            {user.last_sign_in && (
              <div>
                <dt className="text-sm font-medium text-slate-500">Last Sign In</dt>
                <dd className="mt-1 text-sm text-slate-900">
                  {new Date(user.last_sign_in).toLocaleString()}
                </dd>
              </div>
            )}
          </dl>
        </div>

        <AdminUserActivity activity={user.activity} />
        <AdminUserEntities userId={user.id} entities={user.entities} />
      </div>
    </div>
  );
}




