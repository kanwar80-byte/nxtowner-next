import { UserDetail } from '@/lib/admin/usersRepo';
import Link from 'next/link';
import { FileText, MessageSquare, FileCheck, Briefcase } from 'lucide-react';

interface AdminUserEntitiesProps {
  userId: string;
  entities: UserDetail['entities'];
}

export default function AdminUserEntities({ userId, entities }: AdminUserEntitiesProps) {
  const items = [
    {
      label: 'Listings Owned',
      value: entities.listingsOwned ?? 0,
      icon: FileText,
      href: `/admin/listings?owner_id=${userId}`,
    },
    {
      label: 'Leads',
      value: entities.leads ?? 0,
      icon: MessageSquare,
      href: `/admin/leads?user_id=${userId}`,
    },
    {
      label: 'NDAs',
      value: entities.ndas ?? 0,
      icon: FileCheck,
      href: `/admin/ndas?user_id=${userId}`,
    },
    {
      label: 'Deal Rooms',
      value: entities.dealRooms ?? 0,
      icon: Briefcase,
      href: `/admin/deal-rooms?user_id=${userId}`,
    },
  ];

  return (
    <div className="rounded-xl border bg-white p-5 shadow-sm">
      <h3 className="text-lg font-semibold text-slate-900 mb-4">Entities</h3>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {items.map((item) => {
          const Icon = item.icon;
          const content = (
            <div className="text-center p-4 rounded-lg border border-slate-200 hover:bg-slate-50 transition-colors">
              <Icon className="w-6 h-6 text-slate-600 mx-auto mb-2" />
              <div className="text-2xl font-bold text-slate-900">{item.value}</div>
              <div className="text-xs text-slate-500 mt-1">{item.label}</div>
            </div>
          );

          if (item.value > 0) {
            return (
              <Link key={item.label} href={item.href} className="block">
                {content}
              </Link>
            );
          }

          return <div key={item.label}>{content}</div>;
        })}
      </div>
    </div>
  );
}




