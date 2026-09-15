import { ProductReadinessItem } from '../../types/product';

export const demoProducts: ProductReadinessItem[] = [
  { id: 'pr1', name: 'لوحة تحكم الطالب', category: 'واجهة الطلاب', status: 'In Progress', priority: 'High', owner: 'فريق الواجهة الأمامية', notes: 'بيانات تجريبية: تم إكمال التصميم، بانتظار ربط قواعد البيانات.', targetDate: '2026-10-15T00:00:00.000Z' },
  { id: 'pr2', name: 'نظام تسجيل الدخول', category: 'الأمان', status: 'Ready', priority: 'High', owner: 'فريق الواجهة الخلفية', notes: 'بيانات تجريبية: تم التنفيذ والاختبار بنجاح.', targetDate: '2026-09-01T00:00:00.000Z' },
  { id: 'pr3', name: 'واجهة المدرب', category: 'واجهة المدربين', status: 'Not Started', priority: 'Medium', owner: 'فريق الواجهة الأمامية', notes: 'بيانات تجريبية: بانتظار الاعتماد النهائي للتصميم.', targetDate: '2026-11-01T00:00:00.000Z' },
  { id: 'pr4', name: 'وحدة رفع الفيديو', category: 'الوسائط', status: 'Blocked', priority: 'High', owner: 'فريق الواجهة الخلفية', notes: 'بيانات تجريبية: قيود التخزين تتطلب حلاً قبل الاستمرار.', targetDate: '2026-10-20T00:00:00.000Z' },
];
