import { useAppStore } from '../store';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Badge } from '../components/ui/badge';
import { Plus, Trash2, Edit2, Flag } from 'lucide-react';
import { format } from 'date-fns';
import { ar } from 'date-fns/locale';

function formatDZD(n: number) {
  return new Intl.NumberFormat('ar-DZ', { maximumFractionDigits: 0 }).format(n) + ' دج';
}

const STATUS_LABELS: Record<string, string> = {
  Planned: 'مخطط',
  Active: 'نشط',
  'At Risk': 'في خطر',
  Completed: 'مكتمل',
  Paused: 'موقوف',
};

const STATUS_VARIANT: Record<string, string> = {
  Planned: 'secondary',
  Active: 'default',
  'At Risk': 'destructive',
  Completed: 'success',
  Paused: 'warning',
};

export function FundingMilestones() {
  const { fundingMilestones, deleteFundingMilestone } = useAppStore();

  const totalBudget = fundingMilestones.reduce((s, m) => s + m.targetBudget, 0);
  const totalSpent = fundingMilestones.reduce((s, m) => s + m.spentAmount, 0);

  return (
    <div className="space-y-6 max-w-screen-xl">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-slate-800">مراحل التمويل</h1>
          <p className="text-sm text-slate-500 mt-1">ربط التمويل بالمراحل الاستراتيجية — DEMO DATA</p>
        </div>
        <button className="bg-primary text-white px-4 py-2 rounded-md text-sm font-medium flex items-center gap-2 hover:bg-primary/90">
          <Plus className="h-4 w-4" /> مرحلة جديدة
        </button>
      </div>

      {/* Summary */}
      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
        <div className="p-4 rounded-lg text-center bg-blue-50 text-blue-700">
          <p className="text-xl font-black">{formatDZD(totalBudget)}</p>
          <p className="text-xs font-medium mt-1">إجمالي الميزانية المستهدفة</p>
        </div>
        <div className="p-4 rounded-lg text-center bg-red-50 text-red-700">
          <p className="text-xl font-black">{formatDZD(totalSpent)}</p>
          <p className="text-xs font-medium mt-1">إجمالي المُنفق</p>
        </div>
        <div className="p-4 rounded-lg text-center bg-green-50 text-green-700">
          <p className="text-xl font-black">{formatDZD(totalBudget - totalSpent)}</p>
          <p className="text-xs font-medium mt-1">إجمالي المتبقي</p>
        </div>
      </div>

      {/* Milestones List */}
      <div className="space-y-4">
        {fundingMilestones.map(m => {
          const pct = m.targetBudget > 0 ? (m.spentAmount / m.targetBudget) * 100 : 0;
          return (
            <Card key={m.id} className="overflow-hidden">
              <CardContent className="p-0">
                <div className="flex flex-col md:flex-row">
                  {/* Status stripe */}
                  <div className={`w-full md:w-2 md:h-auto h-1.5 ${
                    m.status === 'Completed' ? 'bg-green-500' :
                    m.status === 'Active' ? 'bg-primary' :
                    m.status === 'At Risk' ? 'bg-red-500' : 'bg-slate-200'
                  }`} />
                  <div className="p-5 flex-1 flex flex-col md:flex-row gap-4 items-start md:items-center">
                    <div className="flex-1 space-y-2">
                      <div className="flex items-center gap-2 flex-wrap">
                        <Flag className="h-4 w-4 text-primary" />
                        <h3 className="font-bold text-slate-800">{m.name}</h3>
                        <Badge variant={STATUS_VARIANT[m.status] as any}>{STATUS_LABELS[m.status]}</Badge>
                      </div>
                      <p className="text-xs text-slate-500">{m.description}</p>
                      <p className="text-xs text-slate-400 flex items-center gap-1">
                        الموعد المستهدف: {format(new Date(m.targetDate), 'dd MMMM yyyy', { locale: ar })}
                      </p>
                    </div>

                    <div className="w-full md:w-72 space-y-2 bg-slate-50 p-3 rounded-lg">
                      <div className="grid grid-cols-3 text-xs text-center gap-1">
                        <div>
                          <p className="text-slate-400">مستهدف</p>
                          <p className="font-bold text-slate-800">{formatDZD(m.targetBudget)}</p>
                        </div>
                        <div>
                          <p className="text-slate-400">منفق</p>
                          <p className="font-bold text-red-600">{formatDZD(m.spentAmount)}</p>
                        </div>
                        <div>
                          <p className="text-slate-400">متبقي</p>
                          <p className="font-bold text-green-600">{formatDZD(m.remainingAmount)}</p>
                        </div>
                      </div>
                      <div className="h-2 w-full bg-slate-200 rounded-full overflow-hidden">
                        <div
                          className={`h-full rounded-full ${pct >= 90 ? 'bg-red-500' : pct >= 70 ? 'bg-amber-500' : 'bg-primary'}`}
                          style={{ width: `${Math.min(100, pct)}%` }}
                        />
                      </div>
                      <p className="text-[10px] text-slate-400 text-center">{pct.toFixed(0)}% مُنجز</p>
                    </div>

                    <div className="flex gap-1 shrink-0">
                      <button className="p-2 hover:bg-slate-100 rounded text-slate-400 hover:text-primary">
                        <Edit2 className="h-4 w-4" />
                      </button>
                      <button
                        onClick={() => deleteFundingMilestone(m.id)}
                        className="p-2 hover:bg-slate-100 rounded text-slate-400 hover:text-red-500"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
}
