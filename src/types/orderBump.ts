
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
  // New fields can be added here as the form evolves
  layout?: "empilhado" | "carrossel";
  limitQuantity?: boolean;
  showStrikedPrice?: boolean;
  backgroundColor?: string;
  textColor?: string;
  buttonColor?: string;
  buttonText?: string;
  buttonStyle?: "rounded" | "pill" | "square";
  imageStyle?: "square" | "rounded" | "circle";
}

export interface OrderBumpFormData {
  name: string;
  description: string;
  isActive: boolean;
  triggerProductIds: string[];
  offerProductIds: string[];
  layout?: "empilhado" | "carrossel";
  limitQuantity?: boolean;
  showStrikedPrice?: boolean;
  backgroundColor?: string;
  textColor?: string;
  buttonColor?: string;
  buttonText?: string;
  buttonStyle?: "rounded" | "pill" | "square";
  imageStyle?: "square" | "rounded" | "circle";
}
