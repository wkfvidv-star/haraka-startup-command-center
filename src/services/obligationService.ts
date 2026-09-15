import { supabase } from '../lib/supabase';
// ============================================================
// SERVICE: obligationService.ts — Phase 6
// All data is DEMO DATA.
// ============================================================
import { Obligation, NewObligation } from '../types/governance';

const now = new Date().toISOString();
const today = new Date();
const inDays = (d: number) => new Date(today.getTime() + d * 86400000).toISOString().split('T')[0];

let obligations: Obligation[] = [
  {
    id: 'obl-1',
    title: 'تقديم تقرير الحاضنة الفصلي',
    description: 'تقرير شهري لمتابعة التقدم مع هيئة الحاضنة — DEMO DATA',
    type: 'Incubation',
    priority: 'Critical',
    dueDate: inDays(3),
    owner: 'المؤسس',
    status: 'Pending',
    notes: 'DEMO DATA',
    createdAt: '2026-08-01T00:00:00Z',
    updatedAt: now,
  },
  {
    id: 'obl-2',
    title: 'تجديد سجل الشركة',
    description: 'تجديد الوثائق القانونية الرسمية للشركة — DEMO DATA',
    type: 'Administrative',
    priority: 'High',
    dueDate: inDays(12),
    owner: 'المؤسس',
    status: 'In Progress',
    notes: 'DEMO DATA',
    createdAt: '2026-08-01T00:00:00Z',
    updatedAt: now,
  },
  {
    id: 'obl-3',
    title: 'تسليم ملف الفريق للحاضنة',
    description: 'تحديث بيانات أعضاء الفريق في منصة الحاضنة — DEMO DATA',
    type: 'Incubation',
    priority: 'Medium',
    dueDate: inDays(20),
    owner: 'مدير الفريق',
    status: 'Pending',
    notes: 'DEMO DATA',
    createdAt: '2026-08-01T00:00:00Z',
    updatedAt: now,
  },
  {
    id: 'obl-4',
    title: 'تقرير استخدام منحة الحاضنة',
    description: 'تقرير مالي تفصيلي عن استخدام المنحة المالية — DEMO DATA',
    type: 'Financial',
    priority: 'Critical',
    dueDate: inDays(-5), // Overdue
    owner: 'المؤسس',
    status: 'Overdue',
    notes: 'DEMO DATA',
    createdAt: '2026-07-01T00:00:00Z',
    updatedAt: now,
  },
  {
    id: 'obl-5',
    title: 'توقيع اتفاقية الشراكة الاستراتيجية',
    description: 'إتمام الاتفاقية مع الشريك الاستراتيجي الرئيسي — DEMO DATA',
    type: 'Contractual',
    priority: 'High',
    dueDate: inDays(6),
    owner: 'المؤسس',
    status: 'Pending',
    notes: 'DEMO DATA',
    createdAt: '2026-08-15T00:00:00Z',
    updatedAt: now,
  },
  {
    id: 'obl-6',
    title: 'تحديث خطة العمل للمرحلة الثانية',
    description: 'مراجعة وتحديث خطة العمل الاستراتيجية — DEMO DATA',
    type: 'Strategic',
    priority: 'Medium',
    dueDate: inDays(30),
    owner: 'المؤسس',
    status: 'In Progress',
    notes: 'DEMO DATA',
    createdAt: '2026-09-01T00:00:00Z',
    updatedAt: now,
  },
  {
    id: 'obl-7',
    title: 'تسجيل العلامة التجارية',
    description: 'تقديم طلب تسجيل العلامة التجارية HARAKA — DEMO DATA',
    type: 'Legal',
    priority: 'High',
    dueDate: inDays(-15), // Overdue
    owner: 'المؤسس',
    status: 'Overdue',
    notes: 'DEMO DATA',
    createdAt: '2026-06-01T00:00:00Z',
    updatedAt: now,
  },
  {
    id: 'obl-8',
    title: 'توثيق الكود المصدري',
    description: 'توثيق قاعدة الكود لحماية الملكية الفكرية — DEMO DATA',
    type: 'Legal',
    priority: 'Low',
    dueDate: inDays(45),
    owner: 'مدير التقنية',
    status: 'Completed',
    notes: 'DEMO DATA',
    createdAt: '2026-07-01T00:00:00Z',
    updatedAt: now,
  },
];

export function computeObligationStatus(o: Obligation): Obligation {
  if (o.status === 'Completed' || o.status === 'Cancelled') return o;
  const due = new Date(o.dueDate);
  const now = new Date();
  if (due < now) return { ...o, status: 'Overdue' };
  return o;
}

export const obligationService = {
  getAll: (): Promise<Obligation[]> =>
    Promise.resolve(obligations.map(computeObligationStatus)),

  create: (data: NewObligation): Promise<Obligation> => {
    const item: Obligation = {
      ...data,
      id: `obl-${Date.now()}`,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    obligations = [...obligations, item];
    return Promise.resolve(item);
  },

  update: (id: string, patch: Partial<Obligation>): Promise<Obligation> => {
    obligations = obligations.map(o =>
      o.id === id ? { ...o, ...patch, updatedAt: new Date().toISOString() } : o
    );
    const found = obligations.find(o => o.id === id);
    if (!found) return Promise.reject(new Error('Not found'));
    return Promise.resolve(computeObligationStatus(found));
  },

  delete: (id: string): Promise<void> => {
    obligations = obligations.filter(o => o.id !== id);
    return Promise.resolve();
  },
};
