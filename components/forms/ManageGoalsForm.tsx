"use client";

import { useState } from "react";
import { Button, Input, Select } from "@/components/ui";
import { getCurrentMonth, getCurrentYear, getMonthName } from "@/lib/utils/calculations";

interface Goal {
  id?: string;
  name: string;
  targetAmount: number;
  currentAmount: number;
  month: number;
  year: number;
}

interface ManageGoalsFormProps {
  existingGoals?: Goal[];
  onSubmit?: (goal: Omit<Goal, "id">) => void;
}

export function ManageGoalsForm({ existingGoals = [], onSubmit }: ManageGoalsFormProps) {
  const [name, setName] = useState("");
  const [targetAmount, setTargetAmount] = useState("");
  const [currentAmount, setCurrentAmount] = useState("");
  const [month, setMonth] = useState(getCurrentMonth());
  const [year, setYear] = useState(getCurrentYear());
  const [isLoading, setIsLoading] = useState(false);

  const months = Array.from({ length: 12 }, (_, i) => ({
    value: String(i),
    label: getMonthName(i),
  }));

  const years = Array.from({ length: 5 }, (_, i) => ({
    value: String(getCurrentYear() + i),
    label: String(getCurrentYear() + i),
  }));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      onSubmit?.({
        name,
        targetAmount: parseFloat(targetAmount),
        currentAmount: parseFloat(currentAmount) || 0,
        month,
        year,
      });

      // Reset form
      setName("");
      setTargetAmount("");
      setCurrentAmount("");
    } catch (error) {
      console.error("Error adding goal:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Existing Goals */}
      {existingGoals.length > 0 && (
        <div className="space-y-2">
          <h4 className="text-sm font-medium text-secondary">Nåværende mål</h4>
          {existingGoals.map((goal) => (
            <div
              key={goal.id || goal.name}
              className="p-3 bg-card rounded-xl flex justify-between items-center"
            >
              <div>
                <p className="text-sm font-medium text-primary">{goal.name}</p>
                <p className="text-xs text-secondary">
                  {getMonthName(goal.month)} {goal.year}
                </p>
              </div>
              <div className="text-right">
                <p className="text-sm font-bold text-primary">
                  kr {goal.currentAmount.toLocaleString("nb-NO")} / kr {goal.targetAmount.toLocaleString("nb-NO")}
                </p>
                <p className="text-xs text-accent-green">
                  {Math.round((goal.currentAmount / goal.targetAmount) * 100)}%
                </p>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Add New Goal */}
      <form onSubmit={handleSubmit} className="space-y-4">
        <h4 className="text-sm font-medium text-secondary">Legg til nytt mål</h4>

        <Input
          label="Navn på mål"
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="f.eks. Nødfond"
          required
        />

        <div className="grid grid-cols-2 gap-4">
          <Input
            label="Målbeløp"
            type="number"
            step="0.01"
            min="0"
            value={targetAmount}
            onChange={(e) => setTargetAmount(e.target.value)}
            placeholder="50000"
            required
          />
          <Input
            label="Nåværende beløp"
            type="number"
            step="0.01"
            min="0"
            value={currentAmount}
            onChange={(e) => setCurrentAmount(e.target.value)}
            placeholder="0"
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <Select
            label="Måned"
            value={String(month)}
            onChange={(e) => setMonth(parseInt(e.target.value))}
            options={months}
          />
          <Select
            label="År"
            value={String(year)}
            onChange={(e) => setYear(parseInt(e.target.value))}
            options={years}
          />
        </div>

        <Button type="submit" isLoading={isLoading} className="w-full">
          Legg til mål
        </Button>
      </form>
    </div>
  );
}
