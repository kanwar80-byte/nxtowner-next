import { PartnerMetrics } from '@/lib/founder/partners';

interface PartnerPanelsProps {
  metrics: PartnerMetrics;
}

export default function PartnerPanels({ metrics }: PartnerPanelsProps) {
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

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="rounded-xl border bg-white p-4 shadow-sm">
          <div className="text-sm font-medium text-slate-600 mb-1">Operational Leads</div>
          <div className="text-2xl font-bold text-slate-900">{formatValue(metrics.leadsByTrack.operational)}</div>
        </div>

        <div className="rounded-xl border bg-white p-4 shadow-sm">
          <div className="text-sm font-medium text-slate-600 mb-1">Digital Leads</div>
          <div className="text-2xl font-bold text-slate-900">{formatValue(metrics.leadsByTrack.digital)}</div>
        </div>
      </div>

      {metrics.leadsByPartner.length > 0 && (
        <div className="rounded-xl border bg-white p-6 shadow-sm">
          <h3 className="text-lg font-semibold text-slate-900 mb-4">Leads by Partner</h3>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-slate-50 border-b border-slate-200">
                <tr>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-slate-700 uppercase">Partner</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-slate-700 uppercase">Leads</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-slate-700 uppercase">NDAs Signed</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-slate-700 uppercase">Conversion</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200">
                {metrics.leadsByPartner.map((partner, index) => (
                  <tr key={index} className="hover:bg-slate-50">
                    <td className="px-4 py-3 text-sm font-medium text-slate-900">{partner.partnerName}</td>
                    <td className="px-4 py-3 text-sm text-slate-600">{partner.leads.toLocaleString()}</td>
                    <td className="px-4 py-3 text-sm text-slate-600">{partner.ndaSigned.toLocaleString()}</td>
                    <td className="px-4 py-3 text-sm text-slate-600">
                      {partner.conversionRate === null ? '—' : `${partner.conversionRate}%`}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {metrics.leadsByPartner.length === 0 && !metrics.dataQualityNote && (
        <div className="rounded-xl border bg-white p-6 shadow-sm text-center">
          <p className="text-slate-500">No partner leads in this period.</p>
        </div>
      )}
    </div>
  );
}




