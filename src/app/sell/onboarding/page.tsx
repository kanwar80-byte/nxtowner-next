'use client';

import React, { useState } from 'react';
import { 
  ArrowRight, ArrowLeft, CheckCircle, Sparkles, 
  Building2, Monitor, Image as ImageIcon, Globe, Calendar, Users
} from 'lucide-react';
import { useRouter } from 'next/navigation';
import { createListing } from '@/app/actions/createListing';
import { TAXONOMY, AssetType } from '@/lib/taxonomy';

export default function SellerOnboarding() {
  const router = useRouter();
  const [step, setStep] = useState(1);
  const [isPublishing, setIsPublishing] = useState(false);
  const [isGeneratingAI, setIsGeneratingAI] = useState(false);

  // --- COMPREHENSIVE FORM STATE ---
  const [formData, setFormData] = useState({
    // Step 1: Identity
    businessName: '',
    assetType: 'Operational' as AssetType,
    mainCategory: '',
    subCategory: '',
    location: '',
    websiteUrl: '',
    foundedYear: '',
    employees: '',
    
    // Step 2: Financials
    revenue: '',
    cashflow: '',
    expenses: '',
    askingPrice: '',
    grossMargin: '',
    
    // Step 3: Story & Media
    description: '',
    imageUrl: '', // For MVP we use URL. Later: File Upload
    
    highlights: ['', '', '']
  });

  // --- HARDER SCORING LOGIC ---
  const calculateQualityScore = () => {
    let score = 0;
    // Basics (20%)
    if (formData.businessName) score += 5;
    if (formData.subCategory) score += 5;
    if (formData.location) score += 5;
    if (formData.foundedYear) score += 5;

    // Financials (30%)
    if (Number(formData.revenue) > 0) score += 10;
    if (Number(formData.cashflow) > 0) score += 10;
    if (Number(formData.expenses) > 0) score += 5;
    if (Number(formData.askingPrice) > 0) score += 5;

    // Content (50%) - The hard part
    if (formData.description.length > 100) score += 10; // Long desc required
    if (formData.description.length > 300) score += 10; // detailed desc
    if (formData.websiteUrl) score += 10;
    if (formData.imageUrl) score += 20; // Big points for image

    return Math.min(score, 100);
  };
  const qualityScore = calculateQualityScore();

  // --- AI GENERATOR ---
  const handleAIGenerate = () => {
    if (!formData.mainCategory) return alert("Select a category first.");
    setIsGeneratingAI(true);
    setTimeout(() => {
      const type = formData.assetType;
      const desc = `A verified ${formData.subCategory || formData.mainCategory} opportunity in ${formData.location || 'a prime market'}. \n\nEstablished in ${formData.foundedYear || 'recent years'}, this ${type} business generates $${formData.revenue || '0'} in revenue with impressive margins. \n\nKey Strengths:\n• Stable cash flow ($${formData.cashflow})\n• Turnkey operations with ${formData.employees || 'dedicated'} staff\n• Huge growth potential in the ${formData.mainCategory} sector.\n\nIdeal for an investor looking for immediate ROI.`;
      setFormData(prev => ({ ...prev, description: desc }));
      setIsGeneratingAI(false);
    }, 1500);
  };

  // --- PUBLISH ---
  const handlePublish = async () => {
    setIsPublishing(true);
    try {
      const payload = {
        ...formData,
        // Map fields to match Server Action expectation
        annual_revenue: formData.revenue,
        annual_cashflow: formData.cashflow,
        asking_price: formData.askingPrice,
        nxt_score: Math.floor(qualityScore), // Real score
      };

      const result = await createListing(payload);
      if (result.success) router.push(`/deal-room/${result.listingId}`);
    } catch (error: any) {
      alert(`Error: ${error.message}`);
    } finally {
      setIsPublishing(false);
    }
  };

  // Helpers
  const currentCategories = Object.keys(TAXONOMY[formData.assetType] || {});
  // @ts-ignore
  const currentSubCategories = formData.mainCategory ? TAXONOMY[formData.assetType][formData.mainCategory] || [] : [];

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col md:flex-row">
      
      {/* LEFT SIDEBAR: SCORE & TIPS */}
      <aside className="w-full md:w-80 bg-white border-r border-slate-200 p-8 flex flex-col md:h-screen sticky top-0 overflow-y-auto">
        <h2 className="text-xl font-bold text-slate-900 mb-2">Listing Score</h2>
        
        {/* SCORE CIRCLE */}
        <div className="relative h-32 w-32 mx-auto my-6 flex items-center justify-center">
           <svg className="w-full h-full" viewBox="0 0 36 36">
              <path className="text-slate-100" d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" fill="none" stroke="currentColor" strokeWidth="4" />
              <path className={`${qualityScore > 80 ? 'text-green-500' : (qualityScore > 50 ? 'text-yellow-500' : 'text-red-500')} transition-all duration-1000 ease-out`} strokeDasharray={`${qualityScore}, 100`} d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" fill="none" stroke="currentColor" strokeWidth="4" />
           </svg>
           <div className="absolute flex flex-col items-center">
             <span className="text-3xl font-bold text-slate-900">{qualityScore}</span>
             <span className="text-[10px] uppercase text-slate-400 font-bold">Points</span>
           </div>
        </div>

        <div className="space-y-3 text-sm">
           <div className={`flex items-center gap-2 ${formData.businessName ? 'text-green-600' : 'text-slate-400'}`}>
             <CheckCircle size={16} /> Business Identity
           </div>
           <div className={`flex items-center gap-2 ${Number(formData.revenue) > 0 ? 'text-green-600' : 'text-slate-400'}`}>
             <CheckCircle size={16} /> Financials
           </div>
           <div className={`flex items-center gap-2 ${formData.imageUrl ? 'text-green-600' : 'text-slate-400'}`}>
             <CheckCircle size={16} /> Photos (Worth 20 pts)
           </div>
        </div>
      </aside>

      {/* MAIN FORM */}
      <main className="flex-1 p-8 md:p-12 overflow-y-auto">
        <div className="max-w-3xl mx-auto">
          
          {/* Progress Bar */}
          <div className="w-full bg-slate-200 h-1.5 rounded-full mb-10">
             <div className="bg-slate-900 h-1.5 rounded-full transition-all duration-500" style={{ width: `${step * 33}%` }}></div>
          </div>

          {/* STEP 1: IDENTITY */}
          {step === 1 && (
            <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4">
              <h1 className="text-3xl font-bold text-slate-900">Business Identity</h1>
              
              <div className="grid grid-cols-2 gap-4">
                <button onClick={() => setFormData({...formData, assetType: 'Operational'})} className={`p-4 border-2 rounded-xl flex items-center gap-3 ${formData.assetType === 'Operational' ? 'border-blue-600 bg-blue-50' : 'border-slate-200'}`}>
                  <Building2 className={formData.assetType === 'Operational' ? 'text-blue-600' : 'text-slate-400'} />
                  <div className="text-left"><p className="font-bold text-sm">Operational</p></div>
                </button>
                <button onClick={() => setFormData({...formData, assetType: 'Digital'})} className={`p-4 border-2 rounded-xl flex items-center gap-3 ${formData.assetType === 'Digital' ? 'border-purple-600 bg-purple-50' : 'border-slate-200'}`}>
                  <Monitor className={formData.assetType === 'Digital' ? 'text-purple-600' : 'text-slate-400'} />
                  <div className="text-left"><p className="font-bold text-sm">Digital Asset</p></div>
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                 <div>
                    <label className="block text-sm font-bold text-slate-700 mb-2">Category</label>
                    <select value={formData.mainCategory} onChange={e => setFormData({...formData, mainCategory: e.target.value})} className="w-full p-3 border rounded-lg bg-white">
                       <option value="">Select...</option>
                       {currentCategories.map(c => <option key={c} value={c}>{c}</option>)}
                    </select>
                 </div>
                 <div>
                    <label className="block text-sm font-bold text-slate-700 mb-2">Subcategory</label>
                    <select value={formData.subCategory} onChange={e => setFormData({...formData, subCategory: e.target.value})} className="w-full p-3 border rounded-lg bg-white">
                       <option value="">Select...</option>
                       {currentSubCategories.map((c: string) => <option key={c} value={c}>{c}</option>)}
                    </select>
                 </div>
                 
                 <div className="col-span-2">
                    <label className="block text-sm font-bold text-slate-700 mb-2">Business Title</label>
                    <input type="text" value={formData.businessName} onChange={e => setFormData({...formData, businessName: e.target.value})} className="w-full p-3 border rounded-lg" placeholder="e.g. Established SaaS in Fintech" />
                 </div>

                 <div>
                    <label className="block text-sm font-bold text-slate-700 mb-2">Website URL</label>
                    <div className="relative">
                      <Globe className="absolute left-3 top-3.5 text-slate-400" size={16} />
                      <input type="text" value={formData.websiteUrl} onChange={e => setFormData({...formData, websiteUrl: e.target.value})} className="w-full p-3 pl-10 border rounded-lg" placeholder="https://..." />
                    </div>
                 </div>

                 <div className="grid grid-cols-2 gap-4">
                    <div>
                       <label className="block text-sm font-bold text-slate-700 mb-2">Year Founded</label>
                       <input type="number" value={formData.foundedYear} onChange={e => setFormData({...formData, foundedYear: e.target.value})} className="w-full p-3 border rounded-lg" placeholder="2015" />
                    </div>
                    <div>
                       <label className="block text-sm font-bold text-slate-700 mb-2">Employees</label>
                       <input type="number" value={formData.employees} onChange={e => setFormData({...formData, employees: e.target.value})} className="w-full p-3 border rounded-lg" placeholder="0" />
                    </div>
                 </div>
                 
                 <div className="col-span-2">
                    <label className="block text-sm font-bold text-slate-700 mb-2">Location</label>
                    <input type="text" value={formData.location} onChange={e => setFormData({...formData, location: e.target.value})} className="w-full p-3 border rounded-lg" placeholder="City, Country" />
                 </div>
              </div>

              <div className="flex justify-end pt-6">
                <button onClick={() => setStep(2)} className="bg-slate-900 text-white px-8 py-3 rounded-lg font-bold flex items-center gap-2 hover:bg-slate-800">
                   Next: Financials <ArrowRight size={18} />
                </button>
              </div>
            </div>
          )}

          {/* STEP 2: FINANCIALS */}
          {step === 2 && (
            <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4">
               <h1 className="text-3xl font-bold text-slate-900">Financial Performance</h1>
               <div className="bg-blue-50 p-4 rounded-lg border border-blue-100 text-sm text-blue-800">
                  <span className="font-bold">Pro Tip:</span> Buyers require at least Revenue and Cash Flow to consider a deal.
               </div>

               <div className="grid grid-cols-2 gap-6">
                  <div>
                     <label className="block text-xs font-bold uppercase text-slate-500 mb-2">Annual Revenue</label>
                     <input type="number" value={formData.revenue} onChange={e => setFormData({...formData, revenue: e.target.value})} className="w-full p-3 border rounded-lg font-mono" placeholder="$0.00" />
                  </div>
                  <div>
                     <label className="block text-xs font-bold uppercase text-slate-500 mb-2">Annual Cash Flow (SDE)</label>
                     <input type="number" value={formData.cashflow} onChange={e => setFormData({...formData, cashflow: e.target.value})} className="w-full p-3 border rounded-lg font-mono text-green-700 font-bold" placeholder="$0.00" />
                  </div>
                  <div>
                     <label className="block text-xs font-bold uppercase text-slate-500 mb-2">Total Expenses</label>
                     <input type="number" value={formData.expenses} onChange={e => setFormData({...formData, expenses: e.target.value})} className="w-full p-3 border rounded-lg font-mono text-red-600" placeholder="$0.00" />
                  </div>
                  <div>
                     <label className="block text-xs font-bold uppercase text-slate-500 mb-2">Asking Price</label>
                     <input type="number" value={formData.askingPrice} onChange={e => setFormData({...formData, askingPrice: e.target.value})} className="w-full p-3 border rounded-lg font-mono font-bold" placeholder="$0.00" />
                  </div>
               </div>

               <div className="flex justify-between pt-6">
                  <button onClick={() => setStep(1)} className="text-slate-500 font-bold">Back</button>
                  <button onClick={() => setStep(3)} className="bg-slate-900 text-white px-8 py-3 rounded-lg font-bold flex items-center gap-2 hover:bg-slate-800">
                     Next: Media <ArrowRight size={18} />
                  </button>
               </div>
            </div>
          )}

          {/* STEP 3: MEDIA & PUBLISH */}
          {step === 3 && (
             <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4">
                <h1 className="text-3xl font-bold text-slate-900">Showcase Your Business</h1>

                {/* IMAGE URL INPUT */}
                <div>
                   <label className="block text-sm font-bold text-slate-700 mb-2">Main Image URL</label>
                   <div className="flex gap-2">
                     <div className="relative flex-1">
                        <ImageIcon className="absolute left-3 top-3.5 text-slate-400" size={16} />
                        <input type="text" value={formData.imageUrl} onChange={e => setFormData({...formData, imageUrl: e.target.value})} className="w-full p-3 pl-10 border rounded-lg" placeholder="https://example.com/image.jpg" />
                     </div>
                   </div>
                   <p className="text-xs text-slate-500 mt-2">Paste a direct link to a hosted image (e.g. Unsplash, Imgur) for now.</p>
                </div>

                {/* AI DESCRIPTION */}
                <div>
                   <div className="flex justify-between items-center mb-2">
                      <label className="block text-sm font-bold text-slate-700">Detailed Description</label>
                      <button onClick={handleAIGenerate} disabled={isGeneratingAI} className="text-xs bg-purple-100 text-purple-700 px-3 py-1 rounded-full font-bold flex items-center gap-1 hover:bg-purple-200">
                        <Sparkles size={12} /> {isGeneratingAI ? 'Writing...' : 'Auto-Write with AI'}
                      </button>
                   </div>
                   <textarea rows={8} value={formData.description} onChange={e => setFormData({...formData, description: e.target.value})} className="w-full p-4 border rounded-lg leading-relaxed focus:ring-2 focus:ring-purple-500 outline-none" placeholder="Tell the full story..." />
                </div>

                <div className="bg-slate-100 p-6 rounded-xl flex items-center justify-between">
                   <div>
                      <p className="font-bold text-slate-900">Ready to publish?</p>
                      <p className="text-xs text-slate-500">Your listing score is <span className="font-bold">{qualityScore}/100</span></p>
                   </div>
                   <button onClick={handlePublish} disabled={isPublishing} className="bg-[#EAB308] text-slate-900 px-8 py-3 rounded-lg font-bold hover:bg-[#CA8A04] shadow-lg">
                      {isPublishing ? 'Publishing...' : 'Launch Listing'}
                   </button>
                </div>
                <button onClick={() => setStep(2)} className="text-slate-500 font-bold block">Back</button>
             </div>
          )}

        </div>
      </main>
    </div>
  );
}
