"use client";

import { useState } from "react";
import { X, CheckCircle, Lock, ArrowRight } from "lucide-react";
import { createClient } from "@/utils/supabase/client";

interface UnlockModalProps {
  isOpen: boolean;
  onClose: () => void;
  dealTitle: string;
  dealId: string;
}

export function UnlockModal({ isOpen, onClose, dealTitle, dealId }: UnlockModalProps) {
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const supabase = createClient();
  const sb: any = supabase;

  if (!isOpen) return null;

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    
    const formData = new FormData(e.currentTarget);
    
    // 1. PREPARE THE DATA PACKET
    const leadData = {
      full_name: formData.get("full_name") as string,
      email: formData.get("email") as string,
      phone: formData.get("phone") as string,
      deal_id: dealId,
      deal_title: dealTitle,
      status: "new",
      buyer_type: "individual" // Default for now
    };

    // 2. SEND TO SUPABASE (REAL INSERT)
    const { error } = await sb
      .from('leads')
      .insert([leadData]);

    if (error) {
      console.error("Error submitting lead:", error);
      alert("Something went wrong. Please try again."); // Simple error handling
      setLoading(false);
      return;
    }

    // 3. SUCCESS
    console.log("Lead Saved Successfully!");
    setStep(2); // Show the Green Checkmark
    setLoading(false);
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm">
      <div className="relative w-full max-w-md bg-white rounded-2xl shadow-2xl overflow-hidden animate-in fade-in zoom-in duration-300">
        
        {/* CLOSE BUTTON */}
        <button onClick={onClose} className="absolute top-4 right-4 text-slate-400 hover:text-slate-600 transition-colors z-10">
          <X className="w-5 h-5" />
        </button>

        {/* STEP 1: CAPTURE FORM */}
        {step === 1 && (
          <div className="p-8">
            <div className="flex justify-center mb-6">
              <div className="bg-blue-100 p-3 rounded-full">
                <Lock className="w-8 h-8 text-blue-600" />
              </div>
            </div>
            
            <h2 className="text-2xl font-bold text-center text-slate-900 mb-2">Unlock Financials</h2>
            <p className="text-center text-slate-500 mb-8 text-sm">
              Enter your details to access the full P&L and tax returns for <br/>
              <span className="font-semibold text-slate-800">{dealTitle}</span>.
            </p>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Full Name</label>
                <input required name="full_name" type="text" placeholder="John Doe" className="w-full p-3 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none transition-all" />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Work Email</label>
                <input required name="email" type="email" placeholder="john@company.com" className="w-full p-3 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none transition-all" />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Phone (Optional)</label>
                <input name="phone" type="tel" placeholder="+1 (555) 000-0000" className="w-full p-3 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none transition-all" />
              </div>
              
              <div className="pt-2">
                <button 
                  type="submit" 
                  disabled={loading}
                  className="w-full py-4 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl shadow-lg transform transition active:scale-[0.98] flex justify-center items-center"
                >
                  {loading ? "Verifying..." : "Access Data Room"}
                  {!loading && <ArrowRight className="ml-2 w-4 h-4" />}
                </button>
                <p className="text-center text-xs text-slate-400 mt-4">
                  By clicking, you agree to our NDA & Terms of Service.
                </p>
              </div>
            </form>
          </div>
        )}

        {/* STEP 2: SUCCESS SCREEN */}
        {step === 2 && (
          <div className="p-12 text-center bg-slate-50">
            <div className="flex justify-center mb-6">
              <div className="bg-green-100 p-4 rounded-full">
                <CheckCircle className="w-12 h-12 text-green-600" />
              </div>
            </div>
            <h3 className="text-2xl font-bold text-slate-900 mb-2">Request Sent!</h3>
            <p className="text-slate-600 mb-8">
              The seller has been notified. Check your email <strong>(including spam)</strong> for the Data Room access link.
            </p>
            <button onClick={onClose} className="w-full py-3 bg-white border border-slate-300 hover:bg-slate-50 text-slate-700 font-bold rounded-xl transition-colors">
              Close Window
            </button>
          </div>
        )}

      </div>
    </div>
  );
}

