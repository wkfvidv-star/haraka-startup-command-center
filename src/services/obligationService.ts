import { supabase } from '../lib/supabase';
import { Obligation, NewObligation } from '../types/governance';

const META_SEPARATOR = '\n---HARAKA_META---\n';

function serializeObligation(data: NewObligation | Partial<Obligation>): Record<string, any> {
  const { owner, notes, ...rest } = data as any;
  const meta: Record<string, string> = {};
  if (owner) meta.owner = owner;

  const hasMeta = Object.keys(meta).length > 0;
  const serializedNotes = hasMeta
    ? `${notes ?? ''}${META_SEPARATOR}${JSON.stringify(meta)}`
    : (notes ?? '');

  return { ...rest, notes: serializedNotes };
}

function deserializeObligation(row: any): Obligation {
  const raw = row.notes ?? '';
  const sepIdx = raw.indexOf(META_SEPARATOR);
  let notes = raw;
  let meta: Record<string, string> = {};

  if (sepIdx !== -1) {
    notes = raw.slice(0, sepIdx);
    try { meta = JSON.parse(raw.slice(sepIdx + META_SEPARATOR.length)); } catch {}
  }

  return {
    ...row,
    notes,
    owner: meta.owner ?? undefined,
  } as Obligation;
}

export function computeObligationStatus(o: Obligation): Obligation {
  if (o.status === 'Completed' || o.status === 'Cancelled') return o;
  const due = new Date(o.dueDate);
  const now = new Date();
  if (due < now) return { ...o, status: 'Overdue' };
  return o;
}

class ObligationService {
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

  async getAll(): Promise<Obligation[]> {
    const company_id = await this.getCompanyId();
    const { data, error } = await supabase!.from('obligations').select('*').eq('company_id', company_id);
    if (error) throw error;
    return (data ?? []).map(deserializeObligation).map(computeObligationStatus);
  }

  async create(data: NewObligation): Promise<Obligation> {
    const company_id = await this.getCompanyId();
    const payload = serializeObligation(data);
    const { data: result, error } = await supabase!.from('obligations').insert([{ ...payload, company_id }]).select().single();
    if (error) throw error;
    return computeObligationStatus(deserializeObligation(result));
  }

  async update(id: string, patch: Partial<Obligation>): Promise<Obligation> {
    const company_id = await this.getCompanyId();
    const current = await this.getById(id);
    if (!current) throw new Error('Obligation not found');

    const merged = { ...current, ...patch };
    const payload = serializeObligation(merged);

    const { data, error } = await supabase!.from('obligations').update(payload).eq('id', id).eq('company_id', company_id).select().single();
    if (error) throw error;
    return computeObligationStatus(deserializeObligation(data));
  }

  async getById(id: string): Promise<Obligation | null> {
    const company_id = await this.getCompanyId();
    const { data, error } = await supabase!.from('obligations').select('*').eq('id', id).eq('company_id', company_id).single();
    if (error) return null;
    return deserializeObligation(data);
  }

  async delete(id: string): Promise<void> {
    const company_id = await this.getCompanyId();
    const { error } = await supabase!.from('obligations').delete().eq('id', id).eq('company_id', company_id);
    if (error) throw error;
  }
}

export const obligationService = new ObligationService();
