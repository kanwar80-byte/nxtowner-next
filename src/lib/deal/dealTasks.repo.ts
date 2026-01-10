import "server-only";

import { createClient } from '@/utils/supabase/server';
import type { DealTask, TaskStatus } from '@/types/deal';

/**
 * Repository for Deal Task operations
 * 
 * TODO: Ensure the following table exists in Supabase:
 * - deal_tasks (id, deal_id, title, description, status, due_date, created_at, updated_at, assigned_to)
 */

/**
 * Get all tasks for a deal
 */
export async function getDealTasks(dealId: string): Promise<DealTask[]> {
  const supabase = await createClient();
  
  // TODO: Implement actual database query when deal_tasks table exists
  // const { data, error } = await supabase
  //   .from('deal_tasks')
  //   .select('*')
  //   .eq('deal_id', dealId)
  //   .order('created_at', { ascending: false });
  //
  // if (error) {
  //   console.error('Error fetching deal tasks:', error);
  //   return [];
  // }
  //
  // return (data || []) as DealTask[];
  
  // Mock empty array for skeleton
  return [];
}

/**
 * Create a new task
 */
export async function createDealTask(
  dealId: string,
  task: {
    title: string;
    description?: string;
    due_date?: string | null;
    assigned_to?: string | null;
  }
): Promise<{ success: boolean; task?: DealTask; error?: string }> {
  const supabase = await createClient();
  
  // TODO: Implement actual database insert when deal_tasks table exists
  // const { data, error } = await supabase
  //   .from('deal_tasks')
  //   .insert({
  //     deal_id: dealId,
  //     title: task.title,
  //     description: task.description || null,
  //     status: 'pending',
  //     due_date: task.due_date || null,
  //     assigned_to: task.assigned_to || null,
  //   })
  //   .select()
  //   .single();
  //
  // if (error || !data) {
  //   return { success: false, error: error?.message || 'Failed to create task' };
  // }
  //
  // return { success: true, task: data as DealTask };
  
  return { success: false, error: 'Database table not yet implemented' };
}

/**
 * Update a task
 */
export async function updateDealTask(
  taskId: string,
  dealId: string,
  updates: {
    title?: string;
    description?: string;
    status?: TaskStatus;
    due_date?: string | null;
    assigned_to?: string | null;
  }
): Promise<{ success: boolean; error?: string }> {
  const supabase = await createClient();
  
  // TODO: Implement actual database update when deal_tasks table exists
  // const { error } = await supabase
  //   .from('deal_tasks')
  //   .update({
  //     ...updates,
  //     updated_at: new Date().toISOString(),
  //   })
  //   .eq('id', taskId)
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
 * Delete a task
 */
export async function deleteDealTask(
  taskId: string,
  dealId: string
): Promise<{ success: boolean; error?: string }> {
  const supabase = await createClient();
  
  // TODO: Implement actual database delete when deal_tasks table exists
  // const { error } = await supabase
  //   .from('deal_tasks')
  //   .delete()
  //   .eq('id', taskId)
  //   .eq('deal_id', dealId);
  //
  // if (error) {
  //   return { success: false, error: error.message };
  // }
  //
  // return { success: true };
  
  return { success: false, error: 'Database table not yet implemented' };
}
