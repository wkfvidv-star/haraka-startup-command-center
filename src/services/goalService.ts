import { Goal } from '../types/goal';
import { demoGoals } from '../data/demo/goals';
import { delay } from './delay';

class GoalService {
  private store: Goal[] = [...demoGoals];

  async getAll(): Promise<Goal[]> {
    await delay(200);
    return [...this.store];
  }

  async create(data: Omit<Goal, 'id' | 'createdAt' | 'updatedAt'>): Promise<Goal> {
    await delay(300);
    const item: Goal = {
      ...data,
      id: Date.now().toString(),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    this.store.push(item);
    return item;
  }

  async update(id: string, patch: Partial<Goal>): Promise<Goal> {
    await delay(300);
    const index = this.store.findIndex(i => i.id === id);
    if (index === -1) throw new Error('Not found');
    this.store[index] = { ...this.store[index], ...patch, updatedAt: new Date().toISOString() };
    return this.store[index];
  }

  async delete(id: string): Promise<void> {
    await delay(300);
    this.store = this.store.filter(i => i.id !== id);
  }
}
export const goalService = new GoalService();
