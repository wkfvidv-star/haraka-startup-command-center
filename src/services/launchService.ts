import { LaunchBlocker, LaunchReadinessCategory, NewLaunchBlocker } from '../types/launch';
import { demoLaunchBlockers, demoLaunchCategories } from '../data/demo/launch';

const delay = (ms: number) => new Promise(res => setTimeout(res, ms));

class LaunchService {
  private blockers: LaunchBlocker[] = [...demoLaunchBlockers];
  private categories: LaunchReadinessCategory[] = [...demoLaunchCategories];

  async getCategories(): Promise<LaunchReadinessCategory[]> {
    await delay(100);
    return [...this.categories];
  }

  async getBlockers(): Promise<LaunchBlocker[]> {
    await delay(100);
    return [...this.blockers];
  }

  async createBlocker(data: NewLaunchBlocker): Promise<LaunchBlocker> {
    await delay(200);
    const item: LaunchBlocker = { ...data, id: `lb-${Date.now()}` };
    this.blockers.push(item);
    return item;
  }

  async updateBlocker(id: string, patch: Partial<LaunchBlocker>): Promise<LaunchBlocker> {
    await delay(200);
    const idx = this.blockers.findIndex(i => i.id === id);
    if (idx === -1) throw new Error('Not found');
    this.blockers[idx] = { ...this.blockers[idx], ...patch };
    return this.blockers[idx];
  }

  async deleteBlocker(id: string): Promise<void> {
    await delay(200);
    this.blockers = this.blockers.filter(i => i.id !== id);
  }
}

export const launchService = new LaunchService();
