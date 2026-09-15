// ============================================================
// SERVICE: financialSnapshotService.ts — Phase 5
// Monthly snapshots — explicitly DEMO DATA.
// ============================================================
import { FinancialSnapshot } from '../types/financialControl';

// Three months of DEMO data for trailing average calculation
const snapshots: FinancialSnapshot[] = [
  {
    id: 'snap-1',
    month: '2026-07',
    label: 'يوليو 2026',
    grossBurn: 285000,
    cashInflow: 0,
    netBurn: 285000,
    notes: 'DEMO DATA — Pre-revenue month',
    isDemoData: true,
  },
  {
    id: 'snap-2',
    month: '2026-08',
    label: 'أغسطس 2026',
    grossBurn: 310000,
    cashInflow: 50000,
    netBurn: 260000,
    notes: 'DEMO DATA — First pilot revenue',
    isDemoData: true,
  },
  {
    id: 'snap-3',
    month: '2026-09',
    label: 'سبتمبر 2026',
    grossBurn: 325000,
    cashInflow: 80000,
    netBurn: 245000,
    notes: 'DEMO DATA — Current month estimate',
    isDemoData: true,
  },
];

export const financialSnapshotService = {
  getAll: (): Promise<FinancialSnapshot[]> => Promise.resolve(snapshots),
  getLastN: (n: number): Promise<FinancialSnapshot[]> =>
    Promise.resolve(snapshots.slice(-n)),
};
