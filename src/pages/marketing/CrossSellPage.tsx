
import React from 'react';
import { Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Switch } from '@/components/ui/switch';
import { Separator } from '@/components/ui/separator';
import MarketingLayout from '@/components/marketing/MarketingLayout';

const CrossSellPage = () => {
  return (
    <MarketingLayout 
      title="Cross-Sell" 
      description="Configure produtos complementares sugeridos durante o processo de compra."
    >
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-lg font-medium">Cross-Sell</h2>
          <p className="text-sm text-muted-foreground">
            Aumente seu ticket médio com sugestões de produtos complementares.
          </p>
        </div>
        <Button>
          <Plus className="mr-2 h-4 w-4" />
          Novo Cross-Sell
        </Button>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        {/* Exemplo de card de Cross-Sell */}
        <Card>
          <CardHeader className="pb-3">
            <div className="flex justify-between items-start">
              <div>
                <CardTitle className="text-base">Acessórios para Smartphones</CardTitle>
                <CardDescription>Associado a 3 produtos</CardDescription>
              </div>
              <Switch checked={true} />
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="flex justify-between items-center text-sm">
                <span className="text-muted-foreground">Produto principal:</span>
                <span className="font-medium">iPhone 15 Pro</span>
              </div>
              <div className="flex justify-between items-center text-sm">
                <span className="text-muted-foreground">Produtos sugeridos:</span>
                <span className="font-medium">Capinha, Película, Carregador</span>
              </div>
              <div className="flex justify-between items-center text-sm">
                <span className="text-muted-foreground">Posição:</span>
                <span className="font-medium">Página do Produto</span>
              </div>
              <div className="flex justify-between items-center text-sm">
                <span className="text-muted-foreground">Taxa de conversão:</span>
                <span className="font-medium text-green-600">18%</span>
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

        {/* Exemplo de outro card de Cross-Sell */}
        <Card>
          <CardHeader className="pb-3">
            <div className="flex justify-between items-start">
              <div>
                <CardTitle className="text-base">Complementos Fitness</CardTitle>
                <CardDescription>Associado a 5 produtos</CardDescription>
              </div>
              <Switch checked={true} />
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="flex justify-between items-center text-sm">
                <span className="text-muted-foreground">Produto principal:</span>
                <span className="font-medium">Whey Protein</span>
              </div>
              <div className="flex justify-between items-center text-sm">
                <span className="text-muted-foreground">Produtos sugeridos:</span>
                <span className="font-medium">BCAA, Creatina, Shaker</span>
              </div>
              <div className="flex justify-between items-center text-sm">
                <span className="text-muted-foreground">Posição:</span>
                <span className="font-medium">Carrinho</span>
              </div>
              <div className="flex justify-between items-center text-sm">
                <span className="text-muted-foreground">Taxa de conversão:</span>
                <span className="font-medium text-green-600">22%</span>
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
            <h3 className="font-medium mb-1">Adicionar novo Cross-Sell</h3>
            <p className="text-sm text-muted-foreground max-w-[180px]">
              Crie novas sugestões de produtos complementares
            </p>
          </div>
        </Card>
      </div>
    </MarketingLayout>
  );
};

export default CrossSellPage;
