import { useAppStore } from '../../store/useAppStore';
import { Badge } from '../ui/badge';
import { Link } from 'react-router-dom';
import { BookOpen, Bell } from 'lucide-react';

const ROLE_LABELS: Record<string, string> = {
  FOUNDER: 'مؤسس المشروع ورئيسه',
  LEADERSHIP: 'قيادة وتطوير المشروع',
  SCIENTIFIC: 'Scientific & Content Development',
  TECH: 'Technology & AI Lead',
  LEGAL: 'Legal & Strategic Advisory',
  GUEST: 'زائر',
};

const ROLE_COLORS: Record<string, string> = {
  FOUNDER: 'from-blue-600 to-indigo-700',
  LEADERSHIP: 'from-violet-600 to-purple-700',
  SCIENTIFIC: 'from-emerald-600 to-teal-700',
  TECH: 'from-amber-600 to-orange-700',
  LEGAL: 'from-slate-600 to-slate-700',
  GUEST: 'from-slate-600 to-slate-700',
};

export function WorkspaceHeader() {
  const { currentMember, currentUserRole, tasks } = useAppStore();
  const myPendingReview = tasks.filter(
    t => t.status === 'تنتظر المراجعة' && (currentUserRole === 'FOUNDER' || currentUserRole === 'LEADERSHIP')
  );
  const myOverdue = tasks.filter(
    t => t.owner === currentMember?.name && t.status !== 'مكتملة' && new Date(t.deadline) < new Date()
  );

  return (
    <div className={`rounded-2xl bg-gradient-to-l ${ROLE_COLORS[currentUserRole]} p-6 text-white mb-8 shadow-lg`}>
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="space-y-1">
          <div className="flex items-center gap-2 mb-1">
            <span className="text-white/60 text-xs font-mono uppercase tracking-widest">HARAKA Internal OS</span>
          </div>
          <h1 className="text-2xl font-bold">
            {currentMember?.name || 'مستخدم'}
          </h1>
          <p className="text-white/80 text-sm font-medium">
            {ROLE_LABELS[currentUserRole]}
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          {myPendingReview.length > 0 && (
            <Link to="/tasks">
              <div className="bg-white/15 hover:bg-white/25 transition-colors rounded-xl px-4 py-2 flex items-center gap-2 cursor-pointer border border-white/20">
                <Bell className="w-4 h-4" />
                <span className="text-sm font-semibold">{myPendingReview.length} تنتظر مراجعتك</span>
              </div>
            </Link>
          )}
          {myOverdue.length > 0 && (
            <div className="bg-red-500/30 border border-red-400/40 rounded-xl px-4 py-2 flex items-center gap-2">
              <span className="text-sm font-semibold">{myOverdue.length} مهام متأخرة</span>
            </div>
          )}
          <Link to="/company-profile">
            <div className="bg-white/10 hover:bg-white/20 transition-colors rounded-xl px-4 py-2 flex items-center gap-2 cursor-pointer border border-white/10">
              <BookOpen className="w-4 h-4" />
              <span className="text-sm">ملف حركة</span>
            </div>
          </Link>
        </div>
      </div>
    </div>
  );
}
