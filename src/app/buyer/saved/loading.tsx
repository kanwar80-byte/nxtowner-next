export default function SavedListingsLoading() {
  return (
    <div className="p-6 space-y-6">
      <h1 className="text-2xl font-semibold text-slate-900">Saved Listings</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {[1, 2, 3].map((i) => (
          <div
            key={i}
            className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm animate-pulse"
          >
            <div className="w-full h-48 mb-4 rounded-lg bg-slate-200" />
            <div className="h-6 bg-slate-200 rounded mb-2" />
            <div className="h-4 bg-slate-200 rounded mb-2 w-2/3" />
            <div className="h-5 bg-slate-200 rounded w-1/2" />
          </div>
        ))}
      </div>
    </div>
  );
}


