import { useState } from 'react';
import { useAppStore } from '../store';
import { Customer, CustomerStatus, BillingModel, PriorityLevel } from '../types/market';
import { Card, CardContent } from '../components/ui/card';
import { Badge } from '../components/ui/badge';
import { Button } from '../components/ui/button';
import { Modal } from '../components/ui/modal';
import { Input, Textarea, Select, Label } from '../components/ui/form';
import { Plus, Pencil, Trash2, Building, Mail, Users } from 'lucide-react';
import { format } from 'date-fns';

const statusNames: Record<CustomerStatus, string> = {
  'Active': 'نشط', 'At Risk': 'في خطر', 'Renewal': 'تجديد', 'Churned': 'توقف (خسارة)'
};
const billingNames: Record<BillingModel, string> = {
  'One-Time': 'مرة واحدة', 'Monthly': 'شهري', 'Annual': 'سنوي', 'Pilot': 'تجربة', 'Custom': 'مخصص'
};
const priorityNames: Record<PriorityLevel, string> = {
  'Critical': 'حرج (ممتاز)', 'High': 'عالي (جيد جداً)', 'Medium': 'متوسط', 'Low': 'منخفض (ضعيف)'
};

export function Customers() {
  const { customers, segments, offers, createCustomer, updateCustomer, deleteCustomer } = useAppStore();
  const [modalOpen, setModalOpen] = useState(false);
  const [editingCustomer, setEditingCustomer] = useState<Customer | null>(null);
  
  const [form, setForm] = useState({
    organization: '', contactPerson: '', email: '', phone: '', segmentId: '', offerId: '',
    status: 'Active' as CustomerStatus, contractValue: 0, billingModel: 'Annual' as BillingModel,
    startDate: '', renewalDate: '', activeUsers: 0, satisfaction: 'High' as PriorityLevel,
    renewalProbability: 90, lastActivityDate: '', nextAction: '', notes: ''
  });

  const formatCurrency = (val: number) => 
    new Intl.NumberFormat('ar-DZ', { style: 'currency', currency: 'DZD', maximumFractionDigits: 0 }).format(val);

  const openCreate = () => {
    setEditingCustomer(null);
    setForm({
      organization: '', contactPerson: '', email: '', phone: '', segmentId: segments[0]?.id || '', offerId: '',
      status: 'Active', contractValue: 0, billingModel: 'Annual', startDate: format(new Date(), 'yyyy-MM-dd'),
      renewalDate: format(new Date(Date.now() + 365 * 86400000), 'yyyy-MM-dd'), activeUsers: 1, satisfaction: 'High',
      renewalProbability: 90, lastActivityDate: format(new Date(), 'yyyy-MM-dd'), nextAction: '', notes: ''
    });
    setModalOpen(true);
  };

  const openEdit = (c: Customer) => {
    setEditingCustomer(c);
    setForm({
      organization: c.organization, contactPerson: c.contactPerson, email: c.email, phone: c.phone,
      segmentId: c.segmentId, offerId: c.offerId, status: c.status, contractValue: c.contractValue,
      billingModel: c.billingModel, startDate: c.startDate ? c.startDate.slice(0, 10) : '',
      renewalDate: c.renewalDate ? c.renewalDate.slice(0, 10) : '', activeUsers: c.activeUsers,
      satisfaction: c.satisfaction, renewalProbability: c.renewalProbability,
      lastActivityDate: c.lastActivityDate ? c.lastActivityDate.slice(0, 10) : '', nextAction: c.nextAction, notes: c.notes
    });
    setModalOpen(true);
  };

  const handleSave = async () => {
    if (!form.organization) return;
    const data = {
      ...form,
      startDate: form.startDate ? new Date(form.startDate).toISOString() : '',
      renewalDate: form.renewalDate ? new Date(form.renewalDate).toISOString() : '',
      lastActivityDate: form.lastActivityDate ? new Date(form.lastActivityDate).toISOString() : ''
    };
    if (editingCustomer) await updateCustomer(editingCustomer.id, data);
    else await createCustomer(data);
    setModalOpen(false);
  };

  return (
    <div className="space-y-6 max-w-screen-2xl">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">العملاء (Customers)</h1>
          <p className="text-sm text-muted-foreground">إدارة الاشتراكات والتجديدات والعقود النشطة.</p>
        </div>
        <Button onClick={openCreate}><Plus className="mr-1.5 h-4 w-4" />عميل جديد</Button>
      </div>

      <Card>
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-right">
            <thead className="bg-muted/40 text-xs uppercase text-muted-foreground border-b border-t">
              <tr>
                <th className="px-4 py-3 font-semibold">المؤسسة / الاتصال</th>
                <th className="px-4 py-3 font-semibold">العرض والقطاع</th>
                <th className="px-4 py-3 font-semibold">العقد والمستخدمين</th>
                <th className="px-4 py-3 font-semibold">الرضا والتجديد</th>
                <th className="px-4 py-3 font-semibold">الحالة</th>
                <th className="px-4 py-3 font-semibold text-left">إجراءات</th>
              </tr>
            </thead>
            <tbody className="divide-y">
              {customers.map(c => {
                const segment = segments.find(s => s.id === c.segmentId);
                const offer = offers.find(o => o.id === c.offerId);
                return (
                  <tr key={c.id} className="hover:bg-muted/10">
                    <td className="px-4 py-3">
                      <p className="font-semibold text-primary flex items-center gap-1.5"><Building className="h-3.5 w-3.5"/> {c.organization}</p>
                      <p className="text-xs text-muted-foreground mt-0.5">{c.contactPerson}</p>
                      <div className="flex items-center gap-1 text-xs text-muted-foreground mt-1"><Mail className="h-3 w-3"/> {c.email || '—'}</div>
                    </td>
                    <td className="px-4 py-3 text-xs">
                      <p className="font-medium">{offer?.name || '—'}</p>
                      <p className="text-muted-foreground">{segment?.name || '—'}</p>
                    </td>
                    <td className="px-4 py-3">
                      <p className="font-bold text-green-700">{formatCurrency(c.contractValue)} <span className="text-[10px] text-muted-foreground font-normal">/ {billingNames[c.billingModel]}</span></p>
                      <p className="text-xs text-muted-foreground flex items-center gap-1 mt-1"><Users className="h-3 w-3"/> {c.activeUsers} مستخدمين</p>
                    </td>
                    <td className="px-4 py-3 text-xs space-y-1">
                      <div>الرضا: <span className="font-medium">{priorityNames[c.satisfaction]}</span></div>
                      <div>التجديد: <span className="font-medium">{c.renewalProbability}%</span></div>
                      <div className="text-[10px] text-muted-foreground pt-1">في: {c.renewalDate ? format(new Date(c.renewalDate), 'yyyy/MM/dd') : '—'}</div>
                    </td>
                    <td className="px-4 py-3">
                      <Badge variant={c.status === 'Active' ? 'success' : c.status === 'At Risk' ? 'destructive' : c.status === 'Renewal' ? 'warning' : 'secondary'}>
                        {statusNames[c.status]}
                      </Badge>
                    </td>
                    <td className="px-4 py-3 text-left">
                      <Button variant="ghost" size="icon" onClick={() => openEdit(c)} className="h-7 w-7"><Pencil className="h-3.5 w-3.5" /></Button>
                      <Button variant="ghost" size="icon" className="h-7 w-7 text-destructive hover:bg-red-50" onClick={() => deleteCustomer(c.id)}><Trash2 className="h-3.5 w-3.5" /></Button>
                    </td>
                  </tr>
                );
              })}
              {customers.length === 0 && <tr><td colSpan={6} className="px-4 py-8 text-center text-muted-foreground border-dashed border-b">لا يوجد عملاء نشطين.</td></tr>}
            </tbody>
          </table>
        </div>
      </Card>

      <Modal open={modalOpen} onClose={() => setModalOpen(false)} title={editingCustomer ? 'تعديل العميل' : 'إضافة عميل جديد'} size="lg">
        <div className="space-y-4 max-h-[80vh] overflow-y-auto custom-scrollbar pr-2">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1"><Label>المؤسسة</Label><Input value={form.organization} onChange={e => setForm(f => ({ ...f, organization: e.target.value }))} /></div>
            <div className="space-y-1"><Label>جهة الاتصال</Label><Input value={form.contactPerson} onChange={e => setForm(f => ({ ...f, contactPerson: e.target.value }))} /></div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1"><Label>البريد الإلكتروني</Label><Input type="email" value={form.email} onChange={e => setForm(f => ({ ...f, email: e.target.value }))} /></div>
            <div className="space-y-1"><Label>الهاتف</Label><Input value={form.phone} onChange={e => setForm(f => ({ ...f, phone: e.target.value }))} /></div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1">
              <Label>القطاع</Label>
              <Select value={form.segmentId} onChange={e => setForm(f => ({ ...f, segmentId: e.target.value }))}>
                {segments.map(s => <option key={s.id} value={s.id}>{s.name}</option>)}
              </Select>
            </div>
            <div className="space-y-1">
              <Label>العرض / المنتج</Label>
              <Select value={form.offerId} onChange={e => setForm(f => ({ ...f, offerId: e.target.value }))}>
                <option value="">غير محدد</option>
                {offers.map(o => <option key={o.id} value={o.id}>{o.name}</option>)}
              </Select>
            </div>
          </div>
          <div className="grid grid-cols-3 gap-4">
            <div className="space-y-1"><Label>قيمة العقد (د.ج)</Label><Input type="number" value={form.contractValue} onChange={e => setForm(f => ({ ...f, contractValue: Number(e.target.value) }))} /></div>
            <div className="space-y-1">
              <Label>نظام الدفع</Label>
              <Select value={form.billingModel} onChange={e => setForm(f => ({ ...f, billingModel: e.target.value as BillingModel }))}>
                {(Object.keys(billingNames) as BillingModel[]).map(b => <option key={b} value={b}>{billingNames[b]}</option>)}
              </Select>
            </div>
            <div className="space-y-1"><Label>مستخدمين نشطين</Label><Input type="number" value={form.activeUsers} onChange={e => setForm(f => ({ ...f, activeUsers: Number(e.target.value) }))} /></div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1"><Label>تاريخ البدء</Label><Input type="date" value={form.startDate} onChange={e => setForm(f => ({ ...f, startDate: e.target.value }))} /></div>
            <div className="space-y-1"><Label>تاريخ التجديد</Label><Input type="date" value={form.renewalDate} onChange={e => setForm(f => ({ ...f, renewalDate: e.target.value }))} /></div>
          </div>
          <div className="grid grid-cols-3 gap-4">
            <div className="space-y-1">
              <Label>الحالة</Label>
              <Select value={form.status} onChange={e => setForm(f => ({ ...f, status: e.target.value as CustomerStatus }))}>
                {(Object.keys(statusNames) as CustomerStatus[]).map(s => <option key={s} value={s}>{statusNames[s]}</option>)}
              </Select>
            </div>
            <div className="space-y-1">
              <Label>الرضا</Label>
              <Select value={form.satisfaction} onChange={e => setForm(f => ({ ...f, satisfaction: e.target.value as PriorityLevel }))}>
                {(Object.keys(priorityNames) as PriorityLevel[]).map(p => <option key={p} value={p}>{priorityNames[p]}</option>)}
              </Select>
            </div>
            <div className="space-y-1"><Label>احتمال التجديد (%)</Label><Input type="number" min="0" max="100" value={form.renewalProbability} onChange={e => setForm(f => ({ ...f, renewalProbability: Number(e.target.value) }))} /></div>
          </div>
          <div className="space-y-1"><Label>الإجراء القادم</Label><Input value={form.nextAction} onChange={e => setForm(f => ({ ...f, nextAction: e.target.value }))} /></div>
          <div className="space-y-1"><Label>ملاحظات</Label><Textarea value={form.notes} onChange={e => setForm(f => ({ ...f, notes: e.target.value }))} /></div>

          <div className="flex justify-between pt-4 border-t">
            {editingCustomer ? (
              <Button variant="ghost" className="text-destructive hover:bg-red-50" onClick={() => { deleteCustomer(editingCustomer.id); setModalOpen(false); }}><Trash2 className="ml-2 h-4 w-4"/> حذف</Button>
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
