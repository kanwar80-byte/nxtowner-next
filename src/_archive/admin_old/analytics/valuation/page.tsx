import { redirect } from 'next/navigation';
import { getValuationAnalytics } from '@/app/actions/getValuationAnalytics';
import Link from 'next/link';
import { isAdmin } from '@/lib/auth';

function formatTime(seconds: number | null): string {
  if (seconds === null) return 'N/A';
  if (seconds < 60) return `${Math.round(seconds)}s`;
  if (seconds < 3600) return `${Math.round(seconds / 60)}m`;
  const hours = Math.floor(seconds / 3600);
  const minutes = Math.round((seconds % 3600) / 60);
  return `${hours}h ${minutes}m`;
}

function formatDate(dateString: string): string {
  return new Date(dateString).toLocaleString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
    hour: 'numeric',
    minute: '2-digit',
  });
}

export default async function ValuationAnalyticsPage() {
  // Server-side admin check using centralized helper
  const userIsAdmin = await isAdmin();
  
  if (!userIsAdmin) {
    redirect('/admin');
  }

  const data = await getValuationAnalytics();

  if (!data) {
    redirect('/admin');
  }

  const { kpis, funnel, trackBreakdown, recentCompletions } = data;

  return (
    <div className="min-h-screen bg-slate-50 pt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-slate-900">Valuation Funnel Analytics</h1>
              <p className="text-slate-600 mt-1">Track user journey through the valuation flow</p>
            </div>
            <Link
              href="/admin"
              className="text-slate-600 hover:text-slate-900 font-medium"
            >
              ← Back to Admin
            </Link>
          </div>
        </div>

        {/* KPI Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4 mb-8">
          {/* Valuation Starts */}
          <div className="bg-white rounded-lg border border-slate-200 p-6">
            <div className="text-sm font-medium text-slate-600 mb-1">Valuation Starts</div>
            <div className="text-2xl font-bold text-slate-900">{kpis.starts_30d}</div>
            <div className="text-xs text-slate-500 mt-1">Last 30 days</div>
            <div className="text-sm text-blue-600 mt-2">{kpis.starts_7d} last 7d</div>
          </div>

          {/* Step 1 Views */}
          <div className="bg-white rounded-lg border border-slate-200 p-6">
            <div className="text-sm font-medium text-slate-600 mb-1">Track Selection Views</div>
            <div className="text-2xl font-bold text-slate-900">{kpis.step1_views_30d}</div>
            <div className="text-xs text-slate-500 mt-1">Last 30 days</div>
            <div className="text-sm text-blue-600 mt-2">{kpis.step1_views_7d} last 7d</div>
          </div>

          {/* Step 1 Completes */}
          <div className="bg-white rounded-lg border border-slate-200 p-6">
            <div className="text-sm font-medium text-slate-600 mb-1">Track Selection Completes</div>
            <div className="text-2xl font-bold text-slate-900">{kpis.step1_completes_30d}</div>
            <div className="text-xs text-slate-500 mt-1">Last 30 days</div>
            <div className="text-sm text-blue-600 mt-2">{kpis.step1_completes_7d} last 7d</div>
          </div>

          {/* Valuation Completed */}
          <div className="bg-white rounded-lg border border-slate-200 p-6">
            <div className="text-sm font-medium text-slate-600 mb-1">Valuation Completed</div>
            <div className="text-2xl font-bold text-slate-900">{kpis.completed_30d}</div>
            <div className="text-xs text-slate-500 mt-1">Last 30 days</div>
            <div className="text-sm text-blue-600 mt-2">{kpis.completed_7d} last 7d</div>
          </div>

          {/* Completion Rate */}
          <div className="bg-white rounded-lg border border-slate-200 p-6">
            <div className="text-sm font-medium text-slate-600 mb-1">Completion Rate</div>
            <div className="text-2xl font-bold text-slate-900">{kpis.completion_rate_30d.toFixed(1)}%</div>
            <div className="text-xs text-slate-500 mt-1">Last 30 days</div>
            <div className="text-sm text-blue-600 mt-2">{kpis.completion_rate_7d.toFixed(1)}% last 7d</div>
          </div>
        </div>

        {/* Median Time to Complete */}
        <div className="bg-white rounded-lg border border-slate-200 p-6 mb-8">
          <h2 className="text-lg font-semibold text-slate-900 mb-4">Time to Complete</h2>
          <div className="grid grid-cols-2 gap-6">
            <div>
              <div className="text-sm font-medium text-slate-600 mb-1">Last 7 Days</div>
              <div className="text-2xl font-bold text-slate-900">
                {formatTime(kpis.median_time_to_complete_7d)}
              </div>
            </div>
            <div>
              <div className="text-sm font-medium text-slate-600 mb-1">Last 30 Days</div>
              <div className="text-2xl font-bold text-slate-900">
                {formatTime(kpis.median_time_to_complete_30d)}
              </div>
            </div>
          </div>
        </div>

        {/* Funnel Table */}
        <div className="bg-white rounded-lg border border-slate-200 p-6 mb-8">
          <h2 className="text-lg font-semibold text-slate-900 mb-4">Funnel by Step</h2>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-slate-200">
              <thead className="bg-slate-50">
                <tr>
                  <th className="px-4 py-3 text-left text-xs font-medium text-slate-700 uppercase tracking-wider">
                    Step
                  </th>
                  <th className="px-4 py-3 text-right text-xs font-medium text-slate-700 uppercase tracking-wider">
                    Viewed
                  </th>
                  <th className="px-4 py-3 text-right text-xs font-medium text-slate-700 uppercase tracking-wider">
                    Completed
                  </th>
                  <th className="px-4 py-3 text-right text-xs font-medium text-slate-700 uppercase tracking-wider">
                    Drop-off
                  </th>
                  <th className="px-4 py-3 text-right text-xs font-medium text-slate-700 uppercase tracking-wider">
                    Drop-off Rate
                  </th>
                  <th className="px-4 py-3 text-right text-xs font-medium text-slate-700 uppercase tracking-wider">
                    Operational
                  </th>
                  <th className="px-4 py-3 text-right text-xs font-medium text-slate-700 uppercase tracking-wider">
                    Digital
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-slate-200">
                {funnel.map((step) => (
                  <tr key={step.step_id} className="hover:bg-slate-50">
                    <td className="px-4 py-3 whitespace-nowrap">
                      <div className="text-sm font-medium text-slate-900">
                        {step.step_id.replace('_', ' ')}
                      </div>
                      <div className="text-xs text-slate-500">Step {step.step_index + 1}</div>
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap text-right text-sm text-slate-900">
                      {step.viewed_count}
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap text-right text-sm text-slate-900">
                      {step.completed_count}
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap text-right text-sm text-slate-600">
                      {step.drop_off}
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap text-right text-sm text-slate-600">
                      {step.drop_off_rate.toFixed(1)}%
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap text-right text-sm text-slate-600">
                      {step.track_operational_viewed} / {step.track_operational_completed}
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap text-right text-sm text-slate-600">
                      {step.track_digital_viewed} / {step.track_digital_completed}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Track Breakdown */}
        <div className="bg-white rounded-lg border border-slate-200 p-6 mb-8">
          <h2 className="text-lg font-semibold text-slate-900 mb-4">Track Breakdown</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {trackBreakdown.map((track) => (
              <div key={track.track || 'null'} className="border border-slate-200 rounded-lg p-4">
                <div className="text-sm font-medium text-slate-600 mb-2">
                  {track.track === 'operational' ? '🏢 Operational' : 
                   track.track === 'digital' ? '💻 Digital' : 
                   '❓ Unknown'}
                </div>
                <div className="text-2xl font-bold text-slate-900 mb-1">{track.starts}</div>
                <div className="text-xs text-slate-500 mb-2">Starts</div>
                <div className="text-lg font-semibold text-slate-900 mb-1">{track.completed}</div>
                <div className="text-xs text-slate-500 mb-2">Completed</div>
                <div className="text-sm font-medium text-blue-600">
                  {track.completion_rate.toFixed(1)}% completion rate
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Recent Completions */}
        <div className="bg-white rounded-lg border border-slate-200 p-6">
          <h2 className="text-lg font-semibold text-slate-900 mb-4">Recent Completions (Last 20)</h2>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-slate-200">
              <thead className="bg-slate-50">
                <tr>
                  <th className="px-4 py-3 text-left text-xs font-medium text-slate-700 uppercase tracking-wider">
                    Completed At
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-slate-700 uppercase tracking-wider">
                    Track
                  </th>
                  <th className="px-4 py-3 text-right text-xs font-medium text-slate-700 uppercase tracking-wider">
                    Readiness Score
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-slate-700 uppercase tracking-wider">
                    Valuation ID
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-slate-200">
                {recentCompletions.length === 0 ? (
                  <tr>
                    <td colSpan={4} className="px-4 py-8 text-center text-sm text-slate-500">
                      No completions found
                    </td>
                  </tr>
                ) : (
                  recentCompletions.map((completion, idx) => (
                    <tr key={idx} className="hover:bg-slate-50">
                      <td className="px-4 py-3 whitespace-nowrap text-sm text-slate-900">
                        {formatDate(completion.created_at)}
                      </td>
                      <td className="px-4 py-3 whitespace-nowrap text-sm text-slate-600">
                        {completion.track === 'operational' ? '🏢 Operational' : 
                         completion.track === 'digital' ? '💻 Digital' : 
                         '❓ Unknown'}
                      </td>
                      <td className="px-4 py-3 whitespace-nowrap text-right text-sm text-slate-900">
                        {completion.readiness_score !== null ? (
                          <span className="font-medium">{completion.readiness_score}%</span>
                        ) : (
                          <span className="text-slate-400">N/A</span>
                        )}
                      </td>
                      <td className="px-4 py-3 whitespace-nowrap text-sm text-slate-600 font-mono text-xs">
                        {completion.valuation_id ? (
                          <span className="truncate max-w-xs block">{completion.valuation_id}</span>
                        ) : (
                          <span className="text-slate-400">N/A</span>
                        )}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}

