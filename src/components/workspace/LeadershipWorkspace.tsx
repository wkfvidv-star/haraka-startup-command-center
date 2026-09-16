import { useAppStore } from '../../store/useAppStore';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Badge } from '../ui/badge';
import { WorkspaceHeader } from './WorkspaceHeader';
import { Link } from 'react-router-dom';
import { CheckSquare, Target, Globe, Zap, Users, ChevronLeft, Briefcase, Megaphone } from 'lucide-react';

const RESPONSIBILITIES = [
  { icon: Target, label: 'الاستراتيجية والتطوير', desc: 'تطوير فكرة حركة، نموذج العمل، دراسة الفرص' },
  { icon: Briefcase, label: 'تطوير المنتج', desc: 'دراسة الواجهات، اقتراح الوظائف، متابعة التطوير مع حمة' },
  { icon: Globe, label: 'السوق والمنافسين', desc: 'دراسة السوق، جمع معلومات العملاء، فرص الشراكة' },
  { icon: Megaphone, label: 'التسويق', desc: 'استراتيجية التسويق، المحتوى التجاري، قنوات التواصل' },
  { icon: Zap, label: 'R&D', desc: 'تحويل الأفكار إلى مشاريع، التنسيق مع الخبراء' },
  { icon: Users, label: 'الإدارة', desc: 'متابعة المهام والمشاريع، الاجتماعات، التقارير' },
];

export function LeadershipWorkspace() {
  const { currentMember, tasks, goals, projects } = useAppStore();

  const myTasks = tasks.filter(t => t.owner?.includes('رياض') || t.owner === currentMember?.name);
  const pendingTasks = myTasks.filter(t => t.status !== 'مكتملة');
  const needsActionTasks = myTasks.filter(t => t.status === 'تحتاج تعديلاً');

  return (
    <div className="space-y-8 max-w-screen-xl">
      <WorkspaceHeader />

      {/* تنبيه: مهام تحتاج تعديلاً */}
      {needsActionTasks.length > 0 && (
        <Card className="border-red-500/30 bg-red-500/5">
          <CardContent className="pt-4 pb-4 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />
              <span className="text-sm font-semibold text-red-400">
                {needsActionTasks.length} مهام تحتاج تعديلاً بناءً على ملاحظات رئيس المشروع
              </span>
            </div>
            <Link to="/tasks">
              <button className="text-xs text-red-400 border border-red-500/30 px-3 py-1.5 rounded-lg hover:bg-red-500/10 transition-colors flex items-center gap-1">
                عرض <ChevronLeft className="w-3 h-3" />
              </button>
            </Link>
          </CardContent>
        </Card>
      )}

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Column 1: المهام */}
        <div className="lg:col-span-2 space-y-6">
          <Card>
            <CardHeader className="pb-3 border-b">
              <div className="flex items-center justify-between">
                <CardTitle className="text-base flex items-center gap-2">
                  <CheckSquare className="w-5 h-5 text-primary" />
                  المهام الموكلة إليّ
                </CardTitle>
                <Link to="/tasks">
                  <Badge variant="outline" className="cursor-pointer hover:bg-slate-800 text-xs">
                    كل المهام
                  </Badge>
                </Link>
              </div>
            </CardHeader>
            <CardContent className="pt-4 space-y-2">
              {pendingTasks.length === 0 ? (
                <div className="py-12 text-center">
                  <CheckSquare className="w-10 h-10 text-slate-700 mx-auto mb-3" />
                  <p className="text-slate-500 text-sm">لا توجد مهام معلقة حالياً.</p>
                </div>
              ) : (
                pendingTasks.slice(0, 6).map(task => (
                  <div key={task.id} className="flex items-center justify-between p-3 rounded-lg bg-slate-900/50 border border-slate-800 hover:border-primary/30 transition-colors">
                    <div className="space-y-0.5 min-w-0">
                      <p className="font-medium text-sm text-slate-200 truncate">{task.title}</p>
                      <p className="text-xs text-slate-500">{task.category} · {new Date(task.deadline).toLocaleDateString('ar-DZ')}</p>
                    </div>
                    <Badge variant={task.status === 'تحتاج تعديلاً' ? 'destructive' : task.status === 'مكتملة' ? 'success' : 'outline'} className="shrink-0 mr-2 text-xs">
                      {task.status}
                    </Badge>
                  </div>
                ))
              )}
            </CardContent>
          </Card>
        </div>

        {/* Column 2: المسؤوليات */}
        <div className="space-y-4">
          <Card>
            <CardHeader className="pb-3 border-b">
              <CardTitle className="text-sm font-bold text-slate-400 uppercase tracking-wider">دوري ومسؤولياتي</CardTitle>
            </CardHeader>
            <CardContent className="pt-4 space-y-3">
              {RESPONSIBILITIES.map((r, i) => {
                const Icon = r.icon;
                return (
                  <div key={i} className="flex items-start gap-3">
                    <div className="w-7 h-7 rounded-lg bg-primary/10 flex items-center justify-center shrink-0 mt-0.5">
                      <Icon className="w-3.5 h-3.5 text-primary" />
                    </div>
                    <div>
                      <p className="text-xs font-semibold text-slate-300">{r.label}</p>
                      <p className="text-[11px] text-slate-500 leading-relaxed">{r.desc}</p>
                    </div>
                  </div>
                );
              })}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
