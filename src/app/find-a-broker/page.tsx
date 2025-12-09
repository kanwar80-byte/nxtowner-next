export default function FindABrokerPage() {
  return (
    <main>
      <section className="bg-[#0A122A] text-white py-32">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-6">
          <h1 className="text-6xl font-extrabold tracking-tight">Find a Broker</h1>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto">Connect with experienced M&A brokers and advisors in your region.</p>
        </div>
      </section>

      <section className="py-24 bg-[#F8FAFC]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-2 gap-8">
            {Array(4).fill(null).map((_, i) => (
              <div key={i} className="p-6 rounded-2xl bg-white border border-gray-200 shadow-md hover:shadow-xl transition-all">
                <h3 className="text-lg font-bold mb-2">Broker {i + 1}</h3>
                <p className="text-gray-600 text-sm mb-4">Specializing in mid-market acquisitions across North America.</p>
                <a href="/contact" className="inline-flex items-center text-[#F97316] font-semibold hover:gap-3 gap-2 transition-all">
                  Connect <span>→</span>
                </a>
              </div>
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}
