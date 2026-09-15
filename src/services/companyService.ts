// ============================================================
// SERVICE: companyService.ts
// Manages CompanyConfig. No external calls — mock in-memory.
// ============================================================
import { CompanyConfig } from '../types/company';
import { demoCompanyConfig } from '../data/demo';

const delay = (ms = 100) => new Promise<void>((r) => setTimeout(r, ms));

class CompanyService {
  private config: CompanyConfig = structuredClone(demoCompanyConfig);

  async getConfig(): Promise<CompanyConfig> {
    await delay();
    return structuredClone(this.config);
  }

  async updateConfig(patch: Partial<CompanyConfig>): Promise<CompanyConfig> {
    await delay();
    this.config = { ...this.config, ...patch };
    return structuredClone(this.config);
  }

  async updateReadinessScore(key: string, score: number): Promise<CompanyConfig> {
    await delay();
    this.config.readinessCategories = this.config.readinessCategories.map((c) =>
      c.key === key ? { ...c, score } : c
    );
    return structuredClone(this.config);
  }
}

export const companyService = new CompanyService();
