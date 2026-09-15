// ============================================================
// TYPES: task.ts — Task model with full relational fields
// ============================================================

export type TaskStatus = 'Backlog' | 'Todo' | 'In Progress' | 'Review' | 'Done' | 'Blocked';
export type TaskPriority = 'P0 (Critical)' | 'P1 (High)' | 'P2 (Medium)' | 'P3 (Low)';

export interface Task {
  id: string;
  title: string;
  description: string;
  owner: string;
  priority: TaskPriority;
  deadline: string; // ISO date string
  status: TaskStatus;
  projectId?: string; // FK → Project.id
  category: string; // e.g. Legal, Product, Marketing, Finance
  estimatedHours?: number;
  actualHours?: number;
  createdAt: string;
  updatedAt: string;
}

export type NewTask = Omit<Task, 'id' | 'createdAt' | 'updatedAt'>;
export type UpdateTask = Partial<Omit<Task, 'id' | 'createdAt'>> & { updatedAt: string };
