'use client';

import { Calculator } from 'lucide-react';
import Link from 'next/link';
import { useTrack } from '@/contexts/TrackContext';

export default function CTASection() {
  // Track is exposed for future use (e.g., track-aware CTAs)
  const { track } = useTrack();
  return (
    <section className="py-14 lg:py-20 bg-[#0F1623] relative overflow-hidden border-t border-white/10">
       
       {/* Background Glows */}
       <div className="absolute top-0 left-1/4 w-96 h-96 bg-blue-600/10 rounded-full blur-[100px] pointer-events-none"></div>
       <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-[#EAB308]/5 rounded-full blur-[100px] pointer-events-none"></div>

       <div className="max-w-4xl mx-auto px-4 text-center relative z-10">
          <h2 className="text-3xl md:text-5xl font-black text-white mb-6">
            Ready to make your move?
          </h2>
          <p className="text-lg text-slate-400 mb-10 max-w-2xl mx-auto">
            Join Canada's #1 marketplace for verified business acquisitions. 
            Whether you're exiting or acquiring, we provide the infrastructure to close.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
             {/* GOLD BUTTON: SELLER ACTION */}
             <Link 
               href="/seller/create" 
               className="w-full sm:w-auto bg-[#EAB308] hover:bg-[#CA8A04] text-slate-900 px-8 py-4 rounded-full font-bold text-lg shadow-xl shadow-[#EAB308]/20 transition-all transform hover:-translate-y-1"
             >
               List Your Business
             </Link>

             {/* EMERALD OUTLINE: VALUATION ACTION */}
             <Link 
               href="/sell/valuation" 
               className="w-full sm:w-auto flex items-center justify-center gap-2 bg-transparent border border-slate-700 hover:border-[#10B981] text-white hover:text-[#10B981] px-8 py-4 rounded-full font-bold text-lg transition-all"
             >
               <Calculator size={18} /> Free Valuation
             </Link>
          </div>

          <p className="mt-8 text-xs text-slate-500">
            No credit card required for initial listing setup.
          </p>
       </div>
    </section>
  );
}
