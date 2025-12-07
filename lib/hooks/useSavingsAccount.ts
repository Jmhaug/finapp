"use client";

import { useState, useEffect, useCallback } from "react";
import { createClient } from "@/lib/supabase/client";
import type { SavingsAccount } from "@/types/database.types";

interface InsertAccount {
  user_id: string;
  account_name: string;
  balance: number;
  interest_rate?: number;
}

interface UpdateAccount {
  account_name?: string;
  balance?: number;
  interest_rate?: number;
}

export function useSavingsAccount() {
  const [account, setAccount] = useState<SavingsAccount | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const supabase = createClient();

  const fetchAccount = useCallback(async () => {
    setIsLoading(true);
    setError(null);

    try {
      const { data, error: fetchError } = await supabase
        .from("savings_accounts")
        .select("*")
        .order("updated_at", { ascending: false })
        .limit(1)
        .single();

      if (fetchError && fetchError.code !== "PGRST116") throw fetchError;
      setAccount(data ? (data as SavingsAccount) : null);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to fetch savings account");
    } finally {
      setIsLoading(false);
    }
  }, [supabase]);

  const updateAccount = async (updates: UpdateAccount) => {
    if (!account) return { data: null, error: "No account to update" };

    try {
      const { data, error: updateError } = await supabase
        .from("savings_accounts")
        .update(updates as never)
        .eq("id", account.id)
        .select()
        .single();

      if (updateError) throw updateError;
      setAccount(data as SavingsAccount);
      return { data: data as SavingsAccount, error: null };
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Failed to update account";
      return { data: null, error: errorMessage };
    }
  };

  const createAccount = async (newAccount: InsertAccount) => {
    try {
      const { data, error: insertError } = await supabase
        .from("savings_accounts")
        .insert(newAccount as never)
        .select()
        .single();

      if (insertError) throw insertError;
      setAccount(data as SavingsAccount);
      return { data: data as SavingsAccount, error: null };
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Failed to create account";
      return { data: null, error: errorMessage };
    }
  };

  useEffect(() => {
    fetchAccount();
  }, [fetchAccount]);

  return {
    account,
    isLoading,
    error,
    refetch: fetchAccount,
    updateAccount,
    createAccount,
  };
}
