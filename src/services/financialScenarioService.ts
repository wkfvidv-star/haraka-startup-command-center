import { supabase } from '../lib/supabase';
// ============================================================
// SERVICE: financialScenarioService.ts — Phase 5
// DEMO PLANNING SCENARIOS — Not real forecasts.
// ============================================================
import { FinancialScenario } from '../types/financialControl';

function computeScenario(s: Omit<FinancialScenario, 'monthlyNetBurn' | 'runwayMonths' | 'isCashFlowPositive'>): FinancialScenario {
  const netBurn = s.monthlyExpenses - s.monthlyRevenue;
  const isCFP = netBurn <= 0;
  const runway = isCFP ? 999 : s.availableCash > 0 ? s.availableCash / netBurn : 0;
  return {
    ...s,
    monthlyNetBurn: Math.max(0, netBurn),
    runwayMonths: isCFP ? 999 : Math.round(runway * 10) / 10,
    isCashFlowPositive: isCFP,
  };
}

const SCENARIOS: FinancialScenario[] = [
  computeScenario({
    id: 'scen-1',
    name: 'المحافظ',
    type: 'Conservative',
    description: 'إيرادات أقل من المتوقع + مصاريف مرتفعة — DEMO PLANNING SCENARIO',
    monthlyRevenue: 30000,
    monthlyExpenses: 400000,
    availableCash: 2300000,
    notes: 'DEMO DATA',
  }),
  computeScenario({
    id: 'scen-2',
    name: 'الأساسي',
    type: 'Base',
    description: 'الوضع المتوقع بناءً على خطة العمل الحالية — DEMO PLANNING SCENARIO',
    monthlyRevenue: 80000,
    monthlyExpenses: 325000,
    availableCash: 2300000,
    notes: 'DEMO DATA',
  }),
  computeScenario({
    id: 'scen-3',
    name: 'النمو',
    type: 'Growth',
    description: 'إيرادات أعلى + استثمار أكبر في النمو — DEMO PLANNING SCENARIO',
    monthlyRevenue: 200000,
    monthlyExpenses: 450000,
    availableCash: 2300000,
    notes: 'DEMO DATA',
  }),
];

export const financialScenarioService = {
  getAll: (): Promise<FinancialScenario[]> => Promise.resolve(SCENARIOS),
};
