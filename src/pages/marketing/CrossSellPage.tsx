
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Plus, ShoppingBag, SearchX } from 'lucide-react';
import MarketingLayout from '@/components/marketing/MarketingLayout';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { CrossSell } from '@/types/crossSell';

// Mock data for cross-sells - in a real app, this would come from an API
const mockCrossSells: CrossSell[] = [
  {
    id: '1',
    crossSellProductId: '2',
    crossSellProductName: 'E-book: Guia de SEO',
    mainProductIds: ['1'],
    active: true,
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    id: '2',
    crossSellProductId: '4',
    crossSellProductName: 'Mousepad Ergonômico',
    mainProductIds: ['1', '3'],
    active: true,
    createdAt: new Date(),
    updatedAt: new Date(),
  },
];

const CrossSellPage: React.FC = () => {
  const [crossSells] = useState<CrossSell[]>(mockCrossSells);

  return (
    <MarketingLayout
      title="Cross-Sell"
      description="Sugira produtos complementares durante o checkout para aumentar o valor do pedido."
      actions={
        <Button asChild>
          <Link to="/marketing/cross-sells/novo">
            <Plus className="mr-2 h-4 w-4" />
            Novo Cross-Sell
          </Link>
        </Button>
      }
    >
      {crossSells.length > 0 ? (
        <div className="grid gap-6">
          {crossSells.map((crossSell) => (
            <Card key={crossSell.id} className="overflow-hidden">
              <CardHeader className="bg-muted/30">
                <div className="flex justify-between items-start">
                  <div>
                    <CardTitle className="text-xl">{crossSell.crossSellProductName}</CardTitle>
                    <CardDescription>
                      Aplicado em {crossSell.mainProductIds.length} produto(s)
                    </CardDescription>
                  </div>
                  <Badge variant={crossSell.active ? "success" : "secondary"}>
                    {crossSell.active ? "Ativo" : "Inativo"}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent className="pt-6">
                <div className="space-y-4">
                  <div>
                    <h4 className="font-medium mb-2">Produto sugerido:</h4>
                    <div className="flex items-center bg-muted/30 p-3 rounded-md">
                      <ShoppingBag className="h-5 w-5 mr-2 text-muted-foreground" />
                      <span>{crossSell.crossSellProductName}</span>
                    </div>
                  </div>
                  
                  <Separator />
                  
                  <div className="pt-2">
                    <h4 className="font-medium mb-2">Aplicado aos checkouts com os produtos:</h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                      {/* In a real app, you'd map over the actual products */}
                      <div className="bg-accent/20 p-2 rounded">Curso de Marketing Digital</div>
                      {crossSell.id === '2' && (
                        <div className="bg-accent/20 p-2 rounded">Camiseta Premium</div>
                      )}
                    </div>
                  </div>
                  
                  <div className="flex justify-end gap-2 mt-4">
                    <Button variant="outline" size="sm">
                      Editar
                    </Button>
                    <Button variant="destructive" size="sm">
                      Remover
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <Card className="border-dashed">
          <CardContent className="flex flex-col items-center justify-center p-10 text-center">
            <SearchX className="h-10 w-10 text-muted-foreground mb-4" />
            <h3 className="font-semibold text-lg mb-2">Nenhum Cross-Sell configurado</h3>
            <p className="text-muted-foreground mb-6 max-w-md">
              Você ainda não configurou nenhum cross-sell. Configure agora para aumentar o valor médio dos pedidos.
            </p>
            <Button asChild>
              <Link to="/marketing/cross-sells/novo">
                <Plus className="mr-2 h-4 w-4" />
                Criar Primeiro Cross-Sell
              </Link>
            </Button>
          </CardContent>
        </Card>
      )}
    </MarketingLayout>
  );
};

export default CrossSellPage;
