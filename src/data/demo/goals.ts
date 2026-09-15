import { Goal } from '../../types/goal';

const now = new Date();
const daysAgo = (d: number) => new Date(now.getTime() - d * 86_400_000).toISOString();
const daysAhead = (d: number) => new Date(now.getTime() + d * 86_400_000).toISOString();

export const demoGoals: Goal[] = [
  {
    id: 'g1',
    title: 'الوصول إلى الجاهزية الكاملة للمنتج الأول',
    description: 'بيانات تجريبية: إنهاء جميع ميزات المنتج الأساسية بنسبة 100% لبدء التجارب المدرسية.',
    type: 'Product',
    period: 'Q3 2026',
    targetValue: 100,
    currentValue: 72,
    unit: '%',
    status: 'On Track',
    priority: 'Critical',
    owner: 'المؤسس التجريبي',
    startDate: daysAgo(45),
    endDate: daysAhead(30),
    notes: 'بيانات تجريبية: يعتمد على إنهاء المشاريع التقنية الحالية.',
    createdAt: daysAgo(45),
    updatedAt: daysAgo(1)
  },
  {
    id: 'g2',
    title: 'تأمين 3 تجارب (Pilots) مع المدارس',
    description: 'بيانات تجريبية: إطلاق التجارب مع 3 مدارس في العاصمة.',
    type: 'Market',
    period: 'Q3 2026',
    targetValue: 3,
    currentValue: 1,
    unit: 'مدارس',
    status: 'Behind',
    priority: 'High',
    owner: 'مسؤول المبيعات (Demo Sales)',
    startDate: daysAgo(20),
    endDate: daysAhead(60),
    notes: 'بيانات تجريبية: لدينا تجربة واحدة قيد التحضير.',
    createdAt: daysAgo(20),
    updatedAt: daysAgo(2)
  },
  {
    id: 'g3',
    title: 'تحقيق إيرادات أولية بقيمة 500,000 دج',
    description: 'بيانات تجريبية: تحويل التجارب الناجحة إلى عقود سنوية مدفوعة.',
    type: 'Revenue',
    period: 'Q4 2026',
    targetValue: 500000,
    currentValue: 250000,
    unit: 'دج',
    status: 'On Track',
    priority: 'High',
    owner: 'المؤسس التجريبي',
    startDate: daysAgo(10),
    endDate: daysAhead(100),
    notes: 'بيانات تجريبية: تم تأمين نصف المبلغ.',
    createdAt: daysAgo(10),
    updatedAt: daysAgo(1)
  }
];
