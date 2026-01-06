'use client';

import { useRouter, useSearchParams } from 'next/navigation';
import { useState, useTransition } from 'react';
import { Search, Filter } from 'lucide-react';

export default function AdminUsersFilters() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [isPending, startTransition] = useTransition();

  const [search, setSearch] = useState(searchParams.get('search') || '');
  const [role, setRole] = useState(searchParams.get('role') || 'all');
  const [tier, setTier] = useState(searchParams.get('tier') || 'all');
  const [status, setStatus] = useState(searchParams.get('status') || 'all');

  const updateFilters = () => {
    startTransition(() => {
      const params = new URLSearchParams();
      if (search) params.set('search', search);
      if (role && role !== 'all') params.set('role', role);
      if (tier && tier !== 'all') params.set('tier', tier);
      if (status && status !== 'all') params.set('status', status);
      router.push(`/admin/users?${params.toString()}`);
    });
  };

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    updateFilters();
  };

  return (
    <div className="space-y-4">
      <form onSubmit={handleSearchSubmit} className="flex gap-2">
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by email or name..."
            className="w-full pl-10 pr-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>
        <button
          type="submit"
          disabled={isPending}
          className="px-4 py-2 bg-slate-900 text-white rounded-lg hover:bg-slate-800 disabled:opacity-50"
        >
          Search
        </button>
      </form>

      <div className="flex flex-wrap gap-4 items-center">
        <div className="flex items-center gap-2">
          <Filter className="w-4 h-4 text-slate-500" />
          <span className="text-sm font-medium text-slate-700">Filters:</span>
        </div>

        <select
          value={role}
          onChange={(e) => {
            setRole(e.target.value);
            updateFilters();
          }}
          className="px-3 py-1.5 border border-slate-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500"
        >
          <option value="all">All Roles</option>
          <option value="buyer">Buyer</option>
          <option value="seller">Seller</option>
          <option value="partner">Partner</option>
          <option value="admin">Admin</option>
        </select>

        <select
          value={tier}
          onChange={(e) => {
            setTier(e.target.value);
            updateFilters();
          }}
          className="px-3 py-1.5 border border-slate-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500"
        >
          <option value="all">All Tiers</option>
          <option value="free">Free</option>
          <option value="pro">Pro</option>
          <option value="enterprise">Enterprise</option>
        </select>

        <select
          value={status}
          onChange={(e) => {
            setStatus(e.target.value);
            updateFilters();
          }}
          className="px-3 py-1.5 border border-slate-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500"
        >
          <option value="all">All Status</option>
          <option value="verified">Verified</option>
          <option value="unverified">Unverified</option>
        </select>
      </div>
    </div>
  );
}




