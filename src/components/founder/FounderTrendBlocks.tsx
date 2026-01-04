'use client';

import { FounderMetrics } from '@/lib/founder/founderMetrics';
import { TrendingUp, TrendingDown } from 'lucide-react';

interface FounderTrendBlocksProps {
  metrics: FounderMetrics;
}

export default function FounderTrendBlocks({ metrics }: FounderTrendBlocksProps) {
  const trendItems = [
    { label: 'Visitors', metric: metrics.visitors },
    { label: 'Registrations', metric: metrics.registrations },
    { label: 'Paid Users', metric: metrics.paidUsers },
    { label: 'NDAs Signed', metric: metrics.ndaSigned },
    { label: 'Enquiries', metric: metrics.enquiries },
  ];

  return (
    <div className="rounded-xl border bg-white p-5 shadow-sm">
      <h3 className="text-lg font-semibold text-slate-900 mb-4">Trends (7d vs 30d)</h3>
      <div className="space-y-3">
        {trendItems.map((item) => {
          const { metric } = item;
          // Deterministic icon selection based on delta value
          const isPositive = metric.delta !== undefined && metric.delta >= 0;
          const TrendIcon = isPositive ? TrendingUp : TrendingDown;
          
          // Stable deltaPercent rendering
          const pct = metric.deltaPercent ?? null;

          return (
            <div
              key={item.label}
              className="flex items-center justify-between p-3 rounded-lg bg-slate-50 hover:bg-slate-100 transition-colors"
            >
              <div className="flex-1">
                <div className="text-sm font-medium text-slate-900">{item.label}</div>
                <div className="text-xs text-slate-500 mt-1">
                  {metric.value7d.toLocaleString()} (7d) vs {metric.value30d.toLocaleString()} (30d)
                </div>
              </div>
              {metric.delta !== undefined && pct !== null && (
                <div className={`flex items-center gap-1 text-sm font-medium ${
                  isPositive ? 'text-green-600' : 'text-red-600'
                }`}>
                  <TrendIcon size={16} />
                  <span>
                    {Math.abs(pct)}%
                  </span>
                </div>
              )}
              {metric.delta !== undefined && pct === null && (
                <div className="flex items-center gap-1 text-sm font-medium text-slate-400">
                  <span>—</span>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}

