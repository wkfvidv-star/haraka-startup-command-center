import { useState } from 'react';
import { useAppStore } from '../store';
import { Partnership, PartnershipType, PartnershipStatus } from '../types/market';
import { Card, CardContent } from '../components/ui/card';
import { Badge } from '../components/ui/badge';
import { Button } from '../components/ui/button';
import { Modal } from '../components/ui/modal';
import { Input, Textarea, Select, Label } from '../components/ui/form';
import { Plus, Pencil, Trash2, Handshake } from 'lucide-react';

const typeNames: Record<PartnershipType, string> = {
  'School': 'مدرسة', 'University': 'جامعة', 'Club': 'نادي رياضي', 'Coach': 'مدرب', 
  'Association': 'جمعية', 'Technology': 'شريك تقني', 'Media': 'إعلام', 'Institution': 'مؤسسة حكومية', 'Other': 'أخرى'
};
const statusNames: Record<PartnershipStatus, string> = {
  'Identified': 'تم التحديد', 'Contacted': 'تم التواصل', 'Discussion': 'قيد النقاش', 
  'Negotiation': 'تفاوض', 'Active': 'شراكة نشطة', 'Inactive': 'غير نشط'
};

export function Partnerships() {
  const { partnerships, createPartnership, updatePartnership, deletePartnership } = useAppStore();
  const [modalOpen, setModalOpen] = useState(false);
  const [editingPartnership, setEditingPartnership] = useState<Partnership | null>(null);
  
  const [form, setForm] = useState({
    name: '', organization: '', type: 'School' as PartnershipType, contactPerson: '',
    status: 'Identified' as PartnershipStatus, objective: '', potentialValue: 0,
    owner: '', nextAction: '', notes: ''
  });

  const formatCurrency = (val: number) => 
    new Intl.NumberFormat('ar-DZ', { style: 'currency', currency: 'DZD', maximumFractionDigits: 0 }).format(val);

  const openCreate = () => {
    setEditingPartnership(null);
    setForm({
      name: '', organization: '', type: 'School', contactPerson: '',
      status: 'Identified', objective: '', potentialValue: 0,
      owner: '', nextAction: '', notes: ''
    });
    setModalOpen(true);
  };

  const openEdit = (p: Partnership) => {
    setEditingPartnership(p);
    setForm({
      name: p.name, organization: p.organization, type: p.type, contactPerson: p.contactPerson,
      status: p.status, objective: p.objective, potentialValue: p.potentialValue,
      owner: p.owner, nextAction: p.nextAction, notes: p.notes
    });
    setModalOpen(true);
  };

  const handleSave = async () => {
    if (!form.name) return;
    if (editingPartnership) await updatePartnership(editingPartnership.id, form);
    else await createPartnership(form);
    setModalOpen(false);
  };

  return (
    <div className="space-y-6 max-w-screen-xl">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">الشراكات الاستراتيجية</h1>
          <p className="text-sm text-muted-foreground">بناء علاقات مع المؤسسات والجهات لدعم النمو.</p>
        </div>
        <Button onClick={openCreate}><Plus className="mr-1.5 h-4 w-4" />شراكة جديدة</Button>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {partnerships.map(p => (
          <Card key={p.id} className={p.status === 'Inactive' ? 'opacity-70' : ''}>
            <div className="p-4 border-b flex justify-between items-start bg-muted/5">
              <div>
                <h3 className="font-semibold text-base flex items-center gap-2"><Handshake className="h-4 w-4 text-primary"/> {p.name}</h3>
                <p className="text-xs text-muted-foreground mt-0.5">{p.organization}</p>
              </div>
              <Badge variant={p.status === 'Active' ? 'success' : p.status === 'Inactive' ? 'secondary' : 'default'}>{statusNames[p.status]}</Badge>
            </div>
            <CardContent className="pt-4 space-y-3 text-sm">
              <div className="grid grid-cols-2 gap-2 text-xs text-muted-foreground mb-2">
                <div>النوع: <span className="font-medium text-foreground">{typeNames[p.type]}</span></div>
                <div>الاتصال: <span className="font-medium text-foreground">{p.contactPerson}</span></div>
              </div>
              
              <div className="bg-primary/5 p-2 rounded border border-primary/10">
                <span className="text-xs font-semibold text-primary">الهدف الاستراتيجي</span>
                <p className="mt-1 line-clamp-2">{p.objective}</p>
              </div>

              {p.potentialValue > 0 && (
                <div className="font-semibold text-xs text-green-600 mt-2">القيمة التقديرية: {formatCurrency(p.potentialValue)}</div>
              )}

              <div className="flex justify-between items-center text-xs text-muted-foreground border-t pt-3">
                <span className="line-clamp-1 max-w-[150px]">التالي: {p.nextAction || '—'}</span>
                <div className="flex gap-1 shrink-0">
                  <Button variant="ghost" size="icon" className="h-7 w-7" onClick={() => openEdit(p)}><Pencil className="h-3.5 w-3.5" /></Button>
                  <Button variant="ghost" size="icon" className="h-7 w-7 text-destructive hover:bg-red-50" onClick={() => deletePartnership(p.id)}><Trash2 className="h-3.5 w-3.5" /></Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
        {partnerships.length === 0 && <div className="col-span-full p-8 text-center text-muted-foreground border border-dashed rounded-lg">لا توجد شراكات مسجلة.</div>}
      </div>

      <Modal open={modalOpen} onClose={() => setModalOpen(false)} title={editingPartnership ? 'تعديل الشراكة' : 'شراكة جديدة'} size="md">
        <div className="space-y-4">
          <div className="space-y-1"><Label>اسم الشراكة / المبادرة</Label><Input value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))} /></div>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1"><Label>المؤسسة / الجهة</Label><Input value={form.organization} onChange={e => setForm(f => ({ ...f, organization: e.target.value }))} /></div>
            <div className="space-y-1">
              <Label>النوع</Label>
              <Select value={form.type} onChange={e => setForm(f => ({ ...f, type: e.target.value as PartnershipType }))}>
                {(Object.keys(typeNames) as PartnershipType[]).map(t => <option key={t} value={t}>{typeNames[t]}</option>)}
              </Select>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1"><Label>جهة الاتصال الرئيسية</Label><Input value={form.contactPerson} onChange={e => setForm(f => ({ ...f, contactPerson: e.target.value }))} /></div>
            <div className="space-y-1">
              <Label>الحالة</Label>
              <Select value={form.status} onChange={e => setForm(f => ({ ...f, status: e.target.value as PartnershipStatus }))}>
                {(Object.keys(statusNames) as PartnershipStatus[]).map(s => <option key={s} value={s}>{statusNames[s]}</option>)}
              </Select>
            </div>
          </div>
          <div className="space-y-1"><Label>الهدف من الشراكة</Label><Textarea value={form.objective} onChange={e => setForm(f => ({ ...f, objective: e.target.value }))} /></div>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1"><Label>القيمة التقديرية (إن وجدت)</Label><Input type="number" min="0" value={form.potentialValue} onChange={e => setForm(f => ({ ...f, potentialValue: Number(e.target.value) }))} /></div>
            <div className="space-y-1"><Label>المالك (المسؤول)</Label><Input value={form.owner} onChange={e => setForm(f => ({ ...f, owner: e.target.value }))} /></div>
          </div>
          <div className="space-y-1"><Label>الإجراء القادم</Label><Input value={form.nextAction} onChange={e => setForm(f => ({ ...f, nextAction: e.target.value }))} /></div>
          <div className="space-y-1"><Label>ملاحظات</Label><Textarea value={form.notes} onChange={e => setForm(f => ({ ...f, notes: e.target.value }))} /></div>
          <div className="flex justify-between pt-4 border-t">
            {editingPartnership ? (
              <Button variant="ghost" className="text-destructive hover:bg-red-50" onClick={() => { deletePartnership(editingPartnership.id); setModalOpen(false); }}><Trash2 className="ml-2 h-4 w-4"/> حذف</Button>
            ) : <div/>}
            <div className="flex gap-2">
              <Button variant="outline" onClick={() => setModalOpen(false)}>إلغاء</Button>
              <Button onClick={handleSave}>حفظ</Button>
            </div>
          </div>
        </div>
      </Modal>
    </div>
  );
}
