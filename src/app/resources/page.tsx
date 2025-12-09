export default function ResourcesPage() {
  return (
    <main>
      <section className="bg-[#0A122A] text-white py-32">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-6">
          <h1 className="text-6xl font-extrabold tracking-tight">Resources & Insights</h1>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto">Expert guides, market insights, and tools to help you navigate the business acquisition process.</p>
        </div>
      </section>

      <section className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid gap-8 md:grid-cols-2">
            <div className="p-8 rounded-2xl border border-gray-200 shadow-md hover:shadow-xl transition-all">
              <h3 className="text-2xl font-bold mb-3">Market Insights</h3>
              <p className="text-gray-700">Access in-depth market reports and trend analysis for various business categories.</p>
            </div>
            <div className="p-8 rounded-2xl border border-gray-200 shadow-md hover:shadow-xl transition-all">
              <h3 className="text-2xl font-bold mb-3">Articles</h3>
              <p className="text-gray-700">Read expert articles on business valuation, acquisition strategy, and deal structure.</p>
            </div>
            <div className="p-8 rounded-2xl border border-gray-200 shadow-md hover:shadow-xl transition-all">
              <h3 className="text-2xl font-bold mb-3">Case Studies</h3>
              <p className="text-gray-700">Learn from successful acquisitions and real-world deal experiences.</p>
            </div>
            <div className="p-8 rounded-2xl border border-gray-200 shadow-md hover:shadow-xl transition-all">
              <h3 className="text-2xl font-bold mb-3">Industry Reports</h3>
              <p className="text-gray-700">Download comprehensive industry reports and valuation benchmarks.</p>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
