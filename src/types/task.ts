// ============================================================
// TYPES: task.ts — Task model with full relational fields
// HARAKA Internal Operating System v2
// ============================================================

export type TaskStatus = 
  | 'جديدة'           // newly created by founder/leadership
  | 'تم الاستلام'     // assignee acknowledged
  | 'قيد التنفيذ'     // assignee started work
  | 'تنتظر المراجعة'  // assignee submitted for review
  | 'تحتاج تعديلاً'   // founder requested changes
  | 'مكتملة';         // founder accepted

export type TaskPriority = 'حرجة' | 'عالية' | 'متوسطة' | 'منخفضة';

export type TaskDomain =
  | 'القيادة والاستراتيجية'
  | 'تطوير المنتج'
  | 'تطوير الشركة'
  | 'السوق والتسويق'
  | 'التمويل'
  | 'المحتوى العلمي'
  | 'التكنولوجيا والذكاء الاصطناعي'
  | 'Computer Vision'
  | 'البنية التحتية'
  | 'الشؤون القانونية'
  | 'الملكية الفكرية'
  | 'العقود'
  | 'التأسيس'
  | 'البحث والتطوير'
  | 'الفريق'
  | 'أخرى';

export interface Task {
  id: string;
  title: string;
  description: string;
  // Assignee (who does the work)
  owner: string;
  // Who assigned the task
  assigner?: string;
  priority: TaskPriority;
  deadline: string; // ISO date string
  status: TaskStatus;
  projectId?: string; // FK → Project.id
  // Domain / Area of work
  category: string;
  domain?: TaskDomain;
  // What outcome is expected
  expectedResult?: string;
  estimatedHours?: number;
  actualHours?: number;
  // Review notes from founder
  reviewNotes?: string;
  createdAt: string;
  updatedAt: string;
}

export type NewTask = Omit<Task, 'id' | 'createdAt' | 'updatedAt'>;
export type UpdateTask = Partial<Omit<Task, 'id' | 'createdAt'>> & { updatedAt: string };

// Status flow rules
export const ASSIGNEE_ALLOWED_TRANSITIONS: Record<TaskStatus, TaskStatus[]> = {
  'جديدة': ['تم الاستلام'],
  'تم الاستلام': ['قيد التنفيذ'],
  'قيد التنفيذ': ['تنتظر المراجعة'],
  'تنتظر المراجعة': [],
  'تحتاج تعديلاً': ['قيد التنفيذ'],
  'مكتملة': [],
};

export const FOUNDER_ALLOWED_TRANSITIONS: Record<TaskStatus, TaskStatus[]> = {
  'جديدة': ['مكتملة', 'تحتاج تعديلاً'],
  'تم الاستلام': ['مكتملة', 'تحتاج تعديلاً'],
  'قيد التنفيذ': ['مكتملة', 'تحتاج تعديلاً'],
  'تنتظر المراجعة': ['مكتملة', 'تحتاج تعديلاً', 'قيد التنفيذ'],
  'تحتاج تعديلاً': ['مكتملة'],
  'مكتملة': [],
};

export const STATUS_COLORS: Record<TaskStatus, string> = {
  'جديدة': 'bg-slate-400',
  'تم الاستلام': 'bg-blue-400',
  'قيد التنفيذ': 'bg-amber-400',
  'تنتظر المراجعة': 'bg-purple-500',
  'تحتاج تعديلاً': 'bg-red-500',
  'مكتملة': 'bg-emerald-500',
};

export const STATUS_BADGE_VARIANT: Record<TaskStatus, 'default' | 'secondary' | 'destructive' | 'outline' | 'warning' | 'success'> = {
  'جديدة': 'outline',
  'تم الاستلام': 'secondary',
  'قيد التنفيذ': 'warning',
  'تنتظر المراجعة': 'default',
  'تحتاج تعديلاً': 'destructive',
  'مكتملة': 'success',
};
