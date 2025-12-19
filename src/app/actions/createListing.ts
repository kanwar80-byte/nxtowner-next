'use server';

import { createClient } from '@/utils/supabase/server';
import { revalidatePath } from 'next/cache';

export async function createListing(formData: any) {
  const supabase = await createClient();

  // Check for user, but handle anonymous (null) gracefully
  const {
    data: { user },
  } = await supabase.auth.getUser();

  // Map the new "Taxonomy" fields correctly
  const listingData = {
    title: formData.title || formData.businessName, // Handle both naming conventions

    // --- NEW TAXONOMY FIELDS ---
    asset_type: formData.asset_type || 'Operational',
    main_category: formData.main_category,
    sub_category: formData.sub_category,
    category: formData.main_category, // Keep 'category' as a fallback for old components

    // --- FINANCIALS & DETAILS ---
    location: formData.location,
    asking_price: Number(formData.asking_price) || 0,
    annual_revenue: Number(formData.annual_revenue) || 0,
    annual_cashflow: Number(formData.annual_cashflow) || 0,
    description: formData.description,

    // --- SCORING & META ---
    nxt_score: formData.nxt_score || 50,
    has_deal_room: true,
    is_verified: false,
    status: 'active',
    owner_id: user?.id || null,
  };

  console.log('Saving to DB:', listingData); // Debug log

  const { data, error } = await supabase
    .from('listings')
    .insert(listingData)
    .select()
    .single();

  if (error) {
    console.error('Supabase Insert Error:', error);
    throw new Error(error.message || 'Database rejected the insert');
  }

  revalidatePath('/browse');
  return { success: true, listingId: data.id };
}
