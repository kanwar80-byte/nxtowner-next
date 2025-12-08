export default function SellPage() {
  return (
    <main className="py-16 max-w-4xl mx-auto px-4">
      <h1 className="text-4xl font-bold text-nxt-primary mb-4">
        Sell Your Business on NxtOwner
      </h1>
      <p className="text-lg text-gray-600 mb-8">
        Coming Soon — We're building the best platform for business sellers.
      </p>

      <div className="bg-white p-8 rounded-lg shadow-sm border border-gray-200">
        <h2 className="text-2xl font-semibold text-nxt-primary mb-4">
          What's Coming
        </h2>
        <ul className="space-y-3 text-gray-700">
          <li className="flex items-start">
            <span className="text-nxt-green mr-2">✓</span>
            Create detailed listings with photos, financials, and documentation
          </li>
          <li className="flex items-start">
            <span className="text-nxt-green mr-2">✓</span>
            Manage buyer inquiries and NDAs in one place
          </li>
          <li className="flex items-start">
            <span className="text-nxt-green mr-2">✓</span>
            Track analytics and engagement on your listing
          </li>
          <li className="flex items-start">
            <span className="text-nxt-green mr-2">✓</span>
            Get expert support through the entire sales process
          </li>
        </ul>
      </div>

      <div className="mt-8">
        <a
          href="/browse"
          className="inline-block bg-nxt-primary text-white px-6 py-3 rounded-lg hover:bg-opacity-90 transition"
        >
          Browse Listings Instead
        </a>
      </div>
    </main>
  );
}
