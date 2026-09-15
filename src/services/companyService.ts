// ============================================================
// SERVICE: companyService.ts
// Manages CompanyConfig. No external calls — mock in-memory.
// ============================================================
import { CompanyConfig } from '../types/company';
import { supabase } from '../lib/supabase';

class CompanyService {
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

  async getConfig(): Promise<CompanyConfig> {
    const companyId = await this.getCompanyId();
    const { data, error } = await supabase!.from('companies').select('*').eq('id', companyId).single();
    if (error) throw error;
    
    // Fallback to default structure for metrics not saved in companies table yet
    return {
      name: data.name,
      currentStage: data.stage || 'Innovative Project',
      currentObjective: data.description || '',
      mainMilestone: data.strategic_phase || '',
      nextStep: '',
      currentPriorities: [],
      mainRisks: [],
      mainBlockers: [],
      readinessCategories: [],
      fundingReceivedDZD: 0,
      budgetSpentDZD: 0,
      startupHealthScore: 0,
      overallReadinessScore: 0
    };
  }

  async updateConfig(patch: Partial<CompanyConfig>): Promise<CompanyConfig> {
    const companyId = await this.getCompanyId();
    // Only name and stage map directly for now
    const updatePayload: any = {};
    if (patch.name) updatePayload.name = patch.name;
    if (patch.currentStage) updatePayload.stage = patch.currentStage;
    if (patch.currentObjective) updatePayload.description = patch.currentObjective;
    if (patch.mainMilestone) updatePayload.strategic_phase = patch.mainMilestone;

    if (Object.keys(updatePayload).length > 0) {
      await supabase!.from('companies').update(updatePayload).eq('id', companyId);
    }
    return this.getConfig();
  }

  async updateReadinessScore(key: string, score: number): Promise<CompanyConfig> {
    // This could just return the config for now since readiness items are fetched dynamically
    return this.getConfig();
  }
}

export const companyService = new CompanyService();
