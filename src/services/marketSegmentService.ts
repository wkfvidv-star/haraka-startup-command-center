import { MarketSegment } from '../types/market';
import { demoMarketSegments } from '../data/demo/market';
import { delay } from './delay';

class MarketSegmentService {
  private store: MarketSegment[] = [...demoMarketSegments];

  async getAll(): Promise<MarketSegment[]> {
    await delay(200);
    return [...this.store];
  }
}
export const marketSegmentService = new MarketSegmentService();
