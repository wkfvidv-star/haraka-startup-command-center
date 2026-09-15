import { LaunchBlocker, LaunchReadinessCategory } from '../../types/launch';

export const demoLaunchCategories: LaunchReadinessCategory[] = [
  { id: 'lc1', name: 'المنتج', readiness: 65, blockersCount: 1, nextAction: 'إنهاء وحدة الفيديو', status: 'On Track' },
  { id: 'lc2', name: 'القانونية', readiness: 40, blockersCount: 2, nextAction: 'صياغة شروط الاستخدام', status: 'At Risk' },
  { id: 'lc3', name: 'التسويق', readiness: 20, blockersCount: 0, nextAction: 'تصميم صفحة الهبوط', status: 'On Track' },
  { id: 'lc4', name: 'التجارب/العملاء', readiness: 80, blockersCount: 0, nextAction: 'توقيع الاتفاقية مع المدرسة', status: 'Ready' },
];

export const demoLaunchBlockers: LaunchBlocker[] = [
  { id: 'lb1', title: 'شروط الاستخدام معلقة', description: 'بيانات تجريبية: يجب على الفريق القانوني إنهاء الشروط قبل تفعيل الحسابات.', category: 'القانونية', severity: 'Critical', owner: 'المستشار القانوني', dueDate: '2026-10-01T00:00:00.000Z', status: 'Open' },
  { id: 'lb2', title: 'تكاليف تخزين الفيديو', description: 'بيانات تجريبية: نحتاج للتفاوض على أرصدة سحابية لتفادي التكاليف المرتفعة.', category: 'المنتج', severity: 'High', owner: 'المدير التقني', dueDate: '2026-10-10T00:00:00.000Z', status: 'In Progress' },
];
