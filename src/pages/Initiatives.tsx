import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Badge } from '../components/ui/badge';
import { Zap, Calendar as CalendarIcon, Plus, Edit2, Trash2, Target } from 'lucide-react';
import { useAppStore } from '../store';
import { Initiative, InitiativeStatus } from '../types/initiative';
import { format } from 'date-fns';
import { ar } from 'date-fns/locale';

export function Initiatives() {
  const { initiatives, goals, projects } = useAppStore();
  const [filter, setFilter] = useState<InitiativeStatus | 'All'>('All');

  const filtered = filter === 'All' ? initiatives : initiatives.filter(i => i.status === filter);

  return (
    <div className="space-y-6 max-w-screen-xl">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-slate-800">المبادرات الاستراتيجية</h1>
          <p className="text-sm text-slate-500 mt-1">البرامج والمشاريع الكبرى لتحقيق الأهداف</p>
        </div>
        <button className="bg-primary text-white px-4 py-2 rounded-md text-sm font-medium flex items-center gap-2 hover:bg-primary/90">
          <Plus className="h-4 w-4" /> مبادرة جديدة
        </button>
      </div>

      <div className="flex gap-2">
        {['All', 'Planned', 'Active', 'Paused', 'Completed', 'Cancelled'].map(s => (
          <button
            key={s}
            onClick={() => setFilter(s as any)}
            className={`px-3 py-1.5 rounded-full text-xs font-medium border ${
              filter === s 
                ? 'bg-primary text-white border-primary' 
                : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-50'
            }`}
          >
            {s === 'All' ? 'الكل' : 
             s === 'Planned' ? 'مخطط' : 
             s === 'Active' ? 'نشط' : 
             s === 'Paused' ? 'موقوف' : 
             s === 'Completed' ? 'مكتمل' : 'ملغى'}
          </button>
        ))}
      </div>

      <div className="space-y-4">
        {filtered.map(init => {
          const goal = goals.find(g => g.id === init.goalId);
          const initProjects = projects.filter(p => p.initiativeId === init.id);
          
          return (
            <Card key={init.id} className="hover:border-primary/50 transition-colors">
              <CardContent className="p-5 flex flex-col md:flex-row gap-6 items-start md:items-center">
                
                <div className="flex-1 space-y-2">
                  <div className="flex items-center gap-2">
                    <Badge 
                      variant={
                        init.status === 'Completed' ? 'success' : 
                        init.status === 'Active' ? 'default' : 
                        init.status === 'Paused' ? 'destructive' : 'secondary'
                      }
                    >
                      {init.status === 'Planned' ? 'مخطط' : 
                       init.status === 'Active' ? 'نشط' : 
                       init.status === 'Paused' ? 'موقوف' : 
                       init.status === 'Completed' ? 'مكتمل' : 'ملغى'}
                    </Badge>
                    <span className="text-xs text-slate-500 font-medium bg-slate-100 px-2 py-0.5 rounded flex items-center gap-1">
                      <Target className="h-3 w-3" /> {goal?.title || 'بدون هدف مرتبط'}
                    </span>
                  </div>
                  <h3 className="text-lg font-bold text-slate-800">{init.name}</h3>
                  <p className="text-sm text-slate-600">{init.description}</p>
                </div>

                <div className="w-full md:w-64 space-y-3 bg-slate-50 p-3 rounded-lg border border-slate-100">
                  <div className="space-y-1.5">
                    <div className="flex justify-between text-xs font-medium">
                      <span className="text-slate-600">التقدم العام ({init.progress || 0}%)</span>
                      <span className="text-slate-500">{initProjects.length} مشاريع</span>
                    </div>
                    <div className="h-2 w-full bg-slate-200 rounded-full overflow-hidden">
                      <div 
                        className="h-full bg-primary rounded-full"
                        style={{ width: `${init.progress || 0}%` }}
                      />
                    </div>
                  </div>
                  
                  <div className="flex justify-between items-center text-xs text-slate-500 pt-2 border-t">
                    <span className="flex items-center gap-1">
                      <CalendarIcon className="h-3.5 w-3.5" />
                      {format(new Date(init.endDate), 'dd MMM yyyy', { locale: ar })}
                    </span>
                    <span className="font-medium text-slate-700 bg-white px-2 py-1 rounded shadow-sm border">{init.owner}</span>
                  </div>
                </div>

                <div className="flex md:flex-col gap-2">
                  <button className="p-2 hover:bg-slate-100 rounded text-slate-400 hover:text-primary transition-colors">
                    <Edit2 className="h-4 w-4" />
                  </button>
                  <button className="p-2 hover:bg-slate-100 rounded text-slate-400 hover:text-red-500 transition-colors">
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              </CardContent>
            </Card>
          );
        })}
        {filtered.length === 0 && (
          <div className="py-12 text-center text-slate-500 bg-slate-50 rounded-lg border border-dashed">
            لا توجد مبادرات مطابقة للفلتر الحالي.
          </div>
        )}
      </div>
    </div>
  );
}
