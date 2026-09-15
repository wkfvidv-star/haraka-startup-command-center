import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { useAppStore } from '../store';
import { Zap, Target, TrendingUp, TrendingDown, AlertOctagon, HeartPulse, ShieldAlert, DollarSign } from 'lucide-react';
import { Badge } from '../components/ui/badge';
import { Link } from 'react-router-dom';

export function Executive() {
  const { config, ceoNextMove, companyHealth, goals, initiatives, financialControl } = useAppStore();

  if (!config || !companyHealth) return null;

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'P0': return 'bg-red-500 border-red-600 text-white';
      case 'P1': return 'bg-orange-500 border-orange-600 text-white';
      case 'P2': return 'bg-amber-400 border-amber-500 text-slate-900';
      case 'P3': return 'bg-blue-500 border-blue-600 text-white';
      default: return 'bg-slate-200 border-slate-300 text-slate-800';
    }
  };

  const activeGoals = goals.filter(g => g.status !== 'Completed').length;
  const activeInit = initiatives.filter(i => i.status === 'Active').length;

  const fc = financialControl;
  const runwayLabel = fc?.runway.isNoBurn ? 'لا استهلاك' : fc ? `${fc.runway.months} شهر` : '—';
  const runwayColor = fc?.runway.status === 'Healthy' ? 'text-green-400' :
    fc?.runway.status === 'Warning' ? 'text-amber-400' : 'text-red-400';

  const financialPriorityMsg = () => {
    if (!fc) return null;
    const sig = fc.signals[0];
    if (sig.severity === 'Healthy') return { text: 'لا توجد أزمة مالية حالية. الوضع النقدي مستقر.', color: 'bg-green-50 border-green-200 text-green-800' };
    if (sig.severity === 'Critical') return { text: `أوقف المصاريف غير الضرورية وراجع الأولويات المالية فوراً. ${sig.message}`, color: 'bg-red-50 border-red-200 text-red-800' };
    if (sig.severity === 'High') return { text: `مراجعة الإنفاق ضرورية بسبب انخفاض الـRunway. ${sig.message}`, color: 'bg-orange-50 border-orange-200 text-orange-800' };
    return { text: `راقب الوضع المالي عن كثب. ${sig.message}`, color: 'bg-amber-50 border-amber-200 text-amber-800' };
  };

  const financialMsg = financialPriorityMsg();

  return (
    <div className="space-y-6 max-w-screen-xl mx-auto">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-black text-slate-900 tracking-tight">Executive Dashboard</h1>
          <p className="text-sm text-slate-500 mt-1 font-medium">لوحة القيادة التنفيذية والمؤشرات الحيوية</p>
        </div>
        <div className="flex items-center gap-3 bg-white p-2 pr-4 rounded-full border shadow-sm">
          <span className="text-sm font-bold text-slate-700">Health Score</span>
          <div className={`h-10 w-10 flex items-center justify-center rounded-full text-white font-black ${companyHealth.overall >= 80 ? 'bg-green-500' : companyHealth.overall >= 50 ? 'bg-amber-500' : 'bg-red-500'}`}>
            {companyHealth.overall}
          </div>
        </div>
      </div>

      {/* CEO Next Move - Hero Section */}
      {ceoNextMove && (
        <div className={`p-6 rounded-2xl border-2 shadow-sm relative overflow-hidden ${
          ceoNextMove.priority1 === 'P0' ? 'bg-red-50 border-red-200' :
          ceoNextMove.priority1 === 'P1' ? 'bg-orange-50 border-orange-200' :
          'bg-slate-50 border-slate-200'
        }`}>
          <div className="absolute top-0 left-0 w-2 h-full" style={{ backgroundColor: ceoNextMove.priority1 === 'P0' ? '#ef4444' : ceoNextMove.priority1 === 'P1' ? '#f97316' : '#3b82f6' }} />
          <div className="flex flex-col md:flex-row gap-6 items-start">
            <div className={`flex-shrink-0 p-4 rounded-full shadow-sm ${getPriorityColor(ceoNextMove.priority1)}`}>
              <AlertOctagon className="h-8 w-8" />
            </div>
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-2">
                <Badge variant="outline" className="uppercase font-bold tracking-wider">{ceoNextMove.priority1} PRIORITY</Badge>
                <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">CEO ACTION</span>
              </div>
              <h2 className="text-2xl font-black text-slate-900 mb-2 leading-tight">{ceoNextMove.decision}</h2>
              <p className="text-sm font-medium text-slate-700">{ceoNextMove.reason}</p>
            </div>
          </div>
        </div>
      )}

      {/* Top Level KPIs */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="bg-gradient-to-br from-slate-900 to-slate-800 text-white border-0 shadow-md">
          <CardContent className="p-6">
            <div className="flex justify-between items-start mb-4">
              <Target className="h-6 w-6 text-blue-400" />
            </div>
            <p className="text-3xl font-black">{activeGoals}</p>
            <p className="text-xs font-medium text-slate-400 mt-1 uppercase tracking-wider">الأهداف النشطة</p>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-slate-900 to-slate-800 text-white border-0 shadow-md">
          <CardContent className="p-6">
            <div className="flex justify-between items-start mb-4">
              <Zap className="h-6 w-6 text-amber-400" />
            </div>
            <p className="text-3xl font-black">{activeInit}</p>
            <p className="text-xs font-medium text-slate-400 mt-1 uppercase tracking-wider">المبادرات الجارية</p>
          </CardContent>
        </Card>
        
        <Card className="bg-gradient-to-br from-slate-900 to-slate-800 text-white border-0 shadow-md">
          <CardContent className="p-6">
            <div className="flex justify-between items-start mb-4">
              <HeartPulse className="h-6 w-6 text-red-400" />
            </div>
            <p className="text-3xl font-black">{companyHealth.financial}</p>
            <p className="text-xs font-medium text-slate-400 mt-1 uppercase tracking-wider">الصحة المالية</p>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-slate-900 to-slate-800 text-white border-0 shadow-md">
          <CardContent className="p-6">
            <div className="flex justify-between items-start mb-4">
              <TrendingUp className="h-6 w-6 text-green-400" />
            </div>
            <p className="text-3xl font-black">{companyHealth.market}</p>
            <p className="text-xs font-medium text-slate-400 mt-1 uppercase tracking-wider">أداء السوق</p>
          </CardContent>
        </Card>
      </div>

      {/* Phase 5 — Financial Situation */}
      {fc && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card>
            <CardHeader className="pb-3 border-b">
              <CardTitle className="text-base flex items-center gap-2">
                <DollarSign className="h-4 w-4 text-primary" /> الوضع المالي — Financial Situation
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-4 space-y-3 text-sm">
              <div className="flex justify-between items-center py-2 border-b">
                <span className="text-slate-500">السيولة المتاحة (Cash)</span>
                <span className="font-black text-slate-800">{(fc.cashPosition.availableCash/1000).toFixed(0)}k دج</span>
              </div>
              <div className="flex justify-between items-center py-2 border-b">
                <span className="text-slate-500">الإنفاق الشهري الإجمالي (Gross Burn)</span>
                <span className="font-bold text-red-600">{(fc.burnRate.grossBurn/1000).toFixed(0)}k دج</span>
              </div>
              <div className="flex justify-between items-center py-2 border-b">
                <span className="text-slate-500">الاستهلاك الصافي (Net Burn)</span>
                <span className={`font-bold ${fc.burnRate.isCashFlowPositive ? 'text-green-600' : 'text-orange-600'}`}>
                  {fc.burnRate.isCashFlowPositive ? 'إيجابي ✓' : `${(fc.burnRate.netBurn/1000).toFixed(0)}k دج`}
                </span>
              </div>
              <div className="flex justify-between items-center py-2 border-b">
                <span className="text-slate-500">مدة الاستمرارية (Runway)</span>
                <span className={`font-black ${runwayColor.replace('text-', 'text-')}`}
                  style={{ color: fc.runway.status === 'Healthy' ? '#16a34a' : fc.runway.status === 'Warning' ? '#d97706' : '#dc2626' }}>
                  {runwayLabel}
                </span>
              </div>
              <div className="flex justify-between items-center py-2 border-b">
                <span className="text-slate-500">استهلاك الميزانية</span>
                <span className="font-bold text-slate-700">{companyHealth.financial}/100</span>
              </div>
              <div className="flex justify-between items-center py-2">
                <span className="text-slate-500">الحالة المالية</span>
                <span className={`text-xs font-bold px-2 py-1 rounded ${
                  fc.signals[0].severity === 'Healthy' ? 'bg-green-100 text-green-700' :
                  fc.signals[0].severity === 'Critical' ? 'bg-red-100 text-red-700' :
                  fc.signals[0].severity === 'High' ? 'bg-orange-100 text-orange-700' :
                  'bg-amber-100 text-amber-700'
                }`}>{fc.signals[0].title}</span>
              </div>
              <p className="text-[10px] text-slate-400 text-center pt-2 border-t">DEMO DATA — Founder Planning Metrics</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3 border-b">
              <CardTitle className="text-base flex items-center gap-2">
                <TrendingDown className="h-4 w-4 text-primary" /> أولوية مالية — Financial Priority
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-4 space-y-4">
              {financialMsg && (
                <div className={`flex items-start gap-3 p-4 rounded-lg border ${financialMsg.color}`}>
                  <ShieldAlert className="h-5 w-5 shrink-0 mt-0.5" />
                  <p className="text-sm font-medium leading-relaxed">{financialMsg.text}</p>
                </div>
              )}
              <div className="space-y-2">
                {fc.signals.filter(s => s.severity !== 'Healthy').slice(0, 3).map((sig, i) => (
                  <div key={i} className={`text-xs p-2 rounded border ${
                    sig.severity === 'Critical' ? 'bg-red-50 border-red-100 text-red-700' :
                    sig.severity === 'High' ? 'bg-orange-50 border-orange-100 text-orange-700' :
                    'bg-amber-50 border-amber-100 text-amber-700'
                  }`}>
                    <strong>{sig.title}</strong>
                  </div>
                ))}
              </div>
              <div className="text-center pt-2 border-t">
                <Link to="/financial-control" className="text-xs text-primary hover:underline font-medium">
                  عرض التحكم المالي الكامل ←
                </Link>
              </div>
              <p className="text-[10px] text-slate-400 text-center">توصيات Rule Engine — ليست قرارات نهائية</p>
            </CardContent>
          </Card>
        </div>
      )}

    </div>
  );
}
