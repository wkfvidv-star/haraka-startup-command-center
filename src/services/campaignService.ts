import { Campaign } from '../types/market';
import { demoCampaigns } from '../data/demo/market';
import { delay } from './delay';

class CampaignService {
  private store: Campaign[] = [...demoCampaigns];

  async getAll(): Promise<Campaign[]> {
    await delay(200);
    return [...this.store];
  }
}
export const campaignService = new CampaignService();
