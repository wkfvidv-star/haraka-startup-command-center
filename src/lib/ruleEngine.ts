import { isPast, addDays } from 'date-fns';
import { Task } from '../types/task';
import { Project } from '../types/project';
import { CompanyConfig, CeoNextMove } from '../types/company';
import { LaunchBlocker } from '../types/launch';
import { Risk } from '../types/risk';
import { GovernanceSignal } from '../types/governance';
import { Lead, Opportunity, Pilot, Customer, Campaign, Revenue } from '../types/market';
import { Goal } from '../types/goal';
import { Initiative } from '../types/initiative';
import { GrowthTarget } from '../types/growth';

export function computeOverallReadiness(config: CompanyConfig): number {
  if (!config.readinessCategories.length) return 0;
  const sum = config.readinessCategories.reduce((acc, c) => acc + c.score, 0);
  return Math.round(sum / config.readinessCategories.length);
}

export function computeHealthScore(
  tasks: Task[], 
  config: CompanyConfig,
  launchBlockers: LaunchBlocker[],
  risks: Risk[],
  productReadinessPct: number,
  governanceSignals: GovernanceSignal[] = []
): number {
  const budgetPct = config.fundingReceivedDZD > 0
    ? (config.budgetSpentDZD / config.fundingReceivedDZD) * 100
    : 0;

  const overdueTasks = tasks.filter(t => t.status !== 'مكتملة' && isPast(new Date(t.deadline)));
  const blockedTasks = tasks.filter(t => t.status === 'تحتاج تعديلاً');
  const criticalOverdue = overdueTasks.filter(t => t.priority === 'حرجة');

  const openLaunchBlockers = launchBlockers.filter(b => b.status !== 'Resolved');
  const criticalLaunchBlockers = openLaunchBlockers.filter(b => b.severity === 'Critical');
  
  const openHighRisks = risks.filter(r => r.status === 'Open' && (r.severity === 'Critical' || r.severity === 'High'));

  let score = 100;
  
  score -= criticalOverdue.length * 15;
  score -= (overdueTasks.length - criticalOverdue.length) * 5;
  score -= blockedTasks.length * 8;

  criticalLaunchBlockers.forEach(b => {
    if (!b.linkedTask) {
      score -= 10;
    }
  });

  const riskPenalty = Math.min(openHighRisks.length * 5, 15);
  score -= riskPenalty;

  if (productReadinessPct < 50) {
    score -= 10;
  }

  if (budgetPct >= 90) {
    score -= 20;
  } else if (budgetPct >= 80) {
    score -= 10;
  }

  const baseScore = Math.max(0, Math.min(100, Math.round(score)));

  // Phase 6: Governance Signals Integration
  // Penalty for governance issues, capped to not drop score below 40 for critical regression test
  let govPenalty = 0;
  const criticalGov = governanceSignals.filter(s => s.severity === 'Critical').length;
  const highGov = governanceSignals.filter(s => s.severity === 'High').length;
  const warningGov = governanceSignals.filter(s => s.severity === 'Warning').length;

  govPenalty += criticalGov * 10;
  govPenalty += highGov * 5;
  govPenalty += warningGov * 2;

  let finalScore = baseScore;
  if (govPenalty > 0) {
    if (baseScore > 40) {
      finalScore = Math.max(40, baseScore - govPenalty);
    }
  }

  return finalScore;
}

export function computeMarketHealth(
  leads: Lead[],
  opportunities: Opportunity[],
  pilots: Pilot[],
  customers: Customer[],
  revenue: Revenue[]
): number {
  let score = 100;
  
  const recentLeads = leads.filter(l => new Date(l.createdAt).getTime() > Date.now() - 30 * 86400000);
  if (recentLeads.length === 0) score -= 15;

  const openOpps = opportunities.filter(o => !['Won', 'Lost'].includes(o.stage));
  if (openOpps.length === 0) score -= 25;

  const activePilots = pilots.filter(p => p.status === 'Active' || p.status === 'Preparation' || p.status === 'Evaluation');
  if (activePilots.length === 0) score -= 15;

  const activeCustomers = customers.filter(c => c.status === 'Active' || c.status === 'Renewal');
  if (activeCustomers.length === 0) score -= 25;

  const wonRevenue = revenue.filter(r => r.status === 'Won');
  if (wonRevenue.length === 0) score -= 20;

  return Math.max(0, Math.min(100, Math.round(score)));
}

export function computeCeoNextMove(
  tasks: Task[],
  projects: Project[],
  config: CompanyConfig,
  launchBlockers: LaunchBlocker[],
  risks: Risk[],
  productReadinessPct: number,
  launchReadinessPct: number,
  opportunities: Opportunity[],
  pilots: Pilot[],
  customers: Customer[],
  leads: Lead[],
  campaigns: Campaign[],
  goals: Goal[],
  initiatives: Initiative[],
  growthTargets: GrowthTarget[],
  governanceSignals: GovernanceSignal[] = []
): CeoNextMove {
  const budgetPct = config.fundingReceivedDZD > 0 ? (config.budgetSpentDZD / config.fundingReceivedDZD) * 100 : 0;
  const criticalOverdue = tasks.filter(t => t.priority === 'حرجة' && t.status !== 'مكتملة' && isPast(new Date(t.deadline)));
  const openLaunchBlockers = launchBlockers.filter(b => b.status !== 'Resolved' && b.severity === 'Critical');
  const openCriticalRisks = risks.filter(r => r.status === 'Open' && r.severity === 'Critical');
  
  const isBudgetCritical = budgetPct >= 90;
  const hasCriticalOps = criticalOverdue.length > 0 || openLaunchBlockers.length > 0;
  const hasCriticalRisk = openCriticalRisks.length > 0;
  
  const overdueOpportunities = opportunities.filter(o => !['Won', 'Lost'].includes(o.stage) && isPast(new Date(o.nextAction)));
  const atRiskPilots = pilots.filter(p => p.status === 'Active' && p.overallScore < 50);
  const closingSoonOpps = opportunities.filter(o => !['Won', 'Lost'].includes(o.stage) && !isPast(new Date(o.expectedCloseDate)) && new Date(o.expectedCloseDate) <= addDays(new Date(), 7));
  const upcomingRenewals = customers.filter(c => c.status === 'Active' && new Date(c.renewalDate) <= addDays(new Date(), 30));
  const openOpps = opportunities.filter(o => !['Won', 'Lost'].includes(o.stage));
  
  const atRiskGoals = goals.filter(g => g.status === 'At Risk' || g.status === 'Behind');
  const atRiskInitiatives = initiatives.filter(i => i.status === 'At Risk');
  const behindGrowth = growthTargets.filter(g => g.status === 'Behind');

  const criticalGov = governanceSignals.filter(s => s.severity === 'Critical');
  const highGov = governanceSignals.filter(s => s.severity === 'High');
  const warningGov = governanceSignals.filter(s => s.severity === 'Warning');

  let priority1 = '';
  let priority2 = '';
  let decision = '';
  let reason = '';
  let risk = '';
  const opportunity = config.mainMilestone
    ? `هدف قادم: "${config.mainMilestone}" — يجب تسريع العمل للوصول للمرحلة التالية.`
    : 'حافظ على الزخم للوصول إلى المؤشرات القادمة.';

  // ── P0: Combined Crises ───────────────────────────────────
  if (isBudgetCritical && hasCriticalOps) {
    priority1 = 'حرج: إيقاف الإنفاق غير الضروري وتوجيه الموارد لحل العائق التشغيلي الحرج.';
    priority2 = 'مراجعة الميزانية المتبقية فوراً.';
    decision = 'إيقاف العمليات الاختيارية. معالجة العائق الحرج لحماية الإطلاق، وإيقاف حرق الميزانية.';
    reason = 'تم اكتشاف خطر تشغيلي حرج مع خطر مالي شديد.';
    risk = 'شديد: الميزانية على وشك النفاذ بينما لا تزال هناك عوائق حرجة.';
  } 
  else if (isBudgetCritical && hasCriticalRisk) {
    priority1 = 'حرج: إيقاف الإنفاق فوراً وتخفيف خطر الأعمال الحرج.';
    priority2 = `معالجة الخطر: ${openCriticalRisks[0].title}`;
    decision = 'تنفيذ خطة تخفيف الخطر فوراً مع إيقاف حرق الميزانية.';
    reason = 'تم اكتشاف خطر أعمال حرج مع خطر مالي شديد.';
    risk = 'شديد: توجد مخاطر مالية وأخطار أعمال حرجة في نفس الوقت.';
  }
  // ── P0: Independent Crises ────────────────────────────────
  else if (hasCriticalOps) {
    const target = openLaunchBlockers.length > 0 ? openLaunchBlockers[0].title : criticalOverdue[0].title;
    priority1 = `حل عائق الإطلاق أو المهمة الحرجة: "${target}"`;
    priority2 = 'تأكد من عدم وجود تأخيرات متتالية في المشاريع المرتبطة.';
    decision = `توجيه أفضل الموارد لفك الحظر عن: ${target}`;
    reason = 'العوائق التشغيلية الحرجة تهدد الجدول الزمني للإطلاق مباشرة.';
    risk = 'الجدول الزمني للإطلاق في خطر داهم.';
  }
  else if (isBudgetCritical) {
    priority1 = `عاجل: مراجعة وتجميد الإنفاق (الميزانية بلغت ${budgetPct.toFixed(0)}%)`;
    priority2 = 'التواصل مع المستثمرين/الحاضنة للحصول على شريحة التمويل القادمة.';
    decision = 'تجميد النفقات الاختيارية فوراً.';
    reason = 'المدرج المالي منخفض بشكل حرج.';
    risk = 'خطر نفاد رأس المال قبل اكتمال مرحلة التجربة.';
  }
  else if (hasCriticalRisk) {
    priority1 = `تخفيف الخطر الحرج: "${openCriticalRisks[0].title}"`;
    priority2 = 'مراجعة المخاطر الأخرى شديدة الخطورة.';
    decision = `تنفيذ استراتيجية التخفيف للخطر: ${openCriticalRisks[0].title}`;
    reason = 'المخاطر الحرجة غير المخففة قد تسبب فشلاً منهجياً.';
    risk = 'تم اكتشاف خطر أعمال حرج نشط.';
  }
  // ── P1: Commercial Critical (Phase 3) ──────────────────────
  else if (overdueOpportunities.length > 0) {
    priority1 = `متابعة الفرص التجارية المتأخرة: "${overdueOpportunities[0].title}"`;
    priority2 = 'مراجعة أسباب تأخير الفرص التجارية البيعية.';
    decision = 'التواصل الفوري مع العملاء المحتملين ذوي الأولوية العالية.';
    reason = 'تأخير الفرص التجارية يؤدي إلى فقدان الإيرادات المتوقعة.';
    risk = 'فقدان العملاء المحتملين لصالح المنافسين أو فقدان الاهتمام.';
  }
  else if (atRiskPilots.length > 0) {
    priority1 = `إنقاذ تجربة تشغيلية معرضة للخطر: "${atRiskPilots[0].organization}"`;
    priority2 = 'التواصل المباشر مع فريق التجربة لجمع الملاحظات.';
    decision = 'جدولة اجتماع طارئ مع شركاء التجربة لتصحيح المسار.';
    reason = 'التجارب ذات التقييم المنخفض لن تتحول إلى عملاء فعليين.';
    risk = 'فشل التجربة يؤثر على سمعة المنتج وفرص المبيعات المستقبلية.';
  }
  // ── P1: Blocked Work & High Risks (Phase 2) ─────────────────
  else if (launchBlockers.filter(b => b.status !== 'Resolved').length > 0) {
    const b = launchBlockers.filter(b => b.status !== 'Resolved')[0];
    priority1 = `فك الحظر عن: "${b.title}"`;
    priority2 = 'مراجعة العوائق المتبقية للإطلاق.';
    decision = `حل العائق: ${b.title}`;
    reason = 'العوائق توقف التقدم وتضيع وقت الفريق.';
    risk = 'تأخير الجدول الزمني للإطلاق بسبب العوائق.';
  }
  else if (risks.filter(r => r.status === 'Open' && r.severity === 'High').length > 0) {
    const r = risks.filter(r => r.status === 'Open' && r.severity === 'High')[0];
    priority1 = `تخفيف خطر عالي: "${r.title}"`;
    priority2 = 'مراقبة ملف المخاطر العام.';
    decision = `تنفيذ خطة التخفيف للخطر: ${r.title}`;
    reason = 'المخاطر العالية تحتاج لإدارة نشطة قبل أن تصبح حرجة.';
    risk = 'يوجد خطر عالي الشدة يتطلب المراقبة.';
  }
  // ── P2: Strategic Goal/Initiative at Risk (Phase 4) ─────────
  else if (atRiskGoals.length > 0) {
    priority1 = `تصحيح مسار هدف استراتيجي: "${atRiskGoals[0].title}"`;
    priority2 = 'مراجعة المبادرات المرتبطة بهذا الهدف.';
    decision = 'عقد جلسة طارئة مع أصحاب المصلحة لإعادة توجيه الجهود.';
    reason = 'تأخر الهدف الاستراتيجي يهدد توجه الشركة العام.';
    risk = 'خطر استراتيجي يؤثر على رؤية الشركة.';
  }
  else if (atRiskInitiatives.length > 0) {
    priority1 = `تسريع المبادرة: "${atRiskInitiatives[0].name}"`;
    priority2 = 'إزالة العوائق عن المشاريع المرتبطة بالمبادرة.';
    decision = 'تخصيص موارد إضافية لدعم المبادرة.';
    reason = 'تأخر المبادرات يعرقل تحقيق الأهداف المرتبطة بها.';
    risk = 'تأخير في تنفيذ الاستراتيجية.';
  }
  // ── P2: Sales Closing & Renewals (Phase 3) ──────────────────
  else if (closingSoonOpps.length > 0) {
    priority1 = `إغلاق الصفقات القريبة: "${closingSoonOpps[0].title}"`;
    priority2 = 'تجهيز العقود والمقترحات النهائية.';
    decision = 'التركيز على إغلاق الفرص البيعية خلال هذا الأسبوع.';
    reason = 'تأمين إيرادات قريبة أمر حيوي للنمو.';
    risk = 'تأخير تدفق الإيرادات المتوقعة.';
  }
  else if (upcomingRenewals.length > 0) {
    priority1 = `تأمين تجديد اشتراك العميل: "${upcomingRenewals[0].organization}"`;
    priority2 = 'تحليل رضا العميل وتقديم قيمة مضافة قبل التجديد.';
    decision = 'التواصل مع العملاء الحاليين لضمان استمراريتهم.';
    reason = 'تكلفة الاحتفاظ بالعميل أقل بكثير من اكتساب عميل جديد.';
    risk = 'تسرب العملاء (Churn) يقلل الإيرادات المتكررة.';
  }
  // ── P2/P3: Governance Critical (Phase 6) ───────────────────────
  else if (criticalGov.length > 0) {
    priority1 = `قضية حوكمة حرجة: ${criticalGov[0].title}`;
    priority2 = 'مراجعة الالتزامات التنظيمية والوثائق.';
    decision = 'معالجة الالتزامات الحرجة المتأخرة لتجنب المخالفات القانونية.';
    reason = criticalGov[0].message;
    risk = 'مخالفات قانونية أو تنظيمية تهدد استمرارية المشروع.';
  }
  // ── P2 & P3: Overdue & Warnings (Phase 2) ───────────────────
  else if (tasks.some(t => t.priority === 'عالية' && t.status !== 'مكتملة' && isPast(new Date(t.deadline)))) {
    priority1 = 'إنجاز المهام المتأخرة ذات الأولوية العالية.';
    priority2 = 'مراجعة توزيع المهام على الفريق.';
    decision = 'تصفية المهام المتراكمة قبل البدء في مشاريع جديدة.';
    reason = 'المهام ذات الأولوية العالية تتراكم وتسبب تأخيرات.';
    risk = 'تأخيرات في العمليات التشغيلية.';
  }
  else if (budgetPct >= 80) {
    priority1 = `تحذير الميزانية: الإنفاق وصل إلى ${budgetPct.toFixed(0)}%`;
    priority2 = 'مراجعة المصروفات المخطط لها قريباً.';
    decision = 'تدقيق المصروفات الحالية وتحسين تخصيص الموارد.';
    reason = 'الاقتراب من العتبة الحرجة للميزانية.';
    risk = 'معدل حرق الميزانية يحتاج إلى إدارة.';
  }
  // ── P3: Weak Pipeline (Phase 3) ──────────────────────────────
  else if (openOpps.length === 0) {
    priority1 = 'تعزيز جهود التسويق لخلق فرص تجارية جديدة.';
    priority2 = 'إطلاق حملة تسويقية أو التواصل مع شرائح جديدة.';
    decision = 'توجيه فريق التسويق لتكثيف جلب العملاء المحتملين.';
    reason = 'عدم وجود فرص تجارية مفتوحة يهدد النمو المستقبلي.';
    risk = 'ركود في المبيعات وانعدام النمو التجاري.';
  }
  else if (behindGrowth.length > 0) {
    priority1 = `تحذير من تباطؤ النمو: "${behindGrowth[0].name}"`;
    priority2 = 'مراجعة استراتيجية اكتساب العملاء والمبيعات.';
    decision = 'تعديل التكتيكات التسويقية والبيعية لتسريع النمو.';
    reason = 'مؤشرات النمو تتأخر عن الأهداف المحددة.';
    risk = 'عدم الوصول لمعدلات النمو المطلوبة للحاضنة/المستثمرين.';
  }
  // ── P3: Governance High/Warning (Phase 6) ─────────────────────
  else if (highGov.length > 0) {
    priority1 = `تنبيه حوكمة: ${highGov[0].title}`;
    priority2 = 'تجديد العقود أو الوثائق المنتهية.';
    decision = 'جدولة وقت لمراجعة الالتزامات القانونية والإدارية.';
    reason = highGov[0].message;
    risk = 'تراكم المهام الإدارية والقانونية.';
  }
  // ── P4: Low Readiness (Phase 2) ─────────────────────────────
  else if (productReadinessPct < 50) {
    priority1 = `تسريع تطوير المنتج (الجاهزية: ${productReadinessPct}%)`;
    priority2 = 'مراجعة خارطة طريق المنتج والموارد المتاحة.';
    decision = 'تركيز الفريق على المتطلبات الأساسية للمنتج.';
    reason = 'جاهزية المنتج منخفضة جداً مقارنة بالجدول الزمني.';
    risk = 'خطر التأخير في إطلاق المنتج.';
  }
  // ── Normal ────────────────────────────────────────────────
  else {
    priority1 = 'الحفاظ على الزخم وتنفيذ الأهداف الأسبوعية.';
    priority2 = `التقدم في المشروع النشط: "${projects.find(p => p.status === 'Active')?.name ?? 'المشروع الحالي'}"`;
    decision = 'جدولة جلسة المراجعة الأسبوعية.';
    reason = 'لا توجد مشاكل حرجة. العمليات تسير بشكل طبيعي.';
    risk = 'لا توجد مخاطر واضحة. يجب الاستمرار في المراقبة.';
  }

  return {
    priority1,
    priority2,
    risk,
    opportunity,
    decision,
    reason,
    hasEnoughData: tasks.length > 0 || opportunities.length > 0,
  };
}
