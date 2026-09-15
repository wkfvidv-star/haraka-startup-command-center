export type InitiativeStatus = 
  | 'Planned'
  | 'Active'
  | 'At Risk'
  | 'Completed'
  | 'Paused'
  | 'Cancelled';

export type InitiativePriority = 'Critical' | 'High' | 'Medium' | 'Low';

export interface Initiative {
  id: string;
  name: string;
  description: string;
  goalId: string; // Mandatory linkage
  owner: string;
  status: InitiativeStatus;
  priority: InitiativePriority;
  progress: number;
  startDate: string;
  endDate: string;
  budget: number;
  notes: string;
  createdAt: string;
  updatedAt: string;
}

export type NewInitiative = Omit<Initiative, 'id' | 'createdAt' | 'updatedAt' | 'progress'>;
