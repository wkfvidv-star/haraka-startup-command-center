import { useAppStore } from '../../store/useAppStore';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Badge } from '../ui/badge';
import { WorkspaceHeader } from './WorkspaceHeader';
import { Link } from 'react-router-dom';
import {
  CheckSquare, ChevronLeft, Layers, Server, Database,
  Cpu, Brain, Video, Activity, BarChart2, FlaskConical, Wrench
} from 'lucide-react';

const TECH_AREAS = [
  {
    title: 'تطوير المنصة',
    color: 'amber',
    items: [
      { icon: Layers, label: 'Frontend & UI' },
      { icon: Server, label: 'Backend & APIs' },
      { icon: Database, label: 'Database & Supabase' },
      { icon: Cpu, label: 'Infrastructure & DevOps' },
    ],
  },
  {
    title: 'AI & Computer Vision',
    color: 'orange',
    items: [
      { icon: Brain, label: 'AI & نماذج التعلم الآلي' },
      { icon: Video, label: 'Computer Vision' },
      { icon: Activity, label: 'Pose Estimation & MediaPipe' },
      { icon: BarChart2, label: 'تحليل البيانات' },
    ],
  },
];

export function TechWorkspace() {
  const { currentMember, tasks } = useAppStore();

  const myTasks = tasks.filter(t =>
    t.owner?.includes('حمة') || t.owner?.includes('سلطاني') || t.owner === currentMember?.name
  );
  const pendingTasks = myTasks.filter(t => t.status !== 'مكتملة');
  const needsActionTasks = myTasks.filter(t => t.status === 'تحتاج تعديلاً');
  const techProblems = tasks.filter(t => t.category?.includes('تقني') && t.status !== 'مكتملة');

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
          {/* المهام */}
          <Card>
            <CardHeader className="pb-3 border-b">
              <div className="flex items-center justify-between">
                <CardTitle className="text-base flex items-center gap-2">
                  <CheckSquare className="w-5 h-5 text-amber-500" />
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
                  <div key={task.id} className="flex items-center justify-between p-3 rounded-lg bg-slate-900/50 border border-slate-800 hover:border-amber-500/30 transition-colors">
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

          {/* مجالات التقنية */}
          <div className="grid gap-4 md:grid-cols-2">
            {TECH_AREAS.map((area, idx) => (
              <Card key={idx} className={`border-${area.color}-500/20`}>
                <CardHeader className="pb-2 pt-4 px-4">
                  <CardTitle className={`text-sm text-${area.color}-400`}>{area.title}</CardTitle>
                </CardHeader>
                <CardContent className="px-4 pb-4 space-y-2">
                  {area.items.map((item, i) => {
                    const Icon = item.icon;
                    return (
                      <div key={i} className="flex items-center gap-2 text-xs text-slate-400">
                        <Icon className={`w-3.5 h-3.5 text-${area.color}-600`} />
                        <span>{item.label}</span>
                      </div>
                    );
                  })}
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* اللوغ الجانبي */}
        <div className="space-y-4">
          <Card>
            <CardHeader className="pb-3 border-b">
              <CardTitle className="text-sm font-bold text-slate-400 uppercase tracking-wider">دوري ومسؤولياتي</CardTitle>
            </CardHeader>
            <CardContent className="pt-4 space-y-3 text-xs text-slate-400 leading-relaxed">
              <p>مسؤول عن بناء المنصة تقنياً بالكامل: Frontend, Backend, Database, APIs.</p>
              <p>تطوير وتجربة حلول الذكاء الاصطناعي وـ Computer Vision مع MediaPipe وOpenCV.</p>
              <p>إجراء التجارب التقنية وتوثيق النتائج.</p>
              <p>تحديد الإمكانيات التقنية وحدود ما يمكن تنفيذه.</p>
              <p>الاستضافة، الأمان، النسخ الاحتياطية.</p>
            </CardContent>
          </Card>

          {techProblems.length > 0 && (
            <Card className="border-red-900/30">
              <CardHeader className="pb-3 border-b">
                <CardTitle className="text-sm flex items-center gap-2 text-red-400">
                  <Wrench className="w-4 h-4" /> مشاكل تقنية ({techProblems.length})
                </CardTitle>
              </CardHeader>
              <CardContent className="pt-3 space-y-2">
                {techProblems.slice(0, 3).map(t => (
                  <p key={t.id} className="text-xs text-slate-400 border-r-2 border-red-600 pr-2">{t.title}</p>
                ))}
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}
