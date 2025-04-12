
import React, { useState } from 'react';
import { Plus, Copy } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Switch } from '@/components/ui/switch';
import { Separator } from '@/components/ui/separator';
import MarketingLayout from '@/components/marketing/MarketingLayout';
import { Dialog, DialogContent } from '@/components/ui/dialog';
import { Product, ProductType, ProductStatus } from '@/types/product';
import { OrderBump, OrderBumpFormData } from '@/types/orderBump';
import OrderBumpForm from '@/components/marketing/OrderBumpForm';
import { toast } from 'sonner';

// Mock products for demo
const mockProducts: Product[] = [
  {
    id: "prod_1",
    name: "Curso Avançado de Marketing Digital",
    type: "digital" as ProductType,
    price: 197.0,
    description: "Aprenda estratégias avançadas de marketing digital com este curso completo.",
    status: "active" as ProductStatus,
    imageUrl: "https://placehold.co/1000x1000/2563eb/ffffff?text=Curso+Marketing",
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    id: "prod_2",
    name: "E-book: Transformação Digital para Empresas",
    type: "digital" as ProductType,
    price: 47.0,
    description: "Guia completo para implementar a transformação digital no seu negócio.",
    status: "active" as ProductStatus,
    imageUrl: "https://placehold.co/1000x1000/10b981/ffffff?text=E-book",
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    id: "prod_3",
    name: "Template de Planilha para Gestão Financeira",
    type: "digital" as ProductType,
    price: 29.90,
    description: "Controle suas finanças com esta planilha profissional.",
    status: "active" as ProductStatus,
    imageUrl: "https://placehold.co/1000x1000/f59e0b/ffffff?text=Planilha",
    createdAt: new Date(),
    updatedAt: new Date()
  }
];

// Mock OrderBumps
const mockOrderBumps: OrderBump[] = [
  {
    id: "ob_1",
    name: "Garantia Estendida",
    description: "Estenda a garantia do seu produto por mais 12 meses",
    isActive: true,
    triggerProductIds: ["prod_1", "prod_2"],
    offerProductIds: ["prod_3"],
    conversionRate: 23,
    createdAt: new Date(),
    updatedAt: new Date()
  }
];

const OrderBumpsPage = () => {
  const [orderBumps, setOrderBumps] = useState<OrderBump[]>(mockOrderBumps);
  const [showCreateDialog, setShowCreateDialog] = useState(false);
  const [editingOrderBump, setEditingOrderBump] = useState<OrderBump | null>(null);
  const [duplicatingOrderBump, setDuplicatingOrderBump] = useState<OrderBump | null>(null);

  const handleCreate = (data: OrderBumpFormData) => {
    const newOrderBump: OrderBump = {
      id: `ob_${Date.now()}`,
      ...data,
      conversionRate: 0,
      createdAt: new Date(),
      updatedAt: new Date()
    };
    
    setOrderBumps(prev => [...prev, newOrderBump]);
    setShowCreateDialog(false);
    toast.success("Order Bump criado com sucesso!");
  };

  const handleUpdate = (data: OrderBumpFormData) => {
    if (!editingOrderBump) return;
    
    setOrderBumps(prev => prev.map(ob => 
      ob.id === editingOrderBump.id ? { 
        ...ob, 
        ...data,
        updatedAt: new Date() 
      } : ob
    ));
    
    setEditingOrderBump(null);
    toast.success("Order Bump atualizado com sucesso!");
  };

  const handleDuplicate = (orderBump: OrderBump) => {
    setDuplicatingOrderBump({
      ...orderBump,
      id: `ob_${Date.now()}`,
      name: `${orderBump.name} (Cópia)`,
      createdAt: new Date(),
      updatedAt: new Date()
    });
  };

  const handleDelete = (id: string) => {
    setOrderBumps(prev => prev.filter(ob => ob.id !== id));
    toast.success("Order Bump excluído com sucesso!");
  };

  const handleToggleActive = (id: string, isActive: boolean) => {
    setOrderBumps(prev => prev.map(ob => 
      ob.id === id ? { ...ob, isActive, updatedAt: new Date() } : ob
    ));
    
    toast.success(`Order Bump ${isActive ? 'ativado' : 'desativado'} com sucesso!`);
  };

  // Helper to get product names for display
  const getProductNames = (productIds: string[]) => {
    return productIds
      .map(id => mockProducts.find(p => p.id === id)?.name || 'Produto desconhecido')
      .join(', ');
  };

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
        <Button onClick={() => setShowCreateDialog(true)}>
          <Plus className="mr-2 h-4 w-4" />
          Novo Order Bump
        </Button>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        {orderBumps.map((orderBump) => (
          <Card key={orderBump.id} className="group transition-all duration-200 hover:shadow-md">
            <CardHeader className="pb-3 space-y-1">
              <div className="flex justify-between items-start">
                <div>
                  <CardTitle className="text-base">{orderBump.name}</CardTitle>
                  <CardDescription>
                    Associado a {orderBump.triggerProductIds.length} produto{orderBump.triggerProductIds.length !== 1 ? 's' : ''}
                  </CardDescription>
                </div>
                <Switch 
                  checked={orderBump.isActive} 
                  onCheckedChange={(checked) => handleToggleActive(orderBump.id, checked)}
                />
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="flex justify-between items-center text-sm">
                  <span className="text-muted-foreground">Produtos aplicáveis:</span>
                  <span className="font-medium">{getProductNames(orderBump.triggerProductIds)}</span>
                </div>
                <div className="flex justify-between items-center text-sm">
                  <span className="text-muted-foreground">Oferta:</span>
                  <span className="font-medium">{getProductNames(orderBump.offerProductIds)}</span>
                </div>
                <div className="flex justify-between items-center text-sm">
                  <span className="text-muted-foreground">Valor:</span>
                  <span className="font-medium">
                    {orderBump.offerProductIds.map(id => {
                      const product = mockProducts.find(p => p.id === id);
                      return product ? `R$ ${product.price.toFixed(2)}` : '';
                    }).join(', ')}
                  </span>
                </div>
                {orderBump.conversionRate !== undefined && (
                  <div className="flex justify-between items-center text-sm">
                    <span className="text-muted-foreground">Taxa de conversão:</span>
                    <span className="font-medium text-success">{orderBump.conversionRate}%</span>
                  </div>
                )}
                <Separator className="my-1" />
                <div className="flex justify-end pt-2 gap-2">
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={() => handleDuplicate(orderBump)}
                  >
                    <Copy className="mr-1 h-3.5 w-3.5" />
                    Duplicar
                  </Button>
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={() => setEditingOrderBump(orderBump)}
                  >
                    Editar
                  </Button>
                  <Button 
                    variant="destructive" 
                    size="sm"
                    onClick={() => handleDelete(orderBump.id)}
                  >
                    Excluir
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}

        {/* Placeholder for new card */}
        <Card 
          className="border-dashed flex items-center justify-center h-[270px] cursor-pointer hover:bg-accent/30 transition-all duration-200" 
          onClick={() => setShowCreateDialog(true)}
        >
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

      {/* Create New OrderBump Dialog */}
      <Dialog 
        open={showCreateDialog} 
        onOpenChange={(open) => {
          setShowCreateDialog(open);
          if (!open) setDuplicatingOrderBump(null);
        }}
      >
        <DialogContent 
          className="w-[90vw] max-w-[960px] p-0 gap-0 rounded-xl shadow-lg animate-in fade-in-0 zoom-in-95 duration-200"
        >
          <div className="p-8 md:p-10 overflow-y-auto max-h-[85vh]">
            <OrderBumpForm
              products={mockProducts}
              initialData={duplicatingOrderBump || undefined}
              onSubmit={handleCreate}
              onCancel={() => {
                setShowCreateDialog(false);
                setDuplicatingOrderBump(null);
              }}
            />
          </div>
        </DialogContent>
      </Dialog>

      {/* Edit OrderBump Dialog */}
      <Dialog 
        open={!!editingOrderBump} 
        onOpenChange={(open) => {
          if (!open) setEditingOrderBump(null);
        }}
      >
        <DialogContent 
          className="w-[90vw] max-w-[960px] p-0 gap-0 rounded-xl shadow-lg animate-in fade-in-0 zoom-in-95 duration-200"
        >
          <div className="p-8 md:p-10 overflow-y-auto max-h-[85vh]">
            {editingOrderBump && (
              <OrderBumpForm
                products={mockProducts}
                initialData={editingOrderBump}
                onSubmit={handleUpdate}
                onCancel={() => setEditingOrderBump(null)}
                onDuplicate={() => {
                  handleDuplicate(editingOrderBump);
                  setEditingOrderBump(null);
                  setShowCreateDialog(true);
                }}
              />
            )}
          </div>
        </DialogContent>
      </Dialog>
    </MarketingLayout>
  );
};

export default OrderBumpsPage;
