export default function SellerGuidePage() {
  return (
    <main>
      <section className="bg-[#0A122A] text-white py-32">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-6">
          <h1 className="text-6xl font-extrabold tracking-tight">Seller&apos;s Guide</h1>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto">Maximize your business value and find the right buyer.</p>
        </div>
      </section>

      <section className="py-24 bg-[#F8FAFC]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
          {["Preparing to Sell", "Valuation Process", "Listing Your Business", "Buyer Screening", "Negotiation Strategy", "Transaction Closing"].map((topic) => (
            <div key={topic} className="p-6 rounded-2xl bg-white border border-gray-200">
              <h3 className="text-2xl font-bold mb-2">{topic}</h3>
              <p className="text-gray-700">Expert guidance to help you get the best price and smooth transaction.</p>
            </div>
          ))}
        </div>
      </section>
    </main>
  );
}
