export default function HomePage() {
  return (
    <main className="py-20">
      {/* Hero */}
      <section className="text-center max-w-3xl mx-auto px-4">
        <h1 className="text-4xl md:text-5xl font-bold text-nxt-primary leading-tight">
          Buy &amp; Sell Profitable Physical and Digital Businesses.
        </h1>

        <p className="text-gray-600 text-lg mt-4">
          A trusted marketplace for gas stations, convenience stores, QSRs, SaaS
          companies, e-commerce stores, and more.
        </p>

        <div className="mt-8 flex gap-4 justify-center">
          <a
            href="/browse"
            className="px-6 py-3 bg-nxt-orange text-white font-semibold rounded-md shadow hover:opacity-90 transition"
          >
            Browse Listings
          </a>

          <a
            href="/sell"
            className="px-6 py-3 border border-nxt-primary text-nxt-primary font-semibold rounded-md hover:bg-nxt-primary hover:text-white transition"
          >
            Sell Your Business
          </a>
        </div>
      </section>

      {/* Feature cards */}
      <section className="mt-20 grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl mx-auto px-4">
        <div className="bg-white shadow rounded-lg p-6">
          <h3 className="font-semibold text-xl text-nxt-primary">
            Verified Listings
          </h3>
          <p className="text-gray-600 mt-2">
            All businesses undergo verification checks for trust and accuracy.
          </p>
        </div>

        <div className="bg-white shadow rounded-lg p-6">
          <h3 className="font-semibold text-xl text-nxt-primary">
            Serious Buyers
          </h3>
          <p className="text-gray-600 mt-2">
            Connect with qualified buyers actively seeking opportunities.
          </p>
        </div>

        <div className="bg-white shadow rounded-lg p-6">
          <h3 className="font-semibold text-xl text-nxt-primary">
            Expert Support
          </h3>
          <p className="text-gray-600 mt-2">
            Access tools, guides, and professionals to close deals confidently.
          </p>
        </div>
      </section>
    </main>
  );
}
