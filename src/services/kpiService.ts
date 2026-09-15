import { KPI, NewKPI } from '../types/kpi';
import { demoKPIs } from '../data/demo/kpis';

const delay = (ms: number) => new Promise(res => setTimeout(res, ms));

class KPIService {
  private kpis: KPI[] = [...demoKPIs];

  async getKPIs(): Promise<KPI[]> {
    await delay(100);
    return [...this.kpis];
  }

  async createKPI(data: NewKPI): Promise<KPI> {
    await delay(200);
    const item: KPI = { ...data, id: `kpi-${Date.now()}` };
    this.kpis.push(item);
    return item;
  }

  async updateKPI(id: string, patch: Partial<KPI>): Promise<KPI> {
    await delay(200);
    const idx = this.kpis.findIndex(i => i.id === id);
    if (idx === -1) throw new Error('Not found');
    this.kpis[idx] = { ...this.kpis[idx], ...patch };
    return this.kpis[idx];
  }

  async deleteKPI(id: string): Promise<void> {
    await delay(200);
    this.kpis = this.kpis.filter(i => i.id !== id);
  }
}

export const kpiService = new KPIService();
