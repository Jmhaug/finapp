"use client";

import { useState } from "react";
import { Button, Input } from "@/components/ui";

interface Allocation {
  asset_type: string;
  amount: number;
  label: string;
}

interface UpdatePortfolioFormProps {
  initialAllocations?: Allocation[];
  onSubmit?: (allocations: Allocation[]) => void;
}

const defaultAllocations: Allocation[] = [
  { asset_type: "stocks", amount: 0, label: "Aksjer" },
  { asset_type: "bonds", amount: 0, label: "Obligasjoner" },
  { asset_type: "etfs", amount: 0, label: "ETF-er" },
  { asset_type: "crypto", amount: 0, label: "Krypto" },
  { asset_type: "cash", amount: 0, label: "Kontanter" },
  { asset_type: "real_estate", amount: 0, label: "Eiendom" },
];

export function UpdatePortfolioForm({
  initialAllocations = defaultAllocations,
  onSubmit,
}: UpdatePortfolioFormProps) {
  const [allocations, setAllocations] = useState(initialAllocations);
  const [isLoading, setIsLoading] = useState(false);

  const total = allocations.reduce((sum, a) => sum + a.amount, 0);

  const handleChange = (asset_type: string, value: string) => {
    setAllocations((prev) =>
      prev.map((a) =>
        a.asset_type === asset_type
          ? { ...a, amount: parseFloat(value) || 0 }
          : a
      )
    );
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      onSubmit?.(allocations);
    } catch (error) {
      console.error("Error updating portfolio:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid grid-cols-2 gap-4">
        {allocations.map((allocation) => (
          <Input
            key={allocation.asset_type}
            label={allocation.label}
            type="number"
            step="0.01"
            min="0"
            value={allocation.amount || ""}
            onChange={(e) => handleChange(allocation.asset_type, e.target.value)}
            placeholder="0.00"
          />
        ))}
      </div>

      <div className="p-4 bg-card rounded-2xl">
        <div className="flex justify-between text-sm">
          <span className="text-secondary">Total porteføljeverdi</span>
          <span className="text-primary font-bold">
            kr {total.toLocaleString("nb-NO", { minimumFractionDigits: 2 })}
          </span>
        </div>
      </div>

      <Button type="submit" isLoading={isLoading} className="w-full">
        Oppdater portefølje
      </Button>
    </form>
  );
}
