
import React from 'react';
import { Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Switch } from '@/components/ui/switch';
import { Separator } from '@/components/ui/separator';
import MarketingLayout from '@/components/marketing/MarketingLayout';

const UpsellOnePage = () => {
  return (
    <MarketingLayout 
      title="Upsell One Click" 
      description="Configure ofertas que são apresentadas imediatamente após a compra do produto principal."
    >
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-lg font-medium">Ofertas Upsell One Click</h2>
          <p className="text-sm text-muted-foreground">
            Aumente suas vendas com ofertas irresistíveis após a compra.
          </p>
        </div>
        <Button>
          <Plus className="mr-2 h-4 w-4" />
          Novo Upsell
        </Button>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        {/* Exemplo de card de Upsell */}
        <Card>
          <CardHeader className="pb-3">
            <div className="flex justify-between items-start">
              <div>
                <CardTitle className="text-base">Kit de Proteínas Premium</CardTitle>
                <CardDescription>Associado a 2 produtos</CardDescription>
              </div>
              <Switch checked={true} />
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="flex justify-between items-center text-sm">
                <span className="text-muted-foreground">Produto principal:</span>
                <span className="font-medium">Whey Protein Isolado</span>
              </div>
              <div className="flex justify-between items-center text-sm">
                <span className="text-muted-foreground">Oferta:</span>
                <span className="font-medium">Creatina 300g</span>
              </div>
              <div className="flex justify-between items-center text-sm">
                <span className="text-muted-foreground">Preço original:</span>
                <span className="font-medium">R$ 109,90</span>
              </div>
              <div className="flex justify-between items-center text-sm">
                <span className="text-muted-foreground">Preço promocional:</span>
                <span className="font-medium text-green-600">R$ 89,90</span>
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
            <h3 className="font-medium mb-1">Adicionar novo Upsell</h3>
            <p className="text-sm text-muted-foreground max-w-[180px]">
              Crie um novo Upsell One Click para seus produtos
            </p>
          </div>
        </Card>
      </div>
    </MarketingLayout>
  );
};

export default UpsellOnePage;
