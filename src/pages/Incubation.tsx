import { useAppStore } from '../store';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Badge } from '../components/ui/badge';
import { format } from 'date-fns';
import { CheckCircle2, Clock, Calendar, Users, FileText } from 'lucide-react';

const statusNames = {
  'Completed': 'مكتمل',
  'In Progress': 'قيد التنفيذ',
  'Pending': 'قيد الانتظار' // just in case
};

export function Incubation() {
  const { incubationPhase, deliverables, meetings } = useAppStore();

  if (!incubationPhase) return null;

  const completedCount = deliverables.filter(d => d.status === 'Completed').length;
  const progressPct = deliverables.length > 0 ? Math.round((completedCount / deliverables.length) * 100) : 0;

  return (
    <div className="space-y-6 max-w-screen-xl">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">حاضنة ProtoMarket</h1>
          <p className="text-sm text-muted-foreground">إدارة متطلبات الحاضنة والمراحل الرئيسية.</p>
        </div>
        <Badge variant="default" className="text-sm px-3 py-1">{incubationPhase.name}</Badge>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <Card className="md:row-span-2">
          <CardHeader>
            <CardTitle className="text-lg">حالة المرحلة</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div>
              <p className="text-xs font-semibold text-muted-foreground uppercase">الهدف الحالي</p>
              <p className="text-sm font-medium mt-1">{incubationPhase.currentObjective}</p>
            </div>
            <div className="grid grid-cols-2 gap-4 border-t pt-4">
              <div>
                <p className="text-xs font-semibold text-muted-foreground uppercase flex items-center gap-1"><Calendar className="h-3.5 w-3.5"/> تاريخ البدء</p>
                <p className="text-sm font-medium mt-1">{format(new Date(incubationPhase.startDate), 'yyyy/MM/dd')}</p>
              </div>
              <div>
                <p className="text-xs font-semibold text-muted-foreground uppercase flex items-center gap-1"><Clock className="h-3.5 w-3.5"/> الإطلاق المستهدف</p>
                <p className="text-sm font-medium mt-1">{format(new Date(incubationPhase.targetLaunchDate), 'yyyy/MM/dd')}</p>
              </div>
            </div>
            <div className="border-t pt-4">
              <p className="text-xs font-semibold text-muted-foreground uppercase">المرحلة القادمة</p>
              <p className="text-sm font-medium mt-1 text-primary">{incubationPhase.nextMilestone}</p>
            </div>
            <div className="border-t pt-4">
              <div className="flex justify-between text-xs font-medium mb-2">
                <span>تقدم التسليمات</span>
                <span>{completedCount} / {deliverables.length}</span>
              </div>
              <div className="h-2 w-full bg-muted rounded-full overflow-hidden">
                <div className="h-full bg-primary" style={{ width: `${progressPct}%` }} />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2"><FileText className="h-5 w-5 text-primary"/> التسليمات</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {deliverables.map(d => (
                <div key={d.id} className="flex justify-between items-start gap-4 p-3 rounded-lg border bg-muted/10">
                  <div>
                    <p className="text-sm font-medium flex items-center gap-2">
                      {d.status === 'Completed' ? <CheckCircle2 className="h-4 w-4 text-green-500" /> : <Clock className="h-4 w-4 text-amber-500" />}
                      {d.title}
                    </p>
                    <p className="text-xs text-muted-foreground mt-1">{d.description}</p>
                  </div>
                  <div className="text-left shrink-0">
                    <Badge variant={d.status === 'Completed' ? 'success' : d.status === 'In Progress' ? 'default' : 'secondary'} className="mb-1">{statusNames[d.status as keyof typeof statusNames] || d.status}</Badge>
                    <p className="text-[10px] text-muted-foreground">التسليم: {format(new Date(d.dueDate), 'MMM d')}</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2"><Users className="h-5 w-5 text-primary"/> الاجتماعات القادمة</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {meetings.map(m => (
                <div key={m.id} className="p-3 rounded-lg border-r-4 border-r-primary bg-muted/10">
                  <div className="flex justify-between items-start mb-2">
                    <p className="font-medium text-sm">{m.title}</p>
                    <p className="text-xs font-semibold text-primary">{format(new Date(m.date), 'MMM d - h:mm a')}</p>
                  </div>
                  <p className="text-xs text-muted-foreground"><span className="font-semibold text-foreground/80">الحضور:</span> {m.attendees}</p>
                  <p className="text-xs text-muted-foreground mt-1 line-clamp-2">{m.notes}</p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
