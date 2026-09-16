import { supabase } from '../lib/supabase';
import { DocumentRecord, NewDocumentRecord } from '../types/governance';

const META_SEPARATOR = '\n---HARAKA_META---\n';

function serializeDocument(data: NewDocumentRecord | Partial<DocumentRecord>): Record<string, any> {
  const { owner, notes, ...rest } = data as any;
  const meta: Record<string, string> = {};
  if (owner) meta.owner = owner;

  const hasMeta = Object.keys(meta).length > 0;
  const serializedNotes = hasMeta
    ? `${notes ?? ''}${META_SEPARATOR}${JSON.stringify(meta)}`
    : (notes ?? '');

  return { ...rest, notes: serializedNotes };
}

function deserializeDocument(row: any): DocumentRecord {
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
  } as DocumentRecord;
}

export function computeDocumentStatus(d: DocumentRecord): DocumentRecord {
  if (!d.expiryDate || d.status === 'Archived' || d.status === 'Missing') return d;
  const exp = new Date(d.expiryDate);
  const now = new Date();
  if (exp < now) return { ...d, status: 'Expired' };
  return d;
}

class DocumentService {
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

  async getAll(): Promise<DocumentRecord[]> {
    const company_id = await this.getCompanyId();
    const { data, error } = await supabase!.from('documents').select('*').eq('company_id', company_id);
    if (error) throw error;
    return (data ?? []).map(deserializeDocument).map(computeDocumentStatus);
  }

  async create(data: NewDocumentRecord): Promise<DocumentRecord> {
    const company_id = await this.getCompanyId();
    const payload = serializeDocument(data);
    const { data: result, error } = await supabase!.from('documents').insert([{ ...payload, company_id }]).select().single();
    if (error) throw error;
    return computeDocumentStatus(deserializeDocument(result));
  }

  async update(id: string, patch: Partial<DocumentRecord>): Promise<DocumentRecord> {
    const company_id = await this.getCompanyId();
    const current = await this.getById(id);
    if (!current) throw new Error('Document not found');

    const merged = { ...current, ...patch };
    const payload = serializeDocument(merged);

    const { data, error } = await supabase!.from('documents').update(payload).eq('id', id).eq('company_id', company_id).select().single();
    if (error) throw error;
    return computeDocumentStatus(deserializeDocument(data));
  }

  async getById(id: string): Promise<DocumentRecord | null> {
    const company_id = await this.getCompanyId();
    const { data, error } = await supabase!.from('documents').select('*').eq('id', id).eq('company_id', company_id).single();
    if (error) return null;
    return deserializeDocument(data);
  }

  async delete(id: string): Promise<void> {
    const company_id = await this.getCompanyId();
    const { error } = await supabase!.from('documents').delete().eq('id', id).eq('company_id', company_id);
    if (error) throw error;
  }
}

export const documentService = new DocumentService();
