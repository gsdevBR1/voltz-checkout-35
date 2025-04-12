
import { PixelIntegration, PixelConfig } from '@/types/integration';

// Mock data for Meta pixels
const metaPixels: PixelConfig[] = [
  {
    id: 'meta-pixel-1',
    name: 'Facebook Principal',
    platform: 'meta',
    integrationType: 'classic',
    status: 'active',
    createdAt: new Date('2023-11-20'),
    updatedAt: new Date('2024-02-15'),
    credentials: {
      pixelId: '12345678901234567',
    },
    rules: {
      trackBoleto: true,
      trackPix: true
    }
  },
  {
    id: 'meta-pixel-2',
    name: 'Instagram Conversões',
    platform: 'meta',
    integrationType: 'conversion_api',
    status: 'active',
    createdAt: new Date('2024-01-10'),
    updatedAt: new Date('2024-03-05'),
    credentials: {
      pixelId: '98765432109876543',
      token: 'EAABwzLixnjYBO...',
    },
    rules: {
      trackBoleto: true,
      trackPix: false
    }
  }
];

// Mock data for Google Ads pixels
const googleAdsPixels: PixelConfig[] = [
  {
    id: 'google-ads-pixel-1',
    name: 'Campanhas Google Ads',
    platform: 'google_ads',
    status: 'active',
    createdAt: new Date('2023-10-15'),
    updatedAt: new Date('2024-01-20'),
    credentials: {
      conversionId: 'AW-12345678',
      conversionLabel: 'AbCdEfGhIj-D'
    },
    rules: {
      trackBoleto: true,
      trackPix: true
    }
  }
];

// Mock data for TikTok pixels
const tiktokPixels: PixelConfig[] = [
  {
    id: 'tiktok-pixel-1',
    name: 'TikTok Ads Principal',
    platform: 'tiktok',
    status: 'active',
    createdAt: new Date('2023-12-01'),
    updatedAt: new Date('2024-02-10'),
    credentials: {
      pixelId: 'C3ABCDEFGHI4567890'
    },
    rules: {
      trackBoleto: false,
      trackPix: true
    }
  }
];

// Export the complete pixels integrations array
export const pixelsIntegrations: PixelIntegration[] = [
  {
    id: 'google_ads',
    name: 'Google Ads',
    description: 'Rastreie conversões e otimize suas campanhas no Google Ads.',
    category: 'pixel',
    platform: 'google_ads',
    status: 'integrated',
    logo: 'https://www.gstatic.com/images/branding/product/1x/googleg_48dp.png',
    isNative: true,
    pixels: googleAdsPixels
  },
  {
    id: 'google_analytics',
    name: 'Google Analytics 4',
    description: 'Acompanhe o comportamento dos usuários e performance de vendas.',
    category: 'pixel',
    platform: 'google_analytics',
    status: 'not_integrated',
    logo: 'https://www.gstatic.com/analytics-suite/header/suite/v2/ic_analytics.svg',
    isNative: true,
    pixels: []
  },
  {
    id: 'google_tag_manager',
    name: 'Google Tag Manager',
    description: 'Gerencie todos os pixels e scripts através de um único contêiner.',
    category: 'pixel',
    platform: 'google_tag_manager',
    status: 'not_integrated',
    logo: 'https://www.gstatic.com/analytics-suite/header/suite/v2/ic_tag_manager.svg',
    isNative: true,
    pixels: []
  },
  {
    id: 'meta',
    name: 'Meta (Facebook)',
    description: 'Rastreie conversões de suas campanhas no Facebook e Instagram.',
    category: 'pixel',
    platform: 'meta',
    status: 'integrated',
    logo: 'https://static.xx.fbcdn.net/rsrc.php/v3/ye/r/y5XwSRJQID1.png',
    isNative: true,
    pixels: metaPixels
  },
  {
    id: 'tiktok',
    name: 'TikTok',
    description: 'Otimize suas campanhas de anúncios na plataforma TikTok.',
    category: 'pixel',
    platform: 'tiktok',
    status: 'integrated',
    logo: 'https://lf16-adcdn-pte.ibytedtos.com/obj/pte-assets/tiktokads-business-suite-v3/frontend/static/x.image',
    isNative: true,
    pixels: tiktokPixels
  },
  {
    id: 'pinterest',
    name: 'Pinterest',
    description: 'Rastreie conversões das suas campanhas no Pinterest.',
    category: 'pixel',
    platform: 'pinterest',
    status: 'not_integrated',
    logo: 'https://s.pinimg.com/images/favicon_red_192.png',
    isNative: true,
    pixels: []
  },
  {
    id: 'kwai',
    name: 'Kwai',
    description: 'Integre suas campanhas de anúncios com a plataforma Kwai.',
    category: 'pixel',
    platform: 'kwai',
    status: 'not_integrated',
    logo: 'https://s1.kwai.net/kos/s3/intl_image/logo.png',
    isNative: true,
    pixels: []
  },
  {
    id: 'taboola',
    name: 'Taboola',
    description: 'Rastreie conversões das suas campanhas na Taboola.',
    category: 'pixel',
    platform: 'taboola',
    status: 'not_integrated',
    logo: 'https://10updotcom-wpengine.s3.amazonaws.com/uploads/2016/04/taboola-logo.png',
    isNative: true,
    pixels: []
  },
  {
    id: 'mgid',
    name: 'Mgid',
    description: 'Otimize campanhas de conteúdo nativo e anúncios na rede Mgid.',
    category: 'pixel',
    platform: 'mgid',
    status: 'not_integrated',
    logo: 'https://www.mgid.com/assets/images/mgid-logo.svg',
    isNative: true,
    pixels: []
  },
  {
    id: 'outbrain',
    name: 'Outbrain',
    description: 'Rastreie conversões das suas campanhas de conteúdo no Outbrain.',
    category: 'pixel',
    platform: 'outbrain',
    status: 'not_integrated',
    logo: 'https://www.outbrain.com/wp-content/uploads/2020/11/outbrain-logo-2.svg',
    isNative: true,
    pixels: []
  }
];
