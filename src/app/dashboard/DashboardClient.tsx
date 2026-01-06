'use client';

import { useEffect, useState } from 'react';
import { createClient } from '@/utils/supabase/client';
import { useRouter, useSearchParams } from 'next/navigation';
import { 
  Building2, Globe, TrendingUp, AlertTriangle, 
  CheckCircle, Clock, Eye, Edit, ShieldCheck 
} from 'lucide-react';

// --- TYPES (Derived from your V17 Schema) ---
interface OperationalListing {
  id: string;
  category: string;
  subcategory: string | null;
  listing_title: string;
  asking_price: number;
  gross_revenue_annual: number;
  status: string;
  created_at: string;
  // Specifics
  pump_count?: number;
  fuel_volume_annual_liters?: number;
  traffic_count_daily?: number;
  ai_risk_score?: number;
}

interface DigitalListing {
  id: string;
  category: string;
  subcategory: string | null;
  listing_title: string;
  asking_price: number;
  gross_revenue_annual: number;
  status: string;
  created_at: string;
  // Specifics
  mrr_current?: number;
  churn_rate_percent?: number;
  traffic_monthly_unique?: number;
  ai_sustainability_score?: number;
}

export default function DashboardClient() {
  const supabase = createClient();
  const router = useRouter();
  const searchParams = useSearchParams();
  
  const [loading, setLoading] = useState(true);
  const [opListings, setOpListings] = useState<OperationalListing[]>([]);
  const [digListings, setDigListings] = useState<DigitalListing[]>([]);
  const [userUser, setUser] = useState<any>(null);

  // Check for "New Listing" flag to show success message
  const isNewListing = searchParams.get('new_listing') === 'true';

  useEffect(() => {
    const fetchData = async () => {
      // 1. Auth Check
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        router.push('/login');
        return;
      }
      setUser(user);

      // 2. Fetch Operational Assets (The "Bricks")
      const { data: opData } = await supabase
        .from('listings_operational')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      // 3. Fetch Digital Assets (The "Clicks")
      const { data: digData } = await supabase
        .from('listings_digital')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      if (opData) {
        // Map DB data to OperationalListing, coalescing null subcategory
        const mapped: OperationalListing[] = opData.map((item: any) => ({
          ...item,
          subcategory: item.subcategory ?? null,
          category: item.category ?? '',
          listing_title: item.listing_title ?? item.title ?? '',
          asking_price: item.asking_price ?? 0,
          gross_revenue_annual: item.gross_revenue_annual ?? 0,
          status: item.status ?? 'draft',
          created_at: item.created_at ?? new Date().toISOString(),
        }));
        setOpListings(mapped);
      }
      if (digData) {
        // Map DB data to DigitalListing, coalescing null subcategory
        const mapped: DigitalListing[] = digData.map((item: any) => ({
          ...item,
          subcategory: item.subcategory ?? null,
          category: item.category ?? '',
          listing_title: item.listing_title ?? item.title ?? '',
          asking_price: item.asking_price ?? 0,
          gross_revenue_annual: item.gross_revenue_annual ?? 0,
          status: item.status ?? 'draft',
          created_at: item.created_at ?? new Date().toISOString(),
        }));
        setDigListings(mapped);
      }
      setLoading(false);
    };

    fetchData();
  }, [router, supabase]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-900"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      
      {/* --- HEADER --- */}
      <header className="bg-white border-b border-gray-200 sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Seller Command Center</h1>
            <p className="text-sm text-gray-500">Manage your assets, deal rooms, and AI insights.</p>
          </div>
          <button 
            onClick={() => router.push('/sell')}
            className="bg-black text-white px-6 py-2 rounded-lg font-medium hover:bg-gray-800 transition shadow-lg"
          >
            + New Asset
          </button>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        
        {/* SUCCESS MESSAGE (If redirected from Sell Page) */}
        {isNewListing && (
          <div className="mb-8 p-4 bg-green-50 border border-green-200 rounded-xl flex items-center text-green-800 animate-fade-in">
            <CheckCircle className="w-6 h-6 mr-3" />
            <div>
              <p className="font-bold">Listing Launched Successfully!</p>
              <p className="text-sm">Your asset is now in the "Draft" stage awaiting AI Audit.</p>
            </div>
          </div>
        )}

        {/* --- EMPTY STATE --- */}
        {opListings.length === 0 && digListings.length === 0 && !loading && (
          <div className="text-center py-20 bg-white rounded-2xl border border-dashed border-gray-300">
            <div className="mx-auto h-12 w-12 text-gray-400 mb-4">
              <TrendingUp className="w-full h-full" />
            </div>
            <h3 className="mt-2 text-sm font-semibold text-gray-900">No assets listed</h3>
            <p className="mt-1 text-sm text-gray-500">Get started by creating a new Operational or Digital listing.</p>
            <div className="mt-6">
              <button
                onClick={() => router.push('/sell')}
                className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700"
              >
                Create Listing
              </button>
            </div>
          </div>
        )}

        {/* --- SECTION 1: OPERATIONAL ASSETS (Blue Theme) --- */}
        {opListings.length > 0 && (
          <div className="mb-12">
            <h2 className="text-xl font-bold text-gray-800 mb-4 flex items-center">
              <Building2 className="w-6 h-6 mr-2 text-blue-600" /> 
              Operational Portfolio
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {opListings.map((listing) => (
                <div key={listing.id} className="bg-white rounded-xl shadow-sm border border-gray-200 hover:shadow-md transition-shadow group relative">
                  
                  {/* Status Badge */}
                  <div className="absolute top-4 right-4">
                     <span className={`px-2 py-1 text-xs font-bold uppercase rounded-full ${
                       listing.status === 'active' ? 'bg-green-100 text-green-800' : 
                       listing.status === 'draft' ? 'bg-yellow-100 text-yellow-800' : 'bg-gray-100 text-gray-800'
                     }`}>
                       {listing.status}
                     </span>
                  </div>

                  <div className="p-6">
                    <div className="text-xs font-bold text-blue-600 uppercase tracking-wide mb-1">
                      {listing.category} • {listing.subcategory}
                    </div>
                    <h3 className="text-lg font-bold text-gray-900 mb-2 truncate">{listing.listing_title}</h3>
                    <div className="text-2xl font-extrabold text-gray-900 mb-4">
                      ${listing.asking_price?.toLocaleString() || '0'}
                    </div>

                    {/* V17 "Max Columns" Data Snapshot */}
                    <div className="space-y-2 mb-6 text-sm text-gray-600 bg-gray-50 p-3 rounded-lg">
                      <div className="flex justify-between">
                        <span>Revenue:</span>
                        <span className="font-semibold">${listing.gross_revenue_annual?.toLocaleString()}</span>
                      </div>
                      {/* Dynamic Specifics based on Category */}
                      {listing.category === 'Gas Stations & Energy Hubs' && (
                        <div className="flex justify-between">
                          <span>Fuel Vol:</span>
                          <span className="font-semibold">{listing.fuel_volume_annual_liters?.toLocaleString()} L</span>
                        </div>
                      )}
                      {listing.category === 'Car Washes' && (
                        <div className="flex justify-between">
                          <span>Wash Vol:</span>
                          <span className="font-semibold">{listing.traffic_count_daily} Daily</span>
                        </div>
                      )}
                    </div>

                    {/* AI & Actions */}
                    <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                      <div className="flex items-center text-xs text-gray-500" title="AI Risk Score">
                         <ShieldCheck className={`w-4 h-4 mr-1 ${listing.ai_risk_score && listing.ai_risk_score > 50 ? 'text-green-500' : 'text-gray-400'}`} />
                         <span>AI Readiness: {listing.ai_risk_score || 'Pending'}%</span>
                      </div>
                      <button className="text-blue-600 hover:text-blue-800 text-sm font-medium flex items-center">
                        Manage <ArrowRight className="w-4 h-4 ml-1" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* --- SECTION 2: DIGITAL ASSETS (Purple Theme) --- */}
        {digListings.length > 0 && (
          <div>
            <h2 className="text-xl font-bold text-gray-800 mb-4 flex items-center">
              <Globe className="w-6 h-6 mr-2 text-purple-600" /> 
              Digital Portfolio
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {digListings.map((listing) => (
                <div key={listing.id} className="bg-white rounded-xl shadow-sm border border-gray-200 hover:shadow-md transition-shadow group relative">
                   
                   {/* Status Badge */}
                  <div className="absolute top-4 right-4">
                     <span className={`px-2 py-1 text-xs font-bold uppercase rounded-full ${
                       listing.status === 'active' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
                     }`}>
                       {listing.status}
                     </span>
                  </div>

                  <div className="p-6">
                    <div className="text-xs font-bold text-purple-600 uppercase tracking-wide mb-1">
                      {listing.category} • {listing.subcategory}
                    </div>
                    <h3 className="text-lg font-bold text-gray-900 mb-2 truncate">{listing.listing_title}</h3>
                    <div className="text-2xl font-extrabold text-gray-900 mb-4">
                      ${listing.asking_price?.toLocaleString() || '0'}
                    </div>

                    {/* V17 "Max Columns" Digital Snapshot */}
                    <div className="space-y-2 mb-6 text-sm text-gray-600 bg-gray-50 p-3 rounded-lg">
                      <div className="flex justify-between">
                        <span>Revenue:</span>
                        <span className="font-semibold">${listing.gross_revenue_annual?.toLocaleString()}</span>
                      </div>
                      {/* SaaS Specifics */}
                      {listing.category === 'SaaS (Software as a Service)' && (
                         <>
                          <div className="flex justify-between">
                            <span>MRR:</span>
                            <span className="font-semibold">${listing.mrr_current?.toLocaleString()}</span>
                          </div>
                          <div className="flex justify-between">
                            <span>Churn:</span>
                            <span className="font-semibold text-red-500">{listing.churn_rate_percent}%</span>
                          </div>
                         </>
                      )}
                      {/* Content Specifics */}
                      {listing.category === 'Content & Media' && (
                        <div className="flex justify-between">
                          <span>Traffic:</span>
                          <span className="font-semibold">{listing.traffic_monthly_unique?.toLocaleString()} /mo</span>
                        </div>
                      )}
                    </div>

                    {/* AI & Actions */}
                    <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                      <div className="flex items-center text-xs text-gray-500">
                         <TrendingUp className="w-4 h-4 mr-1 text-purple-400" />
                         <span>Scalability: {listing.ai_sustainability_score || 'Pend'}</span>
                      </div>
                      <button className="text-purple-600 hover:text-purple-800 text-sm font-medium flex items-center">
                        Manage <ArrowRight className="w-4 h-4 ml-1" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

      </main>
    </div>
  );
}

// Simple Icon Component (if not using lucide-react)
function ArrowRight({ className }: { className?: string }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
    </svg>
  );
}



