export interface CompanyHealthScore {
  operational: number;
  financial: number;
  product: number;
  market: number;
  team: number;
  growth: number;
  overall: number;
}

export interface CriticalSignal {
  type: 'Operational' | 'Financial' | 'Product' | 'Market' | 'Team' | 'Growth';
  title: string;
  severity: 'Critical' | 'High';
}

export interface TeamPerformance {
  memberId: string;
  assignedTasks: number;
  completedTasks: number;
  overdueTasks: number;
  blockedTasks: number;
  completionRate: number;
  overdueRate: number;
  workload: number; // active tasks + active projects
}
