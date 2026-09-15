// ============================================================
// SERVICE: documentService.ts — Phase 6
// Metadata only. No file storage. DEMO DATA.
// ============================================================
import { DocumentRecord, NewDocumentRecord } from '../types/governance';

const now = new Date().toISOString();
const today = new Date();
const inDays = (d: number) => new Date(today.getTime() + d * 86400000).toISOString().split('T')[0];

let documents: DocumentRecord[] = [
  {
    id: 'doc-1',
    name: 'عقد الانضمام للحاضنة',
    category: 'Incubation',
    status: 'Active',
    owner: 'المؤسس',
    documentDate: '2026-01-15',
    expiryDate: inDays(90),
    notes: 'DEMO DATA',
    createdAt: '2026-01-15T00:00:00Z',
    updatedAt: now,
  },
  {
    id: 'doc-2',
    name: 'النظام الأساسي للشركة',
    category: 'Company',
    status: 'Active',
    owner: 'المؤسس',
    documentDate: '2025-11-01',
    notes: 'DEMO DATA',
    createdAt: '2025-11-01T00:00:00Z',
    updatedAt: now,
  },
  {
    id: 'doc-3',
    name: 'شهادة تسجيل العلامة التجارية',
    category: 'IP',
    status: 'Missing',
    owner: 'المؤسس',
    documentDate: '',
    notes: 'DEMO DATA — لم يتم تسجيل العلامة بعد',
    createdAt: '2026-06-01T00:00:00Z',
    updatedAt: now,
  },
  {
    id: 'doc-4',
    name: 'خطة العمل الأولية',
    category: 'Business',
    status: 'Archived',
    owner: 'المؤسس',
    documentDate: '2025-09-01',
    notes: 'DEMO DATA — تم استبدالها بخطة محدثة',
    createdAt: '2025-09-01T00:00:00Z',
    updatedAt: now,
  },
  {
    id: 'doc-5',
    name: 'اتفاقية السرية مع الشريك',
    category: 'Contract',
    status: 'Active',
    owner: 'المؤسس',
    documentDate: '2026-03-01',
    expiryDate: inDays(25),
    notes: 'DEMO DATA — تحتاج تجديد',
    createdAt: '2026-03-01T00:00:00Z',
    updatedAt: now,
  },
  {
    id: 'doc-6',
    name: 'تقرير دراسة السوق الأول',
    category: 'Business',
    status: 'Active',
    owner: 'فريق التسويق',
    documentDate: '2026-04-01',
    notes: 'DEMO DATA',
    createdAt: '2026-04-01T00:00:00Z',
    updatedAt: now,
  },
  {
    id: 'doc-7',
    name: 'عقد الخدمة السحابية',
    category: 'Contract',
    status: 'Expired',
    owner: 'مدير التقنية',
    documentDate: '2025-09-01',
    expiryDate: inDays(-10),
    notes: 'DEMO DATA — منتهي الصلاحية',
    createdAt: '2025-09-01T00:00:00Z',
    updatedAt: now,
  },
  {
    id: 'doc-8',
    name: 'وثيقة هيكل الملكية',
    category: 'Funding',
    status: 'Active',
    owner: 'المؤسس',
    documentDate: '2026-01-01',
    notes: 'DEMO DATA',
    createdAt: '2026-01-01T00:00:00Z',
    updatedAt: now,
  },
];

export function computeDocumentStatus(d: DocumentRecord): DocumentRecord {
  if (!d.expiryDate || d.status === 'Archived' || d.status === 'Missing') return d;
  const exp = new Date(d.expiryDate);
  const now = new Date();
  if (exp < now) return { ...d, status: 'Expired' };
  return d;
}

export const documentService = {
  getAll: (): Promise<DocumentRecord[]> =>
    Promise.resolve(documents.map(computeDocumentStatus)),

  create: (data: NewDocumentRecord): Promise<DocumentRecord> => {
    const item: DocumentRecord = {
      ...data,
      id: `doc-${Date.now()}`,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    documents = [...documents, item];
    return Promise.resolve(item);
  },

  update: (id: string, patch: Partial<DocumentRecord>): Promise<DocumentRecord> => {
    documents = documents.map(d =>
      d.id === id ? { ...d, ...patch, updatedAt: new Date().toISOString() } : d
    );
    const found = documents.find(d => d.id === id);
    if (!found) return Promise.reject(new Error('Not found'));
    return Promise.resolve(computeDocumentStatus(found));
  },

  delete: (id: string): Promise<void> => {
    documents = documents.filter(d => d.id !== id);
    return Promise.resolve();
  },
};
