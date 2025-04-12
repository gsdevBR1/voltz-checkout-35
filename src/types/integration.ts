
export interface Integration {
  id: string;
  name: string;
  description: string;
  category: 'ecommerce' | 'pixel' | 'tracking';
  status: 'integrated' | 'not_integrated' | 'auth_failed';
  logo: string;
  lastSync?: Date;
  isNative?: boolean;
  externalUrl?: string;
}

export interface EcommerceIntegration extends Integration {
  category: 'ecommerce';
  platform: 'shopify' | 'woocommerce';
  credentials?: {
    apiKey?: string;
    apiSecret?: string;
    accessToken?: string;
    shopDomain?: string;
    storeUrl?: string;
  };
}

export interface PixelIntegration extends Integration {
  category: 'pixel';
  platform: 'google_ads' | 'google_analytics' | 'google_tag_manager' | 'meta' | 'tiktok' | 'pinterest' | 'kwai' | 'taboola' | 'mgid' | 'outbrain';
  pixels?: PixelConfig[];
}

export interface PixelConfig {
  id: string;
  name: string;
  platform: PixelIntegration['platform'];
  status: 'active' | 'inactive';
  createdAt: Date;
  updatedAt: Date;
  integrationType?: 'classic' | 'conversion_api'; // For Meta
  credentials: {
    pixelId?: string;
    conversionId?: string;
    conversionLabel?: string;
    measurementId?: string;
    containerId?: string;
    eventId?: string;
    trackingCode?: string;
    token?: string; // For Meta conversion API
  };
  rules?: {
    trackBoleto?: boolean;
    trackPix?: boolean;
  };
}

export interface TrackingIntegration extends Integration {
  category: 'tracking';
  platform: 'utmify' | 'xtracky';
}

export type AnyIntegration = EcommerceIntegration | PixelIntegration | TrackingIntegration;
