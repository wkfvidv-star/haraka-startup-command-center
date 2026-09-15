import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { TrendingUp, Target, Plus, Edit2, Trash2 } from 'lucide-react';
import { useAppStore } from '../store';
import { Badge } from '../components/ui/badge';
import { format } from 'date-fns';
import { ar } from 'date-fns/locale';

export function Growth() {
  const { growthTargets } = useAppStore();

  return (
    <div className="space-y-6 max-w-screen-xl">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-slate-800">أهداف النمو</h1>
          <p className="text-sm text-slate-500 mt-1">متابعة مقاييس النمو الرئيسية للشركة</p>
        </div>
        <button className="bg-primary text-white px-4 py-2 rounded-md text-sm font-medium flex items-center gap-2 hover:bg-primary/90">
          <Plus className="h-4 w-4" /> مقياس جديد
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {growthTargets.map(g => {
          const progress = g.target !== 0 ? Math.min(100, Math.round((g.current / g.target) * 100)) : 0;
          return (
            <Card key={g.id}>
              <CardContent className="p-5">
                <div className="flex justify-between items-start mb-4">
                  <div className="flex items-center gap-2 text-primary font-bold">
                    <TrendingUp className="h-5 w-5" />
                    <span>{g.metric}</span>
                  </div>
                  <Badge variant={progress >= 100 ? 'success' : progress >= 80 ? 'default' : progress >= 50 ? 'warning' : 'destructive'}>
                    {progress}%
                  </Badge>
                </div>
                
                <div className="flex justify-between items-end mb-4">
                  <div>
                    <p className="text-3xl font-bold text-slate-800">{g.current}</p>
                    <p className="text-xs text-slate-500 mt-1">القيمة الحالية</p>
                  </div>
                  <div className="text-right">
                    <p className="text-lg font-semibold text-slate-600">{g.target}</p>
                    <p className="text-xs text-slate-500 mt-1">الهدف ({g.period})</p>
                  </div>
                </div>

                <div className="h-2 w-full bg-slate-100 rounded-full overflow-hidden mb-4">
                  <div 
                    className={`h-full rounded-full transition-all ${
                      progress >= 100 ? 'bg-green-500' : progress >= 80 ? 'bg-primary' : progress >= 50 ? 'bg-amber-500' : 'bg-red-500'
                    }`}
                    style={{ width: `${progress}%` }}
                  />
                </div>

                <div className="flex justify-between items-center text-xs text-slate-500 pt-3 border-t">
                  <span className="flex items-center gap-1">
                    <Target className="h-3.5 w-3.5" /> فئة: {
                      g.metric === 'Revenue' ? 'إيرادات' :
                      g.metric === 'Customers' ? 'عملاء' :
                      g.metric === 'Retention' ? 'احتفاظ' :
                      g.metric === 'Conversion' ? 'توسع' : 'حصص سوقية'
                    }
                  </span>
                  <div className="flex gap-1">
                    <button className="hover:text-primary"><Edit2 className="h-3.5 w-3.5" /></button>
                    <button className="hover:text-red-500"><Trash2 className="h-3.5 w-3.5" /></button>
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
