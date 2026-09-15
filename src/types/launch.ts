export type LaunchBlockerSeverity = 'Critical' | 'High' | 'Medium' | 'Low';
export type LaunchBlockerStatus = 'Open' | 'In Progress' | 'Resolved';

export interface LaunchBlocker {
  id: string;
  title: string;
  description: string;
  category: string;
  severity: LaunchBlockerSeverity;
  owner: string;
  dueDate: string;
  status: LaunchBlockerStatus;
  linkedProject?: string;
  linkedTask?: string;
}

export interface LaunchReadinessCategory {
  id: string;
  name: string;
  readiness: number; // 0-100
  blockersCount: number;
  nextAction: string;
  status: 'Ready' | 'On Track' | 'At Risk' | 'Blocked';
}

export type NewLaunchBlocker = Omit<LaunchBlocker, 'id'>;
