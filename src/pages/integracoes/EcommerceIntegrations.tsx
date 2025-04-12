
import React, { useState } from 'react';
import IntegrationLayout from './IntegrationLayout';
import IntegrationCard from '@/components/integracoes/IntegrationCard';
import ConnectShopifyDialog from '@/components/integracoes/ConnectShopifyDialog';
import ConnectWooCommerceDialog from '@/components/integracoes/ConnectWooCommerceDialog';
import { useToast } from '@/hooks/use-toast';
import { EcommerceIntegration } from '@/types/integration';

// Mock data for E-commerce integrations
const ecommerceIntegrations: EcommerceIntegration[] = [
  {
    id: 'shopify',
    name: 'Shopify',
    description: 'Conecte sua loja Shopify para importar produtos e integrar o checkout.',
    category: 'ecommerce',
    platform: 'shopify',
    status: 'not_integrated',
    logo: 'https://cdn.shopify.com/shopifycloud/brochure/assets/brand-assets/shopify-logo-primary-logo-456baa801ee66a0a435671082365958316831c9960c480451dd0330bcdae304f.svg',
    credentials: {}
  },
  {
    id: 'woocommerce',
    name: 'WooCommerce',
    description: 'Integre sua loja WooCommerce para sincronizar produtos e pedidos.',
    category: 'ecommerce',
    platform: 'woocommerce',
    status: 'not_integrated',
    logo: 'https://woocommerce.com/wp-content/themes/woo/images/logo-woocommerce.svg',
    credentials: {}
  }
];

const EcommerceIntegrations: React.FC = () => {
  const [integrations, setIntegrations] = useState<EcommerceIntegration[]>(ecommerceIntegrations);
  const [showShopifyDialog, setShowShopifyDialog] = useState(false);
  const [showWooCommerceDialog, setShowWooCommerceDialog] = useState(false);
  const { toast } = useToast();

  const handleConnectShopify = async (credentials: any) => {
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // Update integration status
      setIntegrations(prev => 
        prev.map(item => 
          item.id === 'shopify' 
            ? { 
                ...item, 
                status: 'integrated', 
                credentials: {
                  ...credentials,
                  shopDomain: credentials.shopDomain || 'your-store.myshopify.com'
                },
                lastSync: new Date()
              } 
            : item
        )
      );
      
      toast({
        title: "Shopify conectado com sucesso!",
        description: "Sua loja Shopify foi integrada à plataforma VOLTZ Checkout.",
      });
    } catch (error) {
      console.error("Error connecting Shopify:", error);
      toast({
        title: "Erro ao conectar Shopify",
        description: "Não foi possível conectar sua loja Shopify. Tente novamente mais tarde.",
        variant: "destructive",
      });
    }
  };

  const handleConnectWooCommerce = async (credentials: any) => {
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // Update integration status
      setIntegrations(prev => 
        prev.map(item => 
          item.id === 'woocommerce' 
            ? { 
                ...item, 
                status: 'integrated', 
                credentials,
                lastSync: new Date()
              } 
            : item
        )
      );
      
      toast({
        title: "WooCommerce conectado com sucesso!",
        description: "Sua loja WooCommerce foi integrada à plataforma VOLTZ Checkout.",
      });
    } catch (error) {
      console.error("Error connecting WooCommerce:", error);
      toast({
        title: "Erro ao conectar WooCommerce",
        description: "Não foi possível conectar sua loja WooCommerce. Tente novamente mais tarde.",
        variant: "destructive",
      });
    }
  };

  const handleDisconnect = (integration: EcommerceIntegration) => {
    // Simulate API call
    setTimeout(() => {
      setIntegrations(prev => 
        prev.map(item => 
          item.id === integration.id 
            ? { ...item, status: 'not_integrated', credentials: {}, lastSync: undefined } 
            : item
        )
      );
      
      toast({
        title: `${integration.name} desconectado`,
        description: `A integração com ${integration.name} foi removida.`,
      });
    }, 500);
  };

  const handleUpdate = (integration: EcommerceIntegration) => {
    // For Shopify, open the connection dialog again
    if (integration.id === 'shopify') {
      setShowShopifyDialog(true);
      return;
    }
    
    // For WooCommerce, open the connection dialog again
    if (integration.id === 'woocommerce') {
      setShowWooCommerceDialog(true);
      return;
    }
  };

  const handleConnect = (integration: EcommerceIntegration) => {
    if (integration.id === 'shopify') {
      setShowShopifyDialog(true);
    } else if (integration.id === 'woocommerce') {
      setShowWooCommerceDialog(true);
    }
  };

  // Tooltip content for each integration
  const getTooltipContent = (integration: EcommerceIntegration) => {
    switch (integration.id) {
      case 'shopify':
        return (
          <div className="space-y-2">
            <p>Conecte sua loja Shopify para:</p>
            <ul className="list-disc pl-5 space-y-1">
              <li>Importar produtos automaticamente</li>
              <li>Substituir o checkout nativo pelo VOLTZ Checkout</li>
              <li>Sincronizar estoque e preços</li>
            </ul>
            <p className="text-xs mt-2">
              Requer permissões: read_products, write_products, read_themes, write_themes
            </p>
          </div>
        );
      case 'woocommerce':
        return (
          <div className="space-y-2">
            <p>Integre seu WooCommerce para:</p>
            <ul className="list-disc pl-5 space-y-1">
              <li>Sincronizar produtos e categorias</li>
              <li>Gerenciar pedidos em ambas plataformas</li>
              <li>Controlar estoque automaticamente</li>
            </ul>
            <p className="text-xs mt-2">
              Necessário criar chaves de API no painel do WooCommerce
            </p>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <IntegrationLayout 
      title="Integrações"
      description="Conecte sua loja online e sincronize produtos, pedidos e clientes."
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
      
      <ConnectShopifyDialog
        isOpen={showShopifyDialog}
        onClose={() => setShowShopifyDialog(false)}
        onConnect={handleConnectShopify}
      />
      
      <ConnectWooCommerceDialog
        isOpen={showWooCommerceDialog}
        onClose={() => setShowWooCommerceDialog(false)}
        onConnect={handleConnectWooCommerce}
      />
    </IntegrationLayout>
  );
};

export default EcommerceIntegrations;
