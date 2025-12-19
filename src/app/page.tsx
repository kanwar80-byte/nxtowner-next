// src/app/page.tsx



import { CheckCircle2 } from 'lucide-react';
import Link from 'next/link';
import Hero from '../components/Hero';
import MarketInsights from '../components/MarketInsights';
import Opportunities from '../components/Opportunities';
import SelectServices from '../components/SelectServices';
import BrowseByCategory from '../components/home/BrowseByCategory';
import RecentListings from '../components/home/RecentListings';

export default function Home() {
  return (
    <main className="min-h-screen bg-[#0B1221]">
      {/* Navbar is rendered globally in layout.tsx */}
      <div className="pt-10 md:pt-12 pb-16">
        <Hero />
      </div>
      <div className="pt-8">
        <Opportunities />
      </div>

      {/* Browse by Category Section */}
      <div className="py-14 md:py-16 bg-white border-y border-slate-100">
        <div className="max-w-7xl mx-auto px-4">
          <BrowseByCategory />
        </div>
      </div>

      {/* Recently Added / Fresh This Week Section */}
      <div className="py-14 md:py-16 bg-white border-b border-slate-100">
        <div className="max-w-7xl mx-auto px-4">
          <RecentListings />
        </div>
      </div>

      {/* Re-adding the 'The NxtOwner Standard' Section */}
        <section className="bg-white py-16 border-b border-slate-200">
        <div className="max-w-6xl mx-auto px-4 text-center">
            <h2 className="text-3xl font-bold text-slate-900 mb-8">Stop Guessing. Start Closing.</h2>
            <div className="grid md:grid-cols-2 gap-8 md:gap-10">
                <div className="p-8 bg-slate-50 rounded-3xl opacity-70 border border-slate-100">
                  <h3 className="text-xl font-bold text-slate-400 mb-6">Other Marketplaces</h3>
                  <ul className="space-y-4 text-slate-500">
                    <li className="flex items-center"><div className="w-2 h-2 rounded-full bg-slate-300 mr-3" />Unverified user generated data</li>
                    <li className="flex items-center"><div className="w-2 h-2 rounded-full bg-slate-300 mr-3" />Static PDF attachments</li>
                    <li className="flex items-center"><div className="w-2 h-2 rounded-full bg-slate-300 mr-3" />Slow manual communication</li>
                  </ul>
                </div>
                <div className="p-8 bg-[#0B1221] rounded-3xl shadow-2xl border border-slate-800 text-white">
                  <h3 className="text-xl font-bold mb-6 flex items-center">The NxtOwner Standard <span className="ml-3 px-2 py-0.5 bg-blue-600 text-[10px] rounded uppercase tracking-wider text-white">Pro</span></h3>
                  <ul className="space-y-5">
                    <li className="flex items-center font-medium">
                      {/* GOLD CHECK for Financials */}
                      <CheckCircle2 className="w-5 h-5 text-[#EAB308] mr-3 shrink-0" />
                      AI-Normalized Financials
                    </li>
                    <li className="flex items-center font-medium">
                      {/* EMERALD CHECK for Verification */}
                      <CheckCircle2 className="w-5 h-5 text-[#10B981] mr-3 shrink-0" />
                      KYC-Verified Sellers & Buyers
                    </li>
                    <li className="flex items-center font-medium">
                      {/* EMERALD CHECK for Security */}
                      <CheckCircle2 className="w-5 h-5 text-[#10B981] mr-3 shrink-0" />
                      Integrated Data Rooms with NDA
                    </li>
                  </ul>
                </div>
            </div>
        </div>
      </section>

      <div className="py-14 md:py-16">
        <SelectServices />
      </div>
      <div className="py-14 md:py-16">
        <MarketInsights />
      </div>

      {/* 5. FINAL CTA SECTION (PREMIUM UPGRADE) */}
      <section className="relative py-24 px-4 overflow-hidden bg-[#0B1221] border-t border-white/10">
        {/* Ambient Background Glow (Subtle & Premium) */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
           <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[400px] bg-blue-900/20 rounded-full blur-[120px] opacity-50" />
        </div>

        <div className="relative z-10 max-w-4xl mx-auto text-center">
          <h2 className="text-4xl md:text-5xl font-extrabold text-white mb-6 tracking-tight">
            Ready to make your move?
          </h2>
          <p className="text-slate-400 text-lg mb-10 max-w-2xl mx-auto leading-relaxed">
            Join Canada's verified marketplace. Stop searching through noise and start closing deals with confidence.
          </p>
          <div className="flex flex-col sm:flex-row gap-5 justify-center">
            {/* Primary Action: GOLD Button */}
            <Link 
              href="/browse" 
              className="inline-flex items-center justify-center bg-[#D4AF37] text-[#0B1221] px-8 py-4 rounded-xl font-bold text-lg hover:bg-[#C5A028] transition-all shadow-xl shadow-yellow-900/20"
            >
              Browse Verified Listings
            </Link>
            {/* Secondary Action: Glass/White Button */}
            <Link 
              href="/valuation" 
              className="inline-flex items-center justify-center bg-white/5 text-white border border-white/10 px-8 py-4 rounded-xl font-bold text-lg hover:bg-white/10 hover:border-white/20 transition-all backdrop-blur-sm"
            >
              Get Free Valuation
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}