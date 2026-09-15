export type RiskProbability = 'High' | 'Medium' | 'Low';
export type RiskImpact = 'High' | 'Medium' | 'Low';
export type RiskSeverity = 'Critical' | 'High' | 'Medium' | 'Low';
export type RiskStatus = 'Open' | 'Mitigated' | 'Closed';

export interface Risk {
  id: string;
  title: string;
  description: string;
  category: string;
  probability: RiskProbability;
  impact: RiskImpact;
  severity: RiskSeverity; // Computed
  owner: string;
  mitigation: string;
  status: RiskStatus;
  dueDate: string;
}

export type NewRisk = Omit<Risk, 'id' | 'severity'>;
