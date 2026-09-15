-- 006_finance.sql

-- funding_sources table
CREATE TABLE IF NOT EXISTS funding_sources (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    company_id UUID NOT NULL REFERENCES companies(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    source_type TEXT,
    amount NUMERIC,
    received_date TIMESTAMPTZ,
    status TEXT,
    notes TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TRIGGER funding_sources_updated_at
BEFORE UPDATE ON funding_sources
FOR EACH ROW EXECUTE FUNCTION set_updated_at();

-- expenses table
CREATE TABLE IF NOT EXISTS expenses (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    company_id UUID NOT NULL REFERENCES companies(id) ON DELETE CASCADE,
    category TEXT,
    description TEXT,
    planned_amount NUMERIC,
    actual_amount NUMERIC,
    status TEXT,
    expense_date TIMESTAMPTZ,
    owner_id UUID REFERENCES profiles(id) ON DELETE SET NULL,
    notes TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TRIGGER expenses_updated_at
BEFORE UPDATE ON expenses
FOR EACH ROW EXECUTE FUNCTION set_updated_at();

-- financial_allocations table
CREATE TABLE IF NOT EXISTS financial_allocations (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    company_id UUID NOT NULL REFERENCES companies(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    category TEXT,
    description TEXT,
    allocated_amount NUMERIC,
    spent_amount NUMERIC,
    priority TEXT,
    status TEXT,
    linked_goal_id UUID REFERENCES goals(id) ON DELETE SET NULL,
    linked_initiative_id UUID REFERENCES initiatives(id) ON DELETE SET NULL,
    notes TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TRIGGER financial_allocations_updated_at
BEFORE UPDATE ON financial_allocations
FOR EACH ROW EXECUTE FUNCTION set_updated_at();

-- funding_milestones table
CREATE TABLE IF NOT EXISTS funding_milestones (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    company_id UUID NOT NULL REFERENCES companies(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    description TEXT,
    target_budget NUMERIC,
    spent_amount NUMERIC,
    status TEXT,
    target_date TIMESTAMPTZ,
    linked_goal_id UUID REFERENCES goals(id) ON DELETE SET NULL,
    linked_initiative_id UUID REFERENCES initiatives(id) ON DELETE SET NULL,
    notes TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TRIGGER funding_milestones_updated_at
BEFORE UPDATE ON funding_milestones
FOR EACH ROW EXECUTE FUNCTION set_updated_at();

-- financial_snapshots table
CREATE TABLE IF NOT EXISTS financial_snapshots (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    company_id UUID NOT NULL REFERENCES companies(id) ON DELETE CASCADE,
    snapshot_date TIMESTAMPTZ,
    cash_balance NUMERIC,
    monthly_cash_inflow NUMERIC,
    monthly_expenses NUMERIC,
    net_burn NUMERIC,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- financial_scenarios table
CREATE TABLE IF NOT EXISTS financial_scenarios (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    company_id UUID NOT NULL REFERENCES companies(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    type TEXT,
    description TEXT,
    monthly_revenue NUMERIC,
    monthly_expenses NUMERIC,
    available_cash NUMERIC,
    status TEXT,
    notes TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TRIGGER financial_scenarios_updated_at
BEFORE UPDATE ON financial_scenarios
FOR EACH ROW EXECUTE FUNCTION set_updated_at();
