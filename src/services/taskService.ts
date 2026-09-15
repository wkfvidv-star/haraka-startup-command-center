const delay = (ms = 100) => new Promise<void>((r) => setTimeout(r, ms));
import { supabase } from '../lib/supabase';
// ============================================================
// SERVICE: taskService.ts
// In-memory CRUD for Tasks. Replace internals with Supabase later.
// Interface stays unchanged — UI/Store do not need to be modified.
// ============================================================
import { Task, NewTask } from '../types/task';
import { demoTasks } from '../data/demo';



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
  private store: any[] = [];

  async getAll(): Promise<Task[]>  {
    const company_id = await this.getCompanyId();
    const { data, error } = await supabase!.from('tasks').select('*').eq('company_id', company_id);
    if (error) throw error;
    return data;
  }

  async getById(id: string): Promise<Task | null> {
    await delay();
    return structuredClone(this.store.find((t) => t.id === id) ?? null);
  }

  async getByProject(projectId: string): Promise<Task[]> {
    await delay();
    return structuredClone(this.store.filter((t) => t.projectId === projectId));
  }

  async create(data: NewTask): Promise<Task>  {
    const company_id = await this.getCompanyId();
    const { data: result, error } = await supabase!.from('tasks').insert([{ ...data, company_id }]).select().single();
    if (error) throw error;
    return result;
  }

  async update(id: string, patch: Partial<Omit<Task, 'id' | 'createdAt'>>): Promise<Task>  {
    const company_id = await this.getCompanyId();
    const { data, error } = await supabase!.from('tasks').update(patch).eq('id', id).eq('company_id', company_id).select().single();
    if (error) throw error;
    return data;
  }

  async delete(id: string): Promise<void>  {
    const company_id = await this.getCompanyId();
    const { error } = await supabase!.from('tasks').delete().eq('id', id).eq('company_id', company_id);
    if (error) throw error;
  }
}

export const taskService = new TaskService();
