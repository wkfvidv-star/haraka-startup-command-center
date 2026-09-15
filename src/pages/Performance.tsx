import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Activity, CheckSquare, Briefcase, Star } from 'lucide-react';
import { useAppStore } from '../store';

export function Performance() {
  const { teamPerformances, teamMembers } = useAppStore();

  return (
    <div className="space-y-6 max-w-screen-xl">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-slate-800">أداء الفريق</h1>
          <p className="text-sm text-slate-500 mt-1">تتبع كفاءة وإنتاجية أفراد الفريق</p>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4">
        {teamPerformances.map(tp => {
          const member = teamMembers.find(m => m.id === tp.memberId);
          if (!member) return null;
          
          return (
            <Card key={tp.memberId}>
              <CardContent className="p-4 flex flex-col md:flex-row items-center gap-6">
                
                <div className="flex items-center gap-4 w-full md:w-64 border-b md:border-b-0 md:border-l border-slate-100 pb-4 md:pb-0 md:pl-4">
                  <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center text-primary font-bold text-lg">
                    {member.name.charAt(0)}
                  </div>
                  <div>
                    <h3 className="font-bold text-slate-800">{member.name}</h3>
                    <p className="text-xs text-slate-500">{member.role}</p>
                  </div>
                </div>

                <div className="flex-1 w-full grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
                  <div className="p-3 bg-slate-50 rounded-lg">
                    <CheckSquare className="h-5 w-5 mx-auto text-blue-500 mb-1" />
                    <p className="text-xl font-bold text-slate-800">{tp.completedTasks}</p>
                    <p className="text-[10px] text-slate-500 uppercase font-medium">المهام المنجزة</p>
                  </div>
                  <div className="p-3 bg-slate-50 rounded-lg">
                    <Activity className="h-5 w-5 mx-auto text-amber-500 mb-1" />
                    <p className="text-xl font-bold text-slate-800">{tp.overdueTasks}</p>
                    <p className="text-[10px] text-slate-500 uppercase font-medium">المهام المتأخرة</p>
                  </div>
                  <div className="p-3 bg-slate-50 rounded-lg">
                    <Briefcase className="h-5 w-5 mx-auto text-purple-500 mb-1" />
                    <p className="text-xl font-bold text-slate-800">{tp.workload}</p>
                    <p className="text-[10px] text-slate-500 uppercase font-medium">المشاريع</p>
                  </div>
                  <div className="p-3 bg-primary/5 rounded-lg border border-primary/10">
                    <Star className="h-5 w-5 mx-auto text-primary mb-1" />
                    <p className="text-xl font-bold text-primary">{tp.completionRate}%</p>
                    <p className="text-[10px] text-primary uppercase font-bold">نقاط الأداء</p>
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
