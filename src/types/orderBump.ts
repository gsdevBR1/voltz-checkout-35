
import { Product } from './product';

export interface OrderBump {
  id: string;
  name: string;
  // Products that will trigger this OrderBump to appear
  triggerProductIds: string[];
  // Products that will be offered as OrderBump
  offerProductIds: string[];
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
  conversionRate?: number;
}

export interface OrderBumpFormData {
  name: string;
  triggerProductIds: string[];
  offerProductIds: string[];
  isActive: boolean;
}
