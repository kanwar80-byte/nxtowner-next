
'use client';

import { ArrowRight, CheckCircle, Globe, MapPin, Zap } from 'lucide-react';
import Link from 'next/link';

// Mock Data (Or fetch from Supabase if you have it wired up)
const RECENT_DEALS = [
  {
    id: '1',
    title: 'High-Volume Chevron Gas Station & C-Store',
    location: 'Surrey, BC',
    price: 2450000,
    cashflow: 350000,
    revenue: 3500000,
    category: 'Gas Station',
    type: 'Operational',
    verified: true,
    score: 92,
    image: 'https://images.unsplash.com/photo-1569062363389-9f7926b47c0a?auto=format&fit=crop&q=80'
  },
  {
    id: '2',
    title: 'B2B SaaS Project Tool ($400k ARR)',
    location: 'Remote',
    price: 1200000,
    cashflow: 158000,
    revenue: 400000,
    category: 'SaaS',
    type: 'Digital',
    verified: true,
    score: 88,
    image: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&q=80'
  },
  {
    id: '3',
    title: 'Precision Metal Fabrication Plant',
    location: 'Hamilton, ON',
    price: 2800000,
    cashflow: 650000,
    revenue: 3200000,
    category: 'Manufacturing',
    type: 'Operational',
    verified: true,
    score: 95,
    image: 'https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?auto=format&fit=crop&q=80'
  },
  {
    id: '4',
    title: 'Established Eco-Subscription Brand',
    location: 'Remote',
    price: 450000,
    cashflow: 85000,
    revenue: 140000,
    category: 'E-commerce',
    type: 'Digital',
    verified: false, // Example of unverified
    score: 75,
    image: 'https://images.unsplash.com/photo-1556742049-0cfed4f7a07d?auto=format&fit=crop&q=80'
  }
];

export default function RecentListings() {
  const [listings, setListings] = useState<Listing[]>([]);
  const [loading, setLoading] = useState(true);
  const supabase = createClient();

  useEffect(() => {
    async function fetchRecent() {
      // Fetch 6 newest active listings
      const { data, error } = await supabase
        .from('listings')
        .select('*')
        .order('created_at', { ascending: false, nullsLast: true })
        .order('updated_at', { ascending: false, nullsLast: true })
        .limit(6);

      if (error) {
        console.error('Error fetching recent:', error);
      } else if (data) {
        setListings(data);
      }
      setLoading(false);
    }

    fetchRecent();
  }, []);

  if (loading) return null; // or a spinner
  if (listings.length === 0) {
    return (
      <div className="w-full py-24 text-center text-slate-400 bg-white">
        No recent listings found. New Canadian opportunities are added weekly—check back soon.
      </div>
    );
  }

  return (
    <section>
      <div className="flex justify-between items-end mb-8">
        <div>
          <h2 className="text-3xl font-bold text-slate-900">Featured Opportunities</h2>
          <p className="text-slate-500 mt-2">Hand-picked businesses with verified financials.</p>
        </div>
        <Link href="/browse" className="text-blue-600 font-bold flex items-center gap-1 hover:gap-2 transition-all text-sm">
          View All <ArrowRight size={16} />
        </Link>
      </div>

<<<<<<< HEAD
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {RECENT_DEALS.map((listing) => (
          <Link key={listing.id} href={`/listing/${listing.id}`} className="group block bg-white border border-slate-200 rounded-xl overflow-hidden hover:shadow-2xl transition-all hover:-translate-y-1 flex flex-col">
            {/* IMAGE AREA */}
            <div className="relative h-48 overflow-hidden bg-slate-100">
              <img src={listing.image} alt={listing.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" />
              {/* Category Badge */}
              <div className="absolute top-3 left-3">
                 <span className="bg-white/95 backdrop-blur text-slate-900 text-[10px] font-bold px-2 py-1 rounded shadow-sm border border-slate-200 uppercase tracking-wide">
                   {listing.category}
=======
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {listings.map((item) => (
          <Link href={`/listing/${item.id}`} key={item.id} className="block group bg-white border border-gray-100 rounded-xl hover:shadow-lg transition-all duration-300 overflow-hidden">
            <div className="h-40 bg-gray-50 relative overflow-hidden">
              {/* REPLACE THE IMAGE SECTION WITH THIS */}
              <div className="relative h-48 bg-slate-200 overflow-hidden">
                <img 
                  src={item.image || item.image_url || '/placeholder.jpg'} 
                  alt={item.title} 
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                {/* Verified badge if present */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="absolute top-3 right-3 bg-emerald-500 text-white text-[10px] font-bold px-2 py-1 rounded shadow-sm flex items-center gap-1">
                  <Link key={listing.id} href={`/listing/${listing.id}`} className="block group bg-white border border-gray-100 rounded-xl hover:shadow-lg transition-all duration-300 overflow-hidden">
                    <CheckCircle size={10} className="text-white" /> VERIFIED
                  </div>
                )}
                {/* Category badge */}
                <div className="absolute top-3 left-3">
                  <span className="bg-white/95 backdrop-blur text-slate-900 text-[10px] font-bold px-2 py-1 rounded shadow-sm border border-slate-200 uppercase tracking-wide">
                    {item.category}
                  </span>
                </div>
                {/* NEW Badge Logic: Show NEW if less than 7 days old */}
                {(new Date().getTime() - new Date(item.created_at).getTime()) / (1000 * 3600 * 24) < 7 && (
                  <span className="absolute top-2 left-2 bg-blue-600 text-white text-[10px] font-bold px-2 py-1 rounded shadow-sm">
                    NEW
                  </span>
                )}
                <span className="absolute bottom-2 right-2 bg-black/60 backdrop-blur-sm text-white text-[10px] px-2 py-0.5 rounded flex items-center gap-1">
                  <Clock size={10} /> {timeAgo(item.created_at)}
                </span>
              </div>
            </div>
            <div className="p-4">
              <div className="flex justify-between items-start mb-2">
                 <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">
                    {item.asset_type || 'Asset'}
                 </span>
                 <span className="text-sm font-bold text-green-700">
                    {item.price ? `$${item.price.toLocaleString()}` : 'Contact'}
>>>>>>> 611d1ff (STABLE CHECKPOINT: Baseline structure restored. Ready for canonical cleanup.)
                 </span>
              </div>
              {/* VERIFIED BADGE -> EMERALD GREEN */}
              {listing.verified && (
                <div className="absolute top-3 right-3 bg-[#10B981] text-white text-[10px] font-bold px-2 py-1 rounded shadow-sm flex items-center gap-1">
                  <CheckCircle size={10} className="text-white" /> VERIFIED
                </div>
              )}
            </div>
            {/* CONTENT AREA */}
            <div className="p-5 flex flex-col flex-1">
              <div className="flex items-center text-xs text-slate-500 mb-3 gap-2">
                 {listing.type === 'Digital' ? <Globe size={12} className="text-blue-500"/> : <MapPin size={12} className="text-orange-500"/>}
                 <span className="font-medium">{listing.location}</span>
              </div>
              <h3 className="text-lg font-bold text-slate-900 leading-snug mb-4 line-clamp-2 group-hover:text-blue-600">
                {listing.title}
              </h3>
              <div className="flex-1"></div>
              <div className="grid grid-cols-2 gap-y-3 gap-x-4 border-t border-slate-100 pt-4 mt-2">
                <div>
                  <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Revenue</p>
                  <p className="text-sm font-bold text-slate-900">${listing.revenue.toLocaleString()}</p>
                </div>
                <div>
                  {/* CASH FLOW -> EMERALD GREEN */}
                  <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Cash Flow</p>
                  <p className="text-sm font-bold text-[#10B981]">${listing.cashflow.toLocaleString()}</p>
                </div>
                <div className="col-span-2 pt-2 flex items-center justify-between">
                  <p className="text-xl font-extrabold text-slate-900">${listing.price.toLocaleString()}</p>
                  {/* SCORE -> GOLD */}
                  <span className="bg-[#EAB308]/10 text-[#a16207] text-xs font-bold px-2 py-1 rounded-full flex items-center gap-1 border border-[#EAB308]/20">
                    <Zap size={12} className="text-[#EAB308]" fill="#EAB308" /> {listing.score}
                  </span>
                </div>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
}
