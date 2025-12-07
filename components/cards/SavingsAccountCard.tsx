"use client";

import { useMemo } from "react";
import { PiggyBank } from "lucide-react";
import { BarChart, Bar, ResponsiveContainer, Cell, Tooltip } from "recharts";
import { Card, CardHeader, CardTitle, CardValue, ChartTooltip } from "@/components/ui";
import { formatCurrencyDetailed, formatPercentage } from "@/lib/utils/calculations";

interface DailyBalance {
  day: number;
  balance: number;
}

interface SavingsAccountCardProps {
  accountName?: string;
  balance: number;
  interestRate?: number;
  history?: DailyBalance[];
}

export function SavingsAccountCard({
  accountName = "Høyrentesparing",
  balance,
  interestRate,
  history = [],
}: SavingsAccountCardProps) {
  const chartData = useMemo(() => {
    if (history.length === 0) {
      // Generate mock data if no history
      return Array.from({ length: 30 }, (_, i) => ({
        day: i + 1,
        balance: balance - Math.random() * 1000,
      }));
    }
    return history;
  }, [history, balance]);

  const maxBalance = useMemo(() => {
    return Math.max(...chartData.map((d) => d.balance));
  }, [chartData]);

  return (
    <Card variant="yellow">
      <CardHeader>
        <div className="flex items-center gap-2">
          <PiggyBank className="w-6 h-6 text-accent-yellow" />
          <div>
            <CardTitle>{accountName}</CardTitle>
            {interestRate && (
              <p className="text-xs text-accent-yellow">
                {formatPercentage(interestRate)} årlig rente
              </p>
            )}
          </div>
        </div>
      </CardHeader>
      <CardValue>{formatCurrencyDetailed(balance)}</CardValue>
      <div className="h-16 mt-3">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={chartData} barCategoryGap={1}>
            <Tooltip
              content={
                <ChartTooltip
                  labelFormatter={(_, payload) => `Dag ${payload?.day}`}
                  valueFormatter={formatCurrencyDetailed}
                  valueLabel="Saldo"
                  accentColor="#FFD60A"
                />
              }
              cursor={{ fill: "rgba(255,255,255,0.05)" }}
            />
            <Bar dataKey="balance" radius={[1, 1, 0, 0]}>
              {chartData.map((entry, index) => (
                <Cell
                  key={`cell-${index}`}
                  fill="#FFD60A"
                  opacity={entry.balance === maxBalance ? 1 : 0.5}
                />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>
    </Card>
  );
}
