import { useState } from 'react';
import { useAppStore } from '../store';
import { ProductReadinessItem, ProductReadinessStatus } from '../types/product';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Badge } from '../components/ui/badge';
import { Button } from '../components/ui/button';
import { Modal } from '../components/ui/modal';
import { Input, Textarea, Select, Label } from '../components/ui/form';
import { Progress } from '../components/ui/progress';
import { Plus, Pencil, Trash2, CheckCircle2 } from 'lucide-react';

const statusNames: Record<ProductReadinessStatus, string> = {
  'Not Started': 'لم يبدأ',
  'In Progress': 'قيد التنفيذ',
  'Blocked': 'محظور',
  'Ready': 'جاهز',
  'Not Applicable': 'غير مطبق'
};

const priorityNames = {
  'High': 'عالية',
  'Medium': 'متوسطة',
  'Low': 'منخفضة'
};

export function ProductReadiness() {
  const { products, productReadinessPct, createProductItem, updateProductItem, deleteProductItem } = useAppStore();
  const [modalOpen, setModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<ProductReadinessItem | null>(null);
  
  const [form, setForm] = useState({
    name: '', category: 'المنصة الأساسية', status: 'Not Started' as ProductReadinessStatus,
    priority: 'Medium' as 'High'|'Medium'|'Low', owner: '', notes: '', targetDate: ''
  });

  const categories = Array.from(new Set(products.map(p => p.category)));

  const openCreate = () => {
    setEditingItem(null);
    setForm({ name: '', category: 'المنصة الأساسية', status: 'Not Started', priority: 'Medium', owner: '', notes: '', targetDate: '' });
    setModalOpen(true);
  };

  const openEdit = (item: ProductReadinessItem) => {
    setEditingItem(item);
    setForm({
      name: item.name, category: item.category, status: item.status, priority: item.priority,
      owner: item.owner, notes: item.notes, targetDate: item.targetDate.slice(0, 10)
    });
    setModalOpen(true);
  };

  const handleSave = async () => {
    if (!form.name) return;
    const data = { ...form, targetDate: new Date(form.targetDate).toISOString() };
    if (editingItem) await updateProductItem(editingItem.id, data);
    else await createProductItem(data);
    setModalOpen(false);
  };

  return (
    <div className="space-y-6 max-w-screen-xl">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">جاهزية المنتج</h1>
          <p className="text-sm text-muted-foreground">تتبع الجاهزية التقنية والميزات للمنصة.</p>
        </div>
        <Button onClick={openCreate}><Plus className="ml-1.5 h-4 w-4" />عنصر جديد</Button>
      </div>

      <Card>
        <CardContent className="pt-6">
          <div className="flex justify-between items-center mb-2">
            <span className="font-semibold text-sm">الجاهزية الشاملة للمنتج</span>
            <span className={productReadinessPct === 100 ? 'text-green-600 font-bold' : 'font-semibold'}>{productReadinessPct}%</span>
          </div>
          <Progress value={productReadinessPct} colorOverride={productReadinessPct === 100 ? 'bg-green-500' : undefined} />
        </CardContent>
      </Card>

      <div className="space-y-6">
        {categories.map(cat => {
          const items = products.filter(p => p.category === cat);
          const readyCount = items.filter(p => p.status === 'Ready').length;
          const applicableCount = items.filter(p => p.status !== 'Not Applicable').length;
          const catPct = applicableCount > 0 ? Math.round((readyCount / applicableCount) * 100) : 0;

          return (
            <Card key={cat}>
              <CardHeader className="pb-3 border-b bg-muted/20">
                <div className="flex justify-between items-center">
                  <CardTitle className="text-sm">{cat}</CardTitle>
                  <div className="flex items-center gap-3">
                    <span className="text-xs text-muted-foreground">{readyCount}/{applicableCount} جاهز</span>
                    <Badge variant={catPct === 100 ? 'success' : 'secondary'}>{catPct}%</Badge>
                  </div>
                </div>
              </CardHeader>
              <div className="divide-y">
                {items.map(item => (
                  <div key={item.id} className="flex flex-wrap items-center justify-between p-4 gap-4 hover:bg-muted/10">
                    <div className="flex-1 min-w-[200px]">
                      <div className="flex items-center gap-2">
                        {item.status === 'Ready' && <CheckCircle2 className="h-4 w-4 text-green-500" />}
                        <p className="text-sm font-medium">{item.name}</p>
                      </div>
                      {item.notes && <p className="text-xs text-muted-foreground mt-1 line-clamp-1">{item.notes}</p>}
                    </div>
                    <div className="flex items-center gap-4 shrink-0 text-sm">
                      <Badge variant={item.priority === 'High' ? 'destructive' : item.priority === 'Medium' ? 'default' : 'outline'}>{priorityNames[item.priority]}</Badge>
                      <Select value={item.status} onChange={e => updateProductItem(item.id, { status: e.target.value as ProductReadinessStatus })} className="h-7 text-xs w-32">
                        {(['Not Started', 'In Progress', 'Blocked', 'Ready', 'Not Applicable'] as ProductReadinessStatus[]).map(s => <option key={s} value={s}>{statusNames[s]}</option>)}
                      </Select>
                      <span className="w-24 text-muted-foreground truncate text-right text-xs">{item.owner}</span>
                      <div className="flex gap-1">
                        <Button variant="ghost" size="icon" className="h-7 w-7" onClick={() => openEdit(item)}><Pencil className="h-3.5 w-3.5" /></Button>
                        <Button variant="ghost" size="icon" className="h-7 w-7 text-destructive hover:bg-red-50" onClick={() => deleteProductItem(item.id)}><Trash2 className="h-3.5 w-3.5" /></Button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </Card>
          );
        })}
      </div>

      <Modal open={modalOpen} onClose={() => setModalOpen(false)} title={editingItem ? 'تعديل العنصر' : 'عنصر جديد'}>
        <div className="space-y-4">
          <div className="space-y-1"><Label>الاسم</Label><Input value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))} /></div>
          <div className="space-y-1"><Label>الفئة</Label><Input value={form.category} onChange={e => setForm(f => ({ ...f, category: e.target.value }))} placeholder="مثال: المنصة الأساسية، المصادقة" /></div>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1">
              <Label>الحالة</Label>
              <Select value={form.status} onChange={e => setForm(f => ({ ...f, status: e.target.value as ProductReadinessStatus }))}>
                {(['Not Started', 'In Progress', 'Blocked', 'Ready', 'Not Applicable'] as ProductReadinessStatus[]).map(s => <option key={s} value={s}>{statusNames[s]}</option>)}
              </Select>
            </div>
            <div className="space-y-1">
              <Label>الأولوية</Label>
              <Select value={form.priority} onChange={e => setForm(f => ({ ...f, priority: e.target.value as any }))}>
                {['High', 'Medium', 'Low'].map(s => <option key={s} value={s}>{priorityNames[s as 'High'|'Medium'|'Low']}</option>)}
              </Select>
            </div>
          </div>
          <div className="space-y-1"><Label>المالك</Label><Input value={form.owner} onChange={e => setForm(f => ({ ...f, owner: e.target.value }))} /></div>
          <div className="space-y-1"><Label>التاريخ المستهدف</Label><Input type="date" value={form.targetDate} onChange={e => setForm(f => ({ ...f, targetDate: e.target.value }))} /></div>
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
