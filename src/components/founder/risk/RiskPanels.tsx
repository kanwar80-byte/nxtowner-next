import { RiskMetrics } from '@/lib/founder/risk';
import { AlertTriangle, Shield, FileX } from 'lucide-react';

interface RiskPanelsProps {
  metrics: RiskMetrics;
}

export default function RiskPanels({ metrics }: RiskPanelsProps) {
  const formatValue = (value: number | null): string => {
    return value === null ? '—' : value.toLocaleString();
  };

  const getSeverityColor = (severity: 'high' | 'medium' | 'low'): string => {
    switch (severity) {
      case 'high':
        return 'text-red-600 bg-red-50 border-red-200';
      case 'medium':
        return 'text-amber-600 bg-amber-50 border-amber-200';
      case 'low':
        return 'text-blue-600 bg-blue-50 border-blue-200';
      default:
        return 'text-slate-600 bg-slate-50 border-slate-200';
    }
  };

  const getIcon = (type: string) => {
    switch (type) {
      case 'high_risk_session':
        return AlertTriangle;
      case 'suspicious_pattern':
        return Shield;
      case 'low_quality_listing':
        return FileX;
      default:
        return AlertTriangle;
    }
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
          <div className="text-sm font-medium text-slate-600 mb-1">High-Risk Sessions</div>
          <div className="text-2xl font-bold text-slate-900">{formatValue(metrics.highRiskSessions)}</div>
          <div className="text-xs text-slate-500 mt-1">Many views, zero enquiries</div>
        </div>

        <div className="rounded-xl border bg-white p-4 shadow-sm">
          <div className="text-sm font-medium text-slate-600 mb-1">Suspicious Patterns</div>
          <div className="text-2xl font-bold text-slate-900">{formatValue(metrics.suspiciousPatterns)}</div>
          <div className="text-xs text-slate-500 mt-1">Repeated view bursts</div>
        </div>

        <div className="rounded-xl border bg-white p-4 shadow-sm">
          <div className="text-sm font-medium text-slate-600 mb-1">Low-Quality Listings</div>
          <div className="text-2xl font-bold text-slate-900">{formatValue(metrics.lowQualityListings)}</div>
          <div className="text-xs text-slate-500 mt-1">Missing critical fields</div>
        </div>
      </div>

      {metrics.signals.length > 0 && (
        <div className="rounded-xl border bg-white p-6 shadow-sm">
          <h3 className="text-lg font-semibold text-slate-900 mb-4">Risk Signals</h3>
          <div className="space-y-3">
            {metrics.signals.map((signal, index) => {
              const Icon = getIcon(signal.type);
              return (
                <div
                  key={index}
                  className={`p-4 rounded-lg border ${getSeverityColor(signal.severity)}`}
                >
                  <div className="flex items-start gap-3">
                    <Icon className="w-5 h-5 mt-0.5 flex-shrink-0" />
                    <div className="flex-1">
                      <div className="flex items-center justify-between mb-2">
                        <span className="font-semibold">
                          {signal.type === 'high_risk_session' && 'High-Risk Sessions'}
                          {signal.type === 'suspicious_pattern' && 'Suspicious Patterns'}
                          {signal.type === 'low_quality_listing' && 'Low-Quality Listings'}
                        </span>
                        <span className="text-sm font-bold">{signal.count}</span>
                      </div>
                      {signal.reasons.length > 0 && (
                        <ul className="text-sm space-y-1 mt-2">
                          {signal.reasons.map((reason, i) => (
                            <li key={i} className="flex items-start gap-2">
                              <span className="mt-1">•</span>
                              <span>{reason}</span>
                            </li>
                          ))}
                        </ul>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {metrics.signals.length === 0 && !metrics.dataQualityNote && (
        <div className="rounded-xl border bg-white p-6 shadow-sm text-center">
          <p className="text-slate-500">No risk signals detected in this period.</p>
        </div>
      )}
    </div>
  );
}




