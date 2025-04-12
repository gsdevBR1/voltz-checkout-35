
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Plus } from 'lucide-react';
import MarketingLayout from '@/components/marketing/MarketingLayout';
import { Button } from '@/components/ui/button';
import { CrossSell } from '@/types/crossSell';
import MarketingCard from '@/components/marketing/MarketingCard';
import MarketingEmptyState from '@/components/marketing/MarketingEmptyState';
import { toast } from 'sonner';

// Mock data for cross-sells - in a real app, this would come from an API
const mockCrossSells: CrossSell[] = [
  {
    id: '1',
    crossSellProductId: '2',
    crossSellProductName: 'E-book: Guia de SEO',
    mainProductIds: ['1'],
    active: true,
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    id: '2',
    crossSellProductId: '4',
    crossSellProductName: 'Mousepad Ergonômico',
    mainProductIds: ['1', '3'],
    active: true,
    createdAt: new Date(),
    updatedAt: new Date(),
  },
];

// Mock product data for display purposes
const mockProductNames: Record<string, string> = {
  '1': 'Curso de Marketing Digital',
  '3': 'Camiseta Premium',
};

const CrossSellPage: React.FC = () => {
  const [crossSells, setCrossSells] = useState<CrossSell[]>(mockCrossSells);

  const handleDelete = (id: string) => {
    setCrossSells(prev => prev.filter(item => item.id !== id));
    toast.success("Cross-Sell excluído com sucesso!");
  };

  const handleDuplicate = (id: string) => {
    const original = crossSells.find(item => item.id === id);
    if (original) {
      const duplicate: CrossSell = {
        ...original,
        id: `${original.id}_copy_${Date.now()}`,
        crossSellProductName: `${original.crossSellProductName} (Cópia)`,
        createdAt: new Date(),
        updatedAt: new Date(),
      };
      setCrossSells(prev => [...prev, duplicate]);
      toast.success("Cross-Sell duplicado com sucesso!");
    }
  };

  const handleToggleActive = (id: string, active: boolean) => {
    setCrossSells(prev => 
      prev.map(item => 
        item.id === id ? { ...item, active, updatedAt: new Date() } : item
      )
    );
    toast.success(`Cross-Sell ${active ? 'ativado' : 'desativado'} com sucesso!`);
  };

  return (
    <MarketingLayout
      title="Cross-Sell"
      description="Sugira produtos complementares durante o checkout para aumentar o valor do pedido."
      actions={
        <Button asChild>
          <Link to="/marketing/cross-sells/novo">
            <Plus className="mr-2 h-4 w-4" />
            Novo Cross-Sell
          </Link>
        </Button>
      }
    >
      {crossSells.length > 0 ? (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {crossSells.map((crossSell) => (
            <MarketingCard
              key={crossSell.id}
              id={crossSell.id}
              title={crossSell.crossSellProductName}
              type="cross-sell"
              active={crossSell.active}
              productName={crossSell.crossSellProductName}
              appliedToCount={crossSell.mainProductIds.length}
              appliedToProducts={crossSell.mainProductIds.map(id => mockProductNames[id] || `Produto ${id}`)}
              editPath={`/marketing/cross-sells/${crossSell.id}/editar`}
              onDuplicate={handleDuplicate}
              onDelete={handleDelete}
              onToggleActive={handleToggleActive}
              stats={{
                updatedAt: crossSell.updatedAt
              }}
            />
          ))}
        </div>
      ) : (
        <MarketingEmptyState
          title="Nenhum Cross-Sell configurado"
          description="Você ainda não configurou nenhum cross-sell. Configure agora para aumentar o valor médio dos pedidos."
          createPath="/marketing/cross-sells/novo"
          createLabel="Criar Primeiro Cross-Sell"
        />
      )}
    </MarketingLayout>
  );
};

export default CrossSellPage;
