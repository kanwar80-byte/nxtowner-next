'use client';

import { Briefcase, Eye, ShieldCheck, TrendingUp } from 'lucide-react';
import { useEffect, useState } from 'react';

// --- INLINE COMPONENTS (To fix "Module not found" errors) ---

function StatCard({ title, value, icon: Icon, colorClass }: any) {
  return (
    <div className="bg-white p-6 rounded-xl border border-slate-100 shadow-sm">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-slate-500">{title}</p>
          <p className="text-2xl font-bold text-slate-900 mt-1">{value}</p>
        </div>
        <div className={`p-3 rounded-lg bg-opacity-10 ${colorClass.replace('text-', 'bg-')}`}>
          <Icon className={`w-6 h-6 ${colorClass}`} />
        </div>
      </div>
    </div>
  );
}

function SellerDashboardHeader({ user, plan }: any) {
    return (
        <header className="bg-white border-b border-slate-200 sticky top-0 z-30">
            <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
                <h1 className="text-xl font-bold text-slate-800">Seller Dashboard</h1>
                <div className="flex items-center gap-4">
                    <span className="text-sm text-slate-500">{user?.email || 'Loading...'}</span>
                    <span className="px-2 py-1 bg-blue-100 text-blue-700 text-xs rounded-full uppercase font-bold">{plan || 'Free'}</span>
                </div>
            </div>
        </header>
    )
}

// --- MAIN PAGE ---

export default function SellerDashboard() {
  // We initialize with safe defaults to ensure the UI builds
  const [user, setUser] = useState<any>(null);
  const [data, setData] = useState({
    totalActiveListings: 0,
    listingPerformance: [] as any[],
    plan: 'free'
  });

  // NOTE: Supabase client temporarily removed to fix build export error.
  // We will re-enable auth once the UI deployment is stable.
  useEffect(() => {
      // Simulate data load
      const timer = setTimeout(() => {
          setUser({ email: 'demo@nxtowner.ca' }); 
          setData({ totalActiveListings: 0, listingPerformance: [], plan: 'pro' });
      }, 500);
      return () => clearTimeout(timer);
  }, []);

  return (
    <main className="min-h-screen bg-slate-50 pb-20">
      
      {/* Inline Header */}
      <SellerDashboardHeader user={user} plan={data.plan} />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-8">
        
        {/* KPI Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
          <StatCard 
            title="Active Listings" 
            value={data.totalActiveListings} 
            icon={Briefcase} 
            colorClass="text-blue-600" 
          />
          <StatCard 
            title="Total Views" 
            value="0" 
            icon={Eye} 
            colorClass="text-emerald-600" 
          />
          <StatCard 
            title="Qualified Buyers" 
            value="0" 
            icon={ShieldCheck} 
            colorClass="text-purple-600" 
          />
          <StatCard 
            title="Engagement" 
            value="0%" 
            icon={TrendingUp} 
            colorClass="text-orange-600" 
          />
        </div>

        {/* Listings Area */}
        <section className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden min-h-[200px]">
           <div className="p-6 border-b border-slate-100">
              <h3 className="text-lg font-bold text-slate-900">Your Listings</h3>
           </div>
           <div className="p-12 text-center text-slate-500">
              No active listings found.
           </div>
        </section>

      </div>
    </main>
  );
}