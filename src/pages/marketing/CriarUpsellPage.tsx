
import React, { useState } from 'react';
import MarketingLayout from '@/components/marketing/MarketingLayout';
import UpsellBuilder from '@/components/marketing/UpsellBuilder';
import { toast } from 'sonner';
import { useNavigate, useParams } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';

const CriarUpsellPage = () => {
  const navigate = useNavigate();
  const { productId } = useParams<{ productId?: string }>();
  
  const handleSave = (data: any) => {
    // In a real implementation, this would handle file upload
    // and save the data to your backend
    console.log('Upsell data saved:', data);
    
    // Show success message
    toast.success("Upsell salvo com sucesso", {
      description: "Seu upsell foi criado e está pronto para uso.",
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
        <Button 
          variant="outline" 
          onClick={() => navigate('/marketing/upsell')}
          className="gap-2"
        >
          <ArrowLeft className="h-4 w-4" />
          Voltar
        </Button>
      }
    >
      <UpsellBuilder onSave={handleSave} productId={productId} />
    </MarketingLayout>
  );
};

export default CriarUpsellPage;
