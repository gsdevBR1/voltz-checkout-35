
import React, { useState } from 'react';
import CheckoutLayout from '@/components/checkout/CheckoutLayout';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { CreditCard, BanknoteIcon, QrCode, ArrowDownRight } from 'lucide-react';
import { toast } from 'sonner';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Switch } from '@/components/ui/switch';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const RedirecionamentoPage = () => {
  const [urls, setUrls] = useState({
    cartao: 'https://voltz.checkout/obrigado',
    pix: 'https://voltz.checkout/obrigado',
    boleto: 'https://voltz.checkout/obrigado'
  });
  
  const [enableUpsell, setEnableUpsell] = useState({
    cartao: true,
    pix: true,
    boleto: false
  });

  const handleChange = (method: keyof typeof urls, value: string) => {
    setUrls({
      ...urls,
      [method]: value
    });
  };
  
  const handleToggleUpsell = (method: keyof typeof enableUpsell) => {
    setEnableUpsell({
      ...enableUpsell,
      [method]: !enableUpsell[method]
    });
  };
  
  const handleSave = () => {
    // Here you would save the URLs to your backend
    toast({
      title: "Configurações de redirecionamento salvas",
      description: "As configurações de redirecionamento e upsell foram atualizadas com sucesso.",
    });
  };

  return (
    <CheckoutLayout>
      <div>
        <h1>Redirecionamento</h1>
        <p>Configure as URLs de redirecionamento após o pagamento e a exibição de upsells para cada método de pagamento.</p>
      </div>
      <Card>
        <CardHeader>
          <CardTitle>Configurar Redirecionamentos e Upsells</CardTitle>
          <CardDescription>
            Defina para onde seus clientes serão direcionados após o pagamento e se verão ofertas de upsell.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <Tabs defaultValue="cartao" className="w-full">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="cartao">
                <CreditCard className="h-4 w-4 mr-2" />
                Cartão de Crédito
              </TabsTrigger>
              <TabsTrigger value="pix">
                <QrCode className="h-4 w-4 mr-2" />
                Pix
              </TabsTrigger>
              <TabsTrigger value="boleto">
                <BanknoteIcon className="h-4 w-4 mr-2" />
                Boleto Bancário
              </TabsTrigger>
            </TabsList>
            
            <TabsContent value="cartao" className="space-y-4 pt-4">
              <div className="flex items-center justify-between border-b pb-4">
                <div>
                  <h3 className="font-medium">Ativar Upsell One Click</h3>
                  <p className="text-sm text-muted-foreground">
                    Exibir ofertas pós-compra com o mesmo cartão já aprovado
                  </p>
                </div>
                <Switch 
                  checked={enableUpsell.cartao} 
                  onCheckedChange={() => handleToggleUpsell('cartao')} 
                />
              </div>
              
              {enableUpsell.cartao ? (
                <div className="space-y-4">
                  <div className="rounded-md bg-muted p-3">
                    <div className="flex items-start">
                      <ArrowDownRight className="h-5 w-5 text-green-500 mr-2 mt-0.5" />
                      <div>
                        <p className="text-sm font-medium">Fluxo de redirecionamento</p>
                        <p className="text-xs text-muted-foreground">
                          Checkout → Pagamento aprovado → Página de Upsell → URL de redirecionamento
                        </p>
                      </div>
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="cartao-redirect-upsell">URL após aceitar ou recusar upsell</Label>
                    <Input
                      id="cartao-redirect-upsell"
                      type="url"
                      placeholder="https://"
                      value={urls.cartao}
                      onChange={(e) => handleChange('cartao', e.target.value)}
                    />
                    <p className="text-xs text-muted-foreground">
                      O cliente será redirecionado para esta URL após interagir com a oferta de upsell.
                    </p>
                  </div>
                </div>
              ) : (
                <div className="space-y-2">
                  <Label htmlFor="cartao-redirect">URL após pagamento aprovado</Label>
                  <Input
                    id="cartao-redirect"
                    type="url"
                    placeholder="https://"
                    value={urls.cartao}
                    onChange={(e) => handleChange('cartao', e.target.value)}
                  />
                </div>
              )}
            </TabsContent>
            
            <TabsContent value="pix" className="space-y-4 pt-4">
              <div className="flex items-center justify-between border-b pb-4">
                <div>
                  <h3 className="font-medium">Ativar Upsell para PIX</h3>
                  <p className="text-sm text-muted-foreground">
                    Exibir ofertas pós-compra com geração automática de PIX
                  </p>
                </div>
                <Switch 
                  checked={enableUpsell.pix} 
                  onCheckedChange={() => handleToggleUpsell('pix')} 
                />
              </div>
              
              {enableUpsell.pix ? (
                <div className="space-y-4">
                  <div className="rounded-md bg-muted p-3">
                    <div className="flex items-start">
                      <ArrowDownRight className="h-5 w-5 text-green-500 mr-2 mt-0.5" />
                      <div>
                        <p className="text-sm font-medium">Fluxo de redirecionamento</p>
                        <p className="text-xs text-muted-foreground">
                          Checkout → PIX gerado → Página de Upsell → URL de redirecionamento
                        </p>
                      </div>
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="pix-redirect-upsell">URL após aceitar ou recusar upsell</Label>
                    <Input
                      id="pix-redirect-upsell"
                      type="url"
                      placeholder="https://"
                      value={urls.pix}
                      onChange={(e) => handleChange('pix', e.target.value)}
                    />
                    <p className="text-xs text-muted-foreground">
                      O cliente será redirecionado para esta URL após interagir com a oferta de upsell.
                    </p>
                  </div>
                </div>
              ) : (
                <div className="space-y-2">
                  <Label htmlFor="pix-redirect">URL após geração do PIX</Label>
                  <Input
                    id="pix-redirect"
                    type="url"
                    placeholder="https://"
                    value={urls.pix}
                    onChange={(e) => handleChange('pix', e.target.value)}
                  />
                </div>
              )}
            </TabsContent>
            
            <TabsContent value="boleto" className="space-y-4 pt-4">
              <div className="flex items-center justify-between border-b pb-4">
                <div>
                  <h3 className="font-medium">Ativar Upsell para Boleto</h3>
                  <p className="text-sm text-muted-foreground">
                    Exibir ofertas pós-compra com geração automática de boleto
                  </p>
                </div>
                <Switch 
                  checked={enableUpsell.boleto} 
                  onCheckedChange={() => handleToggleUpsell('boleto')} 
                />
              </div>
              
              {enableUpsell.boleto ? (
                <div className="space-y-4">
                  <div className="rounded-md bg-muted p-3">
                    <div className="flex items-start">
                      <ArrowDownRight className="h-5 w-5 text-green-500 mr-2 mt-0.5" />
                      <div>
                        <p className="text-sm font-medium">Fluxo de redirecionamento</p>
                        <p className="text-xs text-muted-foreground">
                          Checkout → Boleto gerado → Página de Upsell → URL de redirecionamento
                        </p>
                      </div>
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="boleto-redirect-upsell">URL após aceitar ou recusar upsell</Label>
                    <Input
                      id="boleto-redirect-upsell"
                      type="url"
                      placeholder="https://"
                      value={urls.boleto}
                      onChange={(e) => handleChange('boleto', e.target.value)}
                    />
                    <p className="text-xs text-muted-foreground">
                      O cliente será redirecionado para esta URL após interagir com a oferta de upsell.
                    </p>
                  </div>
                </div>
              ) : (
                <div className="space-y-2">
                  <Label htmlFor="boleto-redirect">URL após geração do boleto</Label>
                  <Input
                    id="boleto-redirect"
                    type="url"
                    placeholder="https://"
                    value={urls.boleto}
                    onChange={(e) => handleChange('boleto', e.target.value)}
                  />
                </div>
              )}
            </TabsContent>
          </Tabs>
        </CardContent>
        <CardFooter className="flex justify-end">
          <Button onClick={handleSave}>Salvar Alterações</Button>
        </CardFooter>
      </Card>
      
      <Card className="mt-6">
        <CardHeader>
          <CardTitle>Configurações Avançadas de Upsell</CardTitle>
          <CardDescription>
            Configure opções adicionais para as ofertas de upsell.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between border-b pb-4">
            <div>
              <h3 className="font-medium">Modo de Exibição</h3>
              <p className="text-sm text-muted-foreground">
                Escolha como as ofertas de upsell serão apresentadas
              </p>
            </div>
            <div className="flex items-center space-x-2">
              <Label htmlFor="display-mode" className="sr-only">Modo de Exibição</Label>
              <Select defaultValue="single">
                <SelectTrigger id="display-mode" className="w-[180px]">
                  <SelectValue placeholder="Selecione o modo" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="single">Página única</SelectItem>
                  <SelectItem value="carousel">Carrossel</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          
          <div className="flex items-center justify-between border-b pb-4">
            <div>
              <h3 className="font-medium">Botão "Pular Oferta"</h3>
              <p className="text-sm text-muted-foreground">
                Exibir botão visível para pular a oferta de upsell
              </p>
            </div>
            <Switch defaultChecked />
          </div>
          
          <div className="flex items-center justify-between border-b pb-4">
            <div>
              <h3 className="font-medium">Mostrar contagem regressiva</h3>
              <p className="text-sm text-muted-foreground">
                Adicionar temporizador para criar senso de urgência
              </p>
            </div>
            <Switch defaultChecked />
          </div>
          
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-medium">Mesmo tema do checkout</h3>
              <p className="text-sm text-muted-foreground">
                Manter visual, cores e identidade do checkout principal
              </p>
            </div>
            <Switch defaultChecked />
          </div>
        </CardContent>
      </Card>
    </CheckoutLayout>
  );
};

export default RedirecionamentoPage;
