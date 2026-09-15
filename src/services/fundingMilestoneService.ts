// ============================================================
// SERVICE: fundingMilestoneService.ts — Phase 5
// All data is DEMO DATA. Not real financial records.
// ============================================================
import { FundingMilestone, NewFundingMilestone } from '../types/financialControl';

const now = new Date().toISOString();

let milestones: FundingMilestone[] = [
  {
    id: 'ms-1',
    name: 'مرحلة اكتمال المنتج',
    description: 'إنجاز المنتج الأساسي وجاهزيته للاختبار مع العملاء — DEMO DATA',
    targetBudget: 1600000,
    spentAmount: 1030000,
    remainingAmount: 570000,
    status: 'Active',
    targetDate: '2026-11-30',
    notes: 'DEMO DATA',
    createdAt: '2026-06-01T00:00:00Z',
    updatedAt: now,
  },
  {
    id: 'ms-2',
    name: 'مرحلة التجارب التشغيلية (Pilot)',
    description: 'تشغيل 3 تجارب مع عملاء حقيقيين وقياس النتائج — DEMO DATA',
    targetBudget: 500000,
    spentAmount: 120000,
    remainingAmount: 380000,
    status: 'Active',
    targetDate: '2027-01-31',
    notes: 'DEMO DATA',
    createdAt: '2026-06-01T00:00:00Z',
    updatedAt: now,
  },
  {
    id: 'ms-3',
    name: 'مرحلة الإطلاق التجاري',
    description: 'الإطلاق الرسمي والاستهداف التجاري — DEMO DATA',
    targetBudget: 700000,
    spentAmount: 0,
    remainingAmount: 700000,
    status: 'Planned',
    targetDate: '2027-04-30',
    notes: 'DEMO DATA',
    createdAt: '2026-06-01T00:00:00Z',
    updatedAt: now,
  },
  {
    id: 'ms-4',
    name: 'أول إيرادات متكررة',
    description: 'تحقيق أول 100,000 دج إيرادات شهرية متكررة — DEMO DATA',
    targetBudget: 300000,
    spentAmount: 0,
    remainingAmount: 300000,
    status: 'Planned',
    targetDate: '2027-06-30',
    notes: 'DEMO DATA',
    createdAt: '2026-06-01T00:00:00Z',
    updatedAt: now,
  },
];

function computeRemaining(m: FundingMilestone): FundingMilestone {
  return { ...m, remainingAmount: m.targetBudget - m.spentAmount };
}

export const fundingMilestoneService = {
  getAll: (): Promise<FundingMilestone[]> =>
    Promise.resolve(milestones.map(computeRemaining)),

  create: (data: NewFundingMilestone): Promise<FundingMilestone> => {
    const item: FundingMilestone = {
      ...data,
      id: `ms-${Date.now()}`,
      remainingAmount: data.targetBudget - data.spentAmount,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    milestones = [...milestones, item];
    return Promise.resolve(item);
  },

  update: (id: string, patch: Partial<FundingMilestone>): Promise<FundingMilestone> => {
    milestones = milestones.map(m => {
      if (m.id !== id) return m;
      return computeRemaining({ ...m, ...patch, updatedAt: new Date().toISOString() });
    });
    const found = milestones.find(m => m.id === id);
    if (!found) return Promise.reject(new Error('Not found'));
    return Promise.resolve(found);
  },

  delete: (id: string): Promise<void> => {
    milestones = milestones.filter(m => m.id !== id);
    return Promise.resolve();
  },
};
