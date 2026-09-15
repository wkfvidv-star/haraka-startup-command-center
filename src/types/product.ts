export type ProductReadinessStatus = 'Not Started' | 'In Progress' | 'Blocked' | 'Ready' | 'Not Applicable';

export interface ProductReadinessItem {
  id: string;
  name: string;
  category: string;
  status: ProductReadinessStatus;
  priority: 'High' | 'Medium' | 'Low';
  owner: string;
  notes: string;
  targetDate: string;
}

export type NewProductReadinessItem = Omit<ProductReadinessItem, 'id'>;
