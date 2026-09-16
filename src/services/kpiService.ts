import { supabase } from '../lib/supabase';
import { KPI, NewKPI } from '../types/kpi';

class KPIService {
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

  async getKPIs(): Promise<KPI[]> {
    const company_id = await this.getCompanyId();
    const { data, error } = await supabase!.from('kpis').select('*').eq('company_id', company_id);
    if (error) throw error;
    return data ?? [];
  }

  async createKPI(data: NewKPI): Promise<KPI> {
    const company_id = await this.getCompanyId();
    const { data: result, error } = await supabase!
      .from('kpis')
      .insert([{ ...data, company_id }])
      .select()
      .single();
    if (error) throw error;
    return result;
  }

  async updateKPI(id: string, patch: Partial<KPI>): Promise<KPI> {
    const company_id = await this.getCompanyId();
    const { data, error } = await supabase!
      .from('kpis')
      .update(patch)
      .eq('id', id)
      .eq('company_id', company_id)
      .select()
      .single();
    if (error) throw error;
    return data;
  }

  async deleteKPI(id: string): Promise<void> {
    const company_id = await this.getCompanyId();
    const { error } = await supabase!.from('kpis').delete().eq('id', id).eq('company_id', company_id);
    if (error) throw error;
  }
}

export const kpiService = new KPIService();
