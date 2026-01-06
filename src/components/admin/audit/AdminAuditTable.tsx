import { AuditEvent } from '@/lib/audit/types';

interface AdminAuditTableProps {
  events: AuditEvent[];
}

export default function AdminAuditTable({ events }: AdminAuditTableProps) {
  if (events.length === 0) {
    return (
      <div className="py-12 text-center">
        <p className="text-slate-500">No audit events found.</p>
        <p className="text-sm text-slate-400 mt-2">
          The audit_events table may not exist yet, or there are no events to display.
        </p>
      </div>
    );
  }

  const formatAction = (action: string) => {
    return action
      .split('_')
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ');
  };

  return (
    <div className="overflow-x-auto">
      <table className="w-full">
        <thead className="bg-slate-50 border-b border-slate-200">
          <tr>
            <th className="px-4 py-3 text-left text-xs font-semibold text-slate-700 uppercase tracking-wider">
              Timestamp
            </th>
            <th className="px-4 py-3 text-left text-xs font-semibold text-slate-700 uppercase tracking-wider">
              Actor
            </th>
            <th className="px-4 py-3 text-left text-xs font-semibold text-slate-700 uppercase tracking-wider">
              Action
            </th>
            <th className="px-4 py-3 text-left text-xs font-semibold text-slate-700 uppercase tracking-wider">
              Entity
            </th>
            <th className="px-4 py-3 text-left text-xs font-semibold text-slate-700 uppercase tracking-wider">
              Details
            </th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-slate-200">
          {events.map((event) => (
            <tr key={event.id} className="hover:bg-slate-50">
              <td className="px-4 py-3 text-sm text-slate-600">
                {new Date(event.created_at).toLocaleString()}
              </td>
              <td className="px-4 py-3">
                <div className="text-sm font-medium text-slate-900">
                  {event.actor_name || event.actor_email || 'System'}
                </div>
                {event.actor_email && event.actor_name && (
                  <div className="text-xs text-slate-500">{event.actor_email}</div>
                )}
              </td>
              <td className="px-4 py-3">
                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                  {formatAction(event.action)}
                </span>
              </td>
              <td className="px-4 py-3 text-sm text-slate-600">
                {event.entity_type && event.entity_id ? (
                  <div>
                    <div className="font-medium">{event.entity_type}</div>
                    <div className="text-xs text-slate-400 font-mono">
                      {event.entity_id.substring(0, 8)}...
                    </div>
                  </div>
                ) : (
                  <span className="text-slate-400">—</span>
                )}
              </td>
              <td className="px-4 py-3 text-sm text-slate-600">
                {event.details ? (
                  <details className="cursor-pointer">
                    <summary className="text-blue-600 hover:text-blue-700">
                      View details
                    </summary>
                    <pre className="mt-2 text-xs bg-slate-50 p-2 rounded overflow-auto max-w-md">
                      {JSON.stringify(event.details, null, 2)}
                    </pre>
                  </details>
                ) : (
                  <span className="text-slate-400">—</span>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}




