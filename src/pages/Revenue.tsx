import { useState } from 'react';
import { useAppStore } from '../store';
import { Revenue, RevenueType, RevenueStatus } from '../types/market';
import { Card, CardContent } from '../components/ui/card';
import { Badge } from '../components/ui/badge';
import { Button } from '../components/ui/button';
import { Modal } from '../components/ui/modal';
import { Input, Textarea, Select, Label } from '../components/ui/form';
import { Plus, Pencil, Trash2, Banknote, TrendingUp } from 'lucide-react';
import { format } from 'date-fns';

const typeNames: Record<RevenueType, string> = {
  'One-Time': 'مرة واحدة', 'Recurring': 'متكرر (اشتراك)', 'Pilot': 'تجربة (Pilot)', 'Other': 'أخرى'
};
const statusNames: Record<RevenueStatus, string> = {
  'Expected': 'متوقع', 'Won': 'مُحصل (ربح)', 'Cancelled': 'ملغى'
};

export function RevenuePage() {
  const { revenues, customers, opportunities, offers, createRevenue, updateRevenue, deleteRevenue } = useAppStore();
  const [modalOpen, setModalOpen] = useState(false);
  const [editingRevenue, setEditingRevenue] = useState<Revenue | null>(null);
  
  const [form, setForm] = useState({
    customerId: '', opportunityId: '', offerId: '', type: 'One-Time' as RevenueType,
    amount: 0, date: '', status: 'Expected' as RevenueStatus, source: '', notes: ''
  });

  const formatCurrency = (val: number) => 
    new Intl.NumberFormat('ar-DZ', { style: 'currency', currency: 'DZD', maximumFractionDigits: 0 }).format(val);

  const openCreate = () => {
    setEditingRevenue(null);
    setForm({
      customerId: '', opportunityId: '', offerId: '', type: 'One-Time',
      amount: 0, date: format(new Date(), 'yyyy-MM-dd'), status: 'Expected', source: 'Direct', notes: ''
    });
    setModalOpen(true);
  };

  const openEdit = (r: Revenue) => {
    setEditingRevenue(r);
    setForm({
      customerId: r.customerId, opportunityId: r.opportunityId, offerId: r.offerId, type: r.type,
      amount: r.amount, date: r.date ? r.date.slice(0, 10) : '', status: r.status, source: r.source, notes: r.notes
    });
    setModalOpen(true);
  };

  const handleSave = async () => {
    if (form.amount <= 0) return;
    const data = {
      ...form,
      date: form.date ? new Date(form.date).toISOString() : ''
    };
    if (editingRevenue) await updateRevenue(editingRevenue.id, data);
    else await createRevenue(data);
    setModalOpen(false);
  };

  const wonTotal = revenues.filter(r => r.status === 'Won').reduce((acc, r) => acc + r.amount, 0);
  const expectedTotal = revenues.filter(r => r.status === 'Expected').reduce((acc, r) => acc + r.amount, 0);

  return (
    <div className="space-y-6 max-w-screen-2xl">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">الإيرادات (Revenue)</h1>
          <p className="text-sm text-muted-foreground">تتبع الإيرادات المحصلة والمتوقعة من المبيعات.</p>
        </div>
        <Button onClick={openCreate}><Plus className="mr-1.5 h-4 w-4" />تسجيل إيراد</Button>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <Card className="bg-green-50/50 border-green-200">
          <CardContent className="pt-6">
            <div className="flex items-center gap-2 text-green-700 mb-2"><Banknote className="h-4 w-4"/> <span className="text-xs font-semibold uppercase">الإيرادات المحصلة (Won)</span></div>
            <p className="text-3xl font-bold text-green-800">{formatCurrency(wonTotal)}</p>
          </CardContent>
        </Card>
        <Card className="bg-primary/5 border-primary/20">
          <CardContent className="pt-6">
            <div className="flex items-center gap-2 text-primary mb-2"><TrendingUp className="h-4 w-4"/> <span className="text-xs font-semibold uppercase">الإيرادات المتوقعة (Expected)</span></div>
            <p className="text-3xl font-bold text-primary">{formatCurrency(expectedTotal)}</p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-right">
            <thead className="bg-muted/40 text-xs uppercase text-muted-foreground border-b border-t">
              <tr>
                <th className="px-4 py-3 font-semibold">التاريخ</th>
                <th className="px-4 py-3 font-semibold">العميل / الفرصة</th>
                <th className="px-4 py-3 font-semibold">العرض والنوع</th>
                <th className="px-4 py-3 font-semibold">المبلغ</th>
                <th className="px-4 py-3 font-semibold">الحالة</th>
                <th className="px-4 py-3 font-semibold text-left">إجراءات</th>
              </tr>
            </thead>
            <tbody className="divide-y">
              {revenues.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()).map(r => {
                const customer = customers.find(c => c.id === r.customerId);
                const opp = opportunities.find(o => o.id === r.opportunityId);
                const offer = offers.find(o => o.id === r.offerId);
                
                return (
                  <tr key={r.id} className="hover:bg-muted/10">
                    <td className="px-4 py-3 text-muted-foreground whitespace-nowrap">{r.date ? format(new Date(r.date), 'yyyy/MM/dd') : '—'}</td>
                    <td className="px-4 py-3">
                      {customer && <div className="font-semibold">{customer.organization}</div>}
                      {opp && <div className="text-xs text-muted-foreground mt-0.5">{opp.title}</div>}
                      {!customer && !opp && <span className="text-muted-foreground italic">مباشر (بدون سجل)</span>}
                    </td>
                    <td className="px-4 py-3 text-xs">
                      <div>{offer?.name || '—'}</div>
                      <Badge variant="outline" className="mt-1">{typeNames[r.type]}</Badge>
                    </td>
                    <td className="px-4 py-3 font-bold text-base">{formatCurrency(r.amount)}</td>
                    <td className="px-4 py-3">
                      <Badge variant={r.status === 'Won' ? 'success' : r.status === 'Expected' ? 'default' : 'secondary'}>{statusNames[r.status]}</Badge>
                    </td>
                    <td className="px-4 py-3 text-left">
                      <Button variant="ghost" size="icon" onClick={() => openEdit(r)} className="h-7 w-7"><Pencil className="h-3.5 w-3.5" /></Button>
                      <Button variant="ghost" size="icon" className="h-7 w-7 text-destructive hover:bg-red-50" onClick={() => deleteRevenue(r.id)}><Trash2 className="h-3.5 w-3.5" /></Button>
                    </td>
                  </tr>
                );
              })}
              {revenues.length === 0 && <tr><td colSpan={6} className="px-4 py-8 text-center text-muted-foreground border-dashed border-b">لم يتم تسجيل إيرادات بعد.</td></tr>}
            </tbody>
          </table>
        </div>
      </Card>

      <Modal open={modalOpen} onClose={() => setModalOpen(false)} title={editingRevenue ? 'تعديل الإيراد' : 'تسجيل إيراد'} size="md">
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1">
              <Label>العميل</Label>
              <Select value={form.customerId} onChange={e => setForm(f => ({ ...f, customerId: e.target.value }))}>
                <option value="">غير محدد</option>
                {customers.map(c => <option key={c.id} value={c.id}>{c.organization}</option>)}
              </Select>
            </div>
            <div className="space-y-1">
              <Label>الفرصة المرتبطة</Label>
              <Select value={form.opportunityId} onChange={e => setForm(f => ({ ...f, opportunityId: e.target.value }))}>
                <option value="">غير محدد</option>
                {opportunities.map(o => <option key={o.id} value={o.id}>{o.title}</option>)}
              </Select>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1">
              <Label>العرض / المنتج</Label>
              <Select value={form.offerId} onChange={e => setForm(f => ({ ...f, offerId: e.target.value }))}>
                <option value="">غير محدد</option>
                {offers.map(o => <option key={o.id} value={o.id}>{o.name}</option>)}
              </Select>
            </div>
            <div className="space-y-1">
              <Label>نوع الإيراد</Label>
              <Select value={form.type} onChange={e => setForm(f => ({ ...f, type: e.target.value as RevenueType }))}>
                {(Object.keys(typeNames) as RevenueType[]).map(t => <option key={t} value={t}>{typeNames[t]}</option>)}
              </Select>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1"><Label>المبلغ (د.ج)</Label><Input type="number" min="0" value={form.amount} onChange={e => setForm(f => ({ ...f, amount: Number(e.target.value) }))} /></div>
            <div className="space-y-1">
              <Label>الحالة</Label>
              <Select value={form.status} onChange={e => setForm(f => ({ ...f, status: e.target.value as RevenueStatus }))}>
                {(Object.keys(statusNames) as RevenueStatus[]).map(s => <option key={s} value={s}>{statusNames[s]}</option>)}
              </Select>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1"><Label>تاريخ الإيراد</Label><Input type="date" value={form.date} onChange={e => setForm(f => ({ ...f, date: e.target.value }))} /></div>
            <div className="space-y-1"><Label>طريقة الدفع (Source)</Label><Input value={form.source} onChange={e => setForm(f => ({ ...f, source: e.target.value }))} placeholder="مثال: تحويل بنكي، كاش" /></div>
          </div>
          <div className="space-y-1"><Label>ملاحظات</Label><Textarea value={form.notes} onChange={e => setForm(f => ({ ...f, notes: e.target.value }))} /></div>
          
          <div className="flex justify-between pt-4 border-t">
            {editingRevenue ? (
              <Button variant="ghost" className="text-destructive hover:bg-red-50" onClick={() => { deleteRevenue(editingRevenue.id); setModalOpen(false); }}><Trash2 className="ml-2 h-4 w-4"/> حذف</Button>
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
