'use client';

import React, { useEffect, useState } from 'react';
import { createClient } from '@/utils/supabase/client';
import {
  CheckCircle,
  ChevronRight,
  FileText,
  Lock,
  Menu,
  MessageSquare,
  Paperclip,
  Send,
  ShieldCheck,
  PieChart,
  TrendingUp,
  AlertTriangle
} from 'lucide-react';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { Listing } from '@/types/database';

export default function DealRoomPage() {
  const params = useParams();
  const [listing, setListing] = useState<Listing | null>(null);
  const [isNDA_Signed, setIsNDA_Signed] = useState(false); // Mock NDA state
  const [activeTab, setActiveTab] = useState('financials'); // 'financials', 'traffic', 'docs'
  const supabase = createClient();

  useEffect(() => {
    async function fetchListing() {
      if (!params.id) return;
      const { data, error } = await supabase
        .from('listings')
        .select('*')
        .eq('id', params.id)
        .single();

      if (!error && data) setListing(data);
    }
    fetchListing();
  }, [params.id]);

  if (!listing) return <div className="p-10 text-center">Loading secure room...</div>;

  // --- 1. THE NDA GATE (Overlay) ---
  if (!isNDA_Signed) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
        <div className="max-w-lg w-full bg-white rounded-2xl shadow-2xl overflow-hidden border border-slate-200">
          <div className="bg-slate-900 p-6 text-center">
            <Lock className="w-12 h-12 text-[#EAB308] mx-auto mb-3" />
            <h1 className="text-xl font-bold text-white">Confidential Deal Room</h1>
            <p className="text-slate-400 text-sm mt-1">{listing.title}</p>
          </div>
          <div className="p-8">
             <div className="bg-yellow-50 border border-yellow-100 p-4 rounded-lg mb-6 flex gap-3">
               <AlertTriangle className="text-yellow-700 shrink-0" size={20} />
               <p className="text-xs text-yellow-800 leading-relaxed">
                 This deal room contains sensitive financial data (P&L, Tax Returns). 
                 You must agree to the Non-Disclosure Agreement (NDA) to proceed.
               </p>
             </div>
             <button 
               onClick={() => setIsNDA_Signed(true)}
               className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-4 rounded-xl transition-all shadow-lg flex items-center justify-center gap-2"
             >
               <ShieldCheck size={18} /> I Agree & Sign NDA
             </button>
             <p className="text-center text-xs text-slate-400 mt-4">
               By clicking, you digitally sign the NDA for {listing.title}.
             </p>
          </div>
        </div>
      </div>
    );
  }

  // --- 2. THE DEAL ROOM DASHBOARD ---
  return (
    <div className="min-h-screen bg-slate-100">
      
      {/* HEADER */}
      <header className="bg-white border-b border-slate-200 sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
           <div className="flex items-center gap-3">
             <div className="bg-green-100 text-green-700 p-1.5 rounded-lg">
               <Lock size={16} />
             </div>
             <div>
               <h1 className="font-bold text-slate-900 text-sm leading-none">Deal Room: {listing.title}</h1>
               <p className="text-[10px] text-green-600 font-bold mt-0.5">SECURE CONNECTION • NDA ACTIVE</p>
             </div>
           </div>
           <Link href={`/listing/${listing.id}`} className="text-sm font-bold text-slate-500 hover:text-slate-900">
             Exit Room
           </Link>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
           
           {/* LEFT NAVIGATION */}
           <div className="lg:col-span-1 space-y-2">
              <button onClick={() => setActiveTab('financials')} className={`w-full text-left px-4 py-3 rounded-lg font-bold text-sm flex items-center gap-3 transition-colors ${activeTab === 'financials' ? 'bg-white text-blue-600 shadow-sm' : 'text-slate-500 hover:bg-white/50'}`}>
                <PieChart size={18} /> Financials
              </button>
              <button onClick={() => setActiveTab('traffic')} className={`w-full text-left px-4 py-3 rounded-lg font-bold text-sm flex items-center gap-3 transition-colors ${activeTab === 'traffic' ? 'bg-white text-blue-600 shadow-sm' : 'text-slate-500 hover:bg-white/50'}`}>
                <TrendingUp size={18} /> Traffic & Growth
              </button>
              <button onClick={() => setActiveTab('docs')} className={`w-full text-left px-4 py-3 rounded-lg font-bold text-sm flex items-center gap-3 transition-colors ${activeTab === 'docs' ? 'bg-white text-blue-600 shadow-sm' : 'text-slate-500 hover:bg-white/50'}`}>
                <FileText size={18} /> Documents (3)
              </button>
           </div>

           {/* RIGHT CONTENT */}
           <div className="lg:col-span-3">
              
              {/* TAB: FINANCIALS */}
              {activeTab === 'financials' && (
                <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-8 animate-in fade-in">
                  <h2 className="text-xl font-bold text-slate-900 mb-6">Profit & Loss (P&L) Summary</h2>
                  
                  {/* Mock P&L Table */}
                  <div className="overflow-hidden border border-slate-200 rounded-lg">
                    <table className="w-full text-sm text-left">
                      <thead className="bg-slate-50 text-slate-500 font-bold uppercase text-xs">
                        <tr>
                           <th className="px-6 py-3">Metric</th>
                           <th className="px-6 py-3 text-right">2023</th>
                           <th className="px-6 py-3 text-right">2024 (TTM)</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-100">
                        <tr>
                           <td className="px-6 py-4 font-bold text-slate-900">Gross Revenue</td>
                           <td className="px-6 py-4 text-right text-slate-500">$980,000</td>
                           <td className="px-6 py-4 text-right font-bold text-slate-900">${listing.annual_revenue?.toLocaleString()}</td>
                        </tr>
                        <tr>
                           <td className="px-6 py-4 font-bold text-slate-900">COGS</td>
                           <td className="px-6 py-4 text-right text-slate-500">$200,000</td>
                           <td className="px-6 py-4 text-right text-slate-900">${(Number(listing.annual_revenue) * 0.2).toLocaleString()}</td>
                        </tr>
                        <tr className="bg-green-50/50">
                           <td className="px-6 py-4 font-bold text-green-800">Gross Profit</td>
                           <td className="px-6 py-4 text-right text-green-700">$780,000</td>
                           <td className="px-6 py-4 text-right font-bold text-green-700">${(Number(listing.annual_revenue) * 0.8).toLocaleString()}</td>
                        </tr>
                        <tr>
                           <td className="px-6 py-4 font-bold text-slate-900">Expenses</td>
                           <td className="px-6 py-4 text-right text-slate-500">$450,000</td>
                           <td className="px-6 py-4 text-right text-slate-900">${listing.expenses?.toLocaleString()}</td>
                        </tr>
                        <tr className="bg-blue-50/50 border-t-2 border-blue-100">
                           <td className="px-6 py-4 font-bold text-blue-900">Net Profit (SDE)</td>
                           <td className="px-6 py-4 text-right text-blue-800">$330,000</td>
                           <td className="px-6 py-4 text-right font-bold text-blue-600 text-lg">${listing.annual_cashflow?.toLocaleString()}</td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                  <p className="text-xs text-slate-400 mt-4">* All figures are verified against uploaded tax returns.</p>
                </div>
              )}

              {/* TAB: DOCUMENTS */}
              {activeTab === 'docs' && (
                 <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-8 animate-in fade-in">
                    <h2 className="text-xl font-bold text-slate-900 mb-6">Due Diligence Documents</h2>
                    <div className="space-y-3">
                       {['2024 Profit & Loss Statement', '2023 Corporate Tax Return', 'Proof of Funds Template'].map((doc, i) => (
                         <div key={i} className="flex items-center justify-between p-4 border border-slate-200 rounded-lg hover:border-blue-400 hover:bg-blue-50 transition-colors group cursor-pointer">
                            <div className="flex items-center gap-3">
                               <div className="bg-red-100 text-red-600 p-2 rounded">
                                  <FileText size={20} />
                               </div>
                               <div>
                                  <p className="font-bold text-slate-900">{doc}</p>
                                  <p className="text-xs text-slate-500">PDF • 2.4 MB • Uploaded 2 days ago</p>
                               </div>
                            </div>
                            <button className="text-slate-400 group-hover:text-blue-600">
                               <Download size={20} />
                            </button>
                         </div>
                       ))}
                    </div>
                 </div>
              )}

              {/* TAB: TRAFFIC */}
              {activeTab === 'traffic' && (
                 <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-8 animate-in fade-in">
                    <h2 className="text-xl font-bold text-slate-900 mb-4">Traffic & Operations</h2>
                    <div className="h-64 bg-slate-50 rounded-lg border border-dashed border-slate-300 flex items-center justify-center text-slate-400">
                       <p>Connect Google Analytics to view live traffic data.</p>
                    </div>
                 </div>
              )}

           </div>
        </div>
      </main>
    </div>
  );
}
