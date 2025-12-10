import { z } from "zod";

export const valuationAISchema = z.object({
  valuation: z.object({
    estimated_value: z.union([z.number(), z.string()]),
    range_low: z.union([z.number(), z.string()]),
    range_high: z.union([z.number(), z.string()]),
    method: z.string(),
    key_drivers: z.array(z.string()),
    risks: z.array(z.string()),
    notes: z.string().optional().default("")
  })
});

export type ValuationAIResult = z.infer<typeof valuationAISchema>;
