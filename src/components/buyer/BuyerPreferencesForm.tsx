// src/components/buyer/BuyerPreferencesForm.tsx
"use client";

import { useState } from 'react';
import { saveBuyerPreferences } from '@/app/actions/saveBuyerPreferences';
import { BuyerPreferences } from '@/types/buyer';
import { Loader2, CheckCircle, Save } from 'lucide-react'; 

// NOTE: This is a static list for demonstration. In production, this would come from src/lib/categories.ts
const MAIN_CATEGORIES = ['Fuel & Auto', 'Food & Beverage', 'Digital Assets', 'Industrial & Logistics', 'Retail', 'Service Businesses'];


const DEFAULT_PREFERENCES: BuyerPreferences = {
    targetAssetType: 'all',
    targetMainCategories: [],
    targetLocations: ['Remote', 'Toronto, ON'], 
    minAskingPrice: 200000,
    maxAskingPrice: 5000000,
    minCashFlowSDE: 100000,
    aiWeight_growth: 0.5,
    aiWeight_stability: 0.5,
    aiWeight_synergy: 0.0,
    ownerInvolvement: 'any',
    hasFinancing: false,
    isProfileComplete: false,
};

export function BuyerPreferencesForm() {
    const [preferences, setPreferences] = useState<BuyerPreferences>(DEFAULT_PREFERENCES);
    const [loading, setLoading] = useState(false);
    const [status, setStatus] = useState<'idle' | 'success' | 'error'>('idle');

    // Simple handler for text/number inputs
    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value, type } = e.target;
        setPreferences(prev => ({
            ...prev,
            [name]: type === 'number' ? parseFloat(value) : value,
        }));
    };

    // Handler for checkbox/boolean
    const handleCheckboxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setPreferences(prev => ({
            ...prev,
            [e.target.name]: e.target.checked,
        }));
    };
    
    // Handler for multi-select categories
    const handleCategoryChange = (category: string) => {
        setPreferences(prev => ({
            ...prev,
            targetMainCategories: prev.targetMainCategories.includes(category)
                ? prev.targetMainCategories.filter(c => c !== category)
                : [...prev.targetMainCategories, category],
        }));
    };


    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setStatus('idle');
        
        // Mark profile complete when saving
        const finalPreferences = { ...preferences, isProfileComplete: true };

        try {
            const result = await saveBuyerPreferences(finalPreferences);
            if (result.success) {
                setStatus('success');
                // Update local state with final saved preferences
                setPreferences(finalPreferences); 
            } else {
                setStatus('error');
                console.error("Save failed:", result.message);
            }
        } catch (error) {
            setStatus('error');
            console.error("Submission error:", error);
        } finally {
            setLoading(false);
        }
    };
    
    return (
        <div className="bg-white shadow-xl rounded-2xl p-6 md:p-8 max-w-4xl mx-auto">
            <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center">
                <Save className="w-6 h-6 mr-3 text-blue-600" />
                Investment Preferences & AI Match Setup
            </h2>
            <p className="text-gray-600 mb-8 border-l-4 border-blue-500 pl-3">
                Define your criteria below. This information is used to calculate your **AI Match Score**, prioritizing the best deals for you.
            </p>

            <form onSubmit={handleSubmit} className="space-y-8">
                
                {/* --- 1. CORE FILTERS --- */}
                <div className="space-y-4">
                    <h3 className="text-lg font-semibold text-gray-800 border-b pb-2">1. Target Assets & Categories</h3>
                    
                    <div>
                        <label htmlFor="targetAssetType" className="block text-sm font-medium text-gray-700">Asset Type</label>
                        <select 
                            id="targetAssetType"
                            name="targetAssetType"
                            value={preferences.targetAssetType}
                            onChange={handleInputChange}
                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                        >
                            <option value="all">Any Asset Type</option>
                            <option value="physical">Physical/Operational Businesses</option>
                            <option value="digital">Digital Assets (SaaS, E-comm)</option>
                        </select>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Target Main Categories (Select All That Apply)</label>
                        <div className="flex flex-wrap gap-2">
                            {MAIN_CATEGORIES.map(category => (
                                <button
                                    key={category}
                                    type="button"
                                    onClick={() => handleCategoryChange(category)}
                                    className={`px-3 py-1.5 text-sm rounded-full transition duration-150 ${
                                        preferences.targetMainCategories.includes(category)
                                            ? 'bg-blue-600 text-white font-semibold'
                                            : 'bg-gray-100 text-gray-700 hover:bg-blue-100 border border-gray-300'
                                    }`}
                                >
                                    {category}
                                </button>
                            ))}
                        </div>
                    </div>
                </div>

                {/* --- 2. FINANCIAL CRITERIA --- */}
                <div className="space-y-4">
                    <h3 className="text-lg font-semibold text-gray-800 border-b pb-2">2. Financial Goals</h3>
                    
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label htmlFor="minAskingPrice" className="block text-sm font-medium text-gray-700">Min Asking Price ($)</label>
                            <input type="number" name="minAskingPrice" id="minAskingPrice" value={preferences.minAskingPrice || ''} onChange={handleInputChange} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm" placeholder="e.g., 250000" />
                        </div>
                        <div>
                            <label htmlFor="maxAskingPrice" className="block text-sm font-medium text-gray-700">Max Asking Price ($)</label>
                            <input type="number" name="maxAskingPrice" id="maxAskingPrice" value={preferences.maxAskingPrice || ''} onChange={handleInputChange} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm" placeholder="e.g., 5000000" />
                        </div>
                    </div>
                    
                    <div>
                        <label htmlFor="minCashFlowSDE" className="block text-sm font-medium text-gray-700">Minimum Cash Flow (SDE $)</label>
                        <input type="number" name="minCashFlowSDE" id="minCashFlowSDE" value={preferences.minCashFlowSDE || ''} onChange={handleInputChange} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm" placeholder="e.g., 100000" />
                    </div>
                </div>

                {/* --- 3. AI SCORING WEIGHTS (The differentiator) --- */}
                <div className="space-y-4">
                    <h3 className="text-lg font-semibold text-gray-800 border-b pb-2">3. Deal Focus (AI Weighting)</h3>
                    <p className="text-sm text-gray-500">Adjust these sliders to tell the AI what matters most, changing how your match score is calculated.</p>
                    
                    <div className="space-y-4">
                        <label className="block text-sm font-medium text-gray-700">Growth Potential (YoY %)</label>
                        <input type="range" name="aiWeight_growth" min="0" max="1" step="0.1" value={preferences.aiWeight_growth} onChange={handleInputChange} className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer range-lg" />
                        <p className="text-xs text-gray-500">Weight: **{preferences.aiWeight_growth}** (Higher weight favors high-growth assets like SaaS.)</p>
                    </div>

                    <div className="space-y-4">
                        <label className="block text-sm font-medium text-gray-700">Cash Flow Stability (Low Churn/Risk)</label>
                        <input type="range" name="aiWeight_stability" min="0" max="1" step="0.1" value={preferences.aiWeight_stability} onChange={handleInputChange} className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer range-lg" />
                        <p className="text-xs text-gray-500">Weight: **{preferences.aiWeight_stability}** (Higher weight favors reliable, low-risk businesses.)</p>
                    </div>
                </div>

                {/* --- SUBMIT & STATUS --- */}
                <div>
                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full flex justify-center items-center py-3 px-4 border border-transparent rounded-md shadow-sm text-base font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:bg-gray-400"
                    >
                        {loading ? (
                            <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                        ) : status === 'success' ? (
                            <CheckCircle className="mr-2 h-5 w-5" />
                        ) : (
                            <Save className="mr-2 h-5 w-5" />
                        )}
                        {loading ? 'Saving Preferences...' : status === 'success' ? 'Preferences Saved!' : 'Save My Preferences'}
                    </button>
                    {status === 'error' && (
                        <p className="mt-3 text-sm text-red-600 text-center">Failed to save preferences. Please try again.</p>
                    )}
                </div>
            </form>
        </div>
    );
}