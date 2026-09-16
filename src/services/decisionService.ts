import { supabase } from '../lib/supabase';
import { Decision, NewDecision } from '../types/decision';

class DecisionService {
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

  async getDecisions(): Promise<Decision[]> {
    const company_id = await this.getCompanyId();
    const { data, error } = await supabase!.from('decisions').select('*').eq('company_id', company_id);
    if (error) throw error;
    return data ?? [];
  }

  async createDecision(data: NewDecision): Promise<Decision> {
    const company_id = await this.getCompanyId();
    const { data: result, error } = await supabase!
      .from('decisions')
      .insert([{ ...data, company_id }])
      .select()
      .single();
    if (error) throw error;
    return result;
  }

  async updateDecision(id: string, patch: Partial<Decision>): Promise<Decision> {
    const company_id = await this.getCompanyId();
    const { data, error } = await supabase!
      .from('decisions')
      .update(patch)
      .eq('id', id)
      .eq('company_id', company_id)
      .select()
      .single();
    if (error) throw error;
    return data;
  }

  async deleteDecision(id: string): Promise<void> {
    const company_id = await this.getCompanyId();
    const { error } = await supabase!.from('decisions').delete().eq('id', id).eq('company_id', company_id);
    if (error) throw error;
  }
}

export const decisionService = new DecisionService();
