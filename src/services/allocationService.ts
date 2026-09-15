// ============================================================
// SERVICE: allocationService.ts — Phase 5
// All demo data is clearly labeled as DEMO DATA.
// Not real financial records.
// ============================================================
import { FinancialAllocation, NewFinancialAllocation } from '../types/financialControl';

const now = new Date().toISOString();

// ── DEMO DATA ─────────────────────────────────────────────────
let allocations: FinancialAllocation[] = [
  {
    id: 'alloc-1',
    name: 'تطوير المنتج الأساسي',
    category: 'Product',
    description: 'ميزانية تطوير الميزات الأساسية للمنصة — DEMO DATA',
    allocatedAmount: 1200000,
    spentAmount: 820000,
    remainingAmount: 380000,
    priority: 'Critical',
    status: 'Active',
    linkedGoalId: undefined,
    linkedInitiativeId: undefined,
    notes: 'DEMO DATA',
    createdAt: '2026-06-01T00:00:00Z',
    updatedAt: now,
  },
  {
    id: 'alloc-2',
    name: 'البنية التحتية التقنية',
    category: 'Technology',
    description: 'خوادم، بيئة الاختبار، أدوات التطوير — DEMO DATA',
    allocatedAmount: 400000,
    spentAmount: 210000,
    remainingAmount: 190000,
    priority: 'High',
    status: 'Active',
    notes: 'DEMO DATA',
    createdAt: '2026-06-01T00:00:00Z',
    updatedAt: now,
  },
  {
    id: 'alloc-3',
    name: 'حملات التسويق والإطلاق',
    category: 'Marketing',
    description: 'ميزانية الحملات، المحتوى، الفعاليات — DEMO DATA',
    allocatedAmount: 600000,
    spentAmount: 180000,
    remainingAmount: 420000,
    priority: 'High',
    status: 'Active',
    notes: 'DEMO DATA',
    createdAt: '2026-06-01T00:00:00Z',
    updatedAt: now,
  },
  {
    id: 'alloc-4',
    name: 'فريق المبيعات والعملاء',
    category: 'Sales',
    description: 'رواتب مندوبي المبيعات ومصاريف الاجتماعات — DEMO DATA',
    allocatedAmount: 350000,
    spentAmount: 120000,
    remainingAmount: 230000,
    priority: 'High',
    status: 'Active',
    notes: 'DEMO DATA',
    createdAt: '2026-06-01T00:00:00Z',
    updatedAt: now,
  },
  {
    id: 'alloc-5',
    name: 'العمليات والإدارة',
    category: 'Operations',
    description: 'مكتب، خدمات، مصاريف تشغيلية — DEMO DATA',
    allocatedAmount: 200000,
    spentAmount: 95000,
    remainingAmount: 105000,
    priority: 'Medium',
    status: 'Active',
    notes: 'DEMO DATA',
    createdAt: '2026-06-01T00:00:00Z',
    updatedAt: now,
  },
  {
    id: 'alloc-6',
    name: 'الشؤون القانونية والملكية الفكرية',
    category: 'LegalIP',
    description: 'تسجيل الشركة، براءات الاختراع، عقود — DEMO DATA',
    allocatedAmount: 150000,
    spentAmount: 75000,
    remainingAmount: 75000,
    priority: 'Medium',
    status: 'Active',
    notes: 'DEMO DATA',
    createdAt: '2026-06-01T00:00:00Z',
    updatedAt: now,
  },
];

function computeRemaining(a: FinancialAllocation): FinancialAllocation {
  return { ...a, remainingAmount: a.allocatedAmount - a.spentAmount };
}

export const allocationService = {
  getAll: (): Promise<FinancialAllocation[]> =>
    Promise.resolve(allocations.map(computeRemaining)),

  create: (data: NewFinancialAllocation): Promise<FinancialAllocation> => {
    const item: FinancialAllocation = {
      ...data,
      id: `alloc-${Date.now()}`,
      remainingAmount: data.allocatedAmount - data.spentAmount,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    allocations = [...allocations, item];
    return Promise.resolve(item);
  },

  update: (id: string, patch: Partial<FinancialAllocation>): Promise<FinancialAllocation> => {
    allocations = allocations.map(a => {
      if (a.id !== id) return a;
      const updated = { ...a, ...patch, updatedAt: new Date().toISOString() };
      return computeRemaining(updated);
    });
    const found = allocations.find(a => a.id === id);
    if (!found) return Promise.reject(new Error('Not found'));
    return Promise.resolve(found);
  },

  delete: (id: string): Promise<void> => {
    allocations = allocations.filter(a => a.id !== id);
    return Promise.resolve();
  },
};
