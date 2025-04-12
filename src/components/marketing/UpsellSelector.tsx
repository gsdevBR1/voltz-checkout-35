
import React, { useState, useEffect } from 'react';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { Eye, X } from 'lucide-react';
import { Upsell } from '@/types/orderBump';
import { useNavigate } from 'react-router-dom';
import { Badge } from '@/components/ui/badge';

// Mock data for upsells - in a real app, this would come from an API
const mockUpsells: Upsell[] = [
  {
    id: '1',
    name: 'Oferta especial de extensão',
    description: 'Oferta de extensão premium após compra',
    triggerProductIds: ['1', '2'],
    offerProductIds: ['3'],
    isActive: true,
    createdAt: new Date('2024-01-15'),
    updatedAt: new Date('2024-01-15'),
    conversionRate: 12.5,
  },
  {
    id: '2',
    name: 'Curso complementar',
    description: 'Oferta de curso complementar ao produto principal',
    triggerProductIds: ['3'],
    offerProductIds: ['4'],
    isActive: true,
    createdAt: new Date('2024-02-20'),
    updatedAt: new Date('2024-02-20'),
    conversionRate: 8.3,
  },
  {
    id: '3',
    name: 'Kit de acessórios',
    description: 'Kit de acessórios para o produto principal',
    triggerProductIds: ['1', '4'],
    offerProductIds: ['5'],
    isActive: false, // This one is inactive
    createdAt: new Date('2024-03-05'),
    updatedAt: new Date('2024-03-05'),
  },
];

interface UpsellSelectorProps {
  value: string | undefined;
  onChange: (value: string | undefined) => void;
  productId?: string;
  className?: string;
}

const UpsellSelector: React.FC<UpsellSelectorProps> = ({
  value,
  onChange,
  productId,
  className,
}) => {
  const navigate = useNavigate();
  const [upsells, setUpsells] = useState<Upsell[]>([]);
  const [selectedUpsell, setSelectedUpsell] = useState<Upsell | undefined>();

  // In a real app, fetch upsells from the API
  useEffect(() => {
    // This would be an API call
    // const fetchUpsells = async () => {
    //   const response = await fetch('/api/upsells');
    //   const data = await response.json();
    //   setUpsells(data);
    // };
    // fetchUpsells();

    // For now, use mock data
    setUpsells(mockUpsells);
  }, []);

  // Set the selected upsell when the value changes
  useEffect(() => {
    if (value) {
      const upsell = upsells.find(u => u.id === value);
      setSelectedUpsell(upsell);
    } else {
      setSelectedUpsell(undefined);
    }
  }, [value, upsells]);

  const handleChange = (newValue: string) => {
    // If "none" is selected, clear the value
    if (newValue === "none") {
      onChange(undefined);
      setSelectedUpsell(undefined);
    } else {
      onChange(newValue);
      const upsell = upsells.find(u => u.id === newValue);
      setSelectedUpsell(upsell);
    }
  };

  const handleRemove = () => {
    onChange(undefined);
    setSelectedUpsell(undefined);
  };

  const previewUpsell = () => {
    if (selectedUpsell) {
      navigate(`/marketing/upsell/preview/${selectedUpsell.id}`);
    }
  };

  // Filter upsells that are active
  const activeUpsells = upsells.filter(u => u.isActive);

  return (
    <div className={`space-y-2 ${className}`}>
      <div className="flex items-center gap-2">
        <Select
          value={value || "none"}
          onValueChange={handleChange}
        >
          <SelectTrigger className="w-full">
            <SelectValue placeholder="Selecione um upsell" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="none">Nenhum upsell selecionado</SelectItem>
            {activeUpsells.map((upsell) => (
              <SelectItem key={upsell.id} value={upsell.id}>
                {upsell.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        {selectedUpsell && (
          <>
            <Button
              variant="outline"
              size="icon"
              onClick={previewUpsell}
              title="Pré-visualizar upsell"
            >
              <Eye className="h-4 w-4" />
            </Button>
            <Button
              variant="outline"
              size="icon"
              onClick={handleRemove}
              title="Remover upsell"
            >
              <X className="h-4 w-4" />
            </Button>
          </>
        )}
      </div>

      {selectedUpsell && (
        <div className="p-3 border rounded-md bg-slate-50">
          <div className="flex items-center gap-2 mb-1">
            <span className="font-medium text-sm">{selectedUpsell.name}</span>
            {!selectedUpsell.isActive && (
              <Badge variant="outline" className="text-amber-600 border-amber-600">
                Inativo
              </Badge>
            )}
          </div>
          {selectedUpsell.description && (
            <p className="text-xs text-gray-500 mb-2">{selectedUpsell.description}</p>
          )}
          <div className="flex items-center gap-1">
            <Badge variant="secondary" className="text-xs">
              {selectedUpsell.offerProductIds.length} produto{selectedUpsell.offerProductIds.length !== 1 ? 's' : ''} oferecido{selectedUpsell.offerProductIds.length !== 1 ? 's' : ''}
            </Badge>
            <Badge variant="secondary" className="text-xs">
              Taxa de conversão: {selectedUpsell.conversionRate ? `${selectedUpsell.conversionRate}%` : 'N/A'}
            </Badge>
          </div>
        </div>
      )}
    </div>
  );
};

export default UpsellSelector;
