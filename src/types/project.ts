// ============================================================
// TYPES: project.ts — Project model, parent of Tasks
// ============================================================

export type ProjectStatus = 'Planning' | 'Active' | 'On Hold' | 'Completed' | 'Cancelled';

export interface Project {
  id: string;
  name: string;
  description: string;
  owner: string;
  status: ProjectStatus;
  startDate: string; // ISO
  endDate?: string;  // ISO
  progress: number;  // 0–100, computed from tasks
  phase: string;     // e.g. "Phase 1 – Product Finalization"
  initiativeId?: string; // Optional linkage to Initiative
  createdAt: string;
  updatedAt: string;
}

export type NewProject = Omit<Project, 'id' | 'createdAt' | 'updatedAt' | 'progress'>;
export type UpdateProject = Partial<Omit<Project, 'id' | 'createdAt'>> & { updatedAt: string };
