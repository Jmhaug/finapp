-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Transactions table
CREATE TABLE IF NOT EXISTS transactions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES auth.users NOT NULL,
  amount DECIMAL(12, 2) NOT NULL,
  date DATE NOT NULL,
  category TEXT,
  type TEXT NOT NULL CHECK (type IN ('deposit', 'withdrawal')),
  description TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Savings goals table
CREATE TABLE IF NOT EXISTS savings_goals (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES auth.users NOT NULL,
  name TEXT NOT NULL,
  target_amount DECIMAL(12, 2) NOT NULL,
  current_amount DECIMAL(12, 2) DEFAULT 0,
  month INTEGER NOT NULL CHECK (month >= 0 AND month <= 11),
  year INTEGER NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Portfolio allocations table
CREATE TABLE IF NOT EXISTS portfolio_allocations (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES auth.users NOT NULL,
  asset_type TEXT NOT NULL CHECK (asset_type IN ('stocks', 'bonds', 'etfs', 'crypto', 'cash', 'real_estate')),
  amount DECIMAL(12, 2) NOT NULL,
  percentage DECIMAL(5, 2),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(user_id, asset_type)
);

-- Stock holdings table
CREATE TABLE IF NOT EXISTS stock_holdings (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES auth.users NOT NULL,
  date DATE NOT NULL,
  total_value DECIMAL(12, 2) NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Savings accounts table
CREATE TABLE IF NOT EXISTS savings_accounts (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES auth.users NOT NULL,
  account_name TEXT NOT NULL,
  balance DECIMAL(12, 2) NOT NULL,
  interest_rate DECIMAL(5, 2),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Row Level Security Policies
ALTER TABLE transactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE savings_goals ENABLE ROW LEVEL SECURITY;
ALTER TABLE portfolio_allocations ENABLE ROW LEVEL SECURITY;
ALTER TABLE stock_holdings ENABLE ROW LEVEL SECURITY;
ALTER TABLE savings_accounts ENABLE ROW LEVEL SECURITY;

-- Transactions policies
CREATE POLICY "Users can view own transactions" ON transactions
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own transactions" ON transactions
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own transactions" ON transactions
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own transactions" ON transactions
  FOR DELETE USING (auth.uid() = user_id);

-- Savings goals policies
CREATE POLICY "Users can view own goals" ON savings_goals
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own goals" ON savings_goals
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own goals" ON savings_goals
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own goals" ON savings_goals
  FOR DELETE USING (auth.uid() = user_id);

-- Portfolio allocations policies
CREATE POLICY "Users can view own allocations" ON portfolio_allocations
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own allocations" ON portfolio_allocations
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own allocations" ON portfolio_allocations
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own allocations" ON portfolio_allocations
  FOR DELETE USING (auth.uid() = user_id);

-- Stock holdings policies
CREATE POLICY "Users can view own holdings" ON stock_holdings
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own holdings" ON stock_holdings
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own holdings" ON stock_holdings
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own holdings" ON stock_holdings
  FOR DELETE USING (auth.uid() = user_id);

-- Savings accounts policies
CREATE POLICY "Users can view own accounts" ON savings_accounts
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own accounts" ON savings_accounts
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own accounts" ON savings_accounts
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own accounts" ON savings_accounts
  FOR DELETE USING (auth.uid() = user_id);

-- Indexes for better query performance
CREATE INDEX IF NOT EXISTS idx_transactions_user_date ON transactions(user_id, date);
CREATE INDEX IF NOT EXISTS idx_savings_goals_user_month_year ON savings_goals(user_id, month, year);
CREATE INDEX IF NOT EXISTS idx_portfolio_allocations_user ON portfolio_allocations(user_id);
CREATE INDEX IF NOT EXISTS idx_stock_holdings_user_date ON stock_holdings(user_id, date);
CREATE INDEX IF NOT EXISTS idx_savings_accounts_user ON savings_accounts(user_id);
