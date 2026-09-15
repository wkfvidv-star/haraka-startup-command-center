// ============================================================
// TYPES: financialControl.ts — Phase 5 Financial Control
// All figures are DEMO DATA for planning purposes only.
// Not real financial data or accounting records.
// ============================================================

// ─── Financial Allocation ───────────────────────────────────
export type AllocationCategory =
  | 'Product'
  | 'Technology'
  | 'Marketing'
  | 'Sales'
  | 'Operations'
  | 'Team'
  | 'LegalIP'
  | 'Infrastructure'
  | 'Other';

export type AllocationPriority = 'Critical' | 'High' | 'Medium' | 'Low';

export type AllocationStatus =
  | 'Planned'
  | 'Active'
  | 'At Risk'
  | 'Completed'
  | 'Paused'
  | 'Cancelled';

export interface FinancialAllocation {
  id: string;
  name: string;
  category: AllocationCategory;
  description: string;
  allocatedAmount: number;
  spentAmount: number;
  remainingAmount: number; // computed: allocatedAmount - spentAmount
  priority: AllocationPriority;
  status: AllocationStatus;
  linkedGoalId?: string;
  linkedInitiativeId?: string;
  notes: string;
  createdAt: string;
  updatedAt: string;
}

export type NewFinancialAllocation = Omit<FinancialAllocation, 'id' | 'remainingAmount' | 'createdAt' | 'updatedAt'>;

// ─── Financial Scenario ──────────────────────────────────────
export type ScenarioType = 'Conservative' | 'Base' | 'Growth';

export interface FinancialScenario {
  id: string;
  name: string;
  type: ScenarioType;
  description: string;
  monthlyRevenue: number;      // DEMO
  monthlyExpenses: number;     // DEMO
  availableCash: number;       // DEMO
  monthlyNetBurn: number;      // computed: monthlyExpenses - monthlyRevenue
  runwayMonths: number;        // computed
  isCashFlowPositive: boolean; // computed
  notes: string;
}

// ─── Funding Milestone ───────────────────────────────────────
export type MilestoneStatus = 'Planned' | 'Active' | 'At Risk' | 'Completed' | 'Paused';

export interface FundingMilestone {
  id: string;
  name: string;
  description: string;
  targetBudget: number;
  spentAmount: number;
  remainingAmount: number; // computed
  status: MilestoneStatus;
  targetDate: string;
  linkedGoalId?: string;
  linkedInitiativeId?: string;
  notes: string;
  createdAt: string;
  updatedAt: string;
}

export type NewFundingMilestone = Omit<FundingMilestone, 'id' | 'remainingAmount' | 'createdAt' | 'updatedAt'>;

// ─── Financial Snapshot (Monthly) ───────────────────────────
export interface FinancialSnapshot {
  id: string;
  month: string;           // e.g. "2026-07"
  label: string;           // e.g. "يوليو 2026"
  grossBurn: number;       // total cash expenses that month — DEMO
  cashInflow: number;      // won revenue that month — DEMO
  netBurn: number;         // computed: grossBurn - cashInflow
  notes: string;
  isDemoData: true;        // always true — explicit marker
}

// ─── Cash Position ───────────────────────────────────────────
export interface CashPosition {
  totalFunding: number;
  wonRevenue: number;
  actualExpenses: number;
  reservedAmount: number;
  availableCash: number;        // totalFunding + wonRevenue - actualExpenses - reservedAmount
  isFounderPlanningMetric: true; // explicit disclaimer
}

// ─── Burn Rate ───────────────────────────────────────────────
export interface BurnRate {
  grossBurn: number;             // current month gross
  netBurn: number;               // grossBurn - cashInflow
  trailingAvgNetBurn: number;    // 3-month average
  cashInflow: number;
  isCashFlowPositive: boolean;
  hasEnoughHistory: boolean;
}

// ─── Runway ──────────────────────────────────────────────────
export type RunwayStatus = 'Healthy' | 'Warning' | 'Short' | 'Critical';

export interface RunwayInfo {
  months: number;
  status: RunwayStatus;
  estimatedCashOutDate: string | null; // ISO date or null if no burn
  isNoBurn: boolean;
}

// ─── Financial Signal ─────────────────────────────────────────
export type SignalSeverity = 'Critical' | 'High' | 'Warning' | 'Healthy';

export interface FinancialSignal {
  severity: SignalSeverity;
  title: string;
  message: string;
}

// ─── Full Financial Control State ────────────────────────────
export interface FinancialControlState {
  cashPosition: CashPosition;
  burnRate: BurnRate;
  runway: RunwayInfo;
  signals: FinancialSignal[];
  financialHealthScore: number; // 0-100, feeds into Company Health
}
