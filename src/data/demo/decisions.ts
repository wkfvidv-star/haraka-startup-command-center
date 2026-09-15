import { Decision } from '../../types/decision';

export const demoDecisions: Decision[] = [
  { 
    id: 'd1', 
    title: 'اختيار التقنيات البرمجية', 
    description: 'نحتاج إلى إطار عمل سريع وقابل للتوسع لتطبيق الويب.', 
    reason: 'أداء عالٍ، بيئة تطوير ضخمة، وسهولة الانتقال إلى Next.js لاحقاً.', 
    options: '1. React + Vite\n2. Angular\n3. Vue',
    selectedOption: 'React + Vite + Zustand.', 
    expectedImpact: 'يحدد كامل بنية الواجهة الأمامية.',
    actualImpact: 'تم تسريع التطوير بنسبة 30% بفضل Zustand.',
    owner: 'المدير التقني', 
    priority: 'Critical',
    status: 'Implemented', 
    decisionDate: '2026-06-15T00:00:00.000Z', 
    reviewDate: '2026-07-15T00:00:00.000Z',
    notes: 'بيانات تجريبية',
    createdAt: '2026-06-15T00:00:00.000Z',
    updatedAt: '2026-07-15T00:00:00.000Z'
  },
  { 
    id: 'd2', 
    title: 'تأجيل ميزات الذكاء الاصطناعي', 
    description: 'الحاضنة تطلب ميزات ذكاء اصطناعي، لكنها مكلفة حالياً.', 
    reason: 'التركيز على الأساسيات أولاً. الذكاء الاصطناعي بدون بيانات لا فائدة منه.', 
    options: '1. دمج AI الآن\n2. تأجيله للمرحلة 3',
    selectedOption: 'تأجيل الذكاء الاصطناعي المتقدم إلى المرحلة الثالثة.', 
    expectedImpact: 'يوفر 3 أشهر من التطوير و 20 ألف دولار كتكاليف أولية.',
    actualImpact: '',
    owner: 'المدير التنفيذي', 
    priority: 'High',
    status: 'Decided', 
    decisionDate: '2026-08-01T00:00:00.000Z', 
    reviewDate: '2026-12-01T00:00:00.000Z',
    notes: 'بيانات تجريبية',
    createdAt: '2026-08-01T00:00:00.000Z',
    updatedAt: '2026-08-01T00:00:00.000Z'
  },
];
