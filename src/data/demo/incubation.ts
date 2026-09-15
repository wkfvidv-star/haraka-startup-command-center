import { IncubationPhase, Deliverable, Meeting } from '../../types/incubation';

export const demoIncubationPhase: IncubationPhase = {
  id: 'inc1',
  name: 'حاضنة ProtoMarket',
  currentObjective: 'إنهاء النسخة الأولية (MVP) وتأمين شراكات التجربة.',
  startDate: '2026-06-01T00:00:00.000Z',
  targetLaunchDate: '2027-01-15T00:00:00.000Z',
  nextMilestone: 'مراجعة جاهزية التجربة',
};

export const demoDeliverables: Deliverable[] = [
  { id: 'd1', title: 'مسودة خطة العمل', description: 'بيانات تجريبية: المسودة الأولى لمراجعة الحاضنة.', status: 'Completed', dueDate: '2026-07-15T00:00:00.000Z', owner: 'المدير التنفيذي' },
  { id: 'd2', title: 'التوقعات المالية (3 سنوات)', description: 'بيانات تجريبية: مطلوبة لشريحة التمويل القادمة.', status: 'In Progress', dueDate: '2026-10-30T00:00:00.000Z', owner: 'المدير التنفيذي' },
  { id: 'd3', title: 'وثائق التأسيس القانونية', description: 'بيانات تجريبية: القوانين الأساسية والتسجيل التجاري.', status: 'Pending', dueDate: '2026-11-15T00:00:00.000Z', owner: 'الشؤون القانونية' },
];

export const demoMeetings: Meeting[] = [
  { id: 'm1', title: 'متابعة شهرية للحاضنة', date: '2026-09-10T10:00:00.000Z', attendees: 'المدير التنفيذي، مدير الحاضنة', notes: 'بيانات تجريبية: التركيز على تقدم اكتساب مدرسة للتجربة.' },
  { id: 'm2', title: 'مراجعة البنية التقنية', date: '2026-09-20T14:00:00.000Z', attendees: 'المدير التقني، المطور الرئيسي', notes: 'بيانات تجريبية: مراجعة قدرة وحدة الفيديو على التوسع.' },
];
