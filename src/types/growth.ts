export type GrowthMetric = 
  | 'Leads'
  | 'Qualified Leads'
  | 'Opportunities'
  | 'Pilots'
  | 'Customers'
  | 'Revenue'
  | 'Partnerships'
  | 'Retention'
  | 'Conversion';

export type GrowthStatus = 
  | 'Not Started'
  | 'On Track'
  | 'At Risk'
  | 'Behind'
  | 'Completed'
  | 'Cancelled';

export interface GrowthTarget {
  id: string;
  name: string;
  metric: GrowthMetric;
  period: string;
  target: number;
  current: number;
  unit: string;
  owner: string;
  status: GrowthStatus;
  notes: string;
  createdAt: string;
  updatedAt: string;
}

export type NewGrowthTarget = Omit<GrowthTarget, 'id' | 'createdAt' | 'updatedAt'>;
