
import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import MarketingLayout from '@/components/marketing/MarketingLayout';
import OrderBumpPageForm from '@/components/marketing/OrderBumpPageForm';
import { OrderBump } from '@/types/orderBump';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';
import { toast } from 'sonner';
import { Product, ProductType, ProductStatus } from '@/types/product';
import { 
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";

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

interface LocationState {
  duplicateFrom?: OrderBump;
}

const CriarOrderBumpPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const state = location.state as LocationState;
  const duplicateFrom = state?.duplicateFrom;

  const handleSubmit = (data: any) => {
    try {
      console.log("New order bump data:", data);
      toast.success("Order Bump criado com sucesso");
      navigate("/marketing/order-bumps");
    } catch (error) {
      console.error("Error creating order bump:", error);
      toast.error("Erro ao criar o Order Bump");
    }
  };

  return (
    <MarketingLayout 
      title="Criar Novo Order Bump" 
      description="Configure uma nova oferta complementar para seu checkout"
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
      <Breadcrumb className="mb-6">
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbLink href="/marketing/order-bumps">Marketing</BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbLink href="/marketing/order-bumps">Order Bumps</BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbPage>Novo Order Bump</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>

      <div className="bg-background rounded-xl p-4 sm:p-6 md:p-8 max-w-[1080px] mx-auto">
        <OrderBumpPageForm
          initialData={duplicateFrom}
          products={mockProducts}
          onSubmit={handleSubmit}
          onCancel={() => navigate('/marketing/order-bumps')}
        />
      </div>
    </MarketingLayout>
  );
};

export default CriarOrderBumpPage;
