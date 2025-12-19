import Link from "next/link";
import { BrandMark } from "../shared/BrandMark";

export default function Footer() {
  const currentYear = new Date().getFullYear();
  return (
    <footer className="bg-[#020617] border-t border-white/10 pt-16 pb-8 text-slate-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid gap-10 md:grid-cols-4 pb-10">
          {/* Brand + Trust */}
          <div>
            <Link href="/" className="inline-block mb-4">
              <BrandMark size="md" />
            </Link>
            <p className="text-slate-400 text-sm mb-4 max-w-xs">
              A trusted marketplace for verified business acquisitions — built for
              serious buyers, operators, and advisors.
            </p>
            <ul className="space-y-1 text-xs text-slate-500">
              <li className="flex items-center gap-2">
                <span className="inline-block w-1.5 h-1.5 rounded-full bg-slate-600 mr-2" />
                Verified listings
              </li>
              <li className="flex items-center gap-2">
                <span className="inline-block w-1.5 h-1.5 rounded-full bg-slate-600 mr-2" />
                Bank-grade data
              </li>
              <li className="flex items-center gap-2">
                <span className="inline-block w-1.5 h-1.5 rounded-full bg-slate-600 mr-2" />
                Secure deal rooms
              </li>
            </ul>
          </div>
          {/* Marketplace */}
          <div>
            <h3 className="text-slate-100 font-semibold text-base mb-4 tracking-wide">
              Marketplace
            </h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link
                  href="/browse"
                  className="text-slate-300 hover:text-slate-100 transition py-1.5 inline-block"
                >
                  Browse
                </Link>
              </li>
              <li>
                <Link
                  href="/sell/onboarding"
                  className="text-slate-300 hover:text-slate-100 transition py-1.5 inline-block"
                >
                  Sell Your Business
                </Link>
              </li>
              <li>
                <Link
                  href="/valuation"
                  className="text-slate-300 hover:text-slate-100 transition py-1.5 inline-block"
                >
                  Valuation
                </Link>
              </li>
              <li>
                <Link
                  href="/how-it-works"
                  className="text-slate-300 hover:text-slate-100 transition py-1.5 inline-block"
                >
                  How it Works
                </Link>
              </li>
            </ul>
          </div>
          {/* Professionals */}
          <div>
            <h3 className="text-slate-100 font-semibold text-base mb-4 tracking-wide">
              Professionals
            </h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link
                  href="/partners/brokers"
                  className="text-slate-300 hover:text-slate-100 transition py-1.5 inline-block"
                >
                  For Brokers
                </Link>
              </li>
              <li>
                <Link
                  href="/partners"
                  className="text-slate-300 hover:text-slate-100 transition py-1.5 inline-block"
                >
                  For Partners
                </Link>
              </li>
              <li>
                <Link
                  href="/partners/verified"
                  className="text-slate-300 hover:text-slate-100 transition py-1.5 inline-block"
                >
                  Verified Program
                </Link>
              </li>
              <li>
                <Link
                  href="/partners/directory"
                  className="text-slate-300 hover:text-slate-100 transition py-1.5 inline-block"
                >
                  Partner Directory
                </Link>
              </li>
            </ul>
          </div>
          {/* Company / Legal */}
          <div>
            <h3 className="text-slate-100 font-semibold text-base mb-4 tracking-wide">
              Company
            </h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link
                  href="/about"
                  className="text-slate-300 hover:text-slate-100 transition py-1.5 inline-block"
                >
                  About
                </Link>
              </li>
              <li>
                <Link
                  href="/contact"
                  className="text-slate-300 hover:text-slate-100 transition py-1.5 inline-block"
                >
                  Contact
                </Link>
              </li>
              <li>
                <Link
                  href="/privacy"
                  className="text-slate-300 hover:text-slate-100 transition py-1.5 inline-block"
                >
                  Privacy
                </Link>
              </li>
              <li>
                <Link
                  href="/terms"
                  className="text-slate-300 hover:text-slate-100 transition py-1.5 inline-block"
                >
                  Terms
                </Link>
              </li>
            </ul>
          </div>
        </div>
        {/* Bottom Bar */}
        <div className="border-t border-white/10 mt-10 pt-6 flex flex-col md:flex-row items-center justify-between text-xs text-slate-500 gap-2">
          <span>&copy; {currentYear} NxtOwner.ca</span>
          <span className="flex gap-4">
            <Link
              href="/privacy"
              className="hover:text-slate-300 transition"
            >
              Privacy
            </Link>
            <span className="mx-1">•</span>
            <Link
              href="/terms"
              className="hover:text-slate-300 transition"
            >
              Terms
            </Link>
          </span>
        </div>
      </div>
    </footer>
  );
}
