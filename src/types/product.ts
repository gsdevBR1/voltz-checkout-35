
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
  fromShopify?: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface ProductFormData {
  name: string;
  type: ProductType;
  price: number;
  description: string;
  stock?: number | null;
  status: ProductStatus;
  imageUrl?: string;
}
