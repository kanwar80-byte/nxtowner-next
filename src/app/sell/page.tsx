export default function SellPage() {
  return (
    <main>
      <section className="bg-[#0A122A] text-white py-32">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-6">
          <h1 className="text-6xl font-extrabold tracking-tight">Sell Your Business</h1>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto">Reach qualified buyers and get your business sold at the best valuation.</p>
        </div>
      </section>

      <section className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
          <div className="text-center">
            <h2 className="text-4xl font-bold mb-6">How It Works</h2>
            <div className="grid md:grid-cols-4 gap-6">
              {[
                { step: "1", title: "Create Listing", desc: "List your business in 10 minutes" },
                { step: "2", title: "Get Valuation", desc: "AI-powered valuation analysis" },
                { step: "3", title: "Connect", desc: "Qualified buyers reach out" },
                { step: "4", title: "Close Deal", desc: "Secure transaction completion" },
              ].map((item) => (
                <div key={item.step} className="p-6 rounded-2xl border border-gray-200">
                  <div className="text-4xl font-bold text-[#F97316] mb-3">{item.step}</div>
                  <h3 className="font-bold text-lg mb-2">{item.title}</h3>
                  <p className="text-gray-600 text-sm">{item.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
