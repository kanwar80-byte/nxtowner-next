export default function SellPage() {
  return (
    <main className="bg-brand-bg min-h-screen py-16">
      <div className="max-w-4xl mx-auto px-4">
        <h1 className="text-4xl font-bold text-brand-text mb-4">
          Sell Your Business on NxtOwner
        </h1>
        <p className="text-lg text-brand-muted mb-8">
          Coming Soon &mdash; We&apos;re building the best platform for business sellers.
        </p>

        <div className="bg-brand-card border border-brand-border p-8 rounded-lg shadow-sm">
          <h2 className="text-2xl font-semibold text-brand-text mb-4">
            What&apos;s Coming
          </h2>
          <ul className="space-y-3 text-brand-text">
            <li className="flex items-start">
              <span className="text-brand-green mr-2">✓</span>
              Create detailed listings with photos, financials, and documentation
            </li>
            <li className="flex items-start">
              <span className="text-brand-green mr-2">✓</span>
              Manage buyer inquiries and NDAs in one place
            </li>
            <li className="flex items-start">
              <span className="text-brand-green mr-2">✓</span>
              Track analytics and engagement on your listing
            </li>
            <li className="flex items-start">
              <span className="text-brand-green mr-2">✓</span>
              Get expert support through the entire sales process
            </li>
          </ul>
        </div>

        <div className="mt-8">
          <a
            href="/browse"
            className="inline-block bg-brand-navy text-white px-6 py-3 rounded-lg hover:bg-slate-900 transition"
          >
            Browse Listings Instead
          </a>
        </div>
      </div>
    </main>
  );
}
