
import React, { useState } from 'react';
import IntegrationLayout from './IntegrationLayout';
import IntegrationCard from '@/components/integracoes/IntegrationCard';
import ConnectPixelDialog from '@/components/integracoes/ConnectPixelDialog';
import { useToast } from '@/hooks/use-toast';
import { PixelIntegration } from '@/types/integration';

// Mock data for Pixel integrations
const pixelsIntegrations: PixelIntegration[] = [
  {
    id: 'google_ads',
    name: 'Google Ads',
    description: 'Rastreie conversões e otimize suas campanhas no Google Ads.',
    category: 'pixel',
    platform: 'google_ads',
    status: 'not_integrated',
    logo: 'https://www.gstatic.com/images/branding/product/1x/googleg_48dp.png',
    isNative: true
  },
  {
    id: 'google_analytics',
    name: 'Google Analytics 4',
    description: 'Acompanhe o comportamento dos usuários e performance de vendas.',
    category: 'pixel',
    platform: 'google_analytics',
    status: 'not_integrated',
    logo: 'https://www.gstatic.com/analytics-suite/header/suite/v2/ic_analytics.svg',
    isNative: true
  },
  {
    id: 'google_tag_manager',
    name: 'Google Tag Manager',
    description: 'Gerencie todos os pixels e scripts através de um único contêiner.',
    category: 'pixel',
    platform: 'google_tag_manager',
    status: 'not_integrated',
    logo: 'https://www.gstatic.com/analytics-suite/header/suite/v2/ic_tag_manager.svg',
    isNative: true
  },
  {
    id: 'meta',
    name: 'Meta (Facebook)',
    description: 'Rastreie conversões de suas campanhas no Facebook e Instagram.',
    category: 'pixel',
    platform: 'meta',
    status: 'not_integrated',
    logo: 'https://static.xx.fbcdn.net/rsrc.php/v3/ye/r/y5XwSRJQID1.png',
    isNative: true
  },
  {
    id: 'tiktok',
    name: 'TikTok',
    description: 'Otimize suas campanhas de anúncios na plataforma TikTok.',
    category: 'pixel',
    platform: 'tiktok',
    status: 'not_integrated',
    logo: 'https://lf16-adcdn-pte.ibytedtos.com/obj/pte-assets/tiktokads-business-suite-v3/frontend/static/x.image',
    isNative: true
  },
  {
    id: 'pinterest',
    name: 'Pinterest',
    description: 'Rastreie conversões das suas campanhas no Pinterest.',
    category: 'pixel',
    platform: 'pinterest',
    status: 'not_integrated',
    logo: 'https://s.pinimg.com/images/favicon_red_192.png',
    isNative: true
  },
  {
    id: 'kwai',
    name: 'Kwai',
    description: 'Integre suas campanhas de anúncios com a plataforma Kwai.',
    category: 'pixel',
    platform: 'kwai',
    status: 'not_integrated',
    logo: 'https://s1.kwai.net/kos/s3/intl_image/logo.png',
    isNative: true
  },
  {
    id: 'taboola',
    name: 'Taboola',
    description: 'Rastreie conversões das suas campanhas na Taboola.',
    category: 'pixel',
    platform: 'taboola',
    status: 'not_integrated',
    logo: 'https://10updotcom-wpengine.s3.amazonaws.com/uploads/2016/04/taboola-logo.png',
    isNative: true
  },
  {
    id: 'mgid',
    name: 'Mgid',
    description: 'Otimize campanhas de conteúdo nativo e anúncios na rede Mgid.',
    category: 'pixel',
    platform: 'mgid',
    status: 'not_integrated',
    logo: 'https://www.mgid.com/assets/images/mgid-logo.svg',
    isNative: true
  },
  {
    id: 'outbrain',
    name: 'Outbrain',
    description: 'Rastreie conversões das suas campanhas de conteúdo no Outbrain.',
    category: 'pixel',
    platform: 'outbrain',
    status: 'not_integrated',
    logo: 'https://www.outbrain.com/wp-content/uploads/2020/11/outbrain-logo-2.svg',
    isNative: true
  },
];

const PixelsIntegrations: React.FC = () => {
  const [integrations, setIntegrations] = useState<PixelIntegration[]>(pixelsIntegrations);
  const [selectedIntegration, setSelectedIntegration] = useState<PixelIntegration | null>(null);
  const [showPixelDialog, setShowPixelDialog] = useState(false);
  const { toast } = useToast();

  const handleConnectPixel = async (platform: string, credentials: Record<string, string>) => {
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Update integration status
      setIntegrations(prev => 
        prev.map(item => 
          item.platform === platform 
            ? { 
                ...item, 
                status: 'integrated', 
                credentials,
                lastSync: new Date()
              } 
            : item
        )
      );
      
      const integration = integrations.find(i => i.platform === platform);
      
      toast({
        title: `${integration?.name} conectado com sucesso!`,
        description: `O pixel do ${integration?.name} foi integrado à plataforma VOLTZ Checkout.`,
      });
    } catch (error) {
      console.error(`Error connecting ${platform}:`, error);
      toast({
        title: "Erro ao conectar pixel",
        description: "Não foi possível integrar o pixel. Verifique suas credenciais e tente novamente.",
        variant: "destructive",
      });
    }
  };

  const handleDisconnect = (integration: PixelIntegration) => {
    // Simulate API call
    setTimeout(() => {
      setIntegrations(prev => 
        prev.map(item => 
          item.id === integration.id 
            ? { ...item, status: 'not_integrated', credentials: undefined, lastSync: undefined } 
            : item
        )
      );
      
      toast({
        title: `${integration.name} desconectado`,
        description: `A integração com ${integration.name} foi removida.`,
      });
    }, 500);
  };

  const handleUpdate = (integration: PixelIntegration) => {
    setSelectedIntegration(integration);
    setShowPixelDialog(true);
  };

  const handleConnect = (integration: PixelIntegration) => {
    setSelectedIntegration(integration);
    setShowPixelDialog(true);
  };

  // Tooltip content for each integration
  const getTooltipContent = (integration: PixelIntegration) => {
    switch (integration.platform) {
      case 'google_ads':
        return (
          <div className="space-y-2">
            <p>Para integrar o Google Ads você precisará de:</p>
            <ul className="list-disc pl-5 space-y-1">
              <li>Conversion ID (Formato: AW-XXXXXXXXX)</li>
              <li>Conversion Label</li>
            </ul>
            <p className="text-xs mt-2">
              Localize essas informações no seu painel do Google Ads em Ferramentas &gt; Conversões
            </p>
          </div>
        );
      case 'google_analytics':
        return (
          <div className="space-y-2">
            <p>Para integrar o Google Analytics 4 você precisará de:</p>
            <ul className="list-disc pl-5 space-y-1">
              <li>Measurement ID (Formato: G-XXXXXXXXXX)</li>
            </ul>
            <p className="text-xs mt-2">
              Encontre no painel do GA4 em Administrador &gt; Propriedade &gt; Fluxos de dados
            </p>
          </div>
        );
      case 'meta':
        return (
          <div className="space-y-2">
            <p>Para integrar o Meta Pixel você precisará de:</p>
            <ul className="list-disc pl-5 space-y-1">
              <li>Pixel ID - número de identificação do seu pixel</li>
              <li>Event ID - opcional, para eventos personalizados</li>
            </ul>
            <p className="text-xs mt-2">
              Localize no Gerenciador de Eventos do Facebook em seu Business Manager
            </p>
          </div>
        );
      default:
        return (
          <div className="space-y-2">
            <p>Para integrar este pixel você precisará de:</p>
            <ul className="list-disc pl-5 space-y-1">
              <li>ID do pixel ou código de rastreamento</li>
            </ul>
            <p className="text-xs mt-2">
              Consulte a documentação da plataforma para obter estas informações
            </p>
          </div>
        );
    }
  };

  return (
    <IntegrationLayout 
      title="Pixels de Rastreamento"
      description="Conecte pixels de rastreamento para otimizar suas campanhas de marketing."
    >
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {integrations.map(integration => (
          <IntegrationCard
            key={integration.id}
            integration={integration}
            onConnect={handleConnect}
            onDisconnect={handleDisconnect}
            onUpdate={handleUpdate}
            tooltipContent={getTooltipContent(integration)}
          />
        ))}
      </div>
      
      <ConnectPixelDialog
        isOpen={showPixelDialog}
        onClose={() => setShowPixelDialog(false)}
        integration={selectedIntegration}
        onConnect={handleConnectPixel}
      />
    </IntegrationLayout>
  );
};

export default PixelsIntegrations;
