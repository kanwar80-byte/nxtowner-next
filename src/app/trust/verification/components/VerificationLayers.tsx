"use client";

import { Database, Sparkles, Users, CheckCircle2, ArrowDown } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

export default function VerificationLayers() {
  const layers = [
    {
      id: 1,
      title: "Layer 1: Data Validation",
      icon: Database,
      description:
        "Every listing undergoes automated and manual data validation to ensure accuracy and completeness.",
      checks: [
        "Financial documents verified against source files (bank statements, tax returns, P&L)",
        "Business entity verification (registration, licenses, operating status)",
        "Asset documentation review (real estate, equipment, inventory)",
        "Operational data validation (employee count, locations, contracts)",
        "Cross-reference checks for consistency across all provided documents",
      ],
      color: "blue",
    },
    {
      id: 2,
      title: "Layer 2: AI Review",
      icon: Sparkles,
      description:
        "AI-powered analysis identifies anomalies, assesses risk, and provides comparative market insights.",
      checks: [
        "Automated anomaly detection in financial trends and patterns",
        "Risk scoring based on industry benchmarks and historical data",
        "Comparative analysis against similar businesses in the category",
        "Valuation range estimation using multiple methodologies",
        "Red flag identification (declining revenue, high customer concentration, etc.)",
      ],
      color: "purple",
    },
    {
      id: 3,
      title: "Layer 3: Human Oversight",
      icon: Users,
      description:
        "Our verification team reviews flagged items, validates AI insights, and ensures quality standards.",
      checks: [
        "Manual review of high-risk or flagged listings",
        "Verification of seller identity and business ownership",
        "Spot checks on financial data and supporting documentation",
        "Quality assurance on AI-generated insights and recommendations",
        "Final approval before listing publication",
      ],
      color: "green",
    },
  ];

  const getColorClasses = (color: string) => {
    switch (color) {
      case "blue":
        return {
          icon: "text-blue-400 bg-blue-500/10 border-blue-500/20",
          badge: "bg-blue-500/10 text-blue-600 border-blue-500/20",
          border: "border-blue-200",
        };
      case "purple":
        return {
          icon: "text-purple-400 bg-purple-500/10 border-purple-500/20",
          badge: "bg-purple-500/10 text-purple-600 border-purple-500/20",
          border: "border-purple-200",
        };
      case "green":
        return {
          icon: "text-green-400 bg-green-500/10 border-green-500/20",
          badge: "bg-green-500/10 text-green-600 border-green-500/20",
          border: "border-green-200",
        };
      default:
        return {
          icon: "text-slate-400 bg-slate-500/10 border-slate-500/20",
          badge: "bg-slate-500/10 text-slate-600 border-slate-500/20",
          border: "border-slate-200",
        };
    }
  };

  return (
    <section className="w-full py-16 md:py-20 px-4 sm:px-6 lg:px-8 bg-slate-50">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <h2 className="text-3xl sm:text-4xl font-bold text-slate-900 mb-4">
            Three-Layer Verification Process
          </h2>
          <p className="text-lg text-slate-600 max-w-3xl mx-auto">
            Every listing on NxtOwner goes through a comprehensive verification process designed to ensure accuracy, 
            reliability, and transparency.
          </p>
        </div>

        {/* Layers Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8">
          {layers.map((layer, index) => {
            const Icon = layer.icon;
            const colors = getColorClasses(layer.color);
            return (
              <div key={layer.id} className="relative">
                <Card className={`h-full border-2 ${colors.border} bg-white shadow-sm hover:shadow-md transition-shadow`}>
                  <CardHeader>
                    <div className="flex items-start justify-between gap-4 mb-4">
                      <div className={`p-3 rounded-lg border ${colors.icon}`}>
                        <Icon className="w-6 h-6" />
                      </div>
                      <Badge variant="outline" className={colors.badge}>
                        Layer {layer.id}
                      </Badge>
                    </div>
                    <CardTitle className="text-xl font-bold text-slate-900 mb-2">
                      {layer.title}
                    </CardTitle>
                    <p className="text-slate-600 leading-relaxed">{layer.description}</p>
                  </CardHeader>
                  <CardContent>
                    <ul className="space-y-3">
                      {layer.checks.map((check, checkIndex) => (
                        <li key={checkIndex} className="flex items-start gap-3">
                          <CheckCircle2 className={`w-5 h-5 shrink-0 mt-0.5 ${colors.icon.split(" ")[0]}`} />
                          <span className="text-sm text-slate-700 leading-relaxed">{check}</span>
                        </li>
                      ))}
                    </ul>
                  </CardContent>
                </Card>

                {/* Arrow between layers (desktop only) */}
                {index < layers.length - 1 && (
                  <div className="hidden lg:block absolute top-1/2 -right-4 -translate-y-1/2 z-10">
                    <div className="p-2 bg-white rounded-full border-2 border-slate-200 shadow-sm">
                      <ArrowDown className="w-5 h-5 text-slate-400" />
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Process Flow Note */}
        <div className="max-w-3xl mx-auto mt-12 p-6 bg-blue-50 border border-blue-200 rounded-lg">
          <p className="text-sm text-slate-700 leading-relaxed">
            <strong className="text-slate-900">Process Flow:</strong> Listings must pass all three layers before 
            publication. If any layer identifies issues, the listing is returned to the seller with specific feedback 
            for correction. This iterative process ensures only verified, high-quality listings appear on our marketplace.
          </p>
        </div>
      </div>
    </section>
  );
}
