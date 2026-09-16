import { supabase } from '../lib/supabase';

export interface ActivityHistory {
  id: string;
  company_id: string;
  user_id: string | null;
  entity_type: string;
  entity_id: string;
  action_type: string;
  message: string | null;
  created_at: string;
  user?: { full_name: string };
}

export const activityService = {
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
   * Log an activity
   */
  async logActivity(data: {
    entity_type: string;
    entity_id: string;
    action_type: string;
    message?: string;
  }): Promise<ActivityHistory> {
    const companyId = await this.getCompanyId();
    const userId = await this.getUserId();

    const { data: record, error } = await supabase!
      .from('activity_history')
      .insert([
        {
          company_id: companyId,
          user_id: userId,
          entity_type: data.entity_type,
          entity_id: data.entity_id,
          action_type: data.action_type,
          message: data.message,
        }
      ])
      .select()
      .single();

    if (error) throw error;
    return record as ActivityHistory;
  },

  /**
   * Get activity history for an entity
   */
  async getActivities(entityType: string, entityId: string): Promise<ActivityHistory[]> {
    const companyId = await this.getCompanyId();

    const { data, error } = await supabase!
      .from('activity_history')
      .select(`
        *,
        user:profiles(full_name)
      `)
      .eq('company_id', companyId)
      .eq('entity_type', entityType)
      .eq('entity_id', entityId)
      .order('created_at', { ascending: false });

    if (error) throw error;
    return data as ActivityHistory[];
  }
};
