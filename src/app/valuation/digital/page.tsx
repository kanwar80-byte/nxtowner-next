"use client";

import { AuthGate } from "@/components/auth/AuthGate";
import { useState } from "react";

export default function DigitalValuationPage() {
  const [formData, setFormData] = useState({
    businessName: "",
    businessType: "",
    monthlyRevenue: "",
    monthlyProfit: "",
    yearEstablished: "",
    trafficSources: "",
    activeUsers: "",
    platformTech: "",
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // TODO: Backend integration pending — DO NOT MODIFY EXISTING UI STRUCTURE.
    // - Port DigitalValuationPage logic from AI Studio SPA
    // - Calculate valuation using SaaS/digital multiples (Gemini AI)
    // - Generate valuation report
    // - Save to Supabase valuations table
    console.log("Digital valuation submitted:", formData);
  };

  return (
    <AuthGate>
      <div className="min-h-screen bg-brand-bg py-12">
        <div className="max-w-3xl mx-auto px-4">
          <div className="bg-brand-card border border-brand-border rounded-2xl shadow-sm p-8 space-y-6">
            <div className="space-y-2">
              <h1 className="text-3xl font-bold text-brand-text">
                Digital Business Valuation
              </h1>
              <p className="text-brand-muted">
                Get an estimated valuation for your SaaS, e-commerce, or digital business based on MRR, growth, and retention.
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
                  <label htmlFor="businessType" className="block text-sm font-medium text-brand-text mb-1">
                    Business Type
                  </label>
                  <select
                    id="businessType"
                    value={formData.businessType}
                    onChange={(e) => setFormData({ ...formData, businessType: e.target.value })}
                    className="w-full px-4 py-2.5 border border-brand-border rounded-md focus:outline-none focus:ring-2 focus:ring-brand-navy"
                    required
                  >
                    <option value="">Select type</option>
                    <option value="saas">SaaS</option>
                    <option value="ecommerce">E-commerce</option>
                    <option value="marketplace">Marketplace</option>
                    <option value="content">Content/Media</option>
                    <option value="app">Mobile App</option>
                    <option value="other">Other</option>
                  </select>
                </div>

                <div>
                  <label htmlFor="yearEstablished" className="block text-sm font-medium text-brand-text mb-1">
                    Year Established
                  </label>
                  <input
                    type="number"
                    id="yearEstablished"
                    value={formData.yearEstablished}
                    onChange={(e) => setFormData({ ...formData, yearEstablished: e.target.value })}
                    placeholder="2020"
                    className="w-full px-4 py-2.5 border border-brand-border rounded-md focus:outline-none focus:ring-2 focus:ring-brand-navy"
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <div>
                  <label htmlFor="monthlyRevenue" className="block text-sm font-medium text-brand-text mb-1">
                    Monthly Recurring Revenue (CAD)
                  </label>
                  <input
                    type="number"
                    id="monthlyRevenue"
                    value={formData.monthlyRevenue}
                    onChange={(e) => setFormData({ ...formData, monthlyRevenue: e.target.value })}
                    placeholder="25000"
                    className="w-full px-4 py-2.5 border border-brand-border rounded-md focus:outline-none focus:ring-2 focus:ring-brand-navy"
                    required
                  />
                </div>

                <div>
                  <label htmlFor="monthlyProfit" className="block text-sm font-medium text-brand-text mb-1">
                    Monthly Net Profit (CAD)
                  </label>
                  <input
                    type="number"
                    id="monthlyProfit"
                    value={formData.monthlyProfit}
                    onChange={(e) => setFormData({ ...formData, monthlyProfit: e.target.value })}
                    placeholder="15000"
                    className="w-full px-4 py-2.5 border border-brand-border rounded-md focus:outline-none focus:ring-2 focus:ring-brand-navy"
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <div>
                  <label htmlFor="activeUsers" className="block text-sm font-medium text-brand-text mb-1">
                    Active Users/Customers
                  </label>
                  <input
                    type="number"
                    id="activeUsers"
                    value={formData.activeUsers}
                    onChange={(e) => setFormData({ ...formData, activeUsers: e.target.value })}
                    placeholder="500"
                    className="w-full px-4 py-2.5 border border-brand-border rounded-md focus:outline-none focus:ring-2 focus:ring-brand-navy"
                    required
                  />
                </div>

                <div>
                  <label htmlFor="platformTech" className="block text-sm font-medium text-brand-text mb-1">
                    Platform/Technology
                  </label>
                  <input
                    type="text"
                    id="platformTech"
                    value={formData.platformTech}
                    onChange={(e) => setFormData({ ...formData, platformTech: e.target.value })}
                    placeholder="e.g., Shopify, React, WordPress"
                    className="w-full px-4 py-2.5 border border-brand-border rounded-md focus:outline-none focus:ring-2 focus:ring-brand-navy"
                    required
                  />
                </div>
              </div>

              <div>
                <label htmlFor="trafficSources" className="block text-sm font-medium text-brand-text mb-1">
                  Primary Traffic Sources
                </label>
                <input
                  type="text"
                  id="trafficSources"
                  value={formData.trafficSources}
                  onChange={(e) => setFormData({ ...formData, trafficSources: e.target.value })}
                  placeholder="e.g., Organic search, Paid ads, Referrals"
                  className="w-full px-4 py-2.5 border border-brand-border rounded-md focus:outline-none focus:ring-2 focus:ring-brand-navy"
                  required
                />
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
                <strong>TODO:</strong> Port DigitalValuationPage logic from AI Studio SPA – calculate using SaaS multiples, generate PDF report, save to Supabase.
              </p>
            </div>
          </div>
        </div>
      </div>
    </AuthGate>
  );
}
