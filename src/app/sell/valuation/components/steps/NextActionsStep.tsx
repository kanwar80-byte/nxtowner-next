'use client';

import { useEffect } from 'react';
import Link from 'next/link';
import { ArrowRight, Download, FileText, TrendingUp, Save } from 'lucide-react';
import { useRouter } from 'next/navigation';
import ValuationSummary from '../ValuationSummary';

interface NextActionsStepProps {
  stepData?: Record<string, any>;
  track?: 'operational' | 'digital' | null;
  onResetValuation?: () => void;
  onCompleted?: () => void;
  readinessScore?: number;
  readinessPillars?: {
    profile: number;
    financial: number;
    risk: number;
    intent: number;
  };
}

export default function NextActionsStep({ 
  stepData, 
  track, 
  onResetValuation, 
  onCompleted,
  readinessScore = 0,
  readinessPillars,
}: NextActionsStepProps) {
  const router = useRouter();

  // Fire completed event once when component mounts
  useEffect(() => {
    if (onCompleted) {
      onCompleted();
    }
  }, [onCompleted]);

  // Defensive: ensure stepData is an object
  const safeStepData = stepData && typeof stepData === 'object' ? stepData : {};

  const handleDownloadSummary = () => {
    // Create a summary document
    const summary = {
      track: track || 'Not selected',
      intent: (safeStepData?.intent && typeof safeStepData.intent === 'string')
        ? safeStepData.intent
        : 'Not specified',
      profile: (safeStepData?.profile && typeof safeStepData.profile === 'object')
        ? safeStepData.profile
        : {},
      financials: (safeStepData?.financials && typeof safeStepData.financials === 'object')
        ? safeStepData.financials
        : {},
      risk: (safeStepData?.risk && typeof safeStepData.risk === 'object')
        ? safeStepData.risk
        : {},
      generatedAt: new Date().toISOString(),
    };

    const blob = new Blob([JSON.stringify(summary, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `valuation-summary-${Date.now()}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-6">
      {/* Valuation Summary */}
      <ValuationSummary
        track={track}
        stepData={stepData}
        readinessScore={readinessScore}
        readinessPillars={readinessPillars}
      />

      {/* Next Actions */}
      <div className="bg-white rounded-xl p-8 border border-slate-200">
        <h2 className="text-xl font-bold text-slate-900 mb-4">
          Next Actions
        </h2>
        <p className="text-slate-600 mb-6">
          Choose how you'd like to proceed with your valuation and listing.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
          {/* Improve Readiness */}
          <Link
            href="/sell/valuation?step=profile"
            className="p-5 border-2 border-slate-200 rounded-lg hover:border-blue-500 hover:bg-blue-50 transition-all group"
          >
            <div className="flex items-start gap-4">
              <div className="p-2 bg-blue-100 rounded-lg group-hover:bg-blue-200 transition-colors">
                <TrendingUp className="text-blue-600" size={24} />
              </div>
              <div className="flex-1">
                <h3 className="font-semibold text-slate-900 mb-1">Improve Readiness</h3>
                <p className="text-sm text-slate-600">
                  Go back and add more information to strengthen your listing profile.
                </p>
              </div>
            </div>
          </Link>

          {/* Proceed to Listing */}
          <Link
            href="/sell/onboarding"
            className="p-5 border-2 border-slate-200 rounded-lg hover:border-green-500 hover:bg-green-50 transition-all group"
          >
            <div className="flex items-start gap-4">
              <div className="p-2 bg-green-100 rounded-lg group-hover:bg-green-200 transition-colors">
                <ArrowRight className="text-green-600" size={24} />
              </div>
              <div className="flex-1">
                <h3 className="font-semibold text-slate-900 mb-1">Proceed to Listing</h3>
                <p className="text-sm text-slate-600">
                  Continue to create your full listing with photos and descriptions.
                </p>
              </div>
            </div>
          </Link>

          {/* Download Summary */}
          <button
            onClick={handleDownloadSummary}
            className="p-5 border-2 border-slate-200 rounded-lg hover:border-purple-500 hover:bg-purple-50 transition-all group text-left w-full"
          >
            <div className="flex items-start gap-4">
              <div className="p-2 bg-purple-100 rounded-lg group-hover:bg-purple-200 transition-colors">
                <Download className="text-purple-600" size={24} />
              </div>
              <div className="flex-1">
                <h3 className="font-semibold text-slate-900 mb-1">Download Summary</h3>
                <p className="text-sm text-slate-600">
                  Save a copy of your valuation data for your records.
                </p>
              </div>
            </div>
          </button>

          {/* Save and Return Later */}
          <Link
            href="/dashboard/seller"
            className="p-5 border-2 border-slate-200 rounded-lg hover:border-slate-400 hover:bg-slate-50 transition-all group"
          >
            <div className="flex items-start gap-4">
              <div className="p-2 bg-slate-100 rounded-lg group-hover:bg-slate-200 transition-colors">
                <Save className="text-slate-600" size={24} />
              </div>
              <div className="flex-1">
                <h3 className="font-semibold text-slate-900 mb-1">Save and Return Later</h3>
                <p className="text-sm text-slate-600">
                  Your progress is saved. Come back anytime to continue.
                </p>
              </div>
            </div>
          </Link>
        </div>

        {/* Completion Message */}
        <div className="mt-6 p-4 bg-green-50 border border-green-200 rounded-lg">
          <p className="text-sm text-green-800">
            <strong>Great work!</strong> You've completed the valuation flow. Your data has been saved and you can return to continue your listing at any time.
          </p>
        </div>

        {/* Reset Valuation Option */}
        {onResetValuation && (
          <div className="mt-4 pt-4 border-t border-slate-200">
            <button
              onClick={onResetValuation}
              className="text-sm text-slate-500 hover:text-slate-700 underline"
            >
              Reset valuation and start over
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
