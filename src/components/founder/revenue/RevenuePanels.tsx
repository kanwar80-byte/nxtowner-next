import { RevenueMetrics } from '@/lib/founder/revenue';

interface RevenuePanelsProps {
  metrics: RevenueMetrics;
}

export default function RevenuePanels({ metrics }: RevenuePanelsProps) {
  const formatValue = (value: number | null): string => {
    return value === null ? '—' : value === 0 ? '0' : value.toLocaleString();
  };

  const formatCurrency = (value: number | null): string => {
    return value === null ? '—' : `$${value.toLocaleString()}`;
  };

  return (
    <div className="space-y-6">
      {metrics.dataQualityNote && (
        <div className="px-4 py-2 bg-amber-50 border border-amber-200 rounded-lg">
          <p className="text-sm text-amber-800">{metrics.dataQualityNote}</p>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="rounded-xl border bg-white p-4 shadow-sm">
          <div className="text-sm font-medium text-slate-600 mb-1">Paid Users</div>
          <div className="text-2xl font-bold text-slate-900">{formatValue(metrics.paidUsers.count)}</div>
          <div className="text-xs text-slate-500 mt-1">
            {metrics.paidUsers.delta30d !== null && `+${metrics.paidUsers.delta30d} in 30d`}
          </div>
        </div>

        <div className="rounded-xl border bg-white p-4 shadow-sm">
          <div className="flex items-center gap-2 mb-1">
            <div className="text-sm font-medium text-slate-600">MRR</div>
            {metrics.mrr.isEstimated && (
              <span className="text-xs px-2 py-0.5 bg-amber-100 text-amber-700 rounded">Estimated</span>
            )}
          </div>
          <div className="text-2xl font-bold text-slate-900">{formatCurrency(metrics.mrr.value)}</div>
          {metrics.mrr.note && (
            <div className="text-xs text-slate-500 mt-1">{metrics.mrr.note}</div>
          )}
        </div>

        <div className="rounded-xl border bg-white p-4 shadow-sm">
          <div className="flex items-center gap-2 mb-1">
            <div className="text-sm font-medium text-slate-600">ARR</div>
            {metrics.arr.isEstimated && (
              <span className="text-xs px-2 py-0.5 bg-amber-100 text-amber-700 rounded">Estimated</span>
            )}
          </div>
          <div className="text-2xl font-bold text-slate-900">{formatCurrency(metrics.arr.value)}</div>
          {metrics.arr.note && (
            <div className="text-xs text-slate-500 mt-1">{metrics.arr.note}</div>
          )}
        </div>
      </div>

      {metrics.revenueByTier.length > 0 && (
        <div className="rounded-xl border bg-white p-6 shadow-sm">
          <h3 className="text-lg font-semibold text-slate-900 mb-4">Revenue by Tier</h3>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-slate-50 border-b border-slate-200">
                <tr>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-slate-700 uppercase">Tier</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-slate-700 uppercase">Users</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-slate-700 uppercase">Est. MRR</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200">
                {metrics.revenueByTier.map((tier, index) => (
                  <tr key={index} className="hover:bg-slate-50">
                    <td className="px-4 py-3 text-sm font-medium text-slate-900">{tier.tier}</td>
                    <td className="px-4 py-3 text-sm text-slate-600">{tier.count.toLocaleString()}</td>
                    <td className="px-4 py-3 text-sm text-slate-600">
                      {tier.mrr === null ? '—' : `$${tier.mrr.toLocaleString()}`}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}




