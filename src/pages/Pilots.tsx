import { useState } from 'react';
import { useAppStore } from '../store';
import { Pilot, PilotStatus, PriorityLevel } from '../types/market';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Badge } from '../components/ui/badge';
import { Button } from '../components/ui/button';
import { Modal } from '../components/ui/modal';
import { Input, Textarea, Select, Label } from '../components/ui/form';
import { Progress } from '../components/ui/progress';
import { Plus, Pencil, Trash2, Rocket, Calendar } from 'lucide-react';
import { format } from 'date-fns';

const statusNames: Record<PilotStatus, string> = {
  'Planned': 'مخطط', 'Preparation': 'تحضير', 'Active': 'نشط', 'Evaluation': 'تقييم',
  'Completed': 'مكتمل', 'Converted': 'محول (ربح)', 'Paused': 'مؤقت', 'Failed': 'فشل'
};

const priorityNames: Record<PriorityLevel, string> = {
  'Critical': 'حرج', 'High': 'عالي', 'Medium': 'متوسط', 'Low': 'منخفض'
};

export function Pilots() {
  const { pilots, segments, opportunities, createPilot, updatePilot, deletePilot } = useAppStore();
  const [modalOpen, setModalOpen] = useState(false);
  const [editingPilot, setEditingPilot] = useState<Pilot | null>(null);
  
  const [form, setForm] = useState({
    organization: '', opportunityId: '', segmentId: '', objective: '',
    startDate: '', endDate: '', status: 'Planned' as PilotStatus, participants: 0,
    successCriteria: '', participationScore: 0, satisfactionScore: 0, technicalScore: 0, objectiveScore: 0,
    result: '', conversionPotential: 'Medium' as PriorityLevel, owner: '', feedback: '', nextAction: ''
  });

  const openCreate = () => {
    setEditingPilot(null);
    setForm({
      organization: '', opportunityId: '', segmentId: segments[0]?.id || '', objective: '',
      startDate: format(new Date(), 'yyyy-MM-dd'), endDate: format(new Date(Date.now() + 14 * 86400000), 'yyyy-MM-dd'),
      status: 'Planned', participants: 10, successCriteria: '', participationScore: 0, satisfactionScore: 0,
      technicalScore: 0, objectiveScore: 0, result: '', conversionPotential: 'Medium', owner: '', feedback: '', nextAction: ''
    });
    setModalOpen(true);
  };

  const openEdit = (p: Pilot) => {
    setEditingPilot(p);
    setForm({
      organization: p.organization, opportunityId: p.opportunityId, segmentId: p.segmentId, objective: p.objective,
      startDate: p.startDate ? p.startDate.slice(0, 10) : '', endDate: p.endDate ? p.endDate.slice(0, 10) : '',
      status: p.status, participants: p.participants, successCriteria: p.successCriteria,
      participationScore: p.participationScore, satisfactionScore: p.satisfactionScore,
      technicalScore: p.technicalScore, objectiveScore: p.objectiveScore, result: p.result,
      conversionPotential: p.conversionPotential, owner: p.owner, feedback: p.feedback, nextAction: p.nextAction
    });
    setModalOpen(true);
  };

  const handleSave = async () => {
    if (!form.organization) return;
    const data = {
      ...form,
      startDate: form.startDate ? new Date(form.startDate).toISOString() : '',
      endDate: form.endDate ? new Date(form.endDate).toISOString() : ''
    };
    if (editingPilot) await updatePilot(editingPilot.id, data);
    else await createPilot(data);
    setModalOpen(false);
  };

  return (
    <div className="space-y-6 max-w-screen-2xl">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">التجارب التشغيلية (Pilots)</h1>
          <p className="text-sm text-muted-foreground">إدارة التجارب التشغيلية في الميدان وتقييم نجاحها.</p>
        </div>
        <Button onClick={openCreate}><Plus className="mr-1.5 h-4 w-4" />تجربة جديدة</Button>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        {pilots.map(p => {
          const segment = segments.find(s => s.id === p.segmentId);
          return (
            <Card key={p.id} className={p.status === 'Failed' || p.status === 'Paused' ? 'opacity-70' : ''}>
              <CardHeader className="pb-3 border-b bg-muted/20">
                <div className="flex justify-between items-start gap-4">
                  <div>
                    <CardTitle className="text-base flex items-center gap-2"><Rocket className="h-4 w-4 text-primary"/> {p.organization}</CardTitle>
                    <p className="text-xs text-muted-foreground mt-1">{segment?.name || '—'} • {p.participants} مستخدمين</p>
                  </div>
                  <Badge variant={p.status === 'Active' ? 'success' : p.status === 'Converted' ? 'default' : p.status === 'Failed' ? 'destructive' : 'secondary'}>{statusNames[p.status]}</Badge>
                </div>
              </CardHeader>
              <CardContent className="pt-4 space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <p className="text-xs font-semibold text-muted-foreground uppercase">الهدف الرئيسي</p>
                    <p className="text-sm line-clamp-2">{p.objective}</p>
                  </div>
                  <div className="space-y-1">
                    <p className="text-xs font-semibold text-muted-foreground uppercase">معايير النجاح</p>
                    <p className="text-sm line-clamp-2">{p.successCriteria}</p>
                  </div>
                </div>

                <div className="space-y-3 bg-muted/30 p-3 rounded-lg border border-border">
                  <div className="flex justify-between items-center mb-1">
                    <span className="text-xs font-bold">التقييم العام (Score)</span>
                    <span className={`text-sm font-bold ${p.overallScore >= 80 ? 'text-green-600' : p.overallScore >= 50 ? 'text-amber-500' : 'text-red-500'}`}>{p.overallScore}%</span>
                  </div>
                  <Progress value={p.overallScore} colorOverride={p.overallScore >= 80 ? 'bg-green-500' : p.overallScore >= 50 ? 'bg-amber-400' : 'bg-red-500'} className="h-2" />
                  <div className="grid grid-cols-4 gap-2 text-center text-[10px] text-muted-foreground mt-2">
                    <div>تفني: {p.technicalScore}%</div>
                    <div>مشاركة: {p.participationScore}%</div>
                    <div>رضا: {p.satisfactionScore}%</div>
                    <div>أهداف: {p.objectiveScore}%</div>
                  </div>
                </div>

                <div className="flex items-center justify-between text-xs text-muted-foreground border-t pt-3">
                  <div className="flex gap-4">
                    <span className="flex items-center gap-1"><Calendar className="h-3.5 w-3.5"/> من: {p.startDate ? format(new Date(p.startDate), 'MMM d') : '—'}</span>
                    <span className="flex items-center gap-1"><Calendar className="h-3.5 w-3.5"/> إلى: {p.endDate ? format(new Date(p.endDate), 'MMM d') : '—'}</span>
                  </div>
                  <div className="flex gap-1">
                    <Button variant="ghost" size="icon" className="h-7 w-7" onClick={() => openEdit(p)}><Pencil className="h-4 w-4" /></Button>
                    <Button variant="ghost" size="icon" className="h-7 w-7 text-destructive hover:bg-red-50" onClick={() => deletePilot(p.id)}><Trash2 className="h-4 w-4" /></Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      <Modal open={modalOpen} onClose={() => setModalOpen(false)} title={editingPilot ? 'تعديل التجربة (Pilot)' : 'تجربة جديدة'} size="lg">
        <div className="space-y-4 max-h-[80vh] overflow-y-auto custom-scrollbar pr-2">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1"><Label>المؤسسة</Label><Input value={form.organization} onChange={e => setForm(f => ({ ...f, organization: e.target.value }))} /></div>
            <div className="space-y-1">
              <Label>الفرصة المرتبطة</Label>
              <Select value={form.opportunityId} onChange={e => setForm(f => ({ ...f, opportunityId: e.target.value }))}>
                <option value="">بدون</option>
                {opportunities.map(o => <option key={o.id} value={o.id}>{o.title}</option>)}
              </Select>
            </div>
          </div>
          <div className="grid grid-cols-3 gap-4">
            <div className="space-y-1">
              <Label>القطاع</Label>
              <Select value={form.segmentId} onChange={e => setForm(f => ({ ...f, segmentId: e.target.value }))}>
                {segments.map(s => <option key={s.id} value={s.id}>{s.name}</option>)}
              </Select>
            </div>
            <div className="space-y-1"><Label>المستخدمين</Label><Input type="number" min="0" value={form.participants} onChange={e => setForm(f => ({ ...f, participants: Number(e.target.value) }))} /></div>
            <div className="space-y-1">
              <Label>الحالة</Label>
              <Select value={form.status} onChange={e => setForm(f => ({ ...f, status: e.target.value as PilotStatus }))}>
                {(Object.keys(statusNames) as PilotStatus[]).map(s => <option key={s} value={s}>{statusNames[s]}</option>)}
              </Select>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1"><Label>الهدف الأساسي</Label><Textarea value={form.objective} onChange={e => setForm(f => ({ ...f, objective: e.target.value }))} /></div>
            <div className="space-y-1"><Label>معايير النجاح</Label><Textarea value={form.successCriteria} onChange={e => setForm(f => ({ ...f, successCriteria: e.target.value }))} /></div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1"><Label>تاريخ البدء</Label><Input type="date" value={form.startDate} onChange={e => setForm(f => ({ ...f, startDate: e.target.value }))} /></div>
            <div className="space-y-1"><Label>تاريخ الانتهاء</Label><Input type="date" value={form.endDate} onChange={e => setForm(f => ({ ...f, endDate: e.target.value }))} /></div>
          </div>
          
          <div className="p-3 bg-muted/40 rounded-lg space-y-3">
            <h3 className="font-semibold text-sm">التقييم (0 - 100)</h3>
            <div className="grid grid-cols-4 gap-4">
              <div className="space-y-1"><Label className="text-xs">تقني</Label><Input type="number" min="0" max="100" value={form.technicalScore} onChange={e => setForm(f => ({ ...f, technicalScore: Number(e.target.value) }))} /></div>
              <div className="space-y-1"><Label className="text-xs">مشاركة</Label><Input type="number" min="0" max="100" value={form.participationScore} onChange={e => setForm(f => ({ ...f, participationScore: Number(e.target.value) }))} /></div>
              <div className="space-y-1"><Label className="text-xs">رضا</Label><Input type="number" min="0" max="100" value={form.satisfactionScore} onChange={e => setForm(f => ({ ...f, satisfactionScore: Number(e.target.value) }))} /></div>
              <div className="space-y-1"><Label className="text-xs">أهداف</Label><Input type="number" min="0" max="100" value={form.objectiveScore} onChange={e => setForm(f => ({ ...f, objectiveScore: Number(e.target.value) }))} /></div>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1">
              <Label>احتمالية التحويل (شراء)</Label>
              <Select value={form.conversionPotential} onChange={e => setForm(f => ({ ...f, conversionPotential: e.target.value as PriorityLevel }))}>
                {(Object.keys(priorityNames) as PriorityLevel[]).map(p => <option key={p} value={p}>{priorityNames[p]}</option>)}
              </Select>
            </div>
            <div className="space-y-1"><Label>المالك</Label><Input value={form.owner} onChange={e => setForm(f => ({ ...f, owner: e.target.value }))} /></div>
          </div>
          <div className="space-y-1"><Label>ملاحظات ومخرجات (Result)</Label><Textarea value={form.result} onChange={e => setForm(f => ({ ...f, result: e.target.value }))} /></div>

          <div className="flex justify-between pt-4 border-t">
            {editingPilot ? (
              <Button variant="ghost" className="text-destructive hover:bg-red-50" onClick={() => { deletePilot(editingPilot.id); setModalOpen(false); }}><Trash2 className="ml-2 h-4 w-4"/> حذف</Button>
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
