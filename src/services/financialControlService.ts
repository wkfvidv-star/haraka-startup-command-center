// ============================================================
// SERVICE: financialControlService.ts — Phase 5
// Central deterministic engine for Cash / Burn / Runway / Signals
// No AI. No external APIs. Pure rule-based calculation.
// ============================================================
import {
  CashPosition,
  BurnRate,
  RunwayInfo,
  RunwayStatus,
  FinancialSignal,
  FinancialControlState,
  FinancialSnapshot,
  FinancialAllocation,
} from '../types/financialControl';
import { Revenue } from '../types/market';
import { Expense } from '../types/finance';

// ─── Cash Position ───────────────────────────────────────────
export function computeCashPosition(
  totalFunding: number,
  revenues: Revenue[],
  expenses: Expense[],
  allocations: FinancialAllocation[]
): CashPosition {
  const wonRevenue = revenues
    .filter(r => r.status === 'Won')
    .reduce((sum, r) => sum + r.amount, 0);

  const actualExpenses = expenses
    .filter(e => e.status === 'Actual')
    .reduce((sum, e) => sum + e.actualAmount, 0);

  const reservedAmount = allocations
    .filter(a => a.status === 'Planned' || a.status === 'Active')
    .reduce((sum, a) => sum + a.remainingAmount, 0);

  const availableCash = Math.max(
    0,
    totalFunding + wonRevenue - actualExpenses - reservedAmount
  );

  return {
    totalFunding,
    wonRevenue,
    actualExpenses,
    reservedAmount,
    availableCash,
    isFounderPlanningMetric: true,
  };
}

// ─── Burn Rate ───────────────────────────────────────────────
export function computeBurnRate(
  snapshots: FinancialSnapshot[],
  revenues: Revenue[]
): BurnRate {
  const last = snapshots[snapshots.length - 1];

  const grossBurn = last ? last.grossBurn : 0;
  const cashInflow = last ? last.cashInflow : 0;
  const netBurn = Math.max(0, grossBurn - cashInflow);
  const isCFP = netBurn <= 0;

  const hasEnoughHistory = snapshots.length >= 3;
  let trailingAvg = netBurn;
  if (hasEnoughHistory) {
    const last3 = snapshots.slice(-3);
    const sumNet = last3.reduce((s, sn) => s + Math.max(0, sn.netBurn), 0);
    trailingAvg = sumNet / 3;
  }

  return {
    grossBurn,
    netBurn,
    trailingAvgNetBurn: trailingAvg,
    cashInflow,
    isCashFlowPositive: isCFP,
    hasEnoughHistory,
  };
}

// ─── Runway ──────────────────────────────────────────────────
export function computeRunway(
  availableCash: number,
  avgNetBurn: number
): RunwayInfo {
  if (availableCash <= 0) {
    return { months: 0, status: 'Critical', estimatedCashOutDate: null, isNoBurn: false };
  }
  if (avgNetBurn <= 0) {
    return { months: 999, status: 'Healthy', estimatedCashOutDate: null, isNoBurn: true };
  }

  const months = availableCash / avgNetBurn;
  const rounded = Math.round(months * 10) / 10;

  let status: RunwayStatus;
  if (rounded >= 6) status = 'Healthy';
  else if (rounded >= 4) status = 'Warning';
  else if (rounded >= 2) status = 'Short';
  else status = 'Critical';

  const cashOutDate = new Date();
  cashOutDate.setMonth(cashOutDate.getMonth() + Math.floor(months));
  const estimatedCashOutDate = cashOutDate.toISOString().split('T')[0];

  return { months: rounded, status, estimatedCashOutDate, isNoBurn: false };
}

// ─── Financial Signals ───────────────────────────────────────
export function computeFinancialSignals(
  cashPosition: CashPosition,
  burnRate: BurnRate,
  runway: RunwayInfo,
  utilizationPct: number
): FinancialSignal[] {
  const signals: FinancialSignal[] = [];

  if (cashPosition.availableCash <= 0) {
    signals.push({ severity: 'Critical', title: 'السيولة النقدية صفر', message: 'الوضع النقدي حرج جداً. يجب إيقاف جميع المصروفات غير الضرورية فوراً.' });
  }
  if (!runway.isNoBurn && runway.months < 2) {
    signals.push({ severity: 'Critical', title: 'مدة استمرارية حرجة', message: `أقل من شهرين من التمويل المتبقي. يجب رفع تمويل إضافي فوراً أو خفض الإنفاق بشكل جذري.` });
  }
  if (utilizationPct >= 90) {
    signals.push({ severity: 'Critical', title: 'استنفاد الميزانية (≥90%)', message: 'تم استهلاك 90% أو أكثر من إجمالي التمويل. توقف عن الإنفاق غير الأساسي.' });
  }
  if (!runway.isNoBurn && runway.months >= 2 && runway.months < 4) {
    signals.push({ severity: 'High', title: 'مدة استمرارية منخفضة', message: 'مدة الاستمرار بين شهرين وأربعة أشهر. راجع الإنفاق وخطط لجولة تمويل.' });
  }
  if (utilizationPct >= 80 && utilizationPct < 90) {
    signals.push({ severity: 'High', title: 'تحذير استهلاك الميزانية (≥80%)', message: 'تم استهلاك أكثر من 80% من التمويل. راجع المصروفات بشكل أسبوعي.' });
  }
  if (!runway.isNoBurn && runway.months >= 4 && runway.months < 6) {
    signals.push({ severity: 'Warning', title: 'مراقبة مدة الاستمرارية', message: 'مدة الاستمرارية بين 4-6 أشهر. ضع خطة لزيادة الإيرادات أو تقليل الإنفاق.' });
  }

  if (signals.length === 0) {
    signals.push({ severity: 'Healthy', title: 'الوضع المالي مستقر', message: 'مدة الاستمرارية كافية والميزانية تحت السيطرة.' });
  }

  return signals;
}

// ─── Financial Health Score (feeds into Company Health) ──────
export function computeFinancialHealthScore(
  runway: RunwayInfo,
  utilizationPct: number,
  cashPosition: CashPosition
): number {
  let score = 100;

  // Runway impact
  if (runway.isNoBurn) {
    // Cash-flow positive — no penalty
  } else if (runway.months < 2) {
    score -= 40;
  } else if (runway.months < 4) {
    score -= 25;
  } else if (runway.months < 6) {
    score -= 15;
  }

  // Budget utilization impact
  if (utilizationPct >= 90) score -= 30;
  else if (utilizationPct >= 80) score -= 15;
  else if (utilizationPct >= 70) score -= 5;

  // Available cash
  if (cashPosition.availableCash <= 0) score -= 20;

  return Math.max(0, Math.min(100, Math.round(score)));
}

// ─── Master Compute ──────────────────────────────────────────
export function computeFinancialControl(
  totalFunding: number,
  revenues: Revenue[],
  expenses: Expense[],
  allocations: FinancialAllocation[],
  snapshots: FinancialSnapshot[],
  utilizationPct: number
): FinancialControlState {
  const cashPosition = computeCashPosition(totalFunding, revenues, expenses, allocations);
  const burnRate = computeBurnRate(snapshots, revenues);
  const runway = computeRunway(cashPosition.availableCash, burnRate.trailingAvgNetBurn);
  const signals = computeFinancialSignals(cashPosition, burnRate, runway, utilizationPct);
  const financialHealthScore = computeFinancialHealthScore(runway, utilizationPct, cashPosition);

  return { cashPosition, burnRate, runway, signals, financialHealthScore };
}
