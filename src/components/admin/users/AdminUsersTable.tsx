import { UserTableRow } from "@/lib/admin/queries";
import { UserListItem } from "@/lib/admin/usersRepo";

interface AdminUsersTableProps {
  users: UserTableRow[] | UserListItem[];
}

export default function AdminUsersTable({ users }: AdminUsersTableProps) {
  const formatDate = (dateStr: string | null): string => {
    if (!dateStr) return "-";
    try {
      return new Date(dateStr).toLocaleDateString("en-US", {
        year: "numeric",
        month: "short",
        day: "numeric",
      });
    } catch {
      return "-";
    }
  };

  const formatDateTime = (dateStr: string | null): string => {
    if (!dateStr) return "-";
    try {
      return new Date(dateStr).toLocaleString("en-US", {
        year: "numeric",
        month: "short",
        day: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      });
    } catch {
      return "-";
    }
  };

  if (users.length === 0) {
    return (
      <div className="py-12 text-center">
        <p className="text-slate-500">No users found.</p>
      </div>
    );
  }

  return (
    <div className="overflow-x-auto rounded-lg border border-slate-200">
      <table className="w-full">
        <thead className="bg-slate-50 border-b border-slate-200">
          <tr>
            <th className="px-4 py-3 text-left text-xs font-semibold text-slate-700 uppercase tracking-wider">
              Created
            </th>
            <th className="px-4 py-3 text-left text-xs font-semibold text-slate-700 uppercase tracking-wider">
              Email
            </th>
            <th className="px-4 py-3 text-left text-xs font-semibold text-slate-700 uppercase tracking-wider">
              Role
            </th>
            <th className="px-4 py-3 text-left text-xs font-semibold text-slate-700 uppercase tracking-wider">
              Tier
            </th>
            <th className="px-4 py-3 text-left text-xs font-semibold text-slate-700 uppercase tracking-wider">
              Health
            </th>
            <th className="px-4 py-3 text-left text-xs font-semibold text-slate-700 uppercase tracking-wider">
              Last Sign In
            </th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-slate-200">
          {users.map((user) => {
            // Handle both UserTableRow and UserListItem types
            const userRow = user as UserTableRow | UserListItem;
            const tier = 'tier' in userRow ? userRow.tier : ('subscription_tier' in userRow ? userRow.subscription_tier : null);
            const profileHealth = 'profile_health' in userRow ? userRow.profile_health : null;
            const lastSignIn = 'last_sign_in_at' in userRow ? userRow.last_sign_in_at : ('last_sign_in' in userRow ? userRow.last_sign_in : null);
            const fullName = 'full_name' in userRow ? userRow.full_name : null;
            
            return (
              <tr key={user.id} className="hover:bg-slate-50 transition-colors">
                <td className="px-4 py-3 text-sm text-slate-600">
                  {formatDate(userRow.created_at)}
                </td>
                <td className="px-4 py-3">
                  <div className="text-sm font-medium text-slate-900">
                    {userRow.email || "-"}
                  </div>
                  {fullName && (
                    <div className="text-xs text-slate-500">{fullName}</div>
                  )}
                </td>
                <td className="px-4 py-3">
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                    {userRow.role || "-"}
                  </span>
                </td>
                <td className="px-4 py-3 text-sm text-slate-600">
                  {tier || "-"}
                </td>
                <td className="px-4 py-3 text-sm text-slate-600">
                  {profileHealth || "-"}
                </td>
                <td className="px-4 py-3 text-sm text-slate-600">
                  {formatDateTime(lastSignIn ?? null)}
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
