import { supabase } from '../lib/supabase';
import { IPAsset, NewIPAsset } from '../types/governance';

const META_SEPARATOR = '\n---HARAKA_META---\n';

function serializeIPAsset(data: NewIPAsset | Partial<IPAsset>): Record<string, any> {
  const { owner, notes, ...rest } = data as any;
  const meta: Record<string, string> = {};
  if (owner) meta.owner = owner;

  const hasMeta = Object.keys(meta).length > 0;
  const serializedNotes = hasMeta
    ? `${notes ?? ''}${META_SEPARATOR}${JSON.stringify(meta)}`
    : (notes ?? '');

  return { ...rest, notes: serializedNotes };
}

function deserializeIPAsset(row: any): IPAsset {
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
  } as IPAsset;
}

class IPService {
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

  async getAll(): Promise<IPAsset[]> {
    const company_id = await this.getCompanyId();
    const { data, error } = await supabase!.from('ip_assets').select('*').eq('company_id', company_id);
    if (error) throw error;
    return (data ?? []).map(deserializeIPAsset);
  }

  async create(data: NewIPAsset): Promise<IPAsset> {
    const company_id = await this.getCompanyId();
    const payload = serializeIPAsset(data);
    const { data: result, error } = await supabase!.from('ip_assets').insert([{ ...payload, company_id }]).select().single();
    if (error) throw error;
    return deserializeIPAsset(result);
  }

  async update(id: string, patch: Partial<IPAsset>): Promise<IPAsset> {
    const company_id = await this.getCompanyId();
    const current = await this.getById(id);
    if (!current) throw new Error('IP Asset not found');

    const merged = { ...current, ...patch };
    const payload = serializeIPAsset(merged);

    const { data, error } = await supabase!.from('ip_assets').update(payload).eq('id', id).eq('company_id', company_id).select().single();
    if (error) throw error;
    return deserializeIPAsset(data);
  }

  async getById(id: string): Promise<IPAsset | null> {
    const company_id = await this.getCompanyId();
    const { data, error } = await supabase!.from('ip_assets').select('*').eq('id', id).eq('company_id', company_id).single();
    if (error) return null;
    return deserializeIPAsset(data);
  }

  async delete(id: string): Promise<void> {
    const company_id = await this.getCompanyId();
    const { error } = await supabase!.from('ip_assets').delete().eq('id', id).eq('company_id', company_id);
    if (error) throw error;
  }
}

export const ipService = new IPService();
