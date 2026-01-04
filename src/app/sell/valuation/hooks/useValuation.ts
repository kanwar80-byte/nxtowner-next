'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { saveValuationProgress, loadValuationProgress } from '../actions';
import { VALUATION_STEPS, getStepById, getNextStepId, getPreviousStepId, type TrackType } from '../config';

export interface ValuationState {
  currentStepId: string;
  track: TrackType | null;
  stepData: Record<string, unknown>;
  isTrackLocked: boolean;
  saveStatus: 'idle' | 'saving' | 'saved' | 'error';
  valuationId: string | null;
}

export interface ValuationActions {
  setCurrentStep: (stepId: string) => void;
  setTrack: (track: TrackType) => void;
  updateStepData: (stepId: string, data: Record<string, unknown>) => void;
  navigateNext: (onStepCompleted?: (nextStepId: string | null) => void) => void;
  navigateBack: () => void;
  resetValuation: () => void;
  getValuationPayload: () => Record<string, unknown>;
  flushSave: () => Promise<void>;
}

const DEFAULT_STEP_ID = 'intent';

/**
 * Single source of truth for valuation flow state
 * Handles SSR-safe localStorage access and track locking
 */
export function useValuation(isAuthenticated: boolean): ValuationState & ValuationActions {
  const router = useRouter();
  const [currentStepId, setCurrentStepIdState] = useState<string>(DEFAULT_STEP_ID);
  const [track, setTrackState] = useState<TrackType | null>(null);
  const [stepData, setStepDataState] = useState<Record<string, unknown>>({});
  const [isTrackLocked, setIsTrackLocked] = useState<boolean>(false);
  const [isInitialized, setIsInitialized] = useState<boolean>(false);
  const [saveStatus, setSaveStatus] = useState<'idle' | 'saving' | 'saved' | 'error'>('idle');
  const [valuationId, setValuationId] = useState<string | null>(null);
  const saveTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const saveStatusTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  // SSR-safe: Load from localStorage only in client useEffect
  useEffect(() => {
    if (!isAuthenticated || isInitialized) return;

    const loadProgress = async () => {
      try {
        // Try to load from server (database)
        const saved = await loadValuationProgress();
        if (saved) {
          if (saved.valuationId) {
            setValuationId(saved.valuationId);
          }
          if (saved.currentStep) {
            setCurrentStepIdState(saved.currentStep);
          }
          if (saved.track) {
            setTrackState(saved.track);
            setIsTrackLocked(true); // Track is locked if loaded from saved state
          }
          if (saved.stepData) {
            setStepDataState(saved.stepData || {});
          }
        }
      } catch (err) {
        // Fallback to localStorage (client-side only)
        if (typeof window !== 'undefined') {
          try {
            const localStep = localStorage.getItem('valuation_current_step');
            const localTrack = localStorage.getItem('valuation_track');
            const localStepData = localStorage.getItem('valuation_step_data');

            if (localStep) {
              setCurrentStepIdState(localStep);
            }
            if (localTrack === 'operational' || localTrack === 'digital') {
              setTrackState(localTrack);
              setIsTrackLocked(true);
            }
            if (localStepData) {
              try {
                const parsed = JSON.parse(localStepData);
                setStepDataState(parsed || {});
              } catch {
                // Invalid JSON, ignore
              }
            }
          } catch {
            // localStorage access failed, use defaults
          }
        }
      } finally {
        setIsInitialized(true);
      }
    };

    loadProgress();
  }, [isAuthenticated, isInitialized]);

  // Save progress with debouncing for input changes
  const saveProgress = useCallback(
    async (stepId: string, trackValue: TrackType | null, data: Record<string, unknown>, immediate = false) => {
      if (!isInitialized) return;

      const performSave = async () => {
        setSaveStatus('saving');
        try {
          // Save to server (if available)
          await saveValuationProgress(stepId, trackValue || undefined, data);
          setSaveStatus('saved');
          // Clear "saved" status after 2 seconds
          if (saveStatusTimeoutRef.current) {
            clearTimeout(saveStatusTimeoutRef.current);
          }
          saveStatusTimeoutRef.current = setTimeout(() => {
            setSaveStatus('idle');
            saveStatusTimeoutRef.current = null;
          }, 2000);
        } catch (err) {
          // Server save failed, continue with localStorage
          setSaveStatus('error');
          // Clear error status after 3 seconds
          if (saveStatusTimeoutRef.current) {
            clearTimeout(saveStatusTimeoutRef.current);
          }
          saveStatusTimeoutRef.current = setTimeout(() => {
            setSaveStatus('idle');
            saveStatusTimeoutRef.current = null;
          }, 3000);
        }

        // Also save to localStorage as fallback (client-side only)
        if (typeof window !== 'undefined') {
          try {
            localStorage.setItem('valuation_current_step', stepId);
            if (trackValue) {
              localStorage.setItem('valuation_track', trackValue);
            }
            if (data) {
              localStorage.setItem('valuation_step_data', JSON.stringify(data));
            }
          } catch {
            // localStorage access failed, continue silently
          }
        }
      };

      // Clear existing timeout if debouncing
      if (saveTimeoutRef.current) {
        clearTimeout(saveTimeoutRef.current);
        saveTimeoutRef.current = null;
      }

      if (immediate) {
        // Immediate save for step transitions
        await performSave();
      } else {
        // Debounced save for input changes (500ms delay)
        saveTimeoutRef.current = setTimeout(() => {
          performSave();
          saveTimeoutRef.current = null;
        }, 500);
      }
    },
    [isInitialized]
  );

  // Cleanup timeouts on unmount
  useEffect(() => {
    return () => {
      if (saveTimeoutRef.current) {
        clearTimeout(saveTimeoutRef.current);
      }
      if (saveStatusTimeoutRef.current) {
        clearTimeout(saveStatusTimeoutRef.current);
      }
    };
  }, []);

  // Set current step (with validation)
  const setCurrentStep = useCallback(
    (stepId: string) => {
      const step = getStepById(stepId);
      if (!step) {
        console.warn(`Invalid step ID: ${stepId}`);
        return;
      }
      setCurrentStepIdState(stepId);
      saveProgress(stepId, track, stepData, true); // Immediate save for step transitions
      router.push(`/sell/valuation?step=${stepId}`);
    },
    [track, stepData, router, saveProgress]
  );

  // Set track (with locking)
  const setTrack = useCallback(
    (newTrack: TrackType) => {
      if (isTrackLocked && track !== null && track !== newTrack) {
        // Track is locked, prevent change without explicit reset
        console.warn('Track is locked. Use resetValuation() to change track.');
        return;
      }

      setTrackState(newTrack);
      setIsTrackLocked(true); // Lock track after first selection

      const updatedStepData = {
        ...stepData,
        track: newTrack,
      };
      setStepDataState(updatedStepData);
      saveProgress(currentStepId, newTrack, updatedStepData, true); // Immediate save for track selection
    },
    [isTrackLocked, track, stepData, currentStepId, saveProgress]
  );

  // Update step data (defensive null handling)
  // Note: stepData structure uses keys: 'intent', 'profile', 'financials', 'risk', 'track'
  const updateStepData = useCallback(
    (dataKey: string, data: Record<string, unknown>) => {
      // Defensive: ensure data is an object
      const safeData = data && typeof data === 'object' ? data : {};
      const safeStepData = stepData && typeof stepData === 'object' ? stepData : {};

      const updatedStepData = {
        ...safeStepData,
        [dataKey]: {
          ...((safeStepData[dataKey] as Record<string, unknown>) || {}),
          ...safeData,
        },
      };

      setStepDataState(updatedStepData);
      saveProgress(currentStepId, track, updatedStepData, false); // Debounced save for input changes
    },
    [stepData, currentStepId, track, saveProgress]
  );

  // Navigate to next step
  const navigateNext = useCallback((onStepCompleted?: (nextStepId: string | null) => void) => {
    const nextStepId = getNextStepId(currentStepId);
    if (nextStepId) {
      // Fire step_completed event before navigation
      if (onStepCompleted) {
        onStepCompleted(nextStepId);
      }
      setCurrentStep(nextStepId);
    }
  }, [currentStepId, setCurrentStep]);

  // Navigate to previous step
  const navigateBack = useCallback(() => {
    const prevStepId = getPreviousStepId(currentStepId);
    if (prevStepId) {
      setCurrentStep(prevStepId);
    } else {
      router.push('/sell');
    }
  }, [currentStepId, setCurrentStep, router]);

  // Reset valuation (partial reset - keeps intent, clears track-specific data)
  const resetValuation = useCallback(() => {
    // Keep intent if present
    const intent = stepData?.intent && typeof stepData.intent === 'string' 
      ? stepData.intent 
      : null;

    // Clear track and track-specific data
    setTrackState(null);
    setIsTrackLocked(false);
    
    // Reset stepData but preserve intent
    const resetStepData = intent ? { intent } : {};
    setStepDataState(resetStepData);

    // Navigate to track step (step index 1)
    const trackStepId = 'track';
    setCurrentStepIdState(trackStepId);

    // Clear saved progress (will be re-saved with reset data)
    if (typeof window !== 'undefined') {
      try {
        localStorage.setItem('valuation_current_step', trackStepId);
        localStorage.removeItem('valuation_track');
        if (intent) {
          localStorage.setItem('valuation_step_data', JSON.stringify(resetStepData));
        } else {
          localStorage.removeItem('valuation_step_data');
        }
      } catch {
        // Ignore errors
      }
    }

    // Save reset state to database
    saveProgress(trackStepId, null, resetStepData, true).catch(() => {
      // Silent fail - localStorage already updated
    });

    router.push(`/sell/valuation?step=${trackStepId}`);
  }, [router, stepData, saveProgress]);

  // Get complete valuation payload
  const getValuationPayload = useCallback((): Record<string, unknown> => {
    return {
      track: track || null,
      intent: stepData?.intent || null,
      profile: stepData?.profile || {},
      financials: stepData?.financials || {},
      risk: stepData?.risk || {},
      currentStep: currentStepId,
      completedAt: new Date().toISOString(),
    };
  }, [track, stepData, currentStepId]);

  // Flush debounced save (for Save & Exit)
  const flushSave = useCallback(async () => {
    if (!isInitialized) return;

    // Clear any pending debounced save
    if (saveTimeoutRef.current) {
      clearTimeout(saveTimeoutRef.current);
      saveTimeoutRef.current = null;
    }

    // Perform immediate save
    await saveProgress(currentStepId, track, stepData, true);
  }, [isInitialized, currentStepId, track, stepData, saveProgress]);

  return {
    // State
    currentStepId,
    track,
    stepData: stepData || {},
    isTrackLocked,
    saveStatus,
    valuationId,

    // Actions
    setCurrentStep,
    setTrack,
    updateStepData,
    navigateNext,
    navigateBack,
    resetValuation,
    getValuationPayload,
    flushSave,
  };
}

