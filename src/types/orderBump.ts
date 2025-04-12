
import { Product } from './product';

export interface OrderBump {
  id: string;
  name: string;
  description?: string;
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
  description?: string;
  triggerProductIds: string[];
  offerProductIds: string[];
  isActive: boolean;
}

// Add Upsell type definitions
export interface Upsell {
  id: string;
  name: string;
  description?: string;
  // Products that will trigger this Upsell to appear
  triggerProductIds: string[];
  // Products that will be offered as Upsell
  offerProductIds: string[];
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
  // Products that have this upsell automatically applied
  linkedProductIds?: string[];
  conversionRate?: number;
  // Template and visualization settings
  template?: UpsellTemplate;
}

export interface UpsellTemplate {
  title: string;
  description: string;
  productImage: string;
  productName: string;
  originalPrice: number;
  discountPrice: number;
  countdown: boolean;
  countdownMinutes: number;
  paymentMethod: 'card' | 'pix';
  buttonText: string;
  declineText: string;
  redirectUrl: string;
  showOriginalPrice: boolean;
  showScarcityBadge: boolean;
  scarcityText: string;
  layout: 'vertical' | 'horizontal';
  theme: {
    background: string;
    cardBackground: string;
    title: string;
    text: string;
    button: string;
    buttonText: string;
    border: string;
    boxShadow: string;
    font: string;
  };
}

export interface UpsellFormData {
  name: string;
  description?: string;
  triggerProductIds: string[];
  offerProductIds: string[];
  isActive: boolean;
  applyToAllProducts?: boolean;
  template?: Partial<UpsellTemplate>;
}
