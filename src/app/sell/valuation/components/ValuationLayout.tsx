'use client';

import { ArrowLeft, ArrowRight, Save } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { ReactNode, useState, useEffect } from 'react';
import { VALUATION_STEPS, getStepIndex, getNextStepId, getPreviousStepId } from '../config';
import ResetValuationModal from './ResetValuationModal';

interface ValuationLayoutProps {
  currentStepId: string;
  track: 'operational' | 'digital' | null;
  children: ReactNode;
  onNext?: () => void;
  onBack?: () => void;
  canProceed?: boolean;
  onResetValuation?: () => void;
  isTrackLocked?: boolean;
  saveStatus?: 'idle' | 'saving' | 'saved' | 'error';
  onSaveAndExit?: () => Promise<void>;
}

export default function ValuationLayout({
  currentStepId,
  track,
  children,
  onNext,
  onBack,
  canProceed = true,
  onResetValuation,
  isTrackLocked = false,
  saveStatus = 'idle',
  onSaveAndExit,
}: ValuationLayoutProps) {
  const router = useRouter();
  const [showResetModal, setShowResetModal] = useState(false);
  const [showToast, setShowToast] = useState(false);
  const currentStep = VALUATION_STEPS.find((s) => s.id === currentStepId);
  const stepIndex = getStepIndex(currentStepId);
  const totalSteps = VALUATION_STEPS.length;
  const progress = ((stepIndex + 1) / totalSteps) * 100;

  const nextStepId = getNextStepId(currentStepId);
  const prevStepId = getPreviousStepId(currentStepId);

  const handleNext = () => {
    if (onNext) {
      onNext();
    } else if (nextStepId) {
      router.push(`/sell/valuation?step=${nextStepId}`);
    }
  };

  const handleBack = () => {
    if (onBack) {
      onBack();
    } else if (prevStepId) {
      router.push(`/sell/valuation?step=${prevStepId}`);
    } else {
      router.push('/sell');
    }
  };

  const handleResetClick = () => {
    setShowResetModal(true);
  };

  const handleResetConfirm = () => {
    if (onResetValuation) {
      onResetValuation();
    }
  };

  const handleSaveAndExit = async () => {
    if (onSaveAndExit) {
      // Flush any pending saves
      await onSaveAndExit();
      
      // Show toast
      setShowToast(true);
      setTimeout(() => setShowToast(false), 2000);
      
      // Navigate after a brief delay to ensure save completes
      setTimeout(() => {
        router.push('/dashboard/seller');
      }, 300);
    } else {
      // Fallback if onSaveAndExit not provided
      router.push('/dashboard/seller');
    }
  };

  // Auto-hide toast
  useEffect(() => {
    if (showToast) {
      const timer = setTimeout(() => setShowToast(false), 2000);
      return () => clearTimeout(timer);
    }
  }, [showToast]);

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">
      {/* Header with Progress */}
      <header className="bg-white border-b border-slate-200 sticky top-0 z-10">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          {/* Progress Bar */}
          <div className="mb-4">
            <div className="flex justify-between items-center mb-2">
              <span className="text-sm font-semibold text-slate-600">
                Step {stepIndex + 1} of {totalSteps}
              </span>
              <div className="flex items-center gap-3">
                {/* Save Status Indicator */}
                {saveStatus === 'saving' && (
                  <span className="text-xs text-slate-500 flex items-center gap-1">
                    <span className="inline-block w-2 h-2 bg-blue-500 rounded-full animate-pulse"></span>
                    Saving...
                  </span>
                )}
                {saveStatus === 'saved' && (
                  <span className="text-xs text-green-600 flex items-center gap-1">
                    <span className="inline-block w-2 h-2 bg-green-500 rounded-full"></span>
                    Saved
                  </span>
                )}
                {saveStatus === 'error' && (
                  <span className="text-xs text-red-600 flex items-center gap-1" title="Save failed, using local storage">
                    <span className="inline-block w-2 h-2 bg-red-500 rounded-full"></span>
                    Save failed
                  </span>
                )}
                <span className="text-sm font-semibold text-slate-600">
                  {Math.round(progress)}%
                </span>
              </div>
            </div>
            <div className="w-full bg-slate-200 h-2 rounded-full overflow-hidden">
              <div
                className="bg-blue-600 h-2 rounded-full transition-all duration-500 ease-out"
                style={{ width: `${progress}%` }}
              />
            </div>
          </div>

          {/* Step Title */}
          <div className="flex items-start justify-between gap-4">
            <div className="flex-1">
              <h1 className="text-2xl font-bold text-slate-900">
                {currentStep?.title || 'Valuation'}
              </h1>
              {currentStep?.description && (
                <p className="text-sm text-slate-600 mt-1">
                  {currentStep.description}
                </p>
              )}
              {track && (
                <div className="mt-2 flex items-center gap-2">
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                    {track === 'operational' ? '🏢 Operational' : '💻 Digital'}
                  </span>
                  {isTrackLocked && currentStepId !== 'track' && onResetValuation && (
                    <button
                      onClick={handleResetClick}
                      className="text-xs text-slate-500 hover:text-slate-700 underline"
                      title="Reset valuation to change track"
                    >
                      Change track
                    </button>
                  )}
                </div>
              )}
            </div>
            
            {/* Save & Exit Button */}
            {onSaveAndExit && (
              <button
                onClick={handleSaveAndExit}
                className="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium text-slate-700 hover:text-slate-900 hover:bg-slate-50 rounded-lg transition-colors border border-slate-200 whitespace-nowrap"
                title="Save progress and exit"
              >
                <Save size={16} />
                Save & Exit
              </button>
            )}
          </div>
        </div>
      </header>

      {/* Content Area */}
      <main className="flex-1 overflow-y-auto">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {children}
        </div>
      </main>

      {/* Sticky Footer */}
      <footer className="bg-white border-t border-slate-200 sticky bottom-0 z-10">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex justify-between items-center">
            <button
              onClick={handleBack}
              className="inline-flex items-center gap-2 px-6 py-3 text-slate-700 font-semibold rounded-lg hover:bg-slate-100 transition-colors"
            >
              <ArrowLeft size={18} />
              {prevStepId ? 'Back' : 'Exit'}
            </button>

            <button
              onClick={handleNext}
              disabled={!canProceed || !nextStepId}
              className="inline-flex items-center gap-2 px-6 py-3 bg-slate-900 text-white font-semibold rounded-lg hover:bg-slate-800 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              title={!canProceed ? 'Please complete this step to continue' : undefined}
            >
              {nextStepId ? 'Continue' : 'Complete'}
              {nextStepId && <ArrowRight size={18} />}
            </button>
          </div>
        </div>
      </footer>

      {/* Reset Valuation Modal */}
      {onResetValuation && (
        <ResetValuationModal
          isOpen={showResetModal}
          onClose={() => setShowResetModal(false)}
          onConfirm={handleResetConfirm}
          currentTrack={track}
        />
      )}

      {/* Toast Notification */}
      {showToast && (
        <div className="fixed bottom-24 left-1/2 -translate-x-1/2 z-50 animate-[fadeInUp_0.3s_ease-out]">
          <div className="bg-slate-900 text-white px-4 py-3 rounded-lg shadow-lg flex items-center gap-2">
            <Save size={16} />
            <span className="text-sm font-medium">Progress saved</span>
          </div>
        </div>
      )}
    </div>
  );
}

