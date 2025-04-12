
import { Product } from './product';

export interface OrderBump {
  id: string;
  name: string;
  description: string;
  isActive: boolean;
  // Products that will trigger this OrderBump to appear
  triggerProductIds: string[];
  // Products that will be offered as OrderBump
  offerProductIds: string[];
  conversionRate?: number;
  createdAt: Date;
  updatedAt: Date;
}

export interface OrderBumpFormData {
  name: string;
  description: string;
  isActive: boolean;
  triggerProductIds: string[];
  offerProductIds: string[];
}
