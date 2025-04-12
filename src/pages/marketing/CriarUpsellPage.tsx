
import React, { useState } from 'react';
import MarketingLayout from '@/components/marketing/MarketingLayout';
import UpsellBuilder from '@/components/marketing/UpsellBuilder';
import { toast } from 'sonner';
import { useNavigate, useParams } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Eye, Link as LinkIcon } from 'lucide-react';
import { 
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger
} from '@/components/ui/dialog';
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

const CriarUpsellPage = () => {
  const navigate = useNavigate();
  const { productId } = useParams<{ productId?: string }>();
  const [selectedProductIds, setSelectedProductIds] = useState<string[]>([]);
  const [dialogOpen, setDialogOpen] = useState(false);
  
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

  const handleLinkProducts = () => {
    setDialogOpen(false);
    
    toast.success("Produtos vinculados com sucesso", {
      description: `Este upsell será exibido automaticamente após a compra de ${selectedProductIds.length} produto(s).`,
    });
  };
  
  return (
    <MarketingLayout 
      title="Criar Upsell One Click" 
      description="Configure uma oferta especial que será exibida após a compra principal"
      actions={
        <>
          <Button 
            variant="outline" 
            onClick={() => setDialogOpen(true)}
            className="gap-2 mr-2"
          >
            <LinkIcon className="h-4 w-4" />
            Vincular a Produtos
          </Button>
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
      <UpsellBuilder onSave={handleSave} productId={productId} />

      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="sm:max-w-lg">
          <DialogHeader>
            <DialogTitle>Vincular a Produtos Principais</DialogTitle>
            <DialogDescription>
              Selecione os produtos que, ao serem comprados, redirecionarão automaticamente para este Upsell.
            </DialogDescription>
          </DialogHeader>
          
          <div className="py-4">
            <ProductSelector
              products={mockProducts}
              selectedProductIds={selectedProductIds}
              onChange={setSelectedProductIds}
              allowMultiple={true}
              title="Produtos principais"
              description="Este upsell será exibido automaticamente após a compra destes produtos"
            />
          </div>
          
          <div className="flex justify-end space-x-2">
            <Button variant="outline" onClick={() => setDialogOpen(false)}>
              Cancelar
            </Button>
            <Button onClick={handleLinkProducts} disabled={selectedProductIds.length === 0}>
              Confirmar Vinculação
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </MarketingLayout>
  );
};

export default CriarUpsellPage;
