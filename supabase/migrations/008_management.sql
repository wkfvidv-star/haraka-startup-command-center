-- 008_management.sql

-- meetings table
CREATE TABLE IF NOT EXISTS meetings (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    company_id UUID NOT NULL REFERENCES companies(id) ON DELETE CASCADE,
    title TEXT NOT NULL,
    type TEXT,
    date TIMESTAMPTZ,
    participants TEXT,
    objective TEXT,
    notes TEXT,
    decisions TEXT,
    next_meeting_date TIMESTAMPTZ,
    status TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TRIGGER meetings_updated_at
BEFORE UPDATE ON meetings
FOR EACH ROW EXECUTE FUNCTION set_updated_at();

-- Add foreign key to tasks now that meetings exist
ALTER TABLE tasks
ADD CONSTRAINT fk_meeting
FOREIGN KEY (meeting_id) 
REFERENCES meetings(id) 
ON DELETE SET NULL;

-- risks table
CREATE TABLE IF NOT EXISTS risks (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    company_id UUID NOT NULL REFERENCES companies(id) ON DELETE CASCADE,
    title TEXT NOT NULL,
    description TEXT,
    category TEXT,
    probability TEXT,
    impact TEXT,
    severity TEXT,
    status TEXT,
    owner_id UUID REFERENCES profiles(id) ON DELETE SET NULL,
    mitigation TEXT,
    notes TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TRIGGER risks_updated_at
BEFORE UPDATE ON risks
FOR EACH ROW EXECUTE FUNCTION set_updated_at();

-- decisions table
CREATE TABLE IF NOT EXISTS decisions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    company_id UUID NOT NULL REFERENCES companies(id) ON DELETE CASCADE,
    title TEXT NOT NULL,
    description TEXT,
    reason TEXT,
    options TEXT,
    selected_option TEXT,
    expected_impact TEXT,
    actual_impact TEXT,
    owner_id UUID REFERENCES profiles(id) ON DELETE SET NULL,
    priority TEXT,
    status TEXT,
    decision_date TIMESTAMPTZ,
    review_date TIMESTAMPTZ,
    notes TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TRIGGER decisions_updated_at
BEFORE UPDATE ON decisions
FOR EACH ROW EXECUTE FUNCTION set_updated_at();

-- kpis table
CREATE TABLE IF NOT EXISTS kpis (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    company_id UUID NOT NULL REFERENCES companies(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    category TEXT,
    target NUMERIC,
    current NUMERIC,
    unit TEXT,
    period TEXT,
    owner_id UUID REFERENCES profiles(id) ON DELETE SET NULL,
    status TEXT,
    notes TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TRIGGER kpis_updated_at
BEFORE UPDATE ON kpis
FOR EACH ROW EXECUTE FUNCTION set_updated_at();
