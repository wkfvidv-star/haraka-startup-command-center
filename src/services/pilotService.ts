import { supabase } from '../lib/supabase';
import { Pilot } from '../types/market';
import { demoPilots } from '../data/demo/market';


class PilotService {

  private async getCompanyId() {
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
  }
  private store: any[] = [];

  async getAll(): Promise<Pilot[]>  {
    const company_id = await this.getCompanyId();
    const { data, error } = await supabase!.from('pilots').select('*').eq('company_id', company_id);
    if (error) throw error;
    return data;
  }
}
export const pilotService = new PilotService();
