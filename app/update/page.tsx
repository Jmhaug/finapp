"use client";

import { useState } from "react";
import { Navigation } from "@/components/Navigation";
import { Card } from "@/components/ui";
import {
  AddTransactionForm,
  UpdatePortfolioForm,
  ManageGoalsForm,
  UpdateStocksForm,
  UpdateSavingsAccountForm,
} from "@/components/forms";

type Section = "transaction" | "portfolio" | "goals" | "stocks" | "savings";

const sections: { id: Section; label: string; icon: string }[] = [
  { id: "transaction", label: "Transaksjon", icon: "💰" },
  { id: "portfolio", label: "Portefølje", icon: "📊" },
  { id: "goals", label: "Mål", icon: "🎯" },
  { id: "stocks", label: "Aksjer", icon: "📈" },
  { id: "savings", label: "Sparekonto", icon: "🏦" },
];

export default function UpdatePage() {
  const [activeSection, setActiveSection] = useState<Section>("transaction");

  const handleTransactionSubmit = (data: {
    amount: number;
    date: string;
    category: string;
    type: "deposit" | "withdrawal";
    description: string;
  }) => {
    console.log("Transaction submitted:", data);
    // TODO: Save to Supabase
  };

  const handlePortfolioSubmit = (
    allocations: { asset_type: string; amount: number; label: string }[]
  ) => {
    console.log("Portfolio updated:", allocations);
    // TODO: Save to Supabase
  };

  const handleGoalSubmit = (goal: {
    name: string;
    targetAmount: number;
    currentAmount: number;
    month: number;
    year: number;
  }) => {
    console.log("Goal added:", goal);
    // TODO: Save to Supabase
  };

  const handleStocksSubmit = (data: { date: string; totalValue: number }) => {
    console.log("Stocks updated:", data);
    // TODO: Save to Supabase
  };

  const handleSavingsSubmit = (data: {
    accountName: string;
    balance: number;
    interestRate: number;
  }) => {
    console.log("Savings account updated:", data);
    // TODO: Save to Supabase
  };

  return (
    <div className="min-h-screen bg-background pb-24">
      {/* Header */}
      <header className="sticky top-0 bg-background/80 backdrop-blur-lg z-10 px-4 py-4 border-b border-secondary/10">
        <h1 className="text-xl font-bold text-primary">Oppdater</h1>
        <p className="text-sm text-secondary">Administrer økonomien din</p>
      </header>

      {/* Section Tabs */}
      <div className="px-4 py-3 overflow-x-auto">
        <div className="flex gap-2">
          {sections.map((section) => (
            <button
              key={section.id}
              onClick={() => setActiveSection(section.id)}
              className={`flex items-center gap-2 px-4 py-2 rounded-full whitespace-nowrap transition-colors ${
                activeSection === section.id
                  ? "bg-accent-green text-background"
                  : "bg-card text-secondary hover:bg-card-hover"
              }`}
            >
              <span>{section.icon}</span>
              <span className="text-sm font-medium">{section.label}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Main Content */}
      <main className="px-4 py-4">
        <Card>
          {activeSection === "transaction" && (
            <AddTransactionForm onSubmit={handleTransactionSubmit} />
          )}
          {activeSection === "portfolio" && (
            <UpdatePortfolioForm
              initialAllocations={[
                { asset_type: "stocks", amount: 450000, label: "Aksjer" },
                { asset_type: "bonds", amount: 150000, label: "Obligasjoner" },
                { asset_type: "etfs", amount: 250000, label: "ETF-er" },
                { asset_type: "crypto", amount: 80000, label: "Krypto" },
                { asset_type: "cash", amount: 70000, label: "Kontanter" },
                { asset_type: "real_estate", amount: 0, label: "Eiendom" },
              ]}
              onSubmit={handlePortfolioSubmit}
            />
          )}
          {activeSection === "goals" && (
            <ManageGoalsForm
              existingGoals={[
                {
                  id: "1",
                  name: "Nødfond",
                  targetAmount: 100000,
                  currentAmount: 65000,
                  month: 11,
                  year: 2024,
                },
              ]}
              onSubmit={handleGoalSubmit}
            />
          )}
          {activeSection === "stocks" && (
            <UpdateStocksForm
              currentValue={450000}
              onSubmit={handleStocksSubmit}
            />
          )}
          {activeSection === "savings" && (
            <UpdateSavingsAccountForm
              accountName="Høyrentekonto"
              currentBalance={125432.10}
              currentRate={4.5}
              onSubmit={handleSavingsSubmit}
            />
          )}
        </Card>
      </main>

      {/* Bottom Navigation */}
      <Navigation />
    </div>
  );
}
