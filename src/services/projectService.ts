const delay = (ms = 100) => new Promise<void>((r) => setTimeout(r, ms));
import { supabase } from '../lib/supabase';
// ============================================================
// SERVICE: projectService.ts
// In-memory CRUD for Projects. Progress is computed from tasks.
// ============================================================
import { Project, NewProject } from '../types/project';
import { Task } from '../types/task';


class ProjectService {

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

  async getAll(): Promise<Project[]>  {
    const company_id = await this.getCompanyId();
    const { data, error } = await supabase!.from('projects').select('*').eq('company_id', company_id);
    if (error) throw error;
    return data;
  }

  async getById(id: string): Promise<Project | null> {
    const company_id = await this.getCompanyId();
    const { data, error } = await supabase!.from('projects').select('*').eq('id', id).eq('company_id', company_id).single();
    if (error) return null;
    return data;
  }

  async create(data: NewProject): Promise<Project>  {
    const company_id = await this.getCompanyId();
    const { data: result, error } = await supabase!.from('projects').insert([{ ...data, company_id }]).select().single();
    if (error) throw error;
    return result;
  }

  async update(id: string, patch: Partial<Omit<Project, 'id' | 'createdAt'>>): Promise<Project>  {
    const company_id = await this.getCompanyId();
    const { data, error } = await supabase!.from('projects').update(patch).eq('id', id).eq('company_id', company_id).select().single();
    if (error) throw error;
    return data;
  }

  async delete(id: string): Promise<void>  {
    const company_id = await this.getCompanyId();
    const { error } = await supabase!.from('projects').delete().eq('id', id).eq('company_id', company_id);
    if (error) throw error;
  }

  /**
   * Recompute project progress based on its tasks.
   * Done tasks / total tasks = progress %.
   */
  async recomputeProgress(projectId: string, tasks: Task[]): Promise<Project | null> {
    const projectTasks = tasks.filter((t) => t.projectId === projectId);
    if (projectTasks.length === 0) return null;
    const done = projectTasks.filter((t) => t.status === 'مكتملة').length;
    const progress = Math.round((done / projectTasks.length) * 100);
    return this.update(projectId, { progress });
  }
}

export const projectService = new ProjectService();
