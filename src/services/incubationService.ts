const delay = (ms = 100) => new Promise<void>((r) => setTimeout(r, ms));
import { supabase } from '../lib/supabase';
import { IncubationPhase, Deliverable, Meeting, NewDeliverable } from '../types/incubation';
import { demoIncubationPhase, demoDeliverables, demoMeetings } from '../data/demo/incubation';



class IncubationService {

  private async getCompanyId() {
    const { data: { session } } = await supabase!.auth.getSession();
    if (!session) throw new Error('Not authenticated');
    
    const { data: members, error } = await supabase!
      .from('company_members')
      .select('company_id')
      .eq('status', 'Active')
      .limit(1);
      
    if (error || !members || members.length === 0) {
      throw new Error('No active company found for user');
    }
    return members[0].company_id;
  }

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
