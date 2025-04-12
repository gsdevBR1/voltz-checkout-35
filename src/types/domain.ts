
export interface Domain {
  id: string;
  name: string;
  type: 'checkout' | 'secure' | 'pay' | 'seguro';
  status: 'active' | 'pending' | 'failed';
  createdAt: string;
}
