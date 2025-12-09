export default function TermsPage() {
  return (
    <main className="bg-white py-16 px-4">
      <section className="max-w-4xl mx-auto bg-white border border-slate-200 rounded-2xl shadow-sm p-8 space-y-8">
        <div className="space-y-2 text-center">
          <h1 className="text-4xl font-bold text-slate-900">Terms of Use</h1>
          <p className="text-lg text-slate-700">Please read these Terms carefully before using NxtOwner.</p>
          <p className="text-sm text-slate-500">This is an informational summary of our Terms. A lawyer-reviewed version will govern your use of the platform.</p>
          <p className="text-xs text-slate-400 mt-2">Last updated: December 9, 2025</p>
        </div>

        <div className="space-y-8">
          <Section title="1. Acceptance of Terms">
            <p>By accessing or using NxtOwner, you agree to these Terms. If you do not agree, please do not use the platform.</p>
          </Section>
          <Section title="2. Eligibility & Accounts">
            <p>Users must be at least 18 years old and capable of forming binding contracts. You are responsible for maintaining the confidentiality of your account credentials.</p>
          </Section>
          <Section title="3. Marketplace Role & No Professional Advice">
            <p>NxtOwner is a marketplace platform and does not act as a party to any transaction. Users are responsible for their own decisions and should seek professional advice as needed.</p>
          </Section>
          <Section title="4. Listings, NDAs & Deal Rooms">
            <p>Listings, NDAs, and Deal Rooms are provided as tools to facilitate deals. NxtOwner is not a law firm or broker and does not provide legal or financial advice.</p>
          </Section>
          <Section title="5. Partner Directory & Third-Party Services">
            <p>Partners listed on NxtOwner (brokers, CPAs, lawyers, lenders) are independent third parties. NxtOwner is not responsible for their services or actions.</p>
          </Section>
          <Section title="6. Payments, Plans & Billing">
            <p>Payments for subscriptions and services are processed via Stripe. Any fees, refunds, or billing policies are subject to future updates and will be defined in the official Terms.</p>
          </Section>
          <Section title="7. Acceptable Use & Prohibited Activities">
            <p>Users must not misuse the platform, submit false information, engage in spam, or violate any laws. NxtOwner reserves the right to restrict access for violations.</p>
          </Section>
          <Section title="8. Intellectual Property">
            <p>All content, trademarks, and technology on NxtOwner are owned by the company or its licensors. Users may not copy, modify, or distribute platform materials without permission.</p>
          </Section>
          <Section title="9. Disclaimers & Limitation of Liability">
            <p>NxtOwner is provided &quot;as is&quot; without warranties of any kind. The company is not liable for any damages arising from use of the platform or reliance on its content.</p>
          </Section>
          <Section title="10. Termination">
            <p>NxtOwner may suspend or terminate access at any time for violations of these Terms or other reasons. Users may also close their accounts at any time.</p>
          </Section>
          <Section title="11. Changes to These Terms">
            <p>NxtOwner may update these Terms at any time. Continued use of the platform after changes means you accept the revised Terms.</p>
          </Section>
          <Section title="12. Contact Information">
            <p>If you have questions about these Terms, please contact us via the contact form or at support@nxtowner.ca.</p>
          </Section>
        </div>

        <div className="mt-10 text-center text-xs text-slate-500">
          This page is provided for general information only and does not constitute legal advice. Before launch, these Terms must be reviewed and finalized with legal counsel.
        </div>
      </section>
    </main>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="space-y-2">
      <h2 className="text-xl font-semibold text-slate-900 mt-6 mb-2">{title}</h2>
      {children}
    </section>
  );
}
