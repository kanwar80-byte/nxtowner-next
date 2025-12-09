import Link from "next/link";

export default function NotFound() {
  return (
    <main className="bg-white py-16 px-4 min-h-[60vh]">
      <section className="max-w-3xl mx-auto bg-white border border-slate-200 rounded-2xl shadow-sm p-8 text-center space-y-6">
        <h1 className="text-4xl font-bold text-[#0A122A]">Page not found</h1>
        <p className="text-lg text-slate-700">We couldn’t find the page you were looking for.</p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center mt-6">
          <Link href="/" className="inline-block px-6 py-3 rounded-full bg-[#0A122A] text-white font-semibold shadow hover:bg-[#1e293b] transition">Go to homepage</Link>
          <Link href="/browse" className="inline-block px-6 py-3 rounded-full bg-[#F97316] text-white font-semibold shadow hover:bg-orange-600 transition">Browse listings</Link>
        </div>
      </section>
    </main>
  );
}
