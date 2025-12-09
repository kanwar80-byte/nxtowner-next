export default function PartnersPage() {
  return (
    <main>
      <section className="bg-[#0A122A] text-white py-32">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-6">
          <h1 className="text-6xl font-extrabold tracking-tight">Our Partners & Network</h1>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto">Connect with brokers, legal professionals, and financing partners who specialize in business acquisitions.</p>
        </div>
      </section>

      <section className="py-24 bg-[#F8FAFC]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid gap-8 md:grid-cols-2">
            <div className="p-8 rounded-2xl bg-white border border-gray-200 shadow-md">
              <h3 className="text-2xl font-bold mb-3">M&A Brokers</h3>
              <p className="text-gray-700">Experienced transaction advisors to guide your deal from start to finish.</p>
            </div>
            <div className="p-8 rounded-2xl bg-white border border-gray-200 shadow-md">
              <h3 className="text-2xl font-bold mb-3">Legal Partners</h3>
              <p className="text-gray-700">Specialized attorneys for contract negotiation and deal structure.</p>
            </div>
            <div className="p-8 rounded-2xl bg-white border border-gray-200 shadow-md">
              <h3 className="text-2xl font-bold mb-3">Financing & Lending</h3>
              <p className="text-gray-700">Loan options and SBA financing partners for qualified buyers.</p>
            </div>
            <div className="p-8 rounded-2xl bg-white border border-gray-200 shadow-md">
              <h3 className="text-2xl font-bold mb-3">Accountants & CPAs</h3>
              <p className="text-gray-700">Financial experts for due diligence and valuation analysis.</p>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
