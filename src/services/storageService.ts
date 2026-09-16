import { supabase } from '../lib/supabase';

export interface FileAttachment {
  id: string;
  company_id: string;
  uploaded_by: string | null;
  file_name: string;
  file_type: string;
  file_size: number;
  storage_path: string;
  entity_type: string;
  entity_id: string;
  created_at: string;
}

export const storageService = {
  async getCompanyId() {
    if (!supabase) throw new Error('Not authenticated');
    const { data: { session } } = await supabase.auth.getSession();
    if (!session) throw new Error('Not authenticated');

    const { data: members, error } = await supabase
      .from('company_members')
      .select('company_id')
      .eq('status', 'Active')
      .limit(1);

    if (error || !members || members.length === 0) {
      throw new Error('No active company found for user');
    }
    return members[0].company_id;
  },

  async getUserId() {
    if (!supabase) throw new Error('Not authenticated');
    const { data: { session } } = await supabase.auth.getSession();
    if (!session) throw new Error('Not authenticated');

    const { data: profile, error } = await supabase
      .from('profiles')
      .select('id')
      .eq('auth_user_id', session.user.id)
      .single();

    if (error || !profile) {
      throw new Error('User profile not found');
    }
    return profile.id;
  },

  /**
   * Upload a file and create a metadata record.
   */
  async uploadFile(file: File, entityType: string, entityId: string): Promise<FileAttachment> {
    const companyId = await this.getCompanyId();
    const userId = await this.getUserId();

    // Generate unique storage path: company_id/entity_type/entity_id/timestamp_filename
    const timestamp = Date.now();
    // Sanitize filename to avoid weird characters in URL
    const sanitizedName = file.name.replace(/[^a-zA-Z0-9.-]/g, '_');
    const storagePath = `${companyId}/${entityType}/${entityId}/${timestamp}_${sanitizedName}`;

    // 1. Upload to Supabase Storage
    const { error: uploadError } = await supabase!.storage
      .from('company-files')
      .upload(storagePath, file, {
        cacheControl: '3600',
        upsert: false
      });

    if (uploadError) {
      throw new Error(`Storage upload failed: ${uploadError.message}`);
    }

    // 2. Create DB metadata record
    const { data: record, error: dbError } = await supabase!
      .from('file_attachments')
      .insert([
        {
          company_id: companyId,
          uploaded_by: userId,
          file_name: file.name,
          file_type: file.type,
          file_size: file.size,
          storage_path: storagePath,
          entity_type: entityType,
          entity_id: entityId
        }
      ])
      .select()
      .single();

    if (dbError) {
      // Rollback storage if DB fails
      await supabase!.storage.from('company-files').remove([storagePath]);
      throw new Error(`Database insert failed: ${dbError.message}`);
    }

    return record as FileAttachment;
  },

  /**
   * Fetch file attachments for a specific entity
   */
  async getFiles(entityType: string, entityId: string): Promise<FileAttachment[]> {
    const companyId = await this.getCompanyId();
    
    const { data, error } = await supabase!
      .from('file_attachments')
      .select('*')
      .eq('company_id', companyId)
      .eq('entity_type', entityType)
      .eq('entity_id', entityId)
      .order('created_at', { ascending: false });

    if (error) throw error;
    return data as FileAttachment[];
  },

  /**
   * Delete a file from storage and its DB record
   */
  async deleteFile(attachmentId: string): Promise<void> {
    const companyId = await this.getCompanyId();

    // 1. Get record to find storage_path
    const { data: record, error: fetchError } = await supabase!
      .from('file_attachments')
      .select('storage_path')
      .eq('id', attachmentId)
      .eq('company_id', companyId)
      .single();

    if (fetchError || !record) throw new Error('File record not found');

    // 2. Delete from storage
    const { error: storageError } = await supabase!.storage
      .from('company-files')
      .remove([record.storage_path]);

    if (storageError) throw new Error(`Storage deletion failed: ${storageError.message}`);

    // 3. Delete from DB
    const { error: dbError } = await supabase!
      .from('file_attachments')
      .delete()
      .eq('id', attachmentId)
      .eq('company_id', companyId);

    if (dbError) throw new Error(`Database deletion failed: ${dbError.message}`);
  },

  /**
   * Get a temporary download URL for a file
   */
  async getDownloadUrl(storagePath: string): Promise<string> {
    const { data, error } = await supabase!.storage
      .from('company-files')
      .createSignedUrl(storagePath, 3600); // 1 hour expiry

    if (error || !data) {
      throw new Error(`Failed to generate download URL: ${error?.message}`);
    }
    return data.signedUrl;
  }
};
