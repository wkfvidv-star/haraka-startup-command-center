import { useState } from 'react';
import { useAppStore } from '../store';
import {
  Task, TaskStatus, TaskPriority, TaskDomain, NewTask,
  ASSIGNEE_ALLOWED_TRANSITIONS, FOUNDER_ALLOWED_TRANSITIONS,
  STATUS_BADGE_VARIANT, STATUS_COLORS
} from '../types/task';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Badge } from '../components/ui/badge';
import { Button } from '../components/ui/button';
import { Modal } from '../components/ui/modal';
import { Input, Textarea, Select, Label } from '../components/ui/form';
import { Plus, Pencil, Trash2, CheckSquare, Clock, AlertCircle, Eye, CheckCircle, RefreshCw } from 'lucide-react';
import { format, isPast } from 'date-fns';

const ALL_STATUSES: TaskStatus[] = [
  'جديدة', 'تم الاستلام', 'قيد التنفيذ', 'تنتظر المراجعة', 'تحتاج تعديلاً', 'مكتملة'
];

const PRIORITIES: TaskPriority[] = ['حرجة', 'عالية', 'متوسطة', 'منخفضة'];

const DOMAINS: TaskDomain[] = [
  'القيادة والاستراتيجية', 'تطوير المنتج', 'تطوير الشركة', 'السوق والتسويق',
  'التمويل', 'المحتوى العلمي', 'التكنولوجيا والذكاء الاصطناعي', 'Computer Vision',
  'البنية التحتية', 'الشؤون القانونية', 'الملكية الفكرية', 'العقود',
  'التأسيس', 'البحث والتطوير', 'الفريق', 'أخرى'
];

const PRIORITY_VARIANT: Record<TaskPriority, any> = {
  'حرجة': 'destructive',
  'عالية': 'warning',
  'متوسطة': 'default',
  'منخفضة': 'outline',
};

const TEAM_MEMBERS = [
  'عبد الباسط نصير',
  'نصير رياض',
  'جاب الله حسين',
  'حاج مختار',
  'سلطاني حمة',
  'يوسف نصير',
];

const EMPTY_FORM: NewTask = {
  title: '', description: '', owner: '', assigner: '',
  priority: 'متوسطة', deadline: format(new Date(Date.now() + 7 * 86400000), 'yyyy-MM-dd'),
  status: 'جديدة', category: 'أخرى', domain: 'أخرى',
  expectedResult: '', estimatedHours: undefined, actualHours: undefined,
};

export function Tasks() {
  const { tasks, projects, createTask, updateTask, deleteTask, currentUserRole, currentMember } = useAppStore();
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [filterPriority, setFilterPriority] = useState<string>('all');
  const [modalOpen, setModalOpen] = useState(false);
  const [reviewModalOpen, setReviewModalOpen] = useState(false);
  const [editingTask, setEditingTask] = useState<Task | null>(null);
  const [reviewingTask, setReviewingTask] = useState<Task | null>(null);
  const [reviewNotes, setReviewNotes] = useState('');
  const [form, setForm] = useState<NewTask>({ ...EMPTY_FORM });

  const isFounderOrLeadership = currentUserRole === 'FOUNDER' || currentUserRole === 'LEADERSHIP';
  const isFounder = currentUserRole === 'FOUNDER';

  // Filter tasks based on role
  const visibleTasks = tasks.filter(t => {
    if (isFounderOrLeadership) return true;
    // Others only see their own tasks
    const memberName = currentMember?.name ?? '';
    return t.owner === memberName ||
      TEAM_MEMBERS.some(m => t.owner?.includes(m.split(' ')[0]) && memberName.includes(m.split(' ')[0]));
  });

  const filtered = visibleTasks.filter(t => {
    if (filterStatus !== 'all' && t.status !== filterStatus) return false;
    if (filterPriority !== 'all' && t.priority !== filterPriority) return false;
    return true;
  });

  // Summary counts
  const counts = {
    total: visibleTasks.length,
    inProgress: visibleTasks.filter(t => t.status === 'قيد التنفيذ').length,
    pendingReview: visibleTasks.filter(t => t.status === 'تنتظر المراجعة').length,
    needsEdit: visibleTasks.filter(t => t.status === 'تحتاج تعديلاً').length,
    done: visibleTasks.filter(t => t.status === 'مكتملة').length,
    overdue: visibleTasks.filter(t => t.status !== 'مكتملة' && isPast(new Date(t.deadline))).length,
  };

  const openCreate = () => {
    setEditingTask(null);
    setForm({ ...EMPTY_FORM, assigner: currentMember?.name ?? 'عبد الباسط نصير' });
    setModalOpen(true);
  };

  const openEdit = (task: Task) => {
    setEditingTask(task);
    setForm({
      title: task.title, description: task.description,
      owner: task.owner, assigner: task.assigner ?? '',
      priority: task.priority as TaskPriority,
      deadline: task.deadline.slice(0, 10),
      status: task.status as TaskStatus,
      category: task.category, domain: task.domain ?? 'أخرى',
      expectedResult: task.expectedResult ?? '',
      estimatedHours: task.estimatedHours, actualHours: task.actualHours,
    });
    setModalOpen(true);
  };

  const handleSave = async () => {
    if (!form.title.trim()) return;
    const data: NewTask = {
      ...form,
      deadline: new Date(form.deadline).toISOString(),
    };
    if (editingTask) {
      await updateTask(editingTask.id, data);
    } else {
      await createTask(data);
    }
    setModalOpen(false);
  };

  // Assignee advances status one step
  const handleAssigneeAction = async (task: Task, nextStatus: TaskStatus) => {
    await updateTask(task.id, { status: nextStatus });
  };

  // Founder review action
  const openReview = (task: Task) => {
    setReviewingTask(task);
    setReviewNotes('');
    setReviewModalOpen(true);
  };

  const handleAccept = async () => {
    if (!reviewingTask) return;
    await updateTask(reviewingTask.id, { status: 'مكتملة', reviewNotes });
    setReviewModalOpen(false);
  };

  const handleRequestEdit = async () => {
    if (!reviewingTask) return;
    await updateTask(reviewingTask.id, { status: 'تحتاج تعديلاً', reviewNotes });
    setReviewModalOpen(false);
  };

  const handleDelete = async (taskId: string) => {
    if (confirm('هل أنت متأكد من حذف هذه المهمة؟')) await deleteTask(taskId);
  };

  // Get next action for assignee
  const getAssigneeNextAction = (task: Task): { label: string; icon: any; next: TaskStatus } | null => {
    const allowed = ASSIGNEE_ALLOWED_TRANSITIONS[task.status as TaskStatus];
    if (!allowed || allowed.length === 0) return null;
    const next = allowed[0];
    const actions: Record<TaskStatus, { label: string; icon: any }> = {
      'جديدة': { label: 'استلام المهمة', icon: CheckSquare },
      'تم الاستلام': { label: 'بدء التنفيذ', icon: RefreshCw },
      'قيد التنفيذ': { label: 'إرسال للمراجعة', icon: Eye },
      'تنتظر المراجعة': { label: '', icon: null },
      'تحتاج تعديلاً': { label: 'إعادة التنفيذ', icon: RefreshCw },
      'مكتملة': { label: '', icon: null },
    };
    return { ...actions[task.status as TaskStatus], next };
  };

  return (
    <div className="space-y-6 max-w-screen-xl">

      {/* Header */}
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">
            {isFounderOrLeadership ? 'المهام الموكلة للفريق' : 'المهام الموكلة إليّ'}
          </h1>
          <p className="text-sm text-muted-foreground mt-1">
            {counts.total} مهمة إجمالاً · {counts.done} مكتملة · {counts.overdue > 0 ? `${counts.overdue} متأخرة` : 'لا تأخير'}
          </p>
        </div>
        {isFounderOrLeadership && (
          <Button size="sm" onClick={openCreate}>
            <Plus className="ml-1.5 h-4 w-4" /> مهمة جديدة
          </Button>
        )}
      </div>

      {/* Stats Row */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
        {[
          { label: 'قيد التنفيذ', value: counts.inProgress, color: 'text-amber-400', bg: 'bg-amber-500/10' },
          { label: 'تنتظر مراجعة', value: counts.pendingReview, color: 'text-purple-400', bg: 'bg-purple-500/10' },
          { label: 'تحتاج تعديلاً', value: counts.needsEdit, color: 'text-red-400', bg: 'bg-red-500/10' },
          { label: 'مكتملة', value: counts.done, color: 'text-emerald-400', bg: 'bg-emerald-500/10' },
          { label: 'متأخرة', value: counts.overdue, color: 'text-red-500', bg: 'bg-red-900/20' },
        ].map((s, i) => (
          <Card key={i} className={counts.overdue > 0 && s.label === 'متأخرة' ? 'border-red-900/40' : ''}>
            <CardContent className="p-4 text-center">
              <p className={`text-2xl font-bold ${s.color}`}>{s.value}</p>
              <p className="text-xs text-slate-500 mt-1">{s.label}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Flow explanation */}
      <div className="flex flex-wrap items-center gap-2 p-3 rounded-xl bg-slate-900/60 border border-slate-800 text-xs text-slate-500">
        <span className="font-semibold text-slate-400 ml-2">سير عمل المهمة:</span>
        {ALL_STATUSES.map((s, i) => (
          <span key={s} className="flex items-center gap-2">
            <span className={`px-2 py-0.5 rounded-full text-white ${STATUS_COLORS[s]}`}>{s}</span>
            {i < ALL_STATUSES.length - 1 && <span className="text-slate-700">←</span>}
          </span>
        ))}
      </div>

      {/* Filters */}
      <div className="flex flex-wrap gap-2">
        <Select value={filterStatus} onChange={e => setFilterStatus(e.target.value)} className="w-auto min-w-[170px]">
          <option value="all">جميع الحالات</option>
          {ALL_STATUSES.map(s => <option key={s} value={s}>{s}</option>)}
        </Select>
        <Select value={filterPriority} onChange={e => setFilterPriority(e.target.value)} className="w-auto min-w-[140px]">
          <option value="all">جميع الأولويات</option>
          {PRIORITIES.map(p => <option key={p} value={p}>{p}</option>)}
        </Select>
        {(filterStatus !== 'all' || filterPriority !== 'all') && (
          <Button variant="ghost" size="sm" onClick={() => { setFilterStatus('all'); setFilterPriority('all'); }}>
            مسح الفلاتر
          </Button>
        )}
      </div>

      {/* Tasks List */}
      <div className="space-y-3">
        {filtered.length === 0 ? (
          <Card className="border-dashed">
            <CardContent className="pt-16 pb-16 text-center flex flex-col items-center gap-4">
              <CheckSquare className="w-14 h-14 text-slate-700" />
              <p className="text-slate-400 text-lg">لا توجد مهام تطابق معايير البحث.</p>
            </CardContent>
          </Card>
        ) : (
          filtered.map(task => {
            const overdue = task.status !== 'مكتملة' && isPast(new Date(task.deadline));
            const assigneeAction = !isFounderOrLeadership ? getAssigneeNextAction(task) : null;
            const canReview = isFounder && task.status === 'تنتظر المراجعة';

            return (
              <Card
                key={task.id}
                className={`transition-all hover:shadow-md ${
                  task.status === 'تنتظر المراجعة' ? 'border-purple-500/30 bg-purple-500/3' :
                  task.status === 'تحتاج تعديلاً' ? 'border-red-500/30 bg-red-500/3' :
                  task.status === 'مكتملة' ? 'border-emerald-500/20 opacity-80' :
                  overdue ? 'border-red-900/40' : ''
                }`}
              >
                <CardContent className="p-4">
                  <div className="flex flex-col md:flex-row md:items-start gap-4">
                    {/* Status indicator */}
                    <div className="flex items-center gap-3 md:flex-col md:items-center md:gap-1 md:w-24 shrink-0">
                      <span className={`w-2.5 h-2.5 rounded-full shrink-0 ${STATUS_COLORS[task.status as TaskStatus] ?? 'bg-slate-400'}`} />
                      <span className="text-[10px] text-slate-500 md:text-center leading-tight">
                        {task.status}
                      </span>
                    </div>

                    {/* Main Content */}
                    <div className="flex-1 min-w-0 space-y-2">
                      <div className="flex flex-wrap items-start gap-2">
                        <h3 className="font-semibold text-slate-100 leading-snug">{task.title}</h3>
                        {overdue && (
                          <Badge variant="destructive" className="text-[10px] px-1.5 py-0">متأخرة</Badge>
                        )}
                      </div>

                      {task.description && (
                        <p className="text-xs text-slate-500 leading-relaxed">{task.description}</p>
                      )}

                      {task.expectedResult && (
                        <div className="bg-slate-900 border border-slate-800 rounded-lg px-3 py-2">
                          <p className="text-[10px] text-slate-500 mb-0.5 font-semibold uppercase tracking-wider">النتيجة المطلوبة</p>
                          <p className="text-xs text-slate-300">{task.expectedResult}</p>
                        </div>
                      )}

                      {task.status === 'تحتاج تعديلاً' && task.reviewNotes && (
                        <div className="bg-red-950/40 border border-red-900/40 rounded-lg px-3 py-2">
                          <p className="text-[10px] text-red-400 mb-0.5 font-semibold">ملاحظات رئيس المشروع</p>
                          <p className="text-xs text-red-300">{task.reviewNotes}</p>
                        </div>
                      )}

                      {/* Meta */}
                      <div className="flex flex-wrap gap-x-4 gap-y-1 text-[11px] text-slate-500">
                        {task.owner && <span>المسؤول: <span className="text-slate-300">{task.owner}</span></span>}
                        {task.assigner && isFounderOrLeadership && <span>أسندها: <span className="text-slate-400">{task.assigner}</span></span>}
                        {task.domain && <span>المجال: <span className="text-slate-400">{task.domain}</span></span>}
                        <span className={overdue ? 'text-red-400 font-semibold' : ''}>
                          الموعد: {format(new Date(task.deadline), 'yyyy/MM/dd')}
                        </span>
                      </div>
                    </div>

                    {/* Actions */}
                    <div className="flex flex-wrap md:flex-col items-center md:items-end gap-2 shrink-0">
                      <Badge variant={PRIORITY_VARIANT[task.priority as TaskPriority] ?? 'outline'}>
                        {task.priority}
                      </Badge>

                      {/* Assignee action button */}
                      {assigneeAction && assigneeAction.label && (
                        <button
                          onClick={() => handleAssigneeAction(task, assigneeAction.next)}
                          className="flex items-center gap-1.5 text-xs font-semibold bg-primary/10 hover:bg-primary/20 text-primary border border-primary/20 px-3 py-1.5 rounded-lg transition-colors whitespace-nowrap"
                        >
                          <assigneeAction.icon className="w-3.5 h-3.5" />
                          {assigneeAction.label}
                        </button>
                      )}

                      {/* Founder review button */}
                      {canReview && (
                        <button
                          onClick={() => openReview(task)}
                          className="flex items-center gap-1.5 text-xs font-semibold bg-purple-500/10 hover:bg-purple-500/20 text-purple-400 border border-purple-500/30 px-3 py-1.5 rounded-lg transition-colors whitespace-nowrap"
                        >
                          <Eye className="w-3.5 h-3.5" />
                          مراجعة النتيجة
                        </button>
                      )}

                      {/* Edit/Delete for founder */}
                      {isFounderOrLeadership && (
                        <div className="flex gap-1">
                          <button onClick={() => openEdit(task)} className="text-slate-500 hover:text-primary p-1.5 rounded-lg hover:bg-slate-800 transition-colors">
                            <Pencil className="w-3.5 h-3.5" />
                          </button>
                          {isFounder && (
                            <button onClick={() => handleDelete(task.id)} className="text-slate-500 hover:text-red-400 p-1.5 rounded-lg hover:bg-slate-800 transition-colors">
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          )}
                        </div>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })
        )}
      </div>

      {/* ═══ Create/Edit Modal ═══ */}
      <Modal open={modalOpen} onClose={() => setModalOpen(false)} title={editingTask ? 'تعديل المهمة' : 'مهمة جديدة'}>
        <div className="space-y-4">
          <div>
            <Label>عنوان المهمة *</Label>
            <Input value={form.title} onChange={e => setForm(f => ({ ...f, title: e.target.value }))} placeholder="مثال: دراسة حماية اسم HARAKA" />
          </div>
          <div>
            <Label>المسؤول (المُوكَل إليه)</Label>
            <Select value={form.owner} onChange={e => setForm(f => ({ ...f, owner: e.target.value }))}>
              <option value="">اختر عضواً</option>
              {TEAM_MEMBERS.map(m => <option key={m} value={m}>{m}</option>)}
            </Select>
          </div>
          <div>
            <Label>المجال</Label>
            <Select value={form.domain ?? 'أخرى'} onChange={e => setForm(f => ({ ...f, domain: e.target.value as TaskDomain, category: e.target.value }))}>
              {DOMAINS.map(d => <option key={d} value={d}>{d}</option>)}
            </Select>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <Label>الأولوية</Label>
              <Select value={form.priority} onChange={e => setForm(f => ({ ...f, priority: e.target.value as TaskPriority }))}>
                {PRIORITIES.map(p => <option key={p} value={p}>{p}</option>)}
              </Select>
            </div>
            <div>
              <Label>الموعد النهائي</Label>
              <Input type="date" value={form.deadline} onChange={e => setForm(f => ({ ...f, deadline: e.target.value }))} />
            </div>
          </div>
          <div>
            <Label>النتيجة المطلوبة</Label>
            <Textarea
              value={form.expectedResult ?? ''}
              onChange={e => setForm(f => ({ ...f, expectedResult: e.target.value }))}
              placeholder="مثال: تقرير بحثي / وثيقة قانونية / دراسة تقنية..."
              rows={2}
            />
          </div>
          <div>
            <Label>وصف المهمة (تفاصيل)</Label>
            <Textarea
              value={form.description}
              onChange={e => setForm(f => ({ ...f, description: e.target.value }))}
              placeholder="تفاصيل إضافية عن ما هو مطلوب..."
              rows={3}
            />
          </div>
          <div className="flex justify-end gap-3 pt-2">
            <Button variant="outline" onClick={() => setModalOpen(false)}>إلغاء</Button>
            <Button onClick={handleSave}>{editingTask ? 'حفظ التعديلات' : 'إنشاء المهمة'}</Button>
          </div>
        </div>
      </Modal>

      {/* ═══ Review Modal ═══ */}
      <Modal open={reviewModalOpen} onClose={() => setReviewModalOpen(false)} title="مراجعة نتيجة المهمة">
        {reviewingTask && (
          <div className="space-y-4">
            <div className="bg-slate-900 border border-slate-800 rounded-xl p-4 space-y-2">
              <p className="font-semibold text-slate-200">{reviewingTask.title}</p>
              <p className="text-xs text-slate-500">المسؤول: {reviewingTask.owner}</p>
              {reviewingTask.expectedResult && (
                <div className="mt-2">
                  <p className="text-[10px] text-slate-600 font-semibold uppercase mb-1">النتيجة المطلوبة</p>
                  <p className="text-sm text-slate-400">{reviewingTask.expectedResult}</p>
                </div>
              )}
            </div>

            <div>
              <Label>ملاحظاتك (اختياري — تظهر للعضو إذا طلبت تعديلاً)</Label>
              <Textarea
                value={reviewNotes}
                onChange={e => setReviewNotes(e.target.value)}
                placeholder="اكتب ملاحظاتك هنا..."
                rows={3}
              />
            </div>

            <div className="flex gap-3 pt-2">
              <Button
                className="flex-1 bg-emerald-600 hover:bg-emerald-700"
                onClick={handleAccept}
              >
                <CheckCircle className="w-4 h-4 ml-1.5" />
                قبول النتيجة
              </Button>
              <Button
                variant="outline"
                className="flex-1 border-red-500/40 text-red-400 hover:bg-red-500/10"
                onClick={handleRequestEdit}
              >
                <RefreshCw className="w-4 h-4 ml-1.5" />
                طلب تعديل
              </Button>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
}
