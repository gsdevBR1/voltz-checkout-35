
import React, { useState } from 'react';
import IntegrationLayout from './IntegrationLayout';
import IntegrationCard from '@/components/integracoes/IntegrationCard';
import { useToast } from '@/hooks/use-toast';
import { TrackingIntegration } from '@/types/integration';

// Mock data for Tracking integrations
const trackingIntegrations: TrackingIntegration[] = [
  {
    id: 'utmify',
    name: 'UTMify',
    description: 'Crie e gerencie links com UTM para rastrear a origem do tráfego.',
    category: 'tracking',
    platform: 'utmify',
    status: 'not_integrated',
    logo: 'https://media.licdn.com/dms/image/C4D0BAQFm9hiVZxp56g/company-logo_200_200/0/1660657124131/utmify_logo?e=1752451200&v=beta&t=sRwH-WTNfLb1upVbDTwSEHRX7hWdDaFEiAqkCAMa0jg',
    isNative: false,
    externalUrl: 'https://utmify.me'
  },
  {
    id: 'xtracky',
    name: 'Xtracky',
    description: 'Analise conversões por canal, campanha e fonte de tráfego.',
    category: 'tracking',
    platform: 'xtracky',
    status: 'not_integrated',
    logo: 'https://xtracky.com/branding/logo-full-white.svg',
    isNative: false,
    externalUrl: 'https://xtracky.com'
  }
];

const TrackingIntegrations: React.FC = () => {
  const [integrations, setIntegrations] = useState<TrackingIntegration[]>(trackingIntegrations);
  const { toast } = useToast();

  const handleConnect = (integration: TrackingIntegration) => {
    // For external tools, we just notify the user
    toast({
      title: `Redirecionando para ${integration.name}`,
      description: `Você será redirecionado para a plataforma ${integration.name} para configurar a integração.`,
    });
    
    // In a real application, we might update the status after successful OAuth
    setTimeout(() => {
      if (integration.externalUrl) {
        window.open(integration.externalUrl, '_blank');
      }
    }, 500);
  };

  const handleDisconnect = (integration: TrackingIntegration) => {
    // Simulate API call
    setTimeout(() => {
      setIntegrations(prev => 
        prev.map(item => 
          item.id === integration.id 
            ? { ...item, status: 'not_integrated', lastSync: undefined } 
            : item
        )
      );
      
      toast({
        title: `${integration.name} desconectado`,
        description: `A integração com ${integration.name} foi removida.`,
      });
    }, 500);
  };

  const handleUpdate = (integration: TrackingIntegration) => {
    // For external tools, just redirect
    if (integration.externalUrl) {
      window.open(integration.externalUrl, '_blank');
    }
  };

  // Tooltip content for each integration
  const getTooltipContent = (integration: TrackingIntegration) => {
    switch (integration.platform) {
      case 'utmify':
        return (
          <div className="space-y-2">
            <p>O UTMify permite:</p>
            <ul className="list-disc pl-5 space-y-1">
              <li>Criar links UTM para suas campanhas</li>
              <li>Rastrear a eficácia de diferentes canais</li>
              <li>Analisar conversões por origem de tráfego</li>
            </ul>
            <p className="text-xs mt-2">
              Esta é uma ferramenta externa que se integra ao VOLTZ Checkout
            </p>
          </div>
        );
      case 'xtracky':
        return (
          <div className="space-y-2">
            <p>O Xtracky oferece:</p>
            <ul className="list-disc pl-5 space-y-1">
              <li>Rastreamento avançado de múltiplos canais</li>
              <li>Atribuição de conversão precisa</li>
              <li>Dashboards personalizados de ROI</li>
            </ul>
            <p className="text-xs mt-2">
              Esta é uma ferramenta externa que se integra ao VOLTZ Checkout
            </p>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <IntegrationLayout 
      title="Ferramentas de Trackeamento"
      description="Integre ferramentas especializadas em rastreamento e atribuição de marketing."
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
    </IntegrationLayout>
  );
};

export default TrackingIntegrations;
