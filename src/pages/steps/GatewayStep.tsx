
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { toast } from 'sonner';
import { useActivationSteps } from '@/contexts/ActivationStepsContextWithStores';
import DashboardLayout from '@/components/DashboardLayout';
import { AlertCircle, ArrowLeft, CreditCard, Check } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Switch } from '@/components/ui/switch';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

const GatewayStep = () => {
  const { updateStepCompletion } = useActivationSteps();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [selectedGateway, setSelectedGateway] = useState('');
  const [enableOneClickUpsell, setEnableOneClickUpsell] = useState(true);
  const [paymentTab, setPaymentTab] = useState('card');

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!selectedGateway) {
      toast.error('Por favor, selecione um gateway de pagamento');
      return;
    }
    
    setLoading(true);
    
    // Simulate API call
    setTimeout(() => {
      updateStepCompletion('gateway', true);
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
                  <>
                    <Alert className="mt-4 text-sm bg-primary/10 text-primary">
                      <AlertTitle>Integração 100% via API</AlertTitle>
                      <AlertDescription>
                        Todas as transações serão processadas diretamente pelo gateway escolhido, 
                        garantindo alta segurança e compatibilidade com as normas PCI.
                      </AlertDescription>
                    </Alert>
                    
                    <div className="border rounded-lg p-4 mt-6">
                      <div className="flex items-center justify-between mb-4">
                        <div>
                          <h3 className="text-lg font-medium">Upsell One Click</h3>
                          <p className="text-sm text-muted-foreground">
                            Habilite ofertas pós-compra com pagamento em um clique
                          </p>
                        </div>
                        <Switch 
                          checked={enableOneClickUpsell} 
                          onCheckedChange={setEnableOneClickUpsell} 
                        />
                      </div>
                      
                      {enableOneClickUpsell && (
                        <div className="space-y-4 mt-4">
                          <Tabs 
                            defaultValue="card" 
                            className="w-full" 
                            value={paymentTab}
                            onValueChange={setPaymentTab}
                          >
                            <TabsList className="grid w-full grid-cols-2 mb-4">
                              <TabsTrigger value="card">
                                <CreditCard className="h-4 w-4 mr-2" />
                                Cartão de Crédito
                              </TabsTrigger>
                              <TabsTrigger value="pix">
                                <svg 
                                  className="h-4 w-4 mr-2" 
                                  viewBox="0 0 24 24" 
                                  fill="none" 
                                  xmlns="http://www.w3.org/2000/svg"
                                >
                                  <path 
                                    d="M7.5 3.75H6a2.25 2.25 0 0 0-2.25 2.25v1.5M16.5 3.75H18a2.25 2.25 0 0 1 2.25 2.25v1.5M7.5 20.25H6a2.25 2.25 0 0 1-2.25-2.25v-1.5M16.5 20.25H18a2.25 2.25 0 0 0 2.25-2.25v-1.5M3.75 12h16.5" 
                                    stroke="currentColor" 
                                    strokeWidth="1.5" 
                                    strokeLinecap="round" 
                                  />
                                </svg>
                                PIX
                              </TabsTrigger>
                            </TabsList>
                            
                            <TabsContent value="card" className="space-y-3">
                              <div className="rounded-md border p-3 bg-muted/50">
                                <div className="flex items-start gap-3">
                                  <Check className="h-5 w-5 text-green-500 mt-0.5" />
                                  <div>
                                    <h4 className="font-medium">Mesmo cartão, nova cobrança</h4>
                                    <p className="text-sm text-muted-foreground">
                                      O sistema usará o mesmo cartão já aprovado no checkout principal para cobrar o produto upsell.
                                    </p>
                                  </div>
                                </div>
                              </div>
                              
                              <div className="rounded-md border p-3 bg-muted/50">
                                <div className="flex items-start gap-3">
                                  <Check className="h-5 w-5 text-green-500 mt-0.5" />
                                  <div>
                                    <h4 className="font-medium">Dados tokenizados</h4>
                                    <p className="text-sm text-muted-foreground">
                                      Os dados de pagamento são armazenados de forma segura, seguindo os padrões PCI Compliance.
                                    </p>
                                  </div>
                                </div>
                              </div>
                              
                              <div className="rounded-md border p-3 bg-muted/50">
                                <div className="flex items-start gap-3">
                                  <Check className="h-5 w-5 text-green-500 mt-0.5" />
                                  <div>
                                    <h4 className="font-medium">Mensagem padrão</h4>
                                    <p className="text-sm text-muted-foreground">
                                      "Este produto será adicionado à sua compra e cobrado automaticamente no mesmo cartão de crédito."
                                    </p>
                                  </div>
                                </div>
                              </div>
                            </TabsContent>
                            
                            <TabsContent value="pix" className="space-y-3">
                              <div className="rounded-md border p-3 bg-muted/50">
                                <div className="flex items-start gap-3">
                                  <Check className="h-5 w-5 text-green-500 mt-0.5" />
                                  <div>
                                    <h4 className="font-medium">PIX instantâneo</h4>
                                    <p className="text-sm text-muted-foreground">
                                      O sistema gera um novo código PIX automaticamente para o produto de upsell.
                                    </p>
                                  </div>
                                </div>
                              </div>
                              
                              <div className="rounded-md border p-3 bg-muted/50">
                                <div className="flex items-start gap-3">
                                  <Check className="h-5 w-5 text-green-500 mt-0.5" />
                                  <div>
                                    <h4 className="font-medium">Sem preenchimento duplicado</h4>
                                    <p className="text-sm text-muted-foreground">
                                      Os dados pessoais do cliente são reaproveitados, sem necessidade de preenchimento.
                                    </p>
                                  </div>
                                </div>
                              </div>
                              
                              <div className="rounded-md border p-3 bg-muted/50">
                                <div className="flex items-start gap-3">
                                  <Check className="h-5 w-5 text-green-500 mt-0.5" />
                                  <div>
                                    <h4 className="font-medium">Mensagem padrão</h4>
                                    <p className="text-sm text-muted-foreground">
                                      "Este produto será adicionado à sua compra. Gere um novo PIX com um clique."
                                    </p>
                                  </div>
                                </div>
                              </div>
                            </TabsContent>
                          </Tabs>
                          
                          <div className="rounded-md bg-amber-50 border border-amber-200 p-3 mt-4">
                            <div className="flex items-start gap-3">
                              <AlertCircle className="h-5 w-5 text-amber-500 mt-0.5" />
                              <div>
                                <h4 className="font-medium text-amber-800">Configurações adicionais</h4>
                                <p className="text-sm text-amber-700">
                                  Configure upsells para seus produtos na seção <strong>Marketing &gt; Upsells</strong> após concluir a configuração do gateway.
                                </p>
                              </div>
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                  </>
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
