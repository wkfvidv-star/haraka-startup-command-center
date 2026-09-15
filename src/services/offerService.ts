import { Offer } from '../types/market';
import { demoOffers } from '../data/demo/market';
import { delay } from './delay';

class OfferService {
  private store: Offer[] = [...demoOffers];

  async getAll(): Promise<Offer[]> {
    await delay(200);
    return [...this.store];
  }
}
export const offerService = new OfferService();
