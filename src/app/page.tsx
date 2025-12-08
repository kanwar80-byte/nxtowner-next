export default function HomePage() {
  return (
    <main>
      {/* Hero - Navy Background */}
      <section className="text-white py-16 sm:py-24" style={{ backgroundColor: '#020617' }}>
        <div className="max-w-5xl mx-auto px-4 text-center space-y-6">
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight text-white">
            Buy &amp; Sell Profitable Physical and Digital Businesses.
          </h1>

          <p className="text-base sm:text-lg text-white">
            A trusted marketplace for gas stations, convenience stores, QSRs, SaaS
            companies, e-commerce stores, and more.
          </p>

          <div className="mt-8 flex flex-col sm:flex-row gap-4 justify-center">
            <a
              href="/browse"
              className="inline-flex items-center justify-center rounded-md px-6 py-3 text-sm font-semibold text-white shadow-lg hover:opacity-90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 transition"
              style={{ backgroundColor: '#EA580C' }}
            >
              Browse Listings
            </a>

            <a
              href="/create-listing"
              className="inline-flex items-center justify-center rounded-md border-2 px-6 py-3 text-sm font-semibold text-white hover:bg-white/10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 transition"
              style={{ borderColor: '#FFFFFF', backgroundColor: 'transparent' }}
            >
              Sell Your Business
            </a>
          </div>
        </div>
      </section>

      {/* Feature cards - Light Background */}
      <section style={{ backgroundColor: '#F3F4F6' }}>
        <div className="max-w-6xl mx-auto px-4 py-10">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-brand-card border border-brand-border rounded-2xl shadow-sm p-6">
              <h3 className="text-lg font-semibold text-brand-text">Verified Listings</h3>
              <p className="text-sm text-brand-muted leading-relaxed">
                All businesses undergo verification checks for trust and accuracy.
              </p>
            </div>

            <div className="bg-brand-card border border-brand-border rounded-2xl shadow-sm p-6">
              <h3 className="text-lg font-semibold text-brand-text">Serious Buyers</h3>
              <p className="text-sm text-brand-muted leading-relaxed">
                Connect with qualified buyers actively seeking opportunities.
              </p>
            </div>

            <div className="bg-brand-card border border-brand-border rounded-2xl shadow-sm p-6">
              <h3 className="text-lg font-semibold text-brand-text">Expert Support</h3>
              <p className="text-sm text-brand-muted leading-relaxed">
                Access tools, guides, and professionals to close deals confidently.
              </p>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
