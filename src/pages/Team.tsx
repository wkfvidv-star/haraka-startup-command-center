import { useState } from 'react';
import { useAppStore } from '../store';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Badge } from '../components/ui/badge';
import { Users, CheckSquare, Clock, AlertCircle, Eye, ChevronDown, ChevronUp } from 'lucide-react';
import { isPast } from 'date-fns';

const HARAKA_TEAM = [
  {
    name: 'عبد الباسط نصير',
    role: 'Founder & Project President',
    roleAr: 'مؤسس المشروع ورئيسه',
    department: 'القيادة',
    color: 'from-blue-600 to-indigo-700',
    initials: 'ع',
  },
  {
    name: 'نصير رياض',
    role: 'Leadership & Project Development',
    roleAr: 'قيادة وتطوير المشروع',
    department: 'القيادة',
    color: 'from-violet-600 to-purple-700',
    initials: 'ر',
  },
  {
    name: 'جاب الله حسين',
    role: 'Scientific & Content Development',
    roleAr: 'خبير علمي وتربوي',
    department: 'الخبرة العلمية',
    color: 'from-emerald-600 to-teal-700',
    initials: 'ح',
  },
  {
    name: 'حاج مختار',
    role: 'Scientific & Content Development',
    roleAr: 'خبير علمي وتربوي',
    department: 'الخبرة العلمية',
    color: 'from-emerald-600 to-teal-700',
    initials: 'م',
  },
  {
    name: 'سلطاني حمة',
    role: 'Technology & AI Lead',
    roleAr: 'مسؤول التكنولوجيا والذكاء الاصطناعي',
    department: 'التكنولوجيا',
    color: 'from-amber-600 to-orange-700',
    initials: 'ح',
  },
  {
    name: 'يوسف نصير',
    role: 'Legal & Strategic Advisory',
    roleAr: 'المستشار القانوني والاستراتيجي',
    department: 'القانون والاستشارات',
    color: 'from-slate-600 to-slate-700',
    initials: 'ي',
  },
];

export function Team() {
  const { tasks, currentUserRole } = useAppStore();
  const [expandedMember, setExpandedMember] = useState<string | null>(null);

  const isFounder = currentUserRole === 'FOUNDER' || currentUserRole === 'LEADERSHIP';

  const getMemberTaskStats = (memberName: string) => {
    const memberTasks = tasks.filter(t =>
      t.owner === memberName ||
      t.owner?.includes(memberName.split(' ')[0]) ||
      t.owner?.includes(memberName.split(' ')[1] ?? '')
    );
    return {
      all: memberTasks,
      total: memberTasks.length,
      inProgress: memberTasks.filter(t => t.status === 'قيد التنفيذ').length,
      pendingReview: memberTasks.filter(t => t.status === 'تنتظر المراجعة').length,
      needsEdit: memberTasks.filter(t => t.status === 'تحتاج تعديلاً').length,
      done: memberTasks.filter(t => t.status === 'مكتملة').length,
      overdue: memberTasks.filter(t => t.status !== 'مكتملة' && isPast(new Date(t.deadline))).length,
      active: memberTasks.filter(t => t.status !== 'مكتملة'),
    };
  };

  // Group by department
  const departments: Record<string, typeof HARAKA_TEAM> = {};
  HARAKA_TEAM.forEach(m => {
    if (!departments[m.department]) departments[m.department] = [];
    departments[m.department].push(m);
  });

  return (
    <div className="space-y-8 max-w-screen-xl">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">الفريق</h1>
        <p className="text-sm text-muted-foreground mt-1">فريق HARAKA — الهيكل الرسمي للشركة</p>
      </div>

      {/* Founder's tracking table */}
      {isFounder && (
        <Card>
          <CardHeader className="pb-3 border-b">
            <CardTitle className="text-base flex items-center gap-2">
              <Users className="w-5 h-5 text-primary" />
              متابعة مهام الفريق
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-0">
            <div className="overflow-x-auto">
              <table className="w-full text-sm text-right">
                <thead>
                  <tr className="border-b border-slate-800">
                    {['العضو', 'الدور', 'إجمالي', 'قيد التنفيذ', 'تنتظر المراجعة', 'تحتاج تعديلاً', 'مكتملة', 'متأخرة'].map(h => (
                      <th key={h} className="py-3 px-3 text-[11px] font-semibold text-slate-500 uppercase tracking-wide whitespace-nowrap">{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/40">
                  {HARAKA_TEAM.filter(m => m.name !== 'عبد الباسط نصير').map(member => {
                    const stats = getMemberTaskStats(member.name);
                    return (
                      <tr key={member.name} className="hover:bg-slate-800/20 transition-colors">
                        <td className="py-3 px-3 font-semibold text-slate-200 whitespace-nowrap">{member.name}</td>
                        <td className="py-3 px-3 text-[11px] text-slate-500 whitespace-nowrap">{member.roleAr}</td>
                        <td className="py-3 px-3 text-slate-400">{stats.total || '—'}</td>
                        <td className="py-3 px-3">
                          {stats.inProgress > 0 ? <Badge variant="warning">{stats.inProgress}</Badge> : <span className="text-slate-700 text-xs">0</span>}
                        </td>
                        <td className="py-3 px-3">
                          {stats.pendingReview > 0 ? <Badge>{stats.pendingReview}</Badge> : <span className="text-slate-700 text-xs">0</span>}
                        </td>
                        <td className="py-3 px-3">
                          {stats.needsEdit > 0 ? <Badge variant="destructive">{stats.needsEdit}</Badge> : <span className="text-slate-700 text-xs">0</span>}
                        </td>
                        <td className="py-3 px-3">
                          {stats.done > 0 ? <Badge variant="success">{stats.done}</Badge> : <span className="text-slate-700 text-xs">0</span>}
                        </td>
                        <td className="py-3 px-3">
                          {stats.overdue > 0 ? <Badge variant="destructive">{stats.overdue}</Badge> : <span className="text-emerald-600 text-xs">✓</span>}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Team Cards by Department */}
      {Object.entries(departments).map(([dept, members]) => (
        <div key={dept} className="space-y-3">
          <h2 className="text-sm font-bold text-slate-500 uppercase tracking-widest border-b border-slate-800/60 pb-2">{dept}</h2>
          <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
            {members.map(member => {
              const stats = getMemberTaskStats(member.name);
              const isExpanded = expandedMember === member.name;

              return (
                <Card key={member.name} className="overflow-hidden hover:shadow-lg transition-shadow">
                  {/* Gradient Header */}
                  <div className={`h-2 w-full bg-gradient-to-l ${member.color}`} />

                  <CardContent className="p-5">
                    <div className="flex items-start gap-4">
                      {/* Avatar */}
                      <div className={`w-12 h-12 rounded-2xl bg-gradient-to-br ${member.color} flex items-center justify-center text-white font-bold text-lg shrink-0 shadow-lg`}>
                        {member.initials}
                      </div>

                      <div className="flex-1 min-w-0">
                        <h3 className="font-bold text-slate-100 truncate">{member.name}</h3>
                        <p className="text-xs text-slate-400 mt-0.5">{member.role}</p>
                        <p className="text-[11px] text-slate-600 mt-0.5">{member.roleAr}</p>
                      </div>
                    </div>

                    {/* Task Stats */}
                    {isFounder && stats.total > 0 && (
                      <div className="mt-4 pt-4 border-t border-slate-800/60">
                        <div className="flex items-center gap-3 flex-wrap">
                          {stats.inProgress > 0 && (
                            <div className="flex items-center gap-1 text-xs text-amber-400">
                              <Clock className="w-3 h-3" /> {stats.inProgress} قيد التنفيذ
                            </div>
                          )}
                          {stats.pendingReview > 0 && (
                            <div className="flex items-center gap-1 text-xs text-purple-400">
                              <Eye className="w-3 h-3" /> {stats.pendingReview} للمراجعة
                            </div>
                          )}
                          {stats.overdue > 0 && (
                            <div className="flex items-center gap-1 text-xs text-red-400">
                              <AlertCircle className="w-3 h-3" /> {stats.overdue} متأخرة
                            </div>
                          )}
                          {stats.done > 0 && (
                            <div className="flex items-center gap-1 text-xs text-emerald-400">
                              <CheckSquare className="w-3 h-3" /> {stats.done} مكتملة
                            </div>
                          )}
                        </div>

                        {/* Expand to see task titles */}
                        <button
                          onClick={() => setExpandedMember(isExpanded ? null : member.name)}
                          className="mt-3 text-[11px] text-slate-500 hover:text-slate-300 flex items-center gap-1 transition-colors"
                        >
                          {isExpanded ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />}
                          {isExpanded ? 'إخفاء المهام' : `عرض ${stats.active.length} مهمة نشطة`}
                        </button>

                        {isExpanded && (
                          <div className="mt-2 space-y-1.5">
                            {stats.active.slice(0, 5).map(t => (
                              <div key={t.id} className="flex items-center justify-between gap-2 text-[11px]">
                                <span className="text-slate-400 truncate">{t.title}</span>
                                <span className={`shrink-0 px-1.5 py-0.5 rounded text-white text-[10px] ${
                                  t.status === 'قيد التنفيذ' ? 'bg-amber-600' :
                                  t.status === 'تنتظر المراجعة' ? 'bg-purple-600' :
                                  t.status === 'تحتاج تعديلاً' ? 'bg-red-600' : 'bg-slate-600'
                                }`}>{t.status}</span>
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                    )}
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>
      ))}
    </div>
  );
}
