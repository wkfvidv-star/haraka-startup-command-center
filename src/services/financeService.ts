import { Expense, NewExpense } from '../types/finance';
import { demoExpenses } from '../data/demo/expenses';

const delay = (ms: number) => new Promise(res => setTimeout(res, ms));

class FinanceService {
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
