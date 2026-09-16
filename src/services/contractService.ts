import { supabase } from '../lib/supabase';
import { ContractRecord, NewContractRecord } from '../types/governance';

const META_SEPARATOR = '\n---HARAKA_META---\n';

function serializeContract(data: NewContractRecord | Partial<ContractRecord>): Record<string, any> {
  const { owner, notes, ...rest } = data as any;
  const meta: Record<string, string> = {};
  if (owner) meta.owner = owner;

  const hasMeta = Object.keys(meta).length > 0;
  const serializedNotes = hasMeta
    ? `${notes ?? ''}${META_SEPARATOR}${JSON.stringify(meta)}`
    : (notes ?? '');

  return { ...rest, notes: serializedNotes };
}

function deserializeContract(row: any): ContractRecord {
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
  } as ContractRecord;
}

export function computeContractStatus(c: ContractRecord): ContractRecord {
  if (c.status === 'Terminated' || c.status === 'Draft') return c;
  const end = new Date(c.endDate);
  const now = new Date();
  const diffDays = (end.getTime() - now.getTime()) / 86400000;
  if (diffDays < 0) return { ...c, status: 'Expired' };
  if (diffDays <= 30) return { ...c, status: 'Expiring' };
  return { ...c, status: 'Active' };
}

class ContractService {
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

  async getAll(): Promise<ContractRecord[]> {
    const company_id = await this.getCompanyId();
    const { data, error } = await supabase!.from('contracts').select('*').eq('company_id', company_id);
    if (error) throw error;
    return (data ?? []).map(deserializeContract).map(computeContractStatus);
  }

  async create(data: NewContractRecord): Promise<ContractRecord> {
    const company_id = await this.getCompanyId();
    const payload = serializeContract(data);
    const { data: result, error } = await supabase!.from('contracts').insert([{ ...payload, company_id }]).select().single();
    if (error) throw error;
    return computeContractStatus(deserializeContract(result));
  }

  async update(id: string, patch: Partial<ContractRecord>): Promise<ContractRecord> {
    const company_id = await this.getCompanyId();
    const current = await this.getById(id);
    if (!current) throw new Error('Contract not found');

    const merged = { ...current, ...patch };
    const payload = serializeContract(merged);

    const { data, error } = await supabase!.from('contracts').update(payload).eq('id', id).eq('company_id', company_id).select().single();
    if (error) throw error;
    return computeContractStatus(deserializeContract(data));
  }

  async getById(id: string): Promise<ContractRecord | null> {
    const company_id = await this.getCompanyId();
    const { data, error } = await supabase!.from('contracts').select('*').eq('id', id).eq('company_id', company_id).single();
    if (error) return null;
    return deserializeContract(data);
  }

  async delete(id: string): Promise<void> {
    const company_id = await this.getCompanyId();
    const { error } = await supabase!.from('contracts').delete().eq('id', id).eq('company_id', company_id);
    if (error) throw error;
  }
}

export const contractService = new ContractService();
