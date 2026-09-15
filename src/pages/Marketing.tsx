import { useState } from 'react';
import { useAppStore } from '../store';
import { Campaign, CampaignStatus, LeadSource } from '../types/market';
import { Card, CardContent } from '../components/ui/card';
import { Badge } from '../components/ui/badge';
import { Button } from '../components/ui/button';
import { Modal } from '../components/ui/modal';
import { Input, Textarea, Select, Label } from '../components/ui/form';
import { Progress } from '../components/ui/progress';
import { Plus, Pencil, Trash2, Megaphone, Target, Users } from 'lucide-react';
import { format } from 'date-fns';

const statusNames: Record<CampaignStatus, string> = {
  'Planned': 'مخطط', 'Active': 'نشط', 'Completed': 'مكتمل', 'Paused': 'مؤقت', 'Cancelled': 'ملغى'
};

const channelOptions: LeadSource[] = ['Instagram', 'TikTok', 'Facebook', 'YouTube', 'LinkedIn', 'Website', 'Referral', 'Event', 'University', 'School Outreach', 'Coach Outreach', 'Partnership', 'Direct Contact', 'Other'];

export function Marketing() {
  const { campaigns, segments, createCampaign, updateCampaign, deleteCampaign } = useAppStore();
  const [modalOpen, setModalOpen] = useState(false);
  const [editingCampaign, setEditingCampaign] = useState<Campaign | null>(null);
  
  const [form, setForm] = useState({
    name: '', objective: '', channel: 'Instagram' as LeadSource, segmentId: '',
    startDate: '', endDate: '', budget: 0, status: 'Planned' as CampaignStatus,
    leadsGenerated: 0, opportunitiesGenerated: 0, customersGenerated: 0, revenueGenerated: 0, notes: ''
  });

  const formatCurrency = (val: number) => 
    new Intl.NumberFormat('ar-DZ', { style: 'currency', currency: 'DZD', maximumFractionDigits: 0 }).format(val);

  const openCreate = () => {
    setEditingCampaign(null);
    setForm({
      name: '', objective: '', channel: 'Instagram', segmentId: segments[0]?.id || '',
      startDate: format(new Date(), 'yyyy-MM-dd'), endDate: format(new Date(Date.now() + 30 * 86400000), 'yyyy-MM-dd'),
      budget: 0, status: 'Planned', leadsGenerated: 0, opportunitiesGenerated: 0, customersGenerated: 0, revenueGenerated: 0, notes: ''
    });
    setModalOpen(true);
  };

  const openEdit = (c: Campaign) => {
    setEditingCampaign(c);
    setForm({
      name: c.name, objective: c.objective, channel: c.channel, segmentId: c.segmentId,
      startDate: c.startDate ? c.startDate.slice(0, 10) : '', endDate: c.endDate ? c.endDate.slice(0, 10) : '',
      budget: c.budget, status: c.status, leadsGenerated: c.leadsGenerated,
      opportunitiesGenerated: c.opportunitiesGenerated, customersGenerated: c.customersGenerated,
      revenueGenerated: c.revenueGenerated, notes: c.notes
    });
    setModalOpen(true);
  };

  const handleSave = async () => {
    if (!form.name) return;
    const data = {
      ...form,
      startDate: form.startDate ? new Date(form.startDate).toISOString() : '',
      endDate: form.endDate ? new Date(form.endDate).toISOString() : ''
    };
    if (editingCampaign) await updateCampaign(editingCampaign.id, data);
    else await createCampaign(data);
    setModalOpen(false);
  };

  return (
    <div className="space-y-6 max-w-screen-2xl">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">التسويق والحملات</h1>
          <p className="text-sm text-muted-foreground">إدارة الحملات الإعلانية والتسويقية وتحليل نتائجها.</p>
        </div>
        <Button onClick={openCreate}><Plus className="mr-1.5 h-4 w-4" />حملة جديدة</Button>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        {campaigns.map(c => {
          const segment = segments.find(s => s.id === c.segmentId);
          const roi = c.budget > 0 ? ((c.revenueGenerated - c.budget) / c.budget) * 100 : 0;
          return (
            <Card key={c.id} className={c.status === 'Cancelled' ? 'opacity-70' : ''}>
              <div className="p-4 border-b flex justify-between items-start">
                <div>
                  <h3 className="font-semibold text-lg flex items-center gap-2"><Megaphone className="h-5 w-5 text-primary"/> {c.name}</h3>
                  <p className="text-xs text-muted-foreground mt-1">{c.objective}</p>
                </div>
                <Badge variant={c.status === 'Active' ? 'success' : c.status === 'Completed' ? 'default' : 'secondary'}>{statusNames[c.status]}</Badge>
              </div>
              <CardContent className="pt-4 space-y-4">
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div><span className="text-muted-foreground">القناة:</span> <span className="font-medium">{c.channel}</span></div>
                  <div><span className="text-muted-foreground">القطاع:</span> <span className="font-medium">{segment?.name || '—'}</span></div>
                  <div><span className="text-muted-foreground">الميزانية:</span> <span className="font-bold text-red-600">{formatCurrency(c.budget)}</span></div>
                  <div><span className="text-muted-foreground">الإيراد المولد:</span> <span className="font-bold text-green-600">{formatCurrency(c.revenueGenerated)}</span></div>
                </div>

                <div className="p-3 bg-muted/30 rounded-lg border border-border">
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-xs font-semibold">معدل العائد على الاستثمار (ROI)</span>
                    <span className={`text-sm font-bold ${roi > 0 ? 'text-green-600' : roi < 0 ? 'text-red-500' : ''}`}>{roi.toFixed(1)}%</span>
                  </div>
                  <div className="grid grid-cols-3 gap-2 text-center">
                    <div className="bg-background p-2 rounded border">
                      <p className="text-[10px] text-muted-foreground">عملاء محتملين</p>
                      <p className="font-bold text-lg">{c.leadsGenerated}</p>
                    </div>
                    <div className="bg-background p-2 rounded border">
                      <p className="text-[10px] text-muted-foreground">فرص (Opps)</p>
                      <p className="font-bold text-lg">{c.opportunitiesGenerated}</p>
                    </div>
                    <div className="bg-background p-2 rounded border">
                      <p className="text-[10px] text-muted-foreground">عملاء فعليين</p>
                      <p className="font-bold text-lg text-primary">{c.customersGenerated}</p>
                    </div>
                  </div>
                </div>

                <div className="flex justify-between items-center text-xs text-muted-foreground pt-2">
                  <span>من {c.startDate ? format(new Date(c.startDate), 'yyyy/MM/dd') : '—'} إلى {c.endDate ? format(new Date(c.endDate), 'yyyy/MM/dd') : '—'}</span>
                  <div className="flex gap-1">
                    <Button variant="ghost" size="icon" className="h-7 w-7" onClick={() => openEdit(c)}><Pencil className="h-4 w-4" /></Button>
                    <Button variant="ghost" size="icon" className="h-7 w-7 text-destructive hover:bg-red-50" onClick={() => deleteCampaign(c.id)}><Trash2 className="h-4 w-4" /></Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      <Modal open={modalOpen} onClose={() => setModalOpen(false)} title={editingCampaign ? 'تعديل الحملة' : 'حملة جديدة'} size="lg">
        <div className="space-y-4 max-h-[80vh] overflow-y-auto custom-scrollbar pr-2">
          <div className="space-y-1"><Label>اسم الحملة</Label><Input value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))} /></div>
          <div className="space-y-1"><Label>الهدف</Label><Input value={form.objective} onChange={e => setForm(f => ({ ...f, objective: e.target.value }))} placeholder="مثال: زيادة الوعي، جمع 50 عميل محتمل" /></div>
          
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1">
              <Label>القناة / المصدر</Label>
              <Select value={form.channel} onChange={e => setForm(f => ({ ...f, channel: e.target.value as LeadSource }))}>
                {channelOptions.map(c => <option key={c} value={c}>{c}</option>)}
              </Select>
            </div>
            <div className="space-y-1">
              <Label>القطاع المستهدف</Label>
              <Select value={form.segmentId} onChange={e => setForm(f => ({ ...f, segmentId: e.target.value }))}>
                <option value="">كل القطاعات</option>
                {segments.map(s => <option key={s.id} value={s.id}>{s.name}</option>)}
              </Select>
            </div>
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1"><Label>تاريخ البدء</Label><Input type="date" value={form.startDate} onChange={e => setForm(f => ({ ...f, startDate: e.target.value }))} /></div>
            <div className="space-y-1"><Label>تاريخ الانتهاء</Label><Input type="date" value={form.endDate} onChange={e => setForm(f => ({ ...f, endDate: e.target.value }))} /></div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1"><Label>الميزانية (د.ج)</Label><Input type="number" min="0" value={form.budget} onChange={e => setForm(f => ({ ...f, budget: Number(e.target.value) }))} /></div>
            <div className="space-y-1">
              <Label>الحالة</Label>
              <Select value={form.status} onChange={e => setForm(f => ({ ...f, status: e.target.value as CampaignStatus }))}>
                {(Object.keys(statusNames) as CampaignStatus[]).map(s => <option key={s} value={s}>{statusNames[s]}</option>)}
              </Select>
            </div>
          </div>

          <div className="p-4 border rounded-lg bg-muted/20 space-y-4">
            <h3 className="font-semibold text-sm">نتائج الحملة</h3>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1"><Label className="text-xs">عملاء محتملين</Label><Input type="number" min="0" value={form.leadsGenerated} onChange={e => setForm(f => ({ ...f, leadsGenerated: Number(e.target.value) }))} /></div>
              <div className="space-y-1"><Label className="text-xs">فرص بيع</Label><Input type="number" min="0" value={form.opportunitiesGenerated} onChange={e => setForm(f => ({ ...f, opportunitiesGenerated: Number(e.target.value) }))} /></div>
              <div className="space-y-1"><Label className="text-xs">عملاء فعليين</Label><Input type="number" min="0" value={form.customersGenerated} onChange={e => setForm(f => ({ ...f, customersGenerated: Number(e.target.value) }))} /></div>
              <div className="space-y-1"><Label className="text-xs">الإيراد (د.ج)</Label><Input type="number" min="0" value={form.revenueGenerated} onChange={e => setForm(f => ({ ...f, revenueGenerated: Number(e.target.value) }))} /></div>
            </div>
          </div>

          <div className="space-y-1"><Label>ملاحظات</Label><Textarea value={form.notes} onChange={e => setForm(f => ({ ...f, notes: e.target.value }))} /></div>

          <div className="flex justify-between pt-4 border-t">
            {editingCampaign ? (
              <Button variant="ghost" className="text-destructive hover:bg-red-50" onClick={() => { deleteCampaign(editingCampaign.id); setModalOpen(false); }}><Trash2 className="ml-2 h-4 w-4"/> حذف</Button>
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
