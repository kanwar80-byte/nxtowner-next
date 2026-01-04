'use server';

import { supabase } from '@/utils/supabase/client';

export type ContactFormState = {
  success: boolean;
  error?: string;
};

const allowedTopics = new Set(['support', 'sales', 'partnership', 'other']);

export async function submitContactMessage(
  _prevState: ContactFormState,
  formData: FormData
): Promise<ContactFormState> {
  try {
    const name = (formData.get('name') || '').toString().trim();
    const email = (formData.get('email') || '').toString().trim();
    const topic = (formData.get('topic') || '').toString().trim();
    const subjectRaw = formData.get('subject');
    const message = (formData.get('message') || '').toString().trim();

    if (!name || !email || !topic || !message) {
      return { success: false, error: 'Please fill in all required fields.' };
    }

    if (!allowedTopics.has(topic)) {
      return { success: false, error: 'Please choose a valid topic.' };
    }

    const subject = subjectRaw ? subjectRaw.toString().trim() || null : null;

    const { data: { user } } = await supabase.auth.getUser();

    // Use leads table - store contact form data in deal_title and use email/full_name
    // For contact form, we use a placeholder deal_id since leads requires it
    // In production, you might want a separate contact_messages table or use a system deal_id
    const { error } = await supabase
      .from('leads')
      .insert({
        deal_id: 'contact-form', // Placeholder - in production use a real deal_id or create contact_messages table
        deal_title: subject || `${topic} - ${name}`,
        email,
        full_name: name,
        phone: null,
        buyer_type: topic,
        status: 'new',
      });

    if (error) throw error;

    return { success: true };
  } catch (error) {
    console.error('submitContactMessage error:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to submit message.',
    };
  }
}
