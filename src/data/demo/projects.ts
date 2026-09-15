// ============================================================
// DEMO DATA: projects.ts
// ⚠ بيانات تجريبية — DEMO DATA
// ============================================================
import { Project } from '../../types/project';

const now = new Date();
const daysAgo = (d: number) => new Date(now.getTime() - d * 86_400_000).toISOString();
const daysAhead = (d: number) => new Date(now.getTime() + d * 86_400_000).toISOString();

export const demoProjects: Project[] = [
  {
    id: 'proj-1',
    name: 'إنهاء المنتج — أساسيات المنصة',
    description: 'بيانات تجريبية: إكمال جميع ميزات المنصة الأساسية المطلوبة للتجربة المدرسية الأولى: لوحة الطالب، مراقبة المعلم، نظام التمارين.',
    owner: 'المؤسس',
    status: 'Active',
    phase: 'المرحلة 1 — المنتج',
    initiativeId: 'init1',
    startDate: daysAgo(45),
    endDate: daysAhead(30),
    progress: 72,
    createdAt: daysAgo(45),
    updatedAt: daysAgo(1),
  },
  {
    id: 'proj-2',
    name: 'الهيكلة القانونية للشركة',
    description: 'بيانات تجريبية: تحويل حركة إلى كيان قانوني رسمي: التسجيل، الحساب البنكي، شروط الاستخدام، وحماية الملكية الفكرية.',
    owner: 'المؤسس',
    status: 'Active',
    phase: 'المرحلة 1 — القانونية',
    initiativeId: 'init3',
    startDate: daysAgo(30),
    endDate: daysAhead(45),
    progress: 45,
    createdAt: daysAgo(30),
    updatedAt: daysAgo(3),
  },
  {
    id: 'proj-3',
    name: 'برنامج التجربة — مدرسة ديمو الجزائر',
    description: 'بيانات تجريبية: تخطيط وتنفيذ أول تجربة مدرسية: تحديد المؤشرات، إضافة المستخدمين، وجمع التقييمات.',
    owner: 'العمليات',
    status: 'Planning',
    phase: 'المرحلة 2 — التجربة',
    initiativeId: 'init2',
    startDate: daysAhead(20),
    endDate: daysAhead(80),
    progress: 15,
    createdAt: daysAgo(10),
    updatedAt: daysAgo(1),
  },
  {
    id: 'proj-4',
    name: 'ملف الحاضنة ProtoMarket',
    description: 'بيانات تجريبية: إعداد وصيانة جميع الوثائق المطلوبة لبرنامج الحاضنة ومراحل التمويل.',
    owner: 'المؤسس',
    status: 'Active',
    phase: 'المرحلة 1 — الحاضنة',
    startDate: daysAgo(20),
    progress: 60,
    createdAt: daysAgo(20),
    updatedAt: daysAgo(2),
  },
];
