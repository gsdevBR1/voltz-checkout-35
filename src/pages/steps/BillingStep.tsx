
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { toast } from 'sonner';
import { useActivationSteps } from '@/contexts/ActivationStepsContextWithStores';
import DashboardLayout from '@/components/DashboardLayout';
import { ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const BillingStep = () => {
  const { updateStepCompletion } = useActivationSteps();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    // Simulate API call
    setTimeout(() => {
      updateStepCompletion('billing', true);
      setLoading(false);
      toast.success('Informações de faturamento salvas com sucesso!');
      navigate('/');
    }, 1500);
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
            <CardTitle>Configuração de Faturamento</CardTitle>
            <CardDescription>
              Adicione um cartão de crédito em sua conta. Esta informação é necessária para o funcionamento do checkout.
            </CardDescription>
          </CardHeader>
          <form onSubmit={handleSave}>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <div>
                  <Label htmlFor="cardNumber">Número do Cartão</Label>
                  <Input id="cardNumber" placeholder="0000 0000 0000 0000" required />
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="expiry">Data de Validade</Label>
                    <Input id="expiry" placeholder="MM/AA" required />
                  </div>
                  <div>
                    <Label htmlFor="cvv">CVV</Label>
                    <Input id="cvv" placeholder="123" required />
                  </div>
                </div>
                
                <div>
                  <Label htmlFor="name">Nome no Cartão</Label>
                  <Input id="name" placeholder="Nome completo" required />
                </div>
                
                <div>
                  <Label htmlFor="document">CPF/CNPJ</Label>
                  <Input id="document" placeholder="000.000.000-00" required />
                </div>
                
                <div>
                  <Label htmlFor="zipcode">CEP</Label>
                  <Input id="zipcode" placeholder="00000-000" required />
                </div>
                
                <div>
                  <Label htmlFor="address">Endereço</Label>
                  <Input id="address" placeholder="Rua, Avenida, etc" required />
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="number">Número</Label>
                    <Input id="number" placeholder="123" required />
                  </div>
                  <div>
                    <Label htmlFor="neighborhood">Bairro</Label>
                    <Input id="neighborhood" placeholder="Bairro" required />
                  </div>
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="city">Cidade</Label>
                    <Input id="city" placeholder="Cidade" required />
                  </div>
                  <div>
                    <Label htmlFor="state">Estado</Label>
                    <Input id="state" placeholder="UF" required />
                  </div>
                </div>
              </div>
            </CardContent>
            <CardFooter>
              <Button type="submit" className="w-full" disabled={loading}>
                {loading ? 'Salvando...' : 'Salvar Informações de Faturamento'}
              </Button>
            </CardFooter>
          </form>
        </Card>
      </div>
    </DashboardLayout>
  );
};

export default BillingStep;
