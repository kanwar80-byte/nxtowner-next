'use server';

import { supabase } from '@/lib/supabase';

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
    const profileId = user?.id ?? null;

    const { error } = await supabase
      .from('contact_messages')
      // @ts-ignore - table not yet in generated types
      .insert({
        profile_id: profileId,
        name,
        email,
        topic,
        subject,
        message,
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
