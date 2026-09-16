import { useAppStore } from '../../store/useAppStore';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Badge } from '../ui/badge';
import { WorkspaceHeader } from './WorkspaceHeader';
import { Link } from 'react-router-dom';
import {
  CheckSquare, ChevronLeft, Microscope, Activity, BookOpen,
  Brain, HeartPulse, FlaskConical, Lightbulb, ClipboardList
} from 'lucide-react';

const RESPONSIBILITIES = [
  { icon: Activity, label: 'المحتوى الرياضي', desc: 'التمارين، الاختبارات، معايير الأداء، الأخطاء الشائعة' },
  { icon: BookOpen, label: 'المحتوى التربوي', desc: 'التربية البدنية، احتياجات التلميذ والأستاذ، الكفاءات' },
  { icon: ClipboardList, label: 'التقييم الحركي', desc: 'الاختبارات، المؤشرات، مستويات الأداء، تفسير النتائج' },
  { icon: Brain, label: 'الأداء النفسي والمعرفي', desc: 'التركيز، الانتباه، سرعة الاستجابة، الدافعية' },
  { icon: HeartPulse, label: 'إعادة التأهيل', desc: 'المجالات الداعمة، حدود الاستخدام، متى يُحال المستخدم لمختص' },
  { icon: Lightbulb, label: 'الاقتراحات العلمية', desc: 'تحديد اقتراحات تطوير المنصة بأساس علمي' },
];

export function ScientificWorkspace() {
  const { currentMember, tasks } = useAppStore();

  const myTasks = tasks.filter(t =>
    t.owner?.includes('حسين') || t.owner?.includes('مختار') || t.owner === currentMember?.name
  );
  const pendingTasks = myTasks.filter(t => t.status !== 'مكتملة');
  const needsActionTasks = myTasks.filter(t => t.status === 'تحتاج تعديلاً');

  return (
    <div className="space-y-8 max-w-screen-xl">
      <WorkspaceHeader />

      {needsActionTasks.length > 0 && (
        <Card className="border-red-500/30 bg-red-500/5">
          <CardContent className="pt-4 pb-4 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />
              <span className="text-sm font-semibold text-red-400">
                {needsActionTasks.length} مهام تحتاج تعديلاً
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
        <div className="lg:col-span-2 space-y-6">
          {/* المهام الموكلة */}
          <Card>
            <CardHeader className="pb-3 border-b">
              <div className="flex items-center justify-between">
                <CardTitle className="text-base flex items-center gap-2">
                  <CheckSquare className="w-5 h-5 text-emerald-500" />
                  المهام الموكلة إليّ
                </CardTitle>
                <Link to="/tasks">
                  <Badge variant="outline" className="cursor-pointer hover:bg-slate-800 text-xs">كل المهام</Badge>
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
                  <div key={task.id} className="flex items-center justify-between p-3 rounded-lg bg-slate-900/50 border border-slate-800 hover:border-emerald-500/30 transition-colors">
                    <div className="space-y-0.5 min-w-0">
                      <p className="font-medium text-sm text-slate-200 truncate">{task.title}</p>
                      <p className="text-xs text-slate-500">{task.category} · {new Date(task.deadline).toLocaleDateString('ar-DZ')}</p>
                    </div>
                    <Badge variant={task.status === 'تحتاج تعديلاً' ? 'destructive' : 'outline'} className="shrink-0 mr-2 text-xs">
                      {task.status}
                    </Badge>
                  </div>
                ))
              )}
            </CardContent>
          </Card>

          {/* الاقتراحات العلمية */}
          <Card className="border-emerald-500/20 bg-emerald-500/5">
            <CardHeader className="pb-3 border-b border-emerald-500/10">
              <CardTitle className="text-base flex items-center gap-2 text-emerald-400">
                <Lightbulb className="w-5 h-5" />
                الاقتراحات العلمية
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-4">
              <div className="rounded-xl border-2 border-dashed border-emerald-500/20 p-8 text-center">
                <Lightbulb className="w-10 h-10 text-emerald-700 mx-auto mb-3" />
                <p className="text-slate-400 text-sm mb-2">هل لديك اقتراح علمي لتطوير المنصة؟</p>
                <p className="text-xs text-slate-600 mb-4">
                  الاقتراح العلمي يتحول إلى: Decision → Project → Task
                </p>
                <Link to="/decisions">
                  <button className="px-4 py-2 text-sm bg-emerald-600/20 hover:bg-emerald-600/30 text-emerald-400 border border-emerald-500/30 rounded-lg transition-colors">
                    إضافة اقتراح علمي
                  </button>
                </Link>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* المسؤوليات */}
        <div>
          <Card>
            <CardHeader className="pb-3 border-b">
              <CardTitle className="text-sm font-bold text-slate-400 uppercase tracking-wider">دوري ومسؤولياتي</CardTitle>
            </CardHeader>
            <CardContent className="pt-4 space-y-3">
              {RESPONSIBILITIES.map((r, i) => {
                const Icon = r.icon;
                return (
                  <div key={i} className="flex items-start gap-3">
                    <div className="w-7 h-7 rounded-lg bg-emerald-500/10 flex items-center justify-center shrink-0 mt-0.5">
                      <Icon className="w-3.5 h-3.5 text-emerald-400" />
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
