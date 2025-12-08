export default function PricingPage() {
  return (
    <main className="py-16 max-w-4xl mx-auto px-4">
      <h1 className="text-4xl font-bold text-nxt-primary mb-4">
        Pricing & Plans
      </h1>
      <p className="text-lg text-gray-600 mb-8">
        Coming Soon — We're finalizing our pricing structure for buyers and sellers.
      </p>

      <div className="bg-white p-8 rounded-lg shadow-sm border border-gray-200">
        <h2 className="text-2xl font-semibold text-nxt-primary mb-4">
          What to Expect
        </h2>
        <ul className="space-y-3 text-gray-700">
          <li className="flex items-start">
            <span className="text-nxt-green mr-2">✓</span>
            Free browsing and searching for all buyers
          </li>
          <li className="flex items-start">
            <span className="text-nxt-green mr-2">✓</span>
            Transparent, success-based pricing for sellers
          </li>
          <li className="flex items-start">
            <span className="text-nxt-green mr-2">✓</span>
            Premium features for featured listings and enhanced exposure
          </li>
          <li className="flex items-start">
            <span className="text-nxt-green mr-2">✓</span>
            No hidden fees — you'll know exactly what you pay
          </li>
        </ul>
      </div>

      <div className="mt-8">
        <a
          href="/browse"
          className="inline-block bg-nxt-primary text-white px-6 py-3 rounded-lg hover:bg-opacity-90 transition"
        >
          Start Browsing
        </a>
      </div>
    </main>
  );
}
