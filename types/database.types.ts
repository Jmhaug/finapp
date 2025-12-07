export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[];

export interface Database {
  public: {
    Tables: {
      transactions: {
        Row: {
          id: string;
          user_id: string;
          amount: number;
          date: string;
          category: string | null;
          type: "deposit" | "withdrawal";
          description: string | null;
          created_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          amount: number;
          date: string;
          category?: string | null;
          type: "deposit" | "withdrawal";
          description?: string | null;
          created_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          amount?: number;
          date?: string;
          category?: string | null;
          type?: "deposit" | "withdrawal";
          description?: string | null;
          created_at?: string;
        };
      };
      savings_goals: {
        Row: {
          id: string;
          user_id: string;
          name: string;
          target_amount: number;
          current_amount: number;
          month: number;
          year: number;
          created_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          name: string;
          target_amount: number;
          current_amount?: number;
          month: number;
          year: number;
          created_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          name?: string;
          target_amount?: number;
          current_amount?: number;
          month?: number;
          year?: number;
          created_at?: string;
        };
      };
      portfolio_allocations: {
        Row: {
          id: string;
          user_id: string;
          asset_type: "stocks" | "bonds" | "etfs" | "crypto" | "cash" | "real_estate";
          amount: number;
          percentage: number | null;
          updated_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          asset_type: "stocks" | "bonds" | "etfs" | "crypto" | "cash" | "real_estate";
          amount: number;
          percentage?: number | null;
          updated_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          asset_type?: "stocks" | "bonds" | "etfs" | "crypto" | "cash" | "real_estate";
          amount?: number;
          percentage?: number | null;
          updated_at?: string;
        };
      };
      stock_holdings: {
        Row: {
          id: string;
          user_id: string;
          date: string;
          total_value: number;
          created_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          date: string;
          total_value: number;
          created_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          date?: string;
          total_value?: number;
          created_at?: string;
        };
      };
      savings_accounts: {
        Row: {
          id: string;
          user_id: string;
          account_name: string;
          balance: number;
          interest_rate: number | null;
          updated_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          account_name: string;
          balance: number;
          interest_rate?: number | null;
          updated_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          account_name?: string;
          balance?: number;
          interest_rate?: number | null;
          updated_at?: string;
        };
      };
    };
    Views: {
      [_ in never]: never;
    };
    Functions: {
      [_ in never]: never;
    };
    Enums: {
      [_ in never]: never;
    };
  };
}

// Helper types
export type Tables<T extends keyof Database["public"]["Tables"]> =
  Database["public"]["Tables"][T]["Row"];
export type InsertTables<T extends keyof Database["public"]["Tables"]> =
  Database["public"]["Tables"][T]["Insert"];
export type UpdateTables<T extends keyof Database["public"]["Tables"]> =
  Database["public"]["Tables"][T]["Update"];

// Convenience types
export type Transaction = Tables<"transactions">;
export type SavingsGoal = Tables<"savings_goals">;
export type PortfolioAllocation = Tables<"portfolio_allocations">;
export type StockHolding = Tables<"stock_holdings">;
export type SavingsAccount = Tables<"savings_accounts">;
