import { useAppStore } from '../../store';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Badge } from '../ui/badge';
import { CheckSquare, Calendar, Folder, FileText, AlertCircle, BookOpen } from 'lucide-react';
import { Link } from 'react-router-dom';

const getRoleDescription = (role: string) => {
  switch (role) {
    case 'FOUNDER': return 'قيادة المشروع، الاستراتيجية، واتخاذ القرارات العليا.';
    case 'LEADERSHIP': return 'قيادة وتطوير المشروع، التنسيق، ومتابعة تنفيذ الاستراتيجية.';
    case 'SCIENTIFIC': return 'تطوير المحتوى العلمي، الرياضي، والتربوي لمنصة HARAKA.';
    case 'TECH': return 'تطوير الجانب التقني، الذكاء الاصطناعي، البنية التحتية، والرؤية الحاسوبية.';
    case 'LEGAL': return 'الاستشارات القانونية، حماية الملكية الفكرية، صياغة العقود، وإجراءات التأسيس.';
    default: return 'عضو في فريق HARAKA.';
  }
};

export function MemberWorkspace() {
  const { currentMember, currentUserRole, tasks, govMeetings, projects, govDocuments } = useAppStore();

  const assignedTasks = tasks.filter(t => t.owner === currentMember?.name);
  const myMeetings = govMeetings.filter(m => m.participants.includes(currentMember?.name || ''));
  const myProjects = projects.filter(p => p.owner === currentMember?.name);
  
  // Just show 5 recent tasks
  const pendingTasks = assignedTasks.filter(t => t.status !== 'مكتملة').slice(0, 5);
  const overdueTasks = assignedTasks.filter(t => t.status !== 'مكتملة' && new Date(t.deadline) < new Date());

  const name = currentMember?.name || 'مستخدم غير معروف';

  return (
    <div className="space-y-8 max-w-screen-xl">
      {/* 1. Welcome Section */}
      <Card className="bg-slate-900 border-slate-800">
        <CardContent className="pt-6">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <h1 className="text-2xl font-bold text-white mb-1">مرحباً بك في HARAKA</h1>
              <p className="text-lg text-primary">{name}</p>
              <div className="flex items-center gap-2 mt-2">
                <Badge variant="outline" className="text-slate-300 border-slate-700 bg-slate-800">{currentUserRole}</Badge>
                <span className="text-sm text-muted-foreground">{getRoleDescription(currentUserRole)}</span>
              </div>
            </div>
            <div className="flex gap-3">
              <Link to="/company-profile">
                <Badge variant="secondary" className="px-4 py-2 text-sm flex items-center gap-2 cursor-pointer hover:bg-slate-800">
                  <BookOpen className="w-4 h-4" />
                  التعريف بمنصة HARAKA
                </Badge>
              </Link>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* 2. Key Actions / Summary */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardContent className="pt-6 flex flex-col items-center justify-center text-center">
            <CheckSquare className="w-8 h-8 text-blue-500 mb-2" />
            <p className="text-2xl font-bold">{pendingTasks.length}</p>
            <p className="text-sm text-muted-foreground">مهام قيد التنفيذ</p>
          </CardContent>
        </Card>
        <Card className={overdueTasks.length > 0 ? 'border-destructive bg-destructive/5' : ''}>
          <CardContent className="pt-6 flex flex-col items-center justify-center text-center">
            <AlertCircle className={`w-8 h-8 mb-2 ${overdueTasks.length > 0 ? 'text-destructive' : 'text-slate-400'}`} />
            <p className={`text-2xl font-bold ${overdueTasks.length > 0 ? 'text-destructive' : ''}`}>{overdueTasks.length}</p>
            <p className="text-sm text-muted-foreground">مهام متأخرة</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6 flex flex-col items-center justify-center text-center">
            <Calendar className="w-8 h-8 text-emerald-500 mb-2" />
            <p className="text-2xl font-bold">{myMeetings.length}</p>
            <p className="text-sm text-muted-foreground">الاجتماعات القادمة</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6 flex flex-col items-center justify-center text-center">
            <Folder className="w-8 h-8 text-amber-500 mb-2" />
            <p className="text-2xl font-bold">{myProjects.length}</p>
            <p className="text-sm text-muted-foreground">المشاريع المفتوحة</p>
          </CardContent>
        </Card>
      </div>

      {/* 3. Assigned Tasks Section */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-bold flex items-center gap-2">
            <CheckSquare className="w-6 h-6 text-primary" /> 
            المهام الموكلة إليّ من طرف رئيس المشروع
          </h2>
          <Link to="/tasks">
            <Badge variant="outline" className="cursor-pointer hover:bg-slate-800">عرض كل المهام</Badge>
          </Link>
        </div>
        
        {pendingTasks.length === 0 ? (
          <Card className="border-dashed">
            <CardContent className="pt-10 pb-10 text-center flex flex-col items-center justify-center">
              <CheckSquare className="w-12 h-12 text-slate-700 mb-4" />
              <p className="text-slate-400 text-lg">لا توجد مهام موكلة إليك حالياً.</p>
            </CardContent>
          </Card>
        ) : (
          <div className="grid gap-3">
            {pendingTasks.map(task => (
              <Card key={task.id} className="hover:border-primary/50 transition-colors">
                <CardContent className="p-4 flex items-center justify-between">
                  <div className="flex flex-col gap-1">
                    <span className="font-semibold text-lg">{task.title}</span>
                    <span className="text-sm text-muted-foreground">{task.category} • الموعد: {task.deadline.slice(0,10)}</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <Badge variant={task.priority === 'حرجة' || task.priority === 'عالية' ? 'destructive' : 'secondary'}>
                      {task.priority}
                    </Badge>
                    <Badge variant={task.status === 'مكتملة' ? 'success' : 'outline'}>
                      {task.status}
                    </Badge>
                    <Link to="/tasks">
                      <Badge className="cursor-pointer">تحديث</Badge>
                    </Link>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>

    </div>
  );
}
