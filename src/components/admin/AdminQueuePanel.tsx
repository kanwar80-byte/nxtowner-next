import Link from 'next/link';
import { QueueItem } from '@/lib/admin/adminQueues';
import { ArrowRight, AlertCircle } from 'lucide-react';

interface AdminQueuePanelProps {
  title: string;
  items: QueueItem[];
  href: string;
  emptyMessage?: string;
}

export default function AdminQueuePanel({
  title,
  items,
  href,
  emptyMessage = 'No items in this queue',
}: AdminQueuePanelProps) {
  return (
    <div className="rounded-xl border bg-white p-5 shadow-sm">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-slate-900">{title}</h3>
        <Link
          href={href}
          className="text-sm text-blue-600 hover:text-blue-700 font-medium flex items-center gap-1"
        >
          View all
          <ArrowRight size={14} />
        </Link>
      </div>

      {items.length === 0 ? (
        <div className="py-8 text-center">
          <AlertCircle className="w-8 h-8 text-slate-300 mx-auto mb-2" />
          <p className="text-sm text-slate-500">{emptyMessage}</p>
        </div>
      ) : (
        <ul className="space-y-2">
          {items.map((item) => (
            <li
              key={item.id}
              className="flex items-start justify-between p-3 rounded-lg hover:bg-slate-50 transition-colors"
            >
              <div className="flex-1 min-w-0">
                <div className="text-sm font-medium text-slate-900 truncate">
                  {item.title}
                </div>
                {item.subtitle && (
                  <div className="text-xs text-slate-500 mt-1">{item.subtitle}</div>
                )}
                {item.created_at && (
                  <div className="text-xs text-slate-400 mt-1">
                    {new Date(item.created_at).toLocaleDateString()}
                  </div>
                )}
              </div>
              <Link
                href={href}
                className="ml-3 text-slate-400 hover:text-slate-600 transition-colors"
              >
                <ArrowRight size={16} />
              </Link>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}


