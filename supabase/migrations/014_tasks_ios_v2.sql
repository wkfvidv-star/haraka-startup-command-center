-- 014_tasks_ios_v2.sql
-- Add missing columns to tasks table for HARAKA IOS v2
-- These columns support the new role-based task workflow.
-- All columns are nullable for backward compatibility.

ALTER TABLE tasks
  ADD COLUMN IF NOT EXISTS owner        TEXT,
  ADD COLUMN IF NOT EXISTS assigner     TEXT,
  ADD COLUMN IF NOT EXISTS category     TEXT,
  ADD COLUMN IF NOT EXISTS domain       TEXT,
  ADD COLUMN IF NOT EXISTS expected_result TEXT,
  ADD COLUMN IF NOT EXISTS review_notes TEXT,
  ADD COLUMN IF NOT EXISTS estimated_hours NUMERIC,
  ADD COLUMN IF NOT EXISTS actual_hours   NUMERIC,
  ADD COLUMN IF NOT EXISTS project_id_text TEXT;

-- Index for fast filtering by owner
CREATE INDEX IF NOT EXISTS idx_tasks_owner ON tasks(owner);
CREATE INDEX IF NOT EXISTS idx_tasks_status ON tasks(status);
CREATE INDEX IF NOT EXISTS idx_tasks_company_status ON tasks(company_id, status);
