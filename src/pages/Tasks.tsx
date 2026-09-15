import { useState } from 'react';
import { useAppStore } from '../store';
import { Task, TaskStatus, TaskPriority, NewTask } from '../types/task';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Badge } from '../components/ui/badge';
import { Button } from '../components/ui/button';
import { Modal } from '../components/ui/modal';
import { Input, Textarea, Select, Label } from '../components/ui/form';
import { Plus, Pencil, Trash2 } from 'lucide-react';
import { format, isPast } from 'date-fns';

const COLUMNS: TaskStatus[] = ['Backlog', 'Todo', 'In Progress', 'Review', 'Done', 'Blocked'];

const columnNames: Record<TaskStatus, string> = {
  Backlog: 'متأخرات',
  Todo: 'للتنفيذ',
  'In Progress': 'قيد التنفيذ',
  Review: 'مراجعة',
  Done: 'مكتمل',
  Blocked: 'محظور',
};

const priorityBadge: Record<TaskPriority, 'destructive' | 'warning' | 'default' | 'outline'> = {
  'P0 (Critical)': 'destructive',
  'P1 (High)':     'warning',
  'P2 (Medium)':   'default',
  'P3 (Low)':      'outline',
};

function getStatusColor(s: TaskStatus) {
  switch (s) {
    case 'Done':        return 'bg-green-500';
    case 'In Progress': return 'bg-blue-500';
    case 'Review':      return 'bg-purple-500';
    case 'Blocked':     return 'bg-red-500';
    case 'Todo':        return 'bg-amber-400';
    default:            return 'bg-gray-400';
  }
}

const EMPTY_FORM: Omit<NewTask, never> = {
  title: '', description: '', owner: '', priority: 'P2 (Medium)',
  deadline: format(new Date(Date.now() + 7 * 86400000), 'yyyy-MM-dd'),
  status: 'Todo', category: 'Product', projectId: '',
  estimatedHours: undefined, actualHours: undefined,
};

export function Tasks() {
  const { tasks, projects, createTask, updateTask, deleteTask } = useAppStore();
  const [viewMode, setViewMode] = useState<'kanban' | 'table'>('kanban');
  const [filterProject, setFilterProject] = useState<string>('all');
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [filterPriority, setFilterPriority] = useState<string>('all');
  const [modalOpen, setModalOpen] = useState(false);
  const [editingTask, setEditingTask] = useState<Task | null>(null);
  const [form, setForm] = useState<NewTask>({ ...EMPTY_FORM });

  const filtered = tasks.filter(t => {
    if (filterProject !== 'all' && t.projectId !== filterProject) return false;
    if (filterStatus !== 'all' && t.status !== filterStatus) return false;
    if (filterPriority !== 'all' && t.priority !== filterPriority) return false;
    return true;
  });

  const openCreate = () => {
    setEditingTask(null);
    setForm({ ...EMPTY_FORM });
    setModalOpen(true);
  };

  const openEdit = (task: Task) => {
    setEditingTask(task);
    setForm({
      title: task.title,
      description: task.description,
      owner: task.owner,
      priority: task.priority,
      deadline: task.deadline.slice(0, 10),
      status: task.status,
      category: task.category,
      projectId: task.projectId ?? '',
      estimatedHours: task.estimatedHours,
      actualHours: task.actualHours,
    });
    setModalOpen(true);
  };

  const handleSave = async () => {
    if (!form.title.trim()) return;
    const data: NewTask = {
      ...form,
      deadline: new Date(form.deadline).toISOString(),
      projectId: form.projectId || undefined,
    };
    if (editingTask) {
      await updateTask(editingTask.id, data);
    } else {
      await createTask(data);
    }
    setModalOpen(false);
  };

  const handleStatusChange = async (taskId: string, newStatus: TaskStatus) => {
    await updateTask(taskId, { status: newStatus });
  };

  const handleDelete = async (taskId: string) => {
    if (confirm('هل أنت متأكد من حذف هذه المهمة؟')) await deleteTask(taskId);
  };

  return (
    <div className="space-y-4 max-w-screen-2xl">
      {/* Header */}
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">المهام</h1>
          <p className="text-sm text-muted-foreground">{tasks.length} مهمة إجمالاً · {tasks.filter(t => t.status === 'Done').length} مكتملة</p>
        </div>
        <div className="flex gap-2">
          <Button variant={viewMode === 'kanban' ? 'default' : 'outline'} size="sm" onClick={() => setViewMode('kanban')}>لوحة كانبان</Button>
          <Button variant={viewMode === 'table' ? 'default' : 'outline'} size="sm" onClick={() => setViewMode('table')}>جدول</Button>
          <Button size="sm" onClick={openCreate}><Plus className="ml-1.5 h-4 w-4" />مهمة جديدة</Button>
        </div>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap gap-2">
        <Select value={filterProject} onChange={e => setFilterProject(e.target.value)} className="w-auto min-w-[160px]">
          <option value="all">جميع المشاريع</option>
          {projects.map(p => <option key={p.id} value={p.id}>{p.name}</option>)}
        </Select>
        <Select value={filterStatus} onChange={e => setFilterStatus(e.target.value)} className="w-auto min-w-[130px]">
          <option value="all">جميع الحالات</option>
          {COLUMNS.map(c => <option key={c} value={c}>{columnNames[c]}</option>)}
        </Select>
        <Select value={filterPriority} onChange={e => setFilterPriority(e.target.value)} className="w-auto min-w-[130px]">
          <option value="all">جميع الأولويات</option>
          {(['P0 (Critical)', 'P1 (High)', 'P2 (Medium)', 'P3 (Low)'] as TaskPriority[]).map(p => (
            <option key={p} value={p}>{p}</option>
          ))}
        </Select>
        {(filterProject !== 'all' || filterStatus !== 'all' || filterPriority !== 'all') && (
          <Button variant="ghost" size="sm" onClick={() => { setFilterProject('all'); setFilterStatus('all'); setFilterPriority('all'); }}>
            إلغاء التصفية
          </Button>
        )}
      </div>

      {/* ── Kanban View ─────────────────────────────────── */}
      {viewMode === 'kanban' && (
        <div className="overflow-x-auto pb-4 custom-scrollbar">
          <div className="flex gap-3 min-w-max">
            {COLUMNS.map(col => {
              const colTasks = filtered.filter(t => t.status === col);
              return (
                <div key={col} className="flex w-72 flex-col rounded-lg border bg-muted/20">
                  <div className="flex items-center justify-between border-b px-3 py-2.5 bg-card rounded-t-lg">
                    <div className="flex items-center gap-2">
                      <span className={`h-2 w-2 rounded-full ${getStatusColor(col)}`} />
                      <span className="text-xs font-semibold">{columnNames[col]}</span>
                    </div>
                    <Badge variant="secondary">{colTasks.length}</Badge>
                  </div>
                  <div className="flex-1 space-y-2 p-2 overflow-y-auto max-h-[60vh] custom-scrollbar">
                    {colTasks.map(task => {
                      const overdue = task.status !== 'Done' && isPast(new Date(task.deadline));
                      const linkedProject = projects.find(p => p.id === task.projectId);
                      return (
                        <div
                          key={task.id}
                          className={`rounded-md border bg-card p-3 space-y-2 hover:border-primary/40 transition-colors ${overdue ? 'border-red-300 bg-red-50/40' : ''}`}
                        >
                          <div className="flex items-start justify-between gap-1">
                            <Badge variant={priorityBadge[task.priority]} className="shrink-0">{task.priority.split(' ')[0]}</Badge>
                            <div className="flex gap-1">
                              <button onClick={() => openEdit(task)} className="text-muted-foreground hover:text-primary p-0.5 rounded"><Pencil className="h-3 w-3" /></button>
                              <button onClick={() => handleDelete(task.id)} className="text-muted-foreground hover:text-destructive p-0.5 rounded"><Trash2 className="h-3 w-3" /></button>
                            </div>
                          </div>
                          <p className="text-xs font-medium leading-snug">{task.title}</p>
                          {linkedProject && (
                            <p className="text-[10px] text-muted-foreground truncate">{linkedProject.name}</p>
                          )}
                          <div className="flex items-center justify-between text-[10px] text-muted-foreground">
                            <span>{task.owner}</span>
                            <span className={overdue ? 'font-semibold text-red-600' : ''}>{format(new Date(task.deadline), 'MMM d')}</span>
                          </div>
                          <Select
                            value={task.status}
                            onChange={e => handleStatusChange(task.id, e.target.value as TaskStatus)}
                            className="h-7 text-[10px] px-1.5"
                          >
                            {COLUMNS.map(c => <option key={c} value={c}>{columnNames[c]}</option>)}
                          </Select>
                        </div>
                      );
                    })}
                    {colTasks.length === 0 && (
                      <div className="flex h-16 items-center justify-center rounded border border-dashed">
                        <p className="text-[11px] text-muted-foreground/60">فارغ</p>
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* ── Table View ─────────────────────────────────── */}
      {viewMode === 'table' && (
        <Card>
          <div className="overflow-x-auto custom-scrollbar">
            <table className="w-full text-sm text-right">
              <thead>
                <tr className="border-b bg-muted/30">
                  {['العنوان', 'المشروع', 'الأولوية', 'الحالة', 'المالك', 'الموعد النهائي', 'إجراءات'].map(h => (
                    <th key={h} className="px-4 py-3 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y">
                {filtered.map(task => {
                  const overdue = task.status !== 'Done' && isPast(new Date(task.deadline));
                  const linkedProject = projects.find(p => p.id === task.projectId);
                  return (
                    <tr key={task.id} className={`hover:bg-muted/20 transition-colors ${overdue ? 'bg-red-50/40' : ''}`}>
                      <td className="px-4 py-3 font-medium max-w-xs">
                        <p className="truncate">{task.title}</p>
                        <p className="text-xs text-muted-foreground">{task.category}</p>
                      </td>
                      <td className="px-4 py-3 text-xs text-muted-foreground max-w-[180px]">
                        <p className="truncate">{linkedProject?.name ?? '—'}</p>
                      </td>
                      <td className="px-4 py-3">
                        <Badge variant={priorityBadge[task.priority]}>{task.priority.split(' ')[0]}</Badge>
                      </td>
                      <td className="px-4 py-3">
                        <Select
                          value={task.status}
                          onChange={e => handleStatusChange(task.id, e.target.value as TaskStatus)}
                          className="h-7 w-36 text-xs"
                        >
                          {COLUMNS.map(c => <option key={c} value={c}>{columnNames[c]}</option>)}
                        </Select>
                      </td>
                      <td className="px-4 py-3 text-sm">{task.owner}</td>
                      <td className={`px-4 py-3 text-sm whitespace-nowrap ${overdue ? 'font-semibold text-red-600' : ''}`}>
                        {format(new Date(task.deadline), 'yyyy/MM/dd')}
                        {overdue && <span className="mr-1 text-xs text-red-600">⚠</span>}
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex gap-2">
                          <button onClick={() => openEdit(task)} className="text-muted-foreground hover:text-primary transition-colors"><Pencil className="h-4 w-4" /></button>
                          <button onClick={() => handleDelete(task.id)} className="text-muted-foreground hover:text-destructive transition-colors"><Trash2 className="h-4 w-4" /></button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
                {filtered.length === 0 && (
                  <tr>
                    <td colSpan={7} className="px-4 py-8 text-center text-sm text-muted-foreground">
                      لم يتم العثور على مهام.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </Card>
      )}

      {/* ── Create / Edit Modal ─────────────────────────── */}
      <Modal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        title={editingTask ? 'تعديل المهمة' : 'مهمة جديدة'}
        size="lg"
      >
        <div className="space-y-4">
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="sm:col-span-2 space-y-1">
              <Label htmlFor="task-title">العنوان *</Label>
              <Input id="task-title" value={form.title} onChange={e => setForm(f => ({ ...f, title: e.target.value }))} placeholder="عنوان المهمة..." />
            </div>

            <div className="sm:col-span-2 space-y-1">
              <Label htmlFor="task-desc">الوصف</Label>
              <Textarea id="task-desc" value={form.description} onChange={e => setForm(f => ({ ...f, description: e.target.value }))} placeholder="ما الذي يجب إنجازه..." />
            </div>

            <div className="space-y-1">
              <Label>الأولوية</Label>
              <Select value={form.priority} onChange={e => setForm(f => ({ ...f, priority: e.target.value as TaskPriority }))}>
                {(['P0 (Critical)', 'P1 (High)', 'P2 (Medium)', 'P3 (Low)'] as TaskPriority[]).map(p => <option key={p} value={p}>{p}</option>)}
              </Select>
            </div>

            <div className="space-y-1">
              <Label>الحالة</Label>
              <Select value={form.status} onChange={e => setForm(f => ({ ...f, status: e.target.value as TaskStatus }))}>
                {COLUMNS.map(c => <option key={c} value={c}>{columnNames[c]}</option>)}
              </Select>
            </div>

            <div className="space-y-1">
              <Label>المشروع</Label>
              <Select value={form.projectId ?? ''} onChange={e => setForm(f => ({ ...f, projectId: e.target.value }))}>
                <option value="">بدون مشروع</option>
                {projects.map(p => <option key={p.id} value={p.id}>{p.name}</option>)}
              </Select>
            </div>

            <div className="space-y-1">
              <Label>الفئة</Label>
              <Select value={form.category} onChange={e => setForm(f => ({ ...f, category: e.target.value }))}>
                {['Product', 'Technology', 'Legal', 'Finance', 'Marketing', 'Sales', 'Operations', 'Incubation', 'HR', 'Other'].map(c => (
                  <option key={c} value={c}>{c}</option>
                ))}
              </Select>
            </div>

            <div className="space-y-1">
              <Label htmlFor="task-owner">المالك</Label>
              <Input id="task-owner" value={form.owner} onChange={e => setForm(f => ({ ...f, owner: e.target.value }))} placeholder="مثال: الفريق التقني" />
            </div>

            <div className="space-y-1">
              <Label htmlFor="task-deadline">الموعد النهائي *</Label>
              <Input id="task-deadline" type="date" value={form.deadline?.slice(0, 10)} onChange={e => setForm(f => ({ ...f, deadline: e.target.value }))} />
            </div>

            <div className="space-y-1">
              <Label htmlFor="task-est">الساعات المقدرة</Label>
              <Input id="task-est" type="number" min={0} value={form.estimatedHours ?? ''} onChange={e => setForm(f => ({ ...f, estimatedHours: e.target.value ? Number(e.target.value) : undefined }))} placeholder="مثال: 8" />
            </div>
          </div>

          <div className="flex justify-end gap-2 pt-2 border-t">
            <Button variant="outline" onClick={() => setModalOpen(false)}>إلغاء</Button>
            <Button onClick={handleSave}>{editingTask ? 'حفظ التعديلات' : 'إنشاء المهمة'}</Button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
