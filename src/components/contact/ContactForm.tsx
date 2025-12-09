'use client';

import { useEffect, useRef } from 'react';
import { useFormState, useFormStatus } from 'react-dom';
import { CheckCircle2, Loader2, Shield } from 'lucide-react';
import { submitContactMessage, type ContactFormState } from '@/app/contact/actions';

const initialState: ContactFormState = { success: false };

export function ContactForm() {
  const formRef = useRef<HTMLFormElement>(null);
  const [state, formAction] = useFormState(submitContactMessage, initialState);

  useEffect(() => {
    if (state.success) {
      formRef.current?.reset();
    }
  }, [state.success]);

  return (
    <div className="bg-white border border-slate-200 rounded-2xl shadow-sm p-6 sm:p-8">
      <div className="space-y-3 mb-6">
        <h3 className="text-2xl font-bold text-slate-900">Send us a note</h3>
        <p className="text-slate-600">We usually reply within one business day.</p>
      </div>

      {state.success && (
        <div className="mb-6 flex items-start gap-3 rounded-lg border border-green-200 bg-green-50 px-4 py-3 text-green-800">
          <CheckCircle2 className="h-5 w-5 mt-0.5" />
          <div>
            <p className="font-semibold">Message received</p>
            <p className="text-sm text-green-900">Thanks for reaching out. We will follow up shortly.</p>
          </div>
        </div>
      )}

      {state.error && !state.success && (
        <div className="mb-6 rounded-lg border border-rose-200 bg-rose-50 px-4 py-3 text-rose-800">
          <p className="font-semibold">Unable to send message</p>
          <p className="text-sm text-rose-900">{state.error}</p>
        </div>
      )}

      <form ref={formRef} action={formAction} className="space-y-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="space-y-2">
            <label className="block text-sm font-semibold text-slate-800" htmlFor="name">
              Name
            </label>
            <input
              id="name"
              name="name"
              required
              className="w-full rounded-lg border border-slate-200 px-4 py-3 text-slate-900 shadow-sm focus:outline-none focus:ring-2 focus:ring-orange-500"
              placeholder="Your name"
              aria-required="true"
            />
          </div>
          <div className="space-y-2">
            <label className="block text-sm font-semibold text-slate-800" htmlFor="email">
              Email
            </label>
            <input
              id="email"
              name="email"
              type="email"
              required
              className="w-full rounded-lg border border-slate-200 px-4 py-3 text-slate-900 shadow-sm focus:outline-none focus:ring-2 focus:ring-orange-500"
              placeholder="you@example.com"
              aria-required="true"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="space-y-2">
            <label className="block text-sm font-semibold text-slate-800" htmlFor="topic">
              Topic
            </label>
            <select
              id="topic"
              name="topic"
              required
              className="w-full rounded-lg border border-slate-200 px-4 py-3 text-slate-900 shadow-sm focus:outline-none focus:ring-2 focus:ring-orange-500"
              aria-required="true"
              defaultValue="support"
            >
              <option value="support">Support</option>
              <option value="sales">Sales</option>
              <option value="partnership">Partnership</option>
              <option value="other">Other</option>
            </select>
          </div>
          <div className="space-y-2">
            <label className="block text-sm font-semibold text-slate-800" htmlFor="subject">
              Subject (optional)
            </label>
            <input
              id="subject"
              name="subject"
              className="w-full rounded-lg border border-slate-200 px-4 py-3 text-slate-900 shadow-sm focus:outline-none focus:ring-2 focus:ring-orange-500"
              placeholder="What do you want to discuss?"
            />
          </div>
        </div>

        <div className="space-y-2">
          <label className="block text-sm font-semibold text-slate-800" htmlFor="message">
            Message
          </label>
          <textarea
            id="message"
            name="message"
            required
            rows={5}
            className="w-full rounded-lg border border-slate-200 px-4 py-3 text-slate-900 shadow-sm focus:outline-none focus:ring-2 focus:ring-orange-500"
            placeholder="Share details about your question or request"
            aria-required="true"
          />
        </div>

        <TrustRow />

        <SubmitButton />
      </form>
    </div>
  );
}

function SubmitButton() {
  const { pending } = useFormStatus();

  return (
    <button
      type="submit"
      className="w-full inline-flex items-center justify-center gap-2 rounded-lg bg-orange-500 px-5 py-3 text-white font-semibold shadow-sm hover:bg-orange-600 transition disabled:opacity-80"
      disabled={pending}
    >
      {pending && <Loader2 className="h-4 w-4 animate-spin" />}
      {pending ? 'Sending...' : 'Send message'}
    </button>
  );
}

function TrustRow() {
  return (
    <div className="flex items-center gap-3 rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 text-sm text-slate-700">
      <Shield className="h-4 w-4 text-green-600" />
      <p>We keep your information secure and only use it to follow up on your request.</p>
    </div>
  );
}
