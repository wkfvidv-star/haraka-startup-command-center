import { useNavigate } from 'react-router-dom';
import { useAppStore } from '../store';
import { SystemRole, TeamMember } from '../types/team';

// ============================================================
// RoleSelector — Shown at app start, no auth needed.
// Each team member picks their name → enters their workspace.
// ============================================================

const TEAM = [
  {
    name: 'عبد الباسط نصير',
    role: 'FOUNDER' as SystemRole,
    title: 'Founder & Project President',
    titleAr: 'مؤسس المشروع ورئيسه',
    dept: 'القيادة',
    gradient: 'from-blue-600 via-indigo-600 to-blue-800',
    ring: 'ring-blue-500',
    initials: 'ع.ن',
    emoji: '🏛️',
    description: 'القيادة، الاستراتيجية، المنتج، الفريق، التمويل',
  },
  {
    name: 'نصير رياض',
    role: 'LEADERSHIP' as SystemRole,
    title: 'Leadership & Project Development',
    titleAr: 'قيادة وتطوير المشروع',
    dept: 'القيادة',
    gradient: 'from-violet-600 via-purple-600 to-violet-800',
    ring: 'ring-violet-500',
    initials: 'ر.ن',
    emoji: '🎯',
    description: 'تطوير المشروع، المنتج، السوق، التسويق، R&D',
  },
  {
    name: 'جاب الله حسين',
    role: 'SCIENTIFIC' as SystemRole,
    title: 'Scientific & Content Development',
    titleAr: 'خبير علمي وتربوي',
    dept: 'الخبرة العلمية',
    gradient: 'from-emerald-600 via-teal-600 to-emerald-800',
    ring: 'ring-emerald-500',
    initials: 'ح.ج',
    emoji: '🧠',
    description: 'المحتوى الرياضي، التربوي، التقييم الحركي والمعرفي',
  },
  {
    name: 'حاج مختار',
    role: 'SCIENTIFIC' as SystemRole,
    title: 'Scientific & Content Development',
    titleAr: 'خبير علمي وتربوي',
    dept: 'الخبرة العلمية',
    gradient: 'from-emerald-600 via-teal-600 to-emerald-800',
    ring: 'ring-emerald-500',
    initials: 'م.ح',
    emoji: '🔬',
    description: 'المحتوى الرياضي، التربوي، إعادة التأهيل',
  },
  {
    name: 'سلطاني حمة',
    role: 'TECH' as SystemRole,
    title: 'Technology & AI Lead',
    titleAr: 'مسؤول التكنولوجيا والذكاء الاصطناعي',
    dept: 'التكنولوجيا',
    gradient: 'from-amber-500 via-orange-500 to-amber-700',
    ring: 'ring-amber-500',
    initials: 'ح.س',
    emoji: '💻',
    description: 'تطوير المنصة، AI، Computer Vision، البنية التحتية',
  },
  {
    name: 'يوسف نصير',
    role: 'LEGAL' as SystemRole,
    title: 'Legal & Strategic Advisory',
    titleAr: 'المستشار القانوني والاستراتيجي',
    dept: 'القانون والاستشارات',
    gradient: 'from-slate-500 via-slate-600 to-slate-800',
    ring: 'ring-slate-400',
    initials: 'ي.ن',
    emoji: '⚖️',
    description: 'تأسيس الشركة، الملكية الفكرية، العقود، البيانات',
  },
];

export function RoleSelector() {
  const navigate = useNavigate();
  const setDemoRole = useAppStore(s => s.setDemoRole);

  const handleSelect = (member: typeof TEAM[0]) => {
    // Build a synthetic TeamMember for demo mode
    const syntheticMember: Partial<TeamMember> = {
      id: member.role + '_demo',
      name: member.name,
      role: member.dept as any,
      department: member.dept as any,
      email: `${member.name.split(' ')[0].toLowerCase()}@haraka.dz`,
      phone: '',
      status: 'Active',
      responsibilities: member.description,
      skills: '',
      notes: '',
      joinedAt: new Date().toISOString(),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    setDemoRole(member.role, syntheticMember as TeamMember);
    navigate('/');
  };

  return (
    <div className="min-h-screen bg-slate-950 flex flex-col items-center justify-center p-6">
      {/* Header */}
      <div className="text-center mb-12">
        <div className="inline-flex items-center gap-3 mb-6">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-primary to-primary/60 flex items-center justify-center shadow-lg shadow-primary/20">
            <span className="text-white font-black text-xl">H</span>
          </div>
          <div className="text-right">
            <h1 className="text-3xl font-black text-white tracking-tight">HARAKA</h1>
            <p className="text-primary/80 text-xs font-semibold uppercase tracking-widest">Internal Operating System</p>
          </div>
        </div>
        <h2 className="text-xl font-bold text-slate-200 mb-2">من أنت؟</h2>
        <p className="text-slate-500 text-sm max-w-md mx-auto">
          اختر اسمك للدخول إلى مساحة عملك الخاصة.
          كل عضو يرى فقط ما يخصه.
        </p>
      </div>

      {/* Team Cards Grid */}
      <div className="grid gap-4 w-full max-w-4xl grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
        {TEAM.map((member) => (
          <button
            key={member.name}
            onClick={() => handleSelect(member)}
            className="group relative overflow-hidden rounded-2xl border border-slate-800 bg-slate-900 p-5 text-right transition-all duration-300 hover:border-slate-600 hover:shadow-xl hover:shadow-black/40 hover:-translate-y-1 active:scale-[0.98]"
          >
            {/* Gradient accent top bar */}
            <div className={`absolute top-0 left-0 right-0 h-0.5 bg-gradient-to-l ${member.gradient} opacity-60 group-hover:opacity-100 transition-opacity`} />

            {/* Dept badge */}
            <div className="flex items-start justify-between mb-4">
              <span className={`text-2xl`}>{member.emoji}</span>
              <span className="text-[10px] text-slate-600 font-medium uppercase tracking-widest border border-slate-800 px-2 py-0.5 rounded-full">
                {member.dept}
              </span>
            </div>

            {/* Avatar + Name */}
            <div className="flex items-center gap-3 mb-3">
              <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${member.gradient} flex items-center justify-center text-white font-bold text-sm shrink-0 shadow-lg`}>
                {member.initials}
              </div>
              <div>
                <h3 className="font-bold text-slate-100 text-sm leading-tight">{member.name}</h3>
                <p className="text-[11px] text-slate-500">{member.titleAr}</p>
              </div>
            </div>

            {/* Role title */}
            <p className="text-[11px] text-slate-500 leading-relaxed mb-4">{member.description}</p>

            {/* CTA */}
            <div className={`flex items-center justify-between pt-3 border-t border-slate-800`}>
              <span className="text-xs font-semibold text-slate-400 group-hover:text-slate-200 transition-colors">
                دخول مساحة العمل
              </span>
              <div className={`w-7 h-7 rounded-lg bg-gradient-to-br ${member.gradient} flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all translate-x-2 group-hover:translate-x-0 shadow-lg`}>
                <svg className="w-3.5 h-3.5 text-white rotate-180" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                </svg>
              </div>
            </div>
          </button>
        ))}
      </div>

      {/* Footer */}
      <p className="mt-10 text-xs text-slate-700 text-center">
        HARAKA IOS v2 · نظام التشغيل الداخلي للفريق
      </p>
    </div>
  );
}
