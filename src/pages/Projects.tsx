import { useState } from 'react';
import { useAppStore } from '../store';
import { Project, ProjectStatus, NewProject } from '../types/project';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Badge } from '../components/ui/badge';
import { Button } from '../components/ui/button';
import { Modal } from '../components/ui/modal';
import { Input, Textarea, Select, Label } from '../components/ui/form';
import { Progress } from '../components/ui/progress';
import { Plus, Pencil, Trash2, FolderOpen, Target } from 'lucide-react';
import { format } from 'date-fns';

const EMPTY_FORM: Omit<NewProject, never> = {
  name: '', description: '', owner: '', status: 'Planning',
  phase: 'Phase 1', startDate: format(new Date(), 'yyyy-MM-dd'),
};

const statusNames: Record<ProjectStatus, string> = {
  Planning: 'تخطيط',
  Active: 'نشط',
  'On Hold': 'مؤجل',
  Completed: 'مكتمل',
  Cancelled: 'ملغى'
};

export function Projects() {
  const { projects, tasks, createProject, updateProject, deleteProject } = useAppStore();
  const [modalOpen, setModalOpen] = useState(false);
  const [editingProject, setEditingProject] = useState<Project | null>(null);
  const [form, setForm] = useState<NewProject>({ ...EMPTY_FORM });

  const openCreate = () => {
    setEditingProject(null);
    setForm({ ...EMPTY_FORM });
    setModalOpen(true);
  };

  const openEdit = (proj: Project) => {
    setEditingProject(proj);
    setForm({
      name: proj.name,
      description: proj.description,
      owner: proj.owner,
      status: proj.status,
      phase: proj.phase,
      startDate: proj.startDate.slice(0, 10),
      endDate: proj.endDate?.slice(0, 10),
    });
    setModalOpen(true);
  };

  const handleSave = async () => {
    if (!form.name.trim()) return;
    const data: NewProject = {
      ...form,
      startDate: new Date(form.startDate).toISOString(),
      endDate: form.endDate ? new Date(form.endDate).toISOString() : undefined,
    };
    if (editingProject) {
      await updateProject(editingProject.id, data);
    } else {
      await createProject(data);
    }
    setModalOpen(false);
  };

  const handleDelete = async (id: string) => {
    if (confirm('هل أنت متأكد من حذف هذا المشروع؟ لن يتم حذف المهام التابعة له، بل سيتم فصلها فقط.')) {
      await deleteProject(id);
    }
  };

  return (
    <div className="space-y-6 max-w-screen-2xl">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">المشاريع</h1>
          <p className="text-sm text-muted-foreground">إدارة المبادرات الاستراتيجية الرئيسية.</p>
        </div>
        <Button onClick={openCreate}><Plus className="ml-1.5 h-4 w-4" />مشروع جديد</Button>
      </div>

      <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
        {projects.map(proj => {
          const projTasks = tasks.filter(t => t.projectId === proj.id);
          const doneTasks = projTasks.filter(t => t.status === 'Done');
          return (
            <Card key={proj.id} className="flex flex-col hover:border-primary/40 transition-colors">
              <CardHeader className="pb-3 flex flex-row items-start justify-between gap-4">
                <div className="flex gap-3">
                  <div className="mt-0.5 rounded bg-primary/10 p-2">
                    <FolderOpen className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-semibold leading-snug line-clamp-2">{proj.name}</h3>
                    <p className="text-xs text-muted-foreground mt-0.5">{proj.phase}</p>
                  </div>
                </div>
                <Badge variant={proj.status === 'Active' ? 'default' : proj.status === 'Planning' ? 'warning' : 'secondary'} className="shrink-0">
                  {statusNames[proj.status]}
                </Badge>
              </CardHeader>

              <CardContent className="flex-1 flex flex-col space-y-4">
                <p className="text-sm text-muted-foreground line-clamp-3 min-h-[60px] flex-1">
                  {proj.description}
                </p>

                <div className="space-y-2 rounded-md bg-muted/40 p-3">
                  <div className="flex items-center justify-between text-xs font-medium">
                    <span>التقدم</span>
                    <span className={proj.progress === 100 ? 'text-green-600' : ''}>{proj.progress}%</span>
                  </div>
                  <Progress value={proj.progress} colorOverride={proj.progress === 100 ? 'bg-green-500' : undefined} />
                  <div className="flex items-center justify-between text-[10px] text-muted-foreground pt-1">
                    <div className="flex items-center gap-1"><Target className="h-3 w-3" /> تم إنجاز {doneTasks.length} من {projTasks.length} مهام</div>
                    <span>{proj.owner}</span>
                  </div>
                </div>

                <div className="flex items-center justify-between border-t pt-3">
                  <div className="text-[10px] text-muted-foreground">
                    <span className="block">البداية: {format(new Date(proj.startDate), 'yyyy/MM/dd')}</span>
                    {proj.endDate && <span className="block">النهاية: {format(new Date(proj.endDate), 'yyyy/MM/dd')}</span>}
                  </div>
                  <div className="flex gap-1">
                    <Button variant="ghost" size="icon" onClick={() => openEdit(proj)} className="h-7 w-7"><Pencil className="h-3.5 w-3.5" /></Button>
                    <Button variant="ghost" size="icon" onClick={() => handleDelete(proj.id)} className="h-7 w-7 text-destructive hover:text-destructive hover:bg-red-50"><Trash2 className="h-3.5 w-3.5" /></Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}
        {projects.length === 0 && (
          <div className="md:col-span-2 xl:col-span-3 py-12 text-center border-2 border-dashed rounded-xl">
            <p className="text-muted-foreground">لا توجد مشاريع. قم بإنشاء مشروع للبدء.</p>
          </div>
        )}
      </div>

      <Modal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        title={editingProject ? 'تعديل المشروع' : 'مشروع جديد'}
        size="md"
      >
        <div className="space-y-4">
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="sm:col-span-2 space-y-1">
              <Label htmlFor="proj-name">اسم المشروع *</Label>
              <Input id="proj-name" value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))} />
            </div>

            <div className="sm:col-span-2 space-y-1">
              <Label htmlFor="proj-desc">الوصف</Label>
              <Textarea id="proj-desc" value={form.description} onChange={e => setForm(f => ({ ...f, description: e.target.value }))} />
            </div>

            <div className="space-y-1">
              <Label>الحالة</Label>
              <Select value={form.status} onChange={e => setForm(f => ({ ...f, status: e.target.value as ProjectStatus }))}>
                {(['Planning', 'Active', 'On Hold', 'Completed', 'Cancelled'] as ProjectStatus[]).map(s => <option key={s} value={s}>{statusNames[s]}</option>)}
              </Select>
            </div>

            <div className="space-y-1">
              <Label htmlFor="proj-phase">المرحلة / العلامة</Label>
              <Input id="proj-phase" value={form.phase} onChange={e => setForm(f => ({ ...f, phase: e.target.value }))} placeholder="مثال: المرحلة 1 - المنتج" />
            </div>

            <div className="sm:col-span-2 space-y-1">
              <Label htmlFor="proj-owner">المالك</Label>
              <Input id="proj-owner" value={form.owner} onChange={e => setForm(f => ({ ...f, owner: e.target.value }))} />
            </div>

            <div className="space-y-1">
              <Label htmlFor="proj-start">تاريخ البدء *</Label>
              <Input id="proj-start" type="date" value={form.startDate?.slice(0, 10)} onChange={e => setForm(f => ({ ...f, startDate: e.target.value }))} />
            </div>

            <div className="space-y-1">
              <Label htmlFor="proj-end">تاريخ الانتهاء (اختياري)</Label>
              <Input id="proj-end" type="date" value={form.endDate?.slice(0, 10) ?? ''} onChange={e => setForm(f => ({ ...f, endDate: e.target.value }))} />
            </div>
          </div>

          <div className="flex justify-end gap-2 pt-4 border-t mt-6">
            <Button variant="outline" onClick={() => setModalOpen(false)}>إلغاء</Button>
            <Button onClick={handleSave}>{editingProject ? 'حفظ التعديلات' : 'إنشاء المشروع'}</Button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
