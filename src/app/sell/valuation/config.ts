/**
 * Valuation Flow Step Configuration
 * Defines all steps in the valuation process
 */

export type TrackType = 'operational' | 'digital';

export interface ValuationStep {
  id: string;
  title: string;
  description?: string;
  component: string; // Component name for dynamic loading
}

export const VALUATION_STEPS: ValuationStep[] = [
  {
    id: 'intent',
    title: 'Selling Intent',
    description: 'Tell us about your goals',
    component: 'IntentStep',
  },
  {
    id: 'track',
    title: 'Asset Type',
    description: 'Choose operational or digital',
    component: 'TrackStep',
  },
  {
    id: 'profile',
    title: 'Business Profile',
    description: 'Basic information about your business',
    component: 'ProfileStep',
  },
  {
    id: 'financials',
    title: 'Financial Overview',
    description: 'Revenue, cash flow, and key metrics',
    component: 'FinancialsStep',
  },
  {
    id: 'risk',
    title: 'Risk Assessment',
    description: 'Identify potential risks and mitigations',
    component: 'RiskStep',
  },
  {
    id: 'valuation_preview',
    title: 'Valuation Preview',
    description: 'Review your estimated valuation',
    component: 'ValuationPreviewStep',
  },
  {
    id: 'readiness',
    title: 'Readiness Check',
    description: 'Ensure your listing is ready to publish',
    component: 'ReadinessStep',
  },
  {
    id: 'next_actions',
    title: 'Next Steps',
    description: 'Your action plan',
    component: 'NextActionsStep',
  },
];

export function getStepIndex(stepId: string): number {
  return VALUATION_STEPS.findIndex((s) => s.id === stepId);
}

export function getStepById(stepId: string): ValuationStep | undefined {
  return VALUATION_STEPS.find((s) => s.id === stepId);
}

export function getNextStepId(currentStepId: string): string | null {
  const currentIndex = getStepIndex(currentStepId);
  if (currentIndex === -1 || currentIndex === VALUATION_STEPS.length - 1) {
    return null;
  }
  return VALUATION_STEPS[currentIndex + 1].id;
}

export function getPreviousStepId(currentStepId: string): string | null {
  const currentIndex = getStepIndex(currentStepId);
  if (currentIndex <= 0) {
    return null;
  }
  return VALUATION_STEPS[currentIndex - 1].id;
}


