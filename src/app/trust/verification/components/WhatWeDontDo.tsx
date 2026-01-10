"use client";

import { XCircle, AlertTriangle, FileText, DollarSign, ShieldAlert } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function WhatWeDontDo() {
  const disclaimers = [
    {
      icon: ShieldAlert,
      title: "No Guarantees",
      description:
        "NxtOwner does not guarantee the accuracy of all information provided by sellers, nor does it guarantee business performance or future results. Verification confirms that information matches source documents, but buyers must conduct their own independent due diligence.",
    },
    {
      icon: FileText,
      title: "Not Legal Advice",
      description:
        "NxtOwner is not a law firm and does not provide legal advice. We facilitate connections and provide tools, but all parties should consult qualified legal counsel for contract review, entity structuring, regulatory compliance, and other legal matters related to business transactions.",
    },
    {
      icon: DollarSign,
      title: "Not Financial Advice",
      description:
        "NxtOwner is not a registered investment advisor, broker-dealer, or financial planner. AI-generated valuations, risk scores, and market insights are informational tools only and should not be used as the sole basis for investment decisions. Consult qualified financial advisors for investment, tax, and financial planning advice.",
    },
    {
      icon: XCircle,
      title: "No Hidden Risks Disclosure",
      description:
        "We do not hide risks. All verification processes are transparent, and identified risks are clearly disclosed. However, we cannot identify all potential risks—businesses may have undisclosed liabilities, market conditions may change, and regulatory environments may shift. Buyers must assess risks independently.",
    },
  ];

  return (
    <section className="w-full py-16 md:py-20 px-4 sm:px-6 lg:px-8 bg-red-50">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="flex justify-center mb-4">
            <div className="p-3 rounded-full bg-red-100 border border-red-200">
              <AlertTriangle className="w-8 h-8 text-red-600" />
            </div>
          </div>
          <h2 className="text-3xl sm:text-4xl font-bold text-slate-900 mb-4">
            What NxtOwner Does Not Do
          </h2>
          <p className="text-lg text-slate-600 max-w-3xl mx-auto">
            Transparency about our limitations is essential for building trust. 
            Here's what we explicitly do not provide or guarantee.
          </p>
        </div>

        {/* Disclaimers Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
          {disclaimers.map((disclaimer, index) => {
            const Icon = disclaimer.icon;
            return (
              <Card
                key={index}
                className="border-2 border-red-200 bg-white shadow-sm hover:shadow-md transition-shadow"
              >
                <CardHeader>
                  <div className="flex items-center gap-3 mb-3">
                    <div className="p-2 rounded-lg bg-red-100 border border-red-200">
                      <Icon className="w-5 h-5 text-red-600" />
                    </div>
                    <CardTitle className="text-lg font-bold text-red-900">
                      {disclaimer.title}
                    </CardTitle>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-slate-700 leading-relaxed">{disclaimer.description}</p>
                </CardContent>
              </Card>
            );
          })}
        </div>

        {/* Important Notice */}
        <div className="max-w-3xl mx-auto p-6 bg-red-100 border-2 border-red-300 rounded-lg">
          <div className="flex items-start gap-3">
            <XCircle className="w-6 h-6 text-red-600 shrink-0 mt-0.5" />
            <div>
              <p className="text-sm font-bold text-red-900 mb-2">Important Notice</p>
              <p className="text-sm text-slate-800 leading-relaxed">
                NxtOwner.ca is a technology platform that facilitates connections between buyers and sellers. 
                We do not act as a broker, agent, investment advisor, or financial planner. All transactions 
                are conducted directly between buyers and sellers. NxtOwner is not a party to any transaction 
                and assumes no responsibility for the accuracy of information provided by sellers or the 
                performance of any listed business. All parties are responsible for conducting their own 
                independent due diligence and obtaining appropriate professional advice.
              </p>
            </div>
          </div>
        </div>

        {/* Verification Scope Note */}
        <div className="max-w-3xl mx-auto mt-8 p-6 bg-white border border-slate-300 rounded-lg">
          <p className="text-sm text-slate-700 leading-relaxed">
            <strong className="text-slate-900">Verification Scope:</strong> Our verification process confirms 
            that the information provided by sellers matches their source documents. We validate financial data 
            against bank statements and tax returns, verify business entity status, and cross-reference operational 
            claims with supporting documentation. We do not verify undisclosed information, conduct forensic 
            accounting audits, or guarantee that all material information has been disclosed. Verification is 
            a quality control process, not a substitute for comprehensive buyer due diligence.
          </p>
        </div>
      </div>
    </section>
  );
}
