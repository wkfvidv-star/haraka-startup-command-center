import { useState } from 'react';
import { useAppStore } from '../store';
import { Decision, DecisionStatus, DecisionPriority } from '../types/decision';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Badge } from '../components/ui/badge';
import { Button } from '../components/ui/button';
import { Modal } from '../components/ui/modal';
import { Input, Textarea, Select, Label } from '../components/ui/form';
import { Plus, Pencil, Trash2, Scale } from 'lucide-react';
import { format } from 'date-fns';

const statusNames: Record<DecisionStatus, string> = {
  'Open': 'مفتوح',
  'Under Review': 'قيد المراجعة',
  'Decided': 'تم اتخاذه',
  'Implemented': 'منفذ',
  'Reviewed': 'تمت مراجعته'
};

const priorityNames: Record<DecisionPriority, string> = {
  'Critical': 'حرج',
  'High': 'عالي',
  'Medium': 'متوسط',
  'Low': 'منخفض'
};

export function Decisions() {
  const { decisions, createDecision, updateDecision, deleteDecision } = useAppStore();
  const [modalOpen, setModalOpen] = useState(false);
  const [editingDecision, setEditingDecision] = useState<Decision | null>(null);
  
  const [form, setForm] = useState({
    title: '', description: '', reason: '', options: '', selectedOption: '',
    expectedImpact: '', actualImpact: '', owner: '', priority: 'Medium' as DecisionPriority, 
    status: 'Open' as DecisionStatus, decisionDate: '', reviewDate: '', notes: ''
  });

  const openCreate = () => {
    setEditingDecision(null);
    setForm({ 
      title: '', description: '', reason: '', options: '', selectedOption: '',
      expectedImpact: '', actualImpact: '', owner: '', priority: 'Medium', 
      status: 'Open', decisionDate: format(new Date(), 'yyyy-MM-dd'), reviewDate: format(new Date(), 'yyyy-MM-dd'), notes: '' 
    });
    setModalOpen(true);
  };

  const openEdit = (d: Decision) => {
    setEditingDecision(d);
    setForm({
      title: d.title, description: d.description, reason: d.reason, options: d.options, selectedOption: d.selectedOption,
      expectedImpact: d.expectedImpact, actualImpact: d.actualImpact, owner: d.owner, priority: d.priority, 
      status: d.status, decisionDate: d.decisionDate.slice(0, 10), reviewDate: d.reviewDate.slice(0, 10), notes: d.notes
    });
    setModalOpen(true);
  };

  const handleSave = async () => {
    if (!form.title) return;
    const data = { 
      ...form, 
      decisionDate: new Date(form.decisionDate).toISOString(),
      reviewDate: new Date(form.reviewDate).toISOString()
    };
    if (editingDecision) await updateDecision(editingDecision.id, data);
    else await createDecision(data);
    setModalOpen(false);
  };

  return (
    <div className="space-y-6 max-w-screen-xl">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">القرارات الاستراتيجية</h1>
          <p className="text-sm text-muted-foreground">سجل للقرارات الاستراتيجية، المعمارية والتجارية الرئيسية.</p>
        </div>
        <Button onClick={openCreate}><Plus className="mr-1.5 h-4 w-4" />تسجيل قرار</Button>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        {decisions.map(d => (
          <Card key={d.id} className={d.status === 'Implemented' || d.status === 'Reviewed' ? 'opacity-80' : ''}>
            <CardHeader className="pb-3 border-b bg-muted/20">
              <div className="flex justify-between items-start gap-2">
                <div className="flex items-center gap-2">
                  <Scale className="h-4 w-4 text-primary" />
                  <CardTitle className="text-base">{d.title}</CardTitle>
                </div>
                <div className="flex gap-2">
                  <Badge variant="outline">{priorityNames[d.priority]}</Badge>
                  <Badge variant={d.status === 'Decided' || d.status === 'Implemented' ? 'success' : d.status === 'Open' ? 'warning' : 'secondary'}>{statusNames[d.status]}</Badge>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-4 pt-4">
              <div className="space-y-3 text-sm">
                <div>
                  <p className="text-xs font-semibold text-muted-foreground uppercase">السياق والوصف</p>
                  <p className="mt-0.5 text-muted-foreground">{d.description}</p>
                </div>
                <div className="p-3 bg-primary/5 border border-primary/20 rounded-md">
                  <p className="text-xs font-semibold text-primary uppercase">القرار المتخذ</p>
                  <p className="mt-0.5 font-medium">{d.selectedOption || 'لم يتخذ بعد'}</p>
                </div>
                <div>
                  <p className="text-xs font-semibold text-muted-foreground uppercase">الأسباب</p>
                  <p className="mt-0.5">{d.reason}</p>
                </div>
                <div className="grid grid-cols-2 gap-4 border-t pt-3">
                  <div>
                    <p className="text-xs font-semibold text-muted-foreground uppercase">التأثير المتوقع</p>
                    <p className="mt-0.5 text-muted-foreground">{d.expectedImpact}</p>
                  </div>
                  <div>
                    <p className="text-xs font-semibold text-muted-foreground uppercase">التأثير الفعلي</p>
                    <p className="mt-0.5 text-muted-foreground">{d.actualImpact || 'غير متوفر'}</p>
                  </div>
                </div>
              </div>

              <div className="flex items-center justify-between border-t pt-3">
                <div className="text-[10px] text-muted-foreground font-medium flex gap-3">
                  <span>القرار: {format(new Date(d.decisionDate), 'yyyy/MM/dd')}</span>
                  <span>المالك: {d.owner}</span>
                </div>
                <div className="flex gap-2">
                  <Select value={d.status} onChange={e => updateDecision(d.id, { status: e.target.value as DecisionStatus })} className="h-7 text-[10px] w-28">
                    {(['Open', 'Under Review', 'Decided', 'Implemented', 'Reviewed'] as DecisionStatus[]).map(s => <option key={s} value={s}>{statusNames[s]}</option>)}
                  </Select>
                  <Button variant="ghost" size="icon" className="h-7 w-7" onClick={() => openEdit(d)}><Pencil className="h-3.5 w-3.5" /></Button>
                  <Button variant="ghost" size="icon" className="h-7 w-7 text-destructive hover:bg-red-50" onClick={() => deleteDecision(d.id)}><Trash2 className="h-3.5 w-3.5" /></Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <Modal open={modalOpen} onClose={() => setModalOpen(false)} title={editingDecision ? 'تعديل القرار' : 'تسجيل قرار'} size="lg">
        <div className="space-y-4 max-h-[70vh] overflow-y-auto px-1">
          <div className="space-y-1"><Label>العنوان</Label><Input value={form.title} onChange={e => setForm(f => ({ ...f, title: e.target.value }))} /></div>
          <div className="space-y-1"><Label>السياق والوصف</Label><Textarea value={form.description} onChange={e => setForm(f => ({ ...f, description: e.target.value }))} /></div>
          
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1"><Label>الخيارات المتاحة</Label><Textarea value={form.options} onChange={e => setForm(f => ({ ...f, options: e.target.value }))} /></div>
            <div className="space-y-1"><Label>القرار المتخذ (الخيار المختار)</Label><Textarea value={form.selectedOption} onChange={e => setForm(f => ({ ...f, selectedOption: e.target.value }))} /></div>
          </div>
          
          <div className="space-y-1"><Label>الأسباب</Label><Textarea value={form.reason} onChange={e => setForm(f => ({ ...f, reason: e.target.value }))} /></div>
          
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1"><Label>التأثير المتوقع</Label><Input value={form.expectedImpact} onChange={e => setForm(f => ({ ...f, expectedImpact: e.target.value }))} /></div>
            <div className="space-y-1"><Label>التأثير الفعلي</Label><Input value={form.actualImpact} onChange={e => setForm(f => ({ ...f, actualImpact: e.target.value }))} /></div>
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1"><Label>المالك</Label><Input value={form.owner} onChange={e => setForm(f => ({ ...f, owner: e.target.value }))} /></div>
            <div className="space-y-1">
              <Label>الأولوية</Label>
              <Select value={form.priority} onChange={e => setForm(f => ({ ...f, priority: e.target.value as any }))}>
                {(['Critical', 'High', 'Medium', 'Low'] as DecisionPriority[]).map(s => <option key={s} value={s}>{priorityNames[s]}</option>)}
              </Select>
            </div>
          </div>

          <div className="grid grid-cols-3 gap-4">
            <div className="space-y-1"><Label>تاريخ القرار</Label><Input type="date" value={form.decisionDate} onChange={e => setForm(f => ({ ...f, decisionDate: e.target.value }))} /></div>
            <div className="space-y-1"><Label>تاريخ المراجعة</Label><Input type="date" value={form.reviewDate} onChange={e => setForm(f => ({ ...f, reviewDate: e.target.value }))} /></div>
            <div className="space-y-1">
              <Label>الحالة</Label>
              <Select value={form.status} onChange={e => setForm(f => ({ ...f, status: e.target.value as any }))}>
                {(['Open', 'Under Review', 'Decided', 'Implemented', 'Reviewed'] as DecisionStatus[]).map(s => <option key={s} value={s}>{statusNames[s]}</option>)}
              </Select>
            </div>
          </div>
          <div className="space-y-1"><Label>ملاحظات إضافية</Label><Input value={form.notes} onChange={e => setForm(f => ({ ...f, notes: e.target.value }))} /></div>
        </div>
        <div className="flex justify-end gap-2 pt-4 border-t mt-4">
          <Button variant="outline" onClick={() => setModalOpen(false)}>إلغاء</Button>
          <Button onClick={handleSave}>حفظ</Button>
        </div>
      </Modal>
    </div>
  );
}
