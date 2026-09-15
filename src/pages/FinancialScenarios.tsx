import { useAppStore } from '../store';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Info } from 'lucide-react';

function formatDZD(n: number) {
  return new Intl.NumberFormat('ar-DZ', { maximumFractionDigits: 0 }).format(n) + ' دج';
}

const TYPE_LABELS: Record<string, string> = {
  Conservative: 'المحافظ',
  Base: 'الأساسي',
  Growth: 'النمو',
};

const TYPE_COLORS: Record<string, string> = {
  Conservative: 'bg-orange-50 border-orange-200',
  Base: 'bg-blue-50 border-blue-200',
  Growth: 'bg-green-50 border-green-200',
};

const TYPE_BADGE_COLORS: Record<string, string> = {
  Conservative: 'bg-orange-100 text-orange-800',
  Base: 'bg-blue-100 text-blue-800',
  Growth: 'bg-green-100 text-green-800',
};

export function FinancialScenarios() {
  const { financialScenarios } = useAppStore();

  return (
    <div className="space-y-6 max-w-screen-xl">
      <div className="flex items-start gap-2 bg-amber-50 border border-amber-200 rounded-lg px-4 py-3 text-xs text-amber-700">
        <Info className="h-4 w-4 shrink-0 mt-0.5" />
        <span>
          <strong>تنبيه:</strong> جميع السيناريوهات أدناه هي <strong>سيناريوهات تخطيط تجريبية (DEMO PLANNING SCENARIOS)</strong>
          وليست توقعات مالية رسمية أو حسابات محاسبية معتمدة.
        </span>
      </div>

      <div>
        <h1 className="text-2xl font-bold text-slate-800">السيناريوهات المالية</h1>
        <p className="text-sm text-slate-500 mt-1">مقارنة بين ثلاثة مسارات مالية مختلفة لأغراض التخطيط فقط</p>
      </div>

      {/* Comparison Table */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">مقارنة السيناريوهات — DEMO PLANNING SCENARIOS</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b text-slate-500 text-xs uppercase tracking-wider">
                  <th className="text-right py-3 px-4 font-semibold">السيناريو</th>
                  <th className="text-right py-3 px-4 font-semibold">الإيرادات الشهرية</th>
                  <th className="text-right py-3 px-4 font-semibold">المصروفات الشهرية</th>
                  <th className="text-right py-3 px-4 font-semibold">Net Burn</th>
                  <th className="text-right py-3 px-4 font-semibold">مدة الاستمرارية</th>
                  <th className="text-right py-3 px-4 font-semibold">الحالة</th>
                </tr>
              </thead>
              <tbody>
                {financialScenarios.map(s => (
                  <tr key={s.id} className="border-b hover:bg-slate-50 transition-colors">
                    <td className="py-3 px-4">
                      <span className={`px-2 py-1 rounded text-xs font-bold ${TYPE_BADGE_COLORS[s.type]}`}>
                        {TYPE_LABELS[s.type]}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-green-600 font-medium">{formatDZD(s.monthlyRevenue)}</td>
                    <td className="py-3 px-4 text-red-600 font-medium">{formatDZD(s.monthlyExpenses)}</td>
                    <td className="py-3 px-4 font-bold text-orange-600">
                      {s.isCashFlowPositive ? '+ (إيجابي)' : formatDZD(s.monthlyNetBurn)}
                    </td>
                    <td className="py-3 px-4 font-black text-slate-800">
                      {s.isCashFlowPositive ? 'لا استهلاك ∞' : `${s.runwayMonths} شهر`}
                    </td>
                    <td className="py-3 px-4">
                      {s.isCashFlowPositive ? (
                        <span className="text-green-600 text-xs font-bold bg-green-50 px-2 py-1 rounded">Cash-Flow Positive</span>
                      ) : s.runwayMonths < 4 ? (
                        <span className="text-red-600 text-xs font-bold bg-red-50 px-2 py-1 rounded">ضغط مالي</span>
                      ) : (
                        <span className="text-amber-600 text-xs font-bold bg-amber-50 px-2 py-1 rounded">مقبول</span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      {/* Scenario Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {financialScenarios.map(s => (
          <Card key={s.id} className={`border-2 ${TYPE_COLORS[s.type]}`}>
            <CardHeader className="pb-3 border-b">
              <div className="flex justify-between items-center">
                <CardTitle className="text-lg">{TYPE_LABELS[s.type]}</CardTitle>
                <span className={`text-xs font-bold px-2 py-1 rounded ${TYPE_BADGE_COLORS[s.type]}`}>
                  {s.isCashFlowPositive ? 'تدفق إيجابي' : `${s.runwayMonths} شهر`}
                </span>
              </div>
              <p className="text-xs text-slate-500 mt-1">{s.description}</p>
            </CardHeader>
            <CardContent className="pt-4 space-y-3 text-sm">
              <div className="flex justify-between">
                <span className="text-slate-500">الإيرادات الشهرية</span>
                <span className="font-bold text-green-600">{formatDZD(s.monthlyRevenue)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">المصروفات الشهرية</span>
                <span className="font-bold text-red-600">{formatDZD(s.monthlyExpenses)}</span>
              </div>
              <div className="flex justify-between border-t pt-3">
                <span className="text-slate-600 font-medium">Net Burn</span>
                <span className={`font-black ${s.isCashFlowPositive ? 'text-green-600' : 'text-orange-600'}`}>
                  {s.isCashFlowPositive ? 'إيجابي ✓' : formatDZD(s.monthlyNetBurn)}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-600 font-medium">السيولة المتاحة</span>
                <span className="font-bold text-slate-800">{formatDZD(s.availableCash)}</span>
              </div>
              <p className="text-[10px] text-slate-400 text-center pt-2 border-t">{s.notes}</p>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
