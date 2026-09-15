import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Badge } from '../components/ui/badge';
import { Target, TrendingUp, Calendar as CalendarIcon, Filter, Plus, Edit2, Trash2 } from 'lucide-react';
import { useAppStore } from '../store';
import { Goal, GoalStatus } from '../types/goal';
import { format } from 'date-fns';
import { ar } from 'date-fns/locale';

export function Goals() {
  const { goals, config } = useAppStore();
  const [filter, setFilter] = useState<GoalStatus | 'All'>('All');

  const filteredGoals = filter === 'All' ? goals : goals.filter(g => g.status === filter);

  return (
    <div className="space-y-6 max-w-screen-xl">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-slate-800">أهداف الشركة</h1>
          <p className="text-sm text-slate-500 mt-1">إدارة ومتابعة الأهداف الاستراتيجية (OKRs)</p>
        </div>
        <button className="bg-primary text-white px-4 py-2 rounded-md text-sm font-medium flex items-center gap-2 hover:bg-primary/90">
          <Plus className="h-4 w-4" /> هدف جديد
        </button>
      </div>

      <div className="flex gap-2">
        {['All', 'On Track', 'At Risk', 'Behind', 'Completed'].map(s => (
          <button
            key={s}
            onClick={() => setFilter(s as any)}
            className={`px-3 py-1.5 rounded-full text-xs font-medium border ${
              filter === s 
                ? 'bg-primary text-white border-primary' 
                : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-50'
            }`}
          >
            {s === 'All' ? 'الكل' : s === 'On Track' ? 'على المسار' : s === 'At Risk' ? 'في خطر' : s === 'Behind' ? 'متأخر' : 'مكتمل'}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredGoals.map(goal => {
          const progress = goal.targetValue !== 0 ? Math.min(100, Math.round((goal.currentValue / goal.targetValue) * 100)) : 0;
          
          return (
            <Card key={goal.id} className="hover:shadow-md transition-shadow">
              <CardHeader className="pb-3 border-b">
                <div className="flex justify-between items-start">
                  <Badge 
                    variant={
                      goal.status === 'Completed' ? 'success' : 
                      goal.status === 'On Track' ? 'default' : 
                      goal.status === 'At Risk' ? 'warning' : 'destructive'
                    }
                  >
                    {goal.status === 'On Track' ? 'على المسار' : goal.status === 'At Risk' ? 'في خطر' : goal.status === 'Behind' ? 'متأخر' : 'مكتمل'}
                  </Badge>
                  <div className="flex gap-1 text-slate-400">
                    <button className="hover:text-primary p-1"><Edit2 className="h-3.5 w-3.5" /></button>
                    <button className="hover:text-red-500 p-1"><Trash2 className="h-3.5 w-3.5" /></button>
                  </div>
                </div>
                <CardTitle className="text-lg mt-3">{goal.title}</CardTitle>
                <p className="text-sm text-slate-500 line-clamp-2 mt-1">{goal.description}</p>
              </CardHeader>
              <CardContent className="pt-4 space-y-4">
                <div className="space-y-1.5">
                  <div className="flex justify-between text-xs font-medium">
                    <span className="text-slate-600">التقدم ({progress}%)</span>
                    <span className="text-slate-900">{goal.currentValue} / {goal.targetValue} {goal.unit}</span>
                  </div>
                  <div className="h-2 w-full bg-slate-100 rounded-full overflow-hidden">
                    <div 
                      className={`h-full rounded-full transition-all ${
                        goal.status === 'Completed' ? 'bg-green-500' :
                        goal.status === 'At Risk' ? 'bg-amber-500' :
                        goal.status === 'Behind' ? 'bg-red-500' : 'bg-primary'
                      }`}
                      style={{ width: `${progress}%` }}
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4 pt-2 border-t text-xs">
                  <div>
                    <span className="text-slate-400 block mb-1">المالك</span>
                    <span className="font-medium text-slate-700">{goal.owner}</span>
                  </div>
                  <div>
                    <span className="text-slate-400 block mb-1">تاريخ الانتهاء</span>
                    <span className="font-medium text-slate-700 flex items-center gap-1">
                      <CalendarIcon className="h-3 w-3" />
                      {format(new Date(goal.endDate), 'dd MMM yyyy', { locale: ar })}
                    </span>
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}
        {filteredGoals.length === 0 && (
          <div className="col-span-full py-12 text-center text-slate-500 bg-slate-50 rounded-lg border border-dashed">
            لا توجد أهداف مطابقة للفلتر الحالي.
          </div>
        )}
      </div>
    </div>
  );
}
