import { Expense } from '../../types/finance';

export const demoExpenses: Expense[] = [
  { id: 'exp1', category: 'البرمجيات والاستضافة', description: 'بيانات تجريبية: أرصدة AWS, Vercel الأولية.', plannedAmount: 150000, actualAmount: 120000, status: 'Actual', date: '2026-08-01T00:00:00.000Z' },
  { id: 'exp2', category: 'قانوني', description: 'بيانات تجريبية: أتعاب الموثق والتأسيس.', plannedAmount: 50000, actualAmount: 55000, status: 'Actual', date: '2026-07-10T00:00:00.000Z' },
  { id: 'exp3', category: 'تسويق', description: 'بيانات تجريبية: تصميم صفحة الهبوط والهوية البصرية.', plannedAmount: 100000, actualAmount: 0, status: 'Planned', date: '2026-11-01T00:00:00.000Z' },
  { id: 'exp4', category: 'معدات', description: 'بيانات تجريبية: أجهزة اختبار (لوحات ذكية للتجربة).', plannedAmount: 200000, actualAmount: 0, status: 'Planned', date: '2026-12-01T00:00:00.000Z' },
];
