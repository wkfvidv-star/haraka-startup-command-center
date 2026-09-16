import { supabase } from '../lib/supabase';

export interface AppNotification {
  id: string;
  company_id: string;
  recipient_id: string;
  sender_id: string | null;
  type: string;
  title: string;
  message: string | null;
  entity_type: string | null;
  entity_id: string | null;
  is_read: boolean;
  created_at: string;
  read_at: string | null;
}

export const notificationService = {
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
   * Fetch all notifications for the current user
   */
  async getNotifications(): Promise<AppNotification[]> {
    const companyId = await this.getCompanyId();
    const userId = await this.getUserId();

    const { data, error } = await supabase!
      .from('notifications')
      .select('*')
      .eq('company_id', companyId)
      .eq('recipient_id', userId)
      .order('created_at', { ascending: false });

    if (error) throw error;
    return data as AppNotification[];
  },

  /**
   * Create a new notification (used by other services when actions occur)
   */
  async createNotification(data: {
    recipient_id: string;
    type: string;
    title: string;
    message?: string;
    entity_type?: string;
    entity_id?: string;
  }): Promise<AppNotification> {
    const companyId = await this.getCompanyId();
    const senderId = await this.getUserId();

    const { data: record, error } = await supabase!
      .from('notifications')
      .insert([
        {
          company_id: companyId,
          sender_id: senderId,
          recipient_id: data.recipient_id,
          type: data.type,
          title: data.title,
          message: data.message,
          entity_type: data.entity_type,
          entity_id: data.entity_id,
        }
      ])
      .select()
      .single();

    if (error) throw error;
    return record as AppNotification;
  },

  /**
   * Mark a notification as read
   */
  async markAsRead(id: string): Promise<void> {
    const { error } = await supabase!
      .from('notifications')
      .update({ is_read: true, read_at: new Date().toISOString() })
      .eq('id', id);

    if (error) throw error;
  },

  /**
   * Mark all notifications as read for current user
   */
  async markAllAsRead(): Promise<void> {
    const companyId = await this.getCompanyId();
    const userId = await this.getUserId();

    const { error } = await supabase!
      .from('notifications')
      .update({ is_read: true, read_at: new Date().toISOString() })
      .eq('company_id', companyId)
      .eq('recipient_id', userId)
      .eq('is_read', false);

    if (error) throw error;
  },

  /**
   * Setup Realtime Subscription
   */
  subscribeToNotifications(
    userId: string,
    onInsert: (payload: any) => void,
    onUpdate: (payload: any) => void
  ) {
    if (!supabase) return null;

    return supabase
      .channel(`public:notifications:recipient_id=eq.${userId}`)
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'notifications',
          filter: `recipient_id=eq.${userId}`,
        },
        (payload) => onInsert(payload.new)
      )
      .on(
        'postgres_changes',
        {
          event: 'UPDATE',
          schema: 'public',
          table: 'notifications',
          filter: `recipient_id=eq.${userId}`,
        },
        (payload) => onUpdate(payload.new)
      )
      .subscribe();
  }
};
