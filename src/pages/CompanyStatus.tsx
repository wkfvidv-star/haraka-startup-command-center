import { useAppStore } from '../store';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Badge } from '../components/ui/badge';
import { 
  CheckCircle2, AlertTriangle, ShieldAlert, Rocket, TrendingUp, 
  DollarSign, Users, Briefcase, LayoutGrid
} from 'lucide-react';

export function CompanyStatus() {
  const { config, companyHealth, governanceSignals } = useAppStore();

  if (!config || !companyHealth) return null;

  const getStatus = (score: number) => {
    if (score >= 80) return { label: 'سليم (Healthy)', color: 'text-emerald-600', bg: 'bg-emerald-50', border: 'border-emerald-200', icon: CheckCircle2 };
    if (score >= 50) return { label: 'تحذير (Warning)', color: 'text-amber-600', bg: 'bg-amber-50', border: 'border-amber-200', icon: AlertTriangle };
    return { label: 'حرج (Critical)', color: 'text-destructive', bg: 'bg-destructive/10', border: 'border-destructive/30', icon: ShieldAlert };
  };

  // Determine Governance Status
  let govStatus = getStatus(100); // Default Healthy
  if (governanceSignals.some(s => s.severity === 'Critical')) {
    govStatus = getStatus(40);
  } else if (governanceSignals.some(s => s.severity === 'High')) {
    govStatus = getStatus(60);
  }

  const domains = [
    { name: 'المنتج (Product)', score: companyHealth.product, status: getStatus(companyHealth.product), icon: Rocket },
    { name: 'السوق والنمو (Market & Growth)', score: Math.round((companyHealth.market + companyHealth.growth) / 2), status: getStatus(Math.round((companyHealth.market + companyHealth.growth) / 2)), icon: TrendingUp },
    { name: 'المالية (Finance)', score: companyHealth.financial, status: getStatus(companyHealth.financial), icon: DollarSign },
    { name: 'الفريق (Team)', score: companyHealth.team, status: getStatus(companyHealth.team), icon: Users },
    { name: 'العمليات (Operations)', score: companyHealth.operational, status: getStatus(companyHealth.operational), icon: Briefcase },
    { name: 'الحوكمة (Governance)', score: null, status: govStatus, icon: ShieldAlert },
  ];

  return (
    <div className="space-y-6 max-w-screen-xl">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">حالة الشركة (Company Status)</h1>
        <p className="text-sm text-muted-foreground mt-0.5">تقييم شامل لحالة الأقسام بناءً على معايير الأداء والمخاطر.</p>
      </div>

      <Card className="border-primary/20 bg-primary/5">
        <CardHeader className="pb-3 border-b border-primary/10">
          <CardTitle className="text-lg flex items-center gap-2 text-primary">
            <LayoutGrid className="h-5 w-5" /> المرحلة الحالية (Current Stage)
          </CardTitle>
        </CardHeader>
        <CardContent className="pt-4 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div>
            <p className="text-2xl font-black text-slate-800">{config.currentStage}</p>
            <p className="text-sm text-muted-foreground mt-1">الهدف: {config.currentObjective}</p>
          </div>
          <Badge variant="outline" className="text-sm px-4 py-1.5 border-primary text-primary bg-primary/10">
            النتيجة الإجمالية: {config.startupHealthScore}/100
          </Badge>
        </CardContent>
      </Card>

      <h2 className="text-lg font-bold mt-8 mb-4">تقييم النطاقات (Domain Statuses)</h2>
      
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {domains.map((d, i) => {
          const Icon = d.status.icon;
          const DomainIcon = d.icon;
          return (
            <Card key={i} className={`${d.status.border} ${d.status.bg} shadow-sm`}>
              <CardContent className="pt-6">
                <div className="flex justify-between items-start mb-4">
                  <div className="flex items-center gap-2">
                    <DomainIcon className={`h-5 w-5 ${d.status.color}`} />
                    <h3 className="font-bold text-slate-800">{d.name}</h3>
                  </div>
                  {d.score !== null && (
                    <span className={`text-sm font-bold ${d.status.color}`}>{d.score}%</span>
                  )}
                </div>
                
                <div className="flex items-center gap-2 mt-2">
                  <Icon className={`h-4 w-4 ${d.status.color}`} />
                  <span className={`text-sm font-semibold ${d.status.color}`}>{d.status.label}</span>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

    </div>
  );
}
