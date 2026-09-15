import { useState } from 'react';
import { useAppStore } from '../store';
import { Expense, ExpenseStatus } from '../types/finance';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Badge } from '../components/ui/badge';
import { Button } from '../components/ui/button';
import { Modal } from '../components/ui/modal';
import { Input, Textarea, Select, Label } from '../components/ui/form';
import { Progress } from '../components/ui/progress';
import { Plus, Pencil, Trash2, DollarSign, PieChart, TrendingDown } from 'lucide-react';
import { format } from 'date-fns';

const statusNames: Record<ExpenseStatus, string> = {
  'Planned': 'مخطط',
  'Actual': 'فعلي'
};

export function Finance() {
  const { expenses, financeSummary, createExpense, updateExpense, deleteExpense } = useAppStore();
  const [modalOpen, setModalOpen] = useState(false);
  const [editingExpense, setEditingExpense] = useState<Expense | null>(null);
  
  const [form, setForm] = useState({
    category: 'البرمجيات والاستضافة', description: '', plannedAmount: 0,
    actualAmount: 0, status: 'Planned' as ExpenseStatus, date: ''
  });

  if (!financeSummary) return null;

  const formatCurrency = (val: number) => 
    new Intl.NumberFormat('ar-DZ', { style: 'currency', currency: 'DZD', maximumFractionDigits: 0 }).format(val);

  const openCreate = () => {
    setEditingExpense(null);
    setForm({ category: 'البرمجيات والاستضافة', description: '', plannedAmount: 0, actualAmount: 0, status: 'Planned', date: format(new Date(), 'yyyy-MM-dd') });
    setModalOpen(true);
  };

  const openEdit = (expense: Expense) => {
    setEditingExpense(expense);
    setForm({
      category: expense.category, description: expense.description, plannedAmount: expense.plannedAmount,
      actualAmount: expense.actualAmount, status: expense.status, date: expense.date.slice(0, 10)
    });
    setModalOpen(true);
  };

  const handleSave = async () => {
    if (!form.description) return;
    const data = { ...form, date: new Date(form.date).toISOString() };
    if (editingExpense) await updateExpense(editingExpense.id, data);
    else await createExpense(data);
    setModalOpen(false);
  };

  return (
    <div className="space-y-6 max-w-screen-xl">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">التمويل والميزانية</h1>
          <p className="text-sm text-muted-foreground">مراقبة المدرج المالي وتتبع النفقات المخططة مقابل الفعلية.</p>
        </div>
        <Button onClick={openCreate}><Plus className="mr-1.5 h-4 w-4" />تسجيل نفقة</Button>
      </div>

      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-2 text-muted-foreground mb-2"><DollarSign className="h-4 w-4"/> <span className="text-xs font-semibold uppercase">إجمالي التمويل</span></div>
            <p className="text-2xl font-bold">{formatCurrency(financeSummary.totalFunding)}</p>
            <p className="text-xs text-muted-foreground mt-1">بيانات تجريبية</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-2 text-muted-foreground mb-2"><TrendingDown className="h-4 w-4 text-red-500"/> <span className="text-xs font-semibold uppercase">المصروف الفعلي</span></div>
            <p className="text-2xl font-bold text-red-600">{formatCurrency(financeSummary.actualExpenses)}</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-2 text-muted-foreground mb-2"><PieChart className="h-4 w-4"/> <span className="text-xs font-semibold uppercase">المتبقي</span></div>
            <p className="text-2xl font-bold text-green-600">{formatCurrency(financeSummary.remainingBudget)}</p>
          </CardContent>
        </Card>
        <Card className={financeSummary.utilizationPct >= 90 ? 'border-red-500 bg-red-50/50' : financeSummary.utilizationPct >= 80 ? 'border-amber-400 bg-amber-50/50' : ''}>
          <CardContent className="pt-6">
            <div className="flex items-center gap-2 text-muted-foreground mb-2"><span className="text-xs font-semibold uppercase">معدل الاستهلاك</span></div>
            <p className="text-2xl font-bold">{financeSummary.utilizationPct.toFixed(1)}%</p>
            <Progress value={financeSummary.utilizationPct} colorOverride={financeSummary.utilizationPct >= 90 ? 'bg-red-500' : financeSummary.utilizationPct >= 80 ? 'bg-amber-400' : undefined} className="mt-2" />
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>سجل النفقات</CardTitle>
        </CardHeader>
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-right">
            <thead className="bg-muted/40 text-xs uppercase text-muted-foreground border-b border-t">
              <tr>
                <th className="px-4 py-3 font-semibold">التاريخ</th>
                <th className="px-4 py-3 font-semibold">الفئة</th>
                <th className="px-4 py-3 font-semibold">الوصف</th>
                <th className="px-4 py-3 font-semibold">المخطط</th>
                <th className="px-4 py-3 font-semibold">الفعلي</th>
                <th className="px-4 py-3 font-semibold">الحالة</th>
                <th className="px-4 py-3 font-semibold text-left">إجراءات</th>
              </tr>
            </thead>
            <tbody className="divide-y">
              {expenses.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()).map(exp => (
                <tr key={exp.id} className="hover:bg-muted/10">
                  <td className="px-4 py-3 whitespace-nowrap text-muted-foreground">{format(new Date(exp.date), 'yyyy/MM/dd')}</td>
                  <td className="px-4 py-3 font-medium">{exp.category}</td>
                  <td className="px-4 py-3 min-w-[200px]">{exp.description}</td>
                  <td className="px-4 py-3">{formatCurrency(exp.plannedAmount)}</td>
                  <td className="px-4 py-3 font-medium">{exp.status === 'Actual' ? formatCurrency(exp.actualAmount) : '—'}</td>
                  <td className="px-4 py-3">
                    <Badge variant={exp.status === 'Actual' ? 'default' : 'secondary'}>{statusNames[exp.status]}</Badge>
                  </td>
                  <td className="px-4 py-3 text-left">
                    <Button variant="ghost" size="icon" onClick={() => openEdit(exp)} className="h-7 w-7"><Pencil className="h-3.5 w-3.5" /></Button>
                    <Button variant="ghost" size="icon" className="h-7 w-7 text-destructive hover:bg-red-50" onClick={() => deleteExpense(exp.id)}><Trash2 className="h-3.5 w-3.5" /></Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>

      <Modal open={modalOpen} onClose={() => setModalOpen(false)} title={editingExpense ? 'تعديل النفقة' : 'تسجيل نفقة'}>
        <div className="space-y-4">
          <div className="space-y-1"><Label>الوصف</Label><Input value={form.description} onChange={e => setForm(f => ({ ...f, description: e.target.value }))} placeholder="مثال: استضافة AWS (نوفمبر)" /></div>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1">
              <Label>الفئة</Label>
              <Select value={form.category} onChange={e => setForm(f => ({ ...f, category: e.target.value }))}>
                {['البرمجيات والاستضافة', 'الشؤون القانونية', 'التسويق', 'المعدات', 'المكتب', 'أخرى'].map(c => <option key={c} value={c}>{c}</option>)}
              </Select>
            </div>
            <div className="space-y-1">
              <Label>الحالة</Label>
              <Select value={form.status} onChange={e => setForm(f => ({ ...f, status: e.target.value as ExpenseStatus }))}>
                {(['Planned', 'Actual'] as ExpenseStatus[]).map(s => <option key={s} value={s}>{statusNames[s]}</option>)}
              </Select>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1"><Label>المبلغ المخطط (د.ج)</Label><Input type="number" min={0} value={form.plannedAmount} onChange={e => setForm(f => ({ ...f, plannedAmount: Number(e.target.value) }))} /></div>
            {form.status === 'Actual' && (
              <div className="space-y-1"><Label>المبلغ الفعلي (د.ج)</Label><Input type="number" min={0} value={form.actualAmount} onChange={e => setForm(f => ({ ...f, actualAmount: Number(e.target.value) }))} /></div>
            )}
          </div>
          <div className="space-y-1"><Label>التاريخ</Label><Input type="date" value={form.date} onChange={e => setForm(f => ({ ...f, date: e.target.value }))} /></div>
          <div className="flex justify-end gap-2 pt-4">
            <Button variant="outline" onClick={() => setModalOpen(false)}>إلغاء</Button>
            <Button onClick={handleSave}>حفظ</Button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
