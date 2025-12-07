"use client";

import { useState } from "react";
import { Button, Input } from "@/components/ui";

interface UpdateSavingsAccountFormProps {
  currentBalance?: number;
  currentRate?: number;
  accountName?: string;
  onSubmit?: (data: {
    accountName: string;
    balance: number;
    interestRate: number;
  }) => void;
}

export function UpdateSavingsAccountForm({
  currentBalance = 0,
  currentRate = 0,
  accountName: initialName = "",
  onSubmit,
}: UpdateSavingsAccountFormProps) {
  const [accountName, setAccountName] = useState(initialName);
  const [balance, setBalance] = useState(currentBalance.toString());
  const [interestRate, setInterestRate] = useState(currentRate.toString());
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      onSubmit?.({
        accountName,
        balance: parseFloat(balance),
        interestRate: parseFloat(interestRate),
      });
    } catch (error) {
      console.error("Error updating savings account:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <Input
        label="Kontonavn"
        type="text"
        value={accountName}
        onChange={(e) => setAccountName(e.target.value)}
        placeholder="f.eks. Høyrentekonto"
        required
      />

      <div className="grid grid-cols-2 gap-4">
        <Input
          label="Saldo"
          type="number"
          step="0.01"
          min="0"
          value={balance}
          onChange={(e) => setBalance(e.target.value)}
          placeholder="0"
          required
        />
        <Input
          label="Rente (%)"
          type="number"
          step="0.01"
          min="0"
          max="100"
          value={interestRate}
          onChange={(e) => setInterestRate(e.target.value)}
          placeholder="4,5"
        />
      </div>

      <Button type="submit" isLoading={isLoading} className="w-full">
        Oppdater sparekonto
      </Button>
    </form>
  );
}
