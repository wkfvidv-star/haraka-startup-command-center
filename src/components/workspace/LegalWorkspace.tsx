import { useAppStore } from '../../store/useAppStore';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Badge } from '../ui/badge';
import { WorkspaceHeader } from './WorkspaceHeader';
import { Link } from 'react-router-dom';
import { CheckSquare, ChevronLeft, Scale, Copyright, Scroll, Briefcase, FileText, Shield, ShieldAlert } from 'lucide-react';

const RESPONSIBILITIES = [
  { icon: Briefcase, label: 'تأسيس الشركة', desc: 'الشكل القانوني، الإجراءات، الوثائق، تنظيم العلاقات بين الشركاء' },
  { icon: Copyright, label: 'الملكية الفكرية', desc: 'اسم HARAKA، الشعار، المنصة، الكود، المحتوى، الأبحاث' },
  { icon: Scroll, label: 'العقود', desc: 'عقود الفريق، اتفاقيات التعاون، السرية، العملاء والمؤسسات' },
  { icon: Shield, label: 'البيانات والخصوصية', desc: 'متطلبات حماية بيانات المستخدمين والتلاميذ والتقارير' },
  { icon: Scale, label: 'الاستشارات القانونية', desc: 'أي قرار للشركة له جانب قانوني يمكن إحالته إليك' },
];

export function LegalWorkspace() {
  const { currentMember, tasks, govDocuments, contracts, ipAssets, obligations } = useAppStore();

  const myTasks = tasks.filter(t =>
    t.owner?.includes('يوسف') || t.owner === currentMember?.name
  );
  const pendingTasks = myTasks.filter(t => t.status !== 'مكتملة');
  const needsActionTasks = myTasks.filter(t => t.status === 'تحتاج تعديلاً');

  const activeContracts = contracts?.filter(c => c.status === 'Active') ?? [];
  const pendingObligations = obligations?.filter(o => o.status === 'Pending' || o.status === 'In Progress') ?? [];
  const ipProtected = ipAssets?.filter(i => i.protectionStatus === 'Protected') ?? [];

  return (
    <div className="space-y-8 max-w-screen-xl">
      <WorkspaceHeader />

      {needsActionTasks.length > 0 && (
        <Card className="border-red-500/30 bg-red-500/5">
          <CardContent className="pt-4 pb-4 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />
              <span className="text-sm font-semibold text-red-400">
                {needsActionTasks.length} مهام تحتاج تعديلاً
              </span>
            </div>
            <Link to="/tasks">
              <button className="text-xs text-red-400 border border-red-500/30 px-3 py-1.5 rounded-lg hover:bg-red-500/10 transition-colors flex items-center gap-1">
                عرض <ChevronLeft className="w-3 h-3" />
              </button>
            </Link>
          </CardContent>
        </Card>
      )}

      {/* إحصائيات سريعة */}
      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardContent className="pt-5 flex items-center gap-4">
            <div className="w-10 h-10 rounded-xl bg-slate-500/10 flex items-center justify-center">
              <Scroll className="w-5 h-5 text-slate-400" />
            </div>
            <div>
              <p className="text-xs text-slate-500 mb-0.5">عقود نشطة</p>
              <p className="text-xl font-bold">{activeContracts.length}</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-5 flex items-center gap-4">
            <div className="w-10 h-10 rounded-xl bg-amber-500/10 flex items-center justify-center">
              <ShieldAlert className="w-5 h-5 text-amber-400" />
            </div>
            <div>
              <p className="text-xs text-slate-500 mb-0.5">التزامات معلقة</p>
              <p className="text-xl font-bold text-amber-400">{pendingObligations.length}</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-5 flex items-center gap-4">
            <div className="w-10 h-10 rounded-xl bg-emerald-500/10 flex items-center justify-center">
              <Copyright className="w-5 h-5 text-emerald-400" />
            </div>
            <div>
              <p className="text-xs text-slate-500 mb-0.5">أصول محمية</p>
              <p className="text-xl font-bold text-emerald-400">{ipProtected.length}</p>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2 space-y-6">
          {/* المهام */}
          <Card>
            <CardHeader className="pb-3 border-b">
              <div className="flex items-center justify-between">
                <CardTitle className="text-base flex items-center gap-2">
                  <CheckSquare className="w-5 h-5 text-slate-400" />
                  المهام الموكلة إليّ
                </CardTitle>
                <Link to="/tasks">
                  <Badge variant="outline" className="cursor-pointer hover:bg-slate-800 text-xs">كل المهام</Badge>
                </Link>
              </div>
            </CardHeader>
            <CardContent className="pt-4 space-y-2">
              {pendingTasks.length === 0 ? (
                <div className="py-12 text-center">
                  <CheckSquare className="w-10 h-10 text-slate-700 mx-auto mb-3" />
                  <p className="text-slate-500 text-sm">لا توجد مهام موكلة إليك حالياً.</p>
                </div>
              ) : (
                pendingTasks.slice(0, 6).map(task => (
                  <div key={task.id} className="flex items-center justify-between p-3 rounded-lg bg-slate-900/50 border border-slate-800 hover:border-slate-600 transition-colors">
                    <div className="space-y-0.5 min-w-0">
                      <p className="font-medium text-sm text-slate-200 truncate">{task.title}</p>
                      <p className="text-xs text-slate-500">{task.category} · {new Date(task.deadline).toLocaleDateString('ar-DZ')}</p>
                    </div>
                    <Badge variant={task.status === 'تحتاج تعديلاً' ? 'destructive' : 'outline'} className="shrink-0 mr-2 text-xs">
                      {task.status}
                    </Badge>
                  </div>
                ))
              )}
            </CardContent>
          </Card>
        </div>

        {/* المسؤوليات */}
        <div>
          <Card>
            <CardHeader className="pb-3 border-b">
              <CardTitle className="text-sm font-bold text-slate-400 uppercase tracking-wider">دوري ومسؤولياتي</CardTitle>
            </CardHeader>
            <CardContent className="pt-4 space-y-3">
              {RESPONSIBILITIES.map((r, i) => {
                const Icon = r.icon;
                return (
                  <div key={i} className="flex items-start gap-3">
                    <div className="w-7 h-7 rounded-lg bg-slate-500/10 flex items-center justify-center shrink-0 mt-0.5">
                      <Icon className="w-3.5 h-3.5 text-slate-400" />
                    </div>
                    <div>
                      <p className="text-xs font-semibold text-slate-300">{r.label}</p>
                      <p className="text-[11px] text-slate-500 leading-relaxed">{r.desc}</p>
                    </div>
                  </div>
                );
              })}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
