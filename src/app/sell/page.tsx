'use client';

import { ArrowRight, BadgeDollarSign, BarChart3, Link as LinkIcon } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useState } from 'react';

export default function SellLandingPage() {
  const [domain, setDomain] = useState('');
  const router = useRouter();

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (domain.trim()) {
      router.push(`/sell/onboarding?domain=${encodeURIComponent(domain.trim())}`);
    }
  }

  return (
    <div className="min-h-screen bg-white flex flex-col">
      {/* HERO */}
      <section className="flex-1 flex flex-col justify-center items-center px-4 py-20 bg-gradient-to-b from-[#f8fafc] to-white">
        <div className="max-w-xl w-full mx-auto text-center">
          <h1 className="text-3xl md:text-5xl font-extrabold text-slate-900 mb-4">
            Sell your business for what it's worth.
          </h1>
          <p className="text-lg text-slate-600 mb-10">
            Get an AI valuation and reach 10,000+ verified buyers in minutes.
          </p>
          <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row items-center gap-3 w-full">
            <input
              type="text"
              className="flex-1 px-5 py-4 rounded-xl border border-slate-300 text-lg focus:outline-none focus:ring-2 focus:ring-blue-600 transition"
              placeholder="Enter your business URL (e.g. mybusiness.com)"
              value={domain}
              onChange={e => setDomain(e.target.value)}
              autoFocus
            />
            <button
              type="submit"
              className="flex items-center gap-2 px-7 py-4 rounded-xl bg-[#EA580C] hover:bg-orange-700 text-white font-bold text-lg shadow transition"
            >
              Start Free Valuation <ArrowRight size={20} />
            </button>
          </form>
        </div>
      </section>

      {/* TRUST SECTION */}
      <section className="bg-white py-12 border-t border-slate-100">
        <div className="max-w-4xl mx-auto px-4">
          <div className="flex flex-col md:flex-row items-center justify-between gap-8">
            {/* Step 1 */}
            <div className="flex flex-col items-center text-center flex-1">
              <div className="bg-blue-50 text-blue-600 rounded-full p-4 mb-3">
                <LinkIcon size={32} />
              </div>
              <div className="font-bold text-slate-900 mb-1">Connect Data</div>
              <div className="text-slate-500 text-sm">We pull key info from your website and public sources.</div>
            </div>
            {/* Arrow */}
            <ArrowRight className="hidden md:block text-slate-200 w-8 h-8" />
            {/* Step 2 */}
            <div className="flex flex-col items-center text-center flex-1">
              <div className="bg-yellow-50 text-yellow-500 rounded-full p-4 mb-3">
                <BarChart3 size={32} />
              </div>
              <div className="font-bold text-slate-900 mb-1">Get NxtScore</div>
              <div className="text-slate-500 text-sm">AI analyzes your business for valuation and readiness.</div>
            </div>
            {/* Arrow */}
            <ArrowRight className="hidden md:block text-slate-200 w-8 h-8" />
            {/* Step 3 */}
            <div className="flex flex-col items-center text-center flex-1">
              <div className="bg-green-50 text-green-600 rounded-full p-4 mb-3">
                <BadgeDollarSign size={32} />
              </div>
              <div className="font-bold text-slate-900 mb-1">Receive Offers</div>
              <div className="text-slate-500 text-sm">Get matched with buyers and receive offers securely.</div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
