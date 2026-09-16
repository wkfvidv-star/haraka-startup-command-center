import { supabase } from '../lib/supabase';
import { Content } from '../types/market';

class ContentService {

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
  async getAll(): Promise<Content[]>  {
    const company_id = await this.getCompanyId();
    const { data, error } = await supabase!.from('content').select('*').eq('company_id', company_id);
    if (error) throw error;
    return data;
  }

  async create(data: Omit<Content, 'id' | 'createdAt' | 'updatedAt'>): Promise<Content>  {
    const company_id = await this.getCompanyId();
    const { data: result, error } = await supabase!.from('content').insert([{ ...data, company_id }]).select().single();
    if (error) throw error;
    return result;
  }

  async update(id: string, patch: Partial<Content>): Promise<Content>  {
    const company_id = await this.getCompanyId();
    const { data, error } = await supabase!.from('content').update(patch).eq('id', id).eq('company_id', company_id).select().single();
    if (error) throw error;
    return data;
  }

  async delete(id: string): Promise<void>  {
    const company_id = await this.getCompanyId();
    const { error } = await supabase!.from('content').delete().eq('id', id).eq('company_id', company_id);
    if (error) throw error;
  }
}
export const contentService = new ContentService();
