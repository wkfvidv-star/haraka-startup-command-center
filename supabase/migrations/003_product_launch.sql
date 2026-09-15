-- 003_product_launch.sql

-- product_readiness_items table
CREATE TABLE IF NOT EXISTS product_readiness_items (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    company_id UUID NOT NULL REFERENCES companies(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    description TEXT,
    category TEXT,
    status TEXT,
    priority TEXT,
    owner_id UUID REFERENCES profiles(id) ON DELETE SET NULL,
    notes TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TRIGGER product_readiness_items_updated_at
BEFORE UPDATE ON product_readiness_items
FOR EACH ROW EXECUTE FUNCTION set_updated_at();

-- launch_categories table
CREATE TABLE IF NOT EXISTS launch_categories (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    company_id UUID NOT NULL REFERENCES companies(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    description TEXT,
    target_percentage NUMERIC,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TRIGGER launch_categories_updated_at
BEFORE UPDATE ON launch_categories
FOR EACH ROW EXECUTE FUNCTION set_updated_at();

-- launch_blockers table
CREATE TABLE IF NOT EXISTS launch_blockers (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    company_id UUID NOT NULL REFERENCES companies(id) ON DELETE CASCADE,
    title TEXT NOT NULL,
    description TEXT,
    severity TEXT,
    status TEXT,
    linked_task_id UUID REFERENCES tasks(id) ON DELETE SET NULL,
    owner_id UUID REFERENCES profiles(id) ON DELETE SET NULL,
    notes TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TRIGGER launch_blockers_updated_at
BEFORE UPDATE ON launch_blockers
FOR EACH ROW EXECUTE FUNCTION set_updated_at();
