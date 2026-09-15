import { useState } from 'react';
import { useAppStore } from '../store';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Badge } from '../components/ui/badge';
import { Button } from '../components/ui/button';
import { format } from 'date-fns';
import { ar } from 'date-fns/locale';
import { ClipboardList, Plus, AlertTriangle, CheckCircle2, Clock } from 'lucide-react';
import { Obligation, ObligationStatus } from '../types/governance';

export function Obligations() {
  const { obligations, createObligation, updateObligation, deleteObligation } = useAppStore();
  const [filter, setFilter] = useState<ObligationStatus | 'All'>('All');

  const filtered = filter === 'All' ? obligations : obligations.filter(o => o.status === filter);

  const getPriorityColor = (p: string) => {
    switch (p) {
      case 'Critical': return 'bg-red-100 text-red-800';
      case 'High': return 'bg-orange-100 text-orange-800';
      case 'Medium': return 'bg-blue-100 text-blue-800';
      case 'Low': return 'bg-slate-100 text-slate-800';
      default: return 'bg-slate-100 text-slate-800';
    }
  };

  const getStatusIcon = (s: ObligationStatus) => {
    switch (s) {
      case 'Completed': return <CheckCircle2 className="h-4 w-4 text-green-500" />;
      case 'Overdue': return <AlertTriangle className="h-4 w-4 text-red-500" />;
      case 'In Progress': return <Clock className="h-4 w-4 text-blue-500" />;
      default: return <Clock className="h-4 w-4 text-slate-400" />;
    }
  };

  return (
    <div className="space-y-6 max-w-screen-xl">
      <div className="flex justify-between items-start">
        <div>
          <h1 className="text-2xl font-bold text-slate-800">الالتزامات (Obligations)</h1>
          <p className="text-sm text-slate-500 mt-1">إدارة التزامات الحاضنة، المتطلبات القانونية والإدارية</p>
        </div>
        <Button size="sm" className="gap-2"><Plus className="h-4 w-4" /> إضافة التزام</Button>
      </div>

      <div className="flex gap-4 items-center">
        <select 
          className="border border-slate-200 rounded-md px-3 py-1.5 text-sm bg-white"
          value={filter} 
          onChange={(e) => setFilter(e.target.value as ObligationStatus | 'All')}
        >
          <option value="All">تصفية حسب الحالة (الكل)</option>
          <option value="Pending">قيد الانتظار</option>
          <option value="In Progress">جاري العمل</option>
          <option value="Completed">مكتمل</option>
          <option value="Overdue">متأخر</option>
          <option value="Cancelled">ملغى</option>
        </select>
      </div>

      <Card>
        <CardHeader className="pb-3 border-b">
          <CardTitle className="text-base flex items-center gap-2">
            <ClipboardList className="h-4 w-4 text-primary" /> قائمة الالتزامات (DEMO DATA)
          </CardTitle>
        </CardHeader>
        <CardContent className="pt-4 p-0">
          <div className="divide-y">
            {filtered.map(o => (
              <div key={o.id} className="p-4 flex items-start justify-between hover:bg-slate-50 transition-colors">
                <div className="flex gap-3">
                  <div className="mt-1">{getStatusIcon(o.status)}</div>
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <h3 className="font-bold text-slate-800 text-sm">{o.title}</h3>
                      <Badge variant="outline" className={`text-[10px] ${getPriorityColor(o.priority)} border-none`}>{o.priority}</Badge>
                      <Badge variant="outline" className="text-[10px] text-slate-500">{o.type}</Badge>
                    </div>
                    <p className="text-xs text-slate-600 mb-2">{o.description}</p>
                    <div className="flex items-center gap-4 text-[10px] text-slate-400 font-medium">
                      <span>المالك: {o.owner}</span>
                      <span className={o.status === 'Overdue' ? 'text-red-600 font-bold' : ''}>
                        الموعد: {format(new Date(o.dueDate), 'dd MMM yyyy', { locale: ar })}
                      </span>
                    </div>
                  </div>
                </div>
                <div className="flex gap-2">
                  {o.status !== 'Completed' && (
                    <Button variant="outline" size="sm" className="h-7 text-xs" onClick={() => updateObligation(o.id, { status: 'Completed' })}>
                      إكمال
                    </Button>
                  )}
                  <Button variant="ghost" size="sm" className="h-7 text-xs text-red-600 hover:text-red-700 hover:bg-red-50" onClick={() => deleteObligation(o.id)}>
                    حذف
                  </Button>
                </div>
              </div>
            ))}
            {filtered.length === 0 && (
              <div className="p-8 text-center text-slate-500 text-sm">
                لا توجد التزامات تطابق الفلتر الحالي.
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
