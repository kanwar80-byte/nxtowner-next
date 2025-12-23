"use client";

import dynamic from "next/dynamic";

// Move the dynamic import here, where 'use client' is active
const Chart = dynamic(() => import("./AIComparisonChart"), {
  ssr: false,
  loading: () => <div className="h-[300px] w-full bg-gray-50 animate-pulse rounded-xl" />,
});

export default function AnalysisWrapper({ dealMetrics, marketBenchmarks }: any) {
  return (
    <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
      <h3 className="text-lg font-semibold mb-6">Market Benchmarking</h3>
      <Chart dealMetrics={dealMetrics} marketBenchmarks={marketBenchmarks} />
    </div>
  );
}
