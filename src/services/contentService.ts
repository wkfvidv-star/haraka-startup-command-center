import { Content } from '../types/market';
import { demoContent } from '../data/demo/market';
import { delay } from './delay';

class ContentService {
  private store: Content[] = [...demoContent];

  async getAll(): Promise<Content[]> {
    await delay(200);
    return [...this.store];
  }
}
export const contentService = new ContentService();
