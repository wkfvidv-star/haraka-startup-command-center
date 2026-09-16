import { Link, useLocation, useNavigate } from 'react-router-dom';
import {
  LayoutDashboard, CheckSquare, BookOpen, Users, Calendar,
  Target, Briefcase, Package, Globe, DollarSign, Scale,
  Megaphone, Brain, FileCode, Cpu, Video, Database, Server,
  ShieldAlert, FileText, Scroll, Shield, Copyright,
  Microscope, Activity, FlaskConical, Lightbulb, BarChart2,
  TrendingUp, Flag, Zap, Map, Award, ClipboardList, HeartPulse,
  Layers, Wrench
} from 'lucide-react';
import { useAppStore } from '../../store/useAppStore';
import { SystemRole } from '../../types/team';

type NavItem = { path: string; label: string; icon: any; badge?: string };
type NavGroup = { group: string; items: NavItem[] };

const COMMON_BOTTOM: NavItem[] = [
  { path: '/company-profile', label: 'ملف حركة', icon: BookOpen },
  { path: '/meetings', label: 'الاجتماعات', icon: Calendar },
];

const buildRoutes = (role: SystemRole): NavGroup[] => {
  switch (role) {
    case 'FOUNDER':
      return [
        {
          group: 'القيادة',
          items: [
            { path: '/', label: 'لوحة القيادة', icon: LayoutDashboard },
            { path: '/tasks', label: 'المهام الموكلة', icon: CheckSquare },
          ],
        },
        {
          group: 'الاستراتيجية',
          items: [
            { path: '/status', label: 'حالة الشركة', icon: HeartPulse },
            { path: '/goals', label: 'أهداف حركة', icon: Target },
            { path: '/executive', label: 'التوجيه التنفيذي', icon: Award },
            { path: '/decisions', label: 'القرارات', icon: Scale },
          ],
        },
        {
          group: 'المنتج والتطوير',
          items: [
            { path: '/product', label: 'المنتج', icon: Package },
            { path: '/roadmap', label: 'Product Roadmap', icon: Map },
            { path: '/projects', label: 'المشاريع', icon: Briefcase },
            { path: '/initiatives', label: 'R&D', icon: Microscope },
          ],
        },
        {
          group: 'السوق والتجاري',
          items: [
            { path: '/market', label: 'السوق', icon: Globe },
            { path: '/leads', label: 'العملاء المحتملين', icon: Users },
            { path: '/partnerships', label: 'الشراكات', icon: TrendingUp },
            { path: '/pilots', label: 'Pilot', icon: FlaskConical },
            { path: '/launch', label: 'الإطلاق', icon: Zap },
          ],
        },
        {
          group: 'التمويل',
          items: [
            { path: '/finance', label: 'المالية', icon: DollarSign },
            { path: '/allocations', label: 'الميزانية', icon: BarChart2 },
            { path: '/funding-milestones', label: 'التمويل المستقبلي', icon: Flag },
          ],
        },
        {
          group: 'الفريق',
          items: [
            { path: '/team', label: 'الفريق ومتابعة المهام', icon: Users },
            { path: '/performance', label: 'الأداء', icon: Activity },
          ],
        },
        {
          group: 'الإدارة والقانون',
          items: [
            { path: '/risks', label: 'المخاطر', icon: ShieldAlert },
            { path: '/contracts-ip', label: 'العقود والملكية', icon: Scroll },
            { path: '/obligations', label: 'الالتزامات', icon: ClipboardList },
            { path: '/documents', label: 'الوثائق', icon: FileText },
          ],
        },
        {
          group: 'معرفة',
          items: COMMON_BOTTOM,
        },
      ];

    case 'LEADERSHIP':
      return [
        {
          group: 'مساحة العمل',
          items: [
            { path: '/', label: 'الرئيسية', icon: LayoutDashboard },
            { path: '/tasks', label: 'المهام الموكلة', icon: CheckSquare },
          ],
        },
        {
          group: 'الاستراتيجية والتطوير',
          items: [
            { path: '/goals', label: 'أهداف حركة', icon: Target },
            { path: '/initiatives', label: 'المبادرات', icon: Zap },
            { path: '/decisions', label: 'القرارات', icon: Scale },
            { path: '/status', label: 'حالة الشركة', icon: HeartPulse },
          ],
        },
        {
          group: 'المنتج',
          items: [
            { path: '/product', label: 'المنتج', icon: Package },
            { path: '/roadmap', label: 'Product Roadmap', icon: Map },
            { path: '/projects', label: 'المشاريع', icon: Briefcase },
          ],
        },
        {
          group: 'السوق والتسويق',
          items: [
            { path: '/market', label: 'السوق', icon: Globe },
            { path: '/leads', label: 'العملاء المحتملين', icon: Users },
            { path: '/marketing', label: 'التسويق', icon: Megaphone },
            { path: '/partnerships', label: 'الشراكات', icon: TrendingUp },
          ],
        },
        {
          group: 'R&D',
          items: [
            { path: '/initiatives', label: 'مشاريع R&D', icon: Microscope },
          ],
        },
        {
          group: 'الفريق',
          items: [
            { path: '/team', label: 'الفريق', icon: Users },
          ],
        },
        {
          group: 'معرفة',
          items: COMMON_BOTTOM,
        },
      ];

    case 'SCIENTIFIC':
      return [
        {
          group: 'مساحة العمل',
          items: [
            { path: '/', label: 'الرئيسية', icon: LayoutDashboard },
            { path: '/tasks', label: 'المهام الموكلة', icon: CheckSquare },
          ],
        },
        {
          group: 'محتوى حركة',
          items: [
            { path: '/content', label: 'المحتوى الرياضي', icon: Activity },
            { path: '/goals', label: 'المحتوى التربوي', icon: BookOpen },
            { path: '/initiatives', label: 'المحتوى العلمي', icon: Microscope },
            { path: '/kpis', label: 'الأداء الحركي والمعرفي', icon: BarChart2 },
            { path: '/growth', label: 'الأداء النفسي', icon: Brain },
            { path: '/incubation', label: 'إعادة التأهيل', icon: HeartPulse },
          ],
        },
        {
          group: 'البحث والتقييم',
          items: [
            { path: '/projects', label: 'البحث العلمي', icon: FlaskConical },
            { path: '/market', label: 'الاختبارات والتقييم', icon: ClipboardList },
          ],
        },
        {
          group: 'الاقتراحات',
          items: [
            { path: '/decisions', label: 'الاقتراحات العلمية', icon: Lightbulb },
          ],
        },
        {
          group: 'معرفة',
          items: COMMON_BOTTOM,
        },
      ];

    case 'TECH':
      return [
        {
          group: 'مساحة العمل',
          items: [
            { path: '/', label: 'الرئيسية', icon: LayoutDashboard },
            { path: '/tasks', label: 'المهام الموكلة', icon: CheckSquare },
          ],
        },
        {
          group: 'تطوير المنصة',
          items: [
            { path: '/product', label: 'Frontend & UI', icon: Layers },
            { path: '/projects', label: 'Backend & APIs', icon: Server },
            { path: '/roadmap', label: 'Database', icon: Database },
            { path: '/incubation', label: 'Infrastructure', icon: Cpu },
          ],
        },
        {
          group: 'AI & Computer Vision',
          items: [
            { path: '/initiatives', label: 'AI والنماذج', icon: Brain },
            { path: '/goals', label: 'Computer Vision', icon: Video },
            { path: '/growth', label: 'Pose Estimation', icon: Activity },
            { path: '/market', label: 'تحليل البيانات', icon: BarChart2 },
          ],
        },
        {
          group: 'البحث التقني',
          items: [
            { path: '/pilots', label: 'Technical R&D', icon: FlaskConical },
            { path: '/launch', label: 'التجارب التقنية', icon: FlaskConical },
            { path: '/risks', label: 'المشاكل التقنية', icon: Wrench },
          ],
        },
        {
          group: 'معرفة',
          items: COMMON_BOTTOM,
        },
      ];

    case 'LEGAL':
      return [
        {
          group: 'مساحة العمل',
          items: [
            { path: '/', label: 'الرئيسية', icon: LayoutDashboard },
            { path: '/tasks', label: 'المهام الموكلة', icon: CheckSquare },
          ],
        },
        {
          group: 'الشؤون القانونية',
          items: [
            { path: '/decisions', label: 'الشؤون القانونية', icon: Scale },
            { path: '/obligations', label: 'الالتزامات', icon: Shield },
          ],
        },
        {
          group: 'الملكية والعقود',
          items: [
            { path: '/contracts-ip', label: 'الملكية الفكرية', icon: Copyright },
            { path: '/projects', label: 'العقود', icon: Scroll },
            { path: '/goals', label: 'تأسيس الشركة', icon: Briefcase },
          ],
        },
        {
          group: 'الوثائق والبيانات',
          items: [
            { path: '/documents', label: 'الوثائق الرسمية', icon: FileText },
            { path: '/risks', label: 'البيانات والخصوصية', icon: ShieldAlert },
          ],
        },
        {
          group: 'معرفة',
          items: COMMON_BOTTOM,
        },
      ];

    default: // GUEST
      return [
        {
          group: 'مساحة العمل',
          items: [
            { path: '/', label: 'الرئيسية', icon: LayoutDashboard },
            { path: '/tasks', label: 'المهام', icon: CheckSquare },
          ],
        },
        { group: 'معرفة', items: COMMON_BOTTOM },
      ];
  }
};

export function Sidebar() {
  const location = useLocation();
  const currentUserRole = useAppStore(state => state.currentUserRole);
  const currentMember = useAppStore(state => state.currentMember);

  const routes = buildRoutes(currentUserRole);

  const roleLabel: Record<string, string> = {
    FOUNDER: 'مؤسس المشروع',
    LEADERSHIP: 'قيادة وتطوير',
    SCIENTIFIC: 'علمي وتربوي',
    TECH: 'تكنولوجيا وذكاء اصطناعي',
    LEGAL: 'قانوني واستشاري',
    GUEST: 'زائر',
  };

  return (
    <div className="w-72 bg-slate-950 text-slate-300 flex flex-col h-full sticky top-0 shrink-0 border-l border-slate-800/60">
      {/* Header */}
      <div className="px-5 pt-6 pb-4 border-b border-slate-800/60">
        <div className="flex flex-col gap-1">
          <span className="text-white font-extrabold tracking-widest text-lg">HARAKA</span>
          {currentMember && (
            <>
              <span className="text-sm font-semibold text-slate-200 truncate">{currentMember.name}</span>
              <span className="text-[11px] text-primary/80 font-medium uppercase tracking-wider">
                {roleLabel[currentUserRole] || currentUserRole}
              </span>
            </>
          )}
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 py-4 px-3 space-y-5 overflow-y-auto custom-scrollbar">
        {routes.map((group, idx) => (
          <div key={idx} className="space-y-0.5">
            <h3 className="px-3 text-[10px] font-bold text-slate-600 uppercase tracking-widest mb-2">
              {group.group}
            </h3>
            {group.items.map((r) => {
              const isActive = location.pathname === r.path;
              const Icon = r.icon as any;
              return (
                <Link
                  key={`${r.path}-${group.group}`}
                  to={r.path}
                  onClick={() => useAppStore.getState().setMobileMenuOpen(false)}
                  className={`flex items-center gap-3 px-3 py-2 rounded-lg transition-all text-sm font-medium ${
                    isActive
                      ? 'bg-primary/15 text-primary border border-primary/20'
                      : 'hover:bg-slate-800/60 hover:text-white text-slate-400'
                  }`}
                >
                  <Icon className={`h-4 w-4 shrink-0 ${isActive ? 'text-primary' : 'text-slate-500'}`} />
                  <span>{r.label}</span>
                </Link>
              );
            })}
          </div>
        ))}
      </nav>

      {/* Footer — Switch Role */}
      <div className="p-3 border-t border-slate-800/60 space-y-2">
        <button
          onClick={() => {
            localStorage.removeItem('haraka_demo_role');
            localStorage.removeItem('haraka_demo_member');
            // Clear guide seen so it shows again on next role selection
            window.location.href = '/select-role';
          }}
          className="w-full flex items-center justify-center gap-2 px-3 py-2 rounded-lg text-[11px] font-semibold text-slate-500 hover:text-slate-300 hover:bg-slate-800/60 transition-colors border border-slate-800/40 hover:border-slate-700"
        >
          <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a2 2 0 01-2 2H5a2 2 0 01-2-2V7a2 2 0 012-2h6a2 2 0 012 2v1" />
          </svg>
          تغيير الدور
        </button>
        <div className="flex items-center justify-between text-[10px] text-slate-700">
          <span>HARAKA IOS v2</span>
          <span className="font-mono uppercase">{currentUserRole}</span>
        </div>
      </div>
    </div>
  );
}
