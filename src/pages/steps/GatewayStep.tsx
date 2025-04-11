
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { toast } from 'sonner';
import { useActivationSteps } from '@/contexts/ActivationStepsContext';
import DashboardLayout from '@/components/DashboardLayout';
import { AlertCircle, ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';

const GatewayStep = () => {
  const { updateStepStatus } = useActivationSteps();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [selectedGateway, setSelectedGateway] = useState('');

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!selectedGateway) {
      toast.error('Por favor, selecione um gateway de pagamento');
      return;
    }
    
    setLoading(true);
    
    // Simulate API call
    setTimeout(() => {
      updateStepStatus('gateway', 'completed');
      setLoading(false);
      toast.success('Gateway de pagamento configurado com sucesso!');
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
            <CardTitle>Configuração do Gateway de Pagamento</CardTitle>
            <CardDescription>
              Configure os meios de pagamento que serão exibidos em sua loja.
            </CardDescription>
          </CardHeader>
          <form onSubmit={handleSave}>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <div>
                  <Label htmlFor="gateway">Selecione o Gateway de Pagamento</Label>
                  <Select 
                    value={selectedGateway} 
                    onValueChange={setSelectedGateway}
                  >
                    <SelectTrigger id="gateway">
                      <SelectValue placeholder="Selecione um gateway" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="pagarme">Pagar.me</SelectItem>
                      <SelectItem value="mercadopago">MercadoPago</SelectItem>
                      <SelectItem value="iugu">Iugu</SelectItem>
                      <SelectItem value="shopify">Shopify Payments</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                {selectedGateway && (
                  <>
                    <div>
                      <Label htmlFor="publicKey">Chave Pública</Label>
                      <Input id="publicKey" placeholder="pk_test_..." required />
                    </div>
                    
                    <div>
                      <Label htmlFor="secretKey">Chave Secreta / Token</Label>
                      <Input id="secretKey" type="password" placeholder="sk_test_..." required />
                    </div>
                    
                    {selectedGateway === 'shopify' && (
                      <Alert>
                        <AlertCircle className="h-4 w-4" />
                        <AlertTitle>Shopify selecionado</AlertTitle>
                        <AlertDescription>
                          Para integração com Shopify, certifique-se de que sua loja tenha o checkout personalizado habilitado.
                        </AlertDescription>
                      </Alert>
                    )}
                  </>
                )}
                
                {selectedGateway && (
                  <Alert className="mt-4 text-sm bg-primary/10 text-primary">
                    <AlertTitle>Integração 100% via API</AlertTitle>
                    <AlertDescription>
                      Todas as transações serão processadas diretamente pelo gateway escolhido, 
                      garantindo alta segurança e compatibilidade com as normas PCI.
                    </AlertDescription>
                  </Alert>
                )}
              </div>
            </CardContent>
            <CardFooter>
              <Button type="submit" className="w-full" disabled={loading || !selectedGateway}>
                {loading ? 'Salvando...' : 'Salvar Configuração de Pagamento'}
              </Button>
            </CardFooter>
          </form>
        </Card>
      </div>
    </DashboardLayout>
  );
};

export default GatewayStep;
