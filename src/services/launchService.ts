import { supabase } from '../lib/supabase';
import { LaunchBlocker, LaunchReadinessCategory, NewLaunchBlocker } from '../types/launch';

class LaunchService {
  private async getCompanyId() {
    const { data: { session } } = await supabase!.auth.getSession();
    if (!session) throw new Error('Not authenticated');

    const { data: members, error } = await supabase!
      .from('company_members')
      .select('company_id')
      .eq('status', 'Active')
      .limit(1);

    if (error || !members || members.length === 0) {
      throw new Error('No active company found for user');
    }
    return members[0].company_id;
  }

  async getCategories(): Promise<LaunchReadinessCategory[]> {
    const company_id = await this.getCompanyId();
    const { data, error } = await supabase!
      .from('launch_categories')
      .select('*')
      .eq('company_id', company_id);
    if (error) throw error;
    return data ?? [];
  }

  async getBlockers(): Promise<LaunchBlocker[]> {
    const company_id = await this.getCompanyId();
    const { data, error } = await supabase!
      .from('launch_blockers')
      .select('*')
      .eq('company_id', company_id);
    if (error) throw error;
    return data ?? [];
  }

  async createBlocker(data: NewLaunchBlocker): Promise<LaunchBlocker> {
    const company_id = await this.getCompanyId();
    const { data: result, error } = await supabase!
      .from('launch_blockers')
      .insert([{ ...data, company_id }])
      .select()
      .single();
    if (error) throw error;
    return result;
  }

  async updateBlocker(id: string, patch: Partial<LaunchBlocker>): Promise<LaunchBlocker> {
    const company_id = await this.getCompanyId();
    const { data, error } = await supabase!
      .from('launch_blockers')
      .update(patch)
      .eq('id', id)
      .eq('company_id', company_id)
      .select()
      .single();
    if (error) throw error;
    return data;
  }

  async deleteBlocker(id: string): Promise<void> {
    const company_id = await this.getCompanyId();
    const { error } = await supabase!.from('launch_blockers').delete().eq('id', id).eq('company_id', company_id);
    if (error) throw error;
  }
}

export const launchService = new LaunchService();
