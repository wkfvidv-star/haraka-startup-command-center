-- 015_operational_features.sql
-- Adds operational tables: File Attachments, Notifications, Activity History
-- Also sets up the Supabase Storage Bucket for files and its security policies.

-- 1. Create file_attachments table
CREATE TABLE IF NOT EXISTS file_attachments (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    company_id UUID NOT NULL REFERENCES companies(id) ON DELETE CASCADE,
    uploaded_by UUID REFERENCES profiles(id) ON DELETE SET NULL,
    file_name TEXT NOT NULL,
    file_type TEXT,
    file_size BIGINT,
    storage_path TEXT NOT NULL,
    entity_type TEXT NOT NULL,
    entity_id UUID NOT NULL,
    created_at TIMESTAMPTZ DEFAULT now()
);

-- 2. Create notifications table
CREATE TABLE IF NOT EXISTS notifications (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    company_id UUID NOT NULL REFERENCES companies(id) ON DELETE CASCADE,
    recipient_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
    sender_id UUID REFERENCES profiles(id) ON DELETE SET NULL,
    type TEXT NOT NULL,
    title TEXT NOT NULL,
    message TEXT,
    entity_type TEXT,
    entity_id UUID,
    is_read BOOLEAN DEFAULT false,
    created_at TIMESTAMPTZ DEFAULT now(),
    read_at TIMESTAMPTZ
);

-- 3. Create activity_history table
CREATE TABLE IF NOT EXISTS activity_history (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    company_id UUID NOT NULL REFERENCES companies(id) ON DELETE CASCADE,
    user_id UUID REFERENCES profiles(id) ON DELETE SET NULL,
    entity_type TEXT NOT NULL,
    entity_id UUID NOT NULL,
    action_type TEXT NOT NULL,
    message TEXT,
    created_at TIMESTAMPTZ DEFAULT now()
);

-- 4. Enable RLS on new tables
ALTER TABLE file_attachments ENABLE ROW LEVEL SECURITY;
ALTER TABLE notifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE activity_history ENABLE ROW LEVEL SECURITY;

-- 5. RLS Policies using existing is_company_member() function
-- file_attachments
CREATE POLICY "Users can select file_attachments if in company" ON file_attachments FOR SELECT USING (is_company_member(company_id));
CREATE POLICY "Users can insert file_attachments if in company" ON file_attachments FOR INSERT WITH CHECK (is_company_member(company_id));
CREATE POLICY "Users can update file_attachments if in company" ON file_attachments FOR UPDATE USING (is_company_member(company_id));
CREATE POLICY "Users can delete file_attachments if in company" ON file_attachments FOR DELETE USING (is_company_member(company_id));

-- notifications (Users can read their own notifications, insert if in company)
CREATE POLICY "Users can select own notifications" ON notifications FOR SELECT USING (
    recipient_id = (SELECT id FROM profiles WHERE auth_user_id = auth.uid()) 
    AND is_company_member(company_id)
);
CREATE POLICY "Users can update own notifications" ON notifications FOR UPDATE USING (
    recipient_id = (SELECT id FROM profiles WHERE auth_user_id = auth.uid()) 
    AND is_company_member(company_id)
);
CREATE POLICY "Users can insert notifications if in company" ON notifications FOR INSERT WITH CHECK (is_company_member(company_id));
CREATE POLICY "Users can delete own notifications" ON notifications FOR DELETE USING (
    recipient_id = (SELECT id FROM profiles WHERE auth_user_id = auth.uid()) 
    AND is_company_member(company_id)
);

-- activity_history
CREATE POLICY "Users can select activity_history if in company" ON activity_history FOR SELECT USING (is_company_member(company_id));
CREATE POLICY "Users can insert activity_history if in company" ON activity_history FOR INSERT WITH CHECK (is_company_member(company_id));

-- Enable Realtime for notifications
ALTER PUBLICATION supabase_realtime ADD TABLE notifications;

-- 6. Storage Setup
-- Note: 'storage.buckets' and 'storage.objects' are internal Supabase tables.
-- We insert a bucket for company-files.
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'company-files', 
  'company-files', 
  false, 
  52428800, -- 50MB limit
  ARRAY['application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document', 'application/vnd.ms-excel', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet', 'application/vnd.ms-powerpoint', 'application/vnd.openxmlformats-officedocument.presentationml.presentation', 'text/plain', 'text/csv', 'image/jpeg', 'image/png']
)
ON CONFLICT (id) DO UPDATE SET 
  file_size_limit = EXCLUDED.file_size_limit,
  allowed_mime_types = EXCLUDED.allowed_mime_types;

-- Storage RLS Policies
-- Objects are isolated by company_id, which we expect to be the first segment of the storage path: company_id/entity_type/entity_id/filename
CREATE POLICY "Users can read files in their company folder" 
ON storage.objects FOR SELECT 
USING (
  bucket_id = 'company-files' AND 
  is_company_member(CAST(SPLIT_PART(name, '/', 1) AS UUID))
);

CREATE POLICY "Users can upload files to their company folder" 
ON storage.objects FOR INSERT 
WITH CHECK (
  bucket_id = 'company-files' AND 
  is_company_member(CAST(SPLIT_PART(name, '/', 1) AS UUID))
);

CREATE POLICY "Users can delete files in their company folder" 
ON storage.objects FOR DELETE 
USING (
  bucket_id = 'company-files' AND 
  is_company_member(CAST(SPLIT_PART(name, '/', 1) AS UUID))
);
