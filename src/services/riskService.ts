import { Risk, NewRisk, RiskSeverity } from '../types/risk';
import { demoRisks } from '../data/demo/risks';

const delay = (ms: number) => new Promise(res => setTimeout(res, ms));

function computeSeverity(probability: string, impact: string): RiskSeverity {
  if (probability === 'High' && impact === 'High') return 'Critical';
  if (probability === 'High' && impact === 'Medium') return 'High';
  if (probability === 'Medium' && impact === 'High') return 'High';
  if (probability === 'Low' && impact === 'Low') return 'Low';
  return 'Medium';
}

class RiskService {
  private risks: Risk[] = [...demoRisks];

  async getRisks(): Promise<Risk[]> {
    await delay(100);
    return [...this.risks];
  }

  async createRisk(data: NewRisk): Promise<Risk> {
    await delay(200);
    const item: Risk = { 
      ...data, 
      id: `r-${Date.now()}`,
      severity: computeSeverity(data.probability, data.impact)
    };
    this.risks.push(item);
    return item;
  }

  async updateRisk(id: string, patch: Partial<Risk>): Promise<Risk> {
    await delay(200);
    const idx = this.risks.findIndex(i => i.id === id);
    if (idx === -1) throw new Error('Not found');
    const updated = { ...this.risks[idx], ...patch };
    updated.severity = computeSeverity(updated.probability, updated.impact);
    this.risks[idx] = updated;
    return this.risks[idx];
  }

  async deleteRisk(id: string): Promise<void> {
    await delay(200);
    this.risks = this.risks.filter(i => i.id !== id);
  }
}

export const riskService = new RiskService();
