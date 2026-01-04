import { UserDetail } from '@/lib/admin/usersRepo';
import { ArrowLeft } from 'lucide-react';
import Link from 'next/link';

interface AdminUserHeaderProps {
  user: UserDetail;
}

export default function AdminUserHeader({ user }: AdminUserHeaderProps) {
  return (
    <div className="mb-6">
      <Link
        href="/admin/users"
        className="inline-flex items-center gap-2 text-sm text-slate-600 hover:text-slate-900 mb-4"
      >
        <ArrowLeft size={16} />
        Back to Users
      </Link>
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">
            {user.full_name || 'No name'}
          </h1>
          <p className="text-slate-600 mt-1">{user.email || 'No email'}</p>
        </div>
        <div className="flex items-center gap-2">
          {user.role && (
            <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-blue-100 text-blue-800">
              {user.role}
            </span>
          )}
          {user.is_verified ? (
            <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-green-100 text-green-800">
              Verified
            </span>
          ) : (
            <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-slate-100 text-slate-800">
              Unverified
            </span>
          )}
        </div>
      </div>
    </div>
  );
}


