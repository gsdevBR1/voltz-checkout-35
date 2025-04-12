
import React, { useState } from 'react';
import DashboardLayout from '@/components/DashboardLayout';
import { Button } from '@/components/ui/button';
import { Plus, Package, Truck, Store, X, Check } from 'lucide-react';
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from '@/components/ui/table';
import { Switch } from '@/components/ui/switch';
import { AddShippingModal } from '@/components/configuracoes/AddShippingModal';
import { ShippingMethod } from '@/types/shipping';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';

const mockShippingMethods: ShippingMethod[] = [
  {
    id: '1',
    name: 'PAC',
    value: 15.90,
    estimatedDays: 5,
    type: 'correios',
    status: 'active',
    createdAt: '2023-09-10T08:15:00Z',
  },
  {
    id: '2',
    name: 'Sedex',
    value: 25.50,
    estimatedDays: 2,
    type: 'correios',
    status: 'active',
    createdAt: '2023-09-12T10:30:00Z',
  },
  {
    id: '3',
    name: 'Retirada na loja',
    value: 0,
    estimatedDays: 1,
    type: 'retirada',
    status: 'inactive',
    createdAt: '2023-09-15T14:45:00Z',
  },
];

const LogisticaPage: React.FC = () => {
  const [shippingMethods, setShippingMethods] = useState<ShippingMethod[]>(mockShippingMethods);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const { toast } = useToast();

  const handleAddShipping = (data: { 
    name: string; 
    value: number; 
    estimatedDays: number; 
    type: 'correios' | 'transportadora' | 'retirada' 
  }) => {
    const newShipping: ShippingMethod = {
      id: Math.random().toString(36).substring(2, 9),
      name: data.name,
      value: data.value,
      estimatedDays: data.estimatedDays,
      type: data.type,
      status: 'active',
      createdAt: new Date().toISOString(),
    };

    setShippingMethods([...shippingMethods, newShipping]);
    setIsAddModalOpen(false);
    
    toast({
      title: "Frete adicionado",
      description: `O método de frete "${data.name}" foi adicionado com sucesso.`,
    });
  };

  const handleToggleStatus = (id: string) => {
    setShippingMethods(methods => 
      methods.map(method => 
        method.id === id 
          ? { ...method, status: method.status === 'active' ? 'inactive' : 'active' } 
          : method
      )
    );
  };

  const getTypeIcon = (type: ShippingMethod['type']) => {
    switch (type) {
      case 'correios':
        return <Package className="h-4 w-4 mr-1" />;
      case 'transportadora':
        return <Truck className="h-4 w-4 mr-1" />;
      case 'retirada':
        return <Store className="h-4 w-4 mr-1" />;
    }
  };

  const formatCurrency = (value: number) => {
    return value.toLocaleString('pt-BR', {
      style: 'currency',
      currency: 'BRL',
    });
  };

  return (
    <DashboardLayout>
      <div className="container mx-auto px-4 py-6">
        <div className="flex justify-between items-center mb-6">
          <div>
            <h1 className="text-2xl font-bold">Logística</h1>
            <p className="text-muted-foreground">Gerencie as opções de frete disponíveis para seus clientes</p>
          </div>
          <Button onClick={() => setIsAddModalOpen(true)}>
            <Plus className="w-4 h-4 mr-2" />
            Criar Frete
          </Button>
        </div>

        <div className="bg-card border rounded-lg overflow-hidden">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Nome</TableHead>
                <TableHead>Valor</TableHead>
                <TableHead>Prazo</TableHead>
                <TableHead>Tipo</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Ações</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {shippingMethods.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={6} className="text-center py-8 text-muted-foreground">
                    Nenhuma opção de frete configurada ainda
                  </TableCell>
                </TableRow>
              ) : (
                shippingMethods.map((method) => (
                  <TableRow key={method.id}>
                    <TableCell className="font-medium">{method.name}</TableCell>
                    <TableCell>{formatCurrency(method.value)}</TableCell>
                    <TableCell>
                      {method.estimatedDays} {method.estimatedDays === 1 ? 'dia' : 'dias'}
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline" className="flex items-center w-fit">
                        {getTypeIcon(method.type)}
                        {method.type === 'correios' 
                          ? 'Correios' 
                          : method.type === 'transportadora' 
                            ? 'Transportadora' 
                            : 'Retirada'}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center space-x-2">
                        <Switch 
                          checked={method.status === 'active'} 
                          onCheckedChange={() => handleToggleStatus(method.id)}
                        />
                        <span className={`text-sm ${method.status === 'active' ? 'text-green-600 dark:text-green-400' : 'text-muted-foreground'}`}>
                          {method.status === 'active' ? (
                            <span className="flex items-center">
                              <Check className="w-3 h-3 mr-1" />
                              Ativo
                            </span>
                          ) : (
                            <span className="flex items-center">
                              <X className="w-3 h-3 mr-1" />
                              Inativo
                            </span>
                          )}
                        </span>
                      </div>
                    </TableCell>
                    <TableCell className="text-right">
                      <Button variant="ghost" size="sm">
                        Editar
                      </Button>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>
      </div>

      <AddShippingModal 
        isOpen={isAddModalOpen} 
        onClose={() => setIsAddModalOpen(false)} 
        onSubmit={handleAddShipping} 
      />
    </DashboardLayout>
  );
};

export default LogisticaPage;
