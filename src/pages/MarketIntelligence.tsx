import { useState } from 'react';
import { useAppStore } from '../store';
import { MarketSegment, MarketSegmentType, PriorityLevel, SegmentStatus } from '../types/market';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Badge } from '../components/ui/badge';
import { Button } from '../components/ui/button';
import { Modal } from '../components/ui/modal';
import { Input, Textarea, Select, Label } from '../components/ui/form';
import { Plus, Pencil, Trash2, PieChart, Target } from 'lucide-react';

const typeNames: Record<MarketSegmentType, string> = {
  'Education': 'تعليم', 'Sports': 'رياضة', 'Rehabilitation': 'إعادة تأهيل',
  'Youth': 'شباب', 'Institutional': 'مؤسسي', 'Other': 'أخرى'
};

const priorityNames: Record<PriorityLevel, string> = {
  'Critical': 'حرج', 'High': 'عالي', 'Medium': 'متوسط', 'Low': 'منخفض'
};

const statusNames: Record<SegmentStatus, string> = {
  'Target': 'مستهدف', 'Testing': 'قيد الاختبار', 'Validated': 'تم التحقق', 'Paused': 'مؤقت'
};

export function MarketIntelligence() {
  const { segments, createSegment, updateSegment, deleteSegment } = useAppStore();
  const [modalOpen, setModalOpen] = useState(false);
  const [editingSegment, setEditingSegment] = useState<MarketSegment | null>(null);
  
  const [form, setForm] = useState({
    name: '', type: 'Education' as MarketSegmentType, description: '', problem: '',
    valueProposition: '', priority: 'Medium' as PriorityLevel, status: 'Target' as SegmentStatus, notes: ''
  });

  const openCreate = () => {
    setEditingSegment(null);
    setForm({ name: '', type: 'Education', description: '', problem: '', valueProposition: '', priority: 'Medium', status: 'Target', notes: '' });
    setModalOpen(true);
  };

  const openEdit = (s: MarketSegment) => {
    setEditingSegment(s);
    setForm({
      name: s.name, type: s.type, description: s.description, problem: s.problem,
      valueProposition: s.valueProposition, priority: s.priority, status: s.status, notes: s.notes
    });
    setModalOpen(true);
  };

  const handleSave = async () => {
    if (!form.name) return;
    if (editingSegment) await updateSegment(editingSegment.id, form);
    else await createSegment(form);
    setModalOpen(false);
  };

  return (
    <div className="space-y-6 max-w-screen-xl">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">قطاعات السوق</h1>
          <p className="text-sm text-muted-foreground">تحليل وإدارة الشرائح المستهدفة.</p>
        </div>
        <Button onClick={openCreate}><Plus className="mr-1.5 h-4 w-4" />قطاع جديد</Button>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {segments.map(s => (
          <Card key={s.id} className={s.status === 'Paused' ? 'opacity-70' : ''}>
            <CardHeader className="pb-3 border-b bg-muted/20">
              <div className="flex justify-between items-start gap-2">
                <div className="flex items-center gap-2">
                  <PieChart className="h-5 w-5 text-primary" />
                  <CardTitle className="text-base line-clamp-1">{s.name}</CardTitle>
                </div>
                <Badge variant={s.status === 'Validated' ? 'success' : s.status === 'Testing' ? 'warning' : 'secondary'}>{statusNames[s.status]}</Badge>
              </div>
            </CardHeader>
            <CardContent className="space-y-4 pt-4">
              <p className="text-sm text-muted-foreground line-clamp-2 min-h-[40px]">{s.description}</p>
              
              <div className="space-y-2 text-sm">
                <div className="p-2 bg-muted/40 rounded">
                  <p className="text-xs font-semibold text-muted-foreground flex items-center gap-1"><Target className="h-3 w-3" /> المشكلة</p>
                  <p className="line-clamp-2 mt-0.5">{s.problem}</p>
                </div>
                <div className="p-2 bg-primary/5 rounded border border-primary/10">
                  <p className="text-xs font-semibold text-primary">القيمة المقدمة (Value Prop)</p>
                  <p className="line-clamp-2 mt-0.5 font-medium">{s.valueProposition}</p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2 text-xs border-y py-2">
                <div><span className="text-muted-foreground">النوع:</span> <span className="font-medium">{typeNames[s.type]}</span></div>
                <div><span className="text-muted-foreground">الأولوية:</span> <span className="font-medium">{priorityNames[s.priority]}</span></div>
              </div>

              <div className="flex justify-end gap-1 pt-1">
                <Button variant="ghost" size="icon" className="h-7 w-7" onClick={() => openEdit(s)}><Pencil className="h-4 w-4" /></Button>
                <Button variant="ghost" size="icon" className="h-7 w-7 text-destructive hover:bg-red-50" onClick={() => deleteSegment(s.id)}><Trash2 className="h-4 w-4" /></Button>
              </div>
            </CardContent>
          </Card>
        ))}
        {segments.length === 0 && <div className="col-span-full p-8 text-center text-muted-foreground border-2 border-dashed rounded-lg">لم يتم إضافة قطاعات سوق بعد.</div>}
      </div>

      <Modal open={modalOpen} onClose={() => setModalOpen(false)} title={editingSegment ? 'تعديل القطاع' : 'قطاع جديد'} size="lg">
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1"><Label>الاسم</Label><Input value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))} /></div>
            <div className="space-y-1">
              <Label>النوع</Label>
              <Select value={form.type} onChange={e => setForm(f => ({ ...f, type: e.target.value as MarketSegmentType }))}>
                {(Object.keys(typeNames) as MarketSegmentType[]).map(t => <option key={t} value={t}>{typeNames[t]}</option>)}
              </Select>
            </div>
          </div>
          <div className="space-y-1"><Label>الوصف</Label><Textarea value={form.description} onChange={e => setForm(f => ({ ...f, description: e.target.value }))} /></div>
          <div className="space-y-1"><Label>المشكلة التي يواجهها القطاع</Label><Textarea value={form.problem} onChange={e => setForm(f => ({ ...f, problem: e.target.value }))} /></div>
          <div className="space-y-1"><Label>القيمة المقدمة (Value Proposition)</Label><Textarea value={form.valueProposition} onChange={e => setForm(f => ({ ...f, valueProposition: e.target.value }))} /></div>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1">
              <Label>الأولوية</Label>
              <Select value={form.priority} onChange={e => setForm(f => ({ ...f, priority: e.target.value as PriorityLevel }))}>
                {(Object.keys(priorityNames) as PriorityLevel[]).map(p => <option key={p} value={p}>{priorityNames[p]}</option>)}
              </Select>
            </div>
            <div className="space-y-1">
              <Label>الحالة</Label>
              <Select value={form.status} onChange={e => setForm(f => ({ ...f, status: e.target.value as SegmentStatus }))}>
                {(Object.keys(statusNames) as SegmentStatus[]).map(s => <option key={s} value={s}>{statusNames[s]}</option>)}
              </Select>
            </div>
          </div>
          <div className="space-y-1"><Label>ملاحظات إضافية</Label><Textarea value={form.notes} onChange={e => setForm(f => ({ ...f, notes: e.target.value }))} /></div>
          <div className="flex justify-end gap-2 pt-4">
            <Button variant="outline" onClick={() => setModalOpen(false)}>إلغاء</Button>
            <Button onClick={handleSave}>حفظ</Button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
