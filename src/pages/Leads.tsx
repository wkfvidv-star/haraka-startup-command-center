import { useState } from 'react';
import { useAppStore } from '../store';
import { Lead, LeadSource, LeadStatus, PriorityLevel } from '../types/market';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Badge } from '../components/ui/badge';
import { Button } from '../components/ui/button';
import { Modal } from '../components/ui/modal';
import { Input, Textarea, Select, Label } from '../components/ui/form';
import { Plus, Pencil, Trash2, UserPlus, Phone, Mail } from 'lucide-react';
import { format } from 'date-fns';

const statusNames: Record<LeadStatus, string> = {
  'New': 'جديد', 'Contacted': 'تم التواصل', 'Qualified': 'مؤهل', 'Converted': 'محول', 'Lost': 'مفقود'
};
const priorityNames: Record<PriorityLevel, string> = {
  'Critical': 'حرج', 'High': 'عالي', 'Medium': 'متوسط', 'Low': 'منخفض'
};
const sourceOptions: LeadSource[] = ['Instagram', 'TikTok', 'Facebook', 'YouTube', 'LinkedIn', 'Website', 'Referral', 'Event', 'University', 'School Outreach', 'Coach Outreach', 'Partnership', 'Direct Contact', 'Other'];

export function Leads() {
  const { leads, segments, createLead, updateLead, deleteLead } = useAppStore();
  const [modalOpen, setModalOpen] = useState(false);
  const [editingLead, setEditingLead] = useState<Lead | null>(null);
  
  const [form, setForm] = useState({
    name: '', organization: '', contactPerson: '', email: '', phone: '', city: '',
    segmentId: '', source: 'Website' as LeadSource, status: 'New' as LeadStatus,
    interestLevel: 'Medium' as PriorityLevel, owner: '', lastContactDate: '', nextFollowUpDate: '', notes: ''
  });

  const openCreate = () => {
    setEditingLead(null);
    setForm({
      name: '', organization: '', contactPerson: '', email: '', phone: '', city: '',
      segmentId: segments[0]?.id || '', source: 'Website', status: 'New', interestLevel: 'Medium',
      owner: '', lastContactDate: format(new Date(), 'yyyy-MM-dd'), nextFollowUpDate: format(new Date(), 'yyyy-MM-dd'), notes: ''
    });
    setModalOpen(true);
  };

  const openEdit = (l: Lead) => {
    setEditingLead(l);
    setForm({
      name: l.name, organization: l.organization, contactPerson: l.contactPerson, email: l.email,
      phone: l.phone, city: l.city, segmentId: l.segmentId, source: l.source, status: l.status,
      interestLevel: l.interestLevel, owner: l.owner, 
      lastContactDate: l.lastContactDate ? l.lastContactDate.slice(0, 10) : '', 
      nextFollowUpDate: l.nextFollowUpDate ? l.nextFollowUpDate.slice(0, 10) : '', 
      notes: l.notes
    });
    setModalOpen(true);
  };

  const handleSave = async () => {
    if (!form.name) return;
    const data = { 
      ...form, 
      lastContactDate: form.lastContactDate ? new Date(form.lastContactDate).toISOString() : '',
      nextFollowUpDate: form.nextFollowUpDate ? new Date(form.nextFollowUpDate).toISOString() : ''
    };
    if (editingLead) await updateLead(editingLead.id, data);
    else await createLead(data);
    setModalOpen(false);
  };

  return (
    <div className="space-y-6 max-w-screen-2xl">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">العملاء المحتملين (Leads)</h1>
          <p className="text-sm text-muted-foreground">تتبع العملاء المحتملين قبل تحويلهم إلى فرص بيع.</p>
        </div>
        <Button onClick={openCreate}><Plus className="mr-1.5 h-4 w-4" />عميل محتمل جديد</Button>
      </div>

      <Card>
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-right">
            <thead className="bg-muted/40 text-xs uppercase text-muted-foreground border-b border-t">
              <tr>
                <th className="px-4 py-3 font-semibold">الاسم / المؤسسة</th>
                <th className="px-4 py-3 font-semibold">التواصل</th>
                <th className="px-4 py-3 font-semibold">القطاع / المصدر</th>
                <th className="px-4 py-3 font-semibold">الاهتمام</th>
                <th className="px-4 py-3 font-semibold">الحالة</th>
                <th className="px-4 py-3 font-semibold">المتابعة القادمة</th>
                <th className="px-4 py-3 font-semibold text-left">إجراءات</th>
              </tr>
            </thead>
            <tbody className="divide-y">
              {leads.map(l => {
                const segment = segments.find(s => s.id === l.segmentId);
                return (
                  <tr key={l.id} className="hover:bg-muted/10">
                    <td className="px-4 py-3">
                      <p className="font-semibold text-primary">{l.name}</p>
                      <p className="text-xs text-muted-foreground">{l.organization}</p>
                    </td>
                    <td className="px-4 py-3 text-xs text-muted-foreground space-y-1">
                      <div className="flex items-center gap-1"><Mail className="h-3 w-3"/> {l.email || '—'}</div>
                      <div className="flex items-center gap-1"><Phone className="h-3 w-3"/> {l.phone || '—'}</div>
                    </td>
                    <td className="px-4 py-3 text-xs">
                      <p>{segment?.name || '—'}</p>
                      <p className="text-muted-foreground mt-0.5">{l.source}</p>
                    </td>
                    <td className="px-4 py-3">
                      <Badge variant={l.interestLevel === 'Critical' || l.interestLevel === 'High' ? 'warning' : 'outline'}>{priorityNames[l.interestLevel]}</Badge>
                    </td>
                    <td className="px-4 py-3">
                      <Badge variant={l.status === 'Converted' ? 'success' : l.status === 'Lost' ? 'destructive' : l.status === 'New' ? 'default' : 'secondary'}>
                        {statusNames[l.status]}
                      </Badge>
                    </td>
                    <td className="px-4 py-3 text-xs">
                      {l.nextFollowUpDate ? format(new Date(l.nextFollowUpDate), 'yyyy/MM/dd') : '—'}
                    </td>
                    <td className="px-4 py-3 text-left">
                      <Button variant="ghost" size="icon" onClick={() => openEdit(l)} className="h-7 w-7"><Pencil className="h-3.5 w-3.5" /></Button>
                      <Button variant="ghost" size="icon" className="h-7 w-7 text-destructive hover:bg-red-50" onClick={() => deleteLead(l.id)}><Trash2 className="h-3.5 w-3.5" /></Button>
                    </td>
                  </tr>
                );
              })}
              {leads.length === 0 && <tr><td colSpan={7} className="px-4 py-8 text-center text-muted-foreground">لا يوجد عملاء محتملين.</td></tr>}
            </tbody>
          </table>
        </div>
      </Card>

      <Modal open={modalOpen} onClose={() => setModalOpen(false)} title={editingLead ? 'تعديل العميل المحتمل' : 'عميل محتمل جديد'} size="lg">
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1"><Label>الاسم</Label><Input value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))} /></div>
            <div className="space-y-1"><Label>المؤسسة</Label><Input value={form.organization} onChange={e => setForm(f => ({ ...f, organization: e.target.value }))} /></div>
          </div>
          <div className="grid grid-cols-3 gap-4">
            <div className="space-y-1"><Label>جهة الاتصال</Label><Input value={form.contactPerson} onChange={e => setForm(f => ({ ...f, contactPerson: e.target.value }))} /></div>
            <div className="space-y-1"><Label>البريد الإلكتروني</Label><Input type="email" value={form.email} onChange={e => setForm(f => ({ ...f, email: e.target.value }))} /></div>
            <div className="space-y-1"><Label>رقم الهاتف</Label><Input value={form.phone} onChange={e => setForm(f => ({ ...f, phone: e.target.value }))} /></div>
          </div>
          <div className="grid grid-cols-3 gap-4">
            <div className="space-y-1">
              <Label>القطاع</Label>
              <Select value={form.segmentId} onChange={e => setForm(f => ({ ...f, segmentId: e.target.value }))}>
                <option value="">بدون قطاع</option>
                {segments.map(s => <option key={s.id} value={s.id}>{s.name}</option>)}
              </Select>
            </div>
            <div className="space-y-1">
              <Label>المصدر</Label>
              <Select value={form.source} onChange={e => setForm(f => ({ ...f, source: e.target.value as LeadSource }))}>
                {sourceOptions.map(s => <option key={s} value={s}>{s}</option>)}
              </Select>
            </div>
            <div className="space-y-1"><Label>المدينة</Label><Input value={form.city} onChange={e => setForm(f => ({ ...f, city: e.target.value }))} /></div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1">
              <Label>مستوى الاهتمام</Label>
              <Select value={form.interestLevel} onChange={e => setForm(f => ({ ...f, interestLevel: e.target.value as PriorityLevel }))}>
                {(Object.keys(priorityNames) as PriorityLevel[]).map(p => <option key={p} value={p}>{priorityNames[p]}</option>)}
              </Select>
            </div>
            <div className="space-y-1">
              <Label>الحالة</Label>
              <Select value={form.status} onChange={e => setForm(f => ({ ...f, status: e.target.value as LeadStatus }))}>
                {(Object.keys(statusNames) as LeadStatus[]).map(s => <option key={s} value={s}>{statusNames[s]}</option>)}
              </Select>
            </div>
          </div>
          <div className="grid grid-cols-3 gap-4">
            <div className="space-y-1"><Label>المالك</Label><Input value={form.owner} onChange={e => setForm(f => ({ ...f, owner: e.target.value }))} /></div>
            <div className="space-y-1"><Label>آخر تواصل</Label><Input type="date" value={form.lastContactDate} onChange={e => setForm(f => ({ ...f, lastContactDate: e.target.value }))} /></div>
            <div className="space-y-1"><Label>المتابعة القادمة</Label><Input type="date" value={form.nextFollowUpDate} onChange={e => setForm(f => ({ ...f, nextFollowUpDate: e.target.value }))} /></div>
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
