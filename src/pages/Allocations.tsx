import { useState } from 'react';
import { useAppStore } from '../store';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Badge } from '../components/ui/badge';
import { Plus, Trash2, Edit2 } from 'lucide-react';
import { FinancialAllocation } from '../types/financialControl';

function formatDZD(n: number) {
  return new Intl.NumberFormat('ar-DZ', { maximumFractionDigits: 0 }).format(n) + ' دج';
}

const CAT_LABELS: Record<string, string> = {
  Product: 'المنتج',
  Technology: 'التقنية',
  Marketing: 'التسويق',
  Sales: 'المبيعات',
  Operations: 'العمليات',
  Team: 'الفريق',
  LegalIP: 'القانوني/الملكية',
  Infrastructure: 'البنية التحتية',
  Other: 'أخرى',
};

const PRIORITY_VARIANT: Record<string, string> = {
  Critical: 'destructive',
  High: 'warning',
  Medium: 'default',
  Low: 'secondary',
};

const STATUS_LABELS: Record<string, string> = {
  Planned: 'مخطط',
  Active: 'نشط',
  'At Risk': 'في خطر',
  Completed: 'مكتمل',
  Paused: 'موقوف',
  Cancelled: 'ملغى',
};

export function Allocations() {
  const { financialAllocations, deleteAllocation } = useAppStore();

  const totalAllocated = financialAllocations.reduce((s, a) => s + a.allocatedAmount, 0);
  const totalSpent = financialAllocations.reduce((s, a) => s + a.spentAmount, 0);
  const totalRemaining = financialAllocations.reduce((s, a) => s + a.remainingAmount, 0);
  const totalUtilization = totalAllocated > 0 ? (totalSpent / totalAllocated) * 100 : 0;

  return (
    <div className="space-y-6 max-w-screen-xl">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-slate-800">تخصيص الميزانية</h1>
          <p className="text-sm text-slate-500 mt-1">توزيع الميزانية حسب الأولوية والفئة — DEMO DATA</p>
        </div>
        <button className="bg-primary text-white px-4 py-2 rounded-md text-sm font-medium flex items-center gap-2 hover:bg-primary/90">
          <Plus className="h-4 w-4" /> تخصيص جديد
        </button>
      </div>

      {/* Summary Row */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { label: 'إجمالي المخصص', value: formatDZD(totalAllocated), color: 'text-blue-600 bg-blue-50' },
          { label: 'إجمالي المُنفق', value: formatDZD(totalSpent), color: 'text-red-600 bg-red-50' },
          { label: 'إجمالي المتبقي', value: formatDZD(totalRemaining), color: 'text-green-600 bg-green-50' },
          { label: 'نسبة الاستخدام', value: `${totalUtilization.toFixed(1)}%`, color: totalUtilization >= 80 ? 'text-red-600 bg-red-50' : 'text-primary bg-primary/10' },
        ].map((item, i) => (
          <div key={i} className={`p-4 rounded-lg text-center ${item.color}`}>
            <p className="text-xl font-black">{item.value}</p>
            <p className="text-xs font-medium mt-1 opacity-75">{item.label}</p>
          </div>
        ))}
      </div>

      {/* Allocation List */}
      <div className="space-y-3">
        {financialAllocations.map(a => {
          const utilization = a.allocatedAmount > 0 ? (a.spentAmount / a.allocatedAmount) * 100 : 0;
          return (
            <Card key={a.id} className="hover:shadow-sm transition-shadow">
              <CardContent className="p-5">
                <div className="flex flex-col md:flex-row gap-4 items-start md:items-center">
                  <div className="flex-1 space-y-1">
                    <div className="flex items-center gap-2 flex-wrap">
                      <h3 className="font-bold text-slate-800">{a.name}</h3>
                      <Badge variant={PRIORITY_VARIANT[a.priority] as any} className="text-[10px]">
                        {a.priority === 'Critical' ? 'حرج' : a.priority === 'High' ? 'عالي' : a.priority === 'Medium' ? 'متوسط' : 'منخفض'}
                      </Badge>
                      <span className="text-[10px] text-slate-400 bg-slate-100 px-2 py-0.5 rounded">{CAT_LABELS[a.category]}</span>
                      <span className="text-[10px] text-slate-400">{STATUS_LABELS[a.status]}</span>
                    </div>
                    <p className="text-xs text-slate-500">{a.description}</p>
                  </div>

                  <div className="w-full md:w-72 space-y-2">
                    <div className="grid grid-cols-3 text-xs text-center gap-2">
                      <div>
                        <p className="text-slate-400">مخصص</p>
                        <p className="font-bold text-slate-800">{formatDZD(a.allocatedAmount)}</p>
                      </div>
                      <div>
                        <p className="text-slate-400">منفق</p>
                        <p className="font-bold text-red-600">{formatDZD(a.spentAmount)}</p>
                      </div>
                      <div>
                        <p className="text-slate-400">متبقي</p>
                        <p className="font-bold text-green-600">{formatDZD(a.remainingAmount)}</p>
                      </div>
                    </div>
                    <div className="space-y-1">
                      <div className="flex justify-between text-[10px] text-slate-500">
                        <span>الاستخدام</span>
                        <span className={utilization >= 90 ? 'text-red-600 font-bold' : utilization >= 70 ? 'text-amber-600' : ''}>{utilization.toFixed(0)}%</span>
                      </div>
                      <div className="h-1.5 w-full bg-slate-100 rounded-full overflow-hidden">
                        <div
                          className={`h-full rounded-full ${utilization >= 90 ? 'bg-red-500' : utilization >= 70 ? 'bg-amber-500' : 'bg-primary'}`}
                          style={{ width: `${Math.min(100, utilization)}%` }}
                        />
                      </div>
                    </div>
                  </div>

                  <div className="flex gap-1 shrink-0">
                    <button className="p-2 hover:bg-slate-100 rounded text-slate-400 hover:text-primary">
                      <Edit2 className="h-4 w-4" />
                    </button>
                    <button
                      onClick={() => deleteAllocation(a.id)}
                      className="p-2 hover:bg-slate-100 rounded text-slate-400 hover:text-red-500"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
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
