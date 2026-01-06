"use client";

import { useTrack } from "@/contexts/TrackContext";
import { Lock, FileCheck, CheckCircle2, ShieldCheck } from "lucide-react";
import Link from "next/link";

export default function TrustSection() {
  const { track } = useTrack();
  const isOperational = track === 'operational';

  return (
    <section className="py-24 bg-slate-900 border-t border-slate-800">
      <div className="container mx-auto px-4">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center gap-16">
          
          {/* LEFT: Copy */}
          <div className="flex-1">
            <div className={`inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-bold border mb-6 ${
              isOperational ? 'bg-amber-500/10 text-amber-500 border-amber-500/20' : 'bg-teal-500/10 text-teal-500 border-teal-500/20'
            }`}>
              <Lock className="w-3 h-3" /> TRUST THROUGH VERIFICATION
            </div>
            <h2 className="text-3xl md:text-5xl font-bold text-white mb-6 leading-tight">
              We verify the data. <br />
              <span className={isOperational ? "text-amber-500" : "text-teal-500"}>
                You verify the deal.
              </span>
            </h2>
            <p className="text-slate-400 text-lg mb-8">
              {isOperational
                ? "Stop chasing dead ends. We connect directly with tax authorities and bank APIs to verify revenue before a listing ever goes live."
                : "Stop relying on screenshots. We connect directly with Stripe, Shopify, and Analytics APIs to verify MRR and traffic in real-time."}
            </p>

            {/* INTEGRATION LOGO ROW (Visual Trust) */}
            <div className="space-y-4">
              <p className="text-xs font-bold text-slate-500 uppercase tracking-widest">
                Data Verified Via
              </p>
              <div className="flex flex-wrap gap-4">
                {isOperational ? (
                  <>
                    <Badge text="CRA / IRS Tax Data" color="amber" />
                    <Badge text="QuickBooks Online" color="amber" />
                    <Badge text="Lease Documents" color="amber" />
                    <Badge text="Bank Statements" color="amber" />
                  </>
                ) : (
                  <>
                    <Badge text="Stripe API" color="teal" />
                    <Badge text="Shopify Partners" color="teal" />
                    <Badge text="Google Analytics 4" color="teal" />
                    <Badge text="App Store Connect" color="teal" />
                  </>
                )}
              </div>
            </div>
          </div>

          {/* RIGHT: Visual Card */}
          <div className="flex-1 w-full max-w-md">
            <div className="bg-slate-950 border border-slate-800 rounded-2xl p-8 shadow-2xl relative overflow-hidden">
              <div className={`absolute top-0 left-0 right-0 h-1 ${isOperational ? 'bg-amber-500' : 'bg-teal-500'}`} />
              
              <div className="flex items-center justify-between mb-8">
                <h3 className="font-bold text-white flex items-center gap-2">
                  {/* NEW: BRANDED REPORT TITLE */}
                  <ShieldCheck className={`w-4 h-4 ${isOperational ? 'text-amber-500' : 'text-teal-500'}`} />
                  NxtVerify™ Report
                </h3>
                <span className="text-xs text-slate-500">Live Data</span>
              </div>

              <div className="space-y-4">
                <VerificationItem 
                  label={isOperational ? "Tax Returns (T2)" : "Stripe Revenue"} 
                  status="Verified Match" 
                  isOp={isOperational} 
                />
                <VerificationItem 
                  label={isOperational ? "Lease Agreement" : "Traffic Source"} 
                  status="Verified Active" 
                  isOp={isOperational} 
                />
                <VerificationItem 
                  label={isOperational ? "Incorporation Docs" : "Domain Ownership"} 
                  status="Verified Clear" 
                  isOp={isOperational} 
                />
              </div>

              <div className="mt-8 pt-6 border-t border-slate-900 text-center">
                <p className="text-xs text-slate-500 mb-2">Confidence Score</p>
                <p className={`text-3xl font-black ${isOperational ? 'text-amber-500' : 'text-teal-500'}`}>
                  98/100
                </p>
              </div>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}

// Sub-components for cleanliness
function Badge({ text, color }: { text: string, color: 'amber' | 'teal' }) {
  const styles = color === 'amber' 
    ? "bg-amber-950/30 text-amber-200 border-amber-500/20" 
    : "bg-teal-950/30 text-teal-200 border-teal-500/20";
  return (
    <span className={`px-4 py-2 rounded-lg text-sm font-semibold border ${styles}`}>
      {text}
    </span>
  );
}

function VerificationItem({ label, status, isOp }: { label: string, status: string, isOp: boolean }) {
  return (
    <div className="flex items-center justify-between p-3 rounded-lg bg-slate-900/50 border border-slate-800">
      <span className="text-slate-300 text-sm">{label}</span>
      <span className={`flex items-center gap-1.5 text-xs font-bold ${isOp ? 'text-amber-500' : 'text-teal-500'}`}>
        <CheckCircle2 className="w-3.5 h-3.5" /> {status}
      </span>
    </div>
  );
}

