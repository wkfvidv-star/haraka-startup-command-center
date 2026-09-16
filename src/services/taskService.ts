import { supabase } from '../lib/supabase';
// ============================================================
// SERVICE: taskService.ts
// Uses Supabase for persistence.
// Extra fields (assigner, expectedResult, domain, reviewNotes)
// are serialized into the description column as a JSON block.
// This avoids any DB schema changes.
// ============================================================
import { Task, NewTask } from '../types/task';

const META_SEPARATOR = '\n---HARAKA_META---\n';

// Serialize extra fields into description
function serializeTask(data: NewTask | Partial<Task>): Record<string, any> {
  const { assigner, expectedResult, domain, reviewNotes, description, ...rest } = data as any;
  const meta: Record<string, string> = {};
  if (assigner)       meta.assigner = assigner;
  if (expectedResult) meta.expectedResult = expectedResult;
  if (domain)         meta.domain = domain;
  if (reviewNotes)    meta.reviewNotes = reviewNotes;

  const hasMeta = Object.keys(meta).length > 0;
  const serializedDesc = hasMeta
    ? `${description ?? ''}${META_SEPARATOR}${JSON.stringify(meta)}`
    : (description ?? '');

  return { ...rest, description: serializedDesc };
}

// Deserialize extra fields from description
function deserializeTask(row: any): Task {
  const raw = row.description ?? '';
  const sepIdx = raw.indexOf(META_SEPARATOR);
  let description = raw;
  let meta: Record<string, string> = {};

  if (sepIdx !== -1) {
    description = raw.slice(0, sepIdx);
    try { meta = JSON.parse(raw.slice(sepIdx + META_SEPARATOR.length)); } catch {}
  }

  return {
    ...row,
    description,
    assigner:       meta.assigner ?? undefined,
    expectedResult: meta.expectedResult ?? undefined,
    domain:         meta.domain ?? undefined,
    reviewNotes:    meta.reviewNotes ?? undefined,
  } as Task;
}

class TaskService {
  private async getCompanyId() {
    if (!supabase) throw new Error('Not authenticated');
    const { data: { session } } = await supabase.auth.getSession();
    if (!session) throw new Error('Not authenticated');

    const { data: members, error } = await supabase
      .from('company_members')
      .select('company_id')
      .eq('status', 'Active')
      .limit(1);

    if (error || !members || members.length === 0) {
      throw new Error('No active company found for user');
    }
    return members[0].company_id;
  }

  async getAll(): Promise<Task[]> {
    const company_id = await this.getCompanyId();
    const { data, error } = await supabase!.from('tasks').select('*').eq('company_id', company_id);
    if (error) throw error;
    return (data ?? []).map(deserializeTask);
  }

  async getById(id: string): Promise<Task | null> {
    const company_id = await this.getCompanyId();
    const { data, error } = await supabase!.from('tasks').select('*').eq('id', id).eq('company_id', company_id).single();
    if (error) return null;
    return deserializeTask(data);
  }

  async create(data: NewTask): Promise<Task> {
    const company_id = await this.getCompanyId();
    const payload = serializeTask(data);
    const { data: result, error } = await supabase!
      .from('tasks')
      .insert([{ ...payload, company_id }])
      .select()
      .single();
    if (error) throw error;
    return deserializeTask(result);
  }

  async update(id: string, patch: Partial<Omit<Task, 'id' | 'createdAt'>>): Promise<Task> {
    const company_id = await this.getCompanyId();
    
    // If updating description-related meta fields, fetch current row first
    const needsMerge = patch.assigner !== undefined || patch.expectedResult !== undefined ||
                       patch.domain !== undefined || patch.reviewNotes !== undefined ||
                       patch.description !== undefined;

    let payload: Record<string, any> = patch;

    if (needsMerge) {
      // Get current task to merge meta
      const current = await this.getById(id);
      const merged: Partial<Task> = {
        ...current,
        ...patch,
      };
      payload = serializeTask(merged);
    }

    const { data, error } = await supabase!
      .from('tasks')
      .update(payload)
      .eq('id', id)
      .eq('company_id', company_id)
      .select()
      .single();
    if (error) throw error;
    return deserializeTask(data);
  }

  async delete(id: string): Promise<void> {
    const company_id = await this.getCompanyId();
    const { error } = await supabase!.from('tasks').delete().eq('id', id).eq('company_id', company_id);
    if (error) throw error;
  }
}

export const taskService = new TaskService();
