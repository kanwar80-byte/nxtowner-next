'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  LayoutDashboard,
  FileText,
  Users,
  MessageSquare,
  FileCheck,
  Briefcase,
  Handshake,
  CreditCard,
  FileEdit,
  Settings,
  History,
} from 'lucide-react';

const navItems = [
  { href: '/admin', label: 'Overview', icon: LayoutDashboard },
  { href: '/admin/listings', label: 'Listings', icon: FileText },
  { href: '/admin/users', label: 'Users', icon: Users },
  { href: '/admin/leads', label: 'Leads', icon: MessageSquare },
  { href: '/admin/ndas', label: 'NDAs', icon: FileCheck },
  { href: '/admin/deal-rooms', label: 'Deal Rooms', icon: Briefcase },
  { href: '/admin/partners', label: 'Partners', icon: Handshake },
  { href: '/admin/monetization', label: 'Monetization', icon: CreditCard },
  { href: '/admin/content', label: 'Content', icon: FileEdit },
  { href: '/admin/system', label: 'System', icon: Settings },
  { href: '/admin/audit-log', label: 'Audit Log', icon: History },
];

export default function AdminSidebar() {
  const pathname = usePathname();

  return (
    <aside className="w-64 bg-slate-900 text-white min-h-screen">
      <nav className="p-4">
        <ul className="space-y-1">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = pathname === item.href || (item.href !== '/admin' && pathname?.startsWith(item.href));
            
            return (
              <li key={item.href}>
                <Link
                  href={item.href}
                  className={`flex items-center gap-3 px-4 py-2 rounded-lg transition-colors ${
                    isActive
                      ? 'bg-slate-800 text-white'
                      : 'text-slate-300 hover:bg-slate-800 hover:text-white'
                  }`}
                >
                  <Icon size={18} />
                  <span className="text-sm font-medium">{item.label}</span>
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>
    </aside>
  );
}




