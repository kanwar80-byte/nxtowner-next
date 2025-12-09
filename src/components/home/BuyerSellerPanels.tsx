interface BuyerSellerPanelsProps {
  mode: 'all' | 'operational' | 'digital';
}

export default function BuyerSellerPanels({ mode }: BuyerSellerPanelsProps) {
  return (
    <section className="bg-white py-16 md:py-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Buyers Panel */}
          <div className="relative overflow-hidden bg-gradient-to-br from-blue-50 via-white to-blue-100 rounded-3xl p-10 shadow-[0_8px_30px_rgba(0,0,0,0.12)] hover:shadow-[0_12px_40px_rgba(0,0,0,0.16)] transition-all duration-300 hover:-translate-y-1 animate-fadeIn">
            <div className="absolute -top-10 -left-10 h-32 w-32 bg-gradient-to-br from-white/90 to-blue-200 rounded-full blur-3xl opacity-60" aria-hidden></div>
            <h2 className="text-3xl font-bold text-gray-900 mb-3">For Buyers</h2>
            <p className="text-gray-700 text-sm mb-6 leading-relaxed">
              Find your next profitable acquisition— from cash-flowing operational assets 
              to scalable digital businesses. Access verified financials, NDA-gated data rooms, 
              AI-powered deal insights, and secure messaging with sellers.
            </p>
            <ul className="space-y-3 mb-8 text-gray-700">
              <li className="flex items-start gap-3">
                <span className="text-[#16A34A] text-xl">✓</span>
                <span className="text-sm">Verified financials & performance metrics</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-[#16A34A] text-xl">✓</span>
                <span className="text-sm">NDA-gated document and data rooms</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-[#16A34A] text-xl">✓</span>
                <span className="text-sm">AI-driven valuation & diligence insights</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-[#16A34A] text-xl">✓</span>
                <span className="text-sm">Secure deal rooms and messaging</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-[#16A34A] text-xl">✓</span>
                <span className="text-sm">Expert support across your acquisition journey</span>
              </li>
            </ul>
            <a
              href="/browse"
              className="inline-flex items-center justify-center rounded-full px-7 py-3 bg-[#0A122A] text-white font-semibold shadow-md hover:shadow-lg hover:scale-[1.03] active:scale-[0.98] transition-all duration-300"
            >
              Start Browsing
            </a>
          </div>

          {/* Sellers Panel */}
          <div className="relative overflow-hidden bg-gradient-to-br from-orange-50 via-white to-orange-100 rounded-3xl p-10 shadow-[0_8px_30px_rgba(0,0,0,0.12)] hover:shadow-[0_12px_40px_rgba(0,0,0,0.16)] transition-all duration-300 hover:-translate-y-1 animate-fadeIn"
               style={{ animationDelay: '80ms' }}>
            <div className="absolute -top-10 -right-10 h-32 w-32 bg-gradient-to-br from-white/90 to-orange-200 rounded-full blur-3xl opacity-60" aria-hidden></div>
            <h2 className="text-3xl font-bold text-gray-900 mb-3">For Sellers</h2>
            <p className="text-gray-700 text-sm mb-6 leading-relaxed">
              List and sell your business with confidence. Reach qualified buyers, 
              showcase financials securely, use AI valuations to price correctly, 
              and get support from brokers and legal professionals when needed.
            </p>
            <ul className="space-y-3 mb-8 text-gray-700">
              <li className="flex items-start gap-3">
                <span className="text-[#F97316] text-xl">✓</span>
                <span className="text-sm">List your operational or digital asset in minutes</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-[#F97316] text-xl">✓</span>
                <span className="text-sm">Reach a network of verified buyers</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-[#F97316] text-xl">✓</span>
                <span className="text-sm">AI valuations to support your pricing strategy</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-[#F97316] text-xl">✓</span>
                <span className="text-sm">NDA-protected data rooms for serious buyers</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-[#F97316] text-xl">✓</span>
                <span className="text-sm">Optional broker and legal partner support</span>
              </li>
            </ul>
            <a
              href="/sell"
              className="inline-flex items-center justify-center rounded-full px-7 py-3 bg-[#F97316] text-white font-semibold shadow-md hover:shadow-lg hover:scale-[1.03] active:scale-[0.98] hover:bg-[#ea580c] transition-all duration-300"
            >
              List Your Asset
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
