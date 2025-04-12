
import React, { useState } from 'react';
import { Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Switch } from '@/components/ui/switch';
import { Separator } from '@/components/ui/separator';
import MarketingLayout from '@/components/marketing/MarketingLayout';
import ProductSelector from '@/components/marketing/ProductSelector';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Product, ProductType, ProductStatus } from '@/types/product';

// Mock products for demo
const mockProducts: Product[] = [
  {
    id: "prod_1",
    name: "iPhone 15 Pro",
    type: "physical" as ProductType,
    price: 5999.0,
    description: "O mais recente iPhone com tecnologia avançada.",
    status: "active" as ProductStatus,
    imageUrl: "https://placehold.co/1000x1000/2563eb/ffffff?text=iPhone",
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    id: "prod_2",
    name: "Whey Protein",
    type: "physical" as ProductType,
    price: 147.0,
    description: "Suplemento proteico para atletas e praticantes de atividade física.",
    status: "active" as ProductStatus,
    imageUrl: "https://placehold.co/1000x1000/10b981/ffffff?text=Whey",
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    id: "prod_3",
    name: "Curso de Fotografia",
    type: "digital" as ProductType,
    price: 129.90,
    description: "Aprenda técnicas avançadas de fotografia digital.",
    status: "active" as ProductStatus,
    imageUrl: "https://placehold.co/1000x1000/f59e0b/ffffff?text=Curso",
    createdAt: new Date(),
    updatedAt: new Date()
  }
];

const CrossSellPage = () => {
  const [showCreateDialog, setShowCreateDialog] = useState(false);
  const [selectedProductIds, setSelectedProductIds] = useState<string[]>([]);
  const [applyToAllProducts, setApplyToAllProducts] = useState(false);

  const handleSelectProduct = (productId: string) => {
    if (selectedProductIds.includes(productId)) {
      setSelectedProductIds(prev => prev.filter(id => id !== productId));
    } else {
      setSelectedProductIds(prev => [...prev, productId]);
    }
  };

  const handleSelectAllFiltered = () => {
    setSelectedProductIds(mockProducts.map(p => p.id));
  };

  const handleApplyToAllProducts = (checked: boolean) => {
    setApplyToAllProducts(checked);
    if (checked) {
      setSelectedProductIds([]);
    }
  };

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
        <Button onClick={() => setShowCreateDialog(true)}>
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
        <Card className="border-dashed flex items-center justify-center h-[270px] cursor-pointer hover:bg-accent/30 transition-colors" onClick={() => setShowCreateDialog(true)}>
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

      <Dialog open={showCreateDialog} onOpenChange={setShowCreateDialog}>
        <DialogContent className="max-w-3xl">
          <DialogHeader>
            <DialogTitle>Criar novo Cross-Sell</DialogTitle>
            <DialogDescription>
              Selecione os produtos principais aos quais este Cross-Sell será aplicado
            </DialogDescription>
          </DialogHeader>
          
          <ProductSelector
            products={mockProducts}
            selectedProductIds={selectedProductIds}
            onSelectProduct={handleSelectProduct}
            onSelectAllFiltered={handleSelectAllFiltered}
            onApplyToAllProducts={handleApplyToAllProducts}
            applyToAllProducts={applyToAllProducts}
            title="Aplicar este Cross-Sell em massa"
            description="Selecione quais produtos principais terão sugestões de produtos complementares"
          />
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowCreateDialog(false)}>Cancelar</Button>
            <Button disabled={selectedProductIds.length === 0 && !applyToAllProducts}>
              Continuar
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </MarketingLayout>
  );
};

export default CrossSellPage;
