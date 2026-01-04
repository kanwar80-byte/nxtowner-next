'use client';

interface ValuationPreviewStepProps {
  track?: 'operational' | 'digital' | null;
  stepData?: Record<string, any>;
}

export default function ValuationPreviewStep({
  track,
  stepData,
}: ValuationPreviewStepProps) {
  // Defensive: ensure stepData is an object
  const safeStepData = stepData && typeof stepData === 'object' ? stepData : {};

  // Placeholder calculation (will be replaced with real AI logic later)
  const calculateValuationRange = () => {
    // For now, return static ranges based on track
    if (track === 'operational') {
      return {
        min: '$500,000',
        max: '$1,200,000',
        midpoint: '$850,000',
      };
    } else if (track === 'digital') {
      return {
        min: '$200,000',
        max: '$800,000',
        midpoint: '$500,000',
      };
    }
    return {
      min: '$300,000',
      max: '$1,000,000',
      midpoint: '$650,000',
    };
  };

  const valuationRange = calculateValuationRange();

  // Placeholder lens calculations
  const cashFlowBased = {
    value: valuationRange.midpoint,
    method: track === 'operational' ? 'EBITDA Multiple (3-5x)' : 'Revenue Multiple (2-4x)',
    confidence: 'Medium',
  };

  const marketContext = {
    value: valuationRange.max,
    method: 'Comparable Transactions',
    confidence: 'Low',
  };

  const riskAdjusted = {
    value: valuationRange.min,
    method: 'Risk-Adjusted DCF',
    confidence: 'Medium',
  };

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-xl p-8 border border-slate-200">
        <h2 className="text-xl font-bold text-slate-900 mb-4">
          Valuation Preview
        </h2>
        <p className="text-slate-600 mb-6">
          Based on the information provided, here's an indicative valuation range for your business.
        </p>

        {/* Main Valuation Range */}
        <div className="bg-gradient-to-br from-blue-50 to-slate-50 rounded-xl p-8 border-2 border-blue-200 mb-8">
          <div className="text-center">
            <p className="text-sm font-semibold text-slate-600 mb-2 uppercase tracking-wide">
              Indicative Valuation Range
            </p>
            <div className="flex items-baseline justify-center gap-3 mb-4">
              <span className="text-4xl font-bold text-slate-900">
                {valuationRange.min}
              </span>
              <span className="text-2xl text-slate-500">—</span>
              <span className="text-4xl font-bold text-slate-900">
                {valuationRange.max}
              </span>
            </div>
            <p className="text-sm text-slate-600">
              Midpoint: <span className="font-semibold text-slate-900">{valuationRange.midpoint}</span>
            </p>
          </div>
        </div>

        {/* Three Lenses */}
        <div className="space-y-4 mb-6">
          <h3 className="text-lg font-bold text-slate-900 mb-4">
            Valuation Lenses
          </h3>

          {/* Cash Flow Based */}
          <div className="bg-slate-50 rounded-lg p-5 border border-slate-200">
            <div className="flex justify-between items-start mb-2">
              <div>
                <h4 className="font-semibold text-slate-900 mb-1">
                  Cash-Flow Based
                </h4>
                <p className="text-sm text-slate-600">{cashFlowBased.method}</p>
              </div>
              <div className="text-right">
                <p className="text-xl font-bold text-slate-900">{cashFlowBased.value}</p>
                <p className="text-xs text-slate-500 mt-1">
                  Confidence: <span className="font-medium">{cashFlowBased.confidence}</span>
                </p>
              </div>
            </div>
          </div>

          {/* Market Context */}
          <div className="bg-slate-50 rounded-lg p-5 border border-slate-200">
            <div className="flex justify-between items-start mb-2">
              <div>
                <h4 className="font-semibold text-slate-900 mb-1">
                  Market Context
                </h4>
                <p className="text-sm text-slate-600">{marketContext.method}</p>
              </div>
              <div className="text-right">
                <p className="text-xl font-bold text-slate-900">{marketContext.value}</p>
                <p className="text-xs text-slate-500 mt-1">
                  Confidence: <span className="font-medium">{marketContext.confidence}</span>
                </p>
              </div>
            </div>
          </div>

          {/* Risk Adjusted */}
          <div className="bg-slate-50 rounded-lg p-5 border border-slate-200">
            <div className="flex justify-between items-start mb-2">
              <div>
                <h4 className="font-semibold text-slate-900 mb-1">
                  Risk-Adjusted
                </h4>
                <p className="text-sm text-slate-600">{riskAdjusted.method}</p>
              </div>
              <div className="text-right">
                <p className="text-xl font-bold text-slate-900">{riskAdjusted.value}</p>
                <p className="text-xs text-slate-500 mt-1">
                  Confidence: <span className="font-medium">{riskAdjusted.confidence}</span>
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Disclaimer */}
        <div className="bg-amber-50 border border-amber-200 rounded-lg p-4">
          <p className="text-sm text-amber-800 leading-relaxed">
            <strong>Disclaimer:</strong> This is an <strong>indicative valuation</strong> based on the information provided. 
            The accuracy will <strong>improve with verification</strong> of financial documents and business details. 
            This is <strong>not a formal appraisal</strong> and should not be used as the sole basis for pricing decisions.
          </p>
        </div>
      </div>
    </div>
  );
}
