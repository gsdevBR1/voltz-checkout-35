
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
  // Status fields for tracking the cloning process
  status?: 'pending' | 'cloning' | 'cloned' | 'error' | 'integrating' | 'integrated';
  errorMessage?: string;
  clonedProductId?: string;
  voltzCheckoutUrl?: string;
  shopifyProductUrl?: string;
  isIntegratedWithVoltz?: boolean;
}

export interface ShopifyAppCredentials {
  apiKey: string;
  apiSecret: string;
  accessToken: string;
  shopDomain: string;
  isConnected: boolean;
  // Add additional properties for the app permissions
  permissions?: string[];
  installationType?: 'official' | 'private';
  appId?: string;
  scopes?: string[];
}

export interface ShopifyCloneResult {
  success: boolean;
  message: string;
  productId?: string;
  shopifyProductUrl?: string;
  checkoutIntegrated?: boolean;
}

export interface ShopifyStoreCloneStatus {
  totalProducts: number;
  processedProducts: number;
  successCount: number;
  errorCount: number;
  inProgress: boolean;
  integratedWithVoltz: number;
}
