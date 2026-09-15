import { useState } from 'react';
import { useAppStore } from '../store';
import { Content, ContentStatus, LeadSource } from '../types/market';
import { Card, CardContent } from '../components/ui/card';
import { Badge } from '../components/ui/badge';
import { Button } from '../components/ui/button';
import { Modal } from '../components/ui/modal';
import { Input, Textarea, Select, Label } from '../components/ui/form';
import { Plus, Pencil, Trash2, FileText, Image, Video, Globe } from 'lucide-react';
import { format } from 'date-fns';

const statusNames: Record<ContentStatus, string> = {
  'Idea': 'فكرة', 'Draft': 'مسودة', 'Review': 'مراجعة', 'Approved': 'معتمد', 'Published': 'منشور', 'Archived': 'مؤرشف'
};
const platformOptions: LeadSource[] = ['Instagram', 'TikTok', 'Facebook', 'YouTube', 'LinkedIn', 'Website', 'Referral', 'Event', 'University', 'School Outreach', 'Coach Outreach', 'Partnership', 'Direct Contact', 'Other'];

export function Content() {
  const { contents, campaigns, segments, createContent, updateContent, deleteContent } = useAppStore();
  const [modalOpen, setModalOpen] = useState(false);
  const [editingContent, setEditingContent] = useState<Content | null>(null);
  
  const [form, setForm] = useState({
    title: '', platform: 'Instagram' as LeadSource, contentType: 'Image',
    campaignId: '', segmentId: '', publishDate: '', status: 'Idea' as ContentStatus,
    cta: '', result: '', notes: ''
  });

  const openCreate = () => {
    setEditingContent(null);
    setForm({
      title: '', platform: 'Instagram', contentType: 'Image', campaignId: '', segmentId: '',
      publishDate: format(new Date(), 'yyyy-MM-dd'), status: 'Idea', cta: '', result: '', notes: ''
    });
    setModalOpen(true);
  };

  const openEdit = (c: Content) => {
    setEditingContent(c);
    setForm({
      title: c.title, platform: c.platform, contentType: c.contentType, campaignId: c.campaignId,
      segmentId: c.segmentId, publishDate: c.publishDate ? c.publishDate.slice(0, 10) : '',
      status: c.status, cta: c.cta, result: c.result, notes: c.notes
    });
    setModalOpen(true);
  };

  const handleSave = async () => {
    if (!form.title) return;
    const data = {
      ...form,
      publishDate: form.publishDate ? new Date(form.publishDate).toISOString() : ''
    };
    if (editingContent) await updateContent(editingContent.id, data);
    else await createContent(data);
    setModalOpen(false);
  };

  const getIcon = (type: string) => {
    if (type.toLowerCase().includes('video')) return <Video className="h-4 w-4 text-primary" />;
    if (type.toLowerCase().includes('article') || type.toLowerCase().includes('blog')) return <FileText className="h-4 w-4 text-primary" />;
    if (type.toLowerCase().includes('web')) return <Globe className="h-4 w-4 text-primary" />;
    return <Image className="h-4 w-4 text-primary" />;
  };

  return (
    <div className="space-y-6 max-w-screen-xl">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">المحتوى التسويقي (Content)</h1>
          <p className="text-sm text-muted-foreground">خطة إنتاج ونشر المحتوى على مختلف المنصات.</p>
        </div>
        <Button onClick={openCreate}><Plus className="mr-1.5 h-4 w-4" />محتوى جديد</Button>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {contents.map(c => {
          const segment = segments.find(s => s.id === c.segmentId);
          const campaign = campaigns.find(cam => cam.id === c.campaignId);
          return (
            <Card key={c.id} className={c.status === 'Archived' ? 'opacity-70' : ''}>
              <div className="p-3 border-b flex justify-between items-center bg-muted/10">
                <div className="flex items-center gap-2">
                  {getIcon(c.contentType)}
                  <h3 className="font-semibold text-sm line-clamp-1">{c.title}</h3>
                </div>
                <Badge variant={c.status === 'Published' ? 'success' : c.status === 'Idea' ? 'secondary' : 'default'}>{statusNames[c.status]}</Badge>
              </div>
              <CardContent className="pt-3 space-y-3 text-sm">
                <div className="grid grid-cols-2 gap-2 text-xs">
                  <div><span className="text-muted-foreground">المنصة:</span> {c.platform}</div>
                  <div><span className="text-muted-foreground">النوع:</span> {c.contentType}</div>
                </div>
                <div className="text-xs text-muted-foreground">
                  {campaign && <div><span className="font-semibold">حملة:</span> {campaign.name}</div>}
                  {segment && <div><span className="font-semibold">قطاع:</span> {segment.name}</div>}
                </div>
                
                {c.cta && (
                  <div className="bg-primary/5 p-2 rounded text-xs border border-primary/10">
                    <span className="font-semibold text-primary block mb-1">Call to Action (CTA)</span>
                    {c.cta}
                  </div>
                )}

                <div className="flex justify-between items-center text-xs text-muted-foreground border-t pt-2">
                  <span>{c.publishDate ? format(new Date(c.publishDate), 'yyyy/MM/dd') : '—'}</span>
                  <div className="flex gap-1">
                    <Button variant="ghost" size="icon" className="h-6 w-6" onClick={() => openEdit(c)}><Pencil className="h-3 w-3" /></Button>
                    <Button variant="ghost" size="icon" className="h-6 w-6 text-destructive hover:bg-red-50" onClick={() => deleteContent(c.id)}><Trash2 className="h-3 w-3" /></Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      <Modal open={modalOpen} onClose={() => setModalOpen(false)} title={editingContent ? 'تعديل المحتوى' : 'محتوى جديد'} size="md">
        <div className="space-y-4">
          <div className="space-y-1"><Label>العنوان</Label><Input value={form.title} onChange={e => setForm(f => ({ ...f, title: e.target.value }))} /></div>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1">
              <Label>المنصة</Label>
              <Select value={form.platform} onChange={e => setForm(f => ({ ...f, platform: e.target.value as LeadSource }))}>
                {platformOptions.map(p => <option key={p} value={p}>{p}</option>)}
              </Select>
            </div>
            <div className="space-y-1"><Label>نوع المحتوى</Label><Input value={form.contentType} onChange={e => setForm(f => ({ ...f, contentType: e.target.value }))} placeholder="مثال: فيديو قصير، مقال، صورة" /></div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1">
              <Label>الحملة المرتبطة</Label>
              <Select value={form.campaignId} onChange={e => setForm(f => ({ ...f, campaignId: e.target.value }))}>
                <option value="">بدون حملة</option>
                {campaigns.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
              </Select>
            </div>
            <div className="space-y-1">
              <Label>القطاع المستهدف</Label>
              <Select value={form.segmentId} onChange={e => setForm(f => ({ ...f, segmentId: e.target.value }))}>
                <option value="">بدون</option>
                {segments.map(s => <option key={s.id} value={s.id}>{s.name}</option>)}
              </Select>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1"><Label>تاريخ النشر (أو المخطط)</Label><Input type="date" value={form.publishDate} onChange={e => setForm(f => ({ ...f, publishDate: e.target.value }))} /></div>
            <div className="space-y-1">
              <Label>الحالة</Label>
              <Select value={form.status} onChange={e => setForm(f => ({ ...f, status: e.target.value as ContentStatus }))}>
                {(Object.keys(statusNames) as ContentStatus[]).map(s => <option key={s} value={s}>{statusNames[s]}</option>)}
              </Select>
            </div>
          </div>
          <div className="space-y-1"><Label>دعوة لاتخاذ إجراء (CTA)</Label><Input value={form.cta} onChange={e => setForm(f => ({ ...f, cta: e.target.value }))} placeholder="مثال: سجل الآن، حمل التطبيق" /></div>
          <div className="space-y-1"><Label>النتائج (Result)</Label><Input value={form.result} onChange={e => setForm(f => ({ ...f, result: e.target.value }))} placeholder="مثال: 10K مشاهدة، 50 نقرة" /></div>
          <div className="space-y-1"><Label>ملاحظات</Label><Textarea value={form.notes} onChange={e => setForm(f => ({ ...f, notes: e.target.value }))} /></div>
          <div className="flex justify-between pt-4 border-t">
            {editingContent ? (
              <Button variant="ghost" className="text-destructive hover:bg-red-50" onClick={() => { deleteContent(editingContent.id); setModalOpen(false); }}><Trash2 className="ml-2 h-4 w-4"/> حذف</Button>
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
