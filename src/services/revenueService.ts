
import { Revenue } from '../types/market';
import { demoRevenue } from '../data/demo/market';
import { delay } from './delay';

class RevenueService {
  private store: any[] = [];

  async getAll(): Promise<Revenue[]> {
    await delay(200);
    return [...this.store];
  }
}
export const revenueService = new RevenueService();
