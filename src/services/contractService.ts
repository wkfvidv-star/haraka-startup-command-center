import { supabase } from '../lib/supabase';
// ============================================================
// SERVICE: contractService.ts — Phase 6
// DEMO DATA only. No legal records.
// ============================================================
import { ContractRecord, NewContractRecord } from '../types/governance';

const now = new Date().toISOString();
const today = new Date();
const inDays = (d: number) => new Date(today.getTime() + d * 86400000).toISOString().split('T')[0];

let contracts: ContractRecord[] = [
  {
    id: 'cnt-1',
    name: 'اتفاقية الانضمام لبرنامج الحاضنة',
    counterparty: 'هيئة الحاضنة',
    type: 'School',
    startDate: '2026-01-15',
    endDate: inDays(120),
    value: 0,
    status: 'Active',
    owner: 'المؤسس',
    notes: 'DEMO DATA',
    createdAt: '2026-01-15T00:00:00Z',
    updatedAt: now,
  },
  {
    id: 'cnt-2',
    name: 'عقد استشارات تقنية',
    counterparty: 'شركة التقنية للاستشارات',
    type: 'Service',
    startDate: '2026-04-01',
    endDate: inDays(20),
    value: 150000,
    status: 'Expiring',
    owner: 'مدير التقنية',
    notes: 'DEMO DATA — يقترب من الانتهاء',
    createdAt: '2026-04-01T00:00:00Z',
    updatedAt: now,
  },
  {
    id: 'cnt-3',
    name: 'اتفاقية التعاون مع الشريك الاستراتيجي',
    counterparty: 'شركة الشريك',
    type: 'Partner',
    startDate: '2026-03-01',
    endDate: inDays(-20),
    value: 0,
    status: 'Expired',
    owner: 'المؤسس',
    notes: 'DEMO DATA — منتهية',
    createdAt: '2026-03-01T00:00:00Z',
    updatedAt: now,
  },
  {
    id: 'cnt-4',
    name: 'اتفاقية الخدمات السحابية',
    counterparty: 'مزود السحابة',
    type: 'Supplier',
    startDate: '2026-06-01',
    endDate: inDays(180),
    value: 60000,
    status: 'Active',
    owner: 'مدير التقنية',
    notes: 'DEMO DATA',
    createdAt: '2026-06-01T00:00:00Z',
    updatedAt: now,
  },
  {
    id: 'cnt-5',
    name: 'عقد التصميم الجرافيكي',
    counterparty: 'استوديو التصميم',
    type: 'Service',
    startDate: '2026-07-01',
    endDate: inDays(60),
    value: 40000,
    status: 'Active',
    owner: 'فريق التسويق',
    notes: 'DEMO DATA',
    createdAt: '2026-07-01T00:00:00Z',
    updatedAt: now,
  },
];

export function computeContractStatus(c: ContractRecord): ContractRecord {
  if (c.status === 'Terminated' || c.status === 'Draft') return c;
  const end = new Date(c.endDate);
  const now = new Date();
  const diffDays = (end.getTime() - now.getTime()) / 86400000;
  if (diffDays < 0) return { ...c, status: 'Expired' };
  if (diffDays <= 30) return { ...c, status: 'Expiring' };
  return { ...c, status: 'Active' };
}

export const contractService = {
  getAll: (): Promise<ContractRecord[]> =>
    Promise.resolve(contracts.map(computeContractStatus)),

  create: (data: NewContractRecord): Promise<ContractRecord> => {
    const item: ContractRecord = {
      ...data,
      id: `cnt-${Date.now()}`,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    contracts = [...contracts, item];
    return Promise.resolve(item);
  },

  update: (id: string, patch: Partial<ContractRecord>): Promise<ContractRecord> => {
    contracts = contracts.map(c =>
      c.id === id ? { ...c, ...patch, updatedAt: new Date().toISOString() } : c
    );
    const found = contracts.find(c => c.id === id);
    if (!found) return Promise.reject(new Error('Not found'));
    return Promise.resolve(computeContractStatus(found));
  },

  delete: (id: string): Promise<void> => {
    contracts = contracts.filter(c => c.id !== id);
    return Promise.resolve();
  },
};
