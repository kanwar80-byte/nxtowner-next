import { AdminMetrics, KpiMetric } from '@/lib/admin/adminMetrics';

interface AdminKpiTilesProps {
  metrics: AdminMetrics;
}

function KpiTile({ metric }: { metric: KpiMetric }) {
  const hasDataUnavailable = metric.value7d === null || metric.value30d === null;
  const hasDelta = metric.deltaAbs !== null;
  
  const deltaColor = hasDelta && metric.deltaAbs! >= 0 ? 'text-green-600' : 'text-red-600';
  const deltaIcon = hasDelta && metric.deltaAbs! >= 0 ? '↑' : '↓';

  const formatValue = (value: number | null): string => {
    return value === null ? '—' : value.toLocaleString();
  };

  return (
    <div className="rounded-xl border bg-white p-5 shadow-sm">
      <div className="text-sm font-medium text-slate-600 mb-2">{metric.label}</div>
      <div className="flex items-baseline gap-3 mb-2">
        <div className="text-2xl font-bold text-slate-900">{formatValue(metric.value30d)}</div>
        <div className="text-sm text-slate-500">30d</div>
      </div>
      <div className="flex items-center gap-2 text-xs mb-1">
        <span className="text-slate-500">7d: {formatValue(metric.value7d)}</span>
        {hasDelta && (
          <span className={`font-medium ${deltaColor}`}>
            {deltaIcon} {Math.abs(metric.deltaAbs!)}
            {metric.deltaPct !== null && ` (${Math.abs(metric.deltaPct)}%)`}
          </span>
        )}
      </div>
      {metric.splits && (
        <div className="flex items-center gap-2 mt-2 pt-2 border-t border-slate-100">
          <span className="text-xs text-slate-500">Track:</span>
          <span className="text-xs px-2 py-0.5 bg-blue-50 text-blue-700 rounded font-medium">
            O: {formatValue(metric.splits.operational.value30d)}
          </span>
          <span className="text-xs px-2 py-0.5 bg-purple-50 text-purple-700 rounded font-medium">
            D: {formatValue(metric.splits.digital.value30d)}
          </span>
        </div>
      )}
      {hasDataUnavailable && (
        <div className="text-xs text-slate-400 mt-1">Data unavailable</div>
      )}
    </div>
  );
}

export default function AdminKpiTiles({ metrics }: AdminKpiTilesProps) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      <KpiTile metric={metrics.newListings} />
      <KpiTile metric={metrics.newUsers} />
      <KpiTile metric={metrics.ndaRequests} />
      <KpiTile metric={metrics.dealRoomsCreated} />
    </div>
  );
}

