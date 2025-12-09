'use client';

import { useEffect, useState } from 'react';
import { getListingLeadsForBuyer } from '@/app/actions/leads';
import Link from 'next/link';

interface BuyerLead {
  id: string;
  listing_id: string;
  status: string;
  created_at: string;
  listing?: { title: string; id: string };
}

export default function BuyerLeadsSection() {
  const [leads, setLeads] = useState<BuyerLead[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadLeads() {
      try {
        const data = await getListingLeadsForBuyer();
        setLeads(data);
      } catch (error) {
        console.error('Failed to load leads:', error);
      } finally {
        setLoading(false);
      }
    }

    loadLeads();
  }, []);

  if (loading) {
    return <div className="text-gray-500">Loading leads...</div>;
  }

  if (leads.length === 0) {
    return (
      <div className="text-center py-8 text-gray-500">
        <p>You haven&apos;t expressed interest in any listings yet.</p>
        <Link href="/browse" className="text-orange-600 hover:underline font-medium mt-2 inline-block">
          Browse listings →
        </Link>
      </div>
    );
  }

  const statusColors: Record<string, string> = {
    new: 'bg-blue-100 text-blue-800',
    contacted: 'bg-yellow-100 text-yellow-800',
    qualified: 'bg-purple-100 text-purple-800',
    closed_won: 'bg-green-100 text-green-800',
    closed_lost: 'bg-red-100 text-red-800',
  };

  return (
    <div className="space-y-4">
      {leads.map((lead) => (
        <div key={lead.id} className="bg-white border border-gray-200 rounded-lg p-4 hover:shadow-md transition">
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <Link
                href={`/listing/${lead.listing_id}`}
                className="font-semibold text-gray-900 hover:text-orange-600 transition"
              >
                {lead.listing?.title}
              </Link>
              <p className="text-sm text-gray-500 mt-1">
                {new Date(lead.created_at).toLocaleDateString('en-CA')}
              </p>
            </div>
            <span
              className={`px-3 py-1 rounded-full text-xs font-semibold ${
                statusColors[lead.status] || statusColors.new
              }`}
            >
              {lead.status}
            </span>
          </div>
        </div>
      ))}
    </div>
  );
}
