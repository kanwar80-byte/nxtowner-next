'use client';

import React, { useState } from 'react';
import { 
  ArrowRight, ArrowLeft, CheckCircle, Sparkles, LayoutGrid, 
  Monitor, Building2, Store, Briefcase 
} from 'lucide-react';
import { useRouter } from 'next/navigation';
import { createListing } from '@/app/actions/createListing';
import { TAXONOMY, AssetType } from '@/lib/taxonomy'; // Import the master list

export default function SellerOnboarding() {
  const router = useRouter();
  const [step, setStep] = useState(1);
  const [isPublishing, setIsPublishing] = useState(false);
  const [isGeneratingAI, setIsGeneratingAI] = useState(false);

  // --- FORM STATE ---
  const [formData, setFormData] = useState({
    businessName: '',
    url: '',
    assetType: 'Operational' as AssetType, // Default
    mainCategory: '',
    subCategory: '',
    location: '',
    revenue: '',
    cashflow: '', // SDE or EBITDA
    foundedYear: '',
    description: '',
    highlights: ['', '', '']
  });

  // --- QUALITY SCORE LOGIC ---
  const calculateQualityScore = () => {
    let score = 0;
    if (formData.businessName) score += 10;
    if (formData.mainCategory) score += 10;
    if (formData.subCategory) score += 5;
    if (formData.revenue && Number(formData.revenue) > 0) score += 20;
    if (formData.cashflow && Number(formData.cashflow) > 0) score += 20;
    if (formData.description.length > 50) score += 20;
    if (formData.location) score += 15;
    return Math.min(score, 100);
  };
  const qualityScore = calculateQualityScore();

  // --- AI GENERATOR ---
  const handleAIGenerate = () => {
    if (!formData.businessName || !formData.mainCategory) {
      alert("Please select a Category first.");
      return;
    }
    setIsGeneratingAI(true);
    setTimeout(() => {
      const metricName = formData.assetType === 'Digital' ? 'ARR' : 'Annual Revenue';
      const profitName = formData.assetType === 'Digital' ? 'SDE/EBITDA' : 'Net Income';
      
      const aiSummary = `A premier ${formData.subCategory} business in the ${formData.mainCategory} sector. Founded in ${formData.foundedYear || 'recent years'}, this ${formData.assetType} asset generates $${Number(formData.revenue).toLocaleString()} in ${metricName}. Key growth opportunities include expansion into new markets and optimizing ${profitName}.`;
      
      setFormData(prev => ({ ...prev, description: aiSummary }));
      setIsGeneratingAI(false);
    }, 1500);
  };

  // --- PUBLISH HANDLER ---
  const handlePublish = async () => {
    setIsPublishing(true);
    try {
      const payload = {
        title: formData.businessName,
        asset_type: formData.assetType,       // New Field
        main_category: formData.mainCategory, // New Field
        sub_category: formData.subCategory,   // New Field
        category: formData.mainCategory,      // Fallback for old code
        location: formData.location,
        asking_price: 0, // Set in next step or default
        annual_revenue: Number(formData.revenue) || 0,
        annual_cashflow: Number(formData.cashflow) || 0,
        description: formData.description,
        nxt_score: Math.floor(qualityScore * 0.8 + 10),
        has_deal_room: true
      };

      const result = await createListing(payload);
      if (result.success) {
        router.push(`/deal-room/${result.listingId}`);
      }
    } catch (error: any) {
      alert(`Publish Failed: ${error.message}`);
    } finally {
      setIsPublishing(false);
    }
  };

  // Helper to get categories based on selected Asset Type
  const currentCategories = Object.keys(TAXONOMY[formData.assetType] || {});
  
  // Helper to get subcategories based on selected Main Category
  const currentSubCategories = formData.mainCategory 
    // @ts-ignore
    ? TAXONOMY[formData.assetType][formData.mainCategory] || [] 
    : [];

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col md:flex-row">
      
      {/* SIDEBAR */}
      <aside className="w-full md:w-80 bg-white border-r border-slate-200 p-8 flex flex-col md:h-screen sticky top-0">
        <h2 className="text-xl font-bold text-slate-900 mb-2">Listing Strength</h2>
        <div className="w-full bg-slate-100 rounded-full h-3 mb-2 overflow-hidden">
          <div className="bg-green-500 h-full transition-all duration-500" style={{ width: `${qualityScore}%` }}></div>
        </div>
        <div className="text-sm font-bold text-slate-500 mb-6">{qualityScore}/100</div>
        
        <div className="bg-blue-50 p-4 rounded-xl border border-blue-100">
          <h3 className="flex items-center gap-2 font-bold text-blue-900 text-sm mb-2"><Sparkles size={14}/> AI Tip</h3>
          <p className="text-xs text-blue-700">
            {formData.assetType === 'Digital' 
              ? "Digital buyers look for Churn Rate and CAC. Mention these in your description."
              : "Operational buyers care about Lease terms and Staffing. Be sure to highlight them."}
          </p>
        </div>
      </aside>

      {/* MAIN FORM */}
      <main className="flex-1 p-8 md:p-12 overflow-y-auto">
        <div className="max-w-2xl mx-auto">
          {/* Progress */}
          <div className="flex items-center gap-4 mb-10 text-sm font-medium text-slate-400">
            <span className={step===1 ? "text-blue-600 font-bold" : ""}>1. Categorization</span>
            <span>/</span>
            <span className={step===2 ? "text-blue-600 font-bold" : ""}>2. Financials</span>
            <span>/</span>
            <span className={step===3 ? "text-blue-600 font-bold" : ""}>3. Review</span>
          </div>

          {/* STEP 1: ASSET TYPE & CATEGORY */}
          {step === 1 && (
            <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4">
              <div>
                <h1 className="text-3xl font-bold text-slate-900 mb-2">What are you selling?</h1>
                <p className="text-slate-500">Choose the asset class that best fits your business.</p>
              </div>

              {/* Asset Type Switcher */}
              <div className="grid grid-cols-2 gap-4">
                <button 
                  onClick={() => setFormData({...formData, assetType: 'Operational', mainCategory: '', subCategory: ''})}
                  className={`p-6 rounded-xl border-2 text-left transition-all ${formData.assetType === 'Operational' ? 'border-blue-600 bg-blue-50 ring-1 ring-blue-600' : 'border-slate-200 hover:border-slate-300'}`}
                >
                  <Building2 className={`mb-3 ${formData.assetType === 'Operational' ? 'text-blue-600' : 'text-slate-400'}`} />
                  <div className="font-bold text-slate-900">Operational Asset</div>
                  <div className="text-xs text-slate-500 mt-1">Brick & Mortar, Retail, Logistics</div>
                </button>

                <button 
                  onClick={() => setFormData({...formData, assetType: 'Digital', mainCategory: '', subCategory: ''})}
                  className={`p-6 rounded-xl border-2 text-left transition-all ${formData.assetType === 'Digital' ? 'border-purple-600 bg-purple-50 ring-1 ring-purple-600' : 'border-slate-200 hover:border-slate-300'}`}
                >
                  <Monitor className={`mb-3 ${formData.assetType === 'Digital' ? 'text-purple-600' : 'text-slate-400'}`} />
                  <div className="font-bold text-slate-900">Digital Asset</div>
                  <div className="text-xs text-slate-500 mt-1">SaaS, E-com, Content, Agency</div>
                </button>
              </div>

              {/* Dynamic Categories */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-bold text-slate-700 mb-2">Main Category</label>
                  <select 
                    value={formData.mainCategory}
                    onChange={(e) => setFormData({...formData, mainCategory: e.target.value, subCategory: ''})}
                    className="w-full p-3 border border-slate-200 rounded-lg bg-white focus:ring-2 focus:ring-blue-600 outline-none"
                  >
                    <option value="">Select Category...</option>
                    {currentCategories.map(cat => <option key={cat} value={cat}>{cat}</option>)}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-bold text-slate-700 mb-2">Subcategory</label>
                  <select 
                    value={formData.subCategory}
                    disabled={!formData.mainCategory}
                    onChange={(e) => setFormData({...formData, subCategory: e.target.value})}
                    className="w-full p-3 border border-slate-200 rounded-lg bg-white focus:ring-2 focus:ring-blue-600 outline-none disabled:bg-slate-100 disabled:text-slate-400"
                  >
                    <option value="">Select Subcategory...</option>
                    {currentSubCategories.map((sub: string) => <option key={sub} value={sub}>{sub}</option>)}
                  </select>
                </div>
              </div>

              <div>
                 <label className="block text-sm font-bold text-slate-700 mb-2">Business Name</label>
                 <input 
                    type="text" 
                    value={formData.businessName}
                    onChange={(e) => setFormData({...formData, businessName: e.target.value})}
                    className="w-full p-3 border border-slate-200 rounded-lg"
                    placeholder="e.g. Downtown Coffee Co."
                  />
              </div>

              <div className="flex justify-end pt-4">
                <button onClick={() => setStep(2)} className="bg-blue-600 text-white px-8 py-3 rounded-lg font-bold flex items-center gap-2">
                  Next Step <ArrowRight size={18} />
                </button>
              </div>
            </div>
          )}

          {/* STEP 2: FINANCIALS (Same as before but with asset-aware labels) */}
          {step === 2 && (
             <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4">
                <h1 className="text-3xl font-bold text-slate-900">Key Metrics</h1>
                
                <div className="grid grid-cols-2 gap-6 p-6 bg-slate-100 rounded-xl border border-slate-200">
                  <div>
                    <label className="block text-xs font-bold uppercase text-slate-500 mb-2">
                      {formData.assetType === 'Digital' ? 'Annual ARR / Revenue' : 'Annual Gross Revenue'}
                    </label>
                    <div className="relative">
                      <span className="absolute left-3 top-3 text-slate-400">$</span>
                      <input type="number" value={formData.revenue} onChange={e => setFormData({...formData, revenue: e.target.value})} className="w-full p-3 pl-8 border border-slate-200 rounded-lg"/>
                    </div>
                  </div>
                  <div>
                    <label className="block text-xs font-bold uppercase text-slate-500 mb-2">
                      {formData.assetType === 'Digital' ? 'SDE / EBITDA' : 'Cash Flow (SDE)'}
                    </label>
                    <div className="relative">
                      <span className="absolute left-3 top-3 text-slate-400">$</span>
                      <input type="number" value={formData.cashflow} onChange={e => setFormData({...formData, cashflow: e.target.value})} className="w-full p-3 pl-8 border border-slate-200 rounded-lg"/>
                    </div>
                  </div>
                </div>

                {/* AI WRITER */}
                <div className="pt-4">
                  <div className="flex justify-between items-center mb-2">
                    <label className="block text-sm font-bold text-slate-700">Description</label>
                    <button onClick={handleAIGenerate} className="text-xs bg-purple-100 text-purple-700 px-3 py-1 rounded-full font-bold flex items-center gap-1">
                      <Sparkles size={12} /> {isGeneratingAI ? "Writing..." : "AI Write"}
                    </button>
                  </div>
                  <textarea rows={6} value={formData.description} onChange={e => setFormData({...formData, description: e.target.value})} className="w-full p-4 border border-slate-200 rounded-lg focus:ring-2 focus:ring-purple-500 outline-none" placeholder="Describe the business..." />
                </div>

                <div className="flex justify-between mt-8">
                  <button onClick={() => setStep(1)} className="text-slate-500 font-bold px-4">Back</button>
                  <button onClick={() => setStep(3)} className="bg-blue-600 text-white px-8 py-3 rounded-lg font-bold flex items-center gap-2">Next <ArrowRight size={18} /></button>
                </div>
             </div>
          )}

          {/* STEP 3: REVIEW (Same as before) */}
          {step === 3 && (
             <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4">
                <h1 className="text-3xl font-bold text-slate-900">Review Listing</h1>
                <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-lg max-w-sm mx-auto">
                   <div className="aspect-video bg-slate-100 rounded-lg mb-4 relative overflow-hidden">
                      <div className="absolute top-2 left-2 bg-blue-600 text-white text-[10px] font-bold px-2 py-1 rounded">PREVIEW</div>
                   </div>
                   <div className="flex items-center gap-2 mb-2">
                      <span className="text-[10px] font-bold uppercase bg-slate-100 px-2 py-1 rounded text-slate-600">{formData.assetType}</span>
                      <span className="text-[10px] font-bold uppercase bg-blue-50 px-2 py-1 rounded text-blue-600">{formData.mainCategory}</span>
                   </div>
                   <h3 className="font-bold text-xl mb-2">{formData.businessName || 'Untitled'}</h3>
                   <p className="text-sm text-slate-500 line-clamp-3">{formData.description}</p>
                </div>
                
                <div className="flex justify-between mt-8">
                  <button onClick={() => setStep(2)} className="text-slate-500 font-bold px-4">Back</button>
                  <button onClick={handlePublish} disabled={isPublishing} className="bg-[#EA580C] text-white px-8 py-4 rounded-lg font-bold shadow-lg hover:bg-orange-700 w-full md:w-auto">
                    {isPublishing ? "Publishing..." : "Publish Listing"}
                  </button>
                </div>
             </div>
          )}
        </div>
      </main>
    </div>
  );
}
