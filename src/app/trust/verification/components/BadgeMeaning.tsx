"use client";

import { BadgeCheck, Sparkles, Database, Users, Info } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

export default function BadgeMeaning() {
  const badges = [
    {
      id: "listed",
      label: "Listed",
      icon: BadgeCheck,
      description:
        "The listing has been submitted and is live on the marketplace. This is the baseline status for all published listings.",
      meaning:
        "The seller has created a listing profile. Basic information has been provided, but verification may be in progress or incomplete.",
      color: "slate",
    },
    {
      id: "ai_reviewed",
      label: "AI Reviewed",
      icon: Sparkles,
      description:
        "The listing has been analyzed by our AI system for anomalies, risk factors, and market comparables.",
      meaning:
        "AI has reviewed the financial data, identified patterns, assessed risks, and provided comparative insights. No significant red flags were detected by automated analysis.",
      color: "purple",
    },
    {
      id: "data_verified",
      label: "Data Verified",
      icon: Database,
      description:
        "Financial and operational data has been cross-referenced against source documents and validated for accuracy.",
      meaning:
        "Key financial metrics (revenue, profit, cash flow) and operational data (employee count, locations, etc.) have been verified against bank statements, tax returns, or other source documents provided by the seller.",
      color: "blue",
    },
    {
      id: "partner_verified",
      label: "Partner Verified",
      icon: Users,
      description:
        "An independent professional partner (broker, accountant, lawyer) has reviewed and verified the listing information.",
      meaning:
        "A verified partner on the NxtOwner platform has independently reviewed the listing, validated the seller's claims, and confirmed the business information. This represents the highest level of verification.",
      color: "green",
    },
  ];

  const getColorClasses = (color: string) => {
    switch (color) {
      case "slate":
        return {
          icon: "text-slate-400 bg-slate-500/10 border-slate-500/20",
          badge: "bg-slate-100 text-slate-700 border-slate-300",
          accent: "text-slate-600",
        };
      case "purple":
        return {
          icon: "text-purple-400 bg-purple-500/10 border-purple-500/20",
          badge: "bg-purple-100 text-purple-700 border-purple-300",
          accent: "text-purple-600",
        };
      case "blue":
        return {
          icon: "text-blue-400 bg-blue-500/10 border-blue-500/20",
          badge: "bg-blue-100 text-blue-700 border-blue-300",
          accent: "text-blue-600",
        };
      case "green":
        return {
          icon: "text-green-400 bg-green-500/10 border-green-500/20",
          badge: "bg-green-100 text-green-700 border-green-300",
          accent: "text-green-600",
        };
      default:
        return {
          icon: "text-slate-400 bg-slate-500/10 border-slate-500/20",
          badge: "bg-slate-100 text-slate-700 border-slate-300",
          accent: "text-slate-600",
        };
    }
  };

  return (
    <section className="w-full py-16 md:py-20 px-4 sm:px-6 lg:px-8 bg-white">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <h2 className="text-3xl sm:text-4xl font-bold text-slate-900 mb-4">
            Understanding Badge Meanings
          </h2>
          <p className="text-lg text-slate-600 max-w-3xl mx-auto">
            Every listing displays verification badges that indicate the level of validation completed. 
            These badges help buyers understand what has been verified and what additional due diligence may be needed.
          </p>
        </div>

        {/* Badges Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
          {badges.map((badge) => {
            const Icon = badge.icon;
            const colors = getColorClasses(badge.color);
            return (
              <Card
                key={badge.id}
                className="border border-slate-200 bg-white shadow-sm hover:shadow-md transition-shadow"
              >
                <CardHeader>
                  <div className="flex items-center gap-4 mb-4">
                    <div className={`p-3 rounded-lg border ${colors.icon}`}>
                      <Icon className="w-6 h-6" />
                    </div>
                    <div className="flex-1">
                      <Badge variant="outline" className={colors.badge}>
                        {badge.label}
                      </Badge>
                    </div>
                  </div>
                  <CardTitle className="text-xl font-bold text-slate-900 mb-2">
                    {badge.label}
                  </CardTitle>
                  <p className="text-slate-600 leading-relaxed">{badge.description}</p>
                </CardHeader>
                <CardContent>
                  <div className="p-4 bg-slate-50 rounded-lg border border-slate-200">
                    <div className="flex items-start gap-2 mb-2">
                      <Info className={`w-4 h-4 shrink-0 mt-0.5 ${colors.accent}`} />
                      <p className="text-sm font-semibold text-slate-900">What This Means:</p>
                    </div>
                    <p className="text-sm text-slate-700 leading-relaxed pl-6">{badge.meaning}</p>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>

        {/* Badge Hierarchy Note */}
        <div className="max-w-3xl mx-auto p-6 bg-amber-50 border border-amber-200 rounded-lg">
          <div className="flex items-start gap-3">
            <Info className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
            <div>
              <p className="text-sm font-semibold text-amber-900 mb-2">Badge Hierarchy</p>
              <p className="text-sm text-slate-700 leading-relaxed">
                Badges are cumulative—a listing with "Partner Verified" has also passed AI Review and Data Verification. 
                Listings may display multiple badges, with higher verification levels indicating more comprehensive validation. 
                However, <strong>all badges represent verification of provided information only</strong> and do not guarantee 
                future business performance or eliminate the need for buyer due diligence.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
