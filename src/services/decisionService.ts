import { Decision, NewDecision } from '../types/decision';
import { demoDecisions } from '../data/demo/decisions';

const delay = (ms: number) => new Promise(res => setTimeout(res, ms));

class DecisionService {
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
