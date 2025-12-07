"use client";

import { useState, useEffect, useCallback } from "react";
import { createClient } from "@/lib/supabase/client";
import type { SavingsGoal } from "@/types/database.types";

interface InsertGoal {
  user_id: string;
  name: string;
  target_amount: number;
  current_amount?: number;
  month: number;
  year: number;
}

interface UpdateGoal {
  name?: string;
  target_amount?: number;
  current_amount?: number;
  month?: number;
  year?: number;
}

export function useGoals(month?: number, year?: number) {
  const [goals, setGoals] = useState<SavingsGoal[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const supabase = createClient();

  const fetchGoals = useCallback(async () => {
    setIsLoading(true);
    setError(null);

    try {
      let query = supabase
        .from("savings_goals")
        .select("*")
        .order("year", { ascending: false })
        .order("month", { ascending: false });

      if (month !== undefined && year !== undefined) {
        query = query.eq("month", month).eq("year", year);
      }

      const { data, error: fetchError } = await query;

      if (fetchError) throw fetchError;
      setGoals((data as SavingsGoal[]) || []);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to fetch goals");
    } finally {
      setIsLoading(false);
    }
  }, [supabase, month, year]);

  const addGoal = async (goal: InsertGoal) => {
    try {
      const { data, error: insertError } = await supabase
        .from("savings_goals")
        .insert(goal as never)
        .select()
        .single();

      if (insertError) throw insertError;
      setGoals((prev) => [data as SavingsGoal, ...prev]);
      return { data: data as SavingsGoal, error: null };
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Failed to add goal";
      return { data: null, error: errorMessage };
    }
  };

  const updateGoal = async (id: string, updates: UpdateGoal) => {
    try {
      const { data, error: updateError } = await supabase
        .from("savings_goals")
        .update(updates as never)
        .eq("id", id)
        .select()
        .single();

      if (updateError) throw updateError;
      setGoals((prev) => prev.map((g) => (g.id === id ? (data as SavingsGoal) : g)));
      return { data: data as SavingsGoal, error: null };
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Failed to update goal";
      return { data: null, error: errorMessage };
    }
  };

  const deleteGoal = async (id: string) => {
    try {
      const { error: deleteError } = await supabase
        .from("savings_goals")
        .delete()
        .eq("id", id);

      if (deleteError) throw deleteError;
      setGoals((prev) => prev.filter((g) => g.id !== id));
      return { error: null };
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Failed to delete goal";
      return { error: errorMessage };
    }
  };

  useEffect(() => {
    fetchGoals();
  }, [fetchGoals]);

  return {
    goals,
    isLoading,
    error,
    refetch: fetchGoals,
    addGoal,
    updateGoal,
    deleteGoal,
  };
}

export function useCurrentMonthGoal() {
  const now = new Date();
  const { goals, isLoading, error, updateGoal } = useGoals(
    now.getMonth(),
    now.getFullYear()
  );

  const currentGoal = goals[0] || null;

  return { currentGoal, isLoading, error, updateGoal };
}
