'use client';

export default function RiskStep() {
  return (
    <div className="space-y-6">
      <div className="bg-white rounded-xl p-8 border border-slate-200">
        <h2 className="text-xl font-bold text-slate-900 mb-4">
          Risk Assessment
        </h2>
        <p className="text-slate-600 mb-6">
          Identify potential risks and how you've mitigated them.
        </p>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-2">
              Key Risks
            </label>
            <textarea
              rows={4}
              className="w-full p-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              placeholder="Describe any risks..."
            />
          </div>
          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-2">
              Mitigations
            </label>
            <textarea
              rows={4}
              className="w-full p-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              placeholder="How have you addressed these risks?"
            />
          </div>
        </div>
      </div>
    </div>
  );
}


