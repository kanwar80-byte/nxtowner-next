'use client';

import { createListing } from '@/app/actions/createListing';
import { AssetType, TAXONOMY } from '@/lib/taxonomy';
<<<<<<< HEAD
=======
import { buildDealRoomChecklist, ChecklistItem } from "@/utils/dealRoomChecklist";
import { clearListingDraft, loadListingDraft } from '@/utils/listingDraft';
>>>>>>> da316d3 (Fix metadata encoding and stabilize nav/valuation labels)
import {
   ArrowRight,
   Building2,
   CheckCircle,
   Globe,
   Image as ImageIcon,
   Monitor,
   Sparkles
} from 'lucide-react';
<<<<<<< HEAD
import { useRouter } from 'next/navigation';
import { useState } from 'react';
=======
import { useRouter, useSearchParams } from 'next/navigation';
import { useEffect, useState } from 'react';
>>>>>>> da316d3 (Fix metadata encoding and stabilize nav/valuation labels)

export default function SellerOnboarding() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [step, setStep] = useState(1);
  const [isPublishing, setIsPublishing] = useState(false);
  const [isGeneratingAI, setIsGeneratingAI] = useState(false);
  const [draft, setDraft] = useState<any | null>(null);

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

  useEffect(() => {
    if (searchParams.get("prefill") === "nxtai") {
      setDraft(loadListingDraft());
    }
  }, [searchParams]);

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

  function handleClearDraft() {
    clearListingDraft();
    setDraft(null);
    router.replace("/sell/onboarding");
  }

  // Helpers
  const currentCategories = Object.keys(TAXONOMY[formData.assetType] || {});
  // @ts-ignore
  const currentSubCategories = formData.mainCategory ? TAXONOMY[formData.assetType][formData.mainCategory] || [] : [];

  const checklist = draft
    ? buildDealRoomChecklist({
        track: draft.track,
        missing: draft.readiness?.missing,
      })
    : [];

  // Group checklist by category
  const groupedChecklist: Record<string, ChecklistItem[]> = {};
  checklist.forEach((item) => {
    if (!groupedChecklist[item.category]) groupedChecklist[item.category] = [];
    groupedChecklist[item.category].push(item);
  });

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

          {/* DRAFT BANNER & PREVIEW */}
          {searchParams.get("prefill") === "nxtai" && draft && (
        <div className="mb-6 rounded-xl border border-yellow-300 bg-yellow-50 px-6 py-4">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
            <div>
              <div className="font-semibold text-yellow-900 text-base mb-1">
                Draft created from NxtAI Valuation
              </div>
              <div className="text-sm text-yellow-800">
                We pre-filled your listing with valuation, readiness score, and key highlights. Review and complete missing items.
              </div>
            </div>
            <button
              className="mt-2 sm:mt-0 bg-yellow-200 hover:bg-yellow-300 text-yellow-900 font-semibold px-4 py-2 rounded-lg transition"
              onClick={handleClearDraft}
            >
              Clear draft
            </button>
          </div>
          {/* Draft Preview Card */}
          <div className="mt-4 bg-white rounded-xl border border-slate-200 p-4">
            <div className="font-semibold text-slate-900 mb-2">
              {draft.suggestedTitle}
            </div>
            <div className="text-sm text-slate-700 mb-2">
              {draft.location && <span>Location: {draft.location} &nbsp; </span>}
              {draft.categoryOrModel && <span>Category/Model: {draft.categoryOrModel}</span>}
            </div>
            <div className="mb-2">
              <div className="text-xs text-slate-500 mb-1">Valuation Range (CAD)</div>
              <div className="flex gap-4">
                <span className="bg-slate-50 border border-slate-200 rounded px-3 py-1 text-slate-800 text-sm">
                  Low: ${draft.valuation?.low?.toLocaleString?.() ?? "—"}
                </span>
                <span className="bg-slate-50 border border-slate-200 rounded px-3 py-1 text-slate-800 text-sm">
                  Base: ${draft.valuation?.base?.toLocaleString?.() ?? "—"}
                </span>
                <span className="bg-slate-50 border border-slate-200 rounded px-3 py-1 text-slate-800 text-sm">
                  High: ${draft.valuation?.high?.toLocaleString?.() ?? "—"}
                </span>
                <span className="bg-slate-50 border border-slate-200 rounded px-3 py-1 text-slate-800 text-xs">
                  Confidence: {draft.valuation?.confidence ?? "—"}
                </span>
              </div>
            </div>
            {draft.readiness && (
              <div className="mb-2">
                <div className="text-xs text-slate-500 mb-1">Readiness Score</div>
                <div className="flex items-center gap-3 mb-1">
                  <span className="text-lg font-bold text-slate-900">{draft.readiness.score}/100</span>
                  <span className="text-xs px-3 py-1 rounded-full bg-emerald-500/12 border border-emerald-500/25 text-emerald-200 font-semibold">
                    {draft.readiness.tier === "deal_ready"
                      ? "Deal-Ready"
                      : draft.readiness.tier === "nearly_ready"
                      ? "Nearly Ready"
                      : "Not Ready"}
                  </span>
                </div>
                <div className="text-xs text-slate-700">
                  {draft.readiness.missing?.length > 0 && (
                    <div>
                      <span className="font-semibold">Missing:</span>{" "}
                      {draft.readiness.missing.slice(0, 3).join(", ")}
                    </div>
                  )}
                </div>
              </div>
            )}
            {/* Optionally show more draft fields here */}
          </div>
        </div>
      )}

      {/* DEAL ROOM PACK CHECKLIST */}
      {searchParams.get("prefill") === "nxtai" && draft && (
        <div className="mt-8">
          <div className="font-bold text-lg text-slate-900 mb-1">
            Deal Room Pack Checklist
          </div>
          <div className="text-slate-600 text-sm mb-4">
            Complete these items to reach Deal-Ready status and unlock faster buyer diligence.
          </div>
          {/* Progress Card */}
          <div className="mb-4 bg-slate-50 border border-slate-200 rounded-xl p-4 flex flex-col sm:flex-row gap-4 items-center">
            <div className="flex-1">
              <div className="font-semibold text-slate-700 mb-1">Deal-Ready Progress</div>
              {draft.readiness ? (
                <div className="flex items-center gap-3">
                  <span className="text-2xl font-bold text-slate-900">{draft.readiness.score}/100</span>
                  <span className={`text-xs px-3 py-1 rounded-full font-semibold ${
                    draft.readiness.tier === "deal_ready"
                      ? "bg-emerald-500/12 border border-emerald-500/25 text-emerald-200"
                      : draft.readiness.tier === "nearly_ready"
                      ? "bg-[#D4AF37]/15 border border-[#D4AF37]/25 text-[#F6E7B0]"
                      : "bg-white/5 border border-white/10 text-slate-200"
                  }`}>
                    {draft.readiness.tier === "deal_ready"
                      ? "Deal-Ready"
                      : draft.readiness.tier === "nearly_ready"
                      ? "Nearly Ready"
                      : "Not Ready"}
                  </span>
                  {draft.readiness.missing?.length > 0 && (
                    <span className="text-xs text-slate-700 ml-2">
                      Top gaps: {draft.readiness.missing.slice(0, 3).join(", ")}
                    </span>
                  )}
                </div>
              ) : (
                <div className="text-slate-500 text-sm">Add financials to compute readiness score.</div>
              )}
            </div>
          </div>
          {/* Checklist grouped by category */}
          <div className="space-y-6">
            {["financials", "performance", "operations", "assets", "legal", "risk"].map((cat) =>
              groupedChecklist[cat]?.length ? (
                <div key={cat}>
                  <div className="font-semibold text-slate-800 mb-2 capitalize">
                    {cat.charAt(0).toUpperCase() + cat.slice(1)}{" "}
                    <span className="text-xs text-slate-500 font-normal">
                      ({groupedChecklist[cat].filter(i => i.status === "todo").length}/{groupedChecklist[cat].length})
                    </span>
                  </div>
                  <ul className="space-y-2">
                    {groupedChecklist[cat].map((item) => (
                      <li key={item.id} className="flex items-start gap-3 bg-white border border-slate-100 rounded-lg px-3 py-2">
                        {/* Checkbox icon (visual only) */}
                        <span className="mt-1 w-4 h-4 rounded-full border border-slate-300 bg-slate-50 flex items-center justify-center">
                          <span className="w-2 h-2 rounded-full bg-slate-300" />
                        </span>
                        <div className="flex-1">
                          <div className="font-medium text-slate-800 text-sm">{item.title}</div>
                          {item.description && (
                            <div className="text-xs text-slate-500">{item.description}</div>
                          )}
                        </div>
                        <span className={`text-xs px-2 py-0.5 rounded-full font-semibold border ${
                          item.status === "todo"
                            ? "bg-slate-100 text-slate-500 border-slate-200"
                            : item.status === "in_progress"
                            ? "bg-yellow-100 text-yellow-700 border-yellow-200"
                            : "bg-emerald-100 text-emerald-700 border-emerald-200"
                        }`}>
                          {item.status.replace("_", " ")}
                        </span>
                      </li>
                    ))}
                  </ul>
                </div>
              ) : null
            )}
          </div>
        </div>
      )}

        </div>
      </main>
    </div>
  );
}
