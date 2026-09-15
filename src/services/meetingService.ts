import { supabase } from '../lib/supabase';
// ============================================================
// SERVICE: meetingService.ts — Phase 6
// DEMO DATA only.
// ============================================================
import { Meeting, NewMeeting } from '../types/governance';

const now = new Date().toISOString();
const today = new Date();
const inDays = (d: number) => new Date(today.getTime() + d * 86400000).toISOString().split('T')[0];

let meetings: Meeting[] = [
  {
    id: 'mtg-1',
    title: 'اجتماع المراجعة الأسبوعية للفريق',
    date: inDays(2),
    participants: ['المؤسس', 'مدير التقنية', 'مدير التسويق'],
    objective: 'مراجعة تقدم المهام الأسبوعية وحل العوائق — DEMO DATA',
    notes: 'DEMO DATA',
    decisions: '',
    status: 'Planned',
    createdAt: '2026-09-01T00:00:00Z',
    updatedAt: now,
  },
  {
    id: 'mtg-2',
    title: 'اجتماع مراجعة الحاضنة الشهري',
    date: inDays(8),
    participants: ['المؤسس', 'مدير الحاضنة'],
    objective: 'تقديم تقرير التقدم الشهري لمنسق الحاضنة — DEMO DATA',
    notes: 'DEMO DATA',
    decisions: '',
    status: 'Planned',
    createdAt: '2026-09-01T00:00:00Z',
    updatedAt: now,
  },
  {
    id: 'mtg-3',
    title: 'اجتماع مع المستثمر المحتمل',
    date: inDays(15),
    participants: ['المؤسس', 'المستثمر'],
    objective: 'عرض خطة العمل ومناقشة جولة التمويل الأولى — DEMO DATA',
    notes: 'DEMO DATA',
    decisions: '',
    status: 'Planned',
    nextMeetingDate: inDays(30),
    createdAt: '2026-09-01T00:00:00Z',
    updatedAt: now,
  },
  {
    id: 'mtg-4',
    title: 'اجتماع مراجعة استراتيجية المنتج',
    date: inDays(-7),
    participants: ['المؤسس', 'مدير التقنية', 'مدير المنتج'],
    objective: 'مراجعة خارطة طريق المنتج للربع القادم — DEMO DATA',
    notes: 'تم الاجتماع بنجاح. تقرر تأجيل ميزة X لربع Q4. DEMO DATA',
    decisions: 'تأجيل ميزة X لـ Q4 / التركيز على تحسين UX / تعيين مسؤول للأداء',
    status: 'Completed',
    nextMeetingDate: inDays(21),
    createdAt: '2026-08-01T00:00:00Z',
    updatedAt: now,
  },
  {
    id: 'mtg-5',
    title: 'ورشة تخطيط نهاية السنة',
    date: inDays(45),
    participants: ['كل الفريق'],
    objective: 'وضع خطة الربع Q1 2027 ومراجعة إنجازات 2026 — DEMO DATA',
    notes: 'DEMO DATA',
    decisions: '',
    status: 'Planned',
    createdAt: '2026-09-01T00:00:00Z',
    updatedAt: now,
  },
];

export const meetingService = {
  getAll: (): Promise<Meeting[]> => Promise.resolve(meetings),

  create: (data: NewMeeting): Promise<Meeting> => {
    const item: Meeting = {
      ...data,
      id: `mtg-${Date.now()}`,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    meetings = [...meetings, item];
    return Promise.resolve(item);
  },

  update: (id: string, patch: Partial<Meeting>): Promise<Meeting> => {
    meetings = meetings.map(m =>
      m.id === id ? { ...m, ...patch, updatedAt: new Date().toISOString() } : m
    );
    const found = meetings.find(m => m.id === id);
    if (!found) return Promise.reject(new Error('Not found'));
    return Promise.resolve(found);
  },

  delete: (id: string): Promise<void> => {
    meetings = meetings.filter(m => m.id !== id);
    return Promise.resolve();
  },
};
