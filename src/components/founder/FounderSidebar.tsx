'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  LayoutDashboard,
  Store,
  TrendingUp,
  Users,
  DollarSign,
  Briefcase,
  Shield,
  FileText,
  Target,
} from 'lucide-react';

const navItems = [
  { href: '/founder', label: 'Executive Overview', icon: LayoutDashboard },
  { href: '/founder/marketplace', label: 'Marketplace', icon: Store },
  { href: '/founder/funnels', label: 'Funnels', icon: TrendingUp },
  { href: '/founder/engagement', label: 'Engagement', icon: Users },
  { href: '/founder/revenue', label: 'Revenue', icon: DollarSign },
  { href: '/founder/deals', label: 'Deals', icon: Briefcase },
  { href: '/founder/risk', label: 'Risk', icon: Shield },
  { href: '/founder/ai-report', label: 'AI Report', icon: FileText },
  { href: '/founder/strategy', label: 'Strategy', icon: Target },
];

export default function FounderSidebar() {
  const pathname = usePathname();

  return (
    <aside className="w-64 bg-slate-900 text-white min-h-screen">
      <nav className="p-4">
        <ul className="space-y-1">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = pathname === item.href || (item.href !== '/founder' && pathname?.startsWith(item.href));
            
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

