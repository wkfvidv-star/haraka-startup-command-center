import { useAppStore } from '../store';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Badge } from '../components/ui/badge';
import { CheckCircle2, Clock, Calendar, AlertTriangle, ShieldAlert, Rocket, Scale, HelpCircle, TrendingDown } from 'lucide-react';
import { isPast, format } from 'date-fns';
import { Link } from 'react-router-dom';

export function Today() {
  const {
    tasks, launchBlockers, risks, deliverables, decisions, incubationPhase, financialControl,
    governanceCalendar
  } = useAppStore();

  const overdueTasks = tasks.filter(t => t.status !== 'Done' && isPast(new Date(t.deadline)));
  const criticalOverdue = overdueTasks.filter(t => t.priority === 'P0 (Critical)');
  const highOverdue = overdueTasks.filter(t => t.priority === 'P1 (High)');
  
  const todayTasks = tasks.filter(t => t.status !== 'Done' && !isPast(new Date(t.deadline)) && new Date(t.deadline).toDateString() === new Date().toDateString());
  const blockedTasks = tasks.filter(t => t.status === 'Blocked');

  const activeBlockers = launchBlockers.filter(b => b.status !== 'Resolved');
  const activeHighRisks = risks.filter(r => r.status === 'Open' && (r.severity === 'Critical' || r.severity === 'High'));
  const pendingDecisions = decisions.filter(d => d.status === 'Open' || d.status === 'Under Review');

  return (
    <div className="space-y-6 max-w-screen-xl">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">أجندة اليوم</h1>
        <p className="text-sm text-muted-foreground">الأولويات العاجلة والعوائق النشطة.</p>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        {/* ACTION REQUIRED COLUMN */}
        <div className="space-y-6">
          
          {/* Critical Overdue & Blockers */}
          <Card className="border-red-500 bg-red-50/20">
            <CardHeader className="pb-2">
              <CardTitle className="text-lg flex items-center gap-2 text-destructive">
                <AlertTriangle className="h-5 w-5" /> قضايا حرجة
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {activeBlockers.filter(b => b.severity === 'Critical').map(b => (
                  <div key={b.id} className="p-3 bg-white rounded-lg border-r-4 border-r-destructive shadow-sm">
                    <div className="flex gap-2">
                      <Rocket className="h-4 w-4 text-destructive shrink-0 mt-0.5" />
                      <div>
                        <p className="text-sm font-semibold">{b.title} <Badge variant="destructive" className="mr-2 text-[9px] py-0">عائق</Badge></p>
                        <p className="text-xs text-muted-foreground mt-1">{b.owner} • {b.category}</p>
                      </div>
                    </div>
                  </div>
                ))}
                
                {criticalOverdue.map(t => (
                  <div key={t.id} className="p-3 bg-white rounded-lg border-r-4 border-r-destructive shadow-sm">
                    <div className="flex gap-2">
                      <Clock className="h-4 w-4 text-destructive shrink-0 mt-0.5" />
                      <div>
                        <p className="text-sm font-semibold">{t.title} <Badge variant="destructive" className="mr-2 text-[9px] py-0">مهمة</Badge></p>
                        <p className="text-xs text-muted-foreground mt-1">متأخرة منذ: {format(new Date(t.deadline), 'MMM d')}</p>
                      </div>
                    </div>
                  </div>
                ))}

                {activeBlockers.filter(b => b.severity === 'Critical').length === 0 && criticalOverdue.length === 0 && (
                  <p className="text-sm text-muted-foreground italic flex items-center gap-2">
                    <CheckCircle2 className="h-4 w-4 text-green-500" /> لا توجد عوائق تشغيلية حرجة.
                  </p>
                )}
              </div>
            </CardContent>
          </Card>

          {/* High Risks */}
          <Card className={activeHighRisks.length > 0 ? "border-amber-500 bg-amber-50/20" : ""}>
            <CardHeader className="pb-2">
              <CardTitle className="text-lg flex items-center gap-2 text-amber-600">
                <ShieldAlert className="h-5 w-5" /> مخاطر عالية الشدة
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {activeHighRisks.map(r => (
                  <div key={r.id} className="p-3 bg-white rounded-lg border-r-4 border-r-amber-500 shadow-sm">
                    <p className="text-sm font-semibold">{r.title}</p>
                    <p className="text-xs text-muted-foreground mt-1 line-clamp-1">{r.description}</p>
                    <div className="mt-2 text-xs font-medium text-amber-700">التخفيف: {r.mitigation}</div>
                  </div>
                ))}
                {activeHighRisks.length === 0 && (
                  <p className="text-sm text-muted-foreground italic">لا توجد مخاطر عالية نشطة.</p>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Pending Decisions */}
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-lg flex items-center gap-2 text-blue-600">
                <Scale className="h-5 w-5" /> قرارات مطلوبة
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {pendingDecisions.map(d => (
                  <div key={d.id} className="p-3 bg-muted/20 rounded-lg border">
                    <p className="text-sm font-semibold flex items-center gap-2">
                      <HelpCircle className="h-4 w-4 text-blue-500" /> {d.title}
                    </p>
                    <p className="text-xs text-muted-foreground mt-1">السياق: {d.description}</p>
                  </div>
                ))}
                {pendingDecisions.length === 0 && (
                  <p className="text-sm text-muted-foreground italic">لا توجد قرارات معلقة.</p>
                )}
              </div>
            </CardContent>
          </Card>

        </div>

        {/* SCHEDULE & PIPELINE COLUMN */}
        <div className="space-y-6">
          
          {/* Incubation Deadlines */}
          {incubationPhase && (
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-lg flex items-center gap-2">
                  <Calendar className="h-5 w-5 text-primary" /> الحاضنة والمراحل الرئيسية
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="mb-4">
                  <p className="text-xs font-semibold text-muted-foreground uppercase">المرحلة القادمة</p>
                  <p className="text-sm font-medium text-primary mt-1">{incubationPhase.nextMilestone}</p>
                </div>
                <div className="space-y-2">
                  <p className="text-xs font-semibold text-muted-foreground uppercase">التسليمات المعلقة</p>
                  {deliverables.filter(d => d.status !== 'Completed').map(d => (
                    <div key={d.id} className="flex justify-between items-center text-sm p-2 bg-muted/10 rounded">
                      <span>{d.title}</span>
                      <span className="text-xs text-muted-foreground">التسليم: {format(new Date(d.dueDate), 'MMM d')}</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}

          {/* High Priority Overdue & Due Today */}
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-lg flex items-center gap-2">
                <Clock className="h-5 w-5 text-muted-foreground" /> مسار التنفيذ
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {highOverdue.length > 0 && (
                  <div>
                    <p className="text-xs font-semibold text-destructive uppercase mb-2">أولوية عالية متأخرة ({highOverdue.length})</p>
                    <div className="space-y-2">
                      {highOverdue.map(t => (
                        <div key={t.id} className="text-sm p-2 bg-red-50/50 rounded border-r-2 border-red-300">{t.title}</div>
                      ))}
                    </div>
                  </div>
                )}
                {blockedTasks.length > 0 && (
                  <div>
                    <p className="text-xs font-semibold text-amber-600 uppercase mb-2">مهام محظورة ({blockedTasks.length})</p>
                    <div className="space-y-2">
                      {blockedTasks.map(t => (
                        <div key={t.id} className="text-sm p-2 bg-amber-50/50 rounded border-r-2 border-amber-300">{t.title}</div>
                      ))}
                    </div>
                  </div>
                )}
                <div>
                  <p className="text-xs font-semibold text-muted-foreground uppercase mb-2">تستحق اليوم ({todayTasks.length})</p>
                  <div className="space-y-2">
                    {todayTasks.map(t => (
                      <div key={t.id} className="text-sm p-2 bg-muted/20 rounded">{t.title}</div>
                    ))}
                    {todayTasks.length === 0 && <p className="text-sm text-muted-foreground italic">لا توجد مهام تستحق اليوم.</p>}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Phase 6: Governance Calendar */}
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-base flex items-center gap-2 text-purple-600">
                <Calendar className="h-5 w-5" /> تقويم الحوكمة
              </CardTitle>
            </CardHeader>
            <CardContent>
              {governanceCalendar.length > 0 ? (
                <ul className="space-y-3">
                  {governanceCalendar.slice(0, 3).map((entry, i) => (
                    <li key={i} className="flex gap-3 text-sm">
                      <div className="shrink-0 mt-0.5"><Clock className="h-4 w-4 text-purple-500" /></div>
                      <div className="flex-1">
                        <div className="flex justify-between items-start">
                          <span className="font-medium">{entry.title}</span>
                          <span className={`text-[10px] px-1.5 py-0.5 rounded border ${
                            entry.severity === 'Critical' ? 'bg-red-50 text-red-700 border-red-200' :
                            entry.severity === 'High' ? 'bg-orange-50 text-orange-700 border-orange-200' :
                            'bg-slate-50 text-slate-700 border-slate-200'
                          }`}>
                            {format(new Date(entry.date), 'dd MMM')}
                          </span>
                        </div>
                        <p className="text-xs text-muted-foreground mt-0.5">{entry.status}</p>
                      </div>
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="text-sm text-muted-foreground text-center py-2">لا توجد أحداث حوكمة قادمة.</p>
              )}
            </CardContent>
          </Card>

        </div>
      </div>

      {/* Phase 5 — Financial Actions */}
      {financialControl && financialControl.signals[0].severity !== 'Healthy' && (
        <Card className="border-amber-200 bg-amber-50/40">
          <CardHeader className="pb-3 border-b border-amber-200">
            <CardTitle className="text-base flex items-center gap-2 text-amber-800">
              <TrendingDown className="h-4 w-4" /> إجراءات مالية مقترحة — Financial Actions
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-4 space-y-3">
            {financialControl.signals
              .filter(s => s.severity !== 'Healthy')
              .map((sig, i) => (
                <div key={i} className={`flex items-start gap-3 p-3 rounded-lg border text-sm ${
                  sig.severity === 'Critical' ? 'bg-red-50 border-red-200 text-red-800' :
                  sig.severity === 'High' ? 'bg-orange-50 border-orange-200 text-orange-800' :
                  'bg-amber-50 border-amber-200 text-amber-800'
                }`}>
                  <ShieldAlert className="h-4 w-4 shrink-0 mt-0.5" />
                  <div>
                    <p className="font-bold text-xs">{sig.title}</p>
                    <p className="text-xs mt-0.5 opacity-90">{sig.message}</p>
                  </div>
                </div>
              ))
            }
            <div className="text-center pt-2">
              <Link to="/financial-control" className="text-xs text-primary hover:underline font-medium">
                عرض التحكم المالي الكامل ←
              </Link>
            </div>
            <p className="text-[10px] text-amber-600 text-center">هذه توصيات تلقائية من Rule Engine — ليست قرارات نهائية</p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
