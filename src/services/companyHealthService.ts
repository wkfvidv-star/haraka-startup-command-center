import { CompanyHealthScore, CriticalSignal, TeamPerformance } from '../types/companyHealth';

export const companyHealthWeights = {
  operational: 0.20,
  financial: 0.20,
  product: 0.15,
  market: 0.20,
  team: 0.10,
  growth: 0.15
};

export function calculateOperationalHealth(startupHealthScore: number): number {
  // Operational relies heavily on the legacy health score which handles ops/risks/blockers
  return startupHealthScore;
}

export function calculateFinancialHealth(budgetPct: number, financialHealthScore?: number): number {
  // Phase 5: if the full financial control engine provided a score, use it.
  if (financialHealthScore !== undefined) return financialHealthScore;
  // Phase 2 fallback (budget utilization only)
  if (budgetPct >= 95) return 10;
  if (budgetPct >= 90) return 30;
  if (budgetPct >= 80) return 60;
  if (budgetPct >= 60) return 80;
  return 100;
}

export function calculateProductHealth(productReadinessPct: number, launchReadinessPct: number): number {
  return Math.round((productReadinessPct + launchReadinessPct) / 2) || productReadinessPct || 0;
}

export function calculateMarketHealth(marketHealthScore: number): number {
  return marketHealthScore;
}

export function calculateTeamHealth(teamPerformances: TeamPerformance[]): number {
  if (!teamPerformances.length) return 100; // Demo fallback
  let totalScore = 0;
  teamPerformances.forEach(p => {
    let score = 100;
    if (p.overdueRate > 30) score -= 20;
    if (p.completionRate < 50) score -= 30;
    if (p.blockedTasks > 2) score -= 20;
    totalScore += Math.max(0, score);
  });
  return Math.round(totalScore / teamPerformances.length);
}

export function calculateGrowthHealth(growthProgresses: number[]): number {
  if (!growthProgresses.length) return 100;
  const avg = growthProgresses.reduce((acc, v) => acc + v, 0) / growthProgresses.length;
  return Math.round(avg);
}

export function calculateCompanyHealth(
  startupHealthScore: number,
  budgetPct: number,
  productReadinessPct: number,
  launchReadinessPct: number,
  marketHealthScore: number,
  teamPerformances: TeamPerformance[],
  growthProgresses: number[],
  financialHealthScore?: number  // Phase 5 — optional richer financial score
): CompanyHealthScore {
  const operational = calculateOperationalHealth(startupHealthScore);
  const financial = calculateFinancialHealth(budgetPct, financialHealthScore);
  const product = calculateProductHealth(productReadinessPct, launchReadinessPct);
  const market = calculateMarketHealth(marketHealthScore);
  const team = calculateTeamHealth(teamPerformances);
  const growth = calculateGrowthHealth(growthProgresses);

  const overall = Math.max(0, Math.min(100, Math.round(
    operational * companyHealthWeights.operational +
    financial * companyHealthWeights.financial +
    product * companyHealthWeights.product +
    market * companyHealthWeights.market +
    team * companyHealthWeights.team +
    growth * companyHealthWeights.growth
  )));

  return { operational, financial, product, market, team, growth, overall };
}

export function getCriticalCompanySignals(health: CompanyHealthScore): CriticalSignal[] {
  const signals: CriticalSignal[] = [];
  if (health.financial <= 30) signals.push({ type: 'Financial', title: 'عجز في الميزانية وانخفاض شديد في المدرج المالي', severity: 'Critical' });
  if (health.operational <= 40) signals.push({ type: 'Operational', title: 'أزمة تشغيلية: مهام حرجة أو عوائق إطلاق أو أخطار أعمال غير محلولة', severity: 'Critical' });
  if (health.product <= 40) signals.push({ type: 'Product', title: 'جاهزية المنتج متأخرة جداً', severity: 'High' });
  if (health.market <= 40) signals.push({ type: 'Market', title: 'انعدام المؤشرات التجارية وحركة السوق', severity: 'High' });
  if (health.team <= 40) signals.push({ type: 'Team', title: 'معدلات إنجاز منخفضة وضغط كبير على الفريق', severity: 'High' });
  if (health.growth <= 40) signals.push({ type: 'Growth', title: 'تأخر شديد في أهداف النمو', severity: 'High' });
  return signals;
}
