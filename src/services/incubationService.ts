import { supabase } from '../lib/supabase';
import { IncubationPhase, Deliverable, Meeting, NewDeliverable } from '../types/incubation';

class IncubationService {
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

  async getPhase(): Promise<IncubationPhase | null> {
    const company_id = await this.getCompanyId();
    const { data, error } = await supabase!
      .from('incubation_phases')
      .select('*')
      .eq('company_id', company_id)
      .order('order_index', { ascending: true })
      .limit(1)
      .maybeSingle();
    if (error) throw error;
    return data as IncubationPhase | null;
  }

  async getDeliverables(): Promise<Deliverable[]> {
    const company_id = await this.getCompanyId();
    const { data, error } = await supabase!
      .from('deliverables')
      .select('*')
      .eq('company_id', company_id);
    if (error) throw error;
    return data ?? [];
  }

  async getMeetings(): Promise<Meeting[]> {
    // Incubation meetings are stored in the meetings table with a type filter
    const company_id = await this.getCompanyId();
    const { data, error } = await supabase!
      .from('meetings')
      .select('*')
      .eq('company_id', company_id)
      .eq('type', 'Incubation');
    if (error) throw error;
    return (data ?? []).map((row: any) => ({
      ...row,
      participants: row.participants ? row.participants.split('|') : [],
    })) as Meeting[];
  }

  async createDeliverable(data: NewDeliverable): Promise<Deliverable> {
    const company_id = await this.getCompanyId();
    const { data: result, error } = await supabase!
      .from('deliverables')
      .insert([{ ...data, company_id }])
      .select()
      .single();
    if (error) throw error;
    return result;
  }

  async updateDeliverable(id: string, patch: Partial<Deliverable>): Promise<Deliverable> {
    const company_id = await this.getCompanyId();
    const { data, error } = await supabase!
      .from('deliverables')
      .update(patch)
      .eq('id', id)
      .eq('company_id', company_id)
      .select()
      .single();
    if (error) throw error;
    return data;
  }

  async deleteDeliverable(id: string): Promise<void> {
    const company_id = await this.getCompanyId();
    const { error } = await supabase!.from('deliverables').delete().eq('id', id).eq('company_id', company_id);
    if (error) throw error;
  }
}

export const incubationService = new IncubationService();
