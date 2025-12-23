
"use client";

import { Bar, BarChart, LabelList, Legend, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";

interface AIComparisonChartProps {
  dealMetrics: {
    asking_price: number;
    gross_revenue: number;
  };
  marketBenchmarks: Array<{
    asking_price: number;
    gross_revenue: number;
  }>;
}

export default function AIComparisonChart({ dealMetrics, marketBenchmarks }: AIComparisonChartProps) {
  // Calculate revenue multiple for the deal
  const dealMultiple = dealMetrics.gross_revenue > 0 ? dealMetrics.asking_price / dealMetrics.gross_revenue : 0;

  // Calculate average revenue multiple for the market
  const validBenchmarks = marketBenchmarks.filter(b => b.gross_revenue > 0);
  const avgMultiple = validBenchmarks.length
    ? validBenchmarks.reduce((sum, b) => sum + b.asking_price / b.gross_revenue, 0) / validBenchmarks.length
    : 0;

  const data = [
    {
      name: "Revenue Multiple",
      "This Deal": dealMultiple,
      "Subcategory Average": avgMultiple,
    },
  ];

  let insight = "";
  if (dealMultiple && avgMultiple) {
    const dealStr = dealMultiple.toFixed(2);
    const avgStr = avgMultiple.toFixed(2);
    if (dealMultiple > avgMultiple) {
      insight = `This deal is trading at ${dealStr}x revenue, which is Higher than the market average of ${avgStr}x.`;
    } else if (dealMultiple < avgMultiple) {
      insight = `This deal is trading at ${dealStr}x revenue, which is Lower than the market average of ${avgStr}x.`;
    } else {
      insight = `This deal is trading at ${dealStr}x revenue, which is equal to the market average of ${avgStr}x.`;
    }
  }

  return (
    <div className="w-full h-64">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={data} barCategoryGap={32} margin={{ top: 16, right: 24, left: 0, bottom: 8 }}>
          <XAxis dataKey="name" axisLine={false} tickLine={false} fontSize={14} />
          <YAxis axisLine={false} tickLine={false} fontSize={13} />
          <Tooltip
            contentStyle={{ borderRadius: 8, fontSize: 14 }}
            formatter={(value: number) => value.toFixed(2)}
          />
          <Legend verticalAlign="top" align="right" iconType="circle" wrapperStyle={{ fontSize: 14, marginBottom: 8 }} />
          <Bar dataKey="This Deal" fill="#2563eb" radius={[6, 6, 0, 0]} maxBarSize={48}>
            <LabelList dataKey="This Deal" position="top" formatter={(v: number) => v.toFixed(2)} />
          </Bar>
          <Bar dataKey="Subcategory Average" fill="#cbd5e1" radius={[6, 6, 0, 0]} maxBarSize={48}>
            <LabelList dataKey="Subcategory Average" position="top" formatter={(v: number) => v.toFixed(2)} />
          </Bar>
        </BarChart>
      </ResponsiveContainer>
      <div className="mt-4 text-center text-sm font-medium text-blue-700">
        {insight}
      </div>
    </div>
  );
}
