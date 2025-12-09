"use client";

import Link from "next/link";

export default function GlobalError({ reset }: { reset: () => void }) {
  return (
    <main className="bg-white py-16 px-4 min-h-[60vh]">
      <section className="max-w-3xl mx-auto bg-white border border-slate-200 rounded-2xl shadow-sm p-8 text-center space-y-6">
        <h1 className="text-4xl font-bold text-[#0A122A]">Something went wrong</h1>
        <p className="text-lg text-slate-700">An unexpected error occurred. Try refreshing, or go back to the previous page.</p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center mt-6">
          <button onClick={() => reset()} className="inline-block px-6 py-3 rounded-full bg-[#F97316] text-white font-semibold shadow hover:bg-orange-600 transition">Try again</button>
          <Link href="/" className="inline-block px-6 py-3 rounded-full bg-[#0A122A] text-white font-semibold shadow hover:bg-[#1e293b] transition">Back to home</Link>
        </div>
      </section>
    </main>
  );
}
