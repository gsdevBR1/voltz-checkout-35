
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import MarketingLayout from '@/components/marketing/MarketingLayout';

// Define a type for the upsell offers
type UpsellOffer = {
  id: string;
  name: string;
  mainProducts: string[];
  upsellProduct: string;
  price: number;
  isActive: boolean;
  conversions: number;
  createdAt: string;
};

const UpsellOnePage = () => {
  const navigate = useNavigate();
  
  // Sample data for upsell offers
  const upsellOffers: UpsellOffer[] = [
    {
      id: "1",
      name: "Oferta Especial – Kit 3 Sabonetes",
      mainProducts: ["Camiseta Premium", "Calça Jeans Slim"],
      upsellProduct: "Kit Skin Care",
      price: 29.90,
      isActive: true,
      conversions: 124,
      createdAt: "2024-02-15",
    },
    {
      id: "2",
      name: "Frete Grátis - Adicione mais um item",
      mainProducts: ["Tênis Esportivo"],
      upsellProduct: "Camiseta Premium",
      price: 59.90,
      isActive: true,
      conversions: 87,
      createdAt: "2024-03-01",
    },
    {
      id: "3",
      name: "Combo Especial - Economize 30%",
      mainProducts: ["Tênis Esportivo", "Mochila Escolar", "Fones de Ouvido Bluetooth"],
      upsellProduct: "Meias Esportivas",
      price: 19.90,
      isActive: false,
      conversions: 43,
      createdAt: "2024-03-10",
    }
  ];

  // Action buttons for header
  const actions = (
    <Button onClick={() => navigate("/marketing/upsell/criar")}>
      <Plus className="mr-2 h-4 w-4" />
      Novo Upsell
    </Button>
  );

  return (
    <MarketingLayout 
      title="Upsell One Click" 
      description="Configure ofertas especiais que serão exibidas após a compra dos produtos principais."
      actions={actions}
    >
      <div>
        <h2 className="text-lg font-medium mb-1">Ofertas de Upsell Existentes</h2>
        <p className="text-sm text-muted-foreground mb-6">
          Gerencie suas ofertas de upsell e acompanhe seu desempenho.
        </p>
      </div>

      <div className="grid gap-4">
        {upsellOffers.length === 0 ? (
          <Card className="border-dashed border-2">
            <CardContent className="py-12">
              <div className="text-center">
                <h3 className="text-lg font-medium mb-2">Nenhuma oferta de upsell cadastrada</h3>
                <p className="text-sm text-muted-foreground mb-4">
                  Crie sua primeira oferta de upsell para aumentar o valor médio de pedido.
                </p>
                <Button onClick={() => navigate("/marketing/upsell/criar")}>
                  <Plus className="mr-2 h-4 w-4" />
                  Criar Primeiro Upsell
                </Button>
              </div>
            </CardContent>
          </Card>
        ) : (
          upsellOffers.map((offer) => (
            <Card key={offer.id} className="overflow-hidden">
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle className="text-base flex items-center">
                      {offer.name}
                      <Badge variant={offer.isActive ? "default" : "outline"} className="ml-2">
                        {offer.isActive ? "Ativo" : "Inativo"}
                      </Badge>
                    </CardTitle>
                    <CardDescription className="text-xs mt-1">
                      Criado em {new Date(offer.createdAt).toLocaleDateString('pt-BR')}
                    </CardDescription>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Badge variant="outline" className="bg-green-50 text-green-800 hover:bg-green-50">
                      {offer.conversions} conversões
                    </Badge>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 gap-4 text-sm mb-4">
                  <div>
                    <span className="text-muted-foreground">Produtos Principais ({offer.mainProducts.length}):</span>
                    <p className="font-medium">{offer.mainProducts.join(', ')}</p>
                  </div>
                  <div>
                    <span className="text-muted-foreground">Produto de Upsell:</span>
                    <p className="font-medium">{offer.upsellProduct}</p>
                  </div>
                  <div>
                    <span className="text-muted-foreground">Preço do Upsell:</span>
                    <p className="font-medium">R$ {offer.price.toFixed(2)}</p>
                  </div>
                </div>
                <div className="flex justify-end space-x-2">
                  <Button variant="outline" size="sm">
                    {offer.isActive ? "Desativar" : "Ativar"}
                  </Button>
                  <Button variant="outline" size="sm" onClick={() => navigate(`/marketing/upsell/editar/${offer.id}`)}>
                    Editar
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>
    </MarketingLayout>
  );
};

export default UpsellOnePage;
