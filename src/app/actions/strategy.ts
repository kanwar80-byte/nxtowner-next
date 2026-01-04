'use server';

import { StrategyInputs, simulateStrategy, StrategyOutputs } from '@/lib/founder/strategySim';

export async function runStrategySimulation(inputs: StrategyInputs): Promise<StrategyOutputs> {
  return await simulateStrategy(inputs);
}


