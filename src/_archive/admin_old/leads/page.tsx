'use client';

import { useEffect, useState } from 'react';
import { getListingLeadsForAdmin, getPartnerLeadsForAdmin, updateListingLeadStatus, updatePartnerLeadStatus } from '@/app/actions/leads';
import { supabase } from '@/utils/supabase/client';
import { Mail, Phone } from 'lucide-react';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type ListingLead = any;
// eslint-disable-next-line @typescript-eslint/no-explicit-any
type PartnerLead = any;

export default function AdminLeadsPage() {
  const [listingLeads, setListingLeads] = useState<ListingLead[]>([]);
  const [partnerLeads, setPartnerLeads] = useState<PartnerLead[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [activeTab, setActiveTab] = useState<'listing' | 'partner'>('listing');
  const [listingFilter, setListingFilter] = useState<string>('all');
  const [partnerFilter, setPartnerFilter] = useState<string>('all');

  useEffect(() => {
    checkAdminAndLoadLeads();
  }, []);

  async function checkAdminAndLoadLeads() {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        setError('Not authenticated');
        return;
      }

      const { data: profile } = await supabase
        .from('profiles')
        .select('role')
        .eq('id', user.id)
        .single() as { data: { role: string } | null };

      if (!profile || profile.role !== 'admin') {
        setError('Admin access required');
        return;
      }

      setIsAdmin(true);

      // Load leads
      const [listings, partners] = await Promise.all([
        getListingLeadsForAdmin(),
        getPartnerLeadsForAdmin(),
      ]);

      setListingLeads(listings);
      setPartnerLeads(partners);
    } catch (err) {
      console.error('Error loading leads:', err);
      setError(err instanceof Error ? err.message : 'Failed to load leads');
    } finally {
      setLoading(false);
    }
  }

  async function handleListingLeadStatusChange(leadId: string, newStatus: string) {
    try {
      const result = await updateListingLeadStatus(
        leadId,
        newStatus as 'new' | 'contacted' | 'qualified' | 'closed_lost' | 'closed_won'
      );

      if (result.success) {
        setListingLeads((prev) =>
          prev.map((lead) =>
            lead.id === leadId ? { ...lead, status: newStatus } : lead
          )
        );
      } else {
        alert(result.error || 'Failed to update lead');
      }
    } catch {
      alert('Failed to update lead');
    }
  }

  async function handlePartnerLeadStatusChange(leadId: string, newStatus: string) {
    try {
      const result = await updatePartnerLeadStatus(
        leadId,
        newStatus as 'new' | 'contacted' | 'qualified' | 'closed_lost' | 'closed_won'
      );

      if (result.success) {
        setPartnerLeads((prev) =>
          prev.map((lead) =>
            lead.id === leadId ? { ...lead, status: newStatus } : lead
          )
        );
      } else {
        alert(result.error || 'Failed to update lead');
      }
    } catch {
      alert('Failed to update lead');
    }
  }

  const filteredListingLeads = listingFilter === 'all'
    ? listingLeads
    : listingLeads.filter((l) => l.status === listingFilter);

  const filteredPartnerLeads = partnerFilter === 'all'
    ? partnerLeads
    : partnerLeads.filter((l) => l.status === partnerFilter);

  const statusColors: Record<string, string> = {
    new: 'bg-blue-100 text-blue-800',
    contacted: 'bg-yellow-100 text-yellow-800',
    qualified: 'bg-purple-100 text-purple-800',
    closed_won: 'bg-green-100 text-green-800',
    closed_lost: 'bg-red-100 text-red-800',
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 py-12">
        <div className="max-w-7xl mx-auto px-4">Loading leads...</div>
      </div>
    );
  }

  if (!isAdmin) {
    return (
      <div className="min-h-screen bg-gray-50 py-12">
        <div className="max-w-7xl mx-auto px-4 text-red-600">{error || 'Access denied'}</div>
      </div>
    );
  }

  return (
    <main className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Lead Management</h1>
          <p className="text-gray-600 mt-2">
            Manage listing and partner leads from one dashboard
          </p>
        </div>

        {error && (
          <div className="mb-6 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
            {error}
          </div>
        )}

        {/* Tabs */}
        <div className="mb-6 flex gap-4 border-b border-gray-200">
          <button
            onClick={() => setActiveTab('listing')}
            className={`pb-4 font-medium transition ${
              activeTab === 'listing'
                ? 'border-b-2 border-orange-500 text-orange-600'
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            Listing Leads ({filteredListingLeads.length})
          </button>
          <button
            onClick={() => setActiveTab('partner')}
            className={`pb-4 font-medium transition ${
              activeTab === 'partner'
                ? 'border-b-2 border-green-500 text-green-600'
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            Partner Leads ({filteredPartnerLeads.length})
          </button>
        </div>

        {/* Listing Leads Tab */}
        {activeTab === 'listing' && (
          <div className="space-y-4">
            {/* Filter */}
            <div className="flex gap-2">
              {['all', 'new', 'contacted', 'qualified', 'closed_won', 'closed_lost'].map(
                (status) => (
                  <button
                    key={status}
                    onClick={() => setListingFilter(status)}
                    className={`px-4 py-2 rounded-lg text-sm font-medium transition ${
                      listingFilter === status
                        ? 'bg-orange-500 text-white'
                        : 'bg-white border border-gray-200 text-gray-700 hover:bg-gray-50'
                    }`}
                  >
                    {status === 'all' ? 'All' : status.replace(/_/g, ' ')}
                  </button>
                )
              )}
            </div>

            {/* Listing Leads Table */}
            <div className="bg-white rounded-lg shadow overflow-hidden">
              <table className="w-full">
                <thead className="bg-gray-50 border-b border-gray-200">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-semibold text-gray-900 uppercase">
                      Buyer
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-semibold text-gray-900 uppercase">
                      Listing
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-semibold text-gray-900 uppercase">
                      Message
                    </th>
                    <th className="px-6 py-3 text-center text-xs font-semibold text-gray-900 uppercase">
                      Status
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-semibold text-gray-900 uppercase">
                      Date
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {filteredListingLeads.map((lead) => (
                    <tr key={lead.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4">
                        <div>
                          <p className="font-medium text-gray-900">{lead.buyer?.full_name}</p>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <a
                          href={`/listing/${lead.listing_id}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-orange-600 hover:underline"
                        >
                          {lead.listing?.title}
                        </a>
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-600 max-w-md">
                        {lead.message ? (
                          <p className="line-clamp-2">{lead.message}</p>
                        ) : (
                          <span className="text-gray-400">—</span>
                        )}
                      </td>
                      <td className="px-6 py-4">
                        <select
                          value={lead.status}
                          onChange={(e) =>
                            handleListingLeadStatusChange(lead.id, e.target.value)
                          }
                          className={`px-3 py-1 rounded-full text-xs font-semibold border-0 cursor-pointer ${
                            statusColors[lead.status] || statusColors.new
                          }`}
                        >
                          <option value="new">New</option>
                          <option value="contacted">Contacted</option>
                          <option value="qualified">Qualified</option>
                          <option value="closed_won">Closed Won</option>
                          <option value="closed_lost">Closed Lost</option>
                        </select>
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-500">
                        {new Date(lead.created_at).toLocaleDateString('en-CA')}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>

              {filteredListingLeads.length === 0 && (
                <div className="text-center py-12 text-gray-500">
                  No listing leads found
                </div>
              )}
            </div>
          </div>
        )}

        {/* Partner Leads Tab */}
        {activeTab === 'partner' && (
          <div className="space-y-4">
            {/* Filter */}
            <div className="flex gap-2">
              {['all', 'new', 'contacted', 'qualified', 'closed_won', 'closed_lost'].map(
                (status) => (
                  <button
                    key={status}
                    onClick={() => setPartnerFilter(status)}
                    className={`px-4 py-2 rounded-lg text-sm font-medium transition ${
                      partnerFilter === status
                        ? 'bg-green-500 text-white'
                        : 'bg-white border border-gray-200 text-gray-700 hover:bg-gray-50'
                    }`}
                  >
                    {status === 'all' ? 'All' : status.replace(/_/g, ' ')}
                  </button>
                )
              )}
            </div>

            {/* Partner Leads Table */}
            <div className="bg-white rounded-lg shadow overflow-hidden">
              <table className="w-full">
                <thead className="bg-gray-50 border-b border-gray-200">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-semibold text-gray-900 uppercase">
                      Partner
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-semibold text-gray-900 uppercase">
                      Requester
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-semibold text-gray-900 uppercase">
                      Contact
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-semibold text-gray-900 uppercase">
                      Message
                    </th>
                    <th className="px-6 py-3 text-center text-xs font-semibold text-gray-900 uppercase">
                      Status
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-semibold text-gray-900 uppercase">
                      Date
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {filteredPartnerLeads.map((lead) => (
                    <tr key={lead.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4">
                        <p className="font-medium text-gray-900">{lead.partner?.firm_name}</p>
                      </td>
                      <td className="px-6 py-4">
                        <p className="font-medium text-gray-900">{lead.requester_name}</p>
                        {lead.requester?.full_name && (
                          <p className="text-sm text-gray-600">{lead.requester.full_name}</p>
                        )}
                      </td>
                      <td className="px-6 py-4 text-sm">
                        <div className="space-y-1">
                          <div className="flex items-center gap-2 text-gray-600">
                            <Mail className="w-4 h-4" />
                            <a href={`mailto:${lead.requester_email}`} className="hover:underline">
                              {lead.requester_email}
                            </a>
                          </div>
                          {lead.requester_phone && (
                            <div className="flex items-center gap-2 text-gray-600">
                              <Phone className="w-4 h-4" />
                              <a href={`tel:${lead.requester_phone}`} className="hover:underline">
                                {lead.requester_phone}
                              </a>
                            </div>
                          )}
                        </div>
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-600 max-w-xs">
                        {lead.message ? (
                          <p className="line-clamp-2">{lead.message}</p>
                        ) : (
                          <span className="text-gray-400">—</span>
                        )}
                      </td>
                      <td className="px-6 py-4">
                        <select
                          value={lead.status}
                          onChange={(e) =>
                            handlePartnerLeadStatusChange(lead.id, e.target.value)
                          }
                          className={`px-3 py-1 rounded-full text-xs font-semibold border-0 cursor-pointer ${
                            statusColors[lead.status] || statusColors.new
                          }`}
                        >
                          <option value="new">New</option>
                          <option value="contacted">Contacted</option>
                          <option value="qualified">Qualified</option>
                          <option value="closed_won">Closed Won</option>
                          <option value="closed_lost">Closed Lost</option>
                        </select>
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-500">
                        {new Date(lead.created_at).toLocaleDateString('en-CA')}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>

              {filteredPartnerLeads.length === 0 && (
                <div className="text-center py-12 text-gray-500">
                  No partner leads found
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </main>
  );
}
