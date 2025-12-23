"use client";

import { Download, Lock, Unlock } from "lucide-react";

// INTERFACE DEFINITION
interface DealProps {
  nda_signed: boolean;
  listing?: {
    title: string;
    location_city: string;
    location_province: string;
    price: number;
  };
}

// NOTE THE 'export default' HERE - THIS FIXES YOUR BUILD ERROR
export default function SecureVault({ deal }: { deal: DealProps }) {
  const isUnlocked = deal.nda_signed;

  // --- 1. LOCKED STATE (Gray Box) ---
  if (!isUnlocked) {
    return (
      <div className="bg-gray-50 border border-gray-200 rounded-xl p-10 text-center space-y-4 shadow-inner">
        <div className="w-16 h-16 bg-gray-200 rounded-full flex items-center justify-center mx-auto text-gray-400">
          <Lock className="w-8 h-8" />
        </div>
        <div>
          <h3 className="text-lg font-semibold text-gray-900">Secure Vault Locked</h3>
          <p className="text-gray-500 max-w-md mx-auto mt-2 text-sm">
            Private details including address, financials, and P&L documents are restricted.
            <br />
            <span className="font-medium text-gray-700">Sign the NDA below to unlock immediately.</span>
          </p>
        </div>
      </div>
    );
  }

  // --- 2. UNLOCKED STATE (Green Box) ---
  return (
    <div className="bg-green-50/50 border border-green-200 rounded-xl p-6 shadow-sm relative overflow-hidden">
      {/* Background Decoration */}
      <div className="absolute top-0 right-0 p-4 opacity-10 pointer-events-none">
        <Unlock className="w-32 h-32 text-green-600" />
      </div>

      <div className="relative z-10 space-y-6">
        <div className="flex items-center gap-2 text-green-800 mb-2">
          <Unlock className="w-5 h-5" />
          <h3 className="font-bold text-lg">Secure Vault Unlocked</h3>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Column 1: Private Info */}
          <div className="space-y-4">
            <div>
              <p className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-1">Private Address</p>
              <p className="text-gray-900 font-medium bg-white/60 p-2 rounded border border-green-100 inline-block text-sm">
                1234 Main Highway, Shelburne, NS B0T 1W0
              </p>
            </div>
            
            <div className="space-y-1">
              <p className="text-xs font-bold text-gray-500 uppercase tracking-wider">Financials</p>
              <div className="flex items-center gap-6">
                <div>
                  <span className="text-gray-500 text-sm">Revenue: </span>
                  <span className="text-gray-900 font-bold">$4,500,000</span>
                </div>
                <div>
                  <span className="text-gray-500 text-sm">EBITDA: </span>
                  <span className="text-gray-900 font-bold">$320,000</span>
                </div>
              </div>
            </div>
          </div>

          {/* Column 2: Downloads */}
          <div className="flex items-end md:justify-end">
            <button className="flex items-center gap-2 bg-green-600 hover:bg-green-700 text-white px-5 py-3 rounded-lg font-medium transition-colors shadow-sm text-sm">
              <Download className="w-4 h-4" />
              Download P&L
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}