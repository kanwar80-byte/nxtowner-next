import Link from 'next/link';
import { CheckCircle, TrendingUp, Shield, Zap, Globe } from 'lucide-react';

export const metadata = {
  title: 'How NxtOwner Works – Buyers, Sellers & Partners',
  description: 'See how NxtOwner guides buyers, sellers, and professional partners from search to signed deal with NDAs, Deal Rooms, and AI-powered tools.',
};

export default function HowItWorksPage() {
  return (
    <main className="bg-white">
      {/* ============================================================================
          HERO SECTION
          ============================================================================ */}
      <section className="w-full bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 text-white py-20 px-4 sm:py-32">
        <div className="max-w-4xl mx-auto text-center space-y-6">
          <h1 className="text-4xl sm:text-5xl font-bold leading-tight">
            How NxtOwner Works
          </h1>
          <p className="text-lg sm:text-xl text-slate-300 max-w-2xl mx-auto">
            From first search to final signature, NxtOwner gives buyers, sellers, and partners a single place to run the full deal.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center pt-4">
            <Link
              href="/browse"
              className="inline-block px-8 py-3 bg-orange-500 text-white font-semibold rounded-lg hover:bg-orange-600 transition"
            >
              Browse listings
            </Link>
            <Link
              href="/sell"
              className="inline-block px-8 py-3 bg-white text-slate-900 font-semibold rounded-lg hover:bg-slate-100 transition"
            >
              Sell your business
            </Link>
          </div>
        </div>
      </section>

      {/* ============================================================================
          BUYER JOURNEY SECTION
          ============================================================================ */}
      <section className="w-full py-20 px-4 bg-white">
        <div className="max-w-5xl mx-auto space-y-12">
          <div>
            <h2 className="text-3xl sm:text-4xl font-bold text-slate-900 mb-4">
              For Buyers – From search to signed deal
            </h2>
            <p className="text-lg text-slate-600 mb-12">
              Follow the buyer journey step-by-step through NxtOwner&apos;s platform.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              {
                step: 1,
                title: 'Create your account',
                description:
                  'Sign up and complete your profile as a Buyer. Set your preferences and get ready to discover opportunities.',
              },
              {
                step: 2,
                title: 'Browse & use AI search',
                description:
                  'Use filters and AI-powered search on /browse to find asset or digital businesses that match your criteria.',
              },
              {
                step: 3,
                title: 'Save and track opportunities',
                description:
                  'Save listings to your watchlist using the heart icon. Keep track of your top prospects all in one place.',
              },
              {
                step: 4,
                title: 'Request information',
                description:
                  'Use "Express Interest" on a listing to send a lead to the seller and start conversations.',
              },
              {
                step: 5,
                title: 'Sign NDA & enter Deal Room',
                description:
                  'When the seller grants access, sign an NDA and move into a private Deal Room for documents and messages.',
              },
              {
                step: 6,
                title: 'Make offers & close',
                description:
                  'Use the Deal Room to exchange messages and make offers until the deal is agreed and signed.',
              },
            ].map((item) => (
              <div
                key={item.step}
                className="bg-slate-50 border border-slate-200 rounded-lg p-6 hover:shadow-md transition"
              >
                <div className="flex items-start gap-4">
                  <div className="flex-shrink-0 w-10 h-10 bg-orange-500 text-white rounded-full flex items-center justify-center font-bold text-lg">
                    {item.step}
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold text-slate-900 mb-2">
                      {item.title}
                    </h3>
                    <p className="text-slate-600 leading-relaxed">
                      {item.description}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ============================================================================
          SELLER JOURNEY SECTION
          ============================================================================ */}
      <section className="w-full py-20 px-4 bg-slate-50">
        <div className="max-w-5xl mx-auto space-y-12">
          <div>
            <h2 className="text-3xl sm:text-4xl font-bold text-slate-900 mb-4">
              For Sellers – List, qualify, and close
            </h2>
            <p className="text-lg text-slate-600 mb-12">
              Take your business to market and manage the entire sales process with qualified buyers.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              {
                step: 1,
                title: 'Create a Seller account',
                description:
                  'Sign up and get your Seller profile created. Verify your identity and set up your payment details.',
              },
              {
                step: 2,
                title: 'Create your listing',
                description:
                  'Use the Sell flow to enter details, financials, metrics, and upload key information about your business.',
              },
              {
                step: 3,
                title: 'Submit for review',
                description:
                  'Your listing goes to "Pending Review" for basic checks and AI verification of your business details.',
              },
              {
                step: 4,
                title: 'Go live on the marketplace',
                description:
                  'Once approved, your listing appears for Buyers in /browse and in AI search results across the platform.',
              },
              {
                step: 5,
                title: 'Receive leads & manage interest',
                description:
                  'Buyers can express interest via "Request Info". See all buyer leads in your Seller dashboard and track conversations.',
              },
              {
                step: 6,
                title: 'Use NDA & Deal Rooms to qualify buyers',
                description:
                  'Grant NDA-gated access, manage conversations and offers inside the Deal Room until you reach a signed agreement.',
              },
            ].map((item) => (
              <div
                key={item.step}
                className="bg-white border border-slate-200 rounded-lg p-6 hover:shadow-md transition"
              >
                <div className="flex items-start gap-4">
                  <div className="flex-shrink-0 w-10 h-10 bg-green-500 text-white rounded-full flex items-center justify-center font-bold text-lg">
                    {item.step}
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold text-slate-900 mb-2">
                      {item.title}
                    </h3>
                    <p className="text-slate-600 leading-relaxed">
                      {item.description}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ============================================================================
          PARTNER JOURNEY SECTION
          ============================================================================ */}
      <section className="w-full py-20 px-4 bg-white">
        <div className="max-w-5xl mx-auto space-y-12">
          <div>
            <h2 className="text-3xl sm:text-4xl font-bold text-slate-900 mb-4">
              For Partners – Brokers, CPAs, Lawyers, and Lenders
            </h2>
            <p className="text-lg text-slate-600 mb-12">
              Join NxtOwner&apos;s professional network and support deals end-to-end.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-8">
            {[
              {
                step: 1,
                title: 'Apply as a Partner',
                description:
                  'Sign up and create a Partner profile with your firm name, specialties (brokerage, accounting, legal, lending), and regions served.',
              },
              {
                step: 2,
                title: 'Get approved',
                description:
                  'NxtOwner reviews your profile to ensure quality and fit within the professional community.',
              },
              {
                step: 3,
                title: 'Appear in the Partner Directory',
                description:
                  'Your approved profile appears on /partners for Buyers and Sellers to find and learn about your services.',
              },
              {
                step: 4,
                title: 'Receive consultation requests',
                description:
                  'Buyers and Sellers can send "Book Consultation" requests. See all leads in your Partner dashboard and follow up directly.',
              },
            ].map((item) => (
              <div
                key={item.step}
                className="bg-blue-50 border border-blue-200 rounded-lg p-6 hover:shadow-md transition"
              >
                <div className="flex items-start gap-4">
                  <div className="flex-shrink-0 w-10 h-10 bg-blue-600 text-white rounded-full flex items-center justify-center font-bold text-lg">
                    {item.step}
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold text-slate-900 mb-2">
                      {item.title}
                    </h3>
                    <p className="text-slate-600 leading-relaxed">
                      {item.description}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 rounded-lg p-8 mt-12">
            <h3 className="text-2xl font-bold text-slate-900 mb-4">
              Support deals end-to-end
            </h3>
            <p className="text-slate-700 mb-6">
              Use NxtOwner as your shared workspace with clients while they browse listings, run AI valuations, negotiate deals, and exchange documents—all in one place.
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="flex items-center gap-3">
                <CheckCircle className="w-5 h-5 text-green-600" />
                <span className="text-slate-700">Access all client deals</span>
              </div>
              <div className="flex items-center gap-3">
                <CheckCircle className="w-5 h-5 text-green-600" />
                <span className="text-slate-700">View valuations & metrics</span>
              </div>
              <div className="flex items-center gap-3">
                <CheckCircle className="w-5 h-5 text-green-600" />
                <span className="text-slate-700">Communicate in Deal Rooms</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ============================================================================
          WHY NXTOWNER IS DIFFERENT SECTION
          ============================================================================ */}
      <section className="w-full py-20 px-4 bg-slate-50">
        <div className="max-w-5xl mx-auto space-y-12">
          <div className="text-center mb-12">
            <h2 className="text-3xl sm:text-4xl font-bold text-slate-900 mb-4">
              Why NxtOwner is different
            </h2>
            <p className="text-lg text-slate-600">
              Built specifically for how business deals actually work.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {[
              {
                icon: <TrendingUp className="w-8 h-8 text-orange-500" />,
                title: 'End-to-end deal workflow',
                description:
                  'Listings, NDAs, Deal Rooms, messaging, and partner connections—everything in one place, from first search to signed deal.',
              },
              {
                icon: <Zap className="w-8 h-8 text-orange-500" />,
                title: 'AI-powered discovery & valuation',
                description:
                  'AI search helps buyers find the right opportunities. NexusAI valuation gives everyone confidence in pricing and financials.',
              },
              {
                icon: <Shield className="w-8 h-8 text-orange-500" />,
                title: 'Verified listings & partners',
                description:
                  'Admin review and AI-verified badges ensure quality listings. Approved partner profiles build trust with buyers and sellers.',
              },
              {
                icon: <Globe className="w-8 h-8 text-orange-500" />,
                title: 'Built for all deal types',
                description:
                  'Whether you&apos;re buying, selling, or advising on gas stations, QSRs, retail, SaaS, e-commerce, or any business type.',
              },
            ].map((item, idx) => (
              <div
                key={idx}
                className="bg-white border border-slate-200 rounded-lg p-8 hover:shadow-md transition"
              >
                <div className="flex items-start gap-4">
                  <div className="flex-shrink-0">{item.icon}</div>
                  <div>
                    <h3 className="text-xl font-semibold text-slate-900 mb-2">
                      {item.title}
                    </h3>
                    <p className="text-slate-600 leading-relaxed">
                      {item.description}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ============================================================================
          FINAL CTA SECTION
          ============================================================================ */}
      <section className="w-full py-16 px-4 bg-gradient-to-r from-slate-900 to-slate-800 text-white">
        <div className="max-w-4xl mx-auto text-center space-y-8">
          <div>
            <h2 className="text-3xl sm:text-4xl font-bold mb-4">
              Ready to start your next deal?
            </h2>
            <p className="text-lg text-slate-300 max-w-2xl mx-auto">
              Join thousands of buyers, sellers, and professionals using NxtOwner to close deals faster.
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
          </div>
        </div>
      </section>
    </main>
  );
}
