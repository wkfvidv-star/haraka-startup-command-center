import { Customer } from '../types/market';
import { demoCustomers } from '../data/demo/market';
import { delay } from './delay';

class CustomerService {
  private store: Customer[] = [...demoCustomers];

  async getAll(): Promise<Customer[]> {
    await delay(200);
    return [...this.store];
  }
}
export const customerService = new CustomerService();
