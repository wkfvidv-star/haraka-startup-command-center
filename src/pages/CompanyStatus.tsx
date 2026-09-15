import { useAppStore } from '../store';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Badge } from '../components/ui/badge';
import { Progress } from '../components/ui/progress';
import { Target, ShieldAlert, Layers, Footprints, AlertTriangle } from 'lucide-react';

export function CompanyStatus() {
  const { config, ceoNextMove, tasks } = useAppStore();

  if (!config) return null;

  const now = new Date();
  const overdueTasks = tasks.filter(t => t.status !== 'Done' && new Date(t.deadline) < now);
  const budgetPct = config.fundingReceivedDZD > 0
    ? Math.round((config.budgetSpentDZD / config.fundingReceivedDZD) * 100)
    : 0;

  return (
    <div className="space-y-6 max-w-screen-xl">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">حالة الشركة</h1>
        <p className="text-sm text-muted-foreground mt-0.5">أين تقف حركة حالياً؟</p>
      </div>

      {/* At-a-glance row */}
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
        {[
          { label: 'المرحلة',         value: config.currentStage,           badge: 'default' as const },
          { label: 'مؤشر الصحة',  value: `${config.startupHealthScore}%`, badge: config.startupHealthScore >= 70 ? 'success' as const : 'warning' as const },
          { label: 'استهلاك الميزانية',   value: `${budgetPct}%`,               badge: budgetPct >= 80 ? 'destructive' as const : 'success' as const },
          { label: 'المهام المتأخرة', value: String(overdueTasks.length),    badge: overdueTasks.length > 0 ? 'destructive' as const : 'success' as const },
        ].map(item => (
          <Card key={item.label}>
            <CardContent className="pt-5">
              <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">{item.label}</p>
              <p className="mt-2 text-xl font-bold">{item.value}</p>
              <Badge variant={item.badge} className="mt-2">{item.badge === 'success' ? 'جيد' : item.badge === 'destructive' ? 'انتباه' : 'نشط'}</Badge>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Main grid */}
      <div className="grid gap-4 lg:grid-cols-2">

        {/* Current Objective */}
        <Card>
          <CardHeader>
            <div className="flex items-center gap-2">
              <Target className="h-4 w-4 text-primary" />
              <CardTitle>الهدف الحالي</CardTitle>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-sm leading-relaxed">{config.currentObjective}</p>
            <div className="rounded-md bg-muted/40 p-4">
              <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">المرحلة الرئيسية (Milestone)</p>
              <p className="text-sm font-medium mt-1">{config.mainMilestone}</p>
            </div>
          </CardContent>
        </Card>

        {/* Risks & Blockers */}
        <Card className="border-red-100">
          <CardHeader>
            <div className="flex items-center gap-2">
              <ShieldAlert className="h-4 w-4 text-destructive" />
              <CardTitle className="text-destructive">المخاطر والعوائق</CardTitle>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground mb-2">المخاطر الرئيسية</p>
              <ul className="space-y-2">
                {config.mainRisks.map((r, i) => (
                  <li key={i} className="flex gap-2 text-sm">
                    <AlertTriangle className="h-3.5 w-3.5 mt-0.5 text-amber-500 shrink-0" />
                    <span>{r}</span>
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground mb-2">العوائق النشطة</p>
              <ul className="space-y-2">
                {config.mainBlockers.map((b, i) => (
                  <li key={i} className="flex gap-2 text-sm">
                    <span className="mt-1 h-1.5 w-1.5 shrink-0 rounded-full bg-red-500" />
                    <span className="text-red-800">{b}</span>
                  </li>
                ))}
              </ul>
            </div>
          </CardContent>
        </Card>

        {/* Current Priorities */}
        <Card>
          <CardHeader>
            <div className="flex items-center gap-2">
              <Layers className="h-4 w-4 text-primary" />
              <CardTitle>الأولويات الحالية</CardTitle>
            </div>
          </CardHeader>
          <CardContent>
            <ol className="space-y-2 list-none">
              {config.currentPriorities.map((p, i) => (
                <li key={i} className="flex items-start gap-3 text-sm">
                  <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-primary/10 text-[10px] font-bold text-primary">
                    {i + 1}
                  </span>
                  <span>{p}</span>
                </li>
              ))}
            </ol>
          </CardContent>
        </Card>

        {/* Next Steps */}
        <Card>
          <CardHeader>
            <div className="flex items-center gap-2">
              <Footprints className="h-4 w-4 text-primary" />
              <CardTitle>الخطوات القادمة</CardTitle>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-sm leading-relaxed">{config.nextStep}</p>
            {ceoNextMove?.hasEnoughData && (
              <div className="rounded-md border-r-2 border-primary bg-primary/5 pr-4 py-3 pl-4">
                <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">الخطوة القادمة للمدير التنفيذي</p>
                <p className="text-sm font-medium mt-1">{ceoNextMove.priority1}</p>
              </div>
            )}
          </CardContent>
        </Card>

      </div>

      {/* Readiness breakdown */}
      <Card>
        <CardHeader>
          <CardTitle>الجاهزية حسب الفئة</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {config.readinessCategories.map(cat => (
              <div key={cat.key} className="space-y-1.5">
                <div className="flex justify-between text-sm">
                  <span className="font-medium">{cat.name}</span>
                  <span className={cat.score < 50 ? 'font-bold text-red-600' : 'text-muted-foreground'}>{cat.score}%</span>
                </div>
                <Progress value={cat.score} />
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

    </div>
  );
}
