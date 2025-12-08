export default function BrowsePage() {
  return (
    <main className="py-16 max-w-6xl mx-auto px-4">
      <header className="mb-10">
        <h1 className="text-3xl font-bold text-nxt-primary">
          Browse Listings
        </h1>
        <p className="text-gray-600 mt-2">
          Explore verified physical and digital businesses ready for new owners.
        </p>
      </header>

      {/* Simple filter bar (static for now) */}
      <section className="mb-8 flex flex-col md:flex-row gap-4">
        <input
          className="flex-1 px-4 py-2 rounded-md border border-gray-300"
          placeholder="Search by name, type, or location..."
        />
        <select className="px-4 py-2 rounded-md border border-gray-300">
          <option>All Asset Types</option>
          <option>Gas Stations &amp; C-Stores</option>
          <option>Car Wash &amp; Auto</option>
          <option>QSR &amp; Restaurants</option>
          <option>SaaS &amp; Software</option>
          <option>E-commerce &amp; DTC</option>
        </select>
        <select className="px-4 py-2 rounded-md border border-gray-300">
          <option>Any Price</option>
          <option>Under $250k</option>
          <option>$250k – $1M</option>
          <option>$1M – $5M</option>
          <option>$5M+</option>
        </select>
      </section>

      {/* Placeholder listing cards */}
      <section className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white shadow rounded-lg p-5">
          <h3 className="font-semibold text-lg text-nxt-primary">
            Petro-Canada Gas Station &amp; C-Store
          </h3>
          <p className="text-gray-600 text-sm mt-1">Ontario • Fuel + C-Store</p>
          <p className="mt-3 font-semibold">$3.2M Asking</p>
          <p className="text-gray-500 text-sm mt-1">
            High-traffic corner site with car wash and QSR potential.
          </p>
        </div>

        <div className="bg-white shadow rounded-lg p-5">
          <h3 className="font-semibold text-lg text-nxt-primary">
            SaaS Subscription Analytics Platform
          </h3>
          <p className="text-gray-600 text-sm mt-1">Fully Remote • Digital</p>
          <p className="mt-3 font-semibold">$450k Asking</p>
          <p className="text-gray-500 text-sm mt-1">
            B2B analytics SaaS with recurring MRR and low churn.
          </p>
        </div>

        <div className="bg-white shadow rounded-lg p-5">
          <h3 className="font-semibold text-lg text-nxt-primary">
            E-commerce Brand: Home &amp; Lifestyle
          </h3>
          <p className="text-gray-600 text-sm mt-1">
            Canada &amp; US • Shopify
          </p>
          <p className="mt-3 font-semibold">$320k Asking</p>
          <p className="text-gray-500 text-sm mt-1">
            Growing DTC brand with strong repeat customer base.
          </p>
        </div>
      </section>
    </main>
  );
}
