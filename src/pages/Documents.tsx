import { useState } from 'react';
import { useAppStore } from '../store';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Badge } from '../components/ui/badge';
import { Button } from '../components/ui/button';
import { format } from 'date-fns';
import { ar } from 'date-fns/locale';
import { FileText, Plus, AlertTriangle, CheckCircle2, Clock, Archive } from 'lucide-react';
import { DocumentStatus } from '../types/governance';

export function Documents() {
  const { govDocuments, createGovDocument, updateGovDocument, deleteGovDocument } = useAppStore();
  const [filter, setFilter] = useState<DocumentStatus | 'All'>('All');

  const filtered = filter === 'All' ? govDocuments : govDocuments.filter(d => d.status === filter);

  const getStatusColor = (s: DocumentStatus) => {
    switch (s) {
      case 'Active': return 'bg-green-100 text-green-800';
      case 'Expired': return 'bg-red-100 text-red-800';
      case 'Missing': return 'bg-orange-100 text-orange-800';
      case 'Archived': return 'bg-slate-100 text-slate-800';
      case 'Draft': return 'bg-blue-100 text-blue-800';
      default: return 'bg-slate-100 text-slate-800';
    }
  };

  const getStatusIcon = (s: DocumentStatus) => {
    switch (s) {
      case 'Active': return <CheckCircle2 className="h-4 w-4 text-green-500" />;
      case 'Expired': return <AlertTriangle className="h-4 w-4 text-red-500" />;
      case 'Missing': return <AlertTriangle className="h-4 w-4 text-orange-500" />;
      case 'Archived': return <Archive className="h-4 w-4 text-slate-400" />;
      default: return <Clock className="h-4 w-4 text-slate-400" />;
    }
  };

  return (
    <div className="space-y-6 max-w-screen-xl">
      <div className="flex justify-between items-start">
        <div>
          <h1 className="text-2xl font-bold text-slate-800">الوثائق (Documents)</h1>
          <p className="text-sm text-slate-500 mt-1">سجل الوثائق الهامة وصلاحيتها (بدون تخزين ملفات فعلية)</p>
        </div>
        <Button size="sm" className="gap-2"><Plus className="h-4 w-4" /> إضافة وثيقة</Button>
      </div>

      <div className="flex gap-4 items-center">
        <select 
          className="border border-slate-200 rounded-md px-3 py-1.5 text-sm bg-white"
          value={filter} 
          onChange={(e) => setFilter(e.target.value as DocumentStatus | 'All')}
        >
          <option value="All">تصفية حسب الحالة (الكل)</option>
          <option value="Active">نشط</option>
          <option value="Expired">منتهي</option>
          <option value="Missing">مفقود / مطلوب</option>
          <option value="Archived">مؤرشف</option>
          <option value="Draft">مسودة</option>
        </select>
      </div>

      <Card>
        <CardHeader className="pb-3 border-b">
          <CardTitle className="text-base flex items-center gap-2">
            <FileText className="h-4 w-4 text-primary" /> سجل الوثائق (DEMO DATA)
          </CardTitle>
        </CardHeader>
        <CardContent className="pt-4 p-0">
          <div className="divide-y">
            {filtered.map(d => (
              <div key={d.id} className="p-4 flex items-start justify-between hover:bg-slate-50 transition-colors">
                <div className="flex gap-3">
                  <div className="mt-1">{getStatusIcon(d.status)}</div>
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <h3 className="font-bold text-slate-800 text-sm">{d.name}</h3>
                      <Badge variant="outline" className={`text-[10px] ${getStatusColor(d.status)} border-none`}>{d.status}</Badge>
                      <Badge variant="outline" className="text-[10px] text-slate-500">{d.category}</Badge>
                    </div>
                    <p className="text-xs text-slate-600 mb-2">{d.notes}</p>
                    <div className="flex items-center gap-4 text-[10px] text-slate-400 font-medium">
                      <span>المالك: {d.owner}</span>
                      {d.documentDate && <span>التاريخ: {format(new Date(d.documentDate), 'dd MMM yyyy', { locale: ar })}</span>}
                      {d.expiryDate && (
                        <span className={d.status === 'Expired' ? 'text-red-600 font-bold' : ''}>
                          الانتهاء: {format(new Date(d.expiryDate), 'dd MMM yyyy', { locale: ar })}
                        </span>
                      )}
                    </div>
                  </div>
                </div>
                <div className="flex gap-2">
                  <Button variant="ghost" size="sm" className="h-7 text-xs text-red-600 hover:text-red-700 hover:bg-red-50" onClick={() => deleteGovDocument(d.id)}>
                    حذف
                  </Button>
                </div>
              </div>
            ))}
            {filtered.length === 0 && (
              <div className="p-8 text-center text-slate-500 text-sm">
                لا توجد وثائق تطابق الفلتر الحالي.
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
