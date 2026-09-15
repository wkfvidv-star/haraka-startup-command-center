import { Lead } from '../types/market';
import { demoLeads } from '../data/demo/market';
import { delay } from './delay';

class LeadService {
  private store: Lead[] = [...demoLeads];

  async getAll(): Promise<Lead[]> {
    await delay(200);
    return [...this.store];
  }
}
export const leadService = new LeadService();
