'use client';

import { useRouter, useSearchParams } from 'next/navigation';
import { useState, useTransition } from 'react';
import { Filter, Calendar } from 'lucide-react';
import { AuditAction } from '@/lib/audit/types';

const AUDIT_ACTIONS: { value: AuditAction | 'all'; label: string }[] = [
  { value: 'all', label: 'All Actions' },
  { value: 'listing_approved', label: 'Listing Approved' },
  { value: 'listing_suspended', label: 'Listing Suspended' },
  { value: 'listing_removed', label: 'Listing Removed' },
  { value: 'user_suspended', label: 'User Suspended' },
  { value: 'user_banned', label: 'User Banned' },
  { value: 'user_role_changed', label: 'User Role Changed' },
  { value: 'nda_approved', label: 'NDA Approved' },
  { value: 'nda_revoked', label: 'NDA Revoked' },
  { value: 'deal_room_created', label: 'Deal Room Created' },
  { value: 'deal_room_closed', label: 'Deal Room Closed' },
  { value: 'payment_refunded', label: 'Payment Refunded' },
  { value: 'content_updated', label: 'Content Updated' },
  { value: 'system_config_changed', label: 'System Config Changed' },
  { value: 'other', label: 'Other' },
];

/**
 * Validates and normalizes a query param string to a valid AuditAction or 'all'.
 * Returns 'all' if the param is missing, invalid, or not a known action.
 */
function validateAuditAction(param: string | null): AuditAction | 'all' {
  if (param === null || param === '') {
    return 'all';
  }
  
  // Check if it's 'all'
  if (param === 'all') {
    return 'all';
  }
  
  // Check if it's a valid AuditAction by checking against AUDIT_ACTIONS
  const isValidAction = AUDIT_ACTIONS.some(opt => opt.value === param);
  return isValidAction ? (param as AuditAction) : 'all';
}

export default function AdminAuditFilters() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [isPending, startTransition] = useTransition();

  const [action, setAction] = useState<AuditAction | 'all'>(() => 
    validateAuditAction(searchParams.get('action'))
  );
  const [startDate, setStartDate] = useState(searchParams.get('start_date') || '');
  const [endDate, setEndDate] = useState(searchParams.get('end_date') || '');

  const updateFilters = () => {
    startTransition(() => {
      const params = new URLSearchParams();
      if (action && action !== 'all') params.set('action', action);
      if (startDate) params.set('start_date', startDate);
      if (endDate) params.set('end_date', endDate);
      router.push(`/admin/audit-log?${params.toString()}`);
    });
  };

  const clearFilters = () => {
    setAction('all');
    setStartDate('');
    setEndDate('');
    startTransition(() => {
      router.push('/admin/audit-log');
    });
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2 mb-4">
        <Filter className="w-4 h-4 text-slate-500" />
        <span className="text-sm font-medium text-slate-700">Filters</span>
      </div>

      <div className="flex flex-wrap gap-4 items-end">
        <div className="flex-1 min-w-[200px]">
          <label className="block text-sm font-medium text-slate-700 mb-1">Action</label>
          <select
            value={action}
            onChange={(e) => {
              setAction(e.target.value as AuditAction | 'all');
              updateFilters();
            }}
            className="w-full px-3 py-1.5 border border-slate-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500"
          >
            {AUDIT_ACTIONS.map((opt) => (
              <option key={opt.value} value={opt.value}>
                {opt.label}
              </option>
            ))}
          </select>
        </div>

        <div className="flex-1 min-w-[200px]">
          <label className="block text-sm font-medium text-slate-700 mb-1 flex items-center gap-1">
            <Calendar className="w-3 h-3" />
            Start Date
          </label>
          <input
            type="date"
            value={startDate}
            onChange={(e) => {
              setStartDate(e.target.value);
              updateFilters();
            }}
            className="w-full px-3 py-1.5 border border-slate-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div className="flex-1 min-w-[200px]">
          <label className="block text-sm font-medium text-slate-700 mb-1 flex items-center gap-1">
            <Calendar className="w-3 h-3" />
            End Date
          </label>
          <input
            type="date"
            value={endDate}
            onChange={(e) => {
              setEndDate(e.target.value);
              updateFilters();
            }}
            className="w-full px-3 py-1.5 border border-slate-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <button
          onClick={clearFilters}
          className="px-4 py-1.5 text-sm text-slate-600 hover:text-slate-900 border border-slate-300 rounded-lg hover:bg-slate-50 transition-colors"
        >
          Clear
        </button>
      </div>
    </div>
  );
}

