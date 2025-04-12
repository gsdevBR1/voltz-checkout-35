
export interface ShippingMethod {
  id: string;
  name: string;
  value: number;
  estimatedDays: number;
  type: 'correios' | 'transportadora' | 'retirada';
  status: 'active' | 'inactive';
  createdAt: string;
}
