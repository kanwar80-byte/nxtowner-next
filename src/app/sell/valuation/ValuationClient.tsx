'use client';

import { useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { createSupabaseBrowserClient } from '@/utils/supabase/client';
import ValuationLayout from './components/ValuationLayout';
import IntentStep from './components/steps/IntentStep';
import TrackStep from './components/steps/TrackStep';
import OperationalProfileStep from './components/steps/OperationalProfileStep';
import DigitalProfileStep from './components/steps/DigitalProfileStep';
import OperationalFinancialsStep from './components/steps/OperationalFinancialsStep';
import DigitalFinancialsStep from './components/steps/DigitalFinancialsStep';
import OperationalRiskStep from './components/steps/OperationalRiskStep';
import DigitalRiskStep from './components/steps/DigitalRiskStep';
import ValuationPreviewStep from './components/steps/ValuationPreviewStep';
import ReadinessStep from './components/steps/ReadinessStep';
import NextActionsStep from './components/steps/NextActionsStep';
import { getStepById } from './config';
import { useValuation } from './hooks/useValuation';
import { useValuationEvents } from './hooks/useValuationEvents';

// Step components are rendered directly based on stepId, not via registry
// This avoids type conflicts with ComponentType<Record<string, unknown>>

export default function ValuationClient() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  // Single source of truth: useValuation hook
  const valuation = useValuation(isAuthenticated);
  const [readinessScore, setReadinessScore] = useState<number | null>(null);
  const [isValuationInitialized, setIsValuationInitialized] = useState(false);

  // Load readiness score from saved data and track initialization
  useEffect(() => {
    // Check if valuation has been loaded (has stepData or is at a step beyond intent)
    const hasData = valuation.stepData && Object.keys(valuation.stepData).length > 0;
    const isPastIntent = valuation.currentStepId !== 'intent';
    setIsValuationInitialized(hasData || isPastIntent);

    // Extract readiness score from stepData if present
    const score = valuation.stepData?.readiness_score;
    if (typeof score === 'number') {
      setReadinessScore(score);
    } else if (score != null) {
      const numScore = Number(score);
      if (!isNaN(numScore)) {
        setReadinessScore(numScore);
      }
    }
  }, [valuation.stepData, valuation.currentStepId]);

  // Valuation event tracking
  const valuationEvents = useValuationEvents({
    isAuthenticated,
    isInitialized: isAuthenticated && !isLoading && isValuationInitialized,
    currentStepId: valuation.currentStepId,
    track: valuation.track,
    stepData: valuation.stepData,
    readinessScore: readinessScore,
    valuationId: valuation.valuationId || null,
  });

  // Check authentication
  useEffect(() => {
    const checkAuth = async () => {
      try {
        const supabase = createSupabaseBrowserClient();
        const { data: { user }, error } = await supabase.auth.getUser();

        if (error || !user) {
          router.push('/login?redirect=/sell/valuation');
          return;
        }

        setIsAuthenticated(true);
      } catch (err) {
        router.push('/login?redirect=/sell/valuation');
      } finally {
        setIsLoading(false);
      }
    };
    checkAuth();
  }, [router]);

  // Handle step from URL (sync with state)
  useEffect(() => {
    const stepParam = searchParams.get('step');
    if (stepParam) {
      const step = getStepById(stepParam);
      if (step && stepParam !== valuation.currentStepId) {
        valuation.setCurrentStep(stepParam);
      }
    }
    // Only depend on searchParams to avoid infinite loops
    // valuation.setCurrentStep is stable from useValuation hook
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchParams]);

  // Handlers for step-specific data updates
  const handleIntentSelect = (intent: string) => {
    valuation.updateStepData('intent', { intent });
  };

  const handleTrackSelect = (selectedTrack: 'operational' | 'digital') => {
    valuation.setTrack(selectedTrack);
  };

  const handleProfileDataChange = (profileData: Record<string, unknown>) => {
    valuation.updateStepData('profile', profileData);
  };

  const handleFinancialsDataChange = (financialsData: Record<string, unknown>) => {
    valuation.updateStepData('financials', financialsData);
  };

  const handleRiskDataChange = (riskData: Record<string, unknown>) => {
    valuation.updateStepData('risk', riskData);
  };

  // Get current step info (for navigation, not component lookup)
  const currentStep = getStepById(valuation.currentStepId);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="text-slate-600">Loading...</div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return null; // Will redirect
  }

  // Defensive: ensure track is available for track-dependent steps
  const canProceed =
    valuation.currentStepId !== 'track' || valuation.track !== null;

  return (
    <ValuationLayout
      currentStepId={valuation.currentStepId}
      track={valuation.track}
      onNext={() => valuation.navigateNext(valuationEvents.fireStepCompleted)}
      onBack={valuation.navigateBack}
      canProceed={canProceed}
      onResetValuation={valuation.resetValuation}
      isTrackLocked={valuation.isTrackLocked}
      saveStatus={valuation.saveStatus}
      onSaveAndExit={valuation.flushSave}
    >
      {valuation.currentStepId === 'intent' ? (
          <IntentStep
            initialIntent={typeof valuation.stepData?.intent === 'string' ? valuation.stepData.intent : null}
            onIntentSelect={handleIntentSelect}
          />
        ) : valuation.currentStepId === 'track' ? (
          <TrackStep
            initialTrack={valuation.track}
            onTrackSelect={handleTrackSelect}
            isLocked={valuation.isTrackLocked}
          />
        ) : valuation.currentStepId === 'profile' ? (
          valuation.track === 'operational' ? (
            <OperationalProfileStep
              initialData={valuation.stepData?.profile || ({} as Record<string, unknown>)}
              onDataChange={handleProfileDataChange}
            />
          ) : valuation.track === 'digital' ? (
            <DigitalProfileStep
              initialData={valuation.stepData?.profile || ({} as Record<string, unknown>)}
              onDataChange={handleProfileDataChange}
            />
          ) : (
            <div className="bg-white rounded-xl p-8 border border-slate-200">
              <p className="text-slate-600">Please select a track first.</p>
            </div>
          )
        ) : valuation.currentStepId === 'financials' ? (
          valuation.track === 'operational' ? (
            <OperationalFinancialsStep
              initialData={valuation.stepData?.financials || ({} as Record<string, unknown>)}
              onDataChange={handleFinancialsDataChange}
            />
          ) : valuation.track === 'digital' ? (
            <DigitalFinancialsStep
              initialData={valuation.stepData?.financials || ({} as Record<string, unknown>)}
              onDataChange={handleFinancialsDataChange}
            />
          ) : (
            <div className="bg-white rounded-xl p-8 border border-slate-200">
              <p className="text-slate-600">Please select a track first.</p>
            </div>
          )
        ) : valuation.currentStepId === 'risk' ? (
          valuation.track === 'operational' ? (
            <OperationalRiskStep
              initialData={valuation.stepData?.risk || ({} as Record<string, unknown>)}
              onDataChange={handleRiskDataChange}
            />
          ) : valuation.track === 'digital' ? (
            <DigitalRiskStep
              initialData={valuation.stepData?.risk || ({} as Record<string, unknown>)}
              onDataChange={handleRiskDataChange}
            />
          ) : (
            <div className="bg-white rounded-xl p-8 border border-slate-200">
              <p className="text-slate-600">Please select a track first.</p>
            </div>
          )
        ) : valuation.currentStepId === 'valuation_preview' ? (
          <ValuationPreviewStep
            track={valuation.track}
            stepData={valuation.stepData || ({} as Record<string, unknown>)}
          />
        ) : valuation.currentStepId === 'readiness' ? (
          <ReadinessStep
            stepData={valuation.stepData || ({} as Record<string, unknown>)}
            track={valuation.track}
            onScoreCalculated={(score) => setReadinessScore(score)}
          />
        ) : valuation.currentStepId === 'next_actions' ? (
          <NextActionsStep
            stepData={valuation.stepData || ({} as Record<string, unknown>)}
            track={valuation.track}
            onResetValuation={valuation.resetValuation}
            onCompleted={() => valuationEvents.fireCompleted()}
            readinessScore={readinessScore || 0}
          />
        ) : (
          <div className="bg-white rounded-xl p-8 border border-slate-200">
            <p className="text-slate-600">Step not found.</p>
          </div>
        )}
    </ValuationLayout>
  );
}



