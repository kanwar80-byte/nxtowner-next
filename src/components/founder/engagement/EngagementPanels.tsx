import { EngagementMetrics } from '@/lib/founder/engagement';

interface EngagementPanelsProps {
  metrics: EngagementMetrics;
  period: '7d' | '30d';
}

export default function EngagementPanels({ metrics, period }: EngagementPanelsProps) {
  const formatValue = (value: number | null): string => {
    return value === null ? '—' : value.toLocaleString();
  };

  return (
    <div className="space-y-6">
      {metrics.dataQualityNote && (
        <div className="px-4 py-2 bg-amber-50 border border-amber-200 rounded-lg">
          <p className="text-sm text-amber-800">{metrics.dataQualityNote}</p>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="rounded-xl border bg-white p-4 shadow-sm">
          <div className="text-sm font-medium text-slate-600 mb-1">Sessions per Day</div>
          <div className="text-2xl font-bold text-slate-900">{formatValue(metrics.sessionsPerDay)}</div>
          <div className="text-xs text-slate-500 mt-1">Avg over {period}</div>
        </div>

        <div className="rounded-xl border bg-white p-4 shadow-sm">
          <div className="text-sm font-medium text-slate-600 mb-1">Page Views per Session</div>
          <div className="text-2xl font-bold text-slate-900">{formatValue(metrics.pageViewsPerSession)}</div>
          <div className="text-xs text-slate-500 mt-1">Avg over {period}</div>
        </div>

        <div className="rounded-xl border bg-white p-4 shadow-sm">
          <div className="text-sm font-medium text-slate-600 mb-1">Listing Views</div>
          <div className="text-2xl font-bold text-slate-900">{formatValue(metrics.listingViews)}</div>
          <div className="text-xs text-slate-500 mt-1">Total in {period}</div>
        </div>

        <div className="rounded-xl border bg-white p-4 shadow-sm">
          <div className="text-sm font-medium text-slate-600 mb-1">Avg Session Duration</div>
          <div className="text-2xl font-bold text-slate-900">
            {metrics.avgSessionDuration === null ? '—' : `${metrics.avgSessionDuration} min`}
          </div>
          <div className="text-xs text-slate-500 mt-1">Estimated</div>
        </div>
      </div>

      {metrics.topPages.length > 0 && (
        <div className="rounded-xl border bg-white p-6 shadow-sm">
          <h3 className="text-lg font-semibold text-slate-900 mb-4">Top Pages</h3>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-slate-50 border-b border-slate-200">
                <tr>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-slate-700 uppercase">Path</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-slate-700 uppercase">Views</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200">
                {metrics.topPages.map((page, index) => (
                  <tr key={index} className="hover:bg-slate-50">
                    <td className="px-4 py-3 text-sm text-slate-900 font-mono">{page.path}</td>
                    <td className="px-4 py-3 text-sm text-slate-600">{page.views.toLocaleString()}</td>
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


