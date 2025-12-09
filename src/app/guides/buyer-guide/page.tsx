export default function BuyerGuidePage() {
  return (
    <main>
      <section className="bg-[#0A122A] text-white py-32">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-6">
          <h1 className="text-6xl font-extrabold tracking-tight">Buyer's Guide</h1>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto">Everything you need to know about buying a business.</p>
        </div>
      </section>

      <section className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
          {["Getting Started", "Valuation Basics", "Due Diligence", "Financing Options", "Negotiation Tips", "Closing the Deal"].map((topic) => (
            <div key={topic} className="p-6 rounded-2xl border border-gray-200">
              <h3 className="text-2xl font-bold mb-2">{topic}</h3>
              <p className="text-gray-700">Learn essential strategies and insights for successful business acquisition.</p>
            </div>
          ))}
        </div>
      </section>
    </main>
  );
}
