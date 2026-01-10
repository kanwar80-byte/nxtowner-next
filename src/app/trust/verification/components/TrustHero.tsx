"use client";

import { ShieldCheck, AlertTriangle } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function TrustHero() {
  return (
    <section className="w-full bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 text-white py-20 px-4 sm:py-28">
      <div className="max-w-7xl mx-auto">
        <div className="max-w-4xl mx-auto text-center space-y-8">
          {/* Icon */}
          <div className="flex justify-center">
            <div className="p-4 rounded-full bg-blue-500/20 border border-blue-500/30">
              <ShieldCheck className="w-12 h-12 text-blue-400" />
            </div>
          </div>

          {/* Title */}
          <h1 className="text-4xl sm:text-5xl md:text-6xl font-extrabold leading-tight">
            Trust & Verification Framework
          </h1>

          {/* Subtitle */}
          <p className="text-lg sm:text-xl text-slate-300 max-w-3xl mx-auto leading-relaxed">
            Transparent verification processes that build confidence and reduce risk in every transaction.
          </p>

          {/* Problem Statement */}
          <div className="mt-12 p-6 bg-amber-500/10 border border-amber-500/20 rounded-lg text-left max-w-3xl mx-auto">
            <div className="flex items-start gap-3">
              <AlertTriangle className="w-6 h-6 text-amber-400 shrink-0 mt-0.5" />
              <div className="space-y-3">
                <h2 className="text-lg font-semibold text-amber-400">The Problem We Solve</h2>
                <p className="text-slate-300 leading-relaxed">
                  Traditional marketplaces rely on <strong>self-reported listings</strong> with little to no verification. 
                  This leads to misrepresented businesses, incomplete financial data, and <strong>deals falling apart</strong> during 
                  due diligence—wasting time, money, and trust for both buyers and sellers.
                </p>
                <p className="text-slate-300 leading-relaxed">
                  NxtOwner addresses this with a <strong>three-layer verification framework</strong> that validates data, 
                  applies AI analysis, and incorporates human oversight to ensure listings meet our standards before they go live.
                </p>
              </div>
            </div>
          </div>

          {/* CTAs */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center pt-8">
            <Link href="/browse">
              <Button
                size="lg"
                className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-6 text-base font-semibold"
              >
                Browse Verified Listings
              </Button>
            </Link>
            <Link href="/sell">
              <Button
                variant="outline"
                size="lg"
                className="border-white/20 text-white hover:bg-white/10 px-8 py-6 text-base font-semibold"
              >
                Get Your Listing Verified
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
