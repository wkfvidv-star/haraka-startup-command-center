import { IncubationPhase, Deliverable, Meeting, NewDeliverable } from '../types/incubation';
import { demoIncubationPhase, demoDeliverables, demoMeetings } from '../data/demo/incubation';

const delay = (ms: number) => new Promise(res => setTimeout(res, ms));

class IncubationService {
  private phase = { ...demoIncubationPhase };
  private deliverables = [...demoDeliverables];
  private meetings = [...demoMeetings];

  async getPhase(): Promise<IncubationPhase> {
    await delay(100);
    return { ...this.phase };
  }

  async getDeliverables(): Promise<Deliverable[]> {
    await delay(100);
    return [...this.deliverables];
  }

  async getMeetings(): Promise<Meeting[]> {
    await delay(100);
    return [...this.meetings];
  }

  async createDeliverable(data: NewDeliverable): Promise<Deliverable> {
    await delay(200);
    const item: Deliverable = { ...data, id: `del-${Date.now()}` };
    this.deliverables.push(item);
    return item;
  }

  async updateDeliverable(id: string, patch: Partial<Deliverable>): Promise<Deliverable> {
    await delay(200);
    const idx = this.deliverables.findIndex(i => i.id === id);
    if (idx === -1) throw new Error('Not found');
    this.deliverables[idx] = { ...this.deliverables[idx], ...patch };
    return this.deliverables[idx];
  }

  async deleteDeliverable(id: string): Promise<void> {
    await delay(200);
    this.deliverables = this.deliverables.filter(i => i.id !== id);
  }
}

export const incubationService = new IncubationService();
