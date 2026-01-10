import "server-only";

import { createClient } from '@/utils/supabase/server';
import type { DealPartner, PartnerRole, PartnerStatus } from '@/types/deal';

/**
 * Repository for Deal Partner operations
 * 
 * TODO: Ensure the following table exists in Supabase:
 * - deal_partners (id, deal_id, partner_id, role, status, created_at, updated_at)
 * - partners table should exist (id, name, email, company, etc.)
 */

/**
 * Get all partners for a deal
 */
export async function getDealPartners(dealId: string): Promise<DealPartner[]> {
  const supabase = await createClient();
  
  // TODO: Implement actual database query when deal_partners table exists
  // const { data, error } = await supabase
  //   .from('deal_partners')
  //   .select(`
  //     *,
  //     partner:partners(id, name, email, company)
  //   `)
  //   .eq('deal_id', dealId)
  //   .order('created_at', { ascending: false });
  //
  // if (error) {
  //   console.error('Error fetching deal partners:', error);
  //   return [];
  // }
  //
  // return (data || []) as DealPartner[];
  
  // Mock empty array for skeleton
  return [];
}

/**
 * Add a partner to a deal
 */
export async function addDealPartner(
  dealId: string,
  partnerId: string,
  role: PartnerRole
): Promise<{ success: boolean; partner?: DealPartner; error?: string }> {
  const supabase = await createClient();
  
  // TODO: Implement actual database insert when deal_partners table exists
  // const { data, error } = await supabase
  //   .from('deal_partners')
  //   .insert({
  //     deal_id: dealId,
  //     partner_id: partnerId,
  //     role,
  //     status: 'pending',
  //   })
  //   .select('*, partner:partners(id, name, email, company)')
  //   .single();
  //
  // if (error || !data) {
  //   return { success: false, error: error?.message || 'Failed to add partner' };
  // }
  //
  // return { success: true, partner: data as DealPartner };
  
  return { success: false, error: 'Database table not yet implemented' };
}

/**
 * Update a partner's role or status
 */
export async function updateDealPartner(
  partnerId: string,
  dealId: string,
  updates: {
    role?: PartnerRole;
    status?: PartnerStatus;
  }
): Promise<{ success: boolean; error?: string }> {
  const supabase = await createClient();
  
  // TODO: Implement actual database update when deal_partners table exists
  // const { error } = await supabase
  //   .from('deal_partners')
  //   .update({
  //     ...updates,
  //     updated_at: new Date().toISOString(),
  //   })
  //   .eq('id', partnerId)
  //   .eq('deal_id', dealId);
  //
  // if (error) {
  //   return { success: false, error: error.message };
  // }
  //
  // return { success: true };
  
  return { success: false, error: 'Database table not yet implemented' };
}

/**
 * Remove a partner from a deal
 */
export async function removeDealPartner(
  partnerId: string,
  dealId: string
): Promise<{ success: boolean; error?: string }> {
  const supabase = await createClient();
  
  // TODO: Implement actual database delete when deal_partners table exists
  // const { error } = await supabase
  //   .from('deal_partners')
  //   .delete()
  //   .eq('id', partnerId)
  //   .eq('deal_id', dealId);
  //
  // if (error) {
  //   return { success: false, error: error.message };
  // }
  //
  // return { success: true };
  
  return { success: false, error: 'Database table not yet implemented' };
}
