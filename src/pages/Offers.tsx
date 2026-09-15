import { useState } from 'react';
import { useAppStore } from '../store';
import { Offer, OfferType, BillingModel, OfferStatus } from '../types/market';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Badge } from '../components/ui/badge';
import { Button } from '../components/ui/button';
import { Modal } from '../components/ui/modal';
import { Input, Textarea, Select, Label } from '../components/ui/form';
import { Plus, Pencil, Trash2, Tag } from 'lucide-react';

const typeNames: Record<OfferType, string> = {
  'School': 'مدرسة', 'Institution': 'مؤسسة', 'Coach': 'مدرب', 'Youth': 'شباب', 'Pilot': 'تجربة', 'Video Analysis': 'تحليل فيديو', 'Report': 'تقرير', 'Custom': 'مخصص'
};
const billingNames: Record<BillingModel, string> = {
  'One-Time': 'مرة واحدة', 'Monthly': 'شهري', 'Annual': 'سنوي', 'Pilot': 'تجربة (Pilot)', 'Custom': 'مخصص'
};
const statusNames: Record<OfferStatus, string> = {
  'Active': 'نشط', 'Draft': 'مسودة', 'Archived': 'مؤرشف'
};

export function Offers() {
  const { offers, segments, createOffer, updateOffer, deleteOffer } = useAppStore();
  const [modalOpen, setModalOpen] = useState(false);
  const [editingOffer, setEditingOffer] = useState<Offer | null>(null);
  
  const [form, setForm] = useState({
    name: '', targetSegment: '', type: 'School' as OfferType, description: '',
    price: 0, billingModel: 'Annual' as BillingModel, status: 'Active' as OfferStatus, notes: ''
  });

  const formatCurrency = (val: number) => 
    new Intl.NumberFormat('ar-DZ', { style: 'currency', currency: 'DZD', maximumFractionDigits: 0 }).format(val);

  const openCreate = () => {
    setEditingOffer(null);
    setForm({ name: '', targetSegment: segments[0]?.id || '', type: 'School', description: '', price: 0, billingModel: 'Annual', status: 'Active', notes: '' });
    setModalOpen(true);
  };

  const openEdit = (o: Offer) => {
    setEditingOffer(o);
    setForm({
      name: o.name, targetSegment: o.targetSegment, type: o.type, description: o.description,
      price: o.price, billingModel: o.billingModel, status: o.status, notes: o.notes
    });
    setModalOpen(true);
  };

  const handleSave = async () => {
    if (!form.name) return;
    if (editingOffer) await updateOffer(editingOffer.id, form);
    else await createOffer(form);
    setModalOpen(false);
  };

  return (
    <div className="space-y-6 max-w-screen-xl">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">العروض والمنتجات (Offers)</h1>
          <p className="text-sm text-muted-foreground">تكوين العروض والأسعار للقطاعات المستهدفة.</p>
        </div>
        <Button onClick={openCreate}><Plus className="mr-1.5 h-4 w-4" />عرض جديد</Button>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {offers.map(o => {
          const segment = segments.find(s => s.id === o.targetSegment);
          return (
            <Card key={o.id} className={o.status === 'Archived' ? 'opacity-70' : ''}>
              <CardHeader className="pb-2 border-b bg-muted/20">
                <div className="flex justify-between items-start gap-2">
                  <div className="flex items-center gap-2">
                    <Tag className="h-4 w-4 text-primary" />
                    <CardTitle className="text-base line-clamp-1">{o.name}</CardTitle>
                  </div>
                  <Badge variant={o.status === 'Active' ? 'success' : o.status === 'Draft' ? 'secondary' : 'outline'}>{statusNames[o.status]}</Badge>
                </div>
              </CardHeader>
              <CardContent className="space-y-4 pt-4">
                <p className="text-sm text-muted-foreground line-clamp-2 min-h-[40px]">{o.description}</p>
                
                <div className="flex justify-between items-end">
                  <div className="space-y-1">
                    <p className="text-xs text-muted-foreground">السعر ({billingNames[o.billingModel]})</p>
                    <p className="font-bold text-lg text-primary">{formatCurrency(o.price)}</p>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-2 text-xs border-t pt-3">
                  <div><span className="text-muted-foreground">النوع:</span> {typeNames[o.type]}</div>
                  <div><span className="text-muted-foreground">القطاع:</span> {segment?.name || '—'}</div>
                </div>

                <div className="flex justify-end gap-1 pt-2">
                  <Button variant="ghost" size="icon" className="h-7 w-7" onClick={() => openEdit(o)}><Pencil className="h-4 w-4" /></Button>
                  <Button variant="ghost" size="icon" className="h-7 w-7 text-destructive hover:bg-red-50" onClick={() => deleteOffer(o.id)}><Trash2 className="h-4 w-4" /></Button>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      <Modal open={modalOpen} onClose={() => setModalOpen(false)} title={editingOffer ? 'تعديل العرض' : 'عرض جديد'} size="md">
        <div className="space-y-4">
          <div className="space-y-1"><Label>الاسم</Label><Input value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))} /></div>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1">
              <Label>القطاع المستهدف</Label>
              <Select value={form.targetSegment} onChange={e => setForm(f => ({ ...f, targetSegment: e.target.value }))}>
                {segments.map(s => <option key={s.id} value={s.id}>{s.name}</option>)}
              </Select>
            </div>
            <div className="space-y-1">
              <Label>النوع</Label>
              <Select value={form.type} onChange={e => setForm(f => ({ ...f, type: e.target.value as OfferType }))}>
                {(Object.keys(typeNames) as OfferType[]).map(t => <option key={t} value={t}>{typeNames[t]}</option>)}
              </Select>
            </div>
          </div>
          <div className="space-y-1"><Label>الوصف</Label><Textarea value={form.description} onChange={e => setForm(f => ({ ...f, description: e.target.value }))} /></div>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1"><Label>السعر (د.ج)</Label><Input type="number" min="0" value={form.price} onChange={e => setForm(f => ({ ...f, price: Number(e.target.value) }))} /></div>
            <div className="space-y-1">
              <Label>نموذج الدفع</Label>
              <Select value={form.billingModel} onChange={e => setForm(f => ({ ...f, billingModel: e.target.value as BillingModel }))}>
                {(Object.keys(billingNames) as BillingModel[]).map(b => <option key={b} value={b}>{billingNames[b]}</option>)}
              </Select>
            </div>
          </div>
          <div className="space-y-1">
            <Label>الحالة</Label>
            <Select value={form.status} onChange={e => setForm(f => ({ ...f, status: e.target.value as OfferStatus }))}>
              {(Object.keys(statusNames) as OfferStatus[]).map(s => <option key={s} value={s}>{statusNames[s]}</option>)}
            </Select>
          </div>
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
