'use client';

import { Calculator } from 'lucide-react';
import Link from 'next/link';

interface CTASectionProps {
  viewMode?: 'real_world' | 'digital';
}

export default function CTASection({ viewMode = 'real_world' }: CTASectionProps) {
  const isRealWorld = viewMode === 'real_world';
  
  const theme = {
    primaryButton: isRealWorld ? 'bg-amber-500 hover:bg-amber-400 shadow-amber-500/20' : 'bg-teal-500 hover:bg-teal-600 shadow-teal-500/20',
    secondaryButton: isRealWorld ? 'border-amber-500/50 hover:border-amber-500 text-white hover:text-amber-400' : 'border-teal-500/50 hover:border-teal-500 text-white hover:text-teal-400',
  };
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
             {/* PRIMARY BUTTON: SELLER ACTION */}
             <Link 
               href="/seller/create" 
               className={`w-full sm:w-auto ${theme.primaryButton} text-slate-900 px-8 py-4 rounded-full font-bold text-lg shadow-xl transition-all transform hover:-translate-y-1`}
             >
               List Your Business
             </Link>

             {/* SECONDARY OUTLINE: VALUATION ACTION */}
             <Link 
               href="/sell/valuation" 
               className={`w-full sm:w-auto flex items-center justify-center gap-2 bg-transparent border ${theme.secondaryButton} px-8 py-4 rounded-full font-bold text-lg transition-all`}
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
