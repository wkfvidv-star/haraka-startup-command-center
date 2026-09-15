import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { HeartPulse, CheckCircle2, AlertTriangle, ShieldAlert, TrendingUp } from 'lucide-react';
import { useAppStore } from '../store';

export function CompanyHealth() {
  const { companyHealth } = useAppStore();

  if (!companyHealth) return null;

  const getStatusColor = (score: number) => {
    if (score >= 85) return 'text-green-600 bg-green-50';
    if (score >= 60) return 'text-amber-600 bg-amber-50';
    return 'text-red-600 bg-red-50';
  };

  const metrics = [
    { label: 'العمليات والتنفيذ', score: companyHealth.operational, weight: 20 },
    { label: 'الصحة المالية', score: companyHealth.financial, weight: 20 },
    { label: 'جاهزية المنتج', score: companyHealth.product, weight: 15 },
    { label: 'أداء السوق', score: companyHealth.market, weight: 20 },
    { label: 'أداء الفريق', score: companyHealth.team, weight: 10 },
    { label: 'مقاييس النمو', score: companyHealth.growth, weight: 15 },
  ];

  return (
    <div className="space-y-6 max-w-screen-xl mx-auto">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-white p-6 rounded-xl border shadow-sm">
        <div>
          <h1 className="text-2xl font-bold text-slate-800 flex items-center gap-2">
            <HeartPulse className="h-6 w-6 text-primary" /> مؤشر صحة الشركة الشامل
          </h1>
          <p className="text-sm text-slate-500 mt-1">يتم حساب هذا المؤشر تلقائياً بناءً على 6 محاور استراتيجية</p>
        </div>
        <div className={`flex flex-col items-center justify-center p-4 rounded-xl border min-w-[150px] ${getStatusColor(companyHealth.overall)}`}>
          <span className="text-5xl font-black">{companyHealth.overall}</span>
          <span className="text-xs font-bold uppercase tracking-wider mt-1">Total Score</span>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {metrics.map((m, i) => (
          <Card key={i}>
            <CardContent className="p-6 text-center space-y-3">
              <div className="flex justify-between items-center text-xs font-semibold text-slate-400 mb-2">
                <span>الوزن: {m.weight}%</span>
                <span className={m.score >= 80 ? 'text-green-500' : m.score >= 50 ? 'text-amber-500' : 'text-red-500'}>
                  {m.score >= 80 ? 'ممتاز' : m.score >= 50 ? 'يحتاج تحسين' : 'خطر'}
                </span>
              </div>
              <p className="text-4xl font-bold text-slate-800">{m.score}</p>
              <h3 className="text-sm font-bold text-slate-600 uppercase">{m.label}</h3>
              
              <div className="h-1.5 w-full bg-slate-100 rounded-full overflow-hidden mt-4">
                <div 
                  className={`h-full rounded-full ${m.score >= 80 ? 'bg-green-500' : m.score >= 50 ? 'bg-amber-500' : 'bg-red-500'}`}
                  style={{ width: `${m.score}%` }}
                />
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-lg">نقاط التدقيق الآلي</CardTitle>
        </CardHeader>
        <CardContent>
          <ul className="space-y-3">
            <li className="flex items-start gap-3 p-3 bg-slate-50 rounded-lg">
              {companyHealth.overall >= 80 ? (
                <CheckCircle2 className="h-5 w-5 text-green-500 shrink-0 mt-0.5" />
              ) : companyHealth.overall >= 50 ? (
                <AlertTriangle className="h-5 w-5 text-amber-500 shrink-0 mt-0.5" />
              ) : (
                <ShieldAlert className="h-5 w-5 text-red-500 shrink-0 mt-0.5" />
              )}
              <div>
                <p className="font-semibold text-slate-800 text-sm">التشخيص الآلي الشامل</p>
                <p className="text-xs text-slate-600 mt-1">
                  {companyHealth.overall >= 80 
                    ? 'الشركة تعمل بكفاءة عالية في معظم المحاور. ينصح بالتركيز على التوسع ومضاعفة المبيعات.'
                    : companyHealth.overall >= 50 
                    ? 'الشركة تواجه بعض التحديات التشغيلية والمالية. يجب التركيز على سد الفجوات في المحاور ذات الأداء الأقل من 60.'
                    : 'الشركة في وضع حرج جداً. يجب إيقاف المبادرات غير الضرورية والتركيز حصرياً على السيولة النقدية وحل المشاكل الحرجة.'
                  }
                </p>
              </div>
            </li>
          </ul>
        </CardContent>
      </Card>
    </div>
  );
}
