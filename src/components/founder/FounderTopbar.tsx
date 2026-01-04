import Link from 'next/link';

export default function FounderTopbar() {
  return (
    <div className="h-16 border-b border-slate-200 bg-white flex items-center justify-between px-6">
      <div className="flex items-center gap-4">
        <Link href="/founder" className="text-xl font-bold text-slate-900">
          Founder Dashboard
        </Link>
      </div>
      <div className="flex items-center gap-4">
        <Link
          href="/"
          className="text-sm text-slate-600 hover:text-slate-900"
        >
          Back to Site
        </Link>
      </div>
    </div>
  );
}


