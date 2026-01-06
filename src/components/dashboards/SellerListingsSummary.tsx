import type { SellerListingsSummary } from "@/app/actions/dashboards";

interface SellerListingsSummaryProps {
  summary: SellerListingsSummary;
}

export default function SellerListingsSummary({ summary }: SellerListingsSummaryProps) {
  return (
    <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
      <h2 className="text-lg font-semibold text-slate-900 mb-4">Your Listings</h2>
      <div className="grid grid-cols-3 gap-4">
        <div className="text-center">
          <div className="text-3xl font-bold text-slate-900">{summary.total}</div>
          <div className="text-sm text-slate-600 mt-1">Total</div>
        </div>
        <div className="text-center">
          <div className="text-3xl font-bold text-green-600">{summary.published}</div>
          <div className="text-sm text-slate-600 mt-1">Published</div>
        </div>
        <div className="text-center">
          <div className="text-3xl font-bold text-slate-400">{summary.drafts}</div>
          <div className="text-sm text-slate-600 mt-1">Drafts</div>
        </div>
      </div>
    </div>
  );
}




