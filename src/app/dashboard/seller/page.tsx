'use client';

import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import { Briefcase, Eye, ShieldCheck, TrendingUp } from 'lucide-react';
import { useEffect, useState } from 'react';
// Ensure these paths match your project structure
import { SellerDashboardHeader } from '@/components/dashboard/SellerDashboardHeader';
import { StatCard } from '@/components/dashboard/StatCard';

export default function SellerDashboard() {
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState({
    totalActiveListings: 0,
    listingPerformance: [] as any[],
    plan: 'free'
  });
  
  const supabase = createClientComponentClient();

  useEffect(() => {
    const init = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      setUser(user);
      
      // Simulate fetching data to prevent crashes
      if (user) {
         setData({
            totalActiveListings: 0,
            listingPerformance: [],
            plan: 'free'
         });
      }
      setLoading(false);
    };
    init();
  }, []);

  // Safe calculations
  const totalViews = data.listingPerformance?.reduce((acc, curr) => acc + (curr.views || 0), 0) || 0;
  const qualifiedBuyers = data.listingPerformance?.reduce((acc, curr) => acc + (curr.qualifiedBuyers || 0), 0) || 0;

  if (loading) {
    return <div className="min-h-screen bg-slate-50 flex items-center justify-center">Loading...</div>;
  }

  return (
    <main className="min-h-screen bg-slate-50 pb-20">
      
      {/* HEADER */}
      <SellerDashboardHeader
         user={user}
         plan={data.plan}
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-8 relative z-10">
        
        {/* KPI STATS GRID */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
          <StatCard
            title="Active Listings"
            value={data.totalActiveListings}
            icon={Briefcase}
            colorClass="text-blue-600"
          />
          <StatCard
            title="Total Views"
            value={totalViews}
            icon={Eye}
            colorClass="text-emerald-600"
          />
          <StatCard
            title="Qualified Buyers"
            value={qualifiedBuyers}
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

        {/* LISTINGS SECTION */}
        <section className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden min-h-[200px]">
           <div className="p-6 border-b border-slate-100">
              <h3 className="text-lg font-bold text-slate-900">Your Listings</h3>
           </div>
           <div className="p-12 text-center text-slate-500">
              {data.totalActiveListings === 0 
                ? "You have no active listings at the moment." 
                : "Listings loaded."}
           </div>
        </section>

      </div>
    </main>
  );
}