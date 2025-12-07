"use client";

import { useMemo } from "react";
import { TrendingUp } from "lucide-react";
import { LineChart, Line, ResponsiveContainer, Tooltip, YAxis } from "recharts";
import { Card, CardHeader, CardTitle, CardValue, ChartTooltip } from "@/components/ui";
import { formatCurrency, calculateTrend } from "@/lib/utils/calculations";

interface DailyValue {
  date: string;
  value: number;
}

interface StocksCardProps {
  totalValue: number;
  history?: DailyValue[];
}

export function StocksCard({ totalValue, history = [] }: StocksCardProps) {
  const chartData = useMemo(() => {
    if (history.length === 0) {
      // Generate mock data if no history
      return Array.from({ length: 30 }, (_, i) => ({
        date: `Dag ${i + 1}`,
        value: totalValue - (30 - i) * (Math.random() * 500 - 250),
      }));
    }
    return history;
  }, [history, totalValue]);

  const trend = useMemo(() => {
    if (chartData.length < 2) return 0;
    const firstValue = chartData[0].value;
    const lastValue = chartData[chartData.length - 1].value;
    return calculateTrend(lastValue, firstValue);
  }, [chartData]);

  const isPositive = trend >= 0;

  return (
    <Card variant="green">
      <CardHeader>
        <div className="flex items-center gap-2">
          <TrendingUp className="w-6 h-6 text-accent-green" />
          <CardTitle>Aksjer</CardTitle>
        </div>
        <div
          className={`text-xs font-medium px-2 py-1 rounded-full ${
            isPositive
              ? "bg-accent-green/20 text-accent-green"
              : "bg-red-500/20 text-red-500"
          }`}
        >
          {isPositive ? "+" : ""}
          {trend.toFixed(1)}%
        </div>
      </CardHeader>
      <CardValue>{formatCurrency(totalValue)}</CardValue>
      <div className="h-16 mt-3">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={chartData}>
            <YAxis hide domain={["dataMin - 100", "dataMax + 100"]} />
            <Tooltip
              content={
                <ChartTooltip
                  labelFormatter={(_, payload) => payload?.date as string}
                  valueLabel="Porteføljeverdi"
                  accentColor={isPositive ? "#32D74B" : "#FF6B6B"}
                />
              }
              cursor={{ stroke: "rgba(255,255,255,0.1)", strokeWidth: 1 }}
            />
            <Line
              type="monotone"
              dataKey="value"
              stroke={isPositive ? "#32D74B" : "#FF6B6B"}
              strokeWidth={2}
              dot={false}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </Card>
  );
}
