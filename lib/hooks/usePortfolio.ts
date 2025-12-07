"use client";

import { useState, useEffect, useCallback } from "react";
import { createClient } from "@/lib/supabase/client";
import type { PortfolioAllocation } from "@/types/database.types";

interface InsertAllocation {
  user_id: string;
  asset_type: string;
  amount: number;
  percentage?: number;
}

interface UpdateAllocation {
  amount?: number;
  percentage?: number;
}

export function usePortfolio() {
  const [allocations, setAllocations] = useState<PortfolioAllocation[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const supabase = createClient();

  const fetchAllocations = useCallback(async () => {
    setIsLoading(true);
    setError(null);

    try {
      const { data, error: fetchError } = await supabase
        .from("portfolio_allocations")
        .select("*")
        .order("amount", { ascending: false });

      if (fetchError) throw fetchError;
      setAllocations((data as PortfolioAllocation[]) || []);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to fetch portfolio");
    } finally {
      setIsLoading(false);
    }
  }, [supabase]);

  const updateAllocation = async (id: string, updates: UpdateAllocation) => {
    try {
      const { data, error: updateError } = await supabase
        .from("portfolio_allocations")
        .update(updates as never)
        .eq("id", id)
        .select()
        .single();

      if (updateError) throw updateError;
      setAllocations((prev) =>
        prev.map((a) => (a.id === id ? (data as PortfolioAllocation) : a))
      );
      return { data: data as PortfolioAllocation, error: null };
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Failed to update allocation";
      return { data: null, error: errorMessage };
    }
  };

  const upsertAllocations = async (allocations: InsertAllocation[]) => {
    try {
      const { data, error: upsertError } = await supabase
        .from("portfolio_allocations")
        .upsert(allocations as never[], { onConflict: "user_id,asset_type" })
        .select();

      if (upsertError) throw upsertError;
      setAllocations((data as PortfolioAllocation[]) || []);
      return { data: data as PortfolioAllocation[], error: null };
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Failed to update portfolio";
      return { data: null, error: errorMessage };
    }
  };

  useEffect(() => {
    fetchAllocations();
  }, [fetchAllocations]);

  const total = allocations.reduce((sum, a) => sum + a.amount, 0);

  return {
    allocations,
    total,
    isLoading,
    error,
    refetch: fetchAllocations,
    updateAllocation,
    upsertAllocations,
  };
}
