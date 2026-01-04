'use server';

import { createClient } from '@/utils/supabase/server';
import { revalidatePath } from 'next/cache';
import type { Database } from '@/types/database.types';

export async function createListing(formData: any) {
  const supabase = await createClient();

  // Check for user, but handle anonymous (null) gracefully
  const {
    data: { user },
  } = await supabase.auth.getUser();

  // Extract category and subcategory text
  const categoryText = formData.main_category || formData.category;
  const subcategoryText = formData.sub_category || formData.subcategory;

  // Look up category_id and subcategory_id if provided as text
  let categoryId: string | null = null;
  let subcategoryId: string | null = null;

  // If category_id/subcategory_id are already provided, use them
  if (formData.category_id) {
    categoryId = formData.category_id;
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
  if (formData.subcategory_id) {
    subcategoryId = formData.subcategory_id;
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
    throw new Error('Category is required');
  }
  if (!subcategoryId) {
    throw new Error('Subcategory is required');
  }

  // Build meta_data with fields not in listings_v16 schema
  const metaData: Record<string, any> = {
    description: formData.description,
    location: formData.location,
    founded_year: formData.foundedYear ? Number(formData.foundedYear) : null,
    website_url: formData.websiteUrl || null,
    employee_count: formData.employees ? Number(formData.employees) : null,
    annual_revenue: formData.annual_revenue ? Number(formData.annual_revenue) : null,
    annual_cashflow: formData.annual_cashflow ? Number(formData.annual_cashflow) : null,
    expenses: formData.expenses ? Number(formData.expenses) : null,
    gross_margin: formData.grossMargin ? Number(formData.grossMargin) : null,
    image_url: formData.imageUrl || null,
    nxt_score: formData.nxt_score || 10,
    has_deal_room: true,
    is_verified: false,
  };

  // Build payload with only valid listings table fields
  // TypeScript now knows categoryId and subcategoryId are string (not null) after guards
  const payload: Database["public"]["Tables"]["listings"]["Insert"] = {
    title: formData.title || formData.businessName || '',
    asset_type: formData.asset_type || 'operational',
    category_id: categoryId, // Type narrowed to string
    subcategory_id: subcategoryId, // Type narrowed to string
    asking_price: formData.asking_price ? Number(formData.asking_price) : null,
    owner_id: user?.id || null,
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
    throw new Error(error.message || 'Database rejected the insert');
  }

  revalidatePath('/browse');
  return { success: true, listingId: data.id };
}
