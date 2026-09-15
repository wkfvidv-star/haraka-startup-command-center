import { Pilot } from '../types/market';
import { demoPilots } from '../data/demo/market';
import { delay } from './delay';

class PilotService {
  private store: Pilot[] = [...demoPilots];

  async getAll(): Promise<Pilot[]> {
    await delay(200);
    return [...this.store];
  }
}
export const pilotService = new PilotService();
