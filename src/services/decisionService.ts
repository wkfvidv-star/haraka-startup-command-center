const delay = (ms = 100) => new Promise<void>((r) => setTimeout(r, ms));
import { supabase } from '../lib/supabase';
import { Decision, NewDecision } from '../types/decision';
import { demoDecisions } from '../data/demo/decisions';



class DecisionService {

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

  private decisions: Decision[] = [...demoDecisions];

  async getDecisions(): Promise<Decision[]> {
    await delay(100);
    return [...this.decisions];
  }

  async createDecision(data: NewDecision): Promise<Decision> {
    await delay(200);
    const item: Decision = { 
      ...data, 
      id: `dec-${Date.now()}`,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    this.decisions.push(item);
    return item;
  }

  async updateDecision(id: string, patch: Partial<Decision>): Promise<Decision> {
    await delay(200);
    const idx = this.decisions.findIndex(i => i.id === id);
    if (idx === -1) throw new Error('Not found');
    this.decisions[idx] = { ...this.decisions[idx], ...patch };
    return this.decisions[idx];
  }

  async deleteDecision(id: string): Promise<void> {
    await delay(200);
    this.decisions = this.decisions.filter(i => i.id !== id);
  }
}

export const decisionService = new DecisionService();
