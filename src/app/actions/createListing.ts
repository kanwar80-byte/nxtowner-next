'use server';

import { createClient } from '@/utils/supabase/server';
import { revalidatePath } from 'next/cache';
import type { Database } from '@/types/database.types';
import { CreateListingInputSchema } from '@/lib/validation/listing.schemas';

/**
 * Helper: Convert FormData to plain object with allowlisted keys
 */
function formDataToObject(formData: FormData): Record<string, unknown> {
  const allowedKeys = [
    'category_id',
    'subcategory_id',
    'main_category',
    'category',
    'sub_category',
    'subcategory',
    'title',
    'businessName',
    'asset_type',
    'assetType',
    'description',
    'location',
    'asking_price',
    'askingPrice',
    'annual_revenue',
    'annual_cashflow',
    'expenses',
    'grossMargin',
    'foundedYear',
    'employees',
    'websiteUrl',
    'imageUrl',
    'nxt_score',
    'revenue',
    'cashflow',
  ];

  const obj: Record<string, unknown> = {};
  for (const key of allowedKeys) {
    const value = formData.get(key);
    if (value !== null) {
      obj[key] = value;
    }
  }
  return obj;
}

/**
 * Helper: Coerce numeric strings to numbers safely
 */
function coerceNumber(value: unknown): number | null {
  if (typeof value === 'number') return value;
  if (typeof value === 'string') {
    const num = Number(value);
    return isNaN(num) ? null : num;
  }
  return null;
}

export async function createListing(
  formData: FormData | unknown
): Promise<{ success: boolean; listingId?: string; error?: string; details?: Array<{ path: string; message: string }> }> {
  const supabase = await createClient();

  // Check for user, but handle anonymous (null) gracefully
  const {
    data: { user },
  } = await supabase.auth.getUser();

  // Convert FormData to object if needed
  let rawInput: unknown;
  if (formData instanceof FormData) {
    rawInput = formDataToObject(formData);
  } else {
    rawInput = formData;
  }

  // Validate input with Zod
  const validationResult = CreateListingInputSchema.safeParse(rawInput);
  if (!validationResult.success) {
    return {
      success: false,
      error: 'Validation failed',
      details: validationResult.error.errors.map((err) => ({
        path: err.path.join('.'),
        message: err.message,
      })),
    };
  }

  const validatedData = validationResult.data;

  // Extract category and subcategory text
  const categoryText = validatedData.main_category || validatedData.category;
  const subcategoryText = validatedData.sub_category || validatedData.subcategory;

  // Look up category_id and subcategory_id if provided as text
  let categoryId: string | null = null;
  let subcategoryId: string | null = null;

  // If category_id/subcategory_id are already provided, use them
  if (validatedData.category_id) {
    categoryId = validatedData.category_id;
  } else if (categoryText) {
    // Look up category by name
    const { data: category } = await supabase
      .from('categories')
      .select('id')
      .eq('name', categoryText)
      .maybeSingle();
    categoryId = category?.id || null;
  }

  // If subcategory_id is already provided, use it
  if (validatedData.subcategory_id) {
    subcategoryId = validatedData.subcategory_id;
  } else if (subcategoryText && categoryId) {
    // Look up subcategory by name and category_id
    const { data: subcategory } = await supabase
      .from('subcategories')
      .select('id')
      .eq('name', subcategoryText)
      .eq('category_id', categoryId)
      .maybeSingle();
    subcategoryId = subcategory?.id || null;
  }

  // Runtime guards: ensure category_id and subcategory_id are resolved
  if (!categoryId) {
    return {
      success: false,
      error: 'Category is required',
      details: [{ path: 'category', message: 'Category could not be resolved from provided data' }],
    };
  }
  if (!subcategoryId) {
    return {
      success: false,
      error: 'Subcategory is required',
      details: [{ path: 'subcategory', message: 'Subcategory could not be resolved from provided data' }],
    };
  }

  // Build meta_data with fields not in listings_v16 schema (allowlisted fields only)
  const metaData: Record<string, unknown> = {
    description: validatedData.description || null,
    location: validatedData.location || null,
    founded_year: validatedData.foundedYear ?? null,
    website_url: validatedData.websiteUrl && validatedData.websiteUrl !== '' ? validatedData.websiteUrl : null,
    employee_count: validatedData.employees ?? null,
    annual_revenue: validatedData.annual_revenue ?? validatedData.revenue ?? null,
    annual_cashflow: validatedData.annual_cashflow ?? validatedData.cashflow ?? null,
    expenses: validatedData.expenses ?? null,
    gross_margin: validatedData.grossMargin ?? null,
    image_url: validatedData.imageUrl && validatedData.imageUrl !== '' ? validatedData.imageUrl : null,
    nxt_score: validatedData.nxt_score ?? 10,
    has_deal_room: true,
    is_verified: false,
  };

  // Determine asset_type (handle both snake_case and camelCase)
  const assetType = validatedData.asset_type || 
                    (validatedData.assetType?.toLowerCase() === 'digital' ? 'digital' : 'operational');

  // Determine title (handle both field names)
  const title = validatedData.title || validatedData.businessName || '';

  // Coerce asking_price (handle both field names and types)
  const askingPrice = validatedData.asking_price ?? 
                      (validatedData.askingPrice ? coerceNumber(validatedData.askingPrice) : null);

  // Build payload with only valid listings table fields
  // TypeScript now knows categoryId and subcategoryId are string (not null) after guards
  const payload: Database["public"]["Tables"]["listings"]["Insert"] = {
    title,
    asset_type: assetType,
    category_id: categoryId, // Type narrowed to string
    subcategory_id: subcategoryId, // Type narrowed to string
    asking_price: askingPrice,
    owner_id: user?.id || null, // Always from auth, never from form
    status: 'draft',
    meta_data: metaData,
    currency: 'CAD',
    listing_tier: 'standard',
    verification_level: 'unverified',
    is_remote: false,
    visibility_boost: false,
    views_count: 0,
    saves_count: 0,
    nda_requests_count: 0,
    loi_interest_count: 0,
    ai: {},
    meta_digital: {},
    meta_operational: {},
  };

  console.log('Saving to DB:', payload); // Debug log

  const { data, error } = await supabase
    .from('listings')
    .insert(payload)
    .select()
    .single();

  if (error) {
    console.error('Supabase Insert Error:', error);
    return {
      success: false,
      error: error.message || 'Database rejected the insert',
      details: [{ path: 'database', message: error.message || 'Insert failed' }],
    };
  }

  revalidatePath('/browse');
  return { success: true, listingId: data.id };
}
