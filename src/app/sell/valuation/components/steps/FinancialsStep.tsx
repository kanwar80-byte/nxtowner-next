'use client';

export default function FinancialsStep() {
  return (
    <div className="space-y-6">
      <div className="bg-white rounded-xl p-8 border border-slate-200">
        <h2 className="text-xl font-bold text-slate-900 mb-4">
          Financial Overview
        </h2>
        <p className="text-slate-600 mb-6">
          Provide key financial metrics for valuation.
        </p>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-2">
              Annual Revenue
            </label>
            <input
              type="number"
              className="w-full p-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              placeholder="$0.00"
            />
          </div>
          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-2">
              Annual Cash Flow
            </label>
            <input
              type="number"
              className="w-full p-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              placeholder="$0.00"
            />
          </div>
        </div>
      </div>
    </div>
  );
}




