import { DealMetrics } from '@/lib/founder/deals';

interface DealVelocityPanelsProps {
  metrics: DealMetrics;
}

export default function DealVelocityPanels({ metrics }: DealVelocityPanelsProps) {
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
          <div className="text-sm font-medium text-slate-600 mb-1">Deal Rooms (7d)</div>
          <div className="text-2xl font-bold text-slate-900">{formatValue(metrics.dealRoomsCreated.count7d)}</div>
        </div>

        <div className="rounded-xl border bg-white p-4 shadow-sm">
          <div className="text-sm font-medium text-slate-600 mb-1">Deal Rooms (30d)</div>
          <div className="text-2xl font-bold text-slate-900">{formatValue(metrics.dealRoomsCreated.count30d)}</div>
        </div>

        <div className="rounded-xl border bg-white p-4 shadow-sm">
          <div className="text-sm font-medium text-slate-600 mb-1">Active Deal Rooms</div>
          <div className="text-2xl font-bold text-slate-900">{formatValue(metrics.activeDealRooms.count)}</div>
          {metrics.activeDealRooms.activeIn14d !== null && (
            <div className="text-xs text-slate-500 mt-1">{metrics.activeDealRooms.activeIn14d} active in 14d</div>
          )}
        </div>

        <div className="rounded-xl border bg-white p-4 shadow-sm">
          <div className="text-sm font-medium text-slate-600 mb-1">Avg Time to Enquiry</div>
          <div className="text-2xl font-bold text-slate-900">
            {metrics.avgTimeToEnquiry.hours === null ? '—' : `${metrics.avgTimeToEnquiry.hours}h`}
          </div>
          {metrics.avgTimeToEnquiry.note && (
            <div className="text-xs text-slate-500 mt-1">{metrics.avgTimeToEnquiry.note}</div>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="rounded-xl border bg-white p-6 shadow-sm">
          <h3 className="text-lg font-semibold text-slate-900 mb-4">Deal Velocity</h3>
          <div className="space-y-3">
            <div>
              <div className="flex items-center justify-between mb-1">
                <span className="text-sm text-slate-600">NDA → Enquiry</span>
                <span className="text-sm font-semibold text-slate-900">
                  {metrics.dealVelocity.ndaToEnquiry === null ? '—' : `${metrics.dealVelocity.ndaToEnquiry}%`}
                </span>
              </div>
              <div className="w-full bg-slate-200 rounded-full h-2">
                <div
                  className="bg-blue-600 h-2 rounded-full"
                  style={{ width: `${Math.min(metrics.dealVelocity.ndaToEnquiry || 0, 100)}%` }}
                />
              </div>
            </div>
            <div>
              <div className="flex items-center justify-between mb-1">
                <span className="text-sm text-slate-600">Enquiry → Deal Room</span>
                <span className="text-sm font-semibold text-slate-900">
                  {metrics.dealVelocity.enquiryToDealRoom === null ? '—' : `${metrics.dealVelocity.enquiryToDealRoom}%`}
                </span>
              </div>
              <div className="w-full bg-slate-200 rounded-full h-2">
                <div
                  className="bg-green-600 h-2 rounded-full"
                  style={{ width: `${Math.min(metrics.dealVelocity.enquiryToDealRoom || 0, 100)}%` }}
                />
              </div>
            </div>
          </div>
        </div>

        <div className="rounded-xl border bg-white p-6 shadow-sm">
          <h3 className="text-lg font-semibold text-slate-900 mb-4">Deal Rooms Created</h3>
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-sm text-slate-600">Last 7 days</span>
              <span className="text-sm font-semibold text-slate-900">{formatValue(metrics.dealRoomsCreated.count7d)}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-slate-600">Last 30 days</span>
              <span className="text-sm font-semibold text-slate-900">{formatValue(metrics.dealRoomsCreated.count30d)}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-slate-600">Last 90 days</span>
              <span className="text-sm font-semibold text-slate-900">{formatValue(metrics.dealRoomsCreated.count90d)}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}




