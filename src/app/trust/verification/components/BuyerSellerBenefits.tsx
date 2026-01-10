"use client";

import { CheckCircle2, Target, Handshake } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function BuyerSellerBenefits() {
  const buyerBenefits = [
    "Access to verified listings with validated financial and operational data",
    "AI-powered insights and risk assessments to support decision-making",
    "Reduced risk of discovering major issues during due diligence",
    "Transparent verification badges indicating what has been validated",
    "Time savings from reviewing pre-verified, high-quality listings",
    "Comparative market analysis and valuation insights",
  ];

  const sellerBenefits = [
    "Credibility boost from verified status increases buyer confidence",
    "Faster time to qualified leads—buyers trust verified listings more",
    "Reduced buyer hesitation and deal abandonment during diligence",
    "Clear understanding of what information buyers need to see",
    "Professional presentation that stands out in the marketplace",
    "Support from verification process helps identify and fix issues early",
  ];

  return (
    <section className="w-full py-16 md:py-20 px-4 sm:px-6 lg:px-8 bg-slate-50">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <h2 className="text-3xl sm:text-4xl font-bold text-slate-900 mb-4">
            Benefits for Buyers and Sellers
          </h2>
          <p className="text-lg text-slate-600 max-w-3xl mx-auto">
            Our verification framework creates value for both sides of the transaction by building trust, 
            reducing risk, and accelerating deal flow.
          </p>
        </div>

        {/* Benefits Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
          {/* Buyer Benefits */}
          <Card className="border border-slate-200 bg-white shadow-sm">
            <CardHeader>
              <div className="flex items-center gap-3 mb-4">
                <div className="p-3 rounded-lg bg-blue-100 border border-blue-200">
                  <Target className="w-6 h-6 text-blue-600" />
                </div>
                <CardTitle className="text-2xl font-bold text-slate-900">
                  Benefits for Buyers
                </CardTitle>
              </div>
              <p className="text-slate-600 leading-relaxed">
                Verified listings reduce uncertainty and help buyers make informed decisions faster.
              </p>
            </CardHeader>
            <CardContent>
              <ul className="space-y-3">
                {buyerBenefits.map((benefit, index) => (
                  <li key={index} className="flex items-start gap-3">
                    <CheckCircle2 className="w-5 h-5 text-green-500 shrink-0 mt-0.5" />
                    <span className="text-sm text-slate-700 leading-relaxed">{benefit}</span>
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>

          {/* Seller Benefits */}
          <Card className="border border-slate-200 bg-white shadow-sm">
            <CardHeader>
              <div className="flex items-center gap-3 mb-4">
                <div className="p-3 rounded-lg bg-green-100 border border-green-200">
                  <Handshake className="w-6 h-6 text-green-600" />
                </div>
                <CardTitle className="text-2xl font-bold text-slate-900">
                  Benefits for Sellers
                </CardTitle>
              </div>
              <p className="text-slate-600 leading-relaxed">
                Verification status builds credibility and helps sellers attract serious, qualified buyers.
              </p>
            </CardHeader>
            <CardContent>
              <ul className="space-y-3">
                {sellerBenefits.map((benefit, index) => (
                  <li key={index} className="flex items-start gap-3">
                    <CheckCircle2 className="w-5 h-5 text-green-500 shrink-0 mt-0.5" />
                    <span className="text-sm text-slate-700 leading-relaxed">{benefit}</span>
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>
        </div>

        {/* Call to Action */}
        <div className="max-w-3xl mx-auto text-center space-y-6">
          <div className="p-8 bg-white border border-slate-200 rounded-lg shadow-sm">
            <h3 className="text-xl font-bold text-slate-900 mb-4">
              Ready to Experience Verified Listings?
            </h3>
            <p className="text-slate-600 mb-6 leading-relaxed">
              Browse verified listings or get your listing verified to build trust with potential buyers.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
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
                  className="border-slate-300 text-slate-700 hover:bg-slate-50 px-8 py-6 text-base font-semibold"
                >
                  Get Your Listing Verified
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
