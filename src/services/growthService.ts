
import { GrowthTarget } from '../types/growth';
import { demoGrowthTargets } from '../data/demo/growth';
import { delay } from './delay';

class GrowthService {
  private store: any[] = [];

  async getAll(): Promise<GrowthTarget[]> {
    await delay(200);
    return [...this.store];
  }

  async create(data: Omit<GrowthTarget, 'id' | 'createdAt' | 'updatedAt'>): Promise<GrowthTarget> {
    await delay(300);
    const item: GrowthTarget = {
      ...data,
      id: Date.now().toString(),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    this.store.push(item);
    return item;
  }

  async update(id: string, patch: Partial<GrowthTarget>): Promise<GrowthTarget> {
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
export const growthService = new GrowthService();
