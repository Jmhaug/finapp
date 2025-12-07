"use client";

import { useState } from "react";
import { Button, Input } from "@/components/ui";

interface UpdateStocksFormProps {
  currentValue?: number;
  onSubmit?: (data: { date: string; totalValue: number }) => void;
}

export function UpdateStocksForm({
  currentValue = 0,
  onSubmit,
}: UpdateStocksFormProps) {
  const [totalValue, setTotalValue] = useState(currentValue.toString());
  const [date, setDate] = useState(new Date().toISOString().split("T")[0]);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      onSubmit?.({
        date,
        totalValue: parseFloat(totalValue),
      });
    } catch (error) {
      console.error("Error updating stocks:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <Input
        label="Total aksjeverdi"
        type="number"
        step="0.01"
        min="0"
        value={totalValue}
        onChange={(e) => setTotalValue(e.target.value)}
        placeholder="0"
        required
      />

      <Input
        label="Per dato"
        type="date"
        value={date}
        onChange={(e) => setDate(e.target.value)}
        required
      />

      <Button type="submit" isLoading={isLoading} className="w-full">
        Oppdater aksjeverdi
      </Button>
    </form>
  );
}
