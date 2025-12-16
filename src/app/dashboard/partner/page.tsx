
import React from 'react';
import { getPartnerDashboardData, PartnerReferral } from '@/app/actions/getPartnerDashboardData';
import { Users, DollarSign, Send, ArrowRight, TrendingUp } from 'lucide-react';
import Link from 'next/link';

const StatCard = ({ title, value, icon: Icon, colorClass = "text-blue-600" }: { title: string, value: string | number, icon: React.ElementType, colorClass?: string }) => (
    <div className="bg-white p-6 rounded-xl shadow-md border border-gray-100">
        <div className={`p-3 rounded-full inline-flex mb-4 ${colorClass} bg-opacity-10`} style={{ backgroundColor: `${colorClass}20` }}>
            <Icon size={24} className={colorClass} />
        </div>
        <p className="text-sm font-medium text-gray-500 uppercase">{title}</p>
        <p className="text-3xl font-bold text-gray-900 mt-1">{value}</p>
    </div>
);

const ReferralRow = ({ referral }: { referral: PartnerReferral }) => {
    const statusColors = {
        'Active': 'text-blue-600 bg-blue-50',
        'Pending': 'text-yellow-600 bg-yellow-50',
        'Closed': 'text-green-600 bg-green-50',
    };
    const statusColor = statusColors[referral.status] || 'text-gray-600 bg-gray-50';
    
    const formatMoney = (amount: number) => `$${amount.toLocaleString()}`;

    return (
        <div className="flex items-center p-4 border-b border-gray-100 last:border-b-0 hover:bg-gray-50 transition-colors">
            
            <div className="w-1/4 min-w-0">
                <span className="font-semibold text-gray-900 truncate block">
                    {referral.listingTitle || `New ${referral.type} Referral`}
                </span>
                <span className="text-xs text-gray-500">{referral.referralId}</span>
            </div>
            
            <div className="w-1/6 text-center text-sm font-bold text-gray-700">{referral.type}</div>

            <div className="w-1/6 text-center">
                <span className={`px-2 py-1 text-xs font-medium rounded-full ${statusColor}`}>
                    {referral.status}
                </span>
            </div>
            
            <div className="w-1/4 text-right text-sm font-medium text-gray-700">
                {referral.status === 'Closed' ? formatMoney(referral.potentialCommission) : '---'}
            </div>
            
            <div className="w-1/6 text-right">
                <Link href={`/partner/referral/${referral.referralId}`} className="text-xs font-semibold text-[#F97316] hover:text-orange-600 transition-colors">
                    View Details
                </Link>
            </div>
        </div>
    );
};


export default async function PartnerDashboardPage() {
    const data = await getPartnerDashboardData();

    if (!data) {
        // Handle non-logged-in or unauthorized users
        return <div className="p-10 text-center">Please log in as a Partner to view this dashboard.</div>;
    }

    return (
        <div className="min-h-screen bg-gray-50 pt-16">
            <div className="max-w-7xl mx-auto px-4 py-8">
                
                {/* Dashboard Header */}
                <div className="flex justify-between items-center mb-8">
                    <h1 className="text-3xl font-bold text-[#0B1120]">Partner Dashboard</h1>
                    <Link href="/partner/profile/edit" className="bg-[#F97316] text-white px-4 py-2 rounded-lg font-semibold hover:bg-orange-600 transition-colors">
                        Edit Profile
                    </Link>
                </div>

                {/* KPI Cards */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
                    <StatCard 
                        title="Active Leads" 
                        value={data.totalActiveLeads} 
                        icon={Send} 
                        colorClass="text-indigo-600" 
                    />
                    <StatCard 
                        title="Profile Views" 
                        value={data.profileViews} 
                        icon={Users} 
                        colorClass="text-blue-600" 
                    />
                    <StatCard 
                        title="Est. Monthly Earnings" 
                        value={`$${data.estimatedMonthlyEarnings.toLocaleString()}`} 
                        icon={DollarSign} 
                        colorClass="text-green-600" 
                    />
                    <StatCard 
                        title="Closed Referrals (YTD)" 
                        value={data.totalReferralsClosed} 
                        icon={TrendingUp} 
                        colorClass="text-purple-600" 
                    />
                </div>

                {/* Active Referrals Table */}
                <div className="bg-white rounded-xl shadow-xl border border-gray-100 overflow-hidden">
                    <h2 className="text-xl font-bold p-6 border-b text-[#0B1120] flex items-center gap-2">
                        <DollarSign size={20} /> Active Referral Pipeline
                    </h2>
                    
                    {/* Table Header */}
                    <div className="flex p-4 bg-gray-50 text-xs uppercase font-semibold text-gray-500">
                        <div className="w-1/4">Deal / Client</div>
                        <div className="w-1/6 text-center">Type</div>
                        <div className="w-1/6 text-center">Status</div>
                        <div className="w-1/4 text-right">Commission (Est.)</div>
                        <div className="w-1/6 text-right">Action</div>
                    </div>

                    {/* Referral Rows */}
                    <div>
                        {data.activeReferrals.length > 0 ? (
                            data.activeReferrals.map(referral => (
                                <ReferralRow key={referral.referralId} referral={referral} />
                            ))
                        ) : (
                            <div className="p-8 text-center text-gray-500">
                                No active referrals. Check the Partner Directory for new leads!
                            </div>
                        )}
                    </div>
                    
                    <div className="p-4 border-t text-sm text-gray-500">
                        *Commission amounts are estimated based on deal size and platform fee structure.
                    </div>
                </div>

                {/* Call to action for Enterprise features */}
                <div className="mt-10 p-8 bg-blue-50 rounded-xl border border-blue-200 text-center">
                    <h2 className="text-xl font-bold text-blue-900 flex items-center justify-center gap-2 mb-3">
                        <TrendingUp size={24} /> API & CRM Integrations (Enterprise Partner)
                    </h2>
                    <p className="text-blue-800 mb-4">
                        Upgrade to **Enterprise Partner** for API access, CRM synchronization, and custom deal flow reporting.
                    </p>
                    <Link href="/partner/enterprise" className="bg-blue-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors shadow-md">
                        Contact Sales for Enterprise
                    </Link>
                </div>

            </div>
        </div>
    );
}
