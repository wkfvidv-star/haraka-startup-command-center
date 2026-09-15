// ============================================================
// SERVICE: projectService.ts
// In-memory CRUD for Projects. Progress is computed from tasks.
// ============================================================
import { Project, NewProject } from '../types/project';
import { Task } from '../types/task';
import { demoProjects } from '../data/demo';

const delay = (ms = 120) => new Promise<void>((r) => setTimeout(r, ms));

class ProjectService {
  private store: Project[] = structuredClone(demoProjects);

  async getAll(): Promise<Project[]> {
    await delay();
    return structuredClone(this.store);
  }

  async getById(id: string): Promise<Project | null> {
    await delay();
    return structuredClone(this.store.find((p) => p.id === id) ?? null);
  }

  async create(data: NewProject): Promise<Project> {
    await delay();
    const now = new Date().toISOString();
    const project: Project = {
      ...data,
      id: `proj-${Date.now()}`,
      progress: 0,
      createdAt: now,
      updatedAt: now,
    };
    this.store.push(project);
    return structuredClone(project);
  }

  async update(id: string, patch: Partial<Omit<Project, 'id' | 'createdAt'>>): Promise<Project> {
    await delay();
    const idx = this.store.findIndex((p) => p.id === id);
    if (idx === -1) throw new Error(`Project ${id} not found`);
    this.store[idx] = {
      ...this.store[idx],
      ...patch,
      updatedAt: new Date().toISOString(),
    };
    return structuredClone(this.store[idx]);
  }

  async delete(id: string): Promise<void> {
    await delay();
    this.store = this.store.filter((p) => p.id !== id);
  }

  /**
   * Recompute project progress based on its tasks.
   * Done tasks / total tasks = progress %.
   */
  async recomputeProgress(projectId: string, tasks: Task[]): Promise<Project | null> {
    const projectTasks = tasks.filter((t) => t.projectId === projectId);
    if (projectTasks.length === 0) return null;
    const done = projectTasks.filter((t) => t.status === 'Done').length;
    const progress = Math.round((done / projectTasks.length) * 100);
    return this.update(projectId, { progress });
  }
}

export const projectService = new ProjectService();
