import { z } from 'zod';

/**
 * Listing Creation Validation Schemas
 * Used for runtime validation of createListing server action input
 */

// ============================================================================
// FormData/Input Schema (accepts various field name variations)
// ============================================================================

export const CreateListingInputSchema = z.object({
  // Category/Subcategory (accepts both UUIDs and text names)
  category_id: z.string().uuid('Category ID must be a valid UUID').optional(),
  subcategory_id: z.string().uuid('Subcategory ID must be a valid UUID').optional(),
  main_category: z.string().optional(),
  category: z.string().optional(),
  sub_category: z.string().optional(),
  subcategory: z.string().optional(),

  // Title/Business Name
  title: z.string().optional(),
  businessName: z.string().optional(),

  // Asset Type
  asset_type: z.enum(['operational', 'digital']).optional(),

  // Description
  description: z.string().optional(),

  // Location
  location: z.string().optional(),

  // Pricing
  asking_price: z.union([
    z.string().transform((val) => {
      const num = Number(val);
      return isNaN(num) ? null : num;
    }),
    z.number(),
  ]).nullable().optional(),

  // Financials
  annual_revenue: z.union([
    z.string().transform((val) => {
      const num = Number(val);
      return isNaN(num) ? null : num;
    }),
    z.number(),
  ]).nullable().optional(),
  annual_cashflow: z.union([
    z.string().transform((val) => {
      const num = Number(val);
      return isNaN(num) ? null : num;
    }),
    z.number(),
  ]).nullable().optional(),
  expenses: z.union([
    z.string().transform((val) => {
      const num = Number(val);
      return isNaN(num) ? null : num;
    }),
    z.number(),
  ]).nullable().optional(),
  grossMargin: z.union([
    z.string().transform((val) => {
      const num = Number(val);
      return isNaN(num) ? null : num;
    }),
    z.number(),
  ]).nullable().optional(),

  // Business Details
  foundedYear: z.union([
    z.string().transform((val) => {
      const num = Number(val);
      return isNaN(num) ? null : num;
    }),
    z.number().int(),
  ]).nullable().optional(),
  employees: z.union([
    z.string().transform((val) => {
      const num = Number(val);
      return isNaN(num) ? null : num;
    }),
    z.number().int(),
  ]).nullable().optional(),
  websiteUrl: z.union([
    z.string().url('Website URL must be a valid URL'),
    z.literal(''),
  ]).optional(),
  imageUrl: z.union([
    z.string().url('Image URL must be a valid URL'),
    z.literal(''),
  ]).optional(),

  // Scoring
  nxt_score: z.union([
    z.string().transform((val) => {
      const num = Number(val);
      return isNaN(num) ? 10 : num;
    }),
    z.number().int().min(0).max(100),
  ]).optional(),

  // Additional fields (allowlisted but not validated)
  revenue: z.union([z.string(), z.number()]).optional(),
  cashflow: z.union([z.string(), z.number()]).optional(),
  askingPrice: z.union([z.string(), z.number()]).optional(),
  assetType: z.string().optional(),
}).refine(
  (data) => {
    // At least one category identifier must be provided
    return !!(
      data.category_id ||
      data.subcategory_id ||
      data.main_category ||
      data.category ||
      data.sub_category ||
      data.subcategory
    );
  },
  {
    message: 'Category or subcategory must be provided',
    path: ['category'],
  }
).refine(
  (data) => {
    // At least one title identifier must be provided
    return !!(data.title || data.businessName);
  },
  {
    message: 'Title or business name must be provided',
    path: ['title'],
  }
);

export type CreateListingInput = z.infer<typeof CreateListingInputSchema>;

