'use client';

import { useState, useEffect } from 'react';
import { createClient } from '@/utils/supabase/client';
import { Search, Filter, MapPin, Globe, TrendingUp, Zap, Building2, ChevronDown } from 'lucide-react';

// --- TYPES ---
// (Reusing the robust V17 types we defined earlier)
type AssetMode = 'operational' | 'digital';

export default function MarketplacePage() {
  const supabase = createClient();
  const sb: any = supabase;
  
  // --- STATE ---
  const [mode, setMode] = useState<AssetMode>('operational');
  const [listings, setListings] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  
  // --- FILTERS STATE (The V17 "Max Columns" Engines) ---
  const [filters, setFilters] = useState({
    priceMin: '',
    priceMax: '',
    category: '',
    // Operational Specifics
    location: '', 
    fuelVolMin: '',
    // Digital Specifics
    mrrMin: '',
    profitMin: '',
  });

  // --- FETCH LOGIC ---
  const fetchListings = async () => {
    setLoading(true);
    let query;

    if (mode === 'operational') {
      query = sb.from('listings_operational').select('*').eq('status', 'active'); // Only show active
      
      // Apply Op Filters
      if (filters.category) query = query.eq('category', filters.category);
      if (filters.location) query = query.ilike('province', `%${filters.location}%`); // Simple search
      if (filters.fuelVolMin) query = query.gte('fuel_volume_annual_liters', parseInt(filters.fuelVolMin));
      
    } else {
      query = sb.from('listings_digital').select('*').eq('status', 'active');
      
      // Apply Digital Filters
      if (filters.category) query = query.eq('category', filters.category);
      if (filters.mrrMin) query = query.gte('mrr_current', parseInt(filters.mrrMin));
    }

    // Shared Filters
    if (filters.priceMin) query = query.gte('asking_price', parseInt(filters.priceMin));
    if (filters.priceMax) query = query.lte('asking_price', parseInt(filters.priceMax));

    const { data, error } = await query;
    
    if (error) console.error('Error fetching:', error);
    else setListings(data || []);
    
    setLoading(false);
  };

  // Re-fetch when mode or "Apply" changes
  useEffect(() => {
    fetchListings();
  }, [mode]); // In real app, add debounce or an 'Apply' button dependency

  return (
    <div className="min-h-screen bg-gray-50">
      
      {/* --- HERO SEARCH SECTION --- */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 py-8">
          
          <h1 className="text-3xl font-extrabold text-gray-900 mb-6">
            Find Your Next <span className="text-blue-600">Asset</span>
          </h1>

          {/* MODE TOGGLE (The Brain Switch) */}
          <div className="flex space-x-4 mb-8">
            <button
              onClick={() => setMode('operational')}
              className={`flex items-center px-6 py-3 rounded-full text-sm font-bold transition-all ${
                mode === 'operational' 
                  ? 'bg-black text-white shadow-lg' 
                  : 'bg-gray-100 text-gray-500 hover:bg-gray-200'
              }`}
            >
              <Building2 className="w-4 h-4 mr-2" />
              Operational (Physical)
            </button>
            <button
              onClick={() => setMode('digital')}
              className={`flex items-center px-6 py-3 rounded-full text-sm font-bold transition-all ${
                mode === 'digital' 
                  ? 'bg-purple-600 text-white shadow-lg' 
                  : 'bg-gray-100 text-gray-500 hover:bg-gray-200'
              }`}
            >
              <Globe className="w-4 h-4 mr-2" />
              Digital (Online)
            </button>
          </div>

          {/* --- DYNAMIC FILTER BAR --- */}
          <div className="bg-gray-50 p-4 rounded-xl border border-gray-200 grid grid-cols-1 md:grid-cols-4 gap-4">
            
            {/* 1. Common: Price */}
            <div className="relative">
              <span className="absolute left-3 top-3 text-gray-400 text-xs font-bold">MAX PRICE</span>
              <input 
                type="number" 
                placeholder="$ Any" 
                className="w-full pl-3 pt-5 pb-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 outline-none"
                onChange={(e) => setFilters({...filters, priceMax: e.target.value})}
              />
            </div>

            {/* 2. DYNAMIC SLOT A */}
            {mode === 'operational' ? (
              <div className="relative">
                <span className="absolute left-3 top-3 text-gray-400 text-xs font-bold">LOCATION</span>
                <div className="relative">
                  <MapPin className="absolute left-3 top-5 w-4 h-4 text-gray-400" />
                  <input 
                    type="text" 
                    placeholder="City or Province" 
                    className="w-full pl-9 pt-5 pb-2 rounded-lg border border-gray-300 outline-none"
                    onChange={(e) => setFilters({...filters, location: e.target.value})}
                  />
                </div>
              </div>
            ) : (
              <div className="relative">
                <span className="absolute left-3 top-3 text-gray-400 text-xs font-bold">MIN MRR (MONTHLY)</span>
                <input 
                  type="number" 
                  placeholder="$0+" 
                  className="w-full pl-3 pt-5 pb-2 rounded-lg border border-gray-300 outline-none"
                  onChange={(e) => setFilters({...filters, mrrMin: e.target.value})}
                />
              </div>
            )}

            {/* 3. DYNAMIC SLOT B (The Niche Filter) */}
            {mode === 'operational' ? (
              <div className="relative">
                <span className="absolute left-3 top-3 text-gray-400 text-xs font-bold">MIN FUEL VOLUME</span>
                <input 
                  type="number" 
                  placeholder="Liters / Year" 
                  className="w-full pl-3 pt-5 pb-2 rounded-lg border border-gray-300 outline-none"
                  onChange={(e) => setFilters({...filters, fuelVolMin: e.target.value})}
                />
              </div>
            ) : (
              <div className="relative">
                <span className="absolute left-3 top-3 text-gray-400 text-xs font-bold">NET PROFIT (ANNUAL)</span>
                <input 
                  type="number" 
                  placeholder="$10k+" 
                  className="w-full pl-3 pt-5 pb-2 rounded-lg border border-gray-300 outline-none"
                  onChange={(e) => setFilters({...filters, profitMin: e.target.value})}
                />
              </div>
            )}

            {/* 4. Action Button */}
            <button 
              onClick={fetchListings}
              className={`rounded-lg font-bold text-white shadow-md transition-transform active:scale-95 ${
                mode === 'operational' ? 'bg-blue-600 hover:bg-blue-700' : 'bg-purple-600 hover:bg-purple-700'
              }`}
            >
              Search Listings
            </button>
          </div>
        </div>
      </div>

      {/* --- RESULTS GRID --- */}
      <div className="max-w-7xl mx-auto px-4 py-8">
        
        {loading ? (
           <div className="text-center py-20 text-gray-500">Scanning Database...</div>
        ) : listings.length === 0 ? (
           <div className="text-center py-20 bg-white rounded-xl border border-dashed">
             <p className="text-gray-500">No active listings match your criteria.</p>
           </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {listings.map((item) => (
              <ListingCard key={item.id} data={item} mode={mode} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

// --- SUB-COMPONENT: The Smart Card ---
function ListingCard({ data, mode }: { data: any, mode: AssetMode }) {
  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden hover:shadow-xl transition-all duration-300 cursor-pointer group">
      {/* Imagine an Image Placeholder here */}
      <div className={`h-3 bg-gradient-to-r ${mode === 'operational' ? 'from-blue-500 to-blue-300' : 'from-purple-500 to-pink-500'}`} />
      
      <div className="p-5">
        <div className="flex justify-between items-start mb-2">
           <span className="text-xs font-bold uppercase text-gray-400">{data.subcategory}</span>
           {/* AI Badge Placeholder */}
           {data.ai_risk_score && (
             <span className="bg-green-100 text-green-800 text-xs px-2 py-1 rounded-full font-bold">
               Ai Score: {data.ai_risk_score}
             </span>
           )}
        </div>
        
        <h3 className="font-bold text-lg text-gray-900 mb-1 truncate group-hover:text-blue-600">
          {data.listing_title}
        </h3>
        
        {mode === 'operational' ? (
           <div className="flex items-center text-sm text-gray-500 mb-4">
             <MapPin className="w-4 h-4 mr-1" /> {data.city}, {data.province}
           </div>
        ) : (
           <div className="flex items-center text-sm text-gray-500 mb-4">
             <Globe className="w-4 h-4 mr-1" /> Digital Asset
           </div>
        )}

        <div className="flex justify-between items-end border-t border-gray-100 pt-4">
          <div>
            <p className="text-xs text-gray-400 font-bold uppercase">Price</p>
            <p className="text-xl font-extrabold text-gray-900">${data.asking_price?.toLocaleString()}</p>
          </div>
          
          {/* DYNAMIC METRIC DISPLAY */}
          <div className="text-right">
            {mode === 'operational' ? (
              <>
                <p className="text-xs text-gray-400 font-bold uppercase">Gross Rev</p>
                <p className="text-sm font-semibold text-gray-700">${data.gross_revenue_annual?.toLocaleString()}</p>
              </>
            ) : (
              <>
                <p className="text-xs text-gray-400 font-bold uppercase">MRR</p>
                <p className="text-sm font-semibold text-purple-700">${data.mrr_current?.toLocaleString()}/mo</p>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}


