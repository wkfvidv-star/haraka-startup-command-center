import { GrowthTarget } from '../../types/growth';

const now = new Date();
const daysAgo = (d: number) => new Date(now.getTime() - d * 86_400_000).toISOString();

export const demoGrowthTargets: GrowthTarget[] = [
  {
    id: 'gt1',
    name: 'تنمية العملاء المحتملين (Leads)',
    metric: 'Leads',
    period: 'This Month',
    target: 50,
    current: 12,
    unit: 'Lead',
    owner: 'مسؤول المبيعات (Demo Sales)',
    status: 'Behind',
    notes: 'بيانات تجريبية: نحتاج لدفع الحملات الإعلانية.',
    createdAt: daysAgo(15),
    updatedAt: daysAgo(1)
  },
  {
    id: 'gt2',
    name: 'تحويل التجارب إلى عملاء',
    metric: 'Conversion',
    period: 'Q3 2026',
    target: 100, // 100%
    current: 0,
    unit: '%',
    owner: 'المؤسس التجريبي',
    status: 'Not Started',
    notes: 'بيانات تجريبية: التجارب ما زالت في بدايتها.',
    createdAt: daysAgo(5),
    updatedAt: daysAgo(1)
  }
];
