import { useAppStore } from '../store';
import { Badge } from '../components/ui/badge';
import { Card, CardContent } from '../components/ui/card';
import { CheckCircle2, Circle, Clock } from 'lucide-react';

interface RoadmapPhase {
  id: number;
  stage: string;
  stageAr: string;
  description: string;
  keyActivities: string[];
  maturityLevel: number;
}

const phases: RoadmapPhase[] = [
  {
    id: 1, stage: 'Innovative Project', stageAr: 'مشروع مبتكر', maturityLevel: 1,
    description: 'التحقق الأولي من الفكرة والحصول على العلامة.',
    keyActivities: ['تحديد فكرة المشروع', 'تشكيل فريق العمل', 'الحصول على علامة "مشروع مبتكر"'],
  },
  {
    id: 2, stage: 'ProtoMarket / Incubation', stageAr: 'النماذج الأولية / الحاضنة', maturityLevel: 2,
    description: 'المشاركة في برنامج الحاضنة والحصول على التمويل.',
    keyActivities: ['تقديم طلب الحاضنة', 'إنشاء ملف النماذج الأولية', 'استلام الشريحة الأولى للتمويل', 'بدء التأسيس القانوني'],
  },
  {
    id: 3, stage: 'Product Finalization', stageAr: 'إنهاء المنتج', maturityLevel: 3,
    description: 'بناء المنصة وتجهيزها للاختبار.',
    keyActivities: ['إكمال الميزات الأساسية', 'إنهاء تجربة المستخدم', 'الأمان والنشر', 'الموافقة على شروط الاستخدام'],
  },
  {
    id: 4, stage: 'Pilot', stageAr: 'التجربة التشغيلية (Pilot)', maturityLevel: 4,
    description: 'أول اختبار واقعي مع المدارس والأندية.',
    keyActivities: ['توقيع اتفاقية التجربة', 'تسجيل الطلاب', 'جمع مؤشرات الأداء', 'معالجة الملاحظات'],
  },
  {
    id: 5, stage: 'Commercial Launch', stageAr: 'الإطلاق التجاري', maturityLevel: 5,
    description: 'دخول السوق الرسمي واكتساب العملاء الأوائل.',
    keyActivities: ['تفعيل خطط الدفع', 'توقيع العقود الأولى', 'تفعيل مسار المبيعات', 'دعم العملاء النشط'],
  },
  {
    id: 6, stage: 'First Revenue', stageAr: 'الإيرادات الأولى', maturityLevel: 6,
    description: 'تأكيد الإيرادات من الاشتراكات المؤسسية.',
    keyActivities: ['الإيراد المتكرر > 0', 'أول 3 مؤسسات دافعة', 'تفعيل نظام الفوترة', 'تتبع اقتصاديات الوحدة'],
  },
  {
    id: 7, stage: 'Growth', stageAr: 'النمو', maturityLevel: 7,
    description: 'التوسع في مناطق وشرائح مستخدمين جديدة.',
    keyActivities: ['أكثر من 10 مؤسسات', 'اتفاقيات شراكة استراتيجية', 'تحليلات متقدمة', 'إمكانية إضافة الذكاء الاصطناعي'],
  },
];

const stageOrder = phases.map(p => p.stage);

export function Roadmap() {
  const config = useAppStore(s => s.config);
  const currentStage = config?.currentStage ?? 'Innovative Project';
  const currentIdx = stageOrder.indexOf(currentStage);

  return (
    <div className="space-y-6 max-w-screen-lg">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">خارطة الطريق</h1>
        <p className="text-sm text-muted-foreground mt-0.5">
          مسار الشركة الناشئة "حركة" من الفكرة إلى التوسع.
        </p>
      </div>

      <div className="relative">
        {/* Vertical connector line */}
        <div className="absolute right-[22px] top-0 bottom-0 w-px bg-border sm:right-[26px]" />

        <div className="space-y-4">
          {phases.map((phase, idx) => {
            const isCompleted = idx < currentIdx;
            const isActive    = idx === currentIdx;
            const isPending   = idx > currentIdx;

            return (
              <div key={phase.id} className="relative flex gap-4 sm:gap-6 pr-[22px] sm:pr-[26px]">
                {/* Icon (Now positioned for RTL on the right) */}
                <div className="absolute right-0 z-10 flex h-11 w-11 shrink-0 items-center justify-center rounded-full border-2 bg-card sm:h-[52px] sm:w-[52px]" style={{
                  borderColor: isActive ? 'hsl(221, 83%, 44%)' : isCompleted ? '#22c55e' : 'hsl(var(--border))',
                }}>
                  {isCompleted
                    ? <CheckCircle2 className="h-5 w-5 text-green-500" />
                    : isActive
                      ? <Clock className="h-5 w-5 text-primary animate-pulse" />
                      : <Circle className="h-5 w-5 text-muted-foreground/40" />
                  }
                </div>

                {/* Content */}
                <Card className={`flex-1 mb-2 transition-colors mr-14 sm:mr-16 ${isActive ? 'border-primary/50 bg-primary/5' : isCompleted ? 'opacity-75' : ''}`}>
                  <CardContent className="pt-4 pb-4">
                    <div className="flex flex-wrap items-start justify-between gap-2">
                      <div>
                        <div className="flex items-center gap-2">
                          <p className="text-xs text-muted-foreground">المرحلة {phase.id}</p>
                          {isActive && <Badge variant="default">الحالية</Badge>}
                          {isCompleted && <Badge variant="success">مكتملة</Badge>}
                          {isPending && <Badge variant="outline">قادمة</Badge>}
                        </div>
                        <h3 className={`mt-0.5 text-base font-semibold ${isActive ? 'text-primary' : ''}`}>
                          {phase.stageAr}
                        </h3>
                        <p className="text-xs text-muted-foreground mt-1">{phase.description}</p>
                      </div>
                    </div>
                    <ul className="mt-3 flex flex-wrap gap-x-4 gap-y-1">
                      {phase.keyActivities.map((a, i) => (
                        <li key={i} className="flex items-center gap-1.5 text-xs">
                          <span className={`h-1.5 w-1.5 rounded-full shrink-0 ${isCompleted ? 'bg-green-500' : isActive ? 'bg-primary' : 'bg-muted-foreground/40'}`} />
                          <span className={isPending ? 'text-muted-foreground/60' : 'text-muted-foreground'}>{a}</span>
                        </li>
                      ))}
                    </ul>
                  </CardContent>
                </Card>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
