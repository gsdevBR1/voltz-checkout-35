import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import MarketingLayout from '@/components/marketing/MarketingLayout';
import OrderBumpForm from '@/components/marketing/OrderBumpForm';
import { OrderBump, OrderBumpFormData } from '@/types/orderBump';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';
import { toast } from 'sonner';
import { Product, ProductType, ProductStatus } from '@/types/product';

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

const EditarOrderBumpPage = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [orderBump, setOrderBump] = useState<OrderBump | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchOrderBump = () => {
      setLoading(true);
      try {
        const found = mockOrderBumps.find(ob => ob.id === id);
        if (found) {
          setOrderBump(found);
        } else {
          toast.error("Order Bump não encontrado");
          navigate("/marketing/order-bumps");
        }
      } catch (error) {
        console.error("Error fetching order bump:", error);
        toast.error("Erro ao carregar o Order Bump");
      } finally {
        setLoading(false);
      }
    };

    fetchOrderBump();
  }, [id, navigate]);

  const handleSubmit = (data: OrderBumpFormData) => {
    try {
      console.log("Updated order bump data:", data);
      toast.success("Order Bump atualizado com sucesso");
      navigate("/marketing/order-bumps");
    } catch (error) {
      console.error("Error updating order bump:", error);
      toast.error("Erro ao atualizar o Order Bump");
    }
  };

  if (loading) {
    return (
      <MarketingLayout 
        title="Editando Order Bump" 
        description="Atualizando as configurações do Order Bump"
        actions={
          <Button 
            variant="outline" 
            onClick={() => navigate('/marketing/order-bumps')}
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Voltar
          </Button>
        }
      >
        <div className="flex items-center justify-center min-h-[300px]">
          <p>Carregando...</p>
        </div>
      </MarketingLayout>
    );
  }

  if (!orderBump) {
    return (
      <MarketingLayout 
        title="Order Bump não encontrado" 
        description="Não foi possível encontrar o Order Bump solicitado"
        actions={
          <Button 
            variant="outline" 
            onClick={() => navigate('/marketing/order-bumps')}
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Voltar
          </Button>
        }
      >
        <div className="flex flex-col items-center justify-center min-h-[300px]">
          <p className="text-muted-foreground mb-4">
            O Order Bump que você está tentando editar não foi encontrado.
          </p>
          <Button onClick={() => navigate('/marketing/order-bumps')}>
            Voltar para Order Bumps
          </Button>
        </div>
      </MarketingLayout>
    );
  }

  return (
    <MarketingLayout 
      title="Editar Order Bump" 
      description="Atualize as configurações do seu Order Bump"
      actions={
        <Button 
          variant="outline" 
          onClick={() => navigate('/marketing/order-bumps')}
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Voltar
        </Button>
      }
    >
      <div className="bg-background rounded-xl shadow-sm p-8 md:p-10 max-w-[960px] mx-auto">
        <OrderBumpForm
          initialData={orderBump}
          products={mockProducts}
          onSubmit={handleSubmit}
          onCancel={() => navigate('/marketing/order-bumps')}
          onDuplicate={() => {
            navigate('/marketing/order-bumps/criar', { 
              state: { duplicateFrom: orderBump }
            });
          }}
        />
      </div>
    </MarketingLayout>
  );
};

export default EditarOrderBumpPage;
