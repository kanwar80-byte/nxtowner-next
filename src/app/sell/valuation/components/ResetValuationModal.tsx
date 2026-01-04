'use client';

import { X, AlertTriangle } from 'lucide-react';

interface ResetValuationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  currentTrack: 'operational' | 'digital' | null;
}

export default function ResetValuationModal({
  isOpen,
  onClose,
  onConfirm,
  currentTrack,
}: ResetValuationModalProps) {
  if (!isOpen) return null;

  const handleConfirm = () => {
    onConfirm();
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50">
      <div className="bg-white rounded-xl shadow-xl max-w-md w-full border border-slate-200">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-slate-200">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-amber-100 rounded-lg">
              <AlertTriangle className="text-amber-600" size={20} />
            </div>
            <h2 className="text-lg font-bold text-slate-900">
              Reset Valuation?
            </h2>
          </div>
          <button
            onClick={onClose}
            className="p-1 hover:bg-slate-100 rounded-lg transition-colors"
            aria-label="Close"
          >
            <X size={20} className="text-slate-500" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6">
          <p className="text-slate-700 mb-4">
            Resetting your valuation will:
          </p>
          <ul className="space-y-2 mb-6 text-sm text-slate-600">
            <li className="flex items-start gap-2">
              <span className="text-red-500 mt-1">•</span>
              <span>
                <strong>Clear your track selection</strong> ({currentTrack === 'operational' ? 'Operational' : 'Digital'})
              </span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-red-500 mt-1">•</span>
              <span>
                <strong>Remove all track-specific answers:</strong>
                <ul className="ml-4 mt-1 space-y-1">
                  <li>• Business profile data</li>
                  <li>• Financial information</li>
                  <li>• Risk assessment</li>
                </ul>
              </span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-red-500 mt-1">•</span>
              <span>
                <strong>Return you to the track selection step</strong>
              </span>
            </li>
            <li className="flex items-start gap-2 mt-3 pt-3 border-t border-slate-200">
              <span className="text-green-500 mt-1">✓</span>
              <span>
                <strong>Keep your selling intent</strong> (if you've selected one)
              </span>
            </li>
          </ul>
          <p className="text-sm text-slate-600 bg-slate-50 p-3 rounded-lg border border-slate-200">
            This action cannot be undone. You'll need to re-enter your track-specific information.
          </p>
        </div>

        {/* Actions */}
        <div className="flex gap-3 p-6 border-t border-slate-200">
          <button
            onClick={onClose}
            className="flex-1 px-4 py-2.5 text-slate-700 font-semibold rounded-lg hover:bg-slate-100 transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={handleConfirm}
            className="flex-1 px-4 py-2.5 bg-red-600 text-white font-semibold rounded-lg hover:bg-red-700 transition-colors"
          >
            Reset Valuation
          </button>
        </div>
      </div>
    </div>
  );
}


