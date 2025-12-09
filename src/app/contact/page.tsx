import type { Metadata } from 'next';
import { Mail, Phone, MessageSquare, Headset, ShieldCheck } from 'lucide-react';
import { ContactForm } from '@/components/contact/ContactForm';

export const metadata: Metadata = {
  title: 'Contact NxtOwner',
  description: 'Get in touch with the NxtOwner team for sales, support, or partnerships.',
};

const contactOptions = [
  {
    title: 'Sales & product questions',
    detail: 'Understand plans, Deal Rooms, AI search, and onboarding.',
    action: 'sales@nxtowner.ca',
    icon: Mail,
  },
  {
    title: 'Support',
    detail: 'Need help with your account, listings, NDAs, or dashboards?',
    action: 'support@nxtowner.ca',
    icon: Headset,
  },
  {
    title: 'Partnerships',
    detail: 'Brokerages, lenders, CPAs, and legal partners looking to collaborate.',
    action: 'partners@nxtowner.ca',
    icon: MessageSquare,
  },
];

export default function ContactPage() {
  return (
    <main className="bg-white">
      <section className="w-full bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 text-white py-20 sm:py-28 px-4">
        <div className="max-w-5xl mx-auto text-center space-y-5">
          <div className="inline-flex items-center gap-2 rounded-full bg-white/10 px-4 py-2 text-sm font-semibold text-slate-100">
            <ShieldCheck className="h-4 w-4" />
            Contact NxtOwner
          </div>
          <h1 className="text-4xl sm:text-5xl font-bold leading-tight">Talk to the team</h1>
          <p className="text-lg sm:text-xl text-slate-200 max-w-3xl mx-auto">
            Have a question about buying, selling, or partnering? Share details and we will route it to the right person.
          </p>
        </div>
      </section>

      <section className="w-full py-16 px-4 bg-white">
        <div className="max-w-6xl mx-auto space-y-12">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {contactOptions.map((option) => (
              <div
                key={option.title}
                className="rounded-2xl border border-slate-200 bg-slate-50 p-6 shadow-sm hover:shadow-md transition"
              >
                <div className="flex items-center gap-3 mb-4">
                  <option.icon className="h-6 w-6 text-orange-500" />
                  <h3 className="text-xl font-semibold text-slate-900">{option.title}</h3>
                </div>
                <p className="text-slate-700 mb-3">{option.detail}</p>
                <p className="text-sm font-semibold text-slate-900">{option.action}</p>
              </div>
            ))}
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-10 items-start">
            <div className="lg:col-span-2">
              <ContactForm />
            </div>

            <div className="space-y-4 rounded-2xl border border-slate-200 bg-slate-50 p-6 shadow-sm">
              <h3 className="text-xl font-semibold text-slate-900">What to include</h3>
              <ul className="space-y-3 text-slate-700 text-sm leading-relaxed">
                <li className="flex gap-2"><Mail className="h-4 w-4 text-orange-500 mt-0.5" />Your role and company (buyer, seller, partner).</li>
                <li className="flex gap-2"><MessageSquare className="h-4 w-4 text-orange-500 mt-0.5" />Deal context: listing link, asset type, region, timeline.</li>
                <li className="flex gap-2"><Phone className="h-4 w-4 text-orange-500 mt-0.5" />Best way to reach you and preferred time.</li>
              </ul>
              <div className="flex items-start gap-3 rounded-lg border border-slate-200 bg-white px-4 py-3 text-sm text-slate-700">
                <ShieldCheck className="h-4 w-4 text-green-600 mt-0.5" />
                <p>We keep your message private. No marketing blasts - just a relevant follow-up.</p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
