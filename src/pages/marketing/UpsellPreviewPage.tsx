
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';
import UpsellDisplay from './UpsellDisplay';

const UpsellPreviewPage = () => {
  const navigate = useNavigate();
  
  // Preview mode flag to pass to UpsellDisplay
  const previewMode = true;

  return (
    <div className="relative">
      {/* Back button overlay */}
      <div className="fixed top-4 left-4 z-50">
        <Button 
          variant="secondary" 
          className="gap-2 shadow-md"
          onClick={() => navigate('/marketing/upsell/criar')}
        >
          <ArrowLeft className="h-4 w-4" />
          Voltar ao editor
        </Button>
      </div>
      
      {/* Preview mode notice */}
      <div className="fixed top-4 right-4 z-50 bg-amber-50 border border-amber-200 px-4 py-2 rounded-md shadow-md">
        <p className="text-amber-800 text-sm font-medium">Modo de pré-visualização</p>
      </div>
      
      {/* Pass the preview template data */}
      <UpsellDisplay previewMode={previewMode} />
    </div>
  );
};

export default UpsellPreviewPage;
