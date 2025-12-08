export default function PricingPage() {
  return (
    <main className="bg-brand-bg min-h-screen py-16">
      <div className="max-w-4xl mx-auto px-4">
        <h1 className="text-4xl font-bold text-brand-text mb-4">
          Pricing & Plans
        </h1>
        <p className="text-lg text-brand-muted mb-8">
          Coming Soon &mdash; We&apos;re finalizing our pricing structure for buyers and sellers.
        </p>

        <div className="bg-brand-card border border-brand-border p-8 rounded-lg shadow-sm">
          <h2 className="text-2xl font-semibold text-brand-text mb-4">
            What to Expect
          </h2>
          <ul className="space-y-3 text-brand-text">
            <li className="flex items-start">
              <span className="text-brand-green mr-2">✓</span>
              Free browsing and searching for all buyers
            </li>
            <li className="flex items-start">
              <span className="text-brand-green mr-2">✓</span>
              Transparent, success-based pricing for sellers
            </li>
            <li className="flex items-start">
              <span className="text-brand-green mr-2">✓</span>
              Premium features for featured listings and enhanced exposure
            </li>
            <li className="flex items-start">
              <span className="text-brand-green mr-2">✓</span>
              No hidden fees &mdash; you&apos;ll know exactly what you pay
            </li>
          </ul>
        </div>

        <div className="mt-8">
          <a
            href="/browse"
            className="inline-block bg-brand-navy text-white px-6 py-3 rounded-lg hover:bg-slate-900 transition"
          >
            Start Browsing
          </a>
        </div>
      </div>
    </main>
  );
}
