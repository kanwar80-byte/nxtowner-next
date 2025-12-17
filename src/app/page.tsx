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
      <div className="pt-10 md:pt-12 pb-14 md:pb-16">
        <Hero />
      </div>
      <div className="py-14 md:py-16">
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
      <section className="bg-white py-14 md:py-16 border-b border-slate-200">
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
                    <li className="flex items-center font-medium"><CheckCircle2 className="w-5 h-5 text-blue-400 mr-3 shrink-0" />AI-Normalized Financials</li>
                    <li className="flex items-center font-medium"><CheckCircle2 className="w-5 h-5 text-blue-400 mr-3 shrink-0" />KYC-Verified Sellers & Buyers</li>
                    <li className="flex items-center font-medium"><CheckCircle2 className="w-5 h-5 text-blue-400 mr-3 shrink-0" />Integrated Data Rooms with NDA</li>
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

      {/* Final CTA Section */}
      <section className="bg-blue-600 py-16 md:py-20 text-center">
        <h2 className="text-4xl font-bold text-white mb-8">Ready to make your move?</h2>
        <div className="flex justify-center gap-4">
          <Link href="/buy" className="bg-white text-blue-900 px-10 py-4 rounded-xl font-bold">Browse Listings</Link>
          <Link href="/valuation" className="bg-blue-800 text-white px-10 py-4 rounded-xl font-bold">Get Valuation</Link>
        </div>
      </section>
    </main>
  );
}