export type ExpenseStatus = 'Planned' | 'Actual';

export interface Expense {
  id: string;
  category: string;
  description: string;
  plannedAmount: number;
  actualAmount: number;
  status: ExpenseStatus;
  date: string;
  projectId?: string;
}

export interface BudgetCategory {
  name: string;
  allocated: number;
}

export interface FinanceSummary {
  totalFunding: number;
  allocatedBudget: number;
  plannedExpenses: number;
  actualExpenses: number;
  remainingBudget: number;
  utilizationPct: number;
  budgetCategories: BudgetCategory[];
}

export type NewExpense = Omit<Expense, 'id'>;
