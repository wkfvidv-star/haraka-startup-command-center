import { Initiative } from '../../types/initiative';

const now = new Date();
const daysAgo = (d: number) => new Date(now.getTime() - d * 86_400_000).toISOString();
const daysAhead = (d: number) => new Date(now.getTime() + d * 86_400_000).toISOString();

export const demoInitiatives: Initiative[] = [
  {
    id: 'init1',
    name: 'مبادرة الإطلاق التقني',
    description: 'بيانات تجريبية: تنسيق جميع المشاريع التقنية لضمان الوصول إلى الجاهزية للمنتج.',
    goalId: 'g1',
    owner: 'مسؤول التقنية (Demo CTO)',
    status: 'Active',
    priority: 'Critical',
    progress: 72,
    startDate: daysAgo(45),
    endDate: daysAhead(30),
    budget: 0,
    notes: 'بيانات تجريبية',
    createdAt: daysAgo(45),
    updatedAt: daysAgo(1)
  },
  {
    id: 'init2',
    name: 'مبادرة الاكتساح المدرسي',
    description: 'بيانات تجريبية: جهود مركزة للتواصل مع المدارس الخاصة لتقديم المنتج للتجربة.',
    goalId: 'g2',
    owner: 'مسؤول المبيعات (Demo Sales)',
    status: 'At Risk',
    priority: 'High',
    progress: 15,
    startDate: daysAgo(20),
    endDate: daysAhead(60),
    budget: 50000,
    notes: 'بيانات تجريبية: نحتاج لتكثيف الاتصالات.',
    createdAt: daysAgo(20),
    updatedAt: daysAgo(2)
  },
  {
    id: 'init3',
    name: 'مبادرة التأسيس القانوني',
    description: 'بيانات تجريبية: تحضير الشركة وتأمين الوثائق القانونية للحاضنة.',
    goalId: 'g1', // Linked to product/company readiness conceptually
    owner: 'المؤسس التجريبي',
    status: 'Active',
    priority: 'Medium',
    progress: 45,
    startDate: daysAgo(30),
    endDate: daysAhead(45),
    budget: 20000,
    notes: 'بيانات تجريبية',
    createdAt: daysAgo(30),
    updatedAt: daysAgo(3)
  }
];
