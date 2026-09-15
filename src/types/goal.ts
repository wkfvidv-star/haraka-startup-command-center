export type GoalType = 
  | 'Company'
  | 'Revenue'
  | 'Product'
  | 'Market'
  | 'Marketing'
  | 'Sales'
  | 'Customer'
  | 'Team';

export type GoalStatus = 
  | 'Not Started'
  | 'On Track'
  | 'At Risk'
  | 'Behind'
  | 'Completed'
  | 'Cancelled';

export type GoalPriority = 'Critical' | 'High' | 'Medium' | 'Low';

export interface Goal {
  id: string;
  title: string;
  description: string;
  type: GoalType;
  period: string;
  targetValue: number;
  currentValue: number;
  unit: string;
  status: GoalStatus;
  priority: GoalPriority;
  owner: string;
  startDate: string;
  endDate: string;
  notes: string;
  createdAt: string;
  updatedAt: string;
}

export type NewGoal = Omit<Goal, 'id' | 'createdAt' | 'updatedAt'>;
