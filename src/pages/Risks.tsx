import { useState } from 'react';
import { useAppStore } from '../store';
import { Risk, RiskProbability, RiskImpact, RiskStatus } from '../types/risk';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Badge } from '../components/ui/badge';
import { Button } from '../components/ui/button';
import { Modal } from '../components/ui/modal';
import { Input, Textarea, Select, Label } from '../components/ui/form';
import { Plus, Pencil, Trash2, ShieldAlert } from 'lucide-react';

const severityNames = {
  'Critical': 'حرج',
  'High': 'عالي',
  'Medium': 'متوسط',
  'Low': 'منخفض'
};

const probImpNames = {
  'High': 'عالي',
  'Medium': 'متوسط',
  'Low': 'منخفض'
};

const statusNames: Record<RiskStatus, string> = {
  'Open': 'مفتوح',
  'Mitigated': 'مخفف',
  'Closed': 'مغلق'
};

export function Risks() {
  const { risks, createRisk, updateRisk, deleteRisk } = useAppStore();
  const [modalOpen, setModalOpen] = useState(false);
  const [editingRisk, setEditingRisk] = useState<Risk | null>(null);
  
  const [form, setForm] = useState({
    title: '', description: '', category: 'Product',
    probability: 'Medium' as RiskProbability, impact: 'Medium' as RiskImpact,
    owner: '', mitigation: '', status: 'Open' as RiskStatus, dueDate: ''
  });

  const openCreate = () => {
    setEditingRisk(null);
    setForm({ title: '', description: '', category: 'المنتج', probability: 'Medium', impact: 'Medium', owner: '', mitigation: '', status: 'Open', dueDate: '' });
    setModalOpen(true);
  };

  const openEdit = (risk: Risk) => {
    setEditingRisk(risk);
    setForm({
      title: risk.title, description: risk.description, category: risk.category,
      probability: risk.probability, impact: risk.impact, owner: risk.owner, 
      mitigation: risk.mitigation, status: risk.status, dueDate: risk.dueDate.slice(0, 10)
    });
    setModalOpen(true);
  };

  const handleSave = async () => {
    if (!form.title) return;
    const data = { ...form, dueDate: new Date(form.dueDate).toISOString() };
    if (editingRisk) await updateRisk(editingRisk.id, data);
    else await createRisk(data);
    setModalOpen(false);
  };

  const getSeverityBadge = (severity: string) => {
    switch (severity) {
      case 'Critical': return <Badge variant="destructive">حرج</Badge>;
      case 'High': return <Badge variant="warning">عالي</Badge>;
      case 'Low': return <Badge variant="outline">منخفض</Badge>;
      default: return <Badge variant="secondary">متوسط</Badge>;
    }
  };

  return (
    <div className="space-y-6 max-w-screen-xl">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">إدارة المخاطر</h1>
          <p className="text-sm text-muted-foreground">تحديد وتقييم وتخفيف مخاطر الأعمال.</p>
        </div>
        <Button onClick={openCreate}><Plus className="mr-1.5 h-4 w-4" />تسجيل خطر</Button>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {risks.map(r => (
          <Card key={r.id} className={r.status === 'Open' && (r.severity === 'Critical' || r.severity === 'High') ? 'border-amber-500/50 bg-amber-50/20' : r.status === 'Closed' ? 'opacity-70 grayscale' : ''}>
            <CardHeader className="pb-2">
              <div className="flex justify-between items-start gap-2">
                <div className="flex items-center gap-2">
                  <ShieldAlert className="h-4 w-4 text-muted-foreground" />
                  <CardTitle className="text-base line-clamp-1">{r.title}</CardTitle>
                </div>
                {getSeverityBadge(r.severity)}
              </div>
            </CardHeader>
            <CardContent className="space-y-3">
              <p className="text-sm text-muted-foreground line-clamp-2 min-h-[40px]">{r.description}</p>
              
              <div className="grid grid-cols-2 gap-2 text-xs border-y py-2">
                <div><span className="text-muted-foreground">الاحتمالية:</span> <span className="font-medium">{probImpNames[r.probability as keyof typeof probImpNames] || r.probability}</span></div>
                <div><span className="text-muted-foreground">التأثير:</span> <span className="font-medium">{probImpNames[r.impact as keyof typeof probImpNames] || r.impact}</span></div>
                <div className="col-span-2"><span className="text-muted-foreground">الفئة:</span> {r.category}</div>
              </div>

              <div className="space-y-1 bg-muted/30 p-2 rounded text-sm">
                <p className="text-xs font-semibold text-muted-foreground">استراتيجية التخفيف</p>
                <p className="line-clamp-2">{r.mitigation || 'لا توجد استراتيجية محددة.'}</p>
              </div>

              <div className="flex items-center justify-between pt-2">
                <Select value={r.status} onChange={e => updateRisk(r.id, { status: e.target.value as RiskStatus })} className="h-8 text-xs w-28">
                  {(['Open', 'Mitigated', 'Closed'] as RiskStatus[]).map(s => <option key={s} value={s}>{statusNames[s]}</option>)}
                </Select>
                <div className="flex gap-1">
                  <Button variant="ghost" size="icon" className="h-7 w-7" onClick={() => openEdit(r)}><Pencil className="h-4 w-4" /></Button>
                  <Button variant="ghost" size="icon" className="h-7 w-7 text-destructive hover:bg-red-50" onClick={() => deleteRisk(r.id)}><Trash2 className="h-4 w-4" /></Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <Modal open={modalOpen} onClose={() => setModalOpen(false)} title={editingRisk ? 'تعديل الخطر' : 'تسجيل خطر'}>
        <div className="space-y-4">
          <div className="space-y-1"><Label>العنوان</Label><Input value={form.title} onChange={e => setForm(f => ({ ...f, title: e.target.value }))} /></div>
          <div className="space-y-1"><Label>الوصف</Label><Textarea value={form.description} onChange={e => setForm(f => ({ ...f, description: e.target.value }))} /></div>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1">
              <Label>الاحتمالية</Label>
              <Select value={form.probability} onChange={e => setForm(f => ({ ...f, probability: e.target.value as any }))}>
                {(['High', 'Medium', 'Low'] as RiskProbability[]).map(s => <option key={s} value={s}>{probImpNames[s]}</option>)}
              </Select>
            </div>
            <div className="space-y-1">
              <Label>التأثير</Label>
              <Select value={form.impact} onChange={e => setForm(f => ({ ...f, impact: e.target.value as any }))}>
                {(['High', 'Medium', 'Low'] as RiskImpact[]).map(s => <option key={s} value={s}>{probImpNames[s]}</option>)}
              </Select>
            </div>
          </div>
          <div className="space-y-1"><Label>الفئة</Label><Select value={form.category} onChange={e => setForm(f => ({ ...f, category: e.target.value }))}><option value="المنتج">المنتج</option><option value="تقني">تقني</option><option value="مالي">مالي</option><option value="قانوني">قانوني</option><option value="العملاء">العملاء</option></Select></div>
          <div className="space-y-1"><Label>استراتيجية التخفيف</Label><Textarea value={form.mitigation} onChange={e => setForm(f => ({ ...f, mitigation: e.target.value }))} /></div>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1"><Label>المالك</Label><Input value={form.owner} onChange={e => setForm(f => ({ ...f, owner: e.target.value }))} /></div>
            <div className="space-y-1"><Label>تاريخ الاستحقاق</Label><Input type="date" value={form.dueDate} onChange={e => setForm(f => ({ ...f, dueDate: e.target.value }))} /></div>
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
