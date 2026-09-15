-- 011_rls.sql

-- Helper function to check if the current user is a member of the company
CREATE OR REPLACE FUNCTION is_company_member(company_id UUID)
RETURNS BOOLEAN AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 
    FROM company_members cm
    JOIN profiles p ON p.id = cm.profile_id
    WHERE cm.company_id = $1 
    AND p.auth_user_id = auth.uid()
    AND cm.status = 'Active'
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Enable RLS on all tables
ALTER TABLE companies ENABLE ROW LEVEL SECURITY;
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE company_members ENABLE ROW LEVEL SECURITY;
ALTER TABLE goals ENABLE ROW LEVEL SECURITY;
ALTER TABLE initiatives ENABLE ROW LEVEL SECURITY;
ALTER TABLE projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE tasks ENABLE ROW LEVEL SECURITY;
ALTER TABLE product_readiness_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE launch_categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE launch_blockers ENABLE ROW LEVEL SECURITY;
ALTER TABLE market_segments ENABLE ROW LEVEL SECURITY;
ALTER TABLE leads ENABLE ROW LEVEL SECURITY;
ALTER TABLE offers ENABLE ROW LEVEL SECURITY;
ALTER TABLE opportunities ENABLE ROW LEVEL SECURITY;
ALTER TABLE pilots ENABLE ROW LEVEL SECURITY;
ALTER TABLE customers ENABLE ROW LEVEL SECURITY;
ALTER TABLE partnerships ENABLE ROW LEVEL SECURITY;
ALTER TABLE campaigns ENABLE ROW LEVEL SECURITY;
ALTER TABLE content ENABLE ROW LEVEL SECURITY;
ALTER TABLE funding_sources ENABLE ROW LEVEL SECURITY;
ALTER TABLE expenses ENABLE ROW LEVEL SECURITY;
ALTER TABLE financial_allocations ENABLE ROW LEVEL SECURITY;
ALTER TABLE funding_milestones ENABLE ROW LEVEL SECURITY;
ALTER TABLE financial_snapshots ENABLE ROW LEVEL SECURITY;
ALTER TABLE financial_scenarios ENABLE ROW LEVEL SECURITY;
ALTER TABLE governance_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE documents ENABLE ROW LEVEL SECURITY;
ALTER TABLE obligations ENABLE ROW LEVEL SECURITY;
ALTER TABLE contracts ENABLE ROW LEVEL SECURITY;
ALTER TABLE ip_assets ENABLE ROW LEVEL SECURITY;
ALTER TABLE meetings ENABLE ROW LEVEL SECURITY;
ALTER TABLE risks ENABLE ROW LEVEL SECURITY;
ALTER TABLE decisions ENABLE ROW LEVEL SECURITY;
ALTER TABLE kpis ENABLE ROW LEVEL SECURITY;
ALTER TABLE incubation_phases ENABLE ROW LEVEL SECURITY;
ALTER TABLE deliverables ENABLE ROW LEVEL SECURITY;

-- 1. Profiles (Users can read their own profile and profiles of their company members, can update own profile)
CREATE POLICY "Users can read own profile" ON profiles
FOR SELECT USING (auth.uid() = auth_user_id);

CREATE POLICY "Users can update own profile" ON profiles
FOR UPDATE USING (auth.uid() = auth_user_id);

CREATE POLICY "Users can read profiles of company members" ON profiles
FOR SELECT USING (
  EXISTS (
    SELECT 1 FROM company_members my_membership
    JOIN company_members other_membership ON my_membership.company_id = other_membership.company_id
    WHERE my_membership.profile_id = (SELECT id FROM profiles WHERE auth_user_id = auth.uid())
    AND other_membership.profile_id = profiles.id
  )
);

-- 2. Companies (Users can view their companies)
CREATE POLICY "Users can view their companies" ON companies
FOR SELECT USING (is_company_member(id));

-- 3. Company Members
CREATE POLICY "Users can view members of their companies" ON company_members
FOR SELECT USING (is_company_member(company_id));

-- 4. Business Tables (Generic Policy Generator Concept)
-- For the sake of this migration, we manually write the policies for all tables based on `company_id`.

DO $$
DECLARE
    tname text;
BEGIN
    FOR tname IN 
        SELECT table_name 
        FROM information_schema.tables 
        WHERE table_schema = 'public' 
        AND table_name NOT IN ('companies', 'profiles', 'company_members')
    LOOP
        EXECUTE format('
            CREATE POLICY "Users can select %I if in company" ON %I FOR SELECT USING (is_company_member(company_id));
            CREATE POLICY "Users can insert %I if in company" ON %I FOR INSERT WITH CHECK (is_company_member(company_id));
            CREATE POLICY "Users can update %I if in company" ON %I FOR UPDATE USING (is_company_member(company_id));
            CREATE POLICY "Users can delete %I if in company" ON %I FOR DELETE USING (is_company_member(company_id));
        ', tname, tname, tname, tname, tname, tname, tname, tname);
    END LOOP;
END;
$$;
