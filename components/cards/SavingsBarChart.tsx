"use client";

import { useMemo, useState } from "react";
import { CalendarDays } from "lucide-react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  ResponsiveContainer,
  Cell,
  Tooltip,
} from "recharts";
import { Card, CardHeader, CardTitle, CardValue, ChartTooltip } from "@/components/ui";
import {
  formatCurrency,
  getCurrentMonth,
  getCurrentYear,
  getMonthNameShort,
  getMonthName,
} from "@/lib/utils/calculations";

interface MonthlyData {
  month: number;
  amount: number;
}

interface SavingsBarChartProps {
  data: MonthlyData[];
  year?: number;
}

export function SavingsBarChart({
  data,
  year = getCurrentYear(),
}: SavingsBarChartProps) {
  const [selectedYear, setSelectedYear] = useState(year);
  const currentMonth = getCurrentMonth();
  const currentYear = getCurrentYear();

  const chartData = useMemo(() => {
    const months = Array.from({ length: 12 }, (_, i) => ({
      month: i,
      monthName: getMonthNameShort(i),
      amount: data.find((d) => d.month === i)?.amount || 0,
    }));
    return months;
  }, [data]);

  const totalSaved = useMemo(() => {
    return chartData.reduce((sum, d) => sum + d.amount, 0);
  }, [chartData]);

  const averageMonthly = useMemo(() => {
    const monthsWithData = chartData.filter((d) => d.amount > 0).length;
    return monthsWithData > 0 ? totalSaved / monthsWithData : 0;
  }, [chartData, totalSaved]);

  const years = Array.from({ length: 5 }, (_, i) => currentYear - 2 + i);

  return (
    <Card className="col-span-2">
      <CardHeader>
        <div className="flex items-center gap-2">
          <CalendarDays className="w-5 h-5 text-accent-green" />
          <CardTitle>Månedlig sparing</CardTitle>
          <select
            value={selectedYear}
            onChange={(e) => setSelectedYear(Number(e.target.value))}
            className="bg-card-hover text-xs text-secondary px-2 py-1 rounded-lg border border-secondary/20"
          >
            {years.map((y) => (
              <option key={y} value={y}>
                {y}
              </option>
            ))}
          </select>
        </div>
        <div className="text-right">
          <CardValue>{formatCurrency(totalSaved)}</CardValue>
          <p className="text-xs text-secondary">
            Gjennomsnitt: {formatCurrency(averageMonthly)}/mnd
          </p>
        </div>
      </CardHeader>
      <div className="h-40">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={chartData} barCategoryGap={4}>
            <XAxis
              dataKey="monthName"
              axisLine={false}
              tickLine={false}
              tick={{ fill: "#8E8E93", fontSize: 10 }}
            />
            <YAxis hide />
            <Tooltip
              content={
                <ChartTooltip
                  labelFormatter={(_, payload) => {
                    const month = payload?.month as number;
                    return getMonthName(month).charAt(0).toUpperCase() + getMonthName(month).slice(1);
                  }}
                  valueLabel="Spart denne måneden"
                  accentColor="#32D74B"
                />
              }
              cursor={{ fill: "rgba(255,255,255,0.05)" }}
            />
            <Bar dataKey="amount" radius={[4, 4, 0, 0]}>
              {chartData.map((entry, index) => (
                <Cell
                  key={`cell-${index}`}
                  fill={
                    selectedYear === currentYear && entry.month === currentMonth
                      ? "#00FF00"
                      : "#32D74B"
                  }
                  opacity={
                    selectedYear === currentYear && entry.month > currentMonth
                      ? 0.3
                      : 1
                  }
                />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>
    </Card>
  );
}
