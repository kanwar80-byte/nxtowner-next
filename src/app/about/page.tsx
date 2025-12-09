import type { Metadata } from 'next';
import Link from 'next/link';
import { Shield, BadgeCheck, Workflow, Users, Target, Lock, Sparkles, Handshake, Compass } from 'lucide-react';

export const metadata: Metadata = {
  title: 'About NxtOwner – A Deal-First Business Marketplace',
  description:
    'Learn how NxtOwner connects buyers, sellers, and partners with AI tools, NDAs, and Deal Rooms for a complete end-to-end deal workflow.',
};

export default function AboutPage() {
  return (
    <main className="bg-white">
      {/* Hero */}
      <section className="w-full bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 text-white py-20 px-4 sm:py-28">
        <div className="max-w-4xl mx-auto text-center space-y-6">
          <h1 className="text-4xl sm:text-5xl font-bold leading-tight">About NxtOwner</h1>
          <p className="text-lg sm:text-xl text-slate-300 max-w-3xl mx-auto">
            A modern marketplace for serious buyers, sellers, and deal professionals.
          </p>
          <p className="text-base sm:text-lg text-slate-200 max-w-3xl mx-auto">
            Built for real-world businesses and digital assets, with AI tools and structured workflows to keep deals moving and informed.
          </p>
        </div>
      </section>

      {/* What is NxtOwner */}
      <section className="w-full py-16 px-4 bg-white">
        <div className="max-w-4xl mx-auto space-y-6">
          <h2 className="text-3xl sm:text-4xl font-bold text-slate-900">What is NxtOwner?</h2>
          <div className="space-y-4 text-lg text-slate-700 leading-relaxed">
            <p>
              NxtOwner connects qualified buyers, motivated sellers, and professional partners (brokers, CPAs, lawyers, lenders) around vetted listings. It brings every stage of the deal into one place so you spend less time chasing emails and more time making decisions.
            </p>
            <p>
              The platform combines a marketplace of physical and digital businesses with AI-powered discovery and valuation insights, plus deal tools like NDAs, Deal Rooms, and lead tracking to keep everyone aligned from first search to final signature.
            </p>
          </div>
        </div>
      </section>

      {/* Who it's for */}
      <section className="w-full py-16 px-4 bg-slate-50">
        <div className="max-w-6xl mx-auto space-y-10">
          <div className="text-center space-y-3">
            <h2 className="text-3xl sm:text-4xl font-bold text-slate-900">Who NxtOwner is for</h2>
            <p className="text-lg text-slate-600">Clear value for buyers, sellers, and the partners who help close great deals.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                title: 'Buyers',
                bullets: [
                  'Discover asset and digital deals that match your criteria.',
                  'Use AI search and valuation to filter and sanity-check opportunities.',
                  'Track deals, NDAs, and offers from a single dashboard.',
                ],
                icon: <Target className="w-8 h-8 text-orange-500" />,
              },
              {
                title: 'Sellers',
                bullets: [
                  'Create and submit listings for review.',
                  'Qualify buyer interest via Requests for Info and NDAs.',
                  'Use Deal Rooms and partner support to get to a clean closing.',
                ],
                icon: <Handshake className="w-8 h-8 text-green-600" />,
              },
              {
                title: 'Partners',
                bullets: [
                  'Build a Partner profile and appear in the directory.',
                  'Receive consultation leads directly from buyers and sellers.',
                  'Stay connected to active deals and clients.',
                ],
                icon: <Users className="w-8 h-8 text-blue-600" />,
              },
            ].map((item) => (
              <div key={item.title} className="bg-white border border-slate-200 rounded-lg p-6 shadow-sm">
                <div className="flex items-center gap-3 mb-4">
                  {item.icon}
                  <h3 className="text-xl font-semibold text-slate-900">{item.title}</h3>
                </div>
                <ul className="space-y-2 text-slate-700">
                  {item.bullets.map((bullet) => (
                    <li key={bullet} className="flex items-start gap-2">
                      <span className="mt-1 h-2 w-2 rounded-full bg-orange-500" />
                      <span>{bullet}</span>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How the platform fits together */}
      <section className="w-full py-16 px-4 bg-white">
        <div className="max-w-5xl mx-auto space-y-10">
          <div className="text-center space-y-3">
            <h2 className="text-3xl sm:text-4xl font-bold text-slate-900">How the platform fits together</h2>
            <p className="text-lg text-slate-600">A simple flow that mirrors how real deals move.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            {[
              {
                step: 1,
                title: 'List & discover',
                description: 'Sellers publish approved listings; buyers use filters and AI search to find the right fit.',
              },
              {
                step: 2,
                title: 'Qualify interest',
                description: 'Request Info flows into seller dashboards as leads so you can prioritize conversations.',
              },
              {
                step: 3,
                title: 'Protect with NDAs',
                description: 'NDA signing gates access to confidential documents and Deal Rooms.',
              },
              {
                step: 4,
                title: 'Collaborate & close',
                description: 'Deal Rooms host messages, offers, and partner support until the agreement is signed.',
              },
            ].map((item) => (
              <div key={item.step} className="bg-slate-50 border border-slate-200 rounded-lg p-6 text-left hover:shadow-md transition">
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-10 h-10 rounded-full bg-orange-500 text-white font-bold flex items-center justify-center">
                    {item.step}
                  </div>
                  <h3 className="text-xl font-semibold text-slate-900">{item.title}</h3>
                </div>
                <p className="text-slate-700 leading-relaxed">{item.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Why NxtOwner is different */}
      <section className="w-full py-16 px-4 bg-slate-50">
        <div className="max-w-5xl mx-auto space-y-10">
          <div className="text-center space-y-3">
            <h2 className="text-3xl sm:text-4xl font-bold text-slate-900">Why NxtOwner is different</h2>
            <p className="text-lg text-slate-600">Practical advantages for real operators and advisors.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {[
              {
                icon: <Compass className="w-8 h-8 text-orange-500" />,
                title: 'Built for real operators',
                description:
                  'Supports gas stations, QSRs, retail, car wash, SaaS, e-commerce, and more—physical and digital deals side by side.',
              },
              {
                icon: <Sparkles className="w-8 h-8 text-orange-500" />,
                title: 'AI-assisted, not AI-replacing',
                description:
                  'AI search and NexusAI valuation help you interpret deals; humans still make the calls that matter.',
              },
              {
                icon: <Workflow className="w-8 h-8 text-orange-500" />,
                title: 'Deal workflow included',
                description:
                  'NDAs, Deal Rooms, partner integrations, and lead tracking are built into the platform, not bolted on.',
              },
              {
                icon: <BadgeCheck className="w-8 h-8 text-orange-500" />,
                title: 'Verification & structure',
                description:
                  'Admin review of listings, AI-Verified badges, and approved partner profiles add trust and clarity.',
              },
            ].map((item, idx) => (
              <div key={idx} className="bg-white border border-slate-200 rounded-lg p-8 hover:shadow-md transition">
                <div className="flex items-start gap-4">
                  <div className="flex-shrink-0">{item.icon}</div>
                  <div>
                    <h3 className="text-xl font-semibold text-slate-900 mb-2">{item.title}</h3>
                    <p className="text-slate-700 leading-relaxed">{item.description}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Our principles */}
      <section className="w-full py-16 px-4 bg-white">
        <div className="max-w-5xl mx-auto space-y-8">
          <div className="text-center space-y-3">
            <h2 className="text-3xl sm:text-4xl font-bold text-slate-900">Our principles</h2>
            <p className="text-lg text-slate-600">How we think about deals and the people behind them.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              {
                title: 'Clarity over hype',
                description: 'Straightforward information, transparent flows, and structured data so everyone stays aligned.',
                icon: <Shield className="w-7 h-7 text-green-600" />,
              },
              {
                title: 'Safety and compliance',
                description: 'Respect for NDAs, regulatory context, and professional advice built into the workflow.',
                icon: <Lock className="w-7 h-7 text-green-600" />,
              },
              {
                title: 'Operator-focused',
                description: 'Designed for people actually running businesses—not just flipping assets.',
                icon: <Users className="w-7 h-7 text-green-600" />,
              },
            ].map((item) => (
              <div key={item.title} className="bg-slate-50 border border-slate-200 rounded-lg p-6">
                <div className="flex items-center gap-3 mb-3">
                  {item.icon}
                  <h3 className="text-xl font-semibold text-slate-900">{item.title}</h3>
                </div>
                <p className="text-slate-700 leading-relaxed">{item.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="w-full py-16 px-4 bg-gradient-to-r from-slate-900 to-slate-800 text-white">
        <div className="max-w-4xl mx-auto text-center space-y-8">
          <div>
            <h2 className="text-3xl sm:text-4xl font-bold mb-4">Ready to explore your next deal?</h2>
            <p className="text-lg text-slate-300 max-w-2xl mx-auto">
              Browse live opportunities, list your business, or connect with partners to move faster.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/browse"
              className="inline-block px-8 py-3 bg-orange-500 text-white font-semibold rounded-lg hover:bg-orange-600 transition"
            >
              Browse active listings
            </Link>
            <Link
              href="/sell"
              className="inline-block px-8 py-3 bg-white text-slate-900 font-semibold rounded-lg hover:bg-slate-100 transition"
            >
              List your business
            </Link>
            <Link
              href="/partners"
              className="inline-block px-8 py-3 border border-white/40 text-white font-semibold rounded-lg hover:bg-white hover:text-slate-900 transition"
            >
              Find a partner
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}
