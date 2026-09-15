-- 010_indexes_and_triggers.sql

-- Create indexes for company_id on all tenant tables
CREATE INDEX idx_company_members_company_id ON company_members(company_id);
CREATE INDEX idx_goals_company_id ON goals(company_id);
CREATE INDEX idx_initiatives_company_id ON initiatives(company_id);
CREATE INDEX idx_projects_company_id ON projects(company_id);
CREATE INDEX idx_tasks_company_id ON tasks(company_id);
CREATE INDEX idx_product_readiness_items_company_id ON product_readiness_items(company_id);
CREATE INDEX idx_launch_categories_company_id ON launch_categories(company_id);
CREATE INDEX idx_launch_blockers_company_id ON launch_blockers(company_id);
CREATE INDEX idx_market_segments_company_id ON market_segments(company_id);
CREATE INDEX idx_leads_company_id ON leads(company_id);
CREATE INDEX idx_offers_company_id ON offers(company_id);
CREATE INDEX idx_opportunities_company_id ON opportunities(company_id);
CREATE INDEX idx_pilots_company_id ON pilots(company_id);
CREATE INDEX idx_customers_company_id ON customers(company_id);
CREATE INDEX idx_partnerships_company_id ON partnerships(company_id);
CREATE INDEX idx_campaigns_company_id ON campaigns(company_id);
CREATE INDEX idx_content_company_id ON content(company_id);
CREATE INDEX idx_funding_sources_company_id ON funding_sources(company_id);
CREATE INDEX idx_expenses_company_id ON expenses(company_id);
CREATE INDEX idx_financial_allocations_company_id ON financial_allocations(company_id);
CREATE INDEX idx_funding_milestones_company_id ON funding_milestones(company_id);
CREATE INDEX idx_financial_snapshots_company_id ON financial_snapshots(company_id);
CREATE INDEX idx_financial_scenarios_company_id ON financial_scenarios(company_id);
CREATE INDEX idx_governance_profiles_company_id ON governance_profiles(company_id);
CREATE INDEX idx_documents_company_id ON documents(company_id);
CREATE INDEX idx_obligations_company_id ON obligations(company_id);
CREATE INDEX idx_contracts_company_id ON contracts(company_id);
CREATE INDEX idx_ip_assets_company_id ON ip_assets(company_id);
CREATE INDEX idx_meetings_company_id ON meetings(company_id);
CREATE INDEX idx_risks_company_id ON risks(company_id);
CREATE INDEX idx_decisions_company_id ON decisions(company_id);
CREATE INDEX idx_kpis_company_id ON kpis(company_id);
CREATE INDEX idx_incubation_phases_company_id ON incubation_phases(company_id);
CREATE INDEX idx_deliverables_company_id ON deliverables(company_id);

-- Frequently used date filters
CREATE INDEX idx_tasks_deadline ON tasks(deadline);
CREATE INDEX idx_opportunities_expected_close_date ON opportunities(expected_close_date);
CREATE INDEX idx_obligations_due_date ON obligations(due_date);
CREATE INDEX idx_contracts_end_date ON contracts(end_date);
CREATE INDEX idx_documents_expiry_date ON documents(expiry_date);
CREATE INDEX idx_meetings_date ON meetings(date);
CREATE INDEX idx_funding_milestones_target_date ON funding_milestones(target_date);

-- Status filters
CREATE INDEX idx_tasks_status ON tasks(status);
CREATE INDEX idx_opportunities_stage ON opportunities(stage);
CREATE INDEX idx_leads_status ON leads(status);
CREATE INDEX idx_customers_status ON customers(status);
