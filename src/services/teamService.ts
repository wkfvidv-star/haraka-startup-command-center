
import { TeamMember } from '../types/team';
import { demoTeamMembers } from '../data/demo/team';
import { delay } from './delay';

class TeamService {
  private store: any[] = [];

  async getAll(): Promise<TeamMember[]> {
    await delay(200);
    return [...this.store];
  }

  async create(data: Omit<TeamMember, 'id' | 'createdAt' | 'updatedAt'>): Promise<TeamMember> {
    await delay(300);
    const item: TeamMember = {
      ...data,
      id: Date.now().toString(),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    this.store.push(item);
    return item;
  }

  async update(id: string, patch: Partial<TeamMember>): Promise<TeamMember> {
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
export const teamService = new TeamService();
