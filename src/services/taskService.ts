// ============================================================
// SERVICE: taskService.ts
// In-memory CRUD for Tasks. Replace internals with Supabase later.
// Interface stays unchanged — UI/Store do not need to be modified.
// ============================================================
import { Task, NewTask } from '../types/task';
import { demoTasks } from '../data/demo';

const delay = (ms = 120) => new Promise<void>((r) => setTimeout(r, ms));

class TaskService {
  private store: Task[] = structuredClone(demoTasks);

  async getAll(): Promise<Task[]> {
    await delay();
    return structuredClone(this.store);
  }

  async getById(id: string): Promise<Task | null> {
    await delay();
    return structuredClone(this.store.find((t) => t.id === id) ?? null);
  }

  async getByProject(projectId: string): Promise<Task[]> {
    await delay();
    return structuredClone(this.store.filter((t) => t.projectId === projectId));
  }

  async create(data: NewTask): Promise<Task> {
    await delay();
    const now = new Date().toISOString();
    const task: Task = {
      ...data,
      id: `task-${Date.now()}`,
      createdAt: now,
      updatedAt: now,
    };
    this.store.push(task);
    return structuredClone(task);
  }

  async update(id: string, patch: Partial<Omit<Task, 'id' | 'createdAt'>>): Promise<Task> {
    await delay();
    const idx = this.store.findIndex((t) => t.id === id);
    if (idx === -1) throw new Error(`Task ${id} not found`);
    this.store[idx] = {
      ...this.store[idx],
      ...patch,
      updatedAt: new Date().toISOString(),
    };
    return structuredClone(this.store[idx]);
  }

  async delete(id: string): Promise<void> {
    await delay();
    this.store = this.store.filter((t) => t.id !== id);
  }
}

export const taskService = new TaskService();
