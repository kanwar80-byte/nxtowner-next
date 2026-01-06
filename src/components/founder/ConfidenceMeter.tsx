import { ConfidenceSummary } from '@/lib/founder/confidence';
import { AlertCircle, CheckCircle, AlertTriangle } from 'lucide-react';
import Link from 'next/link';

interface ConfidenceMeterProps {
  confidence: ConfidenceSummary;
  compact?: boolean; // For smaller displays like strategy page
}

export default function ConfidenceMeter({ confidence, compact = false }: ConfidenceMeterProps) {
  const levelConfig = {
    high: {
      color: 'bg-green-100 text-green-800 border-green-200',
      icon: CheckCircle,
      iconColor: 'text-green-600',
      label: 'High Confidence',
    },
    medium: {
      color: 'bg-amber-100 text-amber-800 border-amber-200',
      icon: AlertTriangle,
      iconColor: 'text-amber-600',
      label: 'Medium Confidence',
    },
    low: {
      color: 'bg-red-100 text-red-800 border-red-200',
      icon: AlertCircle,
      iconColor: 'text-red-600',
      label: 'Low Confidence',
    },
  };

  const config = levelConfig[confidence.level];
  const Icon = config.icon;

  if (compact) {
    // Compact pill version for strategy page
    return (
      <div className="flex items-center gap-2">
        <span className={`px-3 py-1 rounded-full text-xs font-semibold border ${config.color} flex items-center gap-1.5`}>
          <Icon className={`w-3.5 h-3.5 ${config.iconColor}`} />
          {config.label}
        </span>
      </div>
    );
  }

  // Full banner version
  return (
    <div className={`rounded-lg border p-4 ${config.color} mb-4`}>
      <div className="flex items-start justify-between gap-4">
        <div className="flex items-start gap-3 flex-1">
          <Icon className={`w-5 h-5 ${config.iconColor} mt-0.5 shrink-0`} />
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-2">
              <span className="font-semibold text-sm">{config.label}</span>
              <span className="text-xs opacity-75">({confidence.score}/100)</span>
            </div>
            <div className="flex flex-wrap gap-x-4 gap-y-1 text-xs">
              {confidence.notes.map((note, index) => (
                <span key={index} className="opacity-90">
                  {note}
                </span>
              ))}
            </div>
          </div>
        </div>
        {confidence.level === 'low' && (
          <Link
            href="/founder"
            className="text-xs font-medium underline opacity-90 hover:opacity-100 shrink-0"
          >
            Improve tracking
          </Link>
        )}
      </div>
    </div>
  );
}




