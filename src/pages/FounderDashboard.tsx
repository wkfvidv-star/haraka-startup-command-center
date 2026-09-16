import { useAppStore } from '../store';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Badge } from '../components/ui/badge';
import { 
  Activity, AlertCircle, TrendingUp, DollarSign, Rocket, AlertTriangle, 
  Target, Users, Wallet, ShieldAlert, HeartPulse, CheckSquare, Briefcase, Zap,
  LineChart
} from 'lucide-react';
import { Progress } from '../components/ui/progress';
import { Link } from 'react-router-dom';
export function FounderDashboard() {
  const { 
    config, ceoNextMove, financeSummary, productReadinessPct, launchReadinessPct,
    launchBlockers, risks, kpis, marketKPIs, financialControl, companyHealth,
    tasks, projects, goals, initiatives, leads, opportunities, pilots, customers, revenues
  } = useAppStore();

  if (!config || !financeSummary || !marketKPIs) return null;

  const criticalBlockers = launchBlockers.filter(b => b.status !== 'Resolved' && b.severity === 'Critical');
  const activeHighRisks = risks.filter(r => r.status === 'Open' && (r.severity === 'Critical' || r.severity === 'High'));
  const criticalTasks = tasks.filter(t => t.status !== 'مكتملة' && (t.priority === 'حرجة' || t.priority === 'عالية'));

  const financialWarning = financialControl?.signals.find(s => s.severity === 'Critical' || s.severity === 'High');

  return (
    <div className="space-y-8 max-w-screen-xl">
      {/* 1. Header */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">لوحة التحكم التنفيذية</h1>
          <p className="text-sm text-muted-foreground">{config.name} - مركز القيادة</p>
        </div>
        <div className="flex items-center gap-3">
          <Badge variant={config.startupHealthScore >= 80 ? 'success' : config.startupHealthScore >= 50 ? 'warning' : 'destructive'} className="text-sm px-3 py-1">
            صحة الشركة: {config.startupHealthScore}/100
          </Badge>
          <Badge variant={marketKPIs.marketHealthScore >= 80 ? 'success' : marketKPIs.marketHealthScore >= 50 ? 'warning' : 'destructive'} className="text-sm px-3 py-1">
            صحة السوق: {marketKPIs.marketHealthScore}/100
          </Badge>
        </div>
      </div>

      {/* 2. CEO Next Move */}
      {ceoNextMove && ceoNextMove.hasEnoughData && (
        <Card className="border-primary/30 bg-primary/5 shadow-md">
          <CardHeader className="pb-3 border-b border-primary/10">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-primary">
                <Activity className="h-5 w-5" />
                <CardTitle className="text-lg">الخطوة القادمة للمؤسس (CEO Next Move)</CardTitle>
              </div>
              <Badge variant="outline" className="border-primary/50 text-primary">أولوية قصوى</Badge>
            </div>
          </CardHeader>
          <CardContent className="pt-4 grid gap-4 md:grid-cols-2">
            <div className="space-y-4">
              <div>
                <p className="text-xs font-semibold text-primary uppercase tracking-wider mb-1">السبب / التركيز الأساسي</p>
                <p className="text-sm font-medium bg-background p-3 rounded-lg border border-primary/20 shadow-sm">{ceoNextMove.priority1}</p>
              </div>
            </div>
            <div className="space-y-4">
              <div>
                <p className="text-xs font-semibold text-primary uppercase tracking-wider mb-1">الإجراء المقترح</p>
                <p className="text-sm font-medium bg-primary text-primary-foreground p-3 rounded-lg shadow-sm">{ceoNextMove.decision}</p>
              </div>
            </div>
            <div className="md:col-span-2">
              <p className="text-xs font-semibold text-primary uppercase tracking-wider mb-1">درجة الخطورة (Risk)</p>
              <div className="flex items-start gap-2 bg-background p-3 rounded-lg border border-destructive/30">
                <AlertCircle className="h-4 w-4 text-destructive shrink-0 mt-0.5" />
                <p className="text-sm text-destructive font-medium leading-tight">{ceoNextMove.risk}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* 3. Critical Alerts */}
      <div className="space-y-4">
        <h2 className="text-lg font-bold flex items-center gap-2">
          <AlertTriangle className="h-5 w-5 text-destructive" /> تنبيهات حرجة
        </h2>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <Card className={criticalTasks.length > 0 ? 'border-destructive bg-destructive/5' : ''}>
            <CardContent className="pt-6">
              <p className="text-xs font-semibold uppercase text-muted-foreground mb-1">مهام حرجة متأخرة</p>
              <p className="text-3xl font-bold text-destructive">{criticalTasks.length}</p>
            </CardContent>
          </Card>
          
          <Card className={criticalBlockers.length > 0 ? 'border-destructive bg-destructive/5' : ''}>
            <CardContent className="pt-6">
              <p className="text-xs font-semibold uppercase text-muted-foreground mb-1">عوائق إطلاق حرجة</p>
              <p className="text-3xl font-bold text-destructive">{criticalBlockers.length}</p>
            </CardContent>
          </Card>

          <Card className={activeHighRisks.length > 0 ? 'border-amber-500 bg-amber-500/5' : ''}>
            <CardContent className="pt-6">
              <p className="text-xs font-semibold uppercase text-muted-foreground mb-1">مخاطر عالية نشطة</p>
              <p className="text-3xl font-bold text-amber-600">{activeHighRisks.length}</p>
            </CardContent>
          </Card>

          <Card className={financialWarning ? 'border-destructive bg-destructive/5' : ''}>
            <CardContent className="pt-6">
              <p className="text-xs font-semibold uppercase text-muted-foreground mb-1">تنبيه مالي</p>
              {financialWarning ? (
                <p className="text-sm font-bold text-destructive leading-tight line-clamp-2" title={financialWarning.title}>{financialWarning.title}</p>
              ) : (
                <p className="text-xl font-bold text-emerald-600">سليم</p>
              )}
            </CardContent>
          </Card>
        </div>
      </div>

      {/* 4. Company Health & 5. Readiness */}
      <div className="grid gap-6 md:grid-cols-2">
        {/* Company Health Details */}
        {companyHealth && (
          <Card>
            <CardHeader className="pb-3 border-b">
              <CardTitle className="text-base flex items-center gap-2"><HeartPulse className="h-4 w-4 text-primary" /> تفاصيل صحة الشركة</CardTitle>
            </CardHeader>
            <CardContent className="pt-4 grid gap-4 grid-cols-2">
              <div>
                <p className="text-xs text-muted-foreground mb-1">العمليات (Operational)</p>
                <Badge variant={companyHealth.operational >= 80 ? 'success' : companyHealth.operational >= 50 ? 'warning' : 'destructive'}>{companyHealth.operational}%</Badge>
              </div>
              <div>
                <p className="text-xs text-muted-foreground mb-1">المالية (Financial)</p>
                <Badge variant={companyHealth.financial >= 80 ? 'success' : companyHealth.financial >= 50 ? 'warning' : 'destructive'}>{companyHealth.financial}%</Badge>
              </div>
              <div>
                <p className="text-xs text-muted-foreground mb-1">المنتج (Product)</p>
                <Badge variant={companyHealth.product >= 80 ? 'success' : companyHealth.product >= 50 ? 'warning' : 'destructive'}>{companyHealth.product}%</Badge>
              </div>
              <div>
                <p className="text-xs text-muted-foreground mb-1">السوق (Market)</p>
                <Badge variant={companyHealth.market >= 80 ? 'success' : companyHealth.market >= 50 ? 'warning' : 'destructive'}>{companyHealth.market}%</Badge>
              </div>
              <div>
                <p className="text-xs text-muted-foreground mb-1">الفريق (Team)</p>
                <Badge variant={companyHealth.team >= 80 ? 'success' : companyHealth.team >= 50 ? 'warning' : 'destructive'}>{companyHealth.team}%</Badge>
              </div>
              <div>
                <p className="text-xs text-muted-foreground mb-1">النمو (Growth)</p>
                <Badge variant={companyHealth.growth >= 80 ? 'success' : companyHealth.growth >= 50 ? 'warning' : 'destructive'}>{companyHealth.growth}%</Badge>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Readiness */}
        <Card>
          <CardHeader className="pb-3 border-b">
            <CardTitle className="text-base flex items-center gap-2"><Rocket className="h-4 w-4 text-primary" /> مستوى الجاهزية</CardTitle>
          </CardHeader>
          <CardContent className="pt-4 space-y-4">
            <div>
              <div className="flex justify-between text-sm mb-1">
                <span className="font-medium">جاهزية المنتج</span>
                <span>{productReadinessPct}%</span>
              </div>
              <Progress value={productReadinessPct} className="h-2" />
            </div>
            <div>
              <div className="flex justify-between text-sm mb-1">
                <span className="font-medium">جاهزية الإطلاق</span>
                <span>{launchReadinessPct}%</span>
              </div>
              <Progress value={launchReadinessPct} className="h-2" />
            </div>
            <div>
              <div className="flex justify-between text-sm mb-1">
                <span className="font-medium">صحة السوق</span>
                <span>{marketKPIs.marketHealthScore}%</span>
              </div>
              <Progress value={marketKPIs.marketHealthScore} className="h-2" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* 6. Execution & 7. Commercial */}
      <div className="grid gap-6 md:grid-cols-2">
        {/* Execution */}
        <Card>
          <CardHeader className="pb-3 border-b">
            <div className="flex items-center justify-between">
              <CardTitle className="text-base flex items-center gap-2"><CheckSquare className="h-4 w-4 text-primary" /> ملخص التنفيذ</CardTitle>
              <Link to="/today" className="text-xs text-primary hover:underline">اليوم ←</Link>
            </div>
          </CardHeader>
          <CardContent className="pt-4 grid grid-cols-2 gap-4">
            <div className="bg-slate-50 border rounded-lg p-3 text-center">
              <Target className="h-5 w-5 mx-auto text-blue-500 mb-1" />
              <p className="text-xl font-bold">{goals.length}</p>
              <p className="text-xs text-muted-foreground">أهداف</p>
            </div>
            <div className="bg-slate-50 border rounded-lg p-3 text-center">
              <Zap className="h-5 w-5 mx-auto text-amber-500 mb-1" />
              <p className="text-xl font-bold">{initiatives.length}</p>
              <p className="text-xs text-muted-foreground">مبادرات</p>
            </div>
            <div className="bg-slate-50 border rounded-lg p-3 text-center">
              <Briefcase className="h-5 w-5 mx-auto text-indigo-500 mb-1" />
              <p className="text-xl font-bold">{projects.length}</p>
              <p className="text-xs text-muted-foreground">مشاريع</p>
            </div>
            <div className="bg-slate-50 border rounded-lg p-3 text-center">
              <CheckSquare className="h-5 w-5 mx-auto text-emerald-500 mb-1" />
              <p className="text-xl font-bold">{tasks.filter(t => t.status !== 'مكتملة').length}</p>
              <p className="text-xs text-muted-foreground">مهام نشطة</p>
            </div>
          </CardContent>
        </Card>

        {/* Commercial */}
        <Card>
          <CardHeader className="pb-3 border-b">
            <div className="flex items-center justify-between">
              <CardTitle className="text-base flex items-center gap-2"><TrendingUp className="h-4 w-4 text-primary" /> ملخص السوق والمبيعات</CardTitle>
              <Link to="/pipeline" className="text-xs text-primary hover:underline">Pipeline ←</Link>
            </div>
          </CardHeader>
          <CardContent className="pt-4 grid grid-cols-3 gap-4">
            <div className="text-center">
              <p className="text-xl font-bold">{leads.length}</p>
              <p className="text-xs text-muted-foreground">Leads</p>
            </div>
            <div className="text-center">
              <p className="text-xl font-bold text-blue-600">{opportunities.length}</p>
              <p className="text-xs text-muted-foreground">Opportunities</p>
            </div>
            <div className="text-center">
              <p className="text-xl font-bold text-amber-600">{pilots.length}</p>
              <p className="text-xs text-muted-foreground">Pilots</p>
            </div>
            <div className="text-center">
              <p className="text-xl font-bold text-indigo-600">{customers.length}</p>
              <p className="text-xs text-muted-foreground">Customers</p>
            </div>
            <div className="col-span-2 text-center bg-emerald-50 border border-emerald-100 rounded-lg p-2">
              <p className="text-lg font-bold text-emerald-600">{marketKPIs.wonRevenue.toLocaleString()} د.ج</p>
              <p className="text-xs text-muted-foreground">Revenue</p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* 8. Important KPIs */}
      <Card>
        <CardHeader className="pb-3 border-b">
          <div className="flex items-center justify-between">
            <CardTitle className="text-base flex items-center gap-2"><LineChart className="h-4 w-4 text-primary" /> أهم مؤشرات الأداء (KPIs)</CardTitle>
            <Link to="/kpis" className="text-xs text-primary hover:underline">التفاصيل ←</Link>
          </div>
        </CardHeader>
        <CardContent className="pt-4 grid gap-4 grid-cols-2 md:grid-cols-4">
          {kpis.slice(0, 4).map(k => (
            <div key={k.id} className="p-3 bg-muted/10 border rounded-lg">
              <div className="flex justify-between items-start mb-2">
                <p className="text-xs font-medium text-muted-foreground line-clamp-1" title={k.name}>{k.name}</p>
                <div className={`h-2 w-2 rounded-full shrink-0 ${k.status === 'On Track' ? 'bg-green-500' : k.status === 'At Risk' ? 'bg-amber-500' : 'bg-red-500'}`} />
              </div>
              <p className="text-lg font-bold">{k.currentValue} <span className="text-xs font-normal text-muted-foreground">/ {k.target} {k.unit}</span></p>
            </div>
          ))}
          {kpis.length === 0 && <div className="col-span-full p-4 text-center text-sm text-muted-foreground">لم يتم تحديد مؤشرات أداء بعد.</div>}
        </CardContent>
      </Card>
    </div>
  );
}
