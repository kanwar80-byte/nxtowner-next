import { FounderMetrics, KpiMetric } from '@/lib/founder/founderMetrics';

interface FounderKpiTilesProps {
  metrics: FounderMetrics;
}

function KpiTile({ metric }: { metric: KpiMetric }) {
  const deltaColor = metric.delta && metric.delta >= 0 ? 'text-green-600' : 'text-red-600';
  const deltaIcon = metric.delta && metric.delta >= 0 ? '↑' : '↓';

  return (
    <div className="rounded-xl border bg-white p-5 shadow-sm">
      <div className="flex items-center justify-between mb-2">
        <div className="text-sm font-medium text-slate-600">{metric.label}</div>
        {metric.isEstimated && (
          <span className="text-xs text-amber-600 bg-amber-50 px-2 py-0.5 rounded">Estimated</span>
        )}
      </div>
      <div className="flex items-baseline gap-3 mb-2">
        <div className="text-2xl font-bold text-slate-900">
          {metric.value30d.toLocaleString()}
        </div>
        <div className="text-sm text-slate-500">30d</div>
      </div>
      <div className="flex items-center gap-2 text-xs">
        <span className="text-slate-500">7d: {metric.value7d.toLocaleString()}</span>
        {metric.delta !== undefined && metric.deltaPercent !== undefined && (
          <span className={`font-medium ${deltaColor}`}>
            {deltaIcon} {Math.abs(metric.delta).toLocaleString()} ({Math.abs(metric.deltaPercent)}%)
          </span>
        )}
      </div>
    </div>
  );
}

export default function FounderKpiTiles({ metrics }: FounderKpiTilesProps) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      <KpiTile metric={metrics.visitors} />
      <KpiTile metric={metrics.registrations} />
      <KpiTile metric={metrics.paidUsers} />
      <KpiTile metric={metrics.mrr} />
      <KpiTile metric={metrics.ndaSigned} />
      <KpiTile metric={metrics.enquiries} />
      <KpiTile metric={metrics.dealRoomsActive} />
    </div>
  );
}


