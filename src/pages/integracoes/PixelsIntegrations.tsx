
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import IntegrationLayout from './IntegrationLayout';
import IntegrationCard from '@/components/integracoes/IntegrationCard';
import { useToast } from '@/hooks/use-toast';
import { PixelIntegration } from '@/types/integration';

// Mock data for Pixel integrations
import { pixelsIntegrations } from '@/mock/pixelIntegrations';

const PixelsIntegrations: React.FC = () => {
  const [integrations, setIntegrations] = useState<PixelIntegration[]>(pixelsIntegrations);
  const { toast } = useToast();
  const navigate = useNavigate();

  const handleManagePixels = (integration: PixelIntegration) => {
    // Navigate to the pixel management page for this platform
    navigate(`/integracoes/${integration.platform.replace('_', '-')}`);
  };

  // This will now be handled in the management page
  const handleDisconnect = (integration: PixelIntegration) => {
    // Reset all pixels for this platform
    setIntegrations(prev => 
      prev.map(item => 
        item.id === integration.id 
          ? { ...item, status: 'not_integrated', pixels: [], lastSync: undefined } 
          : item
      )
    );
    
    toast({
      title: `${integration.name} desconectado`,
      description: `Todos os pixels de ${integration.name} foram removidos.`,
    });
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
              <li>Token de Acesso - para API de Conversão</li>
            </ul>
            <p className="text-xs mt-2">
              Você pode adicionar múltiplos pixels para rastrear campanhas simultâneas.
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
              Você pode adicionar múltiplos pixels para rastrear campanhas simultâneas.
            </p>
          </div>
        );
    }
  };

  // Helper to determine integration status based on pixels
  const getIntegrationStatus = (integration: PixelIntegration) => {
    // If there's at least one pixel and it's active, consider the integration as integrated
    if (integration.pixels && integration.pixels.length > 0) {
      const hasActivePixel = integration.pixels.some(pixel => pixel.status === 'active');
      if (hasActivePixel) {
        return 'integrated';
      } else {
        return 'not_integrated';
      }
    }
    return integration.status;
  };

  // Helper to get pixel count text
  const getPixelCountText = (integration: PixelIntegration) => {
    if (!integration.pixels || integration.pixels.length === 0) {
      return null;
    }
    
    const activeCount = integration.pixels.filter(p => p.status === 'active').length;
    return `${activeCount} de ${integration.pixels.length} pixel${integration.pixels.length > 1 ? 's' : ''} ativo${activeCount !== 1 ? 's' : ''}`;
  };

  // Update IntegrationCard to show pixel counts
  const renderCard = (integration: PixelIntegration) => {
    // Get actual status based on pixels
    const actualStatus = getIntegrationStatus(integration);
    
    return (
      <IntegrationCard
        key={integration.id}
        integration={{
          ...integration,
          status: actualStatus
        }}
        onConnect={handleManagePixels}
        onDisconnect={handleDisconnect}
        onUpdate={handleManagePixels}
        tooltipContent={getTooltipContent(integration)}
        actionText={integration.pixels && integration.pixels.length > 0 ? 'Gerenciar Pixels' : 'Conectar'}
        statusText={getPixelCountText(integration)}
      />
    );
  };

  return (
    <IntegrationLayout 
      title="Pixels de Rastreamento"
      description="Conecte pixels de rastreamento para otimizar suas campanhas de marketing."
    >
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {integrations.map(renderCard)}
      </div>
    </IntegrationLayout>
  );
};

export default PixelsIntegrations;
