import React from 'react';
import { getAdminDashboardData, AdminSystemFlag } from '@/app/actions/getAdminDashboardData';
import { Users, FileText, TrendingUp, AlertTriangle, CheckCircle, Zap } from 'lucide-react';
import Link from 'next/link';

const StatCard = ({ title, value, icon: Icon, colorClass = "text-blue-600" }: { title: string, value: string | number, icon: React.ElementType, colorClass?: string }) => (
    <div className="bg-white p-6 rounded-xl shadow-md border border-gray-100">
        <div className={`p-3 rounded-full inline-flex mb-4 ${colorClass} bg-opacity-10`} style={{ backgroundColor: `${colorClass}20` }}>
            <Icon size={24} className={colorClass} />
        </div>
        <p className="text-sm font-medium text-gray-500 uppercase">{title}</p>
        <p className="text-3xl font-bold text-gray-900 mt-1">{typeof value === 'number' ? value.toLocaleString() : value}</p>
    </div>
);

const FlagRow = ({ flag }: { flag: AdminSystemFlag }) => {
    const severityColors = {
        'High': 'text-red-600 bg-red-50 border-red-300',
        'Medium': 'text-orange-600 bg-orange-50 border-orange-300',
        'Low': 'text-gray-600 bg-gray-50 border-gray-300',
    };
    const statusColor = flag.status === 'Open' ? 'text-red-600' : 'text-green-600';
    const actionText = flag.status === 'Open' ? 'Review' : 'View';

    return (
        <div className="flex items-center p-4 border-b border-gray-100 last:border-b-0 hover:bg-red-50 transition-colors">
            
            <div className="w-1/4 min-w-0">
                <span className={`px-2 py-0.5 text-xs font-bold rounded-full border ${severityColors[flag.severity]}`}> 
                    {flag.severity}
                </span>
                <span className="font-semibold text-gray-900 truncate block mt-1">{flag.description}</span>
            </div>
            
            <div className="w-1/6 text-center text-sm font-medium text-gray-700">{flag.type}</div>

            <div className="w-1/6 text-center text-sm font-medium text-gray-700">{flag.targetId}</div>
            
            <div className="w-1/4 text-center">
                 <span className={`flex items-center justify-center text-xs font-medium ${statusColor}`}>
                    {flag.status === 'Open' ? <AlertTriangle size={14} className="mr-1"/> : <CheckCircle size={14} className="mr-1"/>}
                    {flag.status}
                </span>
            </div>
            
            <div className="w-1/6 text-right">
                <Link href={`/admin/review/${flag.targetId}`} className="text-xs font-semibold text-[#0B1120] hover:text-blue-600 transition-colors">
                    {actionText}
                </Link>
            </div>
        </div>
    );
};


export default async function AdminDashboardPage() {
    const data = await getAdminDashboardData();

    if (!data) {
        // Handle non-admin access
        return <div className="p-10 text-center bg-red-100 text-red-800 rounded-lg">Access Denied. You must be an Administrator.</div>;
    }

    return (
        <div className="min-h-screen bg-gray-50 pt-16">
            <div className="max-w-7xl mx-auto px-4 py-8">
                
                {/* Dashboard Header */}
                <div className="flex justify-between items-center mb-8">
                    <h1 className="text-3xl font-bold text-[#0B1120]">Admin & System Oversight</h1>
                    <Link href="/admin/reports" className="text-[#F97316] font-semibold hover:text-orange-600 transition-colors">
                        View Full Reports
                    </Link>
                </div>

                {/* KPI Cards */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
                    <StatCard 
                        title="Total Listings" 
                        value={data.totalListings} 
                        icon={FileText} 
                        colorClass="text-indigo-600" 
                    />
                    <StatCard 
                        title="New Users (7 Days)" 
                        value={data.newUsersLast7Days} 
                        icon={Users} 
                        colorClass="text-blue-600" 
                    />
                    <StatCard 
                        title="Revenue (30 Days)" 
                        value={`$${data.totalRevenueLast30Days.toLocaleString()}`} 
                        icon={TrendingUp} 
                        colorClass="text-green-600" 
                    />
                    <StatCard 
                        title="Open AI Flags" 
                        value={data.aiFlagsOpen} 
                        icon={AlertTriangle} 
                        colorClass="text-red-600" 
                    />
                </div>

                {/* AI & System Flags Table */}
                <div className="bg-white rounded-xl shadow-xl border border-gray-100 overflow-hidden">
                    <h2 className="text-xl font-bold p-6 border-b text-[#0B1120] flex items-center gap-2">
                        <Zap size={20} className="text-red-500" /> Critical AI Flags & QA Alerts
                    </h2>
                    
                    {/* Table Header */}
                    <div className="flex p-4 bg-gray-50 text-xs uppercase font-semibold text-gray-500">
                        <div className="w-1/4">Alert Description</div>
                        <div className="w-1/6 text-center">Type</div>
                        <div className="w-1/6 text-center">Target ID</div>
                        <div className="w-1/4 text-center">Status</div>
                        <div className="w-1/6 text-right">Action</div>
                    </div>

                    {/* Flag Rows */}
                    <div>
                        {data.systemFlags.length > 0 ? (
                            data.systemFlags.map(flag => (
                                <FlagRow key={flag.flagId} flag={flag} />
                            ))
                        ) : (
                            <div className="p-8 text-center text-gray-500">
                                System health is excellent. No critical flags at this time.
                            </div>
                        )}
                    </div>
                    
                    <div className="p-4 border-t text-sm text-gray-500 flex justify-between items-center">
                        <p>*AI Flags detect spam, low-quality content, and financial anomalies.</p>
                        <button className="text-sm font-semibold text-blue-600 hover:underline">Clear All Flags</button>
                    </div>
                </div>

                {/* Placeholder for System Health Graph */}
                <div className="mt-10 p-8 bg-green-50 rounded-xl border border-green-200 text-center">
                    <h2 className="text-xl font-bold text-green-900 mb-3">
                        Listing Quality Score: {data.averageListingQualityScore} / 5.0
                    </h2>
                    <p className="text-green-800 mb-4">
                        Platform integrity is strong. Focus on boosting listings below 3.0.
                    </p>
                </div>

            </div>
        </div>
    );
}
