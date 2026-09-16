import { useAppStore } from '../store';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Badge } from '../components/ui/badge';
import {
  BookOpen, Users, Target, AlertCircle, ArrowLeft,
  CheckSquare, Eye, RefreshCw, CheckCircle, User
} from 'lucide-react';
import { SystemRole } from '../types/team';

const ROLE_DETAILS: Record<SystemRole, {
  title: string;
  subtitle: string;
  color: string;
  responsibilities: { section: string; items: string[] }[];
}> = {
  FOUNDER: {
    title: 'عبد الباسط نصير',
    subtitle: 'مؤسس المشروع ورئيسه — Founder & Project President',
    color: 'blue',
    responsibilities: [
      {
        section: 'أ. القيادة والاستراتيجية',
        items: [
          'تحديد رؤية حركة وأهداف الشركة والأولويات',
          'تحديد مراحل التطوير واتخاذ القرارات الرئيسية',
          'متابعة تقدم المشروع وحل التعارضات',
          'التنسيق بين أعضاء الفريق ومراجعة النتائج',
        ],
      },
      {
        section: 'ب. تطوير المنتج',
        items: [
          'متابعة فكرة المنصة وجميع واجهات المستخدم',
          'Product Roadmap وأولويات التطوير',
          'الانتقال من Prototype إلى Product → Pilot → Launch',
        ],
      },
      {
        section: 'ج. تطوير الشركة',
        items: [
          'نموذج الأعمال ومصادر الإيرادات والتسعير',
          'السوق المستهدف، الشراكات، التمويل',
        ],
      },
      {
        section: 'د. الفريق',
        items: [
          'توزيع المسؤوليات وإسناد المهام',
          'متابعة المهام وتقييم الإنجاز',
          'عقد الاجتماعات وتحديد المسؤول عن كل مشروع',
        ],
      },
    ],
  },
  LEADERSHIP: {
    title: 'نصير رياض',
    subtitle: 'قيادة وتطوير المشروع — Leadership & Project Development',
    color: 'violet',
    responsibilities: [
      {
        section: 'أ. تطوير المشروع',
        items: [
          'تطوير فكرة حركة ودراسة احتياجات المشروع',
          'اقتراح تحسينات وتطوير نموذج العمل',
          'دراسة فرص جديدة ومتابعة المشاريع',
        ],
      },
      {
        section: 'ب. تطوير المنتج',
        items: [
          'دراسة واجهات المنصة واقتراح الوظائف',
          'تحليل احتياجات المستخدمين ومتابعة التطوير مع حمة',
          'اختبار الوظائف واكتشاف المشاكل',
        ],
      },
      {
        section: 'ج. السوق والتسويق',
        items: [
          'دراسة السوق والمنافسين وجمع معلومات العملاء',
          'المساهمة في استراتيجية التسويق والمحتوى التجاري',
        ],
      },
      {
        section: 'د. R&D والإدارة',
        items: [
          'المساهمة في البحث وتحويل الأفكار إلى مشاريع',
          'متابعة المهام والمشاريع وإعداد التقارير',
        ],
      },
    ],
  },
  SCIENTIFIC: {
    title: 'د. جاب الله حسين & د. حاج مختار',
    subtitle: 'Scientific & Content Development — خبراء علميون وتربويون',
    color: 'emerald',
    responsibilities: [
      {
        section: 'أ. المحتوى الرياضي',
        items: [
          'التمارين، الاختبارات، القدرات البدنية والحركية',
          'معايير الأداء، مستويات الصعوبة، الأخطاء الشائعة',
        ],
      },
      {
        section: 'ب. المحتوى التربوي',
        items: [
          'التربية البدنية والرياضية لمراحل التعليم',
          'احتياجات التلميذ والأستاذ، الأهداف التعليمية',
        ],
      },
      {
        section: 'ج. التقييم الحركي',
        items: [
          'الاختبارات والمؤشرات ومستويات الأداء',
          'طريقة تفسير النتائج ومعايير التطور',
        ],
      },
      {
        section: 'د. الاقتراحات العلمية للمنتج',
        items: [
          'اقتراح تحسينات المنصة بأساس علمي (المشكلة → الاقتراح → الأساس العلمي)',
          'تحويل الاقتراح إلى: Decision → Project → Task',
        ],
      },
    ],
  },
  TECH: {
    title: 'د. سلطاني حمة',
    subtitle: 'Technology & AI Lead — مسؤول التكنولوجيا والذكاء الاصطناعي',
    color: 'amber',
    responsibilities: [
      {
        section: 'أ. تطوير المنصة',
        items: [
          'Frontend, Backend, Database, APIs, Authentication',
          'Security, Architecture, Performance, Deployment',
        ],
      },
      {
        section: 'ب. الذكاء الاصطناعي',
        items: [
          'دراسة نماذج AI وإمكانياتها التقنية',
          'AI integrations, Personalized recommendations, تحليل البيانات',
        ],
      },
      {
        section: 'ج. Computer Vision',
        items: [
          'Pose Estimation, MediaPipe, OpenCV, Keypoints',
          'Video Processing, Movement Analysis, استخراج المؤشرات الحركية',
        ],
      },
      {
        section: 'د. R&D التقني والبنية التحتية',
        items: [
          'لكل تجربة: المشكلة → التقنية → التجربة → النتيجة → القرار',
          'GitHub, Vercel, Supabase, Environments, Backups, Security',
        ],
      },
    ],
  },
  LEGAL: {
    title: 'د. يوسف نصير',
    subtitle: 'Legal & Strategic Advisory — المستشار القانوني والاستراتيجي',
    color: 'slate',
    responsibilities: [
      {
        section: 'أ. تأسيس الشركة',
        items: [
          'الشكل القانوني، إجراءات التأسيس، الوثائق المطلوبة',
          'تنظيم العلاقة بين أعضاء الشركة',
        ],
      },
      {
        section: 'ب. الملكية الفكرية',
        items: [
          'اسم HARAKA، الشعار، المنصة، الكود، التصميم',
          'المحتوى، الأبحاث، أي أصل فكري جديد',
        ],
      },
      {
        section: 'ج. العقود',
        items: [
          'عقود الفريق، اتفاقيات التعاون، عقود الخدمات',
          'الشراكات، السرية، العملاء والمؤسسات والمدربين',
        ],
      },
      {
        section: 'د. البيانات والاستشارات',
        items: [
          'متطلبات حماية بيانات المستخدمين والتلاميذ',
          'الاستشارة في كل قرار شركة له جانب قانوني',
        ],
      },
    ],
  },
  GUEST: {
    title: 'زائر',
    subtitle: 'Guest',
    color: 'slate',
    responsibilities: [],
  },
};

const COLOR_MAP: Record<string, string> = {
  blue: 'border-blue-500/20 bg-blue-500/5',
  violet: 'border-violet-500/20 bg-violet-500/5',
  emerald: 'border-emerald-500/20 bg-emerald-500/5',
  amber: 'border-amber-500/20 bg-amber-500/5',
  slate: 'border-slate-500/20 bg-slate-500/5',
};

const WORKFLOW_STEPS = [
  { icon: CheckSquare, label: 'جديدة', desc: 'رئيس المشروع ينشئ المهمة', color: 'bg-slate-600' },
  { icon: CheckSquare, label: 'تم الاستلام', desc: 'العضو يؤكد استلامها', color: 'bg-blue-600' },
  { icon: RefreshCw, label: 'قيد التنفيذ', desc: 'العضو يبدأ العمل', color: 'bg-amber-600' },
  { icon: Eye, label: 'تنتظر المراجعة', desc: 'العضو ينتهي ويرسلها', color: 'bg-purple-600' },
  { icon: CheckCircle, label: 'مكتملة', desc: 'رئيس المشروع يقبل', color: 'bg-emerald-600' },
];

export function CompanyProfile() {
  const { currentUserRole, currentMember } = useAppStore();
  const detail = ROLE_DETAILS[currentUserRole];

  return (
    <div className="space-y-10 max-w-screen-xl">

      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold tracking-tight mb-1">ملف حركة</h1>
        <p className="text-muted-foreground">الملف التعريفي الرسمي + دليل نظام العمل الداخلي</p>
      </div>

      {/* Company Overview */}
      <div className="grid gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader className="pb-3 border-b">
            <CardTitle className="flex items-center gap-2">
              <BookOpen className="w-5 h-5 text-primary" />
              ما هي HARAKA؟
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-5 space-y-4">
            <div>
              <p className="text-sm font-semibold text-slate-300 mb-1">الرؤية</p>
              <p className="text-sm text-slate-400 leading-relaxed">
                رقمنة وتقييم الأداء الحركي والبدني في البيئة المدرسية، الرياضية، والتأهيلية عبر دمج التقنيات الحديثة والذكاء الاصطناعي مع أسس علمية دقيقة.
              </p>
            </div>
            <div>
              <p className="text-sm font-semibold text-slate-300 mb-1">الوضع الحالي</p>
              <ul className="text-sm text-slate-400 space-y-1 list-disc list-inside">
                <li>مرحلة البحث والتطوير (R&D) النشطة</li>
                <li>بناء النظام الداخلي لإدارة المشروع</li>
                <li>تطوير نموذج العمل والمنتج الأساسي</li>
              </ul>
            </div>
            <div className="bg-amber-500/10 border border-amber-500/20 rounded-xl p-3 flex gap-3">
              <AlertCircle className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
              <p className="text-xs text-amber-400/90 leading-relaxed">
                تقنيات Computer Vision والذكاء الاصطناعي للتقييم الحركي قيد الدراسة (R&D) ولم تُطلق بعد للاستخدام التجاري.
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Team Structure */}
        <Card>
          <CardHeader className="pb-3 border-b">
            <CardTitle className="flex items-center gap-2">
              <Users className="w-5 h-5 text-primary" />
              هيكل الفريق
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-5 space-y-3">
            {[
              { name: 'عبد الباسط نصير', role: 'Founder & Project President', dept: 'القيادة', color: 'bg-blue-500' },
              { name: 'نصير رياض', role: 'Leadership & Project Development', dept: 'القيادة', color: 'bg-violet-500' },
              { name: 'د. جاب الله حسين', role: 'Scientific & Content Development', dept: 'الخبرة العلمية', color: 'bg-emerald-500' },
              { name: 'د. حاج مختار', role: 'Scientific & Content Development', dept: 'الخبرة العلمية', color: 'bg-emerald-500' },
              { name: 'د. سلطاني حمة', role: 'Technology & AI Lead', dept: 'التكنولوجيا', color: 'bg-amber-500' },
              { name: 'د. يوسف نصير', role: 'Legal & Strategic Advisory', dept: 'القانون', color: 'bg-slate-500' },
            ].map((m, i) => (
              <div key={i} className="flex items-center gap-3">
                <div className={`w-2 h-2 rounded-full shrink-0 ${m.color}`} />
                <div className="flex-1 min-w-0">
                  <span className="text-sm font-medium text-slate-200">{m.name}</span>
                  <span className="text-[11px] text-slate-500 mr-2">— {m.role}</span>
                </div>
                <Badge variant="outline" className="text-[10px] shrink-0">{m.dept}</Badge>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>

      {/* Task Workflow */}
      <Card>
        <CardHeader className="pb-3 border-b">
          <CardTitle className="flex items-center gap-2">
            <Target className="w-5 h-5 text-primary" />
            سير عمل المهام — كيف يعمل النظام؟
          </CardTitle>
        </CardHeader>
        <CardContent className="pt-5">
          <div className="flex flex-wrap items-start gap-3">
            {WORKFLOW_STEPS.map((step, i) => {
              const Icon = step.icon;
              return (
                <div key={i} className="flex items-center gap-2">
                  <div className="flex flex-col items-center gap-1.5">
                    <div className={`w-9 h-9 rounded-xl ${step.color} flex items-center justify-center`}>
                      <Icon className="w-4 h-4 text-white" />
                    </div>
                    <span className={`text-[10px] font-bold text-white px-2 py-0.5 rounded-full ${step.color}`}>
                      {step.label}
                    </span>
                    <span className="text-[10px] text-slate-500 text-center max-w-[80px] leading-tight">{step.desc}</span>
                  </div>
                  {i < WORKFLOW_STEPS.length - 1 && (
                    <ArrowLeft className="w-4 h-4 text-slate-700 mb-6 shrink-0" />
                  )}
                </div>
              );
            })}
          </div>
          <div className="mt-4 p-3 rounded-xl bg-red-950/30 border border-red-900/30 text-xs text-red-400">
            <span className="font-semibold">ملاحظة:</span> إذا طلب رئيس المشروع تعديلاً، تعود المهمة إلى حالة "تحتاج تعديلاً" مع ملاحظاته، ويعيد العضو التنفيذ من جديد.
          </div>
        </CardContent>
      </Card>

      {/* My Role Brief */}
      {detail && detail.responsibilities.length > 0 && (
        <Card className={COLOR_MAP[detail.color]}>
          <CardHeader className="pb-3 border-b border-slate-800/50">
            <div className="flex items-start gap-3">
              <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center shrink-0">
                <User className="w-5 h-5 text-primary" />
              </div>
              <div>
                <CardTitle className="text-lg">{detail.title}</CardTitle>
                <p className="text-sm text-slate-400 mt-0.5">{detail.subtitle}</p>
              </div>
            </div>
          </CardHeader>
          <CardContent className="pt-5 grid gap-5 md:grid-cols-2">
            {detail.responsibilities.map((section, i) => (
              <div key={i} className="space-y-2">
                <h3 className="text-xs font-bold text-slate-300 uppercase tracking-wider">{section.section}</h3>
                <ul className="space-y-1">
                  {section.items.map((item, j) => (
                    <li key={j} className="flex items-start gap-2 text-xs text-slate-400">
                      <span className="mt-1.5 w-1 h-1 rounded-full bg-slate-600 shrink-0" />
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </CardContent>
        </Card>
      )}
    </div>
  );
}
