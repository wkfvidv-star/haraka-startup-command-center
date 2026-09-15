const delay = (ms = 100) => new Promise<void>((r) => setTimeout(r, ms));
import { supabase } from '../lib/supabase';
import { Risk, NewRisk, RiskSeverity } from '../types/risk';
import { demoRisks } from '../data/demo/risks';



function computeSeverity(probability: string, impact: string): RiskSeverity {
  if (probability === 'High' && impact === 'High') return 'Critical';
  if (probability === 'High' && impact === 'Medium') return 'High';
  if (probability === 'Medium' && impact === 'High') return 'High';
  if (probability === 'Low' && impact === 'Low') return 'Low';
  return 'Medium';
}

class RiskService {

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
