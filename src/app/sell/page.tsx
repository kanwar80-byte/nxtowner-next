import Link from "next/link";
import { AuthGate } from "@/components/auth/AuthGate";
import { SellForm } from "@/components/sell/SellForm";

export default function SellPage() {
  return (
    <main className="bg-brand-bg min-h-screen">
      <section className="bg-[#0A122A] text-white py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 lg:grid-cols-2 gap-10 items-center">
          <div className="space-y-4">
            <p className="inline-flex items-center px-3 py-1 rounded-full bg-white/10 text-xs uppercase tracking-wide">Seller workspace</p>
            <h1 className="text-4xl sm:text-5xl font-extrabold tracking-tight">Sell your business on NxtOwner</h1>
            <p className="text-lg text-gray-200 max-w-2xl">
              Draft your listing, save as a draft, and submit for review when you are ready. Our team will publish it to the marketplace once approved.
            </p>
            <div className="flex flex-wrap gap-3 text-sm text-gray-200">
              <span className="px-3 py-1 rounded-full bg-white/10">Save as draft</span>
              <span className="px-3 py-1 rounded-full bg-white/10">Submit for review</span>
              <span className="px-3 py-1 rounded-full bg-white/10">Track status</span>
            </div>
            <Link
              href="/dashboard/seller"
              className="inline-flex items-center gap-2 text-sm font-semibold text-white underline underline-offset-4"
            >
              View your listings
              <span aria-hidden>→</span>
            </Link>
          </div>
          <div className="bg-white/10 border border-white/20 rounded-2xl p-6 space-y-4 text-sm">
            <p className="font-semibold text-white">What you will need</p>
            <ul className="space-y-2 text-gray-200 list-disc list-inside">
              <li>Basic business overview and category</li>
              <li>Location and asking price</li>
              <li>Optional revenue and profit figures</li>
              <li>Time to complete: under 10 minutes</li>
            </ul>
            <p className="text-gray-200">You can always save as draft and continue later.</p>
          </div>
        </div>
      </section>

      <section className="py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <AuthGate>
            <SellForm />
          </AuthGate>
        </div>
      </section>
    </main>
  );
}
