import { useState } from 'react';
import { useAppStore } from '../store';
import { KPI, KPIStatus } from '../types/kpi';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Badge } from '../components/ui/badge';
import { Button } from '../components/ui/button';
import { Modal } from '../components/ui/modal';
import { Input, Textarea, Select, Label } from '../components/ui/form';
import { Plus, Pencil, Trash2, LineChart } from 'lucide-react';

const statusNames: Record<KPIStatus, string> = {
  'On Track': 'في المسار',
  'At Risk': 'في خطر',
  'Off Track': 'خارج المسار'
};

export function KPIs() {
  const { kpis, createKPI, updateKPI, deleteKPI } = useAppStore();
  const [modalOpen, setModalOpen] = useState(false);
  const [editingKPI, setEditingKPI] = useState<KPI | null>(null);
  
  const [form, setForm] = useState({
    name: '', category: 'المنتج', target: 0, currentValue: 0,
    unit: '', status: 'On Track' as KPIStatus, frequency: 'شهري',
    owner: '', source: '', notes: ''
  });

  const openCreate = () => {
    setEditingKPI(null);
    setForm({ name: '', category: 'المنتج', target: 0, currentValue: 0, unit: '', status: 'On Track', frequency: 'شهري', owner: '', source: '', notes: '' });
    setModalOpen(true);
  };

  const openEdit = (k: KPI) => {
    setEditingKPI(k);
    setForm({
      name: k.name, category: k.category, target: k.target, currentValue: k.currentValue,
      unit: k.unit, status: k.status, frequency: k.frequency, owner: k.owner, source: k.source, notes: k.notes
    });
    setModalOpen(true);
  };

  const handleSave = async () => {
    if (!form.name) return;
    if (editingKPI) await updateKPI(editingKPI.id, form);
    else await createKPI(form);
    setModalOpen(false);
  };

  return (
    <div className="space-y-6 max-w-screen-xl">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">مؤشرات الأداء (KPIs)</h1>
          <p className="text-sm text-muted-foreground">تتبع مؤشرات الأداء الرئيسية والمقاييس.</p>
        </div>
        <Button onClick={openCreate}><Plus className="mr-1.5 h-4 w-4" />مؤشر جديد</Button>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        {kpis.map(k => {
          const progress = k.target > 0 ? Math.min(100, Math.round((k.currentValue / k.target) * 100)) : 0;
          return (
            <Card key={k.id}>
              <CardHeader className="pb-2">
                <div className="flex justify-between items-start gap-2">
                  <div className="flex items-center gap-2">
                    <LineChart className="h-4 w-4 text-muted-foreground" />
                    <CardTitle className="text-sm">{k.name}</CardTitle>
                  </div>
                  <Badge variant={k.status === 'On Track' ? 'success' : k.status === 'At Risk' ? 'warning' : 'destructive'}>{statusNames[k.status]}</Badge>
                </div>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex items-end gap-1">
                  <span className="text-2xl font-bold">{k.currentValue}</span>
                  <span className="text-sm text-muted-foreground mb-1">/ {k.target} {k.unit}</span>
                </div>
                
                <div className="h-2 w-full bg-muted rounded-full overflow-hidden">
                  <div className={`h-full ${k.status === 'On Track' ? 'bg-green-500' : k.status === 'At Risk' ? 'bg-amber-500' : 'bg-red-500'}`} style={{ width: `${progress}%` }} />
                </div>

                <div className="text-[10px] text-muted-foreground font-medium flex justify-between border-t pt-2">
                  <span>{k.category} • {k.frequency}</span>
                  <span>{k.owner}</span>
                </div>
                
                <div className="flex justify-end gap-1 pt-1">
                  <Button variant="ghost" size="icon" className="h-6 w-6" onClick={() => openEdit(k)}><Pencil className="h-3 w-3" /></Button>
                  <Button variant="ghost" size="icon" className="h-6 w-6 text-destructive hover:bg-red-50" onClick={() => deleteKPI(k.id)}><Trash2 className="h-3 w-3" /></Button>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      <Modal open={modalOpen} onClose={() => setModalOpen(false)} title={editingKPI ? 'تعديل المؤشر' : 'مؤشر جديد'}>
        <div className="space-y-4">
          <div className="space-y-1"><Label>اسم المؤشر</Label><Input value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))} /></div>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1">
              <Label>الفئة</Label>
              <Select value={form.category} onChange={e => setForm(f => ({ ...f, category: e.target.value }))}>
                {['المنتج', 'الإطلاق', 'مالي', 'المبيعات', 'التسويق', 'العمليات', 'الفريق'].map(c => <option key={c} value={c}>{c}</option>)}
              </Select>
            </div>
            <div className="space-y-1">
              <Label>الحالة</Label>
              <Select value={form.status} onChange={e => setForm(f => ({ ...f, status: e.target.value as any }))}>
                {(['On Track', 'At Risk', 'Off Track'] as KPIStatus[]).map(s => <option key={s} value={s}>{statusNames[s]}</option>)}
              </Select>
            </div>
          </div>
          <div className="grid grid-cols-3 gap-4">
            <div className="space-y-1"><Label>القيمة الحالية</Label><Input type="number" value={form.currentValue} onChange={e => setForm(f => ({ ...f, currentValue: Number(e.target.value) }))} /></div>
            <div className="space-y-1"><Label>الهدف</Label><Input type="number" value={form.target} onChange={e => setForm(f => ({ ...f, target: Number(e.target.value) }))} /></div>
            <div className="space-y-1"><Label>الوحدة</Label><Input value={form.unit} onChange={e => setForm(f => ({ ...f, unit: e.target.value }))} placeholder="مثال: مستخدمون، %" /></div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1"><Label>التكرار</Label><Input value={form.frequency} onChange={e => setForm(f => ({ ...f, frequency: e.target.value }))} placeholder="مثال: يومي، أسبوعي" /></div>
            <div className="space-y-1"><Label>المصدر</Label><Input value={form.source} onChange={e => setForm(f => ({ ...f, source: e.target.value }))} placeholder="مثال: قاعدة البيانات، Google Analytics" /></div>
          </div>
          <div className="space-y-1"><Label>المالك</Label><Input value={form.owner} onChange={e => setForm(f => ({ ...f, owner: e.target.value }))} /></div>
          <div className="space-y-1"><Label>ملاحظات</Label><Textarea value={form.notes} onChange={e => setForm(f => ({ ...f, notes: e.target.value }))} /></div>
          <div className="flex justify-end gap-2 pt-4">
            <Button variant="outline" onClick={() => setModalOpen(false)}>إلغاء</Button>
            <Button onClick={handleSave}>حفظ</Button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
