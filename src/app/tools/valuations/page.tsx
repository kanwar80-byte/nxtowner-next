export default function ValuationToolsPage() {
  return (
    <main>
      <section className="bg-[#0A122A] text-white py-32">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-6">
          <h1 className="text-6xl font-extrabold tracking-tight">Valuation Tools</h1>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto">Use our AI-powered tools to estimate your business value accurately.</p>
        </div>
      </section>

      <section className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="p-8 rounded-2xl border border-gray-200 text-center">
            <h2 className="text-3xl font-bold mb-4">Quick Valuation Calculator</h2>
            <p className="text-gray-700 mb-8">Get an instant estimate based on your business metrics.</p>
            <button className="bg-[#F97316] text-white rounded-full px-8 py-3 font-semibold hover:shadow-lg transition-all">Start Valuation</button>
          </div>
        </div>
      </section>
    </main>
  );
}
