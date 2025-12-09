'use client';

import { useEffect, useState } from 'react';
import { getListingLeadsForSeller } from '@/app/actions/leads';
import Link from 'next/link';

interface SellerLead {
  id: string;
  listing_id: string;
  buyer_id: string;
  message: string | null;
  status: string;
  created_at: string;
  listing?: { title: string; id: string };
  buyer?: { full_name: string };
}

export default function SellerLeadsSection() {
  const [leads, setLeads] = useState<SellerLead[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadLeads() {
      try {
        const data = await getListingLeadsForSeller();
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
        <p>You don&apos;t have any buyer leads yet.</p>
        <p className="text-sm mt-2">Once buyers express interest, they&apos;ll appear here.</p>
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
          <div className="flex items-start justify-between gap-4">
            <div className="flex-1">
              <div>
                <p className="font-semibold text-gray-900">{lead.buyer?.full_name}</p>
                <p className="text-sm text-gray-600 mt-0.5">
                  interested in{' '}
                  <Link
                    href={`/listing/${lead.listing_id}`}
                    className="text-orange-600 hover:underline font-medium"
                  >
                    {lead.listing?.title}
                  </Link>
                </p>
              </div>
              {lead.message && (
                <>
                  <p className="text-gray-600 text-sm">This buyer&apos;s interested. Here&apos;s their message:</p>
                  <p className="text-sm text-gray-600 mt-2 bg-gray-50 p-3 rounded border border-gray-100">
                    &quot;{lead.message}&quot;
                  </p>
                </>
              )}
              <p className="text-xs text-gray-500 mt-2">
                {new Date(lead.created_at).toLocaleDateString('en-CA')}
              </p>
            </div>
            <span
              className={`px-3 py-1 rounded-full text-xs font-semibold whitespace-nowrap ${
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
