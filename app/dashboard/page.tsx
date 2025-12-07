"use client";

import { Navigation } from "@/components/Navigation";
import {
  SavingsBarChart,
  MonthlySavingsCard,
  PortfolioCard,
  SavingsAccountCard,
  StocksCard,
} from "@/components/cards";

// Mock data - replace with real data from Supabase hooks
const mockMonthlyData = Array.from({ length: 12 }, (_, i) => ({
  month: i,
  amount: Math.floor(Math.random() * 8000) + 2000,
}));

const mockPortfolio = [
  { asset_type: "stocks", amount: 450000 },
  { asset_type: "bonds", amount: 150000 },
  { asset_type: "etfs", amount: 250000 },
  { asset_type: "crypto", amount: 80000 },
  { asset_type: "cash", amount: 70000 },
];

const mockStockHistory = Array.from({ length: 30 }, (_, i) => ({
  date: `2024-12-${String(i + 1).padStart(2, "0")}`,
  value: 450000 + (i - 15) * 5000 + Math.random() * 10000,
}));

export default function DashboardPage() {
  return (
    <div className="min-h-screen bg-background pb-24">
      {/* Header */}
      <header className="sticky top-0 bg-background/80 backdrop-blur-lg z-10 px-4 py-4 border-b border-secondary/10">
        <h1 className="text-xl font-bold text-primary">Oversikt</h1>
        <p className="text-sm text-secondary">Din økonomiske oversikt</p>
      </header>

      {/* Main Content */}
      <main className="px-4 py-4 space-y-4">
        {/* Top Chart */}
        <SavingsBarChart data={mockMonthlyData} />

        {/* 2x2 Grid of Cards */}
        <div className="grid grid-cols-2 gap-4">
          <MonthlySavingsCard
            currentAmount={32500}
            targetAmount={50000}
          />
          <PortfolioCard allocations={mockPortfolio} />
          <SavingsAccountCard
            balance={125432.10}
            interestRate={4.5}
          />
          <StocksCard totalValue={450000} history={mockStockHistory} />
        </div>
      </main>

      {/* Bottom Navigation */}
      <Navigation />
    </div>
  );
}
