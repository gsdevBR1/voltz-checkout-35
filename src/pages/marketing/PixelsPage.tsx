
import React from 'react';
import { ExternalLink } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import MarketingLayout from '@/components/marketing/MarketingLayout';

// Define a type for the pixel platforms
type PixelPlatform = {
  id: string;
  name: string;
  description: string;
  isConfigured: boolean;
  icon: string;
};

const PixelsPage = () => {
  // Sample data for pixel platforms
  const pixelPlatforms: PixelPlatform[] = [
    {
      id: "google-ads",
      name: "Google Ads",
      description: "Integração nativa com pixel do Google Ads para rastreamento de vendas.",
      isConfigured: true,
      icon: "/lovable-uploads/3aa07f77-7311-4155-8e6c-39abb8dca3df.png"
    },
    {
      id: "ga4",
      name: "Google Analytics 4",
      description: "Monitoramento completo do desempenho da loja.",
      isConfigured: false,
      icon: "/lovable-uploads/3aa07f77-7311-4155-8e6c-39abb8dca3df.png"
    },
    {
      id: "gtm",
      name: "Google Tag Manager",
      description: "Gerenciamento de tags para atualização dinâmica.",
      isConfigured: true,
      icon: "/lovable-uploads/3aa07f77-7311-4155-8e6c-39abb8dca3df.png"
    },
    {
      id: "kwai",
      name: "Kwai",
      description: "Rastreamento de vendas através do pixel do Kwai.",
      isConfigured: false,
      icon: "/lovable-uploads/3aa07f77-7311-4155-8e6c-39abb8dca3df.png"
    },
    {
      id: "meta",
      name: "Meta",
      description: "Integração com pixel do Meta para Facebook e Instagram.",
      isConfigured: true,
      icon: "/lovable-uploads/3aa07f77-7311-4155-8e6c-39abb8dca3df.png"
    },
    {
      id: "mgid",
      name: "Mgid",
      description: "Rastreamento de vendas com o pixel do Mgid.",
      isConfigured: false,
      icon: "/lovable-uploads/3aa07f77-7311-4155-8e6c-39abb8dca3df.png"
    },
    {
      id: "outbrain",
      name: "Outbrain",
      description: "Integração com pixel do Outbrain para campanhas.",
      isConfigured: false,
      icon: "/lovable-uploads/3aa07f77-7311-4155-8e6c-39abb8dca3df.png"
    },
    {
      id: "pinterest",
      name: "Pinterest",
      description: "Rastreamento de conversões via pixel do Pinterest.",
      isConfigured: false,
      icon: "/lovable-uploads/3aa07f77-7311-4155-8e6c-39abb8dca3df.png"
    },
    {
      id: "taboola",
      name: "Taboola",
      description: "Integração com pixel do Taboola para anúncios.",
      isConfigured: false,
      icon: "/lovable-uploads/3aa07f77-7311-4155-8e6c-39abb8dca3df.png"
    },
    {
      id: "tiktok",
      name: "TikTok",
      description: "Rastreamento de vendas através do pixel do TikTok.",
      isConfigured: true,
      icon: "/lovable-uploads/3aa07f77-7311-4155-8e6c-39abb8dca3df.png"
    }
  ];

  return (
    <MarketingLayout 
      title="Pixels" 
      description="Integre plataformas de rastreamento para monitorar suas campanhas e conversões."
    >
      <div>
        <h2 className="text-lg font-medium mb-1">Plataformas de Rastreamento</h2>
        <p className="text-sm text-muted-foreground mb-6">
          Conecte sua loja às principais plataformas de marketing e análise.
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        {pixelPlatforms.map((platform) => (
          <Card key={platform.id} className="overflow-hidden">
            <CardHeader className="pb-3 flex flex-row items-center justify-between space-y-0">
              <div className="flex items-center">
                <div className="w-10 h-10 mr-3 flex items-center justify-center rounded-md bg-primary/10">
                  <img 
                    src={platform.icon} 
                    alt={`${platform.name} logo`} 
                    className="w-6 h-6 object-contain" 
                  />
                </div>
                <div>
                  <CardTitle className="text-base flex items-center">
                    {platform.name}
                    {platform.isConfigured && (
                      <Badge variant="outline" className="ml-2 bg-green-100 text-green-800 hover:bg-green-100">
                        Configurado
                      </Badge>
                    )}
                  </CardTitle>
                  <CardDescription className="text-xs mt-1">
                    {platform.description}
                  </CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="flex justify-end">
                <Button variant={platform.isConfigured ? "outline" : "default"} size="sm">
                  {platform.isConfigured ? "Editar" : "Configurar"}
                  <ExternalLink className="ml-1 h-3 w-3" />
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </MarketingLayout>
  );
};

export default PixelsPage;
