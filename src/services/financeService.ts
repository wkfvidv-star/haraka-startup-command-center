const delay = (ms = 100) => new Promise<void>((r) => setTimeout(r, ms));
import { supabase } from '../lib/supabase';
import { Expense, NewExpense } from '../types/finance';
import { demoExpenses } from '../data/demo/expenses';



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

  private expenses: Expense[] = [...demoExpenses];

  async getExpenses(): Promise<Expense[]> {
    await delay(100);
    return [...this.expenses];
  }

  async createExpense(data: NewExpense): Promise<Expense> {
    await delay(200);
    const item: Expense = { ...data, id: `exp-${Date.now()}` };
    this.expenses.push(item);
    return item;
  }

  async updateExpense(id: string, patch: Partial<Expense>): Promise<Expense> {
    await delay(200);
    const idx = this.expenses.findIndex(i => i.id === id);
    if (idx === -1) throw new Error('Not found');
    this.expenses[idx] = { ...this.expenses[idx], ...patch };
    return this.expenses[idx];
  }

  async deleteExpense(id: string): Promise<void> {
    await delay(200);
    this.expenses = this.expenses.filter(i => i.id !== id);
  }
}

export const financeService = new FinanceService();
