import { Opportunity } from '../types/market';
import { demoOpportunities } from '../data/demo/market';
import { delay } from './delay';

class OpportunityService {
  private store: Opportunity[] = [...demoOpportunities];

  async getAll(): Promise<Opportunity[]> {
    await delay(200);
    return [...this.store];
  }
}
export const opportunityService = new OpportunityService();
