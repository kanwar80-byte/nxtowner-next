export default function CalculatorsPage() {
  return (
    <main>
      <section className="bg-[#0A122A] text-white py-32">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-6">
          <h1 className="text-6xl font-extrabold tracking-tight">Business Calculators</h1>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto">Essential tools for financial analysis and deal structuring.</p>
        </div>
      </section>

      <section className="py-24 bg-[#F8FAFC]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-2 gap-6">
            {["Revenue Multiple", "EBITDA Calculator", "ROI Estimator", "Financing Scenarios"].map((tool) => (
              <div key={tool} className="p-6 rounded-2xl bg-white border border-gray-200">
                <h3 className="text-lg font-bold mb-3">{tool}</h3>
                <button className="text-[#F97316] font-semibold hover:underline">Use Tool →</button>
              </div>
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}
