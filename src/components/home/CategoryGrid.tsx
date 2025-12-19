import { ArrowRight } from 'lucide-react';
import Link from 'next/link';

const CATEGORIES = [
  // --- OPERATIONAL (Updated to match Sidebar Taxonomy) ---
  {
    title: 'Gas Stations & Auto', // Changed Title to match broader category
    type: 'Operational',
    count: 'High Demand',
    image: 'https://images.unsplash.com/photo-1569062363389-9f7926b47c0a?auto=format&fit=crop&q=80',
    slug: 'Fuel & Auto' // 👈 FIXED: Matches Sidebar
  },
  {
    title: 'Car Washes & Auto Service',
    type: 'Operational',
    count: 'Active',
    image: 'https://images.unsplash.com/photo-1605152276897-4f618f831968?auto=format&fit=crop&q=80',
    slug: 'Automotive & Transportation' // 👈 FIXED
  },
  {
    title: 'Restaurants & Hospitality',
    type: 'Operational',
    count: 'Popular',
    image: 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&q=80',
    slug: 'Food & Hospitality' // 👈 FIXED
  },
  {
    title: 'Warehouses & Industrial',
    type: 'Operational',
    count: 'Growing',
    image: 'https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?auto=format&fit=crop&q=80',
    slug: 'Industrial & Logistics' // 👈 FIXED
  },
  {
    title: 'Retail & Franchise',
    type: 'Operational',
    count: 'Steady',
    image: 'https://images.unsplash.com/photo-1441986300917-64674bd600d8?auto=format&fit=crop&q=80',
    slug: 'Retail & Franchise' // 👈 FIXED
  },
  
  // --- DIGITAL (These usually match exactly) ---
  {
    title: 'SaaS (Software)',
    type: 'Digital',
    count: 'Digital',
    image: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&q=80',
    slug: 'SaaS'
  },
  {
    title: 'E-commerce Stores',
    type: 'Digital',
    count: 'Digital',
    image: 'https://images.unsplash.com/photo-1556742049-0cfed4f7a07d?auto=format&fit=crop&q=80',
    slug: 'E-commerce'
  },
  {
    title: 'Content & Media',
    type: 'Digital',
    count: 'Digital',
    image: 'https://images.unsplash.com/photo-1432888498266-38ffec3eaf0a?auto=format&fit=crop&q=80',
    slug: 'Content'
  },
  {
    title: 'Agencies & Services',
    type: 'Digital',
    count: 'Digital',
    image: 'https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&q=80',
    slug: 'Agency'
  },
];

export default function CategoryGrid() {
  return (
    <section className="py-24 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* HEADER */}
        <div className="flex justify-between items-end mb-12">
          <div>
            <h2 className="text-3xl font-bold text-slate-900">Browse by Category</h2>
            <p className="text-slate-500 mt-2">Explore opportunities by asset class and financial model.</p>
          </div>
          <Link href="/browse" className="text-blue-600 font-bold flex items-center gap-1 hover:gap-2 transition-all text-sm">
            View all <ArrowRight size={16} />
          </Link>
        </div>

        {/* GRID */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {CATEGORIES.map((cat, idx) => (
            <Link 
              key={idx} 
              href={`/browse?category=${encodeURIComponent(cat.slug)}&type=${cat.type}`}
              className="group relative h-64 rounded-xl overflow-hidden cursor-pointer"
            >
              {/* Background Image */}
              <img 
                src={cat.image} 
                alt={cat.title} 
                className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
              />
              
              {/* Overlay Gradient */}
              <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-slate-900/40 to-transparent opacity-80 group-hover:opacity-90 transition-opacity"></div>

              {/* Content */}
              <div className="absolute inset-0 p-6 flex flex-col justify-end">
                <div className="flex justify-between items-start mb-2">
                   <h3 className="text-white font-bold text-lg leading-tight">{cat.title}</h3>
                   <span className="bg-white/20 backdrop-blur-md text-white text-[10px] font-bold px-2 py-1 rounded border border-white/10">
                     {cat.count}
                   </span>
                </div>
                
                {/* Micro-copy based on type */}
                <p className="text-slate-300 text-xs opacity-0 group-hover:opacity-100 transform translate-y-4 group-hover:translate-y-0 transition-all duration-300">
                  {cat.type === 'Operational' ? 'Real Estate backed • Cash Flow' : 'Remote • Scalable • High Margin'}
                </p>
              </div>
            </Link>
          ))}
        </div>

      </div>
    </section>
  );
}
