import { supabase } from '../lib/supabase';
import { Task } from '../types/task';
import { Goal } from '../types/goal';

/**
 * Supabase Adapter Skeleton
 * 
 * This file demonstrates how the services will migrate from in-memory arrays to Supabase.
 * Currently, it delegates to the existing in-memory mock services if Supabase is not connected.
 * 
 * When Auth is active and VITE_SUPABASE_URL is provided, these functions will replace the mock services.
 * RLS will handle the `company_id` isolation automatically via `auth.uid()`.
 */

export const SupabaseAdapter = {
  // Example: Tasks
  async getTasks(): Promise<Task[]> {
    if (!supabase) return [];
    
    const { data, error } = await supabase!
      .from('tasks')
      .select('*')
      .order('deadline', { ascending: true });
      
    if (error) throw error;
    return data as Task[];
  },

  async createTask(taskData: Partial<Task>): Promise<Task | null> {
    if (!supabase) return null;

    const { data, error } = await supabase!
      .from('tasks')
      .insert([taskData])
      .select()
      .single();
      
    if (error) throw error;
    return data as Task;
  },

  async updateTask(id: string, updates: Partial<Task>): Promise<void> {
    if (!supabase) return;

    const { error } = await supabase!
      .from('tasks')
      .update(updates)
      .eq('id', id);

    if (error) throw error;
  },

  async deleteTask(id: string): Promise<void> {
    if (!supabase) return;

    const { error } = await supabase!
      .from('tasks')
      .delete()
      .eq('id', id);

    if (error) throw error;
  }
};
