
import React, { useState } from 'react';
import MarketingLayout from '@/components/marketing/MarketingLayout';
import UpsellBuilder from '@/components/marketing/UpsellBuilder';
import { toast } from 'sonner';
import { useNavigate, useParams } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Eye } from 'lucide-react';
import ProductSelector from '@/components/marketing/ProductSelector';
import { Product, ProductStatus, ProductType } from '@/types/product';

// Mock products for the ProductSelector
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

// Mock upsells for the redirection dropdown
const mockUpsells = [
  { id: 'ups_1', name: 'Upsell Premium: Curso Avançado', isActive: true },
  { id: 'ups_2', name: 'Upsell Básico: E-book Complementar', isActive: true },
  { id: 'ups_3', name: 'Oferta Especial: Mentoria', isActive: false },
];

const CriarUpsellPage = () => {
  const navigate = useNavigate();
  const { productId } = useParams<{ productId?: string }>();
  const [selectedProductIds, setSelectedProductIds] = useState<string[]>([]);
  
  const handleSave = (data: any) => {
    // In a real implementation, this would handle file upload
    // and save the data to your backend
    console.log('Upsell data saved:', data);
    
    // Also include any linked products
    if (selectedProductIds.length > 0) {
      console.log('Link this upsell to products:', selectedProductIds);
    }
    
    const productCount = data.applyToAllProducts 
      ? "todos os produtos da loja" 
      : `${data.triggerProductIds.length} produtos`;
    
    // Show success message
    toast.success("Upsell salvo com sucesso", {
      description: `Seu upsell foi criado e será aplicado a ${productCount}.`,
    });
    
    // Navigate back to upsell list
    setTimeout(() => {
      navigate('/marketing/upsell');
    }, 1500);
  };
  
  return (
    <MarketingLayout 
      title="Criar Upsell One Click" 
      description="Configure uma oferta especial que será exibida após a compra principal"
      actions={
        <>
          <Button 
            variant="outline" 
            onClick={() => navigate('/marketing/upsell/preview')}
            className="gap-2 mr-2"
          >
            <Eye className="h-4 w-4" />
            Pré-visualizar
          </Button>
          <Button 
            variant="outline" 
            onClick={() => navigate('/marketing/upsell')}
            className="gap-2"
          >
            <ArrowLeft className="h-4 w-4" />
            Voltar
          </Button>
        </>
      }
    >
      <UpsellBuilder 
        onSave={handleSave} 
        productId={productId} 
        mockUpsells={mockUpsells}
      />
    </MarketingLayout>
  );
};

export default CriarUpsellPage;
