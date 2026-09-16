import { supabase } from '../lib/supabase';
import { Risk, NewRisk, RiskSeverity } from '../types/risk';

function computeSeverity(probability: string, impact: string): RiskSeverity {
  if (probability === 'High' && impact === 'High') return 'Critical';
  if (probability === 'High' && impact === 'Medium') return 'High';
  if (probability === 'Medium' && impact === 'High') return 'High';
  if (probability === 'Low' && impact === 'Low') return 'Low';
  return 'Medium';
}

class RiskService {
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

  async getRisks(): Promise<Risk[]> {
    const company_id = await this.getCompanyId();
    const { data, error } = await supabase!.from('risks').select('*').eq('company_id', company_id);
    if (error) throw error;
    return data ?? [];
  }

  async createRisk(data: NewRisk): Promise<Risk> {
    const company_id = await this.getCompanyId();
    const severity = computeSeverity(data.probability, data.impact);
    const { data: result, error } = await supabase!
      .from('risks')
      .insert([{ ...data, severity, company_id }])
      .select()
      .single();
    if (error) throw error;
    return result;
  }

  async updateRisk(id: string, patch: Partial<Risk>): Promise<Risk> {
    const company_id = await this.getCompanyId();
    // Fetch current to recompute severity if needed
    const { data: current } = await supabase!.from('risks').select('*').eq('id', id).eq('company_id', company_id).single();
    const merged = { ...current, ...patch };
    const severity = computeSeverity(merged.probability, merged.impact);

    const { data, error } = await supabase!
      .from('risks')
      .update({ ...patch, severity })
      .eq('id', id)
      .eq('company_id', company_id)
      .select()
      .single();
    if (error) throw error;
    return data;
  }

  async deleteRisk(id: string): Promise<void> {
    const company_id = await this.getCompanyId();
    const { error } = await supabase!.from('risks').delete().eq('id', id).eq('company_id', company_id);
    if (error) throw error;
  }
}

export const riskService = new RiskService();
