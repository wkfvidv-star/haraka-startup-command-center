import { Link, useLocation } from 'react-router-dom';
import { 
  LayoutDashboard, Calendar, Briefcase, CheckSquare, Settings, Package, 
  Rocket, Target, DollarSign, ShieldAlert, Scale, LineChart, Users, TrendingUp, TrendingDown,
  PlayCircle, Award, Tag, Megaphone, FileText, Handshake, Wallet, BarChart2, Globe,
  HeartPulse, Target as GoalIcon, Zap, Activity, Map, Flag, Shield, ClipboardList, Scroll
} from 'lucide-react';

const routes = [
  { group: 'القيادة', items: [
    { path: '/', label: 'لوحة القيادة', icon: LayoutDashboard },
    { path: '/today', label: 'اليوم', icon: Calendar },
    { path: '/executive', label: 'التوجيه التنفيذي', icon: Award },
  ]},
  { group: 'الاستراتيجية والنمو', items: [
    { path: '/status', label: 'حالة الشركة', icon: BarChart2 },
    { path: '/goals', label: 'الأهداف', icon: GoalIcon },
    { path: '/initiatives', label: 'المبادرات', icon: Zap },
    { path: '/growth', label: 'النمو', icon: TrendingUp },
    { path: '/company-health', label: 'صحة الشركة', icon: HeartPulse },
  ]},
  { group: 'التنفيذ', items: [
    { path: '/roadmap', label: 'خارطة الطريق', icon: Map },
    { path: '/tasks', label: 'المهام', icon: CheckSquare },
    { path: '/projects', label: 'المشاريع', icon: Briefcase },
    { path: '/product', label: 'جاهزية المنتج', icon: Package },
    { path: '/launch', label: 'التحكم في الإطلاق', icon: Rocket },
  ]},
  { group: 'السوق والإيرادات', items: [
    { path: '/market', label: 'استخبارات السوق', icon: Globe },
    { path: '/leads', label: 'العملاء المحتملين', icon: Users },
    { path: '/pipeline', label: 'خط المبيعات', icon: TrendingUp },
    { path: '/pilots', label: 'التجارب', icon: PlayCircle },
    { path: '/customers', label: 'العملاء', icon: Award },
    { path: '/offers', label: 'العروض', icon: Tag },
    { path: '/marketing', label: 'التسويق', icon: Megaphone },
    { path: '/content', label: 'المحتوى', icon: FileText },
    { path: '/partnerships', label: 'الشراكات', icon: Handshake },
    { path: '/revenue', label: 'الإيرادات', icon: Wallet },
  ]},
  { group: 'الإدارة والرقابة', items: [
    { path: '/team', label: 'الفريق', icon: Users },
    { path: '/performance', label: 'الأداء', icon: Activity },
    { path: '/finance', label: 'المالية', icon: DollarSign },
    { path: '/financial-control', label: 'التحكم المالي', icon: TrendingDown },
    { path: '/financial-scenarios', label: 'السيناريوهات المالية', icon: BarChart2 },
    { path: '/allocations', label: 'تخصيص الميزانية', icon: Wallet },
    { path: '/funding-milestones', label: 'مراحل التمويل', icon: Flag },
    { path: '/risks', label: 'المخاطر', icon: ShieldAlert },
    { path: '/decisions', label: 'القرارات', icon: Scale },
    { path: '/kpis', label: 'مؤشرات الأداء', icon: LineChart },
    { path: '/governance', label: 'الحوكمة والعمليات', icon: Shield },
    { path: '/obligations', label: 'الالتزامات', icon: ClipboardList },
    { path: '/documents', label: 'الوثائق', icon: FileText },
    { path: '/contracts-ip', label: 'العقود والملكية', icon: Scroll },
    { path: '/meetings', label: 'الاجتماعات', icon: Users },
  ]},
  { group: 'الاحتضان', items: [
    { path: '/incubation', label: 'الحاضنة', icon: Target },
  ]},
];

export function Sidebar() {
  const location = useLocation();

  return (
    <div className="w-72 bg-slate-900 text-slate-300 flex flex-col h-full sticky top-0 shrink-0 border-l border-slate-800">
      <div className="h-16 flex items-center px-6 border-b border-slate-800">
        <span className="text-white font-bold tracking-wider text-xl">حركة</span>
      </div>
      
      <nav className="flex-1 py-4 px-3 space-y-6 overflow-y-auto custom-scrollbar">
        {routes.map((group, idx) => (
          <div key={idx} className="space-y-1">
            <h3 className="px-3 text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">
              {group.group}
            </h3>
            {group.items.map((r) => {
              const isActive = location.pathname === r.path;
              const Icon = r.icon as any;
              return (
                <Link
                  key={r.path}
                  to={r.path}
                  className={`flex items-center gap-3 px-3 py-2 rounded-md transition-colors text-sm font-medium ${
                    isActive 
                      ? 'bg-primary/20 text-primary hover:bg-primary/30' 
                      : 'hover:bg-slate-800 hover:text-white'
                  }`}
                >
                  <Icon className={`h-4 w-4 ${isActive ? 'text-primary' : 'text-slate-400'}`} />
                  {r.label}
                </Link>
              );
            })}
          </div>
        ))}
      </nav>
      
      <div className="p-4 border-t border-slate-800 text-xs text-slate-500 text-center">
        Phase 6 — Governance & Ops
      </div>
    </div>
  );
}
