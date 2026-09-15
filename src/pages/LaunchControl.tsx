import { useState } from 'react';
import { useAppStore } from '../store';
import { LaunchBlocker, LaunchBlockerSeverity, LaunchBlockerStatus } from '../types/launch';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Badge } from '../components/ui/badge';
import { Button } from '../components/ui/button';
import { Modal } from '../components/ui/modal';
import { Input, Textarea, Select, Label } from '../components/ui/form';
import { Progress } from '../components/ui/progress';
import { Plus, Pencil, Trash2, Rocket, AlertTriangle } from 'lucide-react';
import { format } from 'date-fns';

const severityNames: Record<LaunchBlockerSeverity, string> = {
  'Critical': 'حرج',
  'High': 'عالي',
  'Medium': 'متوسط',
  'Low': 'منخفض'
};

const statusNames: Record<LaunchBlockerStatus, string> = {
  'Open': 'مفتوح',
  'In Progress': 'قيد الحل',
  'Resolved': 'محلول'
};

export function LaunchControl() {
  const { launchCategories, launchBlockers, launchReadinessPct, createLaunchBlocker, updateLaunchBlocker, deleteLaunchBlocker } = useAppStore();
  const [modalOpen, setModalOpen] = useState(false);
  const [editingBlocker, setEditingBlocker] = useState<LaunchBlocker | null>(null);
  
  const [form, setForm] = useState({
    title: '', description: '', category: 'المنتج',
    severity: 'High' as LaunchBlockerSeverity, owner: '', dueDate: '', status: 'Open' as LaunchBlockerStatus
  });

  const openCreate = () => {
    setEditingBlocker(null);
    setForm({ title: '', description: '', category: 'المنتج', severity: 'High', owner: '', dueDate: '', status: 'Open' });
    setModalOpen(true);
  };

  const openEdit = (blocker: LaunchBlocker) => {
    setEditingBlocker(blocker);
    setForm({
      title: blocker.title, description: blocker.description, category: blocker.category,
      severity: blocker.severity, owner: blocker.owner, dueDate: blocker.dueDate.slice(0, 10), status: blocker.status
    });
    setModalOpen(true);
  };

  const handleSave = async () => {
    if (!form.title) return;
    const data = { ...form, dueDate: new Date(form.dueDate).toISOString() };
    if (editingBlocker) await updateLaunchBlocker(editingBlocker.id, data);
    else await createLaunchBlocker(data);
    setModalOpen(false);
  };

  return (
    <div className="space-y-6 max-w-screen-xl">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">التحكم في الإطلاق</h1>
          <p className="text-sm text-muted-foreground">هل نحن مستعدون لإطلاق التجربة التشغيلية (Pilot)؟</p>
        </div>
        <Button onClick={openCreate}><Plus className="ml-1.5 h-4 w-4" />تسجيل عائق</Button>
      </div>

      <Card className="bg-primary/5 border-primary/20">
        <CardContent className="pt-6">
          <div className="flex justify-between items-center mb-2">
            <div className="flex items-center gap-2">
              <Rocket className="h-5 w-5 text-primary" />
              <span className="font-semibold text-lg text-primary">جاهزية الإطلاق الإجمالية</span>
            </div>
            <span className="text-2xl font-bold text-primary">{launchReadinessPct}%</span>
          </div>
          <Progress value={launchReadinessPct} className="h-3" />
        </CardContent>
      </Card>

      <div className="grid gap-4 md:grid-cols-2">
        {launchCategories.map(cat => (
          <Card key={cat.id}>
            <CardHeader className="pb-3">
              <div className="flex justify-between items-start">
                <CardTitle>{cat.name}</CardTitle>
                <Badge variant={cat.readiness >= 80 ? 'success' : cat.readiness >= 50 ? 'warning' : 'destructive'}>{cat.status}</Badge>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-1">
                <div className="flex justify-between text-xs font-medium">
                  <span>الجاهزية</span>
                  <span>{cat.readiness}%</span>
                </div>
                <Progress value={cat.readiness} />
              </div>
              <div className="rounded bg-muted/40 p-3 space-y-2">
                <p className="text-xs font-semibold text-muted-foreground uppercase">الإجراء التالي</p>
                <p className="text-sm font-medium">{cat.nextAction}</p>
                {cat.blockersCount > 0 && <p className="text-xs text-destructive font-medium">⚠ {cat.blockersCount} عوائق نشطة</p>}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="space-y-4 pt-4">
        <h2 className="text-lg font-semibold flex items-center gap-2">
          <AlertTriangle className="h-5 w-5 text-destructive" /> عوائق الإطلاق
        </h2>
        <Card>
          <div className="divide-y">
            {launchBlockers.map(b => (
              <div key={b.id} className="p-4 flex flex-col sm:flex-row justify-between gap-4 hover:bg-muted/10 transition-colors">
                <div className="space-y-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <Badge variant={b.severity === 'Critical' ? 'destructive' : b.severity === 'High' ? 'warning' : 'default'} className="shrink-0">{severityNames[b.severity]}</Badge>
                    <p className="font-medium text-sm truncate">{b.title}</p>
                  </div>
                  <p className="text-xs text-muted-foreground line-clamp-1">{b.description}</p>
                  <div className="flex items-center gap-3 text-[10px] text-muted-foreground font-medium pt-1">
                    <span>{b.category}</span>
                    <span>•</span>
                    <span>{b.owner}</span>
                    <span>•</span>
                    <span>الموعد: {format(new Date(b.dueDate), 'yyyy/MM/dd')}</span>
                  </div>
                </div>
                <div className="flex items-center gap-3 shrink-0">
                  <Select value={b.status} onChange={e => updateLaunchBlocker(b.id, { status: e.target.value as LaunchBlockerStatus })} className="h-8 text-xs w-28">
                    {(['Open', 'In Progress', 'Resolved'] as LaunchBlockerStatus[]).map(s => <option key={s} value={s}>{statusNames[s]}</option>)}
                  </Select>
                  <Button variant="ghost" size="icon" onClick={() => openEdit(b)}><Pencil className="h-4 w-4" /></Button>
                  <Button variant="ghost" size="icon" className="text-destructive hover:bg-red-50" onClick={() => deleteLaunchBlocker(b.id)}><Trash2 className="h-4 w-4" /></Button>
                </div>
              </div>
            ))}
            {launchBlockers.length === 0 && <div className="p-8 text-center text-muted-foreground">لا توجد عوائق إطلاق نشطة.</div>}
          </div>
        </Card>
      </div>

      <Modal open={modalOpen} onClose={() => setModalOpen(false)} title={editingBlocker ? 'تعديل العائق' : 'تسجيل عائق'}>
        <div className="space-y-4">
          <div className="space-y-1"><Label>العنوان</Label><Input value={form.title} onChange={e => setForm(f => ({ ...f, title: e.target.value }))} /></div>
          <div className="space-y-1"><Label>الوصف</Label><Textarea value={form.description} onChange={e => setForm(f => ({ ...f, description: e.target.value }))} /></div>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1">
              <Label>الفئة</Label>
              <Select value={form.category} onChange={e => setForm(f => ({ ...f, category: e.target.value }))}>
                {launchCategories.map(c => <option key={c.id} value={c.name}>{c.name}</option>)}
              </Select>
            </div>
            <div className="space-y-1">
              <Label>الشدة</Label>
              <Select value={form.severity} onChange={e => setForm(f => ({ ...f, severity: e.target.value as any }))}>
                {(['Critical', 'High', 'Medium', 'Low'] as LaunchBlockerSeverity[]).map(s => <option key={s} value={s}>{severityNames[s]}</option>)}
              </Select>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1"><Label>المالك</Label><Input value={form.owner} onChange={e => setForm(f => ({ ...f, owner: e.target.value }))} /></div>
            <div className="space-y-1"><Label>تاريخ الاستحقاق</Label><Input type="date" value={form.dueDate} onChange={e => setForm(f => ({ ...f, dueDate: e.target.value }))} /></div>
          </div>
          <div className="space-y-1">
            <Label>الحالة</Label>
            <Select value={form.status} onChange={e => setForm(f => ({ ...f, status: e.target.value as any }))}>
              {(['Open', 'In Progress', 'Resolved'] as LaunchBlockerStatus[]).map(s => <option key={s} value={s}>{statusNames[s]}</option>)}
            </Select>
          </div>
          <div className="flex justify-end gap-2 pt-4">
            <Button variant="outline" onClick={() => setModalOpen(false)}>إلغاء</Button>
            <Button onClick={handleSave}>حفظ</Button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
