"use client";

"use client";

import { signNDA } from "@/app/actions/deal-actions"; // <--- IMPORT REAL ACTION
import { Lock, ShieldCheck, X } from "lucide-react";
import { UIEvent, useRef, useState } from "react";

type Props = {
  isOpen: boolean;
  onClose: () => void;
  onSigned: () => void;
  dealId: string;
};

export default function NDAModal({ isOpen, onClose, onSigned, dealId }: Props) {
  const [hasScrolled, setHasScrolled] = useState(false);
  const [isChecked, setIsChecked] = useState(false);
  const [isSigning, setIsSigning] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  if (!isOpen) return null;

  const handleScroll = (e: UIEvent<HTMLDivElement>) => {
    const { scrollTop, scrollHeight, clientHeight } = e.currentTarget;
    // Allow a small buffer (5px) for scroll detection
    if (scrollHeight - scrollTop <= clientHeight + 5) {
      setHasScrolled(true);
    }
  };

  const handleSign = async () => {
    setIsSigning(true);
    
    try {
      // 1. CALL THE REAL SERVER ACTION
      await signNDA(dealId);
      
      // 2. Success! Notify parent to refresh UI
      onSigned(); 
      onClose();
    } catch (error) {
      console.error("Failed to sign NDA:", error);
      alert("Something went wrong. Please try again.");
    } finally {
      setIsSigning(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
      <div className="w-full max-w-2xl bg-white rounded-xl shadow-2xl overflow-hidden border border-gray-100 flex flex-col max-h-[90vh]">
        
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100 bg-gray-50/50">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-blue-100 rounded-lg text-blue-600">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-semibold text-gray-900">Non-Disclosure Agreement</h3>
              <p className="text-xs text-gray-500">Sign to unlock private deal data</p>
            </div>
          </div>
          <button onClick={onClose} className="p-1 rounded-full hover:bg-gray-200 text-gray-500">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Scrollable Legal Text */}
        <div 
          ref={scrollRef}
          onScroll={handleScroll}
          className="flex-1 overflow-y-auto p-6 bg-gray-50 text-sm text-gray-600 space-y-4 border-b border-gray-200"
        >
          <div className="prose prose-sm max-w-none">
            <p className="font-bold text-gray-900 uppercase">Mutual Non-Disclosure Agreement</p>
            <p>This Agreement allows you to access confidential information about the business listing #{dealId}.</p>
            
            <h4 className="font-bold text-gray-800 mt-4">1. Confidentiality</h4>
            <p>You agree to keep all financial data, customer lists, and operational details strictly confidential. You will not share this information with third parties without express written consent.</p>

            <h4 className="font-bold text-gray-800 mt-4">2. Non-Circumvention</h4>
            <p>You agree not to contact the business owner, employees, landlords, or suppliers directly. All communications must go through the NxtOwner platform.</p>

            <h4 className="font-bold text-gray-800 mt-4">3. Data Destruction</h4>
            <p>If you decide not to pursue this acquisition, you agree to delete or destroy all confidential materials obtained from the Deal Room.</p>

            <h4 className="font-bold text-gray-800 mt-4">4. Term</h4>
            <p>This agreement is effective for 24 months from the date of digital signature.</p>

            <div className="h-32 flex items-center justify-center text-gray-400 italic">
              -- Scroll to bottom to sign --
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="p-6 bg-white space-y-4">
          <label className={`flex items-start gap-3 p-4 rounded-lg border cursor-pointer transition-all ${isChecked ? 'border-blue-500 bg-blue-50' : 'border-gray-200 hover:bg-gray-50'}`}>
            <input 
              type="checkbox" 
              className="mt-1 w-4 h-4 text-blue-600 rounded border-gray-300 focus:ring-blue-500"
              checked={isChecked}
              onChange={(e) => setIsChecked(e.target.checked)}
              disabled={!hasScrolled} 
            />
            <div className="text-sm">
              <span className={`font-medium ${hasScrolled ? 'text-gray-900' : 'text-gray-400'}`}>
                I have read and agree to the terms above
              </span>
              {!hasScrolled && <p className="text-red-500 text-xs mt-1">* Please scroll to the bottom to enable</p>}
            </div>
          </label>

          <div className="flex justify-end gap-3">
            <button
              onClick={onClose}
              className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50"
            >
              Cancel
            </button>
            <button
              onClick={handleSign}
              disabled={!isChecked || isSigning}
              className="px-6 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
            >
              {isSigning ? "Signing..." : (
                <>
                  <Lock className="w-4 h-4" />
                  Sign & Unlock Vault
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
