
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
  // New fields for tracking the cloning process
  status?: 'pending' | 'cloning' | 'complete' | 'error';
  errorMessage?: string;
  clonedProductId?: string;
  voltzCheckoutUrl?: string;
}

export interface ShopifyAppCredentials {
  apiKey: string;
  apiSecret: string;
  accessToken: string;
  shopDomain: string;
  isConnected: boolean;
}

export interface ShopifyCloneResult {
  success: boolean;
  message: string;
  productId?: string;
  checkoutUrl?: string;
}

export interface ShopifyStoreCloneStatus {
  totalProducts: number;
  processedProducts: number;
  successCount: number;
  errorCount: number;
  inProgress: boolean;
}
