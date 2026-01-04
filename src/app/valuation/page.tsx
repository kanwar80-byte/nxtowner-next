// src/app/valuation/page.tsx
'use client';

import Navbar from '@/components/layout/Navbar';
import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

export default function ValuationPage() {
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [valuationRange, setValuationRange] = useState<string | null>(null);
  
  // Form State
  const [formData, setFormData] = useState({
    type: 'operational', // or 'digital'
    category: '',
    revenue: '',
    profit: '',
    growth: ''
  });

  // STEP 1: ASSET TYPE
  const handleTypeSelect = (type: string) => {
    setFormData({ ...formData, type });
    setStep(2);
  };

  // STEP 2: FINANCIALS SUBMIT
  const handleCalculate = (e: React.FormEvent) => {
    e.preventDefault();
    setStep(3); // Go to loading screen
    setLoading(true);

    // SIMULATE AI THINKING (2.5 Seconds)
    setTimeout(() => {
      setLoading(false);
      // Simple Mock Logic for Demo
      const rev = parseInt(formData.revenue) || 0;
      const multiple = formData.type === 'operational' ? 3.5 : 4.5;
      const val = (rev * multiple).toLocaleString();
      const valHigh = (rev * (multiple + 0.5)).toLocaleString();
      setValuationRange(`$${val} - $${valHigh}`);
      setStep(4); // Show Result
    }, 2500);
  };

  return (
    <main className="min-h-screen bg-slate-50 font-sans">
      <Navbar />

      <div className="max-w-3xl mx-auto px-4 py-16">
        
        {/* HEADER */}
        <div className="text-center mb-12">
          <span className="inline-block py-1 px-3 rounded-full bg-blue-100 text-blue-700 text-xs font-bold uppercase tracking-wide mb-4">
            AI-Powered Analysis
          </span>
          <h1 className="text-4xl font-extrabold text-slate-900 mb-4">
            What is your business <span className="text-blue-600">really worth?</span>
          </h1>
          <p className="text-lg text-slate-500">
            Get an instant, data-backed valuation estimate based on 50,000+ recent market comps.
          </p>
        </div>

        {/* WIZARD CONTAINER */}
        <div className="bg-white rounded-2xl shadow-xl border border-slate-200 overflow-hidden min-h-[400px] relative">
          
          {/* PROGRESS BAR */}
          <div className="h-1.5 bg-slate-100 w-full">
            <div 
              className="h-full bg-blue-600 transition-all duration-500 ease-out"
              style={{ width: `${(step / 4) * 100}%` }}
            ></div>
          </div>

          <div className="p-8 md:p-12">

            {/* === STEP 1: CHOOSE TRACK === */}
            {step === 1 && (
              <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
                <h2 className="text-2xl font-bold text-slate-900 mb-8 text-center">Select Asset Type</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <button 
                    onClick={() => handleTypeSelect('operational')}
                    className="group p-6 border-2 border-slate-100 rounded-xl hover:border-blue-600 hover:bg-blue-50 transition-all text-left"
                  >
                    <div className="text-3xl mb-3">🏢</div>
                    <h3 className="font-bold text-slate-900 group-hover:text-blue-700">Operational Asset</h3>
                    <p className="text-sm text-slate-500 mt-1">Gas Station, Retail, Car Wash, Industrial.</p>
                  </button>

                  <button 
                    onClick={() => handleTypeSelect('digital')}
                    className="group p-6 border-2 border-slate-100 rounded-xl hover:border-blue-600 hover:bg-blue-50 transition-all text-left"
                  >
                    <div className="text-3xl mb-3">💻</div>
                    <h3 className="font-bold text-slate-900 group-hover:text-blue-700">Digital Asset</h3>
                    <p className="text-sm text-slate-500 mt-1">SaaS, E-commerce, Agency, App.</p>
                  </button>
                </div>
              </div>
            )}

            {/* === STEP 2: FINANCIAL INPUTS === */}
            {step === 2 && (
              <form onSubmit={handleCalculate} className="animate-in fade-in slide-in-from-right-8 duration-500">
                <h2 className="text-2xl font-bold text-slate-900 mb-6 text-center">Financial Snapshot</h2>
                
                <div className="space-y-5">
                  <div>
                    <label className="block text-sm font-bold text-slate-700 mb-2">Annual Revenue (Last 12 Mo)</label>
                    <div className="relative">
                      <span className="absolute left-4 top-3.5 text-slate-400">$</span>
                      <input 
                        required
                        type="number" 
                        placeholder="e.g. 500000"
                        className="w-full pl-8 pr-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
                        onChange={(e) => setFormData({...formData, revenue: e.target.value})}
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-bold text-slate-700 mb-2">
                      {formData.type === 'operational' ? 'Annual NOI (Net Operating Income)' : 'Annual Profit / EBITDA'}
                    </label>
                    <div className="relative">
                      <span className="absolute left-4 top-3.5 text-slate-400">$</span>
                      <input 
                        required
                        type="number" 
                        placeholder="e.g. 150000"
                        className="w-full pl-8 pr-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
                        onChange={(e) => setFormData({...formData, profit: e.target.value})}
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-bold text-slate-700 mb-2">YoY Growth Rate (%)</label>
                    <input 
                      type="number" 
                      placeholder="e.g. 15"
                      className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
                      onChange={(e) => setFormData({...formData, growth: e.target.value})}
                    />
                  </div>

                  <button 
                    type="submit"
                    className="w-full bg-slate-900 text-white font-bold py-4 rounded-xl hover:bg-slate-800 transition-transform transform active:scale-[0.98] mt-4 shadow-lg"
                  >
                    Analyze Valuation →
                  </button>
                </div>
              </form>
            )}

            {/* === STEP 3: AI THINKING ANIMATION === */}
            {step === 3 && (
              <div className="flex flex-col items-center justify-center py-12 animate-in fade-in duration-700">
                <div className="relative w-20 h-20 mb-8">
                  <div className="absolute top-0 left-0 w-full h-full border-4 border-blue-100 rounded-full"></div>
                  <div className="absolute top-0 left-0 w-full h-full border-4 border-blue-600 rounded-full border-t-transparent animate-spin"></div>
                </div>
                <h3 className="text-xl font-bold text-slate-900 mb-2">Analyzing Market Trends...</h3>
                <p className="text-slate-500 text-sm">Comparing against 14,203 recent {formData.type} sales.</p>
                
                <div className="mt-8 space-y-2 w-64">
                  <div className="flex items-center text-xs text-green-600 font-bold">
                    <span className="mr-2">✓</span> Revenue Multiples Calculated
                  </div>
                  <div className="flex items-center text-xs text-green-600 font-bold delay-75">
                    <span className="mr-2">✓</span> Sector Risk Adjusted
                  </div>
                  <div className="flex items-center text-xs text-green-600 font-bold delay-150">
                    <span className="mr-2">✓</span> Generating Forecast...
                  </div>
                </div>
              </div>
            )}

            {/* === STEP 4: THE TEASER RESULT (The Hook) === */}
            {step === 4 && (
              <div className="text-center animate-in zoom-in-95 duration-500">
                <div className="mb-8">
                  <p className="text-sm font-bold text-slate-400 uppercase tracking-widest mb-2">Estimated Valuation Range</p>
                  <h2 className="text-4xl md:text-5xl font-extrabold text-slate-900">
                    {valuationRange}
                  </h2>
                  <p className="text-sm text-green-600 font-bold mt-3 bg-green-50 inline-block px-3 py-1 rounded-full">
                    High Confidence Score (85%)
                  </p>
                </div>

                {/* THE BLURRED "PRO" SECTION */}
                <div className="relative border border-slate-200 rounded-xl p-6 mb-8 text-left bg-slate-50">
                  <div className="absolute inset-0 backdrop-blur-[2px] bg-white/60 z-10 flex flex-col items-center justify-center rounded-xl">
                    <p className="font-bold text-slate-800 mb-4">Unlock Full Valuation Report</p>
                    <Link 
                      href="/signup?intent=valuation_report" 
                      className="bg-blue-600 text-white px-8 py-3 rounded-lg font-bold shadow-lg hover:bg-blue-700 transition-transform transform active:scale-95"
                    >
                      Get My Free Report
                    </Link>
                    <p className="text-xs text-slate-500 mt-3">Includes Buyer Demand, Cap Rates & Comparables.</p>
                  </div>

                  {/* Blurred Background Content */}
                  <h3 className="font-bold text-slate-900 mb-4">Detailed Insights</h3>
                  <div className="space-y-4 filter blur-sm select-none">
                    <div className="flex justify-between border-b pb-2">
                      <span>Buyer Demand Score</span>
                      <span className="font-bold text-blue-600">High (9.2/10)</span>
                    </div>
                    <div className="flex justify-between border-b pb-2">
                      <span>Avg. Days to Sell</span>
                      <span className="font-bold text-slate-900">42 Days</span>
                    </div>
                    <div className="flex justify-between border-b pb-2">
                      <span>Comparable Sales (Ontario)</span>
                      <span className="font-bold text-slate-900">12 Found</span>
                    </div>
                  </div>
                </div>

                <button 
                  onClick={() => setStep(1)}
                  className="text-slate-500 text-sm hover:text-slate-800 underline"
                >
                  Start Over
                </button>
              </div>
            )}

          </div>
        </div>
      </div>
    </main>
  );
}
