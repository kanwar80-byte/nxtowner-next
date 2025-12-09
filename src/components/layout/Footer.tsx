export default function Footer() {
  return (
    <footer className="bg-[#0A122A] text-white py-16 mt-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-12">
          <div className="space-y-4">
            <div className="text-2xl font-extrabold tracking-tight">NxtOwner.ca</div>
            <p className="text-sm text-white/80 leading-relaxed">
              The #1 marketplace for verified business acquisitions.
            </p>
            <div className="flex items-center gap-3 text-white/80 text-sm">
              <a href="https://www.linkedin.com" className="hover:text-white transition">LinkedIn</a>
              <span className="text-white/50">•</span>
              <a href="https://twitter.com" className="hover:text-white transition">X</a>
              <span className="text-white/50">•</span>
              <a href="https://youtube.com" className="hover:text-white transition">YouTube</a>
            </div>
          </div>

          <div className="space-y-4">
            <h3 className="text-sm font-semibold uppercase tracking-wide text-white/80">Marketplace</h3>
            <ul className="space-y-2 text-sm text-white/80">
              <li><a href="/browse" className="hover:text-white transition">Browse Physical Businesses</a></li>
              <li><a href="/browse" className="hover:text-white transition">Browse Digital Businesses</a></li>
              <li><a href="/sell" className="hover:text-white transition">Sell A Business</a></li>
              <li><a href="/valuation/asset" className="hover:text-white transition">Run Valuation</a></li>
              <li><a href="/find-a-broker" className="hover:text-white transition">Find a Broker</a></li>
            </ul>
          </div>

          <div className="space-y-4">
            <h3 className="text-sm font-semibold uppercase tracking-wide text-white/80">Resources</h3>
            <ul className="space-y-2 text-sm text-white/80">
              <li><a href="/resources" className="hover:text-white transition">Articles</a></li>
              <li><a href="/resources" className="hover:text-white transition">Market Insights</a></li>
              <li><a href="/pricing" className="hover:text-white transition">Pricing</a></li>
              <li><a href="/guides/buyer-guide" className="hover:text-white transition">Buyer Guide</a></li>
              <li><a href="/guides/seller-guide" className="hover:text-white transition">Seller Guide</a></li>
            </ul>
          </div>

          <div className="space-y-4">
            <h3 className="text-sm font-semibold uppercase tracking-wide text-white/80">Company</h3>
            <ul className="space-y-2 text-sm text-white/80">
              <li><a href="/about" className="hover:text-white transition">About</a></li>
              <li><a href="/careers" className="hover:text-white transition">Careers</a></li>
              <li><a href="/contact" className="hover:text-white transition">Contact</a></li>
              <li><a href="/legal/terms" className="hover:text-white transition">Terms</a></li>
              <li><a href="/legal/privacy" className="hover:text-white transition">Privacy</a></li>
            </ul>
          </div>
        </div>

        <div className="border-t border-white/10 mt-12 pt-4 text-center text-xs text-white/50">
          © 2025 NxtOwner Inc. All rights reserved.
        </div>
      </div>
    </footer>
  );
}
