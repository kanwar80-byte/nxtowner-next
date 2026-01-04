import { StrategyOutputs as StrategyOutputsType } from '@/lib/founder/strategySim';

interface StrategyOutputsProps {
  outputs: StrategyOutputsType;
}

export default function StrategyOutputs({ outputs }: StrategyOutputsProps) {
  const formatValue = (value: number): string => {
    return value.toLocaleString();
  };

  const formatRange = (low: number, base: number, high: number): string => {
    return `${formatValue(low)} / ${formatValue(base)} / ${formatValue(high)}`;
  };

  const formatRevenue = (value: number | null): string => {
    if (value === null) return '—';
    return `$${value.toLocaleString()}`;
  };

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-semibold text-slate-900 mb-4">Projected Impact (Low / Base / High)</h3>
        
        <div className="space-y-4">
          <div className="rounded-xl border bg-white p-4 shadow-sm">
            <div className="text-sm font-medium text-slate-600 mb-1">Additional NDAs Signed</div>
            <div className="text-2xl font-bold text-slate-900">
              {formatRange(outputs.additionalNdaSigned.low, outputs.additionalNdaSigned.base, outputs.additionalNdaSigned.high)}
            </div>
          </div>

          <div className="rounded-xl border bg-white p-4 shadow-sm">
            <div className="text-sm font-medium text-slate-600 mb-1">Additional Enquiries</div>
            <div className="text-2xl font-bold text-slate-900">
              {formatRange(outputs.additionalEnquiries.low, outputs.additionalEnquiries.base, outputs.additionalEnquiries.high)}
            </div>
          </div>

          <div className="rounded-xl border bg-white p-4 shadow-sm">
            <div className="text-sm font-medium text-slate-600 mb-1">Additional Deal Rooms</div>
            <div className="text-2xl font-bold text-slate-900">
              {formatRange(outputs.additionalDealRooms.low, outputs.additionalDealRooms.base, outputs.additionalDealRooms.high)}
            </div>
          </div>

          <div className="rounded-xl border bg-white p-4 shadow-sm">
            <div className="text-sm font-medium text-slate-600 mb-1">Additional Paid Users</div>
            <div className="text-2xl font-bold text-slate-900">
              {formatRange(outputs.additionalPaidUsers.low, outputs.additionalPaidUsers.base, outputs.additionalPaidUsers.high)}
            </div>
          </div>

          <div className="rounded-xl border bg-white p-4 shadow-sm">
            <div className="text-sm font-medium text-slate-600 mb-1">Revenue Impact (Monthly)</div>
            <div className="text-2xl font-bold text-slate-900">
              {outputs.revenueImpact.base !== null
                ? `${formatRevenue(outputs.revenueImpact.low)} / ${formatRevenue(outputs.revenueImpact.base)} / ${formatRevenue(outputs.revenueImpact.high)}`
                : '—'}
            </div>
            {outputs.revenueImpact.note && (
              <div className="text-xs text-slate-500 mt-1">{outputs.revenueImpact.note}</div>
            )}
          </div>
        </div>
      </div>

      <div className="rounded-xl border bg-blue-50 border-blue-200 p-6">
        <h3 className="text-lg font-semibold text-blue-900 mb-4">Recommended Focus</h3>
        <ul className="space-y-2">
          {outputs.recommendedFocus.map((item, index) => (
            <li key={index} className="flex items-start gap-2 text-sm text-blue-800">
              <span className="text-blue-600 mt-1">•</span>
              <span>{item}</span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}


