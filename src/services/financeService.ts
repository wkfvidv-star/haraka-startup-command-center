import { supabase } from '../lib/supabase';
import { Expense, NewExpense } from '../types/finance';

class FinanceService {
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

  async getExpenses(): Promise<Expense[]> {
    const company_id = await this.getCompanyId();
    const { data, error } = await supabase!.from('expenses').select('*').eq('company_id', company_id);
    if (error) throw error;
    return data ?? [];
  }

  async createExpense(data: NewExpense): Promise<Expense> {
    const company_id = await this.getCompanyId();
    const { data: result, error } = await supabase!
      .from('expenses')
      .insert([{ ...data, company_id }])
      .select()
      .single();
    if (error) throw error;
    return result;
  }

  async updateExpense(id: string, patch: Partial<Expense>): Promise<Expense> {
    const company_id = await this.getCompanyId();
    const { data, error } = await supabase!
      .from('expenses')
      .update(patch)
      .eq('id', id)
      .eq('company_id', company_id)
      .select()
      .single();
    if (error) throw error;
    return data;
  }

  async deleteExpense(id: string): Promise<void> {
    const company_id = await this.getCompanyId();
    const { error } = await supabase!.from('expenses').delete().eq('id', id).eq('company_id', company_id);
    if (error) throw error;
  }
}

export const financeService = new FinanceService();
