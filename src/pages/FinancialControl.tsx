import { useAppStore } from '../store';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Badge } from '../components/ui/badge';
import { DollarSign, TrendingDown, Calendar, AlertTriangle, CheckCircle2, ShieldAlert, Info } from 'lucide-react';
import { addMonths, format } from 'date-fns';
import { ar } from 'date-fns/locale';

function formatDZD(n: number) {
  return new Intl.NumberFormat('ar-DZ', { maximumFractionDigits: 0 }).format(n) + ' دج';
}

const SIGNAL_COLORS = {
  Critical: 'bg-red-50 border-red-200 text-red-800',
  High: 'bg-orange-50 border-orange-200 text-orange-800',
  Warning: 'bg-amber-50 border-amber-200 text-amber-800',
  Healthy: 'bg-green-50 border-green-200 text-green-800',
};
const SIGNAL_ICONS = {
  Critical: ShieldAlert,
  High: AlertTriangle,
  Warning: AlertTriangle,
  Healthy: CheckCircle2,
};

const RUNWAY_BADGE: Record<string, string> = {
  Healthy: 'success',
  Warning: 'warning',
  Short: 'destructive',
  Critical: 'destructive',
};

export function FinancialControl() {
  const { financialControl, financeSummary, financialSnapshots } = useAppStore();

  if (!financialControl || !financeSummary) return (
    <div className="flex items-center justify-center h-64 text-slate-400">جارٍ التحميل...</div>
  );

  const { cashPosition, burnRate, runway, signals } = financialControl;

  return (
    <div className="space-y-6 max-w-screen-xl">
      {/* Disclaimer */}
      <div className="flex items-start gap-2 bg-blue-50 border border-blue-200 rounded-lg px-4 py-3 text-xs text-blue-700">
        <Info className="h-4 w-4 shrink-0 mt-0.5" />
        <span>
          <strong>تنبيه:</strong> جميع الأرقام أدناه هي <strong>مقاييس تخطيط للمؤسس (Founder Planning Metrics)</strong>
          وبيانات تجريبية (DEMO DATA). لا تمثل محاسبة رسمية أو بيانات مالية معتمدة.
        </span>
      </div>

      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-slate-800">التحكم المالي</h1>
          <p className="text-sm text-slate-500 mt-1">نظرة شاملة على الوضع النقدي والاستهلاك والاستمرارية</p>
        </div>
      </div>

      {/* Financial Signals */}
      <div className="space-y-2">
        {signals.map((sig, i) => {
          const Icon = SIGNAL_ICONS[sig.severity];
          return (
            <div key={i} className={`flex items-start gap-3 p-4 rounded-lg border ${SIGNAL_COLORS[sig.severity]}`}>
              <Icon className="h-5 w-5 shrink-0 mt-0.5" />
              <div>
                <p className="font-bold text-sm">{sig.title}</p>
                <p className="text-xs mt-0.5 opacity-90">{sig.message}</p>
              </div>
            </div>
          );
        })}
      </div>

      {/* Cash Position */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <DollarSign className="h-5 w-5 text-primary" /> الوضع النقدي
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
            {[
              { label: 'إجمالي التمويل', value: cashPosition.totalFunding, color: 'text-blue-600 bg-blue-50' },
              { label: 'الإيرادات المحققة', value: cashPosition.wonRevenue, color: 'text-green-600 bg-green-50' },
              { label: 'المصروفات الفعلية', value: cashPosition.actualExpenses, color: 'text-red-600 bg-red-50' },
              { label: 'المبالغ المخصصة', value: cashPosition.reservedAmount, color: 'text-amber-600 bg-amber-50' },
              { label: 'السيولة المتاحة', value: cashPosition.availableCash, color: 'text-primary bg-primary/10 font-bold' },
            ].map((item, i) => (
              <div key={i} className={`p-4 rounded-lg text-center ${item.color}`}>
                <p className="text-lg font-bold">{formatDZD(item.value)}</p>
                <p className="text-xs font-medium mt-1 opacity-80">{item.label}</p>
              </div>
            ))}
          </div>
          <p className="text-[10px] text-slate-400 mt-3 text-center">
            السيولة المتاحة = إجمالي التمويل + الإيرادات المحققة − المصروفات الفعلية − المبالغ المخصصة
          </p>
        </CardContent>
      </Card>

      {/* Burn Rate */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardContent className="p-6 text-center space-y-2">
            <TrendingDown className="h-8 w-8 mx-auto text-red-500" />
            <p className="text-2xl font-black text-slate-800">{formatDZD(burnRate.grossBurn)}</p>
            <p className="text-sm font-bold text-slate-600">الإنفاق الشهري الإجمالي (Gross Burn)</p>
            <p className="text-[10px] text-slate-400">إجمالي المصروفات النقدية الشهرية — DEMO DATA</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6 text-center space-y-2">
            <TrendingDown className="h-8 w-8 mx-auto text-orange-500" />
            <p className="text-2xl font-black text-slate-800">
              {burnRate.isCashFlowPositive ? 'إيجابي' : formatDZD(burnRate.netBurn)}
            </p>
            <p className="text-sm font-bold text-slate-600">الاستهلاك الصافي (Net Burn)</p>
            <p className="text-[10px] text-slate-400">
              {burnRate.isCashFlowPositive ? 'التدفق النقدي إيجابي — Cash-Flow Positive' : 'Gross Burn − الإيرادات — DEMO DATA'}
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6 text-center space-y-2">
            <TrendingDown className="h-8 w-8 mx-auto text-amber-500" />
            <p className="text-2xl font-black text-slate-800">{formatDZD(burnRate.trailingAvgNetBurn)}</p>
            <p className="text-sm font-bold text-slate-600">متوسط 3 أشهر (Trailing Avg)</p>
            <p className="text-[10px] text-slate-400">
              {burnRate.hasEnoughHistory ? 'متوسط آخر 3 أشهر — DEMO DATA' : 'بيانات غير كافية — يُستخدم Net Burn الحالي'}
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Runway */}
      <Card className="border-2 border-dashed">
        <CardContent className="p-6">
          <div className="flex flex-col md:flex-row items-center gap-6">
            <div className="text-center">
              <Calendar className="h-10 w-10 mx-auto text-primary mb-2" />
              <p className="text-5xl font-black text-slate-900">
                {runway.isNoBurn ? '∞' : runway.months}
              </p>
              <p className="text-sm font-bold text-slate-500 mt-1">
                {runway.isNoBurn ? 'لا استهلاك نقدي' : 'شهرًا'}
              </p>
            </div>
            <div className="flex-1 space-y-3">
              <div className="flex items-center gap-3">
                <p className="text-lg font-black text-slate-800">مدة الاستمرارية المالية (Runway)</p>
                <Badge variant={RUNWAY_BADGE[runway.status] as any}>
                  {runway.status === 'Healthy' ? 'آمن' : runway.status === 'Warning' ? 'تحذير' : runway.status === 'Short' ? 'قصير' : 'حرج'}
                </Badge>
              </div>
              {runway.isNoBurn ? (
                <p className="text-sm text-green-700 bg-green-50 px-3 py-2 rounded">
                  التدفق النقدي إيجابي — الشركة لا تستهلك نقدًا. Not Applicable.
                </p>
              ) : (
                <div className="text-sm text-slate-600 space-y-1">
                  <p>بناءً على متوسط الاستهلاك الشهري الصافي: <strong>{formatDZD(burnRate.trailingAvgNetBurn)}</strong></p>
                  {runway.estimatedCashOutDate && (
                    <p className="text-amber-700 font-medium">
                      تاريخ نفاد السيولة التقديري (Estimated Cash-Out Date): {' '}
                      {format(new Date(runway.estimatedCashOutDate), 'dd MMMM yyyy', { locale: ar })}
                    </p>
                  )}
                  <p className="text-[10px] text-slate-400">هذا تاريخ تقديري للتخطيط فقط وليس توقعًا ماليًا رسميًا.</p>
                </div>
              )}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Monthly Snapshots */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">السجل الشهري للبيانات المالية — DEMO DATA</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b text-slate-500 text-xs">
                  <th className="text-right py-2 px-3 font-semibold">الشهر</th>
                  <th className="text-right py-2 px-3 font-semibold">الإنفاق الإجمالي</th>
                  <th className="text-right py-2 px-3 font-semibold">الإيرادات</th>
                  <th className="text-right py-2 px-3 font-semibold">Net Burn</th>
                  <th className="text-right py-2 px-3 font-semibold">ملاحظات</th>
                </tr>
              </thead>
              <tbody>
                {financialSnapshots.map(snap => (
                  <tr key={snap.id} className="border-b hover:bg-slate-50 transition-colors">
                    <td className="py-2 px-3 font-medium">{snap.label}</td>
                    <td className="py-2 px-3 text-red-600">{formatDZD(snap.grossBurn)}</td>
                    <td className="py-2 px-3 text-green-600">{formatDZD(snap.cashInflow)}</td>
                    <td className="py-2 px-3 font-bold text-orange-600">{formatDZD(snap.netBurn)}</td>
                    <td className="py-2 px-3 text-slate-400 text-xs">{snap.notes}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
