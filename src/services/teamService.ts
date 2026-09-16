
import { TeamMember, TeamRole, TeamStatus } from '../types/team';
import { demoTeamMembers } from '../data/demo/team';
import { delay } from './delay';
import { supabase } from '../lib/supabase';

class TeamService {
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

  async getAll(): Promise<TeamMember[]> {
    const company_id = await this.getCompanyId();
    // In HARAKA, team is usually managed via `company_members` joined with `profiles`. 
    // For simplicity matching the interface, we'll query profiles of people in company_members.
    const { data: mems } = await supabase!.from('company_members').select('profile_id, role, status').eq('company_id', company_id);
    if (!mems || mems.length === 0) return [];
    const profileIds = mems.map((m: any) => m.profile_id);
    
    const { data: profiles, error: err } = await supabase!.from('profiles').select('*').in('id', profileIds);
    if (err) throw err;
    
    return (profiles ?? []).map((p: any) => {
      const m = mems.find((x: any) => x.profile_id === p.id);
      return {
        id: p.id,
        name: p.full_name ?? '',
        role: (m?.role ?? 'Other') as TeamRole,
        department: 'Other',
        email: p.email ?? '',
        phone: '',
        status: (m?.status === 'Active' ? 'Active' : 'Inactive') as TeamStatus,
        joinedAt: p.created_at,
        responsibilities: '',
        skills: '',
        notes: '',
        createdAt: p.created_at,
        updatedAt: p.updated_at
      } as unknown as TeamMember;
    });
  }

  async create(data: Omit<TeamMember, 'id' | 'createdAt' | 'updatedAt'>): Promise<TeamMember> {
    throw new Error('Team members are managed via invitations in Supabase Auth');
  }

  async update(id: string, patch: Partial<TeamMember>): Promise<TeamMember> {
    throw new Error('Update via profile or company_members directly');
  }

  async delete(id: string): Promise<void> {
    throw new Error('Delete via company_members');
  }
}
export const teamService = new TeamService();
