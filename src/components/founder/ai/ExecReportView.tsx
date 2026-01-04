import { ExecBrief } from '@/lib/founder/aiReport';
import { FileText, CheckCircle, XCircle, AlertTriangle, Target, TrendingUp, TrendingDown, Minus } from 'lucide-react';

interface ExecReportViewProps {
  brief: ExecBrief;
}

export default function ExecReportView({ brief }: ExecReportViewProps) {
  const generatedDate = new Date(brief.generatedAt).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });

  const getMomentumIcon = (momentum: string) => {
    if (momentum === 'growing') return <TrendingUp className="w-4 h-4 text-green-600" />;
    if (momentum === 'declining') return <TrendingDown className="w-4 h-4 text-red-600" />;
    if (momentum === 'stable') return <Minus className="w-4 h-4 text-slate-600" />;
    return null;
  };

  const getPriorityColor = (priority: string) => {
    if (priority === 'P0') return 'bg-red-100 text-red-700 border-red-200';
    if (priority === 'P1') return 'bg-amber-100 text-amber-700 border-amber-200';
    return 'bg-blue-100 text-blue-700 border-blue-200';
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold text-slate-900">Executive Brief</h2>
          <p className="text-sm text-slate-500 mt-1">
            Generated {generatedDate} • Period: {brief.period.last7d} to {brief.period.last30d}
          </p>
        </div>
        {brief.dataQualityNotes && brief.dataQualityNotes.length > 0 && (
          <div className="px-3 py-1.5 bg-amber-50 border border-amber-200 rounded-lg">
            <p className="text-xs text-amber-800">{brief.dataQualityNotes.join('; ')}</p>
          </div>
        )}
      </div>

      {/* Narrative Summary */}
      <div className="rounded-xl border bg-white p-6 shadow-sm">
        <div className="flex items-center gap-2 mb-4">
          <FileText className="w-5 h-5 text-blue-600" />
          <h3 className="text-lg font-semibold text-slate-900">Narrative Summary</h3>
        </div>
        <div className="space-y-3">
          <div>
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wide">Momentum</span>
            <p className="text-sm text-slate-700 mt-1">{brief.narrativeSummary.momentum}</p>
          </div>
          <div>
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wide">Constraint</span>
            <p className="text-sm text-slate-700 mt-1">{brief.narrativeSummary.constraint}</p>
          </div>
          <div>
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wide">Next Action</span>
            <p className="text-sm text-slate-700 mt-1">{brief.narrativeSummary.nextAction}</p>
          </div>
        </div>
      </div>

      {/* Executive Summary */}
      <div className="rounded-xl border bg-white p-6 shadow-sm">
        <div className="flex items-center gap-2 mb-4">
          <FileText className="w-5 h-5 text-blue-600" />
          <h3 className="text-lg font-semibold text-slate-900">Executive Summary</h3>
        </div>
        <ul className="space-y-2">
          {brief.executiveSummary.map((item, index) => (
            <li key={index} className="flex items-start gap-3 text-sm text-slate-700">
              <span className="text-blue-500 mt-1">•</span>
              <span>{item}</span>
            </li>
          ))}
        </ul>
      </div>

      {/* Track Breakdown */}
      <div className="rounded-xl border bg-white p-6 shadow-sm">
        <div className="flex items-center gap-2 mb-4">
          <TrendingUp className="w-5 h-5 text-purple-600" />
          <h3 className="text-lg font-semibold text-slate-900">Operational vs Digital Breakdown</h3>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="border rounded-lg p-4">
            <div className="flex items-center justify-between mb-2">
              <h4 className="font-semibold text-slate-900">Operational</h4>
              {getMomentumIcon(brief.byTrack.operational.momentum)}
            </div>
            <div className="text-xs text-slate-600 space-y-1">
              <div>NDAs: {brief.byTrack.operational.ndas !== null ? brief.byTrack.operational.ndas.toLocaleString() : '—'}</div>
              <div>Enquiries: {brief.byTrack.operational.enquiries !== null ? brief.byTrack.operational.enquiries.toLocaleString() : '—'}</div>
              <div>Deal Rooms: {brief.byTrack.operational.dealRooms !== null ? brief.byTrack.operational.dealRooms.toLocaleString() : '—'}</div>
            </div>
          </div>
          <div className="border rounded-lg p-4">
            <div className="flex items-center justify-between mb-2">
              <h4 className="font-semibold text-slate-900">Digital</h4>
              {getMomentumIcon(brief.byTrack.digital.momentum)}
            </div>
            <div className="text-xs text-slate-600 space-y-1">
              <div>NDAs: {brief.byTrack.digital.ndas !== null ? brief.byTrack.digital.ndas.toLocaleString() : '—'}</div>
              <div>Enquiries: {brief.byTrack.digital.enquiries !== null ? brief.byTrack.digital.enquiries.toLocaleString() : '—'}</div>
              <div>Deal Rooms: {brief.byTrack.digital.dealRooms !== null ? brief.byTrack.digital.dealRooms.toLocaleString() : '—'}</div>
            </div>
          </div>
        </div>
      </div>

      {/* Funnel Leaks */}
      {brief.funnelLeaks.length > 0 && (
        <div className="rounded-xl border bg-white p-6 shadow-sm">
          <div className="flex items-center gap-2 mb-4">
            <XCircle className="w-5 h-5 text-red-600" />
            <h3 className="text-lg font-semibold text-slate-900">Funnel Leaks</h3>
          </div>
          <div className="space-y-4">
            {brief.funnelLeaks.map((leak, index) => (
              <div key={index} className="border rounded-lg p-4">
                <div className="flex items-center justify-between mb-2">
                  <span className="font-medium text-slate-900">{leak.step}</span>
                  <div className="flex items-center gap-2">
                    {leak.isLowVolume && (
                      <span className="text-xs px-2 py-0.5 bg-amber-100 text-amber-700 rounded-full">
                        Low Volume
                      </span>
                    )}
                    <span className="text-sm font-semibold text-red-600">{leak.dropPct.toFixed(0)}% drop-off</span>
                  </div>
                </div>
                <ul className="text-xs text-slate-600 space-y-1 mt-2">
                  {leak.likelyCauses.map((cause, i) => (
                    <li key={i} className="flex items-start gap-2">
                      <span>•</span>
                      <span>{cause}</span>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Revenue Insights */}
      {brief.revenueInsights.length > 0 && (
        <div className="rounded-xl border bg-white p-6 shadow-sm">
          <div className="flex items-center gap-2 mb-4">
            <CheckCircle className="w-5 h-5 text-green-600" />
            <h3 className="text-lg font-semibold text-slate-900">Revenue Dynamics</h3>
          </div>
          <ul className="space-y-2">
            {brief.revenueInsights.map((item, index) => (
              <li key={index} className="flex items-start gap-3 text-sm text-slate-700">
                <span className="text-green-500 mt-1">•</span>
                <span>{item}</span>
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Partner Insights */}
      {brief.partnerInsights.length > 0 && (
        <div className="rounded-xl border bg-white p-6 shadow-sm">
          <div className="flex items-center gap-2 mb-4">
            <CheckCircle className="w-5 h-5 text-blue-600" />
            <h3 className="text-lg font-semibold text-slate-900">Partner Dynamics</h3>
          </div>
          <ul className="space-y-2">
            {brief.partnerInsights.map((item, index) => (
              <li key={index} className="flex items-start gap-3 text-sm text-slate-700">
                <span className="text-blue-500 mt-1">•</span>
                <span>{item}</span>
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Risk Signals */}
      {brief.riskSignals.length > 0 && (
        <div className="rounded-xl border bg-white p-6 shadow-sm">
          <div className="flex items-center gap-2 mb-4">
            <AlertTriangle className="w-5 h-5 text-amber-600" />
            <h3 className="text-lg font-semibold text-slate-900">Risk & Trust Signals</h3>
          </div>
          <ul className="space-y-2">
            {brief.riskSignals.map((item, index) => (
              <li key={index} className="flex items-start gap-3 text-sm text-slate-700">
                <span className="text-amber-500 mt-1">⚠</span>
                <span>{item}</span>
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Next 30 Days Action Plan */}
      {brief.actionPlan30d.length > 0 && (
        <div className="rounded-xl border bg-white p-6 shadow-sm">
          <div className="flex items-center gap-2 mb-4">
            <Target className="w-5 h-5 text-blue-600" />
            <h3 className="text-lg font-semibold text-slate-900">Next 30 Days Action Plan</h3>
          </div>
          <div className="space-y-4">
            {brief.actionPlan30d.map((item, index) => (
              <div key={index} className={`border rounded-lg p-4 ${getPriorityColor(item.priority)}`}>
                <div className="flex items-start justify-between mb-2">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="px-2 py-0.5 rounded text-xs font-semibold border">
                      {item.priority}
                    </span>
                    <span className="font-semibold">{item.title}</span>
                  </div>
                </div>
                <p className="text-xs mt-2 mb-1">{item.rationale}</p>
                <div className="flex items-center gap-4 mt-2 text-xs">
                  <div>
                    <span className="font-medium">Owner:</span> <span>{item.owner}</span>
                  </div>
                  <div>
                    <span className="font-medium">Timeframe:</span> <span>{item.timeframe}</span>
                  </div>
                </div>
                <p className="text-xs font-medium mt-2">Target: {item.metricTarget}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Assumptions & Data Notes */}
      <div className="rounded-xl border bg-amber-50 border-amber-200 p-6 shadow-sm">
        <div className="flex items-center gap-2 mb-4">
          <AlertTriangle className="w-5 h-5 text-amber-600" />
          <h3 className="text-lg font-semibold text-slate-900">Assumptions & Data Notes</h3>
        </div>
        <div className="space-y-2 text-sm text-slate-700">
          <div>
            <span className="font-medium">Coverage:</span> {brief.assumptionsNotes.coverageDays} days with events
          </div>
          <div>
            <span className="font-medium">Sessions (30d):</span> {brief.assumptionsNotes.sessions30d.toLocaleString()}
          </div>
          <div>
            <span className="font-medium">Estimated Metrics:</span> {brief.assumptionsNotes.estimatedMetrics}
          </div>
          <div>
            <span className="font-medium">Low Volume Warnings:</span> {brief.assumptionsNotes.lowVolumeWarnings}
          </div>
          {brief.assumptionsNotes.missingSources.length > 0 && (
            <div className="mt-3 pt-3 border-t border-amber-300">
              <span className="font-medium">Missing Sources:</span>
              <ul className="list-disc list-inside mt-1 space-y-1">
                {brief.assumptionsNotes.missingSources.map((source, index) => (
                  <li key={index}>{source}</li>
                ))}
              </ul>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

