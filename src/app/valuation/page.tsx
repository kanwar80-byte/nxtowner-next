import { ValuationForm } from "@/components/valuation/ValuationForm";

export const revalidate = 0; // On-demand rendering

export const metadata = {
  title: "AI Business Valuation | NxtOwner",
  description: "Get an AI-powered business valuation estimate using NexusAI. Powered by Gemini.",
};

export default function ValuationPage() {
  return (
    <main className="min-h-screen bg-gray-50">
      {/* Header Section */}
      <div className="bg-white border-b border-brand-border">
        <div className="max-w-4xl mx-auto px-6 py-12 sm:px-8 lg:px-12">
          <h1 className="text-4xl font-bold text-brand-text mb-2">
            AI Business Valuation
          </h1>
          <p className="text-lg text-brand-muted mb-4">
            Get an AI-powered valuation estimate for your business in minutes
          </p>
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <p className="text-sm text-blue-900">
              <strong>NexusAI Beta:</strong> This valuation uses advanced AI analysis of your business metrics. 
              Results are estimates for planning purposes only and should not replace professional valuations from 
              accredited advisors.
            </p>
          </div>
        </div>
      </div>

      {/* Form Section */}
      <div className="max-w-4xl mx-auto px-6 py-12 sm:px-8 lg:px-12">
        <ValuationForm />
      </div>

      {/* Footer Section */}
      <div className="bg-gray-50 border-t border-brand-border mt-12">
        <div className="max-w-4xl mx-auto px-6 py-8 sm:px-8 lg:px-12">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
            <div>
              <h3 className="text-sm font-semibold text-brand-text uppercase tracking-wide mb-2">
                ✓ Private & Secure
              </h3>
              <p className="text-sm text-brand-muted">
                Your data is encrypted and never shared with third parties
              </p>
            </div>
            <div>
              <h3 className="text-sm font-semibold text-brand-text uppercase tracking-wide mb-2">
                ✓ AI-Powered
              </h3>
              <p className="text-sm text-brand-muted">
                Powered by Gemini, trained on market and business data
              </p>
            </div>
            <div>
              <h3 className="text-sm font-semibold text-brand-text uppercase tracking-wide mb-2">
                ✓ Instant Results
              </h3>
              <p className="text-sm text-brand-muted">
                Get your valuation in seconds, not days
              </p>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
