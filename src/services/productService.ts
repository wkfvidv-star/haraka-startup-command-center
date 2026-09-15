const delay = (ms = 100) => new Promise<void>((r) => setTimeout(r, ms));
import { supabase } from '../lib/supabase';
import { ProductReadinessItem, NewProductReadinessItem } from '../types/product';
import { demoProducts } from '../data/demo/products';



class ProductService {

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

  async getAll(): Promise<ProductReadinessItem[]>  {
    const company_id = await this.getCompanyId();
    const { data, error } = await supabase!.from('product_readiness_items').select('*').eq('company_id', company_id);
    if (error) throw error;
    return data;
  }

  async create(data: NewProductReadinessItem): Promise<ProductReadinessItem>  {
    const company_id = await this.getCompanyId();
    const { data: result, error } = await supabase!.from('product_readiness_items').insert([{ ...data, company_id }]).select().single();
    if (error) throw error;
    return result;
  }

  async update(id: string, patch: Partial<ProductReadinessItem>): Promise<ProductReadinessItem> {
    await delay(300);
    const idx = this.store.findIndex(i => i.id === id);
    if (idx === -1) throw new Error('Item not found');
    this.store[idx] = { ...this.store[idx], ...patch };
    return this.store[idx];
  }

  async delete(id: string): Promise<void>  {
    const company_id = await this.getCompanyId();
    const { error } = await supabase!.from('product_readiness_items').delete().eq('id', id).eq('company_id', company_id);
    if (error) throw error;
  }
}

export const productService = new ProductService();
