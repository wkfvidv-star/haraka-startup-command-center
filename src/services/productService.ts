import { ProductReadinessItem, NewProductReadinessItem } from '../types/product';
import { demoProducts } from '../data/demo/products';

const delay = (ms: number) => new Promise(res => setTimeout(res, ms));

class ProductService {
  private store: ProductReadinessItem[] = [...demoProducts];

  async getAll(): Promise<ProductReadinessItem[]> {
    await delay(200);
    return [...this.store];
  }

  async create(data: NewProductReadinessItem): Promise<ProductReadinessItem> {
    await delay(300);
    const item: ProductReadinessItem = { ...data, id: `pr-${Date.now()}` };
    this.store.push(item);
    return item;
  }

  async update(id: string, patch: Partial<ProductReadinessItem>): Promise<ProductReadinessItem> {
    await delay(300);
    const idx = this.store.findIndex(i => i.id === id);
    if (idx === -1) throw new Error('Item not found');
    this.store[idx] = { ...this.store[idx], ...patch };
    return this.store[idx];
  }

  async delete(id: string): Promise<void> {
    await delay(300);
    this.store = this.store.filter(i => i.id !== id);
  }
}

export const productService = new ProductService();
