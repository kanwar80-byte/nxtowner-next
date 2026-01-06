import Link from 'next/link';
import { CheckCircle } from 'lucide-react';

export default function TrustPage() {
  return (
    <div className="min-h-screen bg-slate-50 pt-20">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        {/* Header */}
        <div className="text-center mb-16">
          <h1 className="text-4xl md:text-5xl font-extrabold text-slate-900 mb-4">
            Trust Center
          </h1>
          <p className="text-lg text-slate-600 max-w-2xl mx-auto">
            Learn how NxtOwner ensures transparency, security, and reliability in every transaction.
          </p>
        </div>

        {/* Trust Sections */}
        <div className="space-y-16">
          {/* Verified Listings */}
          <section id="verified" className="scroll-mt-20">
            <div className="bg-white rounded-xl p-8 shadow-sm border border-slate-200">
              <div className="flex items-center gap-3 mb-6">
                <CheckCircle className="w-6 h-6 text-blue-600" />
                <h2 className="text-2xl font-bold text-slate-900">Verified Listings</h2>
              </div>
              <ul className="space-y-3 text-slate-700">
                <li className="flex items-start gap-2">
                  <span className="text-blue-600 mt-1">•</span>
                  <span>All listings undergo identity verification of the seller and business entity.</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-blue-600 mt-1">•</span>
                  <span>Financial data is validated against source documents (bank statements, tax returns, P&L statements).</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-blue-600 mt-1">•</span>
                  <span>Business operations and assets are verified through documentation and site visits when applicable.</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-blue-600 mt-1">•</span>
                  <span>Verification status is clearly displayed on each listing page.</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-blue-600 mt-1">•</span>
                  <span className="text-slate-500 italic">Note: Verification confirms information accuracy but does not guarantee business performance or future results.</span>
                </li>
              </ul>
            </div>
          </section>

          {/* AI Due Diligence */}
          <section id="ai" className="scroll-mt-20">
            <div className="bg-white rounded-xl p-8 shadow-sm border border-slate-200">
              <div className="flex items-center gap-3 mb-6">
                <CheckCircle className="w-6 h-6 text-blue-600" />
                <h2 className="text-2xl font-bold text-slate-900">AI Due Diligence</h2>
              </div>
              <ul className="space-y-3 text-slate-700">
                <li className="flex items-start gap-2">
                  <span className="text-blue-600 mt-1">•</span>
                  <span>AI-powered analysis normalizes financial data across different accounting methods and reporting formats.</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-blue-600 mt-1">•</span>
                  <span>Automated risk scoring identifies potential red flags in financials, operations, and market position.</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-blue-600 mt-1">•</span>
                  <span>Comparative market analysis provides context against similar businesses in the same category.</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-blue-600 mt-1">•</span>
                  <span>AI insights are provided as supplementary tools to assist buyer decision-making.</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-blue-600 mt-1">•</span>
                  <span className="text-slate-500 italic">Note: AI analysis is informational only and does not replace professional legal, financial, or business advice.</span>
                </li>
              </ul>
            </div>
          </section>

          {/* Secure Deal Rooms */}
          <section id="security" className="scroll-mt-20">
            <div className="bg-white rounded-xl p-8 shadow-sm border border-slate-200">
              <div className="flex items-center gap-3 mb-6">
                <CheckCircle className="w-6 h-6 text-blue-600" />
                <h2 className="text-2xl font-bold text-slate-900">Secure Deal Rooms</h2>
              </div>
              <ul className="space-y-3 text-slate-700">
                <li className="flex items-start gap-2">
                  <span className="text-blue-600 mt-1">•</span>
                  <span>All sensitive documents and communications are encrypted in transit and at rest.</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-blue-600 mt-1">•</span>
                  <span>Access to deal rooms is restricted to verified parties (buyer, seller, authorized advisors).</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-blue-600 mt-1">•</span>
                  <span>NDA requirements are enforced before granting access to confidential information.</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-blue-600 mt-1">•</span>
                  <span>Audit logs track all document access and communications for compliance and security.</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-blue-600 mt-1">•</span>
                  <span className="text-slate-500 italic">Note: While we provide secure infrastructure, parties are responsible for their own due diligence and legal review.</span>
                </li>
              </ul>
            </div>
          </section>

          {/* Bank-Grade Data */}
          <section id="data" className="scroll-mt-20">
            <div className="bg-white rounded-xl p-8 shadow-sm border border-slate-200">
              <div className="flex items-center gap-3 mb-6">
                <CheckCircle className="w-6 h-6 text-blue-600" />
                <h2 className="text-2xl font-bold text-slate-900">Bank-Grade Data</h2>
              </div>
              <ul className="space-y-3 text-slate-700">
                <li className="flex items-start gap-2">
                  <span className="text-blue-600 mt-1">•</span>
                  <span>Financial data is sourced directly from verified documents (bank statements, tax returns, accounting software exports).</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-blue-600 mt-1">•</span>
                  <span>Data normalization ensures consistent formatting and categorization across all listings.</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-blue-600 mt-1">•</span>
                  <span>Historical financial trends are presented with clear date ranges and source attribution.</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-blue-600 mt-1">•</span>
                  <span>Data accuracy is validated through cross-referencing multiple source documents.</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-blue-600 mt-1">•</span>
                  <span className="text-slate-500 italic">Note: Data quality reflects the source documents provided by sellers. Buyers should verify all claims independently.</span>
                </li>
              </ul>
            </div>
          </section>
        </div>

        {/* Legal Disclaimer */}
        <div className="mt-16 bg-slate-100 rounded-xl p-6 border border-slate-200">
          <h3 className="text-sm font-semibold text-slate-900 mb-3">Legal Disclaimer</h3>
          <p className="text-sm text-slate-600 leading-relaxed">
            NxtOwner.ca is a technology platform that facilitates connections between buyers and sellers of businesses. 
            NxtOwner does not act as a broker, agent, or financial advisor. We do not provide investment, legal, or tax advice. 
            All transactions are conducted directly between buyers and sellers. NxtOwner is not responsible for the accuracy 
            of information provided by sellers, nor does it guarantee the performance or future results of any business listed on the platform.
          </p>
        </div>

        {/* CTAs */}
        <div className="mt-12 flex flex-col sm:flex-row gap-4 justify-center">
          <Link
            href="/browse?verified=1"
            className="inline-flex items-center justify-center px-8 py-3 bg-blue-600 text-white font-bold rounded-lg hover:bg-blue-700 transition-colors"
          >
            Browse Verified Listings
          </Link>
          <Link
            href="/signup?role=seller"
            className="inline-flex items-center justify-center px-8 py-3 bg-slate-900 text-white font-bold rounded-lg hover:bg-slate-800 transition-colors"
          >
            List a Business
          </Link>
        </div>
      </div>
    </div>
  );
}




