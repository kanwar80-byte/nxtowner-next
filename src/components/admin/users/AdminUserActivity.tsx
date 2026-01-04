import { UserDetail } from '@/lib/admin/usersRepo';

interface AdminUserActivityProps {
  activity: UserDetail['activity'];
}

export default function AdminUserActivity({ activity }: AdminUserActivityProps) {
  const items = [
    { label: 'Listings Viewed', value: activity.listingsViewed ?? 0 },
    { label: 'Searches', value: activity.searches ?? 0 },
    { label: 'NDAs Signed', value: activity.ndasSigned ?? 0 },
    { label: 'Enquiries Sent', value: activity.enquiriesSent ?? 0 },
    { label: 'Deal Rooms Involved', value: activity.dealRoomsInvolved ?? 0 },
  ];

  return (
    <div className="rounded-xl border bg-white p-5 shadow-sm">
      <h3 className="text-lg font-semibold text-slate-900 mb-4">Activity Snapshot</h3>
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
        {items.map((item) => (
          <div key={item.label} className="text-center">
            <div className="text-2xl font-bold text-slate-900">{item.value}</div>
            <div className="text-xs text-slate-500 mt-1">{item.label}</div>
          </div>
        ))}
      </div>
    </div>
  );
}


