
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { toast } from 'sonner';
import { useActivationSteps } from '@/contexts/ActivationStepsContextWithStores';
import DashboardLayout from '@/components/DashboardLayout';
import { ArrowLeft, Copy } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';

const DomainStep = () => {
  const { updateStepCompletion } = useActivationSteps();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [subdomainPrefix, setSubdomainPrefix] = useState('checkout');
  const [mainDomain, setMainDomain] = useState('');

  const suggestions = [
    { value: 'checkout', label: 'checkout.seudominio.com' },
    { value: 'seguro', label: 'seguro.seudominio.com' },
    { value: 'secure', label: 'secure.seudominio.com' },
    { value: 'pay', label: 'pay.seudominio.com' },
  ];

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!mainDomain) {
      toast.error('Por favor, informe o seu domínio principal');
      return;
    }
    
    setLoading(true);
    
    // Simulate API call
    setTimeout(() => {
      updateStepCompletion('domain', true);
      setLoading(false);
      toast.success('Domínio configurado com sucesso!');
      navigate('/');
    }, 1500);
  };

  const handleCopyCname = () => {
    navigator.clipboard.writeText('cname.voltz.checkout.io');
    toast.success('Valor CNAME copiado para a área de transferência');
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
            <CardTitle>Configuração de Domínio</CardTitle>
            <CardDescription>
              Verifique seu domínio. Deve ser o mesmo utilizado na Shopify, WooCommerce ou landing page.
            </CardDescription>
          </CardHeader>
          <form onSubmit={handleSave}>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <div>
                  <Label htmlFor="mainDomain">Seu Domínio Principal</Label>
                  <Input 
                    id="mainDomain" 
                    placeholder="seudominio.com" 
                    value={mainDomain}
                    onChange={(e) => setMainDomain(e.target.value)}
                    required 
                  />
                </div>
                
                <div>
                  <Label>Escolha um prefixo para seu subdomínio</Label>
                  <RadioGroup 
                    value={subdomainPrefix}
                    onValueChange={setSubdomainPrefix}
                    className="grid grid-cols-2 gap-4 mt-2"
                  >
                    {suggestions.map((suggestion) => (
                      <div key={suggestion.value} className="flex items-center space-x-2">
                        <RadioGroupItem value={suggestion.value} id={suggestion.value} />
                        <Label htmlFor={suggestion.value}>{suggestion.label}</Label>
                      </div>
                    ))}
                  </RadioGroup>
                </div>
                
                {mainDomain && (
                  <div className="mt-4 p-4 bg-secondary rounded-md">
                    <p className="font-medium text-sm">Seu subdomínio será:</p>
                    <p className="text-lg font-bold text-primary mt-1">
                      {subdomainPrefix}.{mainDomain}
                    </p>
                  </div>
                )}
                
                <Alert className="mt-6">
                  <AlertTitle>Configuração CNAME</AlertTitle>
                  <AlertDescription>
                    Para configurar seu domínio, adicione um registro CNAME no seu provedor DNS:
                    
                    <div className="mt-4 grid grid-cols-2 gap-4">
                      <div>
                        <Label className="text-xs">Nome do registro</Label>
                        <p className="font-mono bg-muted p-2 rounded mt-1 text-sm">
                          {subdomainPrefix}
                        </p>
                      </div>
                      <div>
                        <Label className="text-xs">Valor CNAME</Label>
                        <div className="font-mono bg-muted p-2 rounded mt-1 text-sm flex justify-between items-center">
                          <span>cname.voltz.checkout.io</span>
                          <Button 
                            variant="ghost" 
                            size="icon" 
                            onClick={handleCopyCname}
                            type="button"
                          >
                            <Copy className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    </div>
                  </AlertDescription>
                </Alert>
              </div>
            </CardContent>
            <CardFooter>
              <Button type="submit" className="w-full" disabled={loading || !mainDomain}>
                {loading ? 'Salvando...' : 'Verificar e Salvar Domínio'}
              </Button>
            </CardFooter>
          </form>
        </Card>
      </div>
    </DashboardLayout>
  );
};

export default DomainStep;
