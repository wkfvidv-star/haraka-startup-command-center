import { supabase } from '../lib/supabase';
import { Meeting, NewMeeting } from '../types/governance';

class MeetingService {
  private async getCompanyId() {
    const { data: { session } } = await supabase!.auth.getSession();
    if (!session) throw new Error('Not authenticated');

    const { data: members, error } = await supabase!
      .from('company_members')
      .select('company_id')
      .eq('status', 'Active')
      .limit(1);

    if (error || !members || members.length === 0) {
      throw new Error('No active company found for user');
    }
    return members[0].company_id;
  }

  private serialize(data: Partial<Meeting> | NewMeeting): Record<string, any> {
    const { participants, decisions, ...rest } = data as any;
    return {
      ...rest,
      participants: Array.isArray(participants) ? participants.join('|') : (participants ?? ''),
      decisions: Array.isArray(decisions) ? decisions.join('\n') : (decisions ?? ''),
    };
  }

  private deserialize(row: any): Meeting {
    return {
      ...row,
      participants: row.participants ? row.participants.split('|') : [],
      decisions: row.decisions ?? '',
    } as Meeting;
  }

  async getAll(): Promise<Meeting[]> {
    const company_id = await this.getCompanyId();
    const { data, error } = await supabase!.from('meetings').select('*').eq('company_id', company_id);
    if (error) throw error;
    return (data ?? []).map(r => this.deserialize(r));
  }

  async create(data: NewMeeting): Promise<Meeting> {
    const company_id = await this.getCompanyId();
    const payload = this.serialize(data);
    const { data: result, error } = await supabase!
      .from('meetings')
      .insert([{ ...payload, company_id }])
      .select()
      .single();
    if (error) throw error;
    return this.deserialize(result);
  }

  async update(id: string, patch: Partial<Meeting>): Promise<Meeting> {
    const company_id = await this.getCompanyId();
    const payload = this.serialize(patch);
    const { data, error } = await supabase!
      .from('meetings')
      .update(payload)
      .eq('id', id)
      .eq('company_id', company_id)
      .select()
      .single();
    if (error) throw error;
    return this.deserialize(data);
  }

  async delete(id: string): Promise<void> {
    const company_id = await this.getCompanyId();
    const { error } = await supabase!.from('meetings').delete().eq('id', id).eq('company_id', company_id);
    if (error) throw error;
  }
}

export const meetingService = new MeetingService();
// Alias for governance module
export const govMeetingService = meetingService;
