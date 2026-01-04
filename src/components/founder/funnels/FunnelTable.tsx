import { FunnelData } from '@/lib/founder/funnelRepo';
import { AlertCircle } from 'lucide-react';

interface FunnelTableProps {
  funnel: FunnelData;
}

export default function FunnelTable({ funnel }: FunnelTableProps) {
  if (funnel.steps.length === 0) {
    return (
      <div className="py-12 text-center">
        <AlertCircle className="w-12 h-12 text-slate-300 mx-auto mb-4" />
        <p className="text-slate-500">No funnel data available.</p>
        <p className="text-sm text-slate-400 mt-2">
          The analytics_funnel_daily table may not exist yet, or there is no data for this period.
        </p>
      </div>
    );
  }

  return (
    <div className="overflow-x-auto">
      <table className="w-full">
        <thead className="bg-slate-50 border-b border-slate-200">
          <tr>
            <th className="px-4 py-3 text-left text-xs font-semibold text-slate-700 uppercase tracking-wider">
              Step
            </th>
            <th className="px-4 py-3 text-right text-xs font-semibold text-slate-700 uppercase tracking-wider">
              Count
            </th>
            <th className="px-4 py-3 text-right text-xs font-semibold text-slate-700 uppercase tracking-wider">
              Conversion Rate
            </th>
            <th className="px-4 py-3 text-right text-xs font-semibold text-slate-700 uppercase tracking-wider">
              Drop-off
            </th>
            <th className="px-4 py-3 text-right text-xs font-semibold text-slate-700 uppercase tracking-wider">
              Drop-off Rate
            </th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-slate-200">
          {funnel.steps.map((step, index) => {
            const isFirst = index === 0;
            const conversionColor = step.conversionRate >= 50 ? 'text-green-600' : step.conversionRate >= 25 ? 'text-amber-600' : 'text-red-600';
            const dropOffColor = step.dropOffRate >= 50 ? 'text-red-600' : step.dropOffRate >= 25 ? 'text-amber-600' : 'text-slate-600';

            return (
              <tr key={step.step} className="hover:bg-slate-50">
                <td className="px-4 py-3">
                  <div className="flex items-center gap-2">
                    <div className={`w-2 h-2 rounded-full ${
                      index === 0 ? 'bg-blue-500' :
                      step.conversionRate >= 50 ? 'bg-green-500' :
                      step.conversionRate >= 25 ? 'bg-amber-500' :
                      'bg-red-500'
                    }`} />
                    <span className="text-sm font-medium text-slate-900">{step.label}</span>
                  </div>
                </td>
                <td className="px-4 py-3 text-right text-sm font-semibold text-slate-900">
                  {step.count.toLocaleString()}
                </td>
                <td className="px-4 py-3 text-right">
                  {isFirst ? (
                    <span className="text-sm text-slate-400">—</span>
                  ) : (
                    <span className={`text-sm font-medium ${conversionColor}`}>
                      {step.conversionRate}%
                    </span>
                  )}
                </td>
                <td className="px-4 py-3 text-right text-sm text-slate-600">
                  {isFirst ? '—' : step.dropOff.toLocaleString()}
                </td>
                <td className="px-4 py-3 text-right">
                  {isFirst ? (
                    <span className="text-sm text-slate-400">—</span>
                  ) : (
                    <span className={`text-sm font-medium ${dropOffColor}`}>
                      {step.dropOffRate}%
                    </span>
                  )}
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
      {funnel.isEstimated && (
        <div className="mt-4 p-3 bg-amber-50 border border-amber-200 rounded-lg">
          <p className="text-sm text-amber-800">
            ⚠️ Some metrics are estimated from available data. For accurate funnel tracking, ensure analytics_events table is populated.
          </p>
        </div>
      )}
    </div>
  );
}


