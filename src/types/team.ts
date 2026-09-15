export type TeamRole = 
  | 'Founder'
  | 'Management'
  | 'Marketing'
  | 'Sales'
  | 'Product'
  | 'Technology'
  | 'Finance'
  | 'Operations'
  | 'Other';

export type TeamDepartment = 
  | 'Management'
  | 'Product'
  | 'Technology'
  | 'Marketing'
  | 'Sales'
  | 'Finance'
  | 'Operations'
  | 'Other';

export type TeamStatus = 'Active' | 'Inactive' | 'On Leave' | 'External';

export interface TeamMember {
  id: string;
  name: string;
  role: TeamRole;
  department: TeamDepartment;
  email: string;
  phone: string;
  status: TeamStatus;
  joinedAt: string;
  responsibilities: string;
  skills: string;
  notes: string;
  createdAt: string;
  updatedAt: string;
}

export type NewTeamMember = Omit<TeamMember, 'id' | 'createdAt' | 'updatedAt'>;
