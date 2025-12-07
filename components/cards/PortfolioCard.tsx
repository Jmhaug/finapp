"use client";

import { useMemo } from "react";
import { PieChart as PieChartIcon } from "lucide-react";
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from "recharts";
import { Card, CardHeader, CardTitle, CardValue, ChartTooltip } from "@/components/ui";
import { formatCurrency, formatPercentage } from "@/lib/utils/calculations";

interface PortfolioAllocation {
  asset_type: string;
  amount: number;
  percentage?: number;
}

interface PortfolioCardProps {
  allocations: PortfolioAllocation[];
}

const COLORS: Record<string, string> = {
  stocks: "#0A84FF",
  bonds: "#FF9F0A",
  etfs: "#32D74B",
  crypto: "#AF52DE",
  cash: "#FFD60A",
  real_estate: "#FF6B6B",
};

const LABELS: Record<string, string> = {
  stocks: "Aksjer",
  bonds: "Obligasjoner",
  etfs: "ETF-er",
  crypto: "Krypto",
  cash: "Kontanter",
  real_estate: "Eiendom",
};

export function PortfolioCard({ allocations }: PortfolioCardProps) {
  const total = useMemo(() => {
    return allocations.reduce((sum, a) => sum + a.amount, 0);
  }, [allocations]);

  const chartData = useMemo(() => {
    return allocations.map((a) => ({
      name: LABELS[a.asset_type] || a.asset_type,
      value: a.amount,
      percentage: a.percentage || (a.amount / total) * 100,
      color: COLORS[a.asset_type] || "#8E8E93",
    }));
  }, [allocations, total]);

  return (
    <Card variant="blue">
      <CardHeader>
        <div className="flex items-center justify-between w-full">
          <div className="flex items-center gap-2">
            <PieChartIcon className="w-6 h-6 text-accent-blue" />
            <CardTitle>Portefølje</CardTitle>
          </div>
          <CardValue className="text-2xl">{formatCurrency(total)}</CardValue>
        </div>
      </CardHeader>
      <div className="flex items-center gap-6 mt-2">
        <div className="w-24 h-24 flex-shrink-0">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={chartData}
                cx="50%"
                cy="50%"
                innerRadius={28}
                outerRadius={42}
                paddingAngle={3}
                dataKey="value"
              >
                {chartData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip
                content={
                  <ChartTooltip
                    labelFormatter={(_, payload) => payload?.name as string}
                    valueLabel="Investert"
                    accentColor={(payload) => payload?.color as string || "#0A84FF"}
                  />
                }
              />
            </PieChart>
          </ResponsiveContainer>
        </div>
        <div className="flex-1 grid grid-cols-2 gap-x-4 gap-y-2">
          {chartData.map((item) => (
            <div key={item.name} className="flex items-center gap-2">
              <div
                className="w-2.5 h-2.5 rounded-full flex-shrink-0"
                style={{ backgroundColor: item.color }}
              />
              <span className="text-secondary text-sm truncate">{item.name}</span>
              <span className="text-primary font-medium text-sm ml-auto">
                {formatPercentage(item.percentage)}
              </span>
            </div>
          ))}
        </div>
      </div>
    </Card>
  );
}
