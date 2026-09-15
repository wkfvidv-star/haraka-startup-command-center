// ============================================================
// TYPES: company.ts — Core company and startup state types
// ============================================================

export type StartupStage =
  | 'Innovative Project'
  | 'ProtoMarket / Incubation'
  | 'Product Finalization'
  | 'Pilot'
  | 'Commercial Launch'
  | 'First Revenue'
  | 'Growth';

export interface ReadinessCategory {
  key: string;
  name: string;
  score: number; // 0–100
}

export interface CompanyConfig {
  name: string;
  currentStage: StartupStage;
  currentObjective: string;
  mainMilestone: string;
  nextStep: string;
  currentPriorities: string[];
  mainRisks: string[];
  mainBlockers: string[];
  readinessCategories: ReadinessCategory[];
  // Finance summary
  fundingReceivedDZD: number;
  budgetSpentDZD: number;
  // Aggregates — computed by rule engine, not hardcoded
  startupHealthScore: number; // computed
  overallReadinessScore: number; // computed average of readinessCategories
}

export interface CeoNextMove {
  priority1: string;
  priority2: string;
  risk: string;
  opportunity: string;
  decision: string;
  reason: string;
  hasEnoughData: boolean;
}
