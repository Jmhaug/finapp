"use client";

import { useState } from "react";
import { Button, Input, Select } from "@/components/ui";

interface AddTransactionFormProps {
  onSubmit?: (data: {
    amount: number;
    date: string;
    category: string;
    type: "deposit" | "withdrawal";
    description: string;
  }) => void;
}

export function AddTransactionForm({ onSubmit }: AddTransactionFormProps) {
  const [amount, setAmount] = useState("");
  const [date, setDate] = useState(new Date().toISOString().split("T")[0]);
  const [category, setCategory] = useState("savings");
  const [type, setType] = useState<"deposit" | "withdrawal">("deposit");
  const [description, setDescription] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      onSubmit?.({
        amount: parseFloat(amount),
        date,
        category,
        type,
        description,
      });

      // Reset form
      setAmount("");
      setDescription("");
    } catch (error) {
      console.error("Error adding transaction:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid grid-cols-2 gap-4">
        <Input
          label="Beløp"
          type="number"
          step="0.01"
          min="0"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          placeholder="0,00"
          required
        />
        <Input
          label="Dato"
          type="date"
          value={date}
          onChange={(e) => setDate(e.target.value)}
          required
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <Select
          label="Kategori"
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          options={[
            { value: "savings", label: "Sparing" },
            { value: "investment", label: "Investering" },
            { value: "emergency", label: "Nødfond" },
            { value: "retirement", label: "Pensjon" },
            { value: "other", label: "Annet" },
          ]}
        />
        <Select
          label="Type"
          value={type}
          onChange={(e) => setType(e.target.value as "deposit" | "withdrawal")}
          options={[
            { value: "deposit", label: "Innskudd" },
            { value: "withdrawal", label: "Uttak" },
          ]}
        />
      </div>

      <Input
        label="Beskrivelse (valgfritt)"
        type="text"
        value={description}
        onChange={(e) => setDescription(e.target.value)}
        placeholder="Hva er dette for?"
      />

      <Button type="submit" isLoading={isLoading} className="w-full">
        Legg til transaksjon
      </Button>
    </form>
  );
}
