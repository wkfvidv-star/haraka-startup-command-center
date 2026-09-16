import { useState, useEffect } from 'react';
import { useAppStore } from '../../store/useAppStore';
import { SystemRole } from '../../types/team';
import { X, ChevronLeft, ChevronRight, CheckCircle } from 'lucide-react';

interface GuideStep {
  title: string;
  description: string;
  emoji: string;
}

const GUIDES: Record<SystemRole, { title: string; subtitle: string; steps: GuideStep[] }> = {
  FOUNDER: {
    title: 'مرحباً يا عبد الباسط',
    subtitle: 'دليل استخدام واجهة المؤسس ورئيس المشروع',
    steps: [
      {
        emoji: '🏠',
        title: 'لوحة القيادة',
        description: 'هذه هي واجهتك الرئيسية. من هنا ترى جدول متابعة الفريق دفعة واحدة: من ينفذ؟ من ينتظر؟ من تأخر؟ وكذلك المهام التي ترسلها بعد إنجازها أعضاء الفريق وتنتظر موافقتك.',
      },
      {
        emoji: '📋',
        title: 'إنشاء مهمة وتوزيعها',
        description: 'اذهب إلى "المهام الموكلة" من القائمة الجانبية، ثم اضغط "مهمة جديدة". حدد: العنوان، المجال، المسؤول (من الفريق)، النتيجة المطلوبة، والموعد النهائي. المهمة ستظهر فوراً في واجهة العضو المعني.',
      },
      {
        emoji: '✅',
        title: 'مراجعة وقبول المهام',
        description: 'عندما ينتهي أحد أعضاء الفريق من مهمة ويرسلها للمراجعة، ستجد تنبيهاً في الواجهة الرئيسية. افتح المهمة، راجع النتيجة، ثم اختر: "قبول النتيجة" أو "طلب تعديل" مع ملاحظاتك.',
      },
      {
        emoji: '👥',
        title: 'متابعة الفريق',
        description: 'صفحة "الفريق" تعطيك نظرة شاملة على الفريق كله: المهام الكلية، قيد التنفيذ، تنتظر المراجعة، المتأخرة. اضغط على أي عضو لتجد مهامه التفصيلية.',
      },
      {
        emoji: '🎯',
        title: 'التنقل في النظام',
        description: 'القائمة الجانبية مقسمة بحسب أولوياتك: القيادة → الاستراتيجية → المنتج → السوق → التمويل → الفريق → الإدارة. كل قسم يحتوي على صفحات تفصيلية.',
      },
    ],
  },
  LEADERSHIP: {
    title: 'مرحباً يا رياض',
    subtitle: 'دليل استخدام واجهة القيادة والتطوير',
    steps: [
      {
        emoji: '🏠',
        title: 'مساحة العمل الخاصة بك',
        description: 'واجهتك مصممة لتعكس نطاق عملك الواسع كقائد ومطور للمشروع. ستجد فيها المهام الموكلة إليك مباشرة، إلى جانب ملخص سريع لمسؤولياتك.',
      },
      {
        emoji: '📋',
        title: 'المهام الموكلة إليك',
        description: 'عندما يُسند إليك عبد الباسط مهمة، ستجدها في صفحة "المهام الموكلة". افتح المهمة واضغط "استلام المهمة" أولاً، ثم "بدء التنفيذ"، وعند الانتهاء "إرسال للمراجعة".',
      },
      {
        emoji: '🚀',
        title: 'نطاق صلاحياتك',
        description: 'صلاحياتك واسعة تغطي: الاستراتيجية، المنتج، السوق، التسويق، R&D، والفريق. يمكنك الاطلاع على جميع هذه القطاعات وتقديم اقتراحات من خلال صفحة القرارات.',
      },
      {
        emoji: '🔄',
        title: 'سير عمل المهمة',
        description: 'جديدة ← تم الاستلام ← قيد التنفيذ ← تنتظر المراجعة. بعد إرسالها للمراجعة، إما أن يقبلها رئيس المشروع (مكتملة) أو يطلب تعديلاً فتعود إليك.',
      },
    ],
  },
  SCIENTIFIC: {
    title: 'مرحباً بالخبير العلمي',
    subtitle: 'دليل استخدام واجهة Scientific & Content Development',
    steps: [
      {
        emoji: '🏠',
        title: 'مساحة العمل العلمية',
        description: 'واجهتك مركزة على المحتوى العلمي والتربوي. ستجد المهام الموكلة إليك من رئيس المشروع، وقسماً خاصاً للاقتراحات العلمية التي تقدمها لتطوير المنصة.',
      },
      {
        emoji: '📋',
        title: 'استلام وتنفيذ المهام',
        description: 'عند وصول مهمة جديدة، اضغط "استلام المهمة" لتأكيد الاستلام، ثم "بدء التنفيذ" عند الشروع في العمل. عند الانتهاء، اضغط "إرسال للمراجعة".',
      },
      {
        emoji: '💡',
        title: 'الاقتراحات العلمية',
        description: 'هل لديك اقتراح لتطوير المنصة؟ مثلاً إضافة اختبار حركي جديد؟ اذهب لصفحة "الاقتراحات العلمية" (القرارات) وأضف اقتراحك بأساسه العلمي. إذا وافق رئيس المشروع، يتحول إلى مشروع ثم مهمة.',
      },
      {
        emoji: '🧠',
        title: 'محتوى حركة',
        description: 'قسم "محتوى حركة" في القائمة الجانبية يحتوي على: المحتوى الرياضي، التربوي، الأداء الحركي والمعرفي والنفسي، وإعادة التأهيل. كل قسم مرتبط بصفحة تفصيلية.',
      },
    ],
  },
  TECH: {
    title: 'مرحباً يا حمة',
    subtitle: 'دليل استخدام واجهة Technology & AI Lead',
    steps: [
      {
        emoji: '🏠',
        title: 'مساحة العمل التقنية',
        description: 'واجهتك تركز على التطوير التقني والذكاء الاصطناعي. ستجد المهام الموكلة إليك، ومنطقة التجارب التقنية، والمشاكل التقنية المفتوحة.',
      },
      {
        emoji: '📋',
        title: 'استلام وتنفيذ المهام',
        description: 'عند وصول مهمة تقنية (مثل: "دراسة إمكانية تحليل تمرين X بالفيديو")، اضغط "استلام المهمة"، ثم "بدء التنفيذ"، وعند الانتهاء أرسل النتيجة للمراجعة.',
      },
      {
        emoji: '🔬',
        title: 'Technical R&D',
        description: 'لكل تجربة تقنية: وثّق المشكلة، التقنية المقترحة، النتيجة، والحدود. هذا يساعد رئيس المشروع على اتخاذ قرارات المنتج بناءً على أرضية تقنية حقيقية.',
      },
      {
        emoji: '🤖',
        title: 'AI & Computer Vision',
        description: 'قسم "AI & Computer Vision" في القائمة يحتوي على: نماذج AI، Computer Vision، Pose Estimation، وتحليل البيانات. وثّق تقدمك في هذه المجالات.',
      },
      {
        emoji: '⚙️',
        title: 'البنية التحتية',
        description: 'أنت مسؤول عن GitHub، Vercel، Supabase، والـ Environments. أي مشكلة تقنية في البنية التحتية تُضاف في قسم "المشاكل التقنية".',
      },
    ],
  },
  LEGAL: {
    title: 'مرحباً يا يوسف',
    subtitle: 'دليل استخدام واجهة Legal & Strategic Advisory',
    steps: [
      {
        emoji: '🏠',
        title: 'مساحة العمل القانونية',
        description: 'واجهتك مركزة على الشأن القانوني لشركة HARAKA. ستجد إحصائيات سريعة عن العقود النشطة والالتزامات والأصول المحمية، إلى جانب المهام الموكلة إليك.',
      },
      {
        emoji: '📋',
        title: 'استلام وتنفيذ المهام',
        description: 'عند وصول مهمة قانونية (مثل: "دراسة حماية اسم HARAKA")، اضغط "استلام المهمة"، ثم "بدء التنفيذ". عند الانتهاء أرسل نتيجة العمل (تقرير/وثيقة/قرار) للمراجعة.',
      },
      {
        emoji: '©️',
        title: 'الملكية الفكرية',
        description: 'صفحة "الملكية الفكرية" تتيح لك تسجيل ومتابعة جميع الأصول: الاسم، الشعار، المنصة، الكود، المحتوى. حافظ على تحديث حالة الحماية لكل أصل.',
      },
      {
        emoji: '📄',
        title: 'العقود والاستشارات',
        description: 'أي قرار للشركة له جانب قانوني يمكن أن يُحال إليك. استخدم صفحة "الشؤون القانونية" لتوثيق الاستشارات وصفحة "العقود" لمتابعة العقود.',
      },
    ],
  },
  GUEST: {
    title: 'مرحباً',
    subtitle: 'دليل الاستخدام',
    steps: [
      {
        emoji: '👋',
        title: 'مرحباً بك',
        description: 'لم يتم التعرف على حسابك بعد. يرجى التواصل مع رئيس المشروع لتفعيل حسابك.',
      },
    ],
  },
};

const GUIDE_SEEN_KEY = 'haraka_guide_seen_v2';

export function UserGuide() {
  const currentUserRole = useAppStore(state => state.currentUserRole);
  const [open, setOpen] = useState(false);
  const [step, setStep] = useState(0);

  useEffect(() => {
    const seen = localStorage.getItem(`${GUIDE_SEEN_KEY}_${currentUserRole}`);
    if (!seen && currentUserRole !== 'GUEST') {
      setOpen(true);
      setStep(0);
    }
  }, [currentUserRole]);

  const guide = GUIDES[currentUserRole];
  if (!open || !guide) return null;

  const isLast = step === guide.steps.length - 1;
  const currentStep = guide.steps[step];

  const handleClose = () => {
    localStorage.setItem(`${GUIDE_SEEN_KEY}_${currentUserRole}`, 'true');
    setOpen(false);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4" style={{ background: 'rgba(0,0,0,0.75)', backdropFilter: 'blur(4px)' }}>
      <div className="bg-slate-900 border border-slate-700 rounded-2xl w-full max-w-md shadow-2xl overflow-hidden">
        {/* Header */}
        <div className="bg-gradient-to-l from-primary/20 to-primary/5 border-b border-slate-800 px-6 py-5">
          <div className="flex items-start justify-between">
            <div>
              <h2 className="text-lg font-bold text-white">{guide.title}</h2>
              <p className="text-xs text-slate-400 mt-1">{guide.subtitle}</p>
            </div>
            <button onClick={handleClose} className="text-slate-500 hover:text-slate-300 transition-colors mt-1">
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Progress dots */}
          <div className="flex items-center gap-1.5 mt-4">
            {guide.steps.map((_, i) => (
              <div
                key={i}
                className={`h-1.5 rounded-full transition-all duration-300 ${
                  i === step ? 'w-6 bg-primary' : i < step ? 'w-3 bg-primary/40' : 'w-3 bg-slate-700'
                }`}
              />
            ))}
          </div>
        </div>

        {/* Content */}
        <div className="px-6 py-6 min-h-[180px]">
          <div className="text-4xl mb-4">{currentStep.emoji}</div>
          <h3 className="text-base font-bold text-white mb-3">{currentStep.title}</h3>
          <p className="text-sm text-slate-400 leading-relaxed">{currentStep.description}</p>
        </div>

        {/* Footer */}
        <div className="px-6 pb-6 flex items-center justify-between">
          <button
            onClick={() => setStep(s => Math.max(0, s - 1))}
            disabled={step === 0}
            className="flex items-center gap-1 text-sm text-slate-500 hover:text-slate-300 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
          >
            <ChevronRight className="w-4 h-4" /> السابق
          </button>

          <span className="text-xs text-slate-600">{step + 1} / {guide.steps.length}</span>

          {isLast ? (
            <button
              onClick={handleClose}
              className="flex items-center gap-2 bg-primary hover:bg-primary/90 text-white text-sm font-semibold px-5 py-2.5 rounded-xl transition-colors"
            >
              <CheckCircle className="w-4 h-4" /> ابدأ الآن
            </button>
          ) : (
            <button
              onClick={() => setStep(s => s + 1)}
              className="flex items-center gap-1 text-sm font-semibold text-primary hover:text-primary/80 transition-colors"
            >
              التالي <ChevronLeft className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
