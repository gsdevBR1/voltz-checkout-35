
import React from 'react';
import DashboardLayout from '@/components/DashboardLayout';
import ShopifyCard from '@/components/ShopifyCard';

const ShopifyStep: React.FC = () => {
  return (
    <DashboardLayout>
      <div className="max-w-4xl mx-auto py-8">
        <h1 className="text-3xl font-bold mb-6">Integração com Shopify</h1>
        <p className="text-muted-foreground mb-8">
          Configure a integração da sua loja Shopify com o voltz.checkout para sincronizar produtos e tema automaticamente.
        </p>
        
        <ShopifyCard />
      </div>
    </DashboardLayout>
  );
};

export default ShopifyStep;
