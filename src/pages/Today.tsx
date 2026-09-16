import { useAppStore } from '../store';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Badge } from '../components/ui/badge';
import { CheckCircle2, Clock, Calendar, AlertTriangle, ShieldAlert, Rocket, ArrowRight, XCircle } from 'lucide-react';
import { isPast, isToday, isTomorrow, isFuture, format } from 'date-fns';

export function Today() {
  const { tasks, launchBlockers, risks, deliverables } = useAppStore();

  // 1. Critical (Overdue P0, Critical Blockers, Critical Risks)
  const criticalTasks = tasks.filter(t => t.status !== 'مكتملة' && (t.priority === 'حرجة' || t.priority === 'عالية') && isPast(new Date(t.deadline)));
  const criticalBlockers = launchBlockers.filter(b => b.status !== 'Resolved' && b.severity === 'Critical');
  const criticalRisks = risks.filter(r => r.status === 'Open' && r.severity === 'Critical');

  // 2. High Priority (Due today or High priority not yet due but urgent)
  const highPriorityTasks = tasks.filter(t => t.status !== 'مكتملة' && (t.priority === 'عالية') && !isPast(new Date(t.deadline)) && (isToday(new Date(t.deadline)) || isTomorrow(new Date(t.deadline))));

  // 3. Due Today
  const dueTodayTasks = tasks.filter(t => t.status !== 'مكتملة' && t.priority !== 'حرجة' && t.priority !== 'عالية' && isToday(new Date(t.deadline)));
  const dueTodayDeliverables = deliverables.filter(d => d.status !== 'Completed' && isToday(new Date(d.dueDate)));

  // 4. Blocked
  const blockedTasks = tasks.filter(t => t.status === 'تحتاج تعديلاً');
  
  // 5. Next Actions (In Progress or selected next tasks)
  const nextActions = tasks.filter(t => t.status === 'قيد التنفيذ');

  // 6. Upcoming (Due tomorrow or soon)
  const upcomingTasks = tasks.filter(t => t.status !== 'مكتملة' && isFuture(new Date(t.deadline)) && !isToday(new Date(t.deadline))).slice(0, 5);

  return (
    <div className="space-y-6 max-w-screen-xl">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">اليوم (Today)</h1>
        <p className="text-sm text-muted-foreground">أداة التنفيذ اليومية - مرتبة حسب الأولوية المطلقة.</p>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        {/* ACTION REQUIRED COLUMN */}
        <div className="space-y-6">
          
          {/* 1. Critical */}
          <Card className="border-red-500 bg-red-50/20">
            <CardHeader className="pb-2">
              <CardTitle className="text-lg flex items-center gap-2 text-destructive">
                <AlertTriangle className="h-5 w-5" /> 🔴 قضايا حرجة (يجب التدخل الآن)
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {criticalBlockers.map(b => (
                  <div key={b.id} className="p-3 bg-white rounded-lg border-r-4 border-r-destructive shadow-sm">
                    <div className="flex justify-between items-start">
                      <div className="flex gap-2">
                        <Rocket className="h-4 w-4 text-destructive shrink-0 mt-0.5" />
                        <div>
                          <p className="text-sm font-semibold">{b.title} <Badge variant="destructive" className="mr-2 text-[9px] py-0">عائق إطلاق</Badge></p>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
                {criticalRisks.map(r => (
                  <div key={r.id} className="p-3 bg-white rounded-lg border-r-4 border-r-destructive shadow-sm">
                    <div className="flex justify-between items-start">
                      <div className="flex gap-2">
                        <ShieldAlert className="h-4 w-4 text-destructive shrink-0 mt-0.5" />
                        <div>
                          <p className="text-sm font-semibold">{r.title} <Badge variant="destructive" className="mr-2 text-[9px] py-0">خطر حرج</Badge></p>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
                {criticalTasks.map(t => (
                  <div key={t.id} className="p-3 bg-white rounded-lg border-r-4 border-r-destructive shadow-sm">
                    <div className="flex justify-between items-start">
                      <div className="flex gap-2">
                        <Clock className="h-4 w-4 text-destructive shrink-0 mt-0.5" />
                        <div>
                          <p className="text-sm font-semibold">{t.title} <Badge variant="destructive" className="mr-2 text-[9px] py-0">مهمة متأخرة</Badge></p>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
                {(criticalBlockers.length === 0 && criticalRisks.length === 0 && criticalTasks.length === 0) && (
                  <p className="text-sm text-muted-foreground italic flex items-center gap-2">
                    <CheckCircle2 className="h-4 w-4 text-green-500" /> لا توجد تدخلات حرجة مطلوبة الآن.
                  </p>
                )}
              </div>
            </CardContent>
          </Card>

          {/* 2. High Priority */}
          <Card className={(highPriorityTasks.length > 0) ? "border-orange-500 bg-orange-50/20" : ""}>
            <CardHeader className="pb-2">
              <CardTitle className="text-lg flex items-center gap-2 text-orange-600">
                <AlertTriangle className="h-5 w-5" /> 🟠 أولوية عالية (يجب إنجازها اليوم)
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {highPriorityTasks.map(t => (
                  <div key={t.id} className="p-3 bg-white rounded-lg border-r-4 border-r-orange-500 shadow-sm">
                    <p className="text-sm font-semibold">{t.title}</p>
                    <p className="text-xs text-muted-foreground mt-1">المالك: {t.owner}</p>
                  </div>
                ))}
                {highPriorityTasks.length === 0 && (
                  <p className="text-sm text-muted-foreground italic">لا توجد مهام ذات أولوية عالية لليوم.</p>
                )}
              </div>
            </CardContent>
          </Card>

          {/* 4. Blocked */}
          <Card className={blockedTasks.length > 0 ? "border-slate-400 bg-slate-100/50" : ""}>
            <CardHeader className="pb-2">
              <CardTitle className="text-lg flex items-center gap-2 text-slate-700">
                <XCircle className="h-5 w-5" /> ⚫ مهام محظورة (تمنع التقدم)
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {blockedTasks.map(t => (
                  <div key={t.id} className="p-3 bg-white rounded-lg border-r-4 border-r-slate-500 shadow-sm">
                    <p className="text-sm font-semibold line-through text-slate-500">{t.title}</p>
                    <p className="text-xs text-slate-400 mt-1">محظورة - تحتاج إلى تدخل لحلها.</p>
                  </div>
                ))}
                {blockedTasks.length === 0 && (
                  <p className="text-sm text-muted-foreground italic">لا توجد مهام محظورة.</p>
                )}
              </div>
            </CardContent>
          </Card>

        </div>

        {/* SCHEDULE & PIPELINE COLUMN */}
        <div className="space-y-6">
          
          {/* 3. Due Today */}
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-lg flex items-center gap-2">
                <Clock className="h-5 w-5 text-amber-500" /> 🟡 تستحق اليوم
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {dueTodayTasks.map(t => (
                  <div key={t.id} className="p-3 bg-muted/20 rounded-lg border">
                    <p className="text-sm font-medium">{t.title}</p>
                  </div>
                ))}
                {dueTodayDeliverables.map(d => (
                  <div key={d.id} className="p-3 bg-muted/20 rounded-lg border border-primary/20">
                    <p className="text-sm font-medium">{d.title} <Badge variant="outline" className="text-[9px]">تسليم حاضنة</Badge></p>
                  </div>
                ))}
                {(dueTodayTasks.length === 0 && dueTodayDeliverables.length === 0) && (
                  <p className="text-sm text-muted-foreground italic">لا توجد أعمال اعتيادية تستحق اليوم.</p>
                )}
              </div>
            </CardContent>
          </Card>

          {/* 5. Next Actions */}
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-lg flex items-center gap-2">
                <ArrowRight className="h-5 w-5 text-blue-500" /> ➡️ الإجراءات التالية (قيد التنفيذ)
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {nextActions.map(t => (
                  <div key={t.id} className="p-3 bg-blue-50/50 rounded-lg border border-blue-100">
                    <p className="text-sm font-medium text-blue-900">{t.title}</p>
                  </div>
                ))}
                {nextActions.length === 0 && (
                  <p className="text-sm text-muted-foreground italic">لا توجد مهام قيد التنفيذ حالياً.</p>
                )}
              </div>
            </CardContent>
          </Card>

          {/* 6. Upcoming */}
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-lg flex items-center gap-2">
                <Calendar className="h-5 w-5 text-muted-foreground" /> غداً / قريباً
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {upcomingTasks.map(t => (
                  <div key={t.id} className="flex justify-between items-center text-sm p-2 bg-muted/10 rounded">
                    <span className="truncate pr-2">{t.title}</span>
                    <span className="text-[10px] text-muted-foreground shrink-0">{format(new Date(t.deadline), 'MMM d')}</span>
                  </div>
                ))}
                {upcomingTasks.length === 0 && (
                  <p className="text-sm text-muted-foreground italic">لا توجد مهام قادمة قريباً.</p>
                )}
              </div>
            </CardContent>
          </Card>

        </div>
      </div>
    </div>
  );
}
