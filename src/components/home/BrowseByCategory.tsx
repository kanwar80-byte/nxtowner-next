
import Link from 'next/link';
import { ArrowRight } from 'lucide-react';

const categories = [
  { 
    name: 'Gas Stations & C-Stores', 
    count: 'High Demand', 
    image: 'https://images.unsplash.com/photo-1569002279282-5d9114705572?auto=format&fit=crop&q=80&w=600', 
    desc: 'Recession resilient • Real Estate backed' 
  },
  { 
    name: 'Car Washes', 
    count: 'Active', 
    image: 'https://images.unsplash.com/photo-1605164661537-847b26e1b8b9?auto=format&fit=crop&q=80&w=600', 
    desc: 'High margin • Low labor operational model' 
  },
  { 
    name: 'QSRs & Restaurants', 
    count: 'Popular', 
    image: 'https://images.unsplash.com/photo-1552566626-52f8b828add9?auto=format&fit=crop&q=80&w=600', 
    desc: 'Franchise resale • Turnkey cashflow' 
  },
  { 
    name: 'Warehouses & Industrial', 
    count: 'Growing', 
    image: 'https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?auto=format&fit=crop&q=80&w=600', 
    desc: 'Owner-user zoning • Triple-net leases' 
  },
  { 
    name: 'Retail & Franchise', 
    count: 'Steady', 
    image: 'https://images.unsplash.com/photo-1556740738-b6a63e27c4df?auto=format&fit=crop&q=80&w=600', 
    desc: 'Proven systems • Established customer base' 
  },
  { 
    name: 'Automotive & Service', 
    count: 'Niche', 
    image: 'https://images.unsplash.com/photo-1625047509168-a7026f36de04?auto=format&fit=crop&q=80&w=600', 
    desc: 'Essential service • Recurring local demand' 
  },
  { 
    name: 'Hospitality', 
    count: 'Seasonal', 
    image: 'https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&q=80&w=600', 
    desc: 'Asset heavy • Tourism & travel rebound' 
  },
  { 
    name: 'SaaS (Software)', 
    count: 'Digital', 
    image: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&q=80&w=600', 
    desc: 'High margin • Global scale • Low overhead' 
  },
  { 
    name: 'E-commerce Stores', 
    count: 'Digital', 
    image: 'https://images.unsplash.com/photo-1556742049-0cfed4f7a07d?auto=format&fit=crop&q=80&w=600', 
    desc: 'DTC brands • FBA • Location independent' 
  },
  { 
    name: 'Content & Media', 
    count: 'Digital', 
    image: 'https://images.unsplash.com/photo-1559136555-9303dff16302?auto=format&fit=crop&q=80&w=600', 
    desc: 'Audience monetization • Affiliate & Ad rev' 
  },
  { 
    name: 'Agencies & Services', 
    count: 'Digital', 
    image: 'https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?auto=format&fit=crop&q=80&w=600', 
    desc: 'B2B contracts • Service retainer models' 
  },
  { 
    name: 'Marketplaces', 
    count: 'Digital', 
    image: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&q=80&w=600', 
    desc: 'Network effects • Scalable tech platforms' 
  },
];

export default function BrowseByCategory() {
  return (
    <div className="w-full">
      {/* Header Row */}
      <div className="flex justify-between items-end mb-8">
        <div>
          <h2 className="text-3xl font-bold text-[#0a192f]">Browse by Category</h2>
          <p className="text-gray-500 mt-2">Explore opportunities by asset class and financial model.</p>
        </div>
        <Link href="/browse" className="hidden md:inline-flex items-center gap-1 text-sm font-semibold text-orange-600 hover:text-orange-700">
          View all <ArrowRight size={16} />
        </Link>
      </div>

      {/* Grid - Now using IMAGES */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {categories.map((cat, index) => (
          <Link 
            key={index} 
            href={`/browse?category=${encodeURIComponent(cat.name)}`}
            className="group relative h-64 rounded-2xl overflow-hidden shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300"
          >
            {/* Background Image */}
            <img 
              src={cat.image} 
              alt={cat.name}
              className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
            />
            
            {/* Dark Overlay Gradient */}
            <div className="absolute inset-0 bg-gradient-to-t from-[#0a192f]/90 via-[#0a192f]/40 to-transparent opacity-90" />

            {/* Content Content */}
            <div className="absolute bottom-0 left-0 w-full p-6 text-white">
              <h3 className="font-bold text-lg mb-1 leading-tight">{cat.name}</h3>
              {/* Value-Based Description */}
              <p className="text-xs text-gray-300 font-medium opacity-90 group-hover:text-white transition-colors">
                {cat.desc}
              </p>
            </div>

            {/* Top Badge */}
            <div className="absolute top-4 right-4">
              <span className="bg-white/20 backdrop-blur-md text-white text-[10px] font-bold px-2 py-1 rounded border border-white/20">
                {cat.count}
              </span>
            </div>
          </Link>
        ))}
      </div>

      {/* Mobile CTA */}
      <div className="mt-8 md:hidden text-center">
        <Link href="/browse" className="inline-block border border-gray-300 text-gray-700 font-semibold px-6 py-3 rounded-full">
          View All Categories
        </Link>
      </div>
    </div>
  );
}
