import { useAppStore } from '../store';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Badge } from '../components/ui/badge';
import { Activity, AlertCircle, TrendingUp, TrendingDown, DollarSign, Rocket, AlertTriangle, Scale, Target, Users, Wallet, ShieldAlert } from 'lucide-react';
import { Progress } from '../components/ui/progress';
import { Link } from 'react-router-dom';

export function Dashboard() {
  const { 
    config, ceoNextMove, financeSummary, productReadinessPct, launchReadinessPct,
    launchBlockers, risks, incubationPhase, deliverables, decisions, kpis, marketKPIs,
    financialControl, governanceSignals
  } = useAppStore();

  if (!config || !financeSummary || !marketKPIs) return null;

  const criticalBlockersCount = launchBlockers.filter(b => b.status !== 'Resolved' && b.severity === 'Critical').length;
  const activeHighRisks = risks.filter(r => r.status === 'Open' && (r.severity === 'Critical' || r.severity === 'High'));

  return (
    <div className="space-y-6 max-w-screen-xl">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">لوحة تحكم المؤسس</h1>
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

      {/* CEO Next Move */}
      {ceoNextMove && ceoNextMove.hasEnoughData && (
        <Card className="border-primary/20 bg-primary/5 shadow-sm">
          <CardHeader className="pb-3 border-b border-primary/10">
            <div className="flex items-center gap-2 text-primary">
              <Activity className="h-5 w-5" />
              <CardTitle className="text-lg">الخطوة القادمة للمدير التنفيذي</CardTitle>
            </div>
          </CardHeader>
          <CardContent className="pt-4 grid gap-4 md:grid-cols-2">
            <div className="space-y-4">
              <div>
                <p className="text-xs font-semibold text-primary uppercase tracking-wider">التركيز الأساسي</p>
                <p className="text-sm font-medium mt-1 bg-background p-2 rounded border">{ceoNextMove.priority1}</p>
              </div>
              <div>
                <p className="text-xs font-semibold text-primary uppercase tracking-wider">التركيز الثانوي</p>
                <p className="text-sm text-muted-foreground mt-1 bg-background p-2 rounded border">{ceoNextMove.priority2}</p>
              </div>
            </div>
            <div className="space-y-4">
              <div>
                <p className="text-xs font-semibold text-primary uppercase tracking-wider">القرار المقترح</p>
                <p className="text-sm font-medium mt-1 bg-background p-2 rounded border border-primary/30">{ceoNextMove.decision}</p>
              </div>
              <div>
                <p className="text-xs font-semibold text-primary uppercase tracking-wider">التقييم الشامل للمخاطر</p>
                <div className="flex items-start gap-2 mt-1 bg-background p-2 rounded border">
                  <AlertCircle className="h-4 w-4 text-destructive shrink-0 mt-0.5" />
                  <p className="text-sm text-muted-foreground leading-tight">{ceoNextMove.risk}</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Core Metrics Grid */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-2 text-muted-foreground mb-2">
              <Rocket className="h-4 w-4" /> <span className="text-xs font-semibold uppercase">جاهزية المنتج</span>
            </div>
            <p className="text-2xl font-bold">{productReadinessPct}%</p>
            <Progress value={productReadinessPct} className="mt-2 h-2" />
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-2 text-muted-foreground mb-2">
              <TrendingUp className="h-4 w-4" /> <span className="text-xs font-semibold uppercase">جاهزية الإطلاق</span>
            </div>
            <p className="text-2xl font-bold">{launchReadinessPct}%</p>
            <Progress value={launchReadinessPct} className="mt-2 h-2" />
          </CardContent>
        </Card>

        <Card className={financeSummary.utilizationPct >= 90 ? 'border-red-500 bg-red-50' : ''}>
          <CardContent className="pt-6">
            <div className="flex items-center gap-2 text-muted-foreground mb-2">
              <DollarSign className="h-4 w-4" /> <span className="text-xs font-semibold uppercase">استهلاك الميزانية</span>
            </div>
            <p className="text-2xl font-bold">{financeSummary.utilizationPct.toFixed(1)}%</p>
            <Progress value={financeSummary.utilizationPct} colorOverride={financeSummary.utilizationPct >= 90 ? 'bg-red-500' : undefined} className="mt-2 h-2" />
          </CardContent>
        </Card>

        <Card className={criticalBlockersCount > 0 ? 'border-red-500 bg-red-50' : ''}>
          <CardContent className="pt-6">
            <div className="flex items-center gap-2 text-muted-foreground mb-2">
              <AlertTriangle className="h-4 w-4" /> <span className="text-xs font-semibold uppercase">عوائق حرجة</span>
            </div>
            <p className="text-2xl font-bold text-destructive">{criticalBlockersCount}</p>
            <p className="text-xs text-muted-foreground mt-1">تمنع الإطلاق</p>
          </CardContent>
        </Card>
      </div>

      {/* Market Metrics Grid */}
      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-2 text-muted-foreground mb-2">
              <Users className="h-4 w-4 text-blue-500" /> <span className="text-xs font-semibold uppercase">معدل التحويل (Leads)</span>
            </div>
            <p className="text-2xl font-bold">{marketKPIs.leadConversionRate.toFixed(1)}%</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-2 text-muted-foreground mb-2">
              <Target className="h-4 w-4 text-purple-500" /> <span className="text-xs font-semibold uppercase">قيمة المبيعات المتوقعة</span>
            </div>
            <p className="text-2xl font-bold">{marketKPIs.weightedPipeline.toLocaleString()} د.ج</p>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-2 text-muted-foreground mb-2">
              <Wallet className="h-4 w-4 text-emerald-500" /> <span className="text-xs font-semibold uppercase">الإيرادات المحققة</span>
            </div>
            <p className="text-2xl font-bold text-emerald-600">{marketKPIs.wonRevenue.toLocaleString()} د.ج</p>
          </CardContent>
        </Card>
      </div>

      {/* Phase 5 — Financial Control Summary */}
      {financialControl && (
        <Card className="border border-slate-200 bg-slate-50/50">
          <CardHeader className="pb-3 border-b">
            <div className="flex items-center justify-between">
              <CardTitle className="text-base flex items-center gap-2">
                <TrendingDown className="h-4 w-4 text-primary" /> التحكم المالي
              </CardTitle>
              <Link to="/financial-control" className="text-xs text-primary hover:underline">عرض التفاصيل ←</Link>
            </div>
          </CardHeader>
          <CardContent className="pt-4">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
              <div className="text-center p-3 bg-white rounded-lg border">
                <p className="text-xs text-slate-500 mb-1">السيولة المتاحة</p>
                <p className="font-black text-slate-800 text-base">{(financialControl.cashPosition.availableCash/1000).toFixed(0)}k دج</p>
              </div>
              <div className="text-center p-3 bg-white rounded-lg border">
                <p className="text-xs text-slate-500 mb-1">Gross Burn / شهر</p>
                <p className="font-black text-red-600 text-base">{(financialControl.burnRate.grossBurn/1000).toFixed(0)}k دج</p>
              </div>
              <div className="text-center p-3 bg-white rounded-lg border">
                <p className="text-xs text-slate-500 mb-1">Net Burn / شهر</p>
                <p className={`font-black text-base ${financialControl.burnRate.isCashFlowPositive ? 'text-green-600' : 'text-orange-600'}`}>
                  {financialControl.burnRate.isCashFlowPositive ? 'إيجابي' : `${(financialControl.burnRate.netBurn/1000).toFixed(0)}k دج`}
                </p>
              </div>
              <div className="text-center p-3 bg-white rounded-lg border">
                <p className="text-xs text-slate-500 mb-1">مدة الاستمرارية</p>
                <p className={`font-black text-base ${
                  financialControl.runway.status === 'Healthy' ? 'text-green-600' :
                  financialControl.runway.status === 'Warning' ? 'text-amber-600' : 'text-red-600'
                }`}>
                  {financialControl.runway.isNoBurn ? '∞' : `${financialControl.runway.months} شهر`}
                </p>
              </div>
            </div>
            {financialControl.signals[0].severity !== 'Healthy' && (
              <div className={`mt-3 flex items-start gap-2 p-3 rounded-lg text-xs border ${
                financialControl.signals[0].severity === 'Critical' ? 'bg-red-50 text-red-700 border-red-200' : 'bg-amber-50 text-amber-700 border-amber-200'
              }`}>
                <ShieldAlert className="h-4 w-4 shrink-0 mt-0.5" />
                <span><strong>{financialControl.signals[0].title}:</strong> {financialControl.signals[0].message}</span>
              </div>
            )}
            <p className="text-[10px] text-slate-400 text-center mt-3">Founder Planning Metrics — DEMO DATA — ليست بيانات محاسبية رسمية</p>
          </CardContent>
        </Card>
      )}

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {incubationPhase && (
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm flex items-center gap-2"><Target className="h-4 w-4 text-primary" /> مرحلة الحاضنة</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm font-semibold mb-1">{incubationPhase.name}</p>
              <p className="text-xs text-muted-foreground line-clamp-2 mb-3">{incubationPhase.currentObjective}</p>
              <div className="flex justify-between text-xs mb-1">
                <span className="font-medium text-muted-foreground">التسليمات المنجزة</span>
                <span>{deliverables.filter(d => d.status === 'Completed').length} / {deliverables.length}</span>
              </div>
              <Progress value={deliverables.length ? (deliverables.filter(d => d.status === 'Completed').length / deliverables.length) * 100 : 0} className="h-1.5" />
            </CardContent>
          </Card>
        )}

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm flex items-center gap-2"><AlertCircle className="h-4 w-4 text-amber-500" /> المخاطر العالية النشطة</CardTitle>
          </CardHeader>
          <CardContent>
            {activeHighRisks.length > 0 ? (
              <ul className="space-y-2">
                {activeHighRisks.slice(0, 3).map(r => (
                  <li key={r.id} className="text-xs flex justify-between items-center p-1.5 bg-muted/20 rounded">
                    <span className="truncate pr-2 font-medium">{r.title}</span>
                    <Badge variant={r.severity === 'Critical' ? 'destructive' : 'warning'} className="text-[9px] px-1.5 py-0">{r.severity === 'Critical' ? 'حرج' : 'عالي'}</Badge>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-xs text-muted-foreground">لا توجد مخاطر عالية أو حرجة نشطة حالياً.</p>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm flex items-center gap-2"><Scale className="h-4 w-4 text-blue-500" /> القرارات الأخيرة</CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="space-y-2">
              {decisions.slice(0, 3).map(d => (
                <li key={d.id} className="text-xs p-1.5 bg-muted/20 rounded">
                  <div className="flex justify-between">
                    <span className="truncate font-medium">{d.title}</span>
                    <Badge variant={d.status === 'Decided' || d.status === 'Implemented' ? 'success' : 'secondary'} className="text-[9px] px-1.5 py-0">{d.status === 'Decided' || d.status === 'Implemented' ? 'معتمد' : d.status}</Badge>
                  </div>
                </li>
              ))}
              {decisions.length === 0 && <p className="text-xs text-muted-foreground">لم يتم تسجيل قرارات بعد.</p>}
            </ul>
          </CardContent>
        </Card>

        {/* Phase 6: Governance Snapshot */}
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm flex items-center justify-between">
              <div className="flex items-center gap-2"><ShieldAlert className="h-4 w-4 text-purple-500" /> تنبيهات الحوكمة</div>
              <Link to="/governance" className="text-[10px] text-primary hover:underline">التفاصيل</Link>
            </CardTitle>
          </CardHeader>
          <CardContent>
            {governanceSignals.filter(s => s.severity !== 'Healthy').length > 0 ? (
              <ul className="space-y-2">
                {governanceSignals.filter(s => s.severity !== 'Healthy').slice(0, 3).map((sig, i) => (
                  <li key={i} className="text-xs flex justify-between items-center p-1.5 bg-muted/20 rounded">
                    <span className="truncate pr-2 font-medium" title={sig.title}>{sig.title}</span>
                    <Badge variant={sig.severity === 'Critical' ? 'destructive' : sig.severity === 'High' ? 'warning' : 'secondary'} className="text-[9px] px-1.5 py-0">{sig.severity}</Badge>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-xs text-muted-foreground flex items-center gap-2">
                <ShieldAlert className="h-4 w-4 text-green-500" /> الحوكمة والعمليات سليمة.
              </p>
            )}
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader className="pb-3 border-b bg-muted/20">
          <CardTitle className="text-base flex items-center gap-2"><TrendingUp className="h-4 w-4 text-primary" /> مؤشرات الأداء الرئيسية</CardTitle>
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
