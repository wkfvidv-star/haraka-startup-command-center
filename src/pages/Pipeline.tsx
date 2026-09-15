import { useState } from 'react';
import { useAppStore } from '../store';
import { Opportunity, OpportunityStage } from '../types/market';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Badge } from '../components/ui/badge';
import { Button } from '../components/ui/button';
import { Modal } from '../components/ui/modal';
import { Input, Textarea, Select, Label } from '../components/ui/form';
import { Plus, Pencil, Trash2, Briefcase, Calendar, Percent, DollarSign } from 'lucide-react';
import { format } from 'date-fns';

const STAGES: OpportunityStage[] = ['Qualified', 'Proposal', 'Negotiation', 'Pilot', 'Won', 'Lost'];

const stageNames: Record<OpportunityStage, string> = {
  'Qualified': 'مؤهل', 'Proposal': 'مُقترح', 'Negotiation': 'تفاوض', 'Pilot': 'تجربة', 'Won': 'مغلق (ربح)', 'Lost': 'مغلق (خسارة)'
};

export function Pipeline() {
  const { opportunities, leads, segments, offers, createOpportunity, updateOpportunity, deleteOpportunity } = useAppStore();
  const [modalOpen, setModalOpen] = useState(false);
  const [editingOpp, setEditingOpp] = useState<Opportunity | null>(null);
  
  const [form, setForm] = useState({
    title: '', organization: '', leadId: '', segmentId: '', offerId: '', stage: 'Qualified' as OpportunityStage,
    estimatedValue: 0, probability: 10, expectedCloseDate: '', owner: '', lastActivityDate: '', nextAction: '', notes: ''
  });

  const formatCurrency = (val: number) => 
    new Intl.NumberFormat('ar-DZ', { style: 'currency', currency: 'DZD', maximumFractionDigits: 0 }).format(val);

  const openCreate = () => {
    setEditingOpp(null);
    setForm({
      title: '', organization: '', leadId: '', segmentId: segments[0]?.id || '', offerId: '', stage: 'Qualified',
      estimatedValue: 0, probability: 10, expectedCloseDate: format(new Date(Date.now() + 30 * 86400000), 'yyyy-MM-dd'),
      owner: '', lastActivityDate: format(new Date(), 'yyyy-MM-dd'), nextAction: '', notes: ''
    });
    setModalOpen(true);
  };

  const openEdit = (o: Opportunity) => {
    setEditingOpp(o);
    setForm({
      title: o.title, organization: o.organization, leadId: o.leadId, segmentId: o.segmentId, offerId: o.offerId,
      stage: o.stage, estimatedValue: o.estimatedValue, probability: o.probability,
      expectedCloseDate: o.expectedCloseDate ? o.expectedCloseDate.slice(0, 10) : '',
      owner: o.owner, lastActivityDate: o.lastActivityDate ? o.lastActivityDate.slice(0, 10) : '',
      nextAction: o.nextAction, notes: o.notes
    });
    setModalOpen(true);
  };

  const handleSave = async () => {
    if (!form.title) return;
    const data = { 
      ...form, 
      expectedCloseDate: form.expectedCloseDate ? new Date(form.expectedCloseDate).toISOString() : '',
      lastActivityDate: form.lastActivityDate ? new Date(form.lastActivityDate).toISOString() : ''
    };
    if (editingOpp) await updateOpportunity(editingOpp.id, data);
    else await createOpportunity(data);
    setModalOpen(false);
  };

  const openOpps = opportunities.filter(o => !['Won', 'Lost'].includes(o.stage));
  const totalValue = openOpps.reduce((acc, o) => acc + o.estimatedValue, 0);
  const weightedValue = openOpps.reduce((acc, o) => acc + o.weightedValue, 0);

  return (
    <div className="space-y-6 max-w-screen-2xl">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">مبيعات (Pipeline)</h1>
          <p className="text-sm text-muted-foreground">تتبع فرص البيع والمفاوضات النشطة.</p>
        </div>
        <div className="flex gap-4 items-center text-sm font-medium mr-4">
          <div className="px-3 py-1.5 bg-muted/50 rounded-md border border-border">إجمالي: <span className="text-primary font-bold">{formatCurrency(totalValue)}</span></div>
          <div className="px-3 py-1.5 bg-muted/50 rounded-md border border-border">مرجح: <span className="text-green-600 font-bold">{formatCurrency(weightedValue)}</span></div>
          <Button onClick={openCreate} className="ml-2"><Plus className="mr-1.5 h-4 w-4" />فرصة جديدة</Button>
        </div>
      </div>

      <div className="flex gap-4 overflow-x-auto pb-4 custom-scrollbar">
        {STAGES.map(stage => {
          const stageOpps = opportunities.filter(o => o.stage === stage);
          const stageValue = stageOpps.reduce((acc, o) => acc + o.estimatedValue, 0);
          
          return (
            <div key={stage} className="flex flex-col w-80 shrink-0 bg-muted/20 rounded-xl border border-border/50">
              <div className="p-3 border-b bg-card rounded-t-xl flex justify-between items-center">
                <div>
                  <h3 className="font-semibold text-sm flex items-center gap-2">
                    <span className={`w-2 h-2 rounded-full ${stage === 'Won' ? 'bg-green-500' : stage === 'Lost' ? 'bg-red-500' : 'bg-primary'}`} />
                    {stageNames[stage]}
                  </h3>
                  <p className="text-[10px] text-muted-foreground mt-0.5">{formatCurrency(stageValue)}</p>
                </div>
                <Badge variant="secondary">{stageOpps.length}</Badge>
              </div>
              <div className="p-2 space-y-2 overflow-y-auto max-h-[70vh] custom-scrollbar flex-1">
                {stageOpps.map(o => (
                  <Card key={o.id} className="hover:border-primary/40 cursor-pointer shadow-sm" onClick={() => openEdit(o)}>
                    <CardContent className="p-3 space-y-2">
                      <div className="flex justify-between items-start gap-2">
                        <p className="font-semibold text-sm leading-snug">{o.title}</p>
                        <Badge variant="outline" className="shrink-0">{o.probability}%</Badge>
                      </div>
                      <p className="text-xs text-muted-foreground flex items-center gap-1.5"><Briefcase className="h-3 w-3"/> {o.organization}</p>
                      
                      <div className="flex justify-between items-end text-xs pt-2">
                        <span className="font-bold text-primary">{formatCurrency(o.estimatedValue)}</span>
                        <span className="text-muted-foreground flex items-center gap-1"><Calendar className="h-3 w-3"/> {format(new Date(o.expectedCloseDate), 'MMM d')}</span>
                      </div>
                    </CardContent>
                  </Card>
                ))}
                {stageOpps.length === 0 && (
                  <div className="h-16 flex items-center justify-center border border-dashed rounded-lg text-muted-foreground text-[11px]">
                    فارغ
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>

      <Modal open={modalOpen} onClose={() => setModalOpen(false)} title={editingOpp ? 'تعديل الفرصة' : 'فرصة مبيعات جديدة'} size="lg">
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1"><Label>عنوان الفرصة</Label><Input value={form.title} onChange={e => setForm(f => ({ ...f, title: e.target.value }))} placeholder="مثال: رخصة 50 طالب" /></div>
            <div className="space-y-1"><Label>المؤسسة</Label><Input value={form.organization} onChange={e => setForm(f => ({ ...f, organization: e.target.value }))} /></div>
          </div>
          <div className="grid grid-cols-3 gap-4">
            <div className="space-y-1">
              <Label>العميل المحتمل (Lead)</Label>
              <Select value={form.leadId} onChange={e => setForm(f => ({ ...f, leadId: e.target.value }))}>
                <option value="">بدون (إدخال مباشر)</option>
                {leads.map(l => <option key={l.id} value={l.id}>{l.name} - {l.organization}</option>)}
              </Select>
            </div>
            <div className="space-y-1">
              <Label>القطاع</Label>
              <Select value={form.segmentId} onChange={e => setForm(f => ({ ...f, segmentId: e.target.value }))}>
                {segments.map(s => <option key={s.id} value={s.id}>{s.name}</option>)}
              </Select>
            </div>
            <div className="space-y-1">
              <Label>العرض (Offer)</Label>
              <Select value={form.offerId} onChange={e => setForm(f => ({ ...f, offerId: e.target.value }))}>
                <option value="">غير محدد</option>
                {offers.map(o => <option key={o.id} value={o.id}>{o.name}</option>)}
              </Select>
            </div>
          </div>
          <div className="grid grid-cols-3 gap-4">
            <div className="space-y-1"><Label>القيمة التقديرية (د.ج)</Label><Input type="number" value={form.estimatedValue} onChange={e => setForm(f => ({ ...f, estimatedValue: Number(e.target.value) }))} /></div>
            <div className="space-y-1"><Label>الاحتمالية (%)</Label><Input type="number" min="0" max="100" value={form.probability} onChange={e => setForm(f => ({ ...f, probability: Number(e.target.value) }))} /></div>
            <div className="space-y-1">
              <Label>المرحلة</Label>
              <Select value={form.stage} onChange={e => setForm(f => ({ ...f, stage: e.target.value as OpportunityStage }))}>
                {(Object.keys(stageNames) as OpportunityStage[]).map(s => <option key={s} value={s}>{stageNames[s]}</option>)}
              </Select>
            </div>
          </div>
          <div className="grid grid-cols-3 gap-4">
            <div className="space-y-1"><Label>المالك</Label><Input value={form.owner} onChange={e => setForm(f => ({ ...f, owner: e.target.value }))} /></div>
            <div className="space-y-1"><Label>الإغلاق المتوقع</Label><Input type="date" value={form.expectedCloseDate} onChange={e => setForm(f => ({ ...f, expectedCloseDate: e.target.value }))} /></div>
            <div className="space-y-1"><Label>الإجراء القادم</Label><Input value={form.nextAction} onChange={e => setForm(f => ({ ...f, nextAction: e.target.value }))} /></div>
          </div>
          <div className="space-y-1"><Label>ملاحظات</Label><Textarea value={form.notes} onChange={e => setForm(f => ({ ...f, notes: e.target.value }))} /></div>
          <div className="flex justify-between pt-4 border-t">
            {editingOpp ? (
              <Button variant="ghost" className="text-destructive hover:bg-red-50" onClick={() => { deleteOpportunity(editingOpp.id); setModalOpen(false); }}><Trash2 className="ml-2 h-4 w-4"/> حذف</Button>
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
