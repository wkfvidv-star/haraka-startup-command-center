-- 009_incubation.sql

-- incubation_phases table
CREATE TABLE IF NOT EXISTS incubation_phases (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    company_id UUID NOT NULL REFERENCES companies(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    description TEXT,
    status TEXT,
    start_date TIMESTAMPTZ,
    end_date TIMESTAMPTZ,
    order_index INTEGER,
    notes TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TRIGGER incubation_phases_updated_at
BEFORE UPDATE ON incubation_phases
FOR EACH ROW EXECUTE FUNCTION set_updated_at();

-- deliverables table
CREATE TABLE IF NOT EXISTS deliverables (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    company_id UUID NOT NULL REFERENCES companies(id) ON DELETE CASCADE,
    phase_id UUID REFERENCES incubation_phases(id) ON DELETE CASCADE,
    title TEXT NOT NULL,
    description TEXT,
    status TEXT,
    due_date TIMESTAMPTZ,
    owner_id UUID REFERENCES profiles(id) ON DELETE SET NULL,
    notes TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TRIGGER deliverables_updated_at
BEFORE UPDATE ON deliverables
FOR EACH ROW EXECUTE FUNCTION set_updated_at();
