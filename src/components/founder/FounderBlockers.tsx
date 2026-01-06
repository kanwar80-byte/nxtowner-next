import { AlertTriangle } from 'lucide-react';

export type GrowthBlocker = {
  id: string;
  title: string;
  description: string;
  severity: 'high' | 'medium' | 'low';
  category: 'conversion' | 'retention' | 'engagement' | 'monetization' | 'technical';
};

interface FounderBlockersProps {
  blockers: GrowthBlocker[];
}

export default function FounderBlockers({ blockers }: FounderBlockersProps) {
  if (blockers.length === 0) {
    return (
      <div className="rounded-xl border bg-white p-5 shadow-sm">
        <h3 className="text-lg font-semibold text-slate-900 mb-4">Top Growth Blockers</h3>
        <div className="py-8 text-center">
          <p className="text-slate-500">No significant blockers detected.</p>
        </div>
      </div>
    );
  }

  const severityColors = {
    high: 'bg-red-100 text-red-800 border-red-200',
    medium: 'bg-amber-100 text-amber-800 border-amber-200',
    low: 'bg-blue-100 text-blue-800 border-blue-200',
  };

  return (
    <div className="rounded-xl border bg-white p-5 shadow-sm">
      <h3 className="text-lg font-semibold text-slate-900 mb-4">Top Growth Blockers</h3>
      <div className="space-y-3">
        {blockers.map((blocker) => (
          <div
            key={blocker.id}
            className="flex items-start gap-3 p-4 rounded-lg border bg-slate-50 hover:bg-slate-100 transition-colors"
          >
            <AlertTriangle
              className={`w-5 h-5 mt-0.5 ${
                blocker.severity === 'high' ? 'text-red-600' :
                blocker.severity === 'medium' ? 'text-amber-600' :
                'text-blue-600'
              }`}
            />
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-1">
                <h4 className="text-sm font-semibold text-slate-900">{blocker.title}</h4>
                <span className={`text-xs px-2 py-0.5 rounded border ${severityColors[blocker.severity]}`}>
                  {blocker.severity}
                </span>
                <span className="text-xs text-slate-500 capitalize">{blocker.category}</span>
              </div>
              <p className="text-sm text-slate-600">{blocker.description}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}




