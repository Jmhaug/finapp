"use client";

import { useState, useEffect, useCallback } from "react";
import { createClient } from "@/lib/supabase/client";
import type { StockHolding } from "@/types/database.types";

interface InsertHolding {
  user_id: string;
  date: string;
  total_value: number;
}

export function useStocks(days: number = 30) {
  const [holdings, setHoldings] = useState<StockHolding[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const supabase = createClient();

  const fetchHoldings = useCallback(async () => {
    setIsLoading(true);
    setError(null);

    try {
      const startDate = new Date();
      startDate.setDate(startDate.getDate() - days);

      const { data, error: fetchError } = await supabase
        .from("stock_holdings")
        .select("*")
        .gte("date", startDate.toISOString().split("T")[0])
        .order("date", { ascending: true });

      if (fetchError) throw fetchError;
      setHoldings((data as StockHolding[]) || []);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to fetch stock holdings");
    } finally {
      setIsLoading(false);
    }
  }, [supabase, days]);

  const addHolding = async (holding: InsertHolding) => {
    try {
      const { data, error: insertError } = await supabase
        .from("stock_holdings")
        .insert(holding as never)
        .select()
        .single();

      if (insertError) throw insertError;
      setHoldings((prev) =>
        [...prev, data as StockHolding].sort(
          (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()
        )
      );
      return { data: data as StockHolding, error: null };
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Failed to add holding";
      return { data: null, error: errorMessage };
    }
  };

  useEffect(() => {
    fetchHoldings();
  }, [fetchHoldings]);

  const latestValue =
    holdings.length > 0 ? holdings[holdings.length - 1].total_value : 0;

  const chartData = holdings.map((h) => ({
    date: h.date,
    value: h.total_value,
  }));

  return {
    holdings,
    latestValue,
    chartData,
    isLoading,
    error,
    refetch: fetchHoldings,
    addHolding,
  };
}
