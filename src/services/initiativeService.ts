import { Initiative } from '../types/initiative';
import { demoInitiatives } from '../data/demo/initiatives';
import { delay } from './delay';

class InitiativeService {
  private store: Initiative[] = [...demoInitiatives];

  async getAll(): Promise<Initiative[]> {
    await delay(200);
    return [...this.store];
  }

  async create(data: Omit<Initiative, 'id' | 'createdAt' | 'updatedAt' | 'progress'>): Promise<Initiative> {
    await delay(300);
    const item: Initiative = {
      ...data,
      progress: 0,
      id: Date.now().toString(),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    this.store.push(item);
    return item;
  }

  async update(id: string, patch: Partial<Initiative>): Promise<Initiative> {
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
export const initiativeService = new InitiativeService();
