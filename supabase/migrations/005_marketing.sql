-- 005_marketing.sql

-- campaigns table
CREATE TABLE IF NOT EXISTS campaigns (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    company_id UUID NOT NULL REFERENCES companies(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    objective TEXT,
    channel TEXT,
    segment_id UUID REFERENCES market_segments(id) ON DELETE SET NULL,
    start_date TIMESTAMPTZ,
    end_date TIMESTAMPTZ,
    budget NUMERIC,
    status TEXT,
    leads_generated INTEGER,
    opportunities_generated INTEGER,
    customers_generated INTEGER,
    revenue_generated NUMERIC,
    notes TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TRIGGER campaigns_updated_at
BEFORE UPDATE ON campaigns
FOR EACH ROW EXECUTE FUNCTION set_updated_at();

-- content table
CREATE TABLE IF NOT EXISTS content (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    company_id UUID NOT NULL REFERENCES companies(id) ON DELETE CASCADE,
    title TEXT NOT NULL,
    platform TEXT,
    content_type TEXT,
    campaign_id UUID REFERENCES campaigns(id) ON DELETE SET NULL,
    segment_id UUID REFERENCES market_segments(id) ON DELETE SET NULL,
    publish_date TIMESTAMPTZ,
    status TEXT,
    cta TEXT,
    result TEXT,
    notes TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TRIGGER content_updated_at
BEFORE UPDATE ON content
FOR EACH ROW EXECUTE FUNCTION set_updated_at();
