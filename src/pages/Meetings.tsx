import { useAppStore } from '../store';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Badge } from '../components/ui/badge';
import { Button } from '../components/ui/button';
import { format } from 'date-fns';
import { ar } from 'date-fns/locale';
import { Users, Plus, CheckCircle2, Clock } from 'lucide-react';
import { MeetingStatus } from '../types/governance';

export function Meetings() {
  const { govMeetings, updateGovMeeting, deleteGovMeeting } = useAppStore();

  const getStatusIcon = (s: MeetingStatus) => {
    switch (s) {
      case 'Completed': return <CheckCircle2 className="h-4 w-4 text-green-500" />;
      case 'Planned': return <Clock className="h-4 w-4 text-blue-500" />;
      default: return <Clock className="h-4 w-4 text-slate-400" />;
    }
  };

  const sortedMeetings = [...govMeetings].sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());

  return (
    <div className="space-y-6 max-w-screen-xl">
      <div className="flex justify-between items-start">
        <div>
          <h1 className="text-2xl font-bold text-slate-800">الاجتماعات (Meetings)</h1>
          <p className="text-sm text-slate-500 mt-1">جدول الاجتماعات الإدارية والاستراتيجية وقراراتها</p>
        </div>
        <Button size="sm" className="gap-2"><Plus className="h-4 w-4" /> اجتماع جديد</Button>
      </div>

      <Card>
        <CardHeader className="pb-3 border-b">
          <CardTitle className="text-base flex items-center gap-2">
            <Users className="h-4 w-4 text-primary" /> سجل الاجتماعات (DEMO DATA)
          </CardTitle>
        </CardHeader>
        <CardContent className="pt-4 p-0">
          <div className="divide-y">
            {sortedMeetings.map(m => (
              <div key={m.id} className="p-4 flex items-start justify-between hover:bg-slate-50 transition-colors">
                <div className="flex gap-3 w-full max-w-3xl">
                  <div className="mt-1">{getStatusIcon(m.status)}</div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <h3 className="font-bold text-slate-800 text-sm">{m.title}</h3>
                      <Badge variant="outline" className="text-[10px] text-slate-500">{m.status}</Badge>
                    </div>
                    <p className="text-xs text-slate-700 mb-2 font-medium">الهدف: {m.objective}</p>
                    
                    {m.decisions && (
                      <div className="mb-2 p-2 bg-blue-50 border border-blue-100 rounded text-xs text-blue-800">
                        <strong>القرارات والإجراءات:</strong> {m.decisions}
                      </div>
                    )}
                    
                    <div className="flex flex-wrap items-center gap-4 text-[10px] text-slate-400 font-medium">
                      <span>التاريخ: {format(new Date(m.date), 'dd MMM yyyy', { locale: ar })}</span>
                      <span>المشاركون: {m.participants.join('، ')}</span>
                      {m.nextMeetingDate && <span>الاجتماع القادم: {format(new Date(m.nextMeetingDate), 'dd MMM yyyy', { locale: ar })}</span>}
                    </div>
                  </div>
                </div>
                <div className="flex gap-2 shrink-0">
                  {m.status !== 'Completed' && (
                    <Button variant="outline" size="sm" className="h-7 text-xs" onClick={() => updateGovMeeting(m.id, { status: 'Completed' })}>
                      إكمال
                    </Button>
                  )}
                  <Button variant="ghost" size="sm" className="h-7 text-xs text-red-600 hover:text-red-700 hover:bg-red-50" onClick={() => deleteGovMeeting(m.id)}>
                    حذف
                  </Button>
                </div>
              </div>
            ))}
            {sortedMeetings.length === 0 && (
              <div className="p-8 text-center text-slate-500 text-sm">
                لا توجد اجتماعات.
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
