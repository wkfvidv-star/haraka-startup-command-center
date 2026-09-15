import { supabase } from '../lib/supabase';
// ============================================================
// SERVICE: ipService.ts — Phase 6
// Tracking only. No legal advice. DEMO DATA.
// ============================================================
import { IPAsset, NewIPAsset } from '../types/governance';

const now = new Date().toISOString();

let ipAssets: IPAsset[] = [
  {
    id: 'ip-1',
    name: 'علامة HARAKA التجارية',
    type: 'Brand',
    description: 'العلامة التجارية الرئيسية للمشروع — DEMO DATA',
    status: 'In Progress',
    owner: 'المؤسس',
    protectionStatus: 'In Process',
    notes: 'DEMO DATA — جاري تقديم طلب التسجيل',
    createdAt: '2026-06-01T00:00:00Z',
    updatedAt: now,
  },
  {
    id: 'ip-2',
    name: 'الشعار الرسمي',
    type: 'Logo',
    description: 'تصميم الشعار الرسمي للمشروع — DEMO DATA',
    status: 'Protected',
    owner: 'المؤسس',
    registrationDate: '2026-03-01',
    protectionStatus: 'Protected',
    notes: 'DEMO DATA',
    createdAt: '2026-03-01T00:00:00Z',
    updatedAt: now,
  },
  {
    id: 'ip-3',
    name: 'منصة HARAKA الرقمية',
    type: 'Platform',
    description: 'المنصة التقنية الرئيسية — DEMO DATA',
    status: 'In Progress',
    owner: 'مدير التقنية',
    protectionStatus: 'Not Protected',
    reviewDate: '2026-12-01',
    notes: 'DEMO DATA — تحتاج مراجعة حماية',
    createdAt: '2026-01-01T00:00:00Z',
    updatedAt: now,
  },
  {
    id: 'ip-4',
    name: 'الكود المصدري للتطبيق',
    type: 'Source Code',
    description: 'قاعدة الكود الكاملة للتطبيق — DEMO DATA',
    status: 'Under Review',
    owner: 'مدير التقنية',
    protectionStatus: 'Review Required',
    reviewDate: '2026-10-15',
    notes: 'DEMO DATA — تحتاج مراجعة قانونية',
    createdAt: '2026-05-01T00:00:00Z',
    updatedAt: now,
  },
  {
    id: 'ip-5',
    name: 'خوارزمية التوصية',
    type: 'Algorithm',
    description: 'خوارزمية التوصية الخاصة بالمنصة — DEMO DATA',
    status: 'Planned',
    owner: 'مدير التقنية',
    protectionStatus: 'Not Protected',
    notes: 'DEMO DATA — قيد التطوير',
    createdAt: '2026-08-01T00:00:00Z',
    updatedAt: now,
  },
];

export const ipService = {
  getAll: (): Promise<IPAsset[]> => Promise.resolve(ipAssets),

  create: (data: NewIPAsset): Promise<IPAsset> => {
    const item: IPAsset = {
      ...data,
      id: `ip-${Date.now()}`,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    ipAssets = [...ipAssets, item];
    return Promise.resolve(item);
  },

  update: (id: string, patch: Partial<IPAsset>): Promise<IPAsset> => {
    ipAssets = ipAssets.map(a =>
      a.id === id ? { ...a, ...patch, updatedAt: new Date().toISOString() } : a
    );
    const found = ipAssets.find(a => a.id === id);
    if (!found) return Promise.reject(new Error('Not found'));
    return Promise.resolve(found);
  },

  delete: (id: string): Promise<void> => {
    ipAssets = ipAssets.filter(a => a.id !== id);
    return Promise.resolve();
  },
};
