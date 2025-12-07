"use client";

import { useState, useEffect, useCallback } from "react";
import { createClient } from "@/lib/supabase/client";
import type { Transaction } from "@/types/database.types";

interface InsertTransaction {
  user_id: string;
  amount: number;
  date: string;
  category?: string;
  type: "deposit" | "withdrawal";
  description?: string;
}

export function useTransactions(month?: number, year?: number) {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const supabase = createClient();

  const fetchTransactions = useCallback(async () => {
    setIsLoading(true);
    setError(null);

    try {
      let query = supabase
        .from("transactions")
        .select("*")
        .order("date", { ascending: false });

      if (month !== undefined && year !== undefined) {
        const startDate = new Date(year, month, 1).toISOString().split("T")[0];
        const endDate = new Date(year, month + 1, 0).toISOString().split("T")[0];
        query = query.gte("date", startDate).lte("date", endDate);
      }

      const { data, error: fetchError } = await query;

      if (fetchError) throw fetchError;
      setTransactions((data as Transaction[]) || []);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to fetch transactions");
    } finally {
      setIsLoading(false);
    }
  }, [supabase, month, year]);

  const addTransaction = async (transaction: InsertTransaction) => {
    try {
      const { data, error: insertError } = await supabase
        .from("transactions")
        .insert(transaction as never)
        .select()
        .single();

      if (insertError) throw insertError;
      setTransactions((prev) => [data as Transaction, ...prev]);
      return { data: data as Transaction, error: null };
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Failed to add transaction";
      return { data: null, error: errorMessage };
    }
  };

  const deleteTransaction = async (id: string) => {
    try {
      const { error: deleteError } = await supabase
        .from("transactions")
        .delete()
        .eq("id", id);

      if (deleteError) throw deleteError;
      setTransactions((prev) => prev.filter((t) => t.id !== id));
      return { error: null };
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Failed to delete transaction";
      return { error: errorMessage };
    }
  };

  useEffect(() => {
    fetchTransactions();
  }, [fetchTransactions]);

  return {
    transactions,
    isLoading,
    error,
    refetch: fetchTransactions,
    addTransaction,
    deleteTransaction,
  };
}

export function useDailyTransactions(month: number, year: number) {
  const { transactions, isLoading, error } = useTransactions(month, year);

  const dailyData = transactions.reduce<Record<number, number>>((acc, t) => {
    const day = new Date(t.date).getDate();
    const amount = t.type === "deposit" ? t.amount : -t.amount;
    acc[day] = (acc[day] || 0) + amount;
    return acc;
  }, {});

  const chartData = Object.entries(dailyData).map(([day, amount]) => ({
    day: parseInt(day),
    amount,
  }));

  return { dailyData: chartData, isLoading, error };
}
