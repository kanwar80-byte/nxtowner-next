import "server-only";

import { createClient } from '@/utils/supabase/server';
import type { DealDocument, DocType } from '@/types/deal';

/**
 * Repository for Deal Document operations
 * 
 * TODO: Ensure the following table exists in Supabase:
 * - deal_documents (id, deal_id, file_path, file_name, doc_type, created_at, uploaded_by, file_size)
 */

/**
 * Get all documents for a deal
 */
export async function getDealDocuments(dealId: string): Promise<DealDocument[]> {
  const supabase = await createClient();
  
  // TODO: Implement actual database query when deal_documents table exists
  // const { data, error } = await supabase
  //   .from('deal_documents')
  //   .select('*')
  //   .eq('deal_id', dealId)
  //   .order('created_at', { ascending: false });
  //
  // if (error) {
  //   console.error('Error fetching deal documents:', error);
  //   return [];
  // }
  //
  // return (data || []) as DealDocument[];
  
  // Mock empty array for skeleton
  return [];
}

/**
 * Upload a document (creates record and uploads file to Supabase Storage)
 */
export async function uploadDealDocument(
  dealId: string,
  file: File,
  docType: DocType,
  uploadedBy: string
): Promise<{ success: boolean; document?: DealDocument; error?: string }> {
  const supabase = await createClient();
  
  // TODO: Implement actual file upload and database insert when deal_documents table exists
  // 1. Upload file to Supabase Storage bucket 'deal-documents'
  // 2. Create record in deal_documents table
  // 
  // const fileExt = file.name.split('.').pop();
  // const fileName = `${dealId}/${Date.now()}.${fileExt}`;
  // const filePath = `deal-documents/${fileName}`;
  //
  // const { data: uploadData, error: uploadError } = await supabase.storage
  //   .from('deal-documents')
  //   .upload(filePath, file);
  //
  // if (uploadError) {
  //   return { success: false, error: uploadError.message };
  // }
  //
  // const { data, error } = await supabase
  //   .from('deal_documents')
  //   .insert({
  //     deal_id: dealId,
  //     file_path: filePath,
  //     file_name: file.name,
  //     doc_type: docType,
  //     uploaded_by: uploadedBy,
  //     file_size: file.size,
  //   })
  //   .select()
  //   .single();
  //
  // if (error || !data) {
  //   return { success: false, error: error?.message || 'Failed to create document record' };
  // }
  //
  // return { success: true, document: data as DealDocument };
  
  return { success: false, error: 'Database table not yet implemented' };
}

/**
 * Delete a deal document
 */
export async function deleteDealDocument(
  documentId: string,
  dealId: string
): Promise<{ success: boolean; error?: string }> {
  const supabase = await createClient();
  
  // TODO: Implement actual file deletion and database delete when deal_documents table exists
  // 1. Get document to find file_path
  // 2. Delete from storage
  // 3. Delete from database
  //
  // const { data: doc, error: fetchError } = await supabase
  //   .from('deal_documents')
  //   .select('file_path')
  //   .eq('id', documentId)
  //   .eq('deal_id', dealId)
  //   .single();
  //
  // if (fetchError || !doc) {
  //   return { success: false, error: 'Document not found' };
  // }
  //
  // await supabase.storage.from('deal-documents').remove([doc.file_path]);
  //
  // const { error } = await supabase
  //   .from('deal_documents')
  //   .delete()
  //   .eq('id', documentId)
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
 * Get a signed URL for a document (for viewing/downloading)
 */
export async function getDocumentSignedUrl(
  filePath: string,
  expiresIn: number = 3600
): Promise<{ url: string | null; error?: string }> {
  const supabase = await createClient();
  
  // TODO: Implement actual signed URL generation when storage is set up
  // const { data, error } = await supabase.storage
  //   .from('deal-documents')
  //   .createSignedUrl(filePath, expiresIn);
  //
  // if (error) {
  //   return { url: null, error: error.message };
  // }
  //
  // return { url: data.signedUrl };
  
  return { url: null, error: 'Storage bucket not yet configured' };
}
