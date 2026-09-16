import { useAppStore } from '../../store/useAppStore';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Badge } from '../ui/badge';
import { WorkspaceHeader } from './WorkspaceHeader';
import { Link } from 'react-router-dom';
import {
  CheckSquare, Clock, AlertCircle, Eye, Users, ChevronLeft,
  HeartPulse, Target, DollarSign, Package
} from 'lucide-react';

const MEMBER_NAMES = [
  { name: 'نصير رياض', role: 'القيادة والتطوير' },
  { name: 'جاب الله حسين', role: 'Scientific & Content' },
  { name: 'حاج مختار', role: 'Scientific & Content' },
  { name: 'سلطاني حمة', role: 'Technology & AI' },
  { name: 'يوسف نصير', role: 'Legal & Advisory' },
];

export function FounderWorkspace() {
  const { tasks, config, financeSummary, productReadinessPct } = useAppStore();

  // Build per-member stats
  const memberStats = MEMBER_NAMES.map(m => {
    const memberTasks = tasks.filter(t => t.owner?.includes(m.name.split(' ')[0]) || t.owner === m.name);
    const inProgress = memberTasks.filter(t => t.status === 'قيد التنفيذ').length;
    const pendingReview = memberTasks.filter(t => t.status === 'تنتظر المراجعة').length;
    const overdue = memberTasks.filter(t => t.status !== 'مكتملة' && new Date(t.deadline) < new Date()).length;
    return { ...m, total: memberTasks.length, inProgress, pendingReview, overdue };
  });

  const pendingReviewTasks = tasks.filter(t => t.status === 'تنتظر المراجعة');
  const criticalTasks = tasks.filter(t => t.priority === 'حرجة' && t.status !== 'مكتملة');

  return (
    <div className="space-y-8 max-w-screen-xl">
      <WorkspaceHeader />

      {/* === مهام تنتظر موافقتي === */}
      {pendingReviewTasks.length > 0 && (
        <Card className="border-purple-500/30 bg-purple-500/5">
          <CardHeader className="pb-3 border-b border-purple-500/10">
            <CardTitle className="text-base flex items-center gap-2 text-purple-400">
              <Eye className="w-5 h-5" />
              مهام تنتظر موافقتك ({pendingReviewTasks.length})
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-4 space-y-3">
            {pendingReviewTasks.slice(0, 5).map(task => (
              <div key={task.id} className="flex items-center justify-between p-3 rounded-lg bg-slate-900/60 border border-slate-800 hover:border-purple-500/30 transition-colors">
                <div className="space-y-0.5">
                  <p className="font-medium text-sm text-slate-200">{task.title}</p>
                  <p className="text-xs text-slate-500">{task.owner} · {task.category}</p>
                </div>
                <Link to="/tasks">
                  <button className="flex items-center gap-1 text-xs text-purple-400 hover:text-purple-300 border border-purple-500/30 hover:border-purple-400 px-3 py-1.5 rounded-lg transition-colors">
                    مراجعة <ChevronLeft className="w-3 h-3" />
                  </button>
                </Link>
              </div>
            ))}
            {pendingReviewTasks.length > 5 && (
              <Link to="/tasks" className="text-xs text-slate-500 hover:text-primary block text-center pt-1">
                + {pendingReviewTasks.length - 5} مهام أخرى
              </Link>
            )}
          </CardContent>
        </Card>
      )}

      {/* === جدول متابعة الفريق === */}
      <Card>
        <CardHeader className="pb-3 border-b">
          <CardTitle className="text-base flex items-center gap-2">
            <Users className="w-5 h-5 text-primary" />
            متابعة الفريق
          </CardTitle>
        </CardHeader>
        <CardContent className="pt-0">
          <div className="overflow-x-auto">
            <table className="w-full text-sm text-right">
              <thead>
                <tr className="border-b border-slate-800">
                  {['العضو', 'الدور', 'إجمالي المهام', 'قيد التنفيذ', 'تنتظر المراجعة', 'متأخرة'].map(h => (
                    <th key={h} className="py-3 px-4 text-xs font-semibold text-slate-500 uppercase tracking-wide">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/50">
                {memberStats.map((m, i) => (
                  <tr key={i} className="hover:bg-slate-800/30 transition-colors">
                    <td className="py-3 px-4 font-semibold text-slate-200">{m.name}</td>
                    <td className="py-3 px-4 text-xs text-slate-500">{m.role}</td>
                    <td className="py-3 px-4 text-slate-300">{m.total || '—'}</td>
                    <td className="py-3 px-4">
                      {m.inProgress > 0 ? <Badge variant="warning">{m.inProgress}</Badge> : <span className="text-slate-600">0</span>}
                    </td>
                    <td className="py-3 px-4">
                      {m.pendingReview > 0 ? <Badge variant="default">{m.pendingReview}</Badge> : <span className="text-slate-600">0</span>}
                    </td>
                    <td className="py-3 px-4">
                      {m.overdue > 0 ? <Badge variant="destructive">{m.overdue}</Badge> : <span className="text-emerald-600 text-xs">✓</span>}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      {/* === حالة الشركة السريعة === */}
      <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 md:grid-cols-3">
        <Card>
          <CardContent className="pt-5 flex items-center gap-4">
            <div className="w-10 h-10 rounded-xl bg-blue-500/10 flex items-center justify-center">
              <HeartPulse className="w-5 h-5 text-blue-400" />
            </div>
            <div>
              <p className="text-xs text-slate-500 mb-0.5">صحة الشركة</p>
              <p className="text-xl font-bold">{config?.startupHealthScore ?? '—'}/100</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-5 flex items-center gap-4">
            <div className="w-10 h-10 rounded-xl bg-emerald-500/10 flex items-center justify-center">
              <Package className="w-5 h-5 text-emerald-400" />
            </div>
            <div>
              <p className="text-xs text-slate-500 mb-0.5">جاهزية المنتج</p>
              <p className="text-xl font-bold">{productReadinessPct ?? 0}%</p>
            </div>
          </CardContent>
        </Card>
        <Card className="sm:col-span-2 md:col-span-1">
          <CardContent className="pt-5 flex items-center gap-4">
            <div className="w-10 h-10 rounded-xl bg-red-500/10 flex items-center justify-center">
              <AlertCircle className="w-5 h-5 text-red-400" />
            </div>
            <div>
              <p className="text-xs text-slate-500 mb-0.5">مهام حرجة</p>
              <p className="text-xl font-bold text-red-400">{criticalTasks.length}</p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* === المهام الحرجة === */}
      {criticalTasks.length > 0 && (
        <Card className="border-red-500/20 bg-red-500/5">
          <CardHeader className="pb-3 border-b border-red-500/10">
            <CardTitle className="text-base flex items-center gap-2 text-red-400">
              <AlertCircle className="w-5 h-5" />
              المهام الحرجة ({criticalTasks.length})
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-4 space-y-2">
            {criticalTasks.slice(0, 5).map(task => (
              <div key={task.id} className="flex items-center justify-between p-3 rounded-lg bg-slate-900/60 border border-red-900/30">
                <div>
                  <p className="font-medium text-sm text-slate-200">{task.title}</p>
                  <p className="text-xs text-slate-500">{task.owner} · {new Date(task.deadline).toLocaleDateString('ar-DZ')}</p>
                </div>
                <Badge variant="destructive" className="shrink-0">{task.status}</Badge>
              </div>
            ))}
          </CardContent>
        </Card>
      )}
    </div>
  );
}
