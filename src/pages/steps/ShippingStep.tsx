
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { toast } from 'sonner';
import { useActivationSteps } from '@/contexts/ActivationStepsContextWithStores';
import DashboardLayout from '@/components/DashboardLayout';
import { ArrowLeft, Plus, Trash2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Switch } from '@/components/ui/switch';

interface ShippingMethod {
  id: string;
  name: string;
  type: 'fixed' | 'calculated' | 'free';
  value: number;
  days: number;
  regions: string;
}

const ShippingStep = () => {
  const { updateStepCompletion } = useActivationSteps();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [shippingMethods, setShippingMethods] = useState<ShippingMethod[]>([]);
  
  const [newMethod, setNewMethod] = useState<Partial<ShippingMethod>>({
    name: '',
    type: 'fixed',
    value: 0,
    days: 3,
    regions: 'Todo o Brasil',
  });

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (shippingMethods.length === 0) {
      toast.error('Adicione pelo menos um método de entrega');
      return;
    }
    
    setLoading(true);
    
    // Simulate API call
    setTimeout(() => {
      updateStepCompletion('shipping', true);
      setLoading(false);
      toast.success('Métodos de entrega configurados com sucesso!');
      navigate('/');
    }, 1500);
  };

  const addMethod = () => {
    if (!newMethod.name) {
      toast.error('Informe um nome para o método de entrega');
      return;
    }
    
    const method: ShippingMethod = {
      id: Date.now().toString(),
      name: newMethod.name || '',
      type: newMethod.type as 'fixed' | 'calculated' | 'free',
      value: newMethod.type === 'free' ? 0 : (newMethod.value || 0),
      days: newMethod.days || 3,
      regions: newMethod.regions || 'Todo o Brasil',
    };
    
    setShippingMethods([...shippingMethods, method]);
    setNewMethod({
      name: '',
      type: 'fixed',
      value: 0,
      days: 3,
      regions: 'Todo o Brasil',
    });
    
    toast.success('Método de entrega adicionado');
  };

  const removeMethod = (id: string) => {
    setShippingMethods(shippingMethods.filter(method => method.id !== id));
    toast.success('Método de entrega removido');
  };

  return (
    <DashboardLayout>
      <div className="max-w-3xl mx-auto">
        <Button variant="ghost" className="mb-4" onClick={() => navigate('/')}>
          <ArrowLeft className="mr-2 h-4 w-4" />
          Voltar
        </Button>
        
        <Card>
          <CardHeader>
            <CardTitle>Configuração de Frete</CardTitle>
            <CardDescription>
              Crie métodos de entrega para serem exibidos no seu checkout. 
              Obrigatório para produtos físicos.
            </CardDescription>
          </CardHeader>
          <form onSubmit={handleSave}>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <Card>
                  <CardHeader className="py-4 px-4">
                    <CardTitle className="text-base">Novo Método de Entrega</CardTitle>
                  </CardHeader>
                  <CardContent className="pb-4 px-4">
                    <div className="grid gap-4">
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <Label htmlFor="name">Nome do Método</Label>
                          <Input 
                            id="name" 
                            placeholder="Ex: Sedex, PAC, etc" 
                            value={newMethod.name}
                            onChange={(e) => setNewMethod({...newMethod, name: e.target.value})}
                          />
                        </div>
                        <div>
                          <Label htmlFor="type">Tipo</Label>
                          <Select 
                            value={newMethod.type}
                            onValueChange={(value) => setNewMethod({...newMethod, type: value as any})}
                          >
                            <SelectTrigger id="type">
                              <SelectValue placeholder="Selecione o tipo" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="fixed">Valor Fixo</SelectItem>
                              <SelectItem value="calculated">Calculado</SelectItem>
                              <SelectItem value="free">Grátis</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                      </div>
                      
                      <div className="grid grid-cols-2 gap-4">
                        {newMethod.type !== 'free' && (
                          <div>
                            <Label htmlFor="value">Valor (R$)</Label>
                            <Input 
                              id="value" 
                              type="number" 
                              min="0" 
                              step="0.01"
                              value={newMethod.value}
                              onChange={(e) => setNewMethod({...newMethod, value: parseFloat(e.target.value)})}
                            />
                          </div>
                        )}
                        <div>
                          <Label htmlFor="days">Prazo (dias)</Label>
                          <Input 
                            id="days" 
                            type="number" 
                            min="1"
                            value={newMethod.days}
                            onChange={(e) => setNewMethod({...newMethod, days: parseInt(e.target.value)})}
                          />
                        </div>
                      </div>
                      
                      <div>
                        <Label htmlFor="regions">Regiões Atendidas</Label>
                        <Input 
                          id="regions" 
                          placeholder="Ex: Todo o Brasil, Sul e Sudeste, etc" 
                          value={newMethod.regions}
                          onChange={(e) => setNewMethod({...newMethod, regions: e.target.value})}
                        />
                      </div>
                    </div>
                  </CardContent>
                  <CardFooter className="px-4 py-3 border-t">
                    <Button 
                      type="button" 
                      className="w-full"
                      onClick={addMethod}
                    >
                      <Plus className="mr-2 h-4 w-4" />
                      Adicionar Método
                    </Button>
                  </CardFooter>
                </Card>
                
                {shippingMethods.length > 0 && (
                  <div className="mt-6">
                    <h3 className="text-lg font-medium mb-3">Métodos de Entrega</h3>
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Nome</TableHead>
                          <TableHead>Tipo</TableHead>
                          <TableHead>Valor</TableHead>
                          <TableHead>Prazo</TableHead>
                          <TableHead>Ações</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {shippingMethods.map((method) => (
                          <TableRow key={method.id}>
                            <TableCell className="font-medium">{method.name}</TableCell>
                            <TableCell>
                              {method.type === 'fixed' ? 'Fixo' : 
                               method.type === 'calculated' ? 'Calculado' : 'Grátis'}
                            </TableCell>
                            <TableCell>
                              {method.type === 'free' ? 'Grátis' : `R$ ${method.value.toFixed(2)}`}
                            </TableCell>
                            <TableCell>{method.days} dias</TableCell>
                            <TableCell>
                              <Button 
                                variant="ghost" 
                                size="icon"
                                onClick={() => removeMethod(method.id)}
                              >
                                <Trash2 className="h-4 w-4 text-destructive" />
                              </Button>
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </div>
                )}
                
                <div className="flex items-center space-x-2 pt-4">
                  <Switch id="isPhysical" />
                  <Label htmlFor="isPhysical" className="text-sm text-muted-foreground">
                    Minha loja vende produtos físicos que precisam de entrega
                  </Label>
                </div>
              </div>
            </CardContent>
            <CardFooter>
              <Button type="submit" className="w-full" disabled={loading || shippingMethods.length === 0}>
                {loading ? 'Salvando...' : 'Salvar Configuração de Frete'}
              </Button>
            </CardFooter>
          </form>
        </Card>
      </div>
    </DashboardLayout>
  );
};

export default ShippingStep;
