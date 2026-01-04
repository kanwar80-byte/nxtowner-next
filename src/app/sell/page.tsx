'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { createClient } from '@/utils/supabase/client'; 
// Ensure you have the JSON file saved at this exact path:
import taxonomyData from '@/data/taxonomy_v17.json'; 
import { Building2, Globe, ArrowRight, CheckCircle, AlertCircle } from 'lucide-react'; // Make sure to install lucide-react

export default function SellPage() {
  const router = useRouter();
  const supabase = createClient();
  
  // --- STATE MANAGEMENT ---
  const [step, setStep] = useState<number>(1); // 1: Select Type, 2: Select Category, 3: Details
  const [assetType, setAssetType] = useState<'operational' | 'digital' | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<string>('');
  const [selectedSubcategory, setSelectedSubcategory] = useState<string>('');
  const [formData, setFormData] = useState<any>({});
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  // --- LOGIC: Load the Brain ---
  const currentTaxonomy = assetType === 'operational' 
    ? taxonomyData.operational_assets 
    : taxonomyData.digital_assets;

  const categoryConfig = currentTaxonomy?.categories.find(c => c.id === selectedCategory);

  // --- HANDLERS ---
  const handleInputChange = (key: string, value: any) => {
    setFormData((prev: any) => ({ ...prev, [key]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setErrorMsg(null);

    try {
      // 1. Get User (Security Check)
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error("You must be logged in to list an asset.");

      // 2. Select Table
      const tableName = assetType === 'operational' ? 'listings_operational' : 'listings_digital';

      // 3. Prepare Payload (Aligning with Database Schema)
      const submissionPayload = {
        user_id: user.id,
        status: 'draft',
        category: categoryConfig?.name,
        subcategory: selectedSubcategory,
        ...formData // This now works perfectly because the columns exist!
      };

      // 4. Send to Supabase
      const { error } = await supabase.from(tableName).insert(submissionPayload);
      if (error) throw error;

      // 5. Success -> Redirect to Deal Room
      router.push('/dashboard?new_listing=true');

    } catch (err: any) {
      console.error('Listing Error:', err);
      setErrorMsg(err.message || 'Something went wrong.');
    } finally {
      setLoading(false);
    }
  };

  // --- RENDER ---
  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        
        {/* Header */}
        <div className="text-center mb-10">
          <h1 className="text-4xl font-extrabold text-gray-900 tracking-tight">
            Sell Your Asset
          </h1>
          <p className="mt-2 text-lg text-gray-600">
            NxtOwner V17 Engine: Intelligent data mapping for fast closes.
          </p>
        </div>

        <div className="bg-white shadow-xl rounded-2xl overflow-hidden border border-gray-100">
          
          {/* STEP 1: ASSET TYPE SELECTION */}
          {step === 1 && (
            <div className="p-8 md:p-12">
              <h2 className="text-2xl font-bold text-gray-800 mb-6">What are you selling?</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                
                {/* Operational Card */}
                <button
                  onClick={() => { setAssetType('operational'); setStep(2); }}
                  className="group relative flex flex-col items-center p-8 border-2 border-gray-200 rounded-2xl hover:border-blue-600 hover:bg-blue-50 transition-all duration-200"
                >
                  <div className="p-4 bg-blue-100 rounded-full mb-4 group-hover:bg-blue-200">
                    <Building2 className="w-10 h-10 text-blue-700" />
                  </div>
                  <h3 className="text-xl font-bold text-gray-900">Operational Asset</h3>
                  <p className="text-center text-gray-500 mt-2 text-sm">
                    Gas Stations, Retail, Industrial, Car Washes. <br/>
                    <span className="font-semibold">"Bricks & Mortar"</span>
                  </p>
                </button>

                {/* Digital Card */}
                <button
                  onClick={() => { setAssetType('digital'); setStep(2); }}
                  className="group relative flex flex-col items-center p-8 border-2 border-gray-200 rounded-2xl hover:border-purple-600 hover:bg-purple-50 transition-all duration-200"
                >
                  <div className="p-4 bg-purple-100 rounded-full mb-4 group-hover:bg-purple-200">
                    <Globe className="w-10 h-10 text-purple-700" />
                  </div>
                  <h3 className="text-xl font-bold text-gray-900">Digital Asset</h3>
                  <p className="text-center text-gray-500 mt-2 text-sm">
                    SaaS, E-Commerce, Domains, Content Sites. <br/>
                    <span className="font-semibold">"Clicks & Code"</span>
                  </p>
                </button>
              </div>
            </div>
          )}

          {/* STEP 2: FORM ENGINE */}
          {step === 2 && assetType && (
            <form onSubmit={handleSubmit} className="p-8">
              {/* Back Button */}
              <button 
                type="button" 
                onClick={() => { setStep(1); setAssetType(null); setFormData({}); }}
                className="text-sm text-gray-500 hover:text-gray-900 mb-6 flex items-center"
              >
                ← Back to Asset Type
              </button>

              {/* Progress Bar */}
              <div className="h-2 w-full bg-gray-100 rounded-full mb-8 overflow-hidden">
                <div className={`h-full ${assetType === 'operational' ? 'bg-blue-600' : 'bg-purple-600'} w-1/2`}></div>
              </div>

              <div className="space-y-8">
                
                {/* A. CATEGORY SELECTOR */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">Category</label>
                    <select 
                      className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                      value={selectedCategory}
                      onChange={(e) => {
                        setSelectedCategory(e.target.value);
                        setSelectedSubcategory('');
                      }}
                      required
                    >
                      <option value="">Select Category...</option>
                      {currentTaxonomy?.categories.map((cat) => (
                        <option key={cat.id} value={cat.id}>{cat.name}</option>
                      ))}
                    </select>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">Subcategory</label>
                    <select 
                      className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                      value={selectedSubcategory}
                      onChange={(e) => setSelectedSubcategory(e.target.value)}
                      disabled={!selectedCategory}
                      required
                    >
                      <option value="">Select Subcategory...</option>
                      {categoryConfig?.subcategories.map((sub) => (
                        <option key={sub} value={sub}>{sub}</option>
                      ))}
                    </select>
                  </div>
                </div>

                {/* B. CORE DETAILS */}
                <div className="bg-gray-50 p-6 rounded-xl border border-gray-200">
                  <h3 className="text-lg font-bold text-gray-800 mb-4 flex items-center">
                    1. Core Financials
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="md:col-span-2">
                      <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Listing Title</label>
                      <input 
                        required
                        placeholder="e.g. Profitable Gas Station on Hwy 401" 
                        className="w-full p-3 border border-gray-300 rounded-lg"
                        onChange={(e) => handleInputChange('listing_title', e.target.value)}
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Asking Price ($)</label>
                      <input 
                        required type="number"
                        className="w-full p-3 border border-gray-300 rounded-lg"
                        onChange={(e) => handleInputChange('asking_price', e.target.value)}
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Gross Revenue ($)</label>
                      <input 
                        required type="number"
                        className="w-full p-3 border border-gray-300 rounded-lg"
                        onChange={(e) => handleInputChange('gross_revenue_annual', e.target.value)}
                      />
                    </div>
                    {/* Add NOI/Net Profit logic here or below */}
                  </div>
                </div>

                {/* C. DYNAMIC V17 ENGINE */}
                {categoryConfig && (
                  <div className={`p-6 rounded-xl border ${assetType === 'operational' ? 'bg-blue-50 border-blue-200' : 'bg-purple-50 border-purple-200'}`}>
                    <h3 className={`text-lg font-bold mb-4 flex items-center ${assetType === 'operational' ? 'text-blue-900' : 'text-purple-900'}`}>
                      2. {categoryConfig.name} Specifics
                    </h3>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      {/* REQUIRED MAX COLUMNS */}
                      {categoryConfig.max_columns_data.required.map((fieldKey) => (
                        <div key={fieldKey}>
                          <label className="block text-xs font-bold text-gray-600 uppercase mb-1">
                            {fieldKey.replace(/_/g, ' ')} <span className="text-red-500">*</span>
                          </label>
                          <input 
                            required
                            type="text"
                            className="w-full p-3 bg-white border border-gray-300 rounded-lg focus:ring-2 outline-none"
                            placeholder="..."
                            onChange={(e) => handleInputChange(fieldKey, e.target.value)}
                          />
                        </div>
                      ))}

                      {/* NICHE FIELDS */}
                      {categoryConfig.max_columns_data.niche_fields.map((field: { key: string; label: string; type?: string; tooltip?: string }) => (
                        <div key={field.key}>
                          <label className="block text-xs font-bold text-gray-600 uppercase mb-1">
                            {field.label}
                          </label>
                          {field.type === 'boolean' ? (
                            <select 
                              className="w-full p-3 bg-white border border-gray-300 rounded-lg"
                              onChange={(e) => handleInputChange(field.key, e.target.value === 'true')}
                            >
                              <option value="false">No</option>
                              <option value="true">Yes</option>
                            </select>
                          ) : (
                            <input 
                              type="text"
                              className="w-full p-3 bg-white border border-gray-300 rounded-lg"
                              placeholder={field.tooltip || "Optional"}
                              onChange={(e) => handleInputChange(field.key, e.target.value)}
                            />
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* ERROR MESSAGE */}
                {errorMsg && (
                  <div className="p-4 bg-red-50 text-red-700 rounded-lg flex items-center">
                    <AlertCircle className="w-5 h-5 mr-2" />
                    {errorMsg}
                  </div>
                )}

                {/* SUBMIT BUTTON */}
                <button 
                  type="submit" 
                  disabled={loading || !selectedCategory}
                  className={`w-full py-4 rounded-xl text-white font-bold text-lg shadow-lg transform transition hover:scale-[1.01] flex justify-center items-center ${
                    loading ? 'bg-gray-400 cursor-not-allowed' : 
                    assetType === 'operational' ? 'bg-blue-600 hover:bg-blue-700' : 'bg-purple-600 hover:bg-purple-700'
                  }`}
                >
                  {loading ? (
                    'Processing V17 Data...'
                  ) : (
                    <>Launch Listing <ArrowRight className="ml-2 w-5 h-5" /></>
                  )}
                </button>

              </div>
            </form>
          )}

        </div>
        
        {/* Footer Trust Signal */}
        <div className="mt-8 text-center flex justify-center items-center space-x-2 text-gray-400 text-sm">
           <CheckCircle className="w-4 h-4" /> <span>Secure SSL Encrypted • 2026 Ready Data Standard</span>
        </div>
      </div>
    </div>
  );
}
