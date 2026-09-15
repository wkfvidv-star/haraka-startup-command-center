-- 004_market.sql

-- market_segments table
CREATE TABLE IF NOT EXISTS market_segments (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    company_id UUID NOT NULL REFERENCES companies(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    type TEXT,
    description TEXT,
    problem TEXT,
    value_proposition TEXT,
    priority TEXT,
    status TEXT,
    notes TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TRIGGER market_segments_updated_at
BEFORE UPDATE ON market_segments
FOR EACH ROW EXECUTE FUNCTION set_updated_at();

-- leads table
CREATE TABLE IF NOT EXISTS leads (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    company_id UUID NOT NULL REFERENCES companies(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    organization TEXT,
    contact_person TEXT,
    email TEXT,
    phone TEXT,
    city TEXT,
    segment_id UUID REFERENCES market_segments(id) ON DELETE SET NULL,
    source TEXT,
    status TEXT,
    interest_level TEXT,
    owner_id UUID REFERENCES profiles(id) ON DELETE SET NULL,
    last_contact_date TIMESTAMPTZ,
    next_follow_up_date TIMESTAMPTZ,
    notes TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TRIGGER leads_updated_at
BEFORE UPDATE ON leads
FOR EACH ROW EXECUTE FUNCTION set_updated_at();

-- offers table
CREATE TABLE IF NOT EXISTS offers (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    company_id UUID NOT NULL REFERENCES companies(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    target_segment TEXT,
    type TEXT,
    description TEXT,
    price NUMERIC,
    billing_model TEXT,
    status TEXT,
    notes TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TRIGGER offers_updated_at
BEFORE UPDATE ON offers
FOR EACH ROW EXECUTE FUNCTION set_updated_at();

-- opportunities table
CREATE TABLE IF NOT EXISTS opportunities (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    company_id UUID NOT NULL REFERENCES companies(id) ON DELETE CASCADE,
    lead_id UUID REFERENCES leads(id) ON DELETE SET NULL,
    organization TEXT,
    title TEXT NOT NULL,
    segment_id UUID REFERENCES market_segments(id) ON DELETE SET NULL,
    offer_id UUID REFERENCES offers(id) ON DELETE SET NULL,
    stage TEXT,
    estimated_value NUMERIC,
    probability NUMERIC,
    expected_close_date TIMESTAMPTZ,
    owner_id UUID REFERENCES profiles(id) ON DELETE SET NULL,
    last_activity_date TIMESTAMPTZ,
    next_action TEXT,
    notes TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TRIGGER opportunities_updated_at
BEFORE UPDATE ON opportunities
FOR EACH ROW EXECUTE FUNCTION set_updated_at();

-- pilots table
CREATE TABLE IF NOT EXISTS pilots (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    company_id UUID NOT NULL REFERENCES companies(id) ON DELETE CASCADE,
    opportunity_id UUID REFERENCES opportunities(id) ON DELETE SET NULL,
    organization TEXT,
    segment_id UUID REFERENCES market_segments(id) ON DELETE SET NULL,
    objective TEXT,
    start_date TIMESTAMPTZ,
    end_date TIMESTAMPTZ,
    status TEXT,
    participants TEXT,
    success_criteria TEXT,
    participation_score NUMERIC,
    satisfaction_score NUMERIC,
    technical_score NUMERIC,
    objective_score NUMERIC,
    result TEXT,
    conversion_potential TEXT,
    owner_id UUID REFERENCES profiles(id) ON DELETE SET NULL,
    feedback TEXT,
    next_action TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TRIGGER pilots_updated_at
BEFORE UPDATE ON pilots
FOR EACH ROW EXECUTE FUNCTION set_updated_at();

-- customers table
CREATE TABLE IF NOT EXISTS customers (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    company_id UUID NOT NULL REFERENCES companies(id) ON DELETE CASCADE,
    organization TEXT NOT NULL,
    contact_person TEXT,
    email TEXT,
    phone TEXT,
    segment_id UUID REFERENCES market_segments(id) ON DELETE SET NULL,
    offer_id UUID REFERENCES offers(id) ON DELETE SET NULL,
    status TEXT,
    contract_value NUMERIC,
    billing_model TEXT,
    start_date TIMESTAMPTZ,
    renewal_date TIMESTAMPTZ,
    active_users INTEGER,
    satisfaction TEXT,
    renewal_probability NUMERIC,
    last_activity_date TIMESTAMPTZ,
    next_action TEXT,
    notes TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TRIGGER customers_updated_at
BEFORE UPDATE ON customers
FOR EACH ROW EXECUTE FUNCTION set_updated_at();

-- partnerships table
CREATE TABLE IF NOT EXISTS partnerships (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    company_id UUID NOT NULL REFERENCES companies(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    organization TEXT,
    type TEXT,
    contact_person TEXT,
    status TEXT,
    objective TEXT,
    potential_value NUMERIC,
    owner_id UUID REFERENCES profiles(id) ON DELETE SET NULL,
    next_action TEXT,
    notes TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TRIGGER partnerships_updated_at
BEFORE UPDATE ON partnerships
FOR EACH ROW EXECUTE FUNCTION set_updated_at();
