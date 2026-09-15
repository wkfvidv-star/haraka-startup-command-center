export type KPIStatus = 'On Track' | 'At Risk' | 'Off Track';

export interface KPI {
  id: string;
  name: string;
  category: string;
  target: number;
  currentValue: number;
  unit: string;
  status: KPIStatus;
  frequency: string;
  owner: string;
  source: string;
  notes: string;
}

export type NewKPI = Omit<KPI, 'id'>;
