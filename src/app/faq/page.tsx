import type { Metadata } from 'next';
import { FAQAccordion } from '@/components/ui/FAQAccordion';

export const metadata: Metadata = {
  title: 'FAQ – NxtOwner',
  description: 'Answers to common questions about using NxtOwner as a buyer, seller, or partner.',
};

const generalFAQs = [
  {
    question: 'What is NxtOwner?',
    answer:
      'NxtOwner is a marketplace built for buying and selling physical and digital businesses. It combines AI-powered search, valuation insights, NDAs, Deal Rooms, and approved partner profiles so buyers, sellers, and advisors can collaborate in one workflow.',
  },
  {
    question: 'Do I need an account to browse listings?',
    answer:
      'Browsing is open. You will need an account to save listings to your watchlist, request info, sign NDAs, access Deal Rooms, or track offers.',
  },
  {
    question: 'Is NxtOwner available outside Canada?',
    answer:
      'We primarily focus on Canada and North America today. Digital businesses may be accessible more broadly, but local regulations and deal norms still apply.',
  },
  {
    question: 'Does NxtOwner replace lawyers and accountants?',
    answer:
      'No. NxtOwner streamlines discovery and deal workflows and connects you with professionals. It is not a substitute for legal, accounting, or regulatory advice.',
  },
  {
    question: 'How do NDAs and Deal Rooms work together?',
    answer:
      'After a seller approves your NDA on a listing, you gain Deal Room access for that opportunity. Deal Rooms host confidential documents, messages, and offers.',
  },
];

const buyerFAQs = [
  {
    question: 'How do I find the right business to buy?',
    answer:
      'Start at /browse to filter by industry, price, and more. Use AI search for natural-language queries to surface relevant listings faster.',
  },
  {
    question: 'What is the AI search and how should I use it?',
    answer:
      'AI search lets you type how you think—e.g., “Ontario gas station with car wash under $2M”. It suggests matches and complements filters; you still make the final calls.',
  },
  {
    question: 'How do I request more information on a listing?',
    answer:
      'Open a listing and use Request Info. That creates a lead for the seller, who can respond, share details, or invite you to an NDA and Deal Room.',
  },
  {
    question: 'What happens after I sign an NDA?',
    answer:
      'Once the seller (or admin) approves, the NDA unlocks the Deal Room so you can view documents, messages, and submit or track offers.',
  },
  {
    question: 'Can I track all my deals in one place?',
    answer:
      'Yes. Your buyer dashboard keeps your watchlist, leads, NDAs, and Deal Rooms organized so you can monitor progress in one view.',
  },
  {
    question: 'Can I save listings for later?',
    answer:
      'Use the watchlist from listing cards or details. Saved listings show up in your buyer dashboard for quick follow-up.',
  },
];

const sellerFAQs = [
  {
    question: 'How do I list my business on NxtOwner?',
    answer:
      'Create a seller account, go to Sell or Create Listing, and submit your details. Listings enter Pending Review before going live.',
  },
  {
    question: 'What is the review and approval process?',
    answer:
      'Submitted listings are reviewed for completeness and consistency. Admin may request edits; once approved they appear in Browse and search.',
  },
  {
    question: 'How do I receive and respond to buyer interest?',
    answer:
      'Buyer Requests for Info create leads in your seller dashboard. You can reply, qualify buyers, and decide who moves to NDA and Deal Room access.',
  },
  {
    question: 'What is an AI-Verified listing?',
    answer:
      'AI-Verified indicates the listing passed key data and valuation consistency checks. It is a trust signal—not a formal appraisal.',
  },
  {
    question: 'Can I feature my listing?',
    answer:
      'Featured placements are available for select listings (often tied to verified sellers or admin approval) to increase visibility in Browse.',
  },
  {
    question: 'How are NDAs handled for my listing?',
    answer:
      'When buyers request NDA access, you can approve or decline. Approved buyers unlock the Deal Room to see confidential materials and start structured discussions.',
  },
];

const partnerFAQs = [
  {
    question: 'Who qualifies as a Partner on NxtOwner?',
    answer:
      'Brokers, CPAs, lawyers, lenders, and consultants who support business transactions and diligence can join as partners.',
  },
  {
    question: 'How do I become a Partner?',
    answer:
      'Sign up, create a Partner profile, and submit it for approval. Approved partners appear in the directory and can receive consultation leads.',
  },
  {
    question: 'Where will my profile appear?',
    answer:
      'Approved partner profiles are discoverable in the /partners directory and can be linked from Deal Rooms when sellers invite support.',
  },
  {
    question: 'How do I receive leads?',
    answer:
      'Book Consultation forms route to partner leads in your dashboard so you can follow up with interested buyers or sellers.',
  },
  {
    question: 'Can I work with multiple buyers and sellers?',
    answer:
      'Yes. NxtOwner is built for professionals running multiple engagements concurrently across different Deal Rooms.',
  },
];

const billingFAQs = [
  {
    question: 'What plans are available on NxtOwner?',
    answer:
      'Common tiers include Free, Pro Buyer, Verified Seller, and Partner Pro. Plans unlock perks like additional listings, verification, or enhanced exposure.',
  },
  {
    question: 'How do I upgrade my plan?',
    answer:
      'Visit /pricing to choose a plan. Upgrades use secure Stripe Checkout to handle payment.',
  },
  {
    question: 'How are subscriptions billed?',
    answer:
      'Subscriptions are billed monthly via Stripe and renew automatically until cancelled.',
  },
  {
    question: 'How do I cancel my subscription?',
    answer:
      'You can manage billing from your account (or contact support if a self-serve billing page is not yet visible in your region).',
  },
  {
    question: 'Do you charge success fees on closed deals?',
    answer:
      'Today we focus on subscriptions and listing fees. Any success fees or brokerage agreements remain between you and your advisor.',
  },
];

export default function FAQPage() {
  return (
    <main className="bg-white">
      <section className="w-full bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 text-white py-16 sm:py-24 px-4">
        <div className="max-w-4xl mx-auto text-center space-y-4">
          <h1 className="text-4xl sm:text-5xl font-bold leading-tight">Frequently Asked Questions</h1>
          <p className="text-lg sm:text-xl text-slate-200 max-w-3xl mx-auto">
            Answers to the most common questions from Buyers, Sellers, and Partners using NxtOwner.
          </p>
        </div>
      </section>

      <section className="w-full py-16 px-4 bg-white">
        <div className="max-w-5xl mx-auto space-y-14">
          <FAQBlock title="General" items={generalFAQs} />
          <FAQBlock title="Buyers" items={buyerFAQs} />
          <FAQBlock title="Sellers" items={sellerFAQs} />
          <FAQBlock title="Partners" items={partnerFAQs} />
          <FAQBlock title="Billing & Plans" items={billingFAQs} />
        </div>
      </section>
    </main>
  );
}

function FAQBlock({ title, items }: { title: string; items: { question: string; answer: string }[] }) {
  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <h2 className="text-3xl font-bold text-slate-900">{title}</h2>
        <div className="w-14 h-1 bg-orange-500 rounded-full" />
      </div>
      <FAQAccordion items={items} />
    </div>
  );
}
