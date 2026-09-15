import { Partnership } from '../types/market';
import { demoPartnerships } from '../data/demo/market';
import { delay } from './delay';

class PartnershipService {
  private store: Partnership[] = [...demoPartnerships];

  async getAll(): Promise<Partnership[]> {
    await delay(200);
    return [...this.store];
  }
}
export const partnershipService = new PartnershipService();
