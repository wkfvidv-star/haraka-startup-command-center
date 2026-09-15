export type DecisionStatus = 
  | 'Open'
  | 'Under Review'
  | 'Decided'
  | 'Implemented'
  | 'Reviewed';

export type DecisionPriority = 'Critical' | 'High' | 'Medium' | 'Low';

export interface Decision {
  id: string;
  title: string;
  description: string;
  reason: string;
  options: string;
  selectedOption: string;
  expectedImpact: string;
  actualImpact: string;
  owner: string;
  priority: DecisionPriority;
  status: DecisionStatus;
  decisionDate: string;
  reviewDate: string;
  notes: string;
  createdAt: string;
  updatedAt: string;
}

export type NewDecision = Omit<Decision, 'id' | 'createdAt' | 'updatedAt'>;
