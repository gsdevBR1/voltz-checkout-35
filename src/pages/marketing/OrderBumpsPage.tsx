import React, { useState } from 'react';
import { Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import MarketingLayout from '@/components/marketing/MarketingLayout';
import { Product, ProductType, ProductStatus } from '@/types/product';
import { OrderBump } from '@/types/orderBump';
import { toast } from 'sonner';
import { useNavigate } from 'react-router-dom';
import MarketingCard from '@/components/marketing/MarketingCard';
import MarketingEmptyState from '@/components/marketing/MarketingEmptyState';

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
  const navigate = useNavigate();

  const handleDelete = (id: string) => {
    setOrderBumps(prev => prev.filter(ob => ob.id !== id));
    toast.success("Order Bump excluído com sucesso!");
  };

  const handleDuplicate = (id: string) => {
    const original = orderBumps.find(ob => ob.id === id);
    if (original) {
      const newOrderBump: OrderBump = {
        ...original,
        id: `ob_${Date.now()}`,
        name: `${original.name} (Cópia)`,
        createdAt: new Date(),
        updatedAt: new Date()
      };
      
      setOrderBumps(prev => [...prev, newOrderBump]);
      toast.success("Order Bump duplicado com sucesso!");
    }
  };

  const handleToggleActive = (id: string, active: boolean) => {
    setOrderBumps(prev => prev.map(ob => 
      ob.id === id ? { ...ob, isActive: active, updatedAt: new Date() } : ob
    ));
    
    toast.success(`Order Bump ${active ? 'ativado' : 'desativado'} com sucesso!`);
  };

  // Helper to get product names for display
  const getProductName = (productId: string): string => {
    return mockProducts.find(p => p.id === productId)?.name || 'Produto desconhecido';
  };

  return (
    <MarketingLayout 
      title="Order Bumps" 
      description="Adicione ofertas complementares diretamente na página de checkout."
      actions={
        <Button onClick={() => navigate("/marketing/order-bumps/novo")}>
          <Plus className="mr-2 h-4 w-4" />
          Novo Order Bump
        </Button>
      }
    >
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {orderBumps.map((orderBump) => (
          <MarketingCard
            key={orderBump.id}
            id={orderBump.id}
            title={orderBump.name}
            type="order-bump"
            active={orderBump.isActive}
            productName={orderBump.offerProductIds.map(id => getProductName(id)).join(', ')}
            productImageUrl={mockProducts.find(p => p.id === orderBump.offerProductIds[0])?.imageUrl}
            appliedToCount={orderBump.triggerProductIds.length}
            appliedToProducts={orderBump.triggerProductIds.map(id => getProductName(id))}
            editPath={`/marketing/order-bumps/${orderBump.id}/editar`}
            onDuplicate={handleDuplicate}
            onDelete={handleDelete}
            onToggleActive={handleToggleActive}
            stats={{
              conversionRate: orderBump.conversionRate,
              updatedAt: orderBump.updatedAt
            }}
          />
        ))}

        {/* Add placeholder card for creating new order bump */}
        <Card 
          className="border-dashed flex items-center justify-center h-[270px] cursor-pointer hover:bg-accent/30 transition-all duration-200" 
          onClick={() => navigate("/marketing/order-bumps/novo")}
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

        {orderBumps.length === 0 && (
          <MarketingEmptyState
            title="Nenhum Order Bump configurado"
            description="Você ainda não configurou nenhum order bump. Configure agora para aumentar o valor médio dos pedidos."
            createPath="/marketing/order-bumps/novo"
            createLabel="Criar Primeiro Order Bump"
          />
        )}
      </div>
    </MarketingLayout>
  );
};

export default OrderBumpsPage;
