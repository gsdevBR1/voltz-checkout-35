
export type ProductType = 'physical' | 'digital';
export type ProductStatus = 'active' | 'inactive';

export interface Product {
  id: string;
  name: string;
  type: ProductType;
  price: number;
  description: string;
  stock?: number;
  status: ProductStatus;
  imageUrl?: string;
  fromShopify?: boolean; // When true, type must be 'physical'
  createdAt: Date;
  updatedAt: Date;
  downloadUrl?: string;
  // Added properties for enhanced product details
  images?: string[];
  sku?: string;
  barcode?: string;
  costPrice?: number;
  comparePrice?: number;
  weight?: number;
  width?: number;
  height?: number;
  length?: number;
  hasVariants?: boolean;
  variantName?: string;
  variantValues?: string[];
  manageStock?: boolean;
}

export interface ProductFormData {
  name: string;
  type: ProductType;
  price: number;
  description: string;
  stock?: number | null;
  status: ProductStatus;
  imageUrl?: string;
  downloadUrl?: string;
  // Added form fields for enhanced product details
  images?: string[];
  sku?: string;
  barcode?: string;
  costPrice?: number;
  comparePrice?: number;
  weight?: number;
  width?: number;
  height?: number;
  length?: number;
  hasVariants?: boolean;
  variantName?: string;
  variantValues?: string[];
  manageStock?: boolean;
}
