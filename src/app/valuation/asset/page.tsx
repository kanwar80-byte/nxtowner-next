"use client";

import { AuthGate } from "@/components/auth/AuthGate";
import { useState } from "react";

export default function AssetValuationPage() {
  const [formData, setFormData] = useState({
    businessName: "",
    industry: "",
    annualRevenue: "",
    annualProfit: "",
    yearEstablished: "",
    employeeCount: "",
    assetValue: "",
    location: "",
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // TODO: Backend integration pending — DO NOT MODIFY EXISTING UI STRUCTURE.
    // - Port AssetValuationPage logic from AI Studio SPA
    // - Calculate valuation using industry multiples (Gemini AI)
    // - Generate valuation report
    // - Save to Supabase valuations table
    console.log("Asset valuation submitted:", formData);
  };

  return (
    <AuthGate>
      <div className="min-h-screen bg-brand-bg py-12">
        <div className="max-w-3xl mx-auto px-4">
          <div className="bg-brand-card border border-brand-border rounded-2xl shadow-sm p-8 space-y-6">
            <div className="space-y-2">
              <h1 className="text-3xl font-bold text-brand-text">
                Asset-Based Business Valuation
              </h1>
              <p className="text-brand-muted">
                Get an estimated valuation for your physical business based on revenue, profit, and industry standards.
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-5">
              <div>
                <label htmlFor="businessName" className="block text-sm font-medium text-brand-text mb-1">
                  Business Name
                </label>
                <input
                  type="text"
                  id="businessName"
                  value={formData.businessName}
                  onChange={(e) => setFormData({ ...formData, businessName: e.target.value })}
                  className="w-full px-4 py-2.5 border border-brand-border rounded-md focus:outline-none focus:ring-2 focus:ring-brand-navy"
                  required
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <div>
                  <label htmlFor="industry" className="block text-sm font-medium text-brand-text mb-1">
                    Industry
                  </label>
                  <select
                    id="industry"
                    value={formData.industry}
                    onChange={(e) => setFormData({ ...formData, industry: e.target.value })}
                    className="w-full px-4 py-2.5 border border-brand-border rounded-md focus:outline-none focus:ring-2 focus:ring-brand-navy"
                    required
                  >
                    <option value="">Select industry</option>
                    <option value="retail">Retail</option>
                    <option value="restaurant">Restaurant/Food Service</option>
                    <option value="manufacturing">Manufacturing</option>
                    <option value="services">Professional Services</option>
                    <option value="healthcare">Healthcare</option>
                    <option value="other">Other</option>
                  </select>
                </div>

                <div>
                  <label htmlFor="location" className="block text-sm font-medium text-brand-text mb-1">
                    Location
                  </label>
                  <input
                    type="text"
                    id="location"
                    value={formData.location}
                    onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                    placeholder="City, Province"
                    className="w-full px-4 py-2.5 border border-brand-border rounded-md focus:outline-none focus:ring-2 focus:ring-brand-navy"
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <div>
                  <label htmlFor="annualRevenue" className="block text-sm font-medium text-brand-text mb-1">
                    Annual Revenue (CAD)
                  </label>
                  <input
                    type="number"
                    id="annualRevenue"
                    value={formData.annualRevenue}
                    onChange={(e) => setFormData({ ...formData, annualRevenue: e.target.value })}
                    placeholder="500000"
                    className="w-full px-4 py-2.5 border border-brand-border rounded-md focus:outline-none focus:ring-2 focus:ring-brand-navy"
                    required
                  />
                </div>

                <div>
                  <label htmlFor="annualProfit" className="block text-sm font-medium text-brand-text mb-1">
                    Annual Net Profit (CAD)
                  </label>
                  <input
                    type="number"
                    id="annualProfit"
                    value={formData.annualProfit}
                    onChange={(e) => setFormData({ ...formData, annualProfit: e.target.value })}
                    placeholder="150000"
                    className="w-full px-4 py-2.5 border border-brand-border rounded-md focus:outline-none focus:ring-2 focus:ring-brand-navy"
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <div>
                  <label htmlFor="yearEstablished" className="block text-sm font-medium text-brand-text mb-1">
                    Year Established
                  </label>
                  <input
                    type="number"
                    id="yearEstablished"
                    value={formData.yearEstablished}
                    onChange={(e) => setFormData({ ...formData, yearEstablished: e.target.value })}
                    placeholder="2015"
                    className="w-full px-4 py-2.5 border border-brand-border rounded-md focus:outline-none focus:ring-2 focus:ring-brand-navy"
                    required
                  />
                </div>

                <div>
                  <label htmlFor="employeeCount" className="block text-sm font-medium text-brand-text mb-1">
                    Number of Employees
                  </label>
                  <input
                    type="number"
                    id="employeeCount"
                    value={formData.employeeCount}
                    onChange={(e) => setFormData({ ...formData, employeeCount: e.target.value })}
                    placeholder="5"
                    className="w-full px-4 py-2.5 border border-brand-border rounded-md focus:outline-none focus:ring-2 focus:ring-brand-navy"
                    required
                  />
                </div>
              </div>

              <div>
                <label htmlFor="assetValue" className="block text-sm font-medium text-brand-text mb-1">
                  Estimated Asset Value (CAD)
                </label>
                <input
                  type="number"
                  id="assetValue"
                  value={formData.assetValue}
                  onChange={(e) => setFormData({ ...formData, assetValue: e.target.value })}
                  placeholder="100000"
                  className="w-full px-4 py-2.5 border border-brand-border rounded-md focus:outline-none focus:ring-2 focus:ring-brand-navy"
                  required
                />
                <p className="text-xs text-brand-muted mt-1">
                  Include equipment, inventory, real estate, etc.
                </p>
              </div>

              <button
                type="submit"
                className="w-full px-6 py-3 bg-brand-navy text-white rounded-md font-semibold hover:bg-slate-900 transition"
              >
                Calculate Valuation
              </button>
            </form>

            <div className="pt-4 border-t border-brand-border">
              <p className="text-xs text-brand-muted">
                <strong>TODO:</strong> Port AssetValuationPage logic from AI Studio SPA – calculate using industry multiples, generate PDF report, save to Supabase.
              </p>
            </div>
          </div>
        </div>
      </div>
    </AuthGate>
  );
}
