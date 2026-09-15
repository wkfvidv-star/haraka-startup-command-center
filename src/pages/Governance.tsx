import { useAppStore } from '../store';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Badge } from '../components/ui/badge';
import { Link } from 'react-router-dom';
import { ShieldAlert, AlertTriangle, CheckCircle2, Info, ClipboardList, FileText, Scroll, Shield, Calendar, Users } from 'lucide-react';
import { format, isToday } from 'date-fns';
import { ar } from 'date-fns/locale';
import { GovernanceSignalSeverity } from '../types/governance';

const SIG_COLORS: Record<GovernanceSignalSeverity, string> = {
  Critical: 'bg-red-50 border-red-200 text-red-800',
  High: 'bg-orange-50 border-orange-200 text-orange-800',
  Warning: 'bg-amber-50 border-amber-200 text-amber-800',
  Healthy: 'bg-green-50 border-green-200 text-green-800',
};
const SIG_ICONS: Record<GovernanceSignalSeverity, any> = {
  Critical: ShieldAlert, High: AlertTriangle, Warning: AlertTriangle, Healthy: CheckCircle2,
};

const CAL_ICONS: Record<string, any> = {
  Obligation: ClipboardList, DocumentExpiry: FileText,
  ContractExpiry: Scroll, Meeting: Users, GovernanceReview: Shield, FundingMilestone: Calendar,
};

export function Governance() {
  const {
    governanceProfile, governanceSignals, governanceCalendar,
    obligations, govDocuments, contracts, ipAssets, govMeetings
  } = useAppStore();

  const criticalObl = obligations.filter(o => o.status === 'Overdue' && o.priority === 'Critical');
  const dueSoon = obligations.filter(o => {
    if (o.status === 'Completed' || o.status === 'Cancelled' || o.status === 'Overdue') return false;
    const diff = (new Date(o.dueDate).getTime() - Date.now()) / 86400000;
    return diff >= 0 && diff <= 7;
  });
  const expiredDocs = govDocuments.filter(d => d.status === 'Expired');
  const expiringContracts = contracts.filter(c => c.status === 'Expiring');
  const ipReview = ipAssets.filter(a => a.protectionStatus === 'Review Required' || a.protectionStatus === 'Not Protected');
  const upcomingMeetings = govMeetings.filter(m => m.status === 'Planned').slice(0, 3);

  const overallSeverity: GovernanceSignalSeverity = governanceSignals[0]?.severity ?? 'Healthy';

  return (
    <div className="space-y-6 max-w-screen-xl">
      <div className="flex items-start gap-2 bg-blue-50 border border-blue-200 rounded-lg px-4 py-3 text-xs text-blue-700">
        <Info className="h-4 w-4 shrink-0 mt-0.5" />
        <span>
          <strong>تنبيه:</strong> جميع البيانات تجريبية <strong>(DEMO DATA)</strong>.
          لا تمثل وثائق قانونية أو سجلات رسمية. هذا النظام للتتبع الإداري الداخلي فقط.
        </span>
      </div>

      <div className="flex justify-between items-start flex-wrap gap-3">
        <div>
          <h1 className="text-2xl font-bold text-slate-800">الحوكمة والعمليات</h1>
          <p className="text-sm text-slate-500 mt-1">نظرة شاملة على الالتزامات والوثائق والعقود والملكية الفكرية</p>
        </div>
        <div className={`flex items-center gap-2 px-4 py-2 rounded-full border text-sm font-bold ${SIG_COLORS[overallSeverity]}`}>
          <Shield className="h-4 w-4" />
          {overallSeverity === 'Healthy' ? 'الحوكمة بخير' : overallSeverity === 'Critical' ? 'حالة حرجة' : overallSeverity === 'High' ? 'تنبيه عالي' : 'يحتاج انتباهًا'}
        </div>
      </div>

      {/* Governance Profile */}
      {governanceProfile && (
        <Card className="bg-slate-50 border">
          <CardContent className="p-5">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
              <div><p className="text-xs text-slate-400">مرحلة الشركة</p><p className="font-semibold text-slate-800 mt-0.5">{governanceProfile.companyStage}</p></div>
              <div><p className="text-xs text-slate-400">الوضع القانوني</p><p className="font-semibold text-slate-800 mt-0.5">{governanceProfile.legalStatus}</p></div>
              <div><p className="text-xs text-slate-400">حالة الحاضنة</p><p className="font-semibold text-slate-800 mt-0.5">{governanceProfile.incubationStatus}</p></div>
              <div><p className="text-xs text-slate-400">مراجعة الحوكمة القادمة</p><p className="font-semibold text-slate-800 mt-0.5">{governanceProfile.nextGovernanceReviewDate}</p></div>
            </div>
            <p className="text-[10px] text-slate-400 mt-3">{governanceProfile.importantNotes}</p>
          </CardContent>
        </Card>
      )}

      {/* Signals */}
      <div className="space-y-2">
        {governanceSignals.map((sig, i) => {
          const Icon = SIG_ICONS[sig.severity];
          return (
            <div key={i} className={`flex items-start gap-3 p-3 rounded-lg border ${SIG_COLORS[sig.severity]}`}>
              <Icon className="h-5 w-5 shrink-0 mt-0.5" />
              <div><p className="font-bold text-sm">{sig.title}</p><p className="text-xs mt-0.5 opacity-90">{sig.message}</p></div>
            </div>
          );
        })}
      </div>

      {/* Overview Grid */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
        {[
          { label: 'التزامات حرجة متأخرة', value: criticalObl.length, color: criticalObl.length ? 'text-red-600 bg-red-50' : 'text-green-600 bg-green-50', link: '/obligations' },
          { label: 'مستحقة خلال 7 أيام', value: dueSoon.length, color: dueSoon.length ? 'text-amber-600 bg-amber-50' : 'text-green-600 bg-green-50', link: '/obligations' },
          { label: 'وثائق منتهية', value: expiredDocs.length, color: expiredDocs.length ? 'text-orange-600 bg-orange-50' : 'text-green-600 bg-green-50', link: '/documents' },
          { label: 'عقود تنتهي قريبًا', value: expiringContracts.length, color: expiringContracts.length ? 'text-amber-600 bg-amber-50' : 'text-green-600 bg-green-50', link: '/contracts-ip' },
          { label: 'ملكية تحتاج مراجعة', value: ipReview.length, color: ipReview.length ? 'text-blue-600 bg-blue-50' : 'text-green-600 bg-green-50', link: '/contracts-ip' },
          { label: 'اجتماعات قادمة', value: upcomingMeetings.length, color: 'text-slate-600 bg-slate-50', link: '/meetings' },
        ].map((item, i) => (
          <Link key={i} to={item.link} className={`p-4 rounded-lg text-center hover:opacity-80 transition-opacity ${item.color}`}>
            <p className="text-2xl font-black">{item.value}</p>
            <p className="text-xs font-medium mt-1 opacity-80">{item.label}</p>
          </Link>
        ))}
      </div>

      {/* Calendar */}
      <Card>
        <CardHeader className="pb-3 border-b">
          <div className="flex items-center justify-between">
            <CardTitle className="text-base flex items-center gap-2">
              <Calendar className="h-4 w-4 text-primary" /> تقويم الحوكمة
            </CardTitle>
          </div>
        </CardHeader>
        <CardContent className="pt-4">
          <div className="space-y-2">
            {governanceCalendar.slice(0, 12).map(entry => {
              const Icon = CAL_ICONS[entry.type] || Calendar;
              const entryDate = new Date(entry.date);
              const isPast = entryDate < new Date();
              const isNow = isToday(entryDate);
              return (
                <div key={entry.id} className={`flex items-center gap-3 p-3 rounded-lg border text-sm ${
                  entry.severity === 'Critical' ? 'bg-red-50 border-red-100' :
                  entry.severity === 'High' ? 'bg-orange-50 border-orange-100' :
                  entry.severity === 'Warning' ? 'bg-amber-50 border-amber-100' :
                  'bg-slate-50 border-slate-100'
                }`}>
                  <Icon className="h-4 w-4 text-slate-500 shrink-0" />
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-slate-800 truncate">{entry.title}</p>
                    <p className="text-xs text-slate-400">{entry.status}</p>
                  </div>
                  <span className={`text-xs font-bold shrink-0 ${
                    isNow ? 'text-primary' :
                    isPast ? 'text-red-600' : 'text-slate-500'
                  }`}>
                    {isNow ? 'اليوم' : format(entryDate, 'dd MMM', { locale: ar })}
                  </span>
                </div>
              );
            })}
            {governanceCalendar.length === 0 && (
              <p className="text-sm text-slate-400 text-center py-4">لا توجد إدخالات في التقويم</p>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Quick links */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { label: 'الالتزامات', icon: ClipboardList, link: '/obligations', color: 'text-red-600' },
          { label: 'الوثائق', icon: FileText, link: '/documents', color: 'text-blue-600' },
          { label: 'العقود والملكية', icon: Scroll, link: '/contracts-ip', color: 'text-purple-600' },
          { label: 'الاجتماعات', icon: Users, link: '/meetings', color: 'text-green-600' },
        ].map((item, i) => (
          <Link key={i} to={item.link} className="flex items-center gap-3 p-4 bg-white rounded-lg border hover:shadow-sm transition-shadow">
            <item.icon className={`h-5 w-5 ${item.color}`} />
            <span className="font-semibold text-slate-700 text-sm">{item.label}</span>
          </Link>
        ))}
      </div>
    </div>
  );
}
