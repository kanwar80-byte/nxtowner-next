import { ArrowUpRight, Lock, ShieldCheck } from 'lucide-react';
import Image from 'next/image';

const deals = [
  {
    id: 1,
    title: "High-Volume Chevron Gas Station & C-Store",
    location: "Greater Toronto Area, ON",
    price: "$2,450,000",
    cashFlow: "$480,000",
    type: "Physical",
    verified: true,
    score: 94,
    img: "https://images.unsplash.com/photo-1596436889106-be35e843f974?auto=format&fit=crop&q=80"
  },
  {
    id: 2,
    title: "B2B SaaS: Inventory Management Platform",
    location: "Remote / Canada",
    price: "$1,200,000",
    cashFlow: "$310,000",
    type: "Digital",
    verified: true,
    score: 88,
    img: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&q=80"
  },
  {
    id: 3,
    title: "Precision Metal Fabrication Plant",
    location: "Calgary, AB",
    price: "$3,800,000",
    cashFlow: "$920,000",
    type: "Operational",
    verified: false,
    score: 91,
    img: "https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?auto=format&fit=crop&q=80"
  }
];

export default function Opportunities() {
  return (
    <section className="py-14 md:py-16 bg-slate-50">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex justify-between items-end mb-8">
          <div>
            <span className="text-[#D4AF37] font-bold tracking-widest text-xs uppercase">Premium Selection</span>
            <h2 className="text-4xl font-extrabold text-[#0B1221] mt-2">Curated Opportunities</h2>
          </div>
          <button className="hidden md:flex items-center gap-2 text-blue-600 font-bold hover:gap-3 transition-all">
            View All Listings <ArrowUpRight size={20} />
          </button>
        </div>

        <div className="grid md:grid-cols-3 gap-6 md:gap-8">
          {deals.map((deal) => (
            <div key={deal.id} className="group bg-white rounded-3xl overflow-hidden border border-slate-200 hover:shadow-2xl hover:border-blue-200 transition-all duration-300">
              {/* Image & Badges */}
              <div className="relative h-64">
                <Image src={deal.img} alt={deal.title} fill className="object-cover group-hover:scale-105 transition-transform duration-500" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                
                <div className="absolute top-4 left-4 flex gap-2">
                  {deal.verified && (
                    <span className="bg-blue-600 text-white text-[10px] font-bold px-3 py-1 rounded-full flex items-center gap-1 shadow-lg">
                      <ShieldCheck size={12} /> AI-VERIFIED
                    </span>
                  )}
                  <span className="bg-white/90 backdrop-blur-md text-slate-900 text-[10px] font-bold px-3 py-1 rounded-full flex items-center gap-1 shadow-lg">
                    <Lock size={12} /> DEAL ROOM
                  </span>
                </div>

                <div className="absolute bottom-4 right-4 bg-[#D4AF37] text-[#0B1221] px-3 py-1 rounded-lg font-bold text-sm shadow-xl">
                  NxtScore: {deal.score}
                </div>
              </div>

              {/* Content */}
              <div className="p-6">
                <div className="flex items-center gap-2 mb-3">
                  <span className="text-xs font-bold text-blue-600 bg-blue-50 px-2 py-0.5 rounded">{deal.type}</span>
                  <span className="text-xs text-slate-400 font-medium">{deal.location}</span>
                </div>
                <h3 className="text-xl font-bold text-slate-900 mb-6 leading-snug group-hover:text-blue-600 transition-colors">
                  {deal.title}
                </h3>
                
                <div className="grid grid-cols-2 gap-4 border-t border-slate-100 pt-6">
                  <div>
                    <p className="text-[10px] text-slate-400 uppercase font-bold tracking-wider mb-1">Asking Price</p>
                    <p className="text-lg font-black text-slate-900">{deal.price}</p>
                  </div>
                  <div>
                    <p className="text-[10px] text-slate-400 uppercase font-bold tracking-wider mb-1">Cash Flow (SDE)</p>
                    <p className="text-lg font-black text-green-600">{deal.cashFlow}</p>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
