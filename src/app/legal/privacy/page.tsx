export default function PrivacyPage() {
  return (
    <main className="bg-white py-16 px-4">
      <section className="max-w-4xl mx-auto bg-white border border-slate-200 rounded-2xl shadow-sm p-8 space-y-8">
        <div className="space-y-2 text-center">
          <h1 className="text-4xl font-bold text-slate-900">Privacy Policy</h1>
          <p className="text-lg text-slate-700">How NxtOwner collects, uses, and protects information on this platform.</p>
          <p className="text-xs text-slate-400 mt-2">Last updated: December 9, 2025</p>
        </div>

        <div className="space-y-8">
          <Section title="1. Overview">
            <p>This Policy describes, at a high level, how NxtOwner collects, uses, and protects information provided by users of the platform.</p>
          </Section>
          <Section title="2. Information We Collect">
            <ul className="list-disc pl-6 text-slate-700 space-y-1">
              <li>Account and profile information (name, email, role, profile details).</li>
              <li>Listing and deal information (business details, valuations, messages).</li>
              <li>Usage data (pages visited, interactions).</li>
              <li>Payment-related info handled by Stripe (NxtOwner does not store full card details).</li>
            </ul>
          </Section>
          <Section title="3. How We Use Your Information">
            <p>We use information to operate the marketplace, manage accounts, support search and valuation features, process payments, improve the platform, and respond to contact messages and leads.</p>
          </Section>
          <Section title="4. Cookies & Similar Technologies">
            <p>NxtOwner uses cookies and local storage for authentication, preferences, and analytics. You may adjust browser settings to manage cookies.</p>
          </Section>
          <Section title="5. How We Share Information">
            <ul className="list-disc pl-6 text-slate-700 space-y-1">
              <li>With other users as needed for deals (Buyers, Sellers, Partners).</li>
              <li>With service providers (Supabase, Stripe, analytics tools, etc.).</li>
              <li>NxtOwner does not sell personal data as a product.</li>
            </ul>
          </Section>
          <Section title="6. Data Storage & Security">
            <p>Information is stored using managed infrastructure (Supabase, Vercel, Stripe). We take reasonable measures to protect data, but no system is perfectly secure.</p>
          </Section>
          <Section title="7. Your Choices & Rights">
            <p>Users can update their profile, request deletion by contacting us, and unsubscribe from marketing communications. Additional rights may apply based on your location.</p>
          </Section>
          <Section title="8. Third-Party Services & Links">
            <p>NxtOwner may link to partner sites or third-party services, which have their own privacy policies. We are not responsible for their practices.</p>
          </Section>
          <Section title="9. International Users">
            <p>International users should be aware that privacy laws may differ by region. We will refine this Policy with legal counsel to ensure compliance.</p>
          </Section>
          <Section title="10. Changes to This Policy">
            <p>We may update this Policy from time to time. The &quot;Last updated&quot; date will reflect changes, and continued use of the platform means acceptance of the revised Policy.</p>
          </Section>
          <Section title="11. Contact Information">
            <p>If you have questions about this Policy, contact us via the contact form or at support@nxtowner.ca.</p>
          </Section>
        </div>

        <div className="mt-10 text-center text-xs text-slate-500">
          This Privacy Policy is a working draft and does not replace a lawyer-reviewed privacy notice. Before launch, we will finalize a compliant policy with qualified counsel.
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
