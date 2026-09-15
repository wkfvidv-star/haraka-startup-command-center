-- 007_governance.sql

-- governance_profiles table
CREATE TABLE IF NOT EXISTS governance_profiles (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    company_id UUID NOT NULL REFERENCES companies(id) ON DELETE CASCADE,
    company_stage TEXT,
    legal_status TEXT,
    incubation_status TEXT,
    startup_status TEXT,
    current_strategic_phase TEXT,
    founder_count INTEGER,
    important_notes TEXT,
    next_governance_review_date TIMESTAMPTZ,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TRIGGER governance_profiles_updated_at
BEFORE UPDATE ON governance_profiles
FOR EACH ROW EXECUTE FUNCTION set_updated_at();

-- documents table
CREATE TABLE IF NOT EXISTS documents (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    company_id UUID NOT NULL REFERENCES companies(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    category TEXT,
    status TEXT,
    owner_id UUID REFERENCES profiles(id) ON DELETE SET NULL,
    document_date TIMESTAMPTZ,
    expiry_date TIMESTAMPTZ,
    related_project_id UUID REFERENCES projects(id) ON DELETE SET NULL,
    related_goal_id UUID REFERENCES goals(id) ON DELETE SET NULL,
    storage_path TEXT,
    notes TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TRIGGER documents_updated_at
BEFORE UPDATE ON documents
FOR EACH ROW EXECUTE FUNCTION set_updated_at();

-- obligations table
CREATE TABLE IF NOT EXISTS obligations (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    company_id UUID NOT NULL REFERENCES companies(id) ON DELETE CASCADE,
    title TEXT NOT NULL,
    description TEXT,
    type TEXT,
    priority TEXT,
    due_date TIMESTAMPTZ,
    owner_id UUID REFERENCES profiles(id) ON DELETE SET NULL,
    status TEXT,
    related_document_id UUID REFERENCES documents(id) ON DELETE SET NULL,
    related_project_id UUID REFERENCES projects(id) ON DELETE SET NULL,
    notes TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TRIGGER obligations_updated_at
BEFORE UPDATE ON obligations
FOR EACH ROW EXECUTE FUNCTION set_updated_at();

-- contracts table
CREATE TABLE IF NOT EXISTS contracts (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    company_id UUID NOT NULL REFERENCES companies(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    counterparty TEXT,
    type TEXT,
    start_date TIMESTAMPTZ,
    end_date TIMESTAMPTZ,
    value NUMERIC,
    status TEXT,
    renewal_date TIMESTAMPTZ,
    owner_id UUID REFERENCES profiles(id) ON DELETE SET NULL,
    notes TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TRIGGER contracts_updated_at
BEFORE UPDATE ON contracts
FOR EACH ROW EXECUTE FUNCTION set_updated_at();

-- ip_assets table
CREATE TABLE IF NOT EXISTS ip_assets (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    company_id UUID NOT NULL REFERENCES companies(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    type TEXT,
    description TEXT,
    status TEXT,
    owner_id UUID REFERENCES profiles(id) ON DELETE SET NULL,
    registration_date TIMESTAMPTZ,
    review_date TIMESTAMPTZ,
    protection_status TEXT,
    storage_path TEXT,
    notes TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TRIGGER ip_assets_updated_at
BEFORE UPDATE ON ip_assets
FOR EACH ROW EXECUTE FUNCTION set_updated_at();
