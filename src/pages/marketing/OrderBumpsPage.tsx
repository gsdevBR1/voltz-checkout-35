
import React from 'react';
import { Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Switch } from '@/components/ui/switch';
import { Separator } from '@/components/ui/separator';
import MarketingLayout from '@/components/marketing/MarketingLayout';

const OrderBumpsPage = () => {
  return (
    <MarketingLayout 
      title="Order Bumps" 
      description="Adicione ofertas complementares diretamente na página de checkout."
    >
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-lg font-medium">Order Bumps</h2>
          <p className="text-sm text-muted-foreground">
            Aumente o valor médio do pedido com ofertas no checkout.
          </p>
        </div>
        <Button>
          <Plus className="mr-2 h-4 w-4" />
          Novo Order Bump
        </Button>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        {/* Exemplo de card de Order Bump */}
        <Card>
          <CardHeader className="pb-3">
            <div className="flex justify-between items-start">
              <div>
                <CardTitle className="text-base">Garantia Estendida</CardTitle>
                <CardDescription>Associado a 5 produtos</CardDescription>
              </div>
              <Switch checked={true} />
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="flex justify-between items-center text-sm">
                <span className="text-muted-foreground">Produtos aplicáveis:</span>
                <span className="font-medium">Todos eletrônicos</span>
              </div>
              <div className="flex justify-between items-center text-sm">
                <span className="text-muted-foreground">Oferta:</span>
                <span className="font-medium">Garantia Estendida 12 meses</span>
              </div>
              <div className="flex justify-between items-center text-sm">
                <span className="text-muted-foreground">Valor:</span>
                <span className="font-medium">R$ 49,90</span>
              </div>
              <div className="flex justify-between items-center text-sm">
                <span className="text-muted-foreground">Taxa de conversão:</span>
                <span className="font-medium text-green-600">23%</span>
              </div>
              <Separator />
              <div className="flex justify-end pt-2">
                <Button variant="outline" size="sm" className="mr-2">
                  Editar
                </Button>
                <Button variant="destructive" size="sm">
                  Excluir
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Placeholder para novo card */}
        <Card className="border-dashed flex items-center justify-center h-[270px] cursor-pointer hover:bg-accent/30 transition-colors">
          <div className="text-center">
            <div className="mx-auto bg-primary/10 h-12 w-12 rounded-full flex items-center justify-center mb-3">
              <Plus className="h-6 w-6 text-primary" />
            </div>
            <h3 className="font-medium mb-1">Adicionar novo Order Bump</h3>
            <p className="text-sm text-muted-foreground max-w-[180px]">
              Crie uma nova oferta para o checkout
            </p>
          </div>
        </Card>
      </div>
    </MarketingLayout>
  );
};

export default OrderBumpsPage;
