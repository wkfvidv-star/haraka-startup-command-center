import { KPI } from '../../types/kpi';

export const demoKPIs: KPI[] = [
  { id: 'k1', name: 'المدارس الموقعة للتجربة', category: 'المبيعات', target: 3, currentValue: 1, unit: 'مدارس', status: 'At Risk', frequency: 'شهري', owner: 'المدير التنفيذي', source: 'CRM', notes: 'بيانات تجريبية: يجب تسريع عملية التواصل.' },
  { id: 'k2', name: 'استقرار المنصة', category: 'تقني', target: 99.9, currentValue: 100, unit: '%', status: 'On Track', frequency: 'يومي', owner: 'المدير التقني', source: 'AWS', notes: 'بيانات تجريبية: النظام مستقر.' },
  { id: 'k3', name: 'إنشاء ملفات الطلاب', category: 'المنتج', target: 500, currentValue: 120, unit: 'مستخدم', status: 'Off Track', frequency: 'أسبوعي', owner: 'مدير المنتج', source: 'قاعدة البيانات', notes: 'بيانات تجريبية: دمج المدرسة التجريبية أبطأ من المتوقع.' },
];
