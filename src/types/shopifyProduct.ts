
export interface ShopifyProductVariant {
  id: string;
  title: string;
  price: string;
  available: boolean;
  sku: string;
  options: {
    name: string;
    value: string;
  }[];
}

export interface ShopifyProduct {
  id: string;
  title: string;
  description: string;
  price: number;
  compareAtPrice: number | null;
  images: string[];
  variants: ShopifyProductVariant[];
  options: {
    name: string;
    values: string[];
  }[];
  vendor: string;
  productType: string;
  handle: string;
  tags: string[];
  url: string;
}
