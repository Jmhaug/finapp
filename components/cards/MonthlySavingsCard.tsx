"use client";

import { Target } from "lucide-react";
import { Card, CardHeader, CardTitle, CardValue } from "@/components/ui";
import { formatCurrency, calculatePercentage } from "@/lib/utils/calculations";

interface MonthlySavingsCardProps {
  currentAmount: number;
  targetAmount: number;
  goalName?: string;
}

export function MonthlySavingsCard({
  currentAmount,
  targetAmount,
  goalName = "Månedsmål",
}: MonthlySavingsCardProps) {
  const percentage = calculatePercentage(currentAmount, targetAmount);
  const circumference = 2 * Math.PI * 40;
  const strokeDashoffset = circumference - (percentage / 100) * circumference;

  return (
    <Card variant="orange">
      <CardHeader>
        <div className="flex items-center gap-2">
          <Target className="w-6 h-6 text-accent-orange" />
          <CardTitle>{goalName}</CardTitle>
        </div>
      </CardHeader>
      <div className="flex items-center justify-between">
        <div>
          <CardValue>{formatCurrency(currentAmount)}</CardValue>
          <p className="text-sm text-secondary">
            av {formatCurrency(targetAmount)}
          </p>
        </div>
        <div className="relative w-24 h-24">
          <svg className="w-full h-full -rotate-90" viewBox="0 0 100 100">
            {/* Background circle */}
            <circle
              cx="50"
              cy="50"
              r="40"
              stroke="#3a3a3c"
              strokeWidth="8"
              fill="none"
            />
            {/* Progress circle */}
            <circle
              cx="50"
              cy="50"
              r="40"
              stroke="#FF9F0A"
              strokeWidth="8"
              fill="none"
              strokeLinecap="round"
              strokeDasharray={circumference}
              strokeDashoffset={strokeDashoffset}
              className="transition-all duration-500"
            />
          </svg>
          <div className="absolute inset-0 flex items-center justify-center">
            <span className="text-lg font-bold text-primary">
              {Math.round(percentage)}%
            </span>
          </div>
        </div>
      </div>
    </Card>
  );
}
