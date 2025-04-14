
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { 
  DollarSign, 
  CreditCard, 
  Settings, 
  Shield,
  Info,
  CheckCircle,
  XCircle,
  RefreshCw,
  Clock,
  Globe,
  Languages
} from "lucide-react";
import { Separator } from "@/components/ui/separator";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { Button } from "@/components/ui/button";
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { 
  Tooltip,
  TooltipContent,
  TooltipTrigger 
} from "@/components/ui/tooltip";
import { toast } from "@/hooks/use-toast";

const AdminConfiguracoesGerais: React.FC = () => {
  // Financial parameters
  const [taxaPadrao, setTaxaPadrao] = useState<string>("2.5");
  const [valorCiclo, setValorCiclo] = useState<string>("100.00");
  const [permitirEdicaoCiclo, setPermitirEdicaoCiclo] = useState<boolean>(true);
  
  // Gateway configurations
  const [gateways, setGateways] = useState({
    pagarme: {
      publicKey: "",
      secretKey: "",
      integrated: false
    },
    mercadopago: {
      accessToken: "",
      publicKey: "",
      integrated: false
    },
    stripe: {
      secretKey: "",
      webhookEndpoint: "",
      integrated: true
    }
  });
  
  // System defaults
  const [fusoHorario, setFusoHorario] = useState<string>("GMT-3");
  const [moedaPadrao, setMoedaPadrao] = useState<string>("BRL");
  const [idiomaPadrao, setIdiomaPadrao] = useState<string>("pt-BR");
  const [modoTestes, setModoTestes] = useState<boolean>(false);
  
  // Security settings
  const [permitirNovosCadastros, setPermitirNovosCadastros] = useState<boolean>(true);
  
  // Handles
  const handleSaveFinancialParams = () => {
    toast({
      title: "Configurações financeiras salvas",
      description: "Os novos parâmetros financeiros foram aplicados com sucesso.",
    });
  };
  
  const handleUpdateGateway = (gateway: string) => {
    toast({
      title: `Integração ${gateway} atualizada`,
      description: "As chaves de integração foram atualizadas com sucesso.",
    });
  };
  
  const handleSaveSystemDefaults = () => {
    toast({
      title: "Padrões do sistema atualizados",
      description: "As configurações padrão foram aplicadas com sucesso.",
    });
  };
  
  const handleResetIntegrations = () => {
    if (window.confirm("Tem certeza? Isso irá reiniciar todas as chaves e integrações globais.")) {
      toast({
        title: "Integrações reiniciadas",
        description: "Todas as integrações foram reiniciadas com sucesso.",
      });
    }
  };

  return (
    <div className="p-8 space-y-8">
      <h1 className="text-2xl font-bold mb-2">Configurações Globais</h1>
      <p className="text-muted-foreground mb-6">
        Gerencie os parâmetros globais da plataforma voltz.checkout
      </p>
      
      {/* Parâmetros Financeiros */}
      <Card>
        <CardHeader className="pb-3">
          <div className="flex items-center">
            <DollarSign className="mr-2 text-primary" />
            <CardTitle>Parâmetros Financeiros Globais</CardTitle>
          </div>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label htmlFor="taxa-padrao">Taxa padrão por pedido (%)</Label>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Info className="h-4 w-4 text-muted-foreground" />
                  </TooltipTrigger>
                  <TooltipContent>
                    <p className="w-80">
                      Taxa aplicada a todos os pedidos aprovados por padrão. 
                      Esse valor pode ser personalizado por loja.
                    </p>
                  </TooltipContent>
                </Tooltip>
              </div>
              <Input 
                id="taxa-padrao" 
                value={taxaPadrao} 
                onChange={(e) => setTaxaPadrao(e.target.value)} 
                type="number" 
                step="0.01"
                min="0"
                max="100"
              />
            </div>
            
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label htmlFor="valor-ciclo">Valor inicial do ciclo (R$)</Label>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Info className="h-4 w-4 text-muted-foreground" />
                  </TooltipTrigger>
                  <TooltipContent>
                    <p className="w-80">
                      Valor limite do primeiro ciclo para novas lojas. 
                      Após esse valor, é cobrada a taxa automaticamente.
                    </p>
                  </TooltipContent>
                </Tooltip>
              </div>
              <Input 
                id="valor-ciclo" 
                value={valorCiclo} 
                onChange={(e) => setValorCiclo(e.target.value)} 
                type="number" 
                step="0.01"
                min="0"
              />
            </div>
          </div>

          <div className="flex items-center justify-between">
            <div className="flex-1">
              <Label htmlFor="permitir-edicao">Permitir edição de ciclo</Label>
              <p className="text-sm text-muted-foreground mt-1">
                Se desativado, apenas administradores poderão editar o ciclo das lojas
              </p>
            </div>
            <Switch 
              id="permitir-edicao"
              checked={permitirEdicaoCiclo}
              onCheckedChange={setPermitirEdicaoCiclo}
            />
          </div>

          <Button onClick={handleSaveFinancialParams}>Salvar parâmetros financeiros</Button>
        </CardContent>
      </Card>
      
      {/* Integrações com Gateways */}
      <Card>
        <CardHeader className="pb-3">
          <div className="flex items-center">
            <CreditCard className="mr-2 text-primary" />
            <CardTitle>Integrações com Gateways</CardTitle>
          </div>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-8">
            {/* Pagar.me */}
            <div className="space-y-4 border p-4 rounded-lg">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-medium">Pagar.me</h3>
                <div className="flex items-center">
                  {gateways.pagarme.integrated ? (
                    <div className="flex items-center text-green-500">
                      <CheckCircle className="h-4 w-4 mr-1" />
                      <span className="text-sm">Integrado</span>
                    </div>
                  ) : (
                    <div className="flex items-center text-red-500">
                      <XCircle className="h-4 w-4 mr-1" />
                      <span className="text-sm">Não integrado</span>
                    </div>
                  )}
                </div>
              </div>
              
              <div className="grid md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="pagarme-public">Public Key</Label>
                  <Input 
                    id="pagarme-public" 
                    value={gateways.pagarme.publicKey} 
                    onChange={(e) => setGateways({
                      ...gateways,
                      pagarme: {
                        ...gateways.pagarme,
                        publicKey: e.target.value
                      }
                    })} 
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="pagarme-secret">Secret Key</Label>
                  <Input 
                    id="pagarme-secret" 
                    type="password"
                    value={gateways.pagarme.secretKey} 
                    onChange={(e) => setGateways({
                      ...gateways,
                      pagarme: {
                        ...gateways.pagarme,
                        secretKey: e.target.value
                      }
                    })} 
                  />
                </div>
              </div>
              
              <Button onClick={() => handleUpdateGateway("Pagar.me")}>
                Atualizar integração
              </Button>
            </div>
            
            {/* Mercado Pago */}
            <div className="space-y-4 border p-4 rounded-lg">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-medium">Mercado Pago</h3>
                <div className="flex items-center">
                  {gateways.mercadopago.integrated ? (
                    <div className="flex items-center text-green-500">
                      <CheckCircle className="h-4 w-4 mr-1" />
                      <span className="text-sm">Integrado</span>
                    </div>
                  ) : (
                    <div className="flex items-center text-red-500">
                      <XCircle className="h-4 w-4 mr-1" />
                      <span className="text-sm">Não integrado</span>
                    </div>
                  )}
                </div>
              </div>
              
              <div className="grid md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="mp-public">Public Key</Label>
                  <Input 
                    id="mp-public" 
                    value={gateways.mercadopago.publicKey} 
                    onChange={(e) => setGateways({
                      ...gateways,
                      mercadopago: {
                        ...gateways.mercadopago,
                        publicKey: e.target.value
                      }
                    })} 
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="mp-access">Access Token</Label>
                  <Input 
                    id="mp-access" 
                    type="password"
                    value={gateways.mercadopago.accessToken} 
                    onChange={(e) => setGateways({
                      ...gateways,
                      mercadopago: {
                        ...gateways.mercadopago,
                        accessToken: e.target.value
                      }
                    })} 
                  />
                </div>
              </div>
              
              <Button onClick={() => handleUpdateGateway("Mercado Pago")}>
                Atualizar integração
              </Button>
            </div>
            
            {/* Stripe */}
            <div className="space-y-4 border p-4 rounded-lg">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-medium">Stripe</h3>
                <div className="flex items-center">
                  {gateways.stripe.integrated ? (
                    <div className="flex items-center text-green-500">
                      <CheckCircle className="h-4 w-4 mr-1" />
                      <span className="text-sm">Integrado</span>
                    </div>
                  ) : (
                    <div className="flex items-center text-red-500">
                      <XCircle className="h-4 w-4 mr-1" />
                      <span className="text-sm">Não integrado</span>
                    </div>
                  )}
                </div>
              </div>
              
              <div className="grid md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="stripe-secret">Secret Key</Label>
                  <Input 
                    id="stripe-secret" 
                    type="password"
                    value={gateways.stripe.secretKey} 
                    onChange={(e) => setGateways({
                      ...gateways,
                      stripe: {
                        ...gateways.stripe,
                        secretKey: e.target.value
                      }
                    })} 
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="stripe-webhook">Webhook Endpoint</Label>
                  <Input 
                    id="stripe-webhook" 
                    value={gateways.stripe.webhookEndpoint} 
                    onChange={(e) => setGateways({
                      ...gateways,
                      stripe: {
                        ...gateways.stripe,
                        webhookEndpoint: e.target.value
                      }
                    })} 
                  />
                </div>
              </div>
              
              <Button onClick={() => handleUpdateGateway("Stripe")}>
                Atualizar integração
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
      
      {/* Padrões do Sistema */}
      <Card>
        <CardHeader className="pb-3">
          <div className="flex items-center">
            <Settings className="mr-2 text-primary" />
            <CardTitle>Padrões do Sistema</CardTitle>
          </div>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label htmlFor="fuso-horario">Fuso horário da plataforma</Label>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Clock className="h-4 w-4 text-muted-foreground" />
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>Fuso horário padrão usado para relatórios e logs do sistema</p>
                  </TooltipContent>
                </Tooltip>
              </div>
              <Select value={fusoHorario} onValueChange={setFusoHorario}>
                <SelectTrigger id="fuso-horario">
                  <SelectValue placeholder="Selecione um fuso horário" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="GMT-3">GMT-3 (Brasília)</SelectItem>
                  <SelectItem value="GMT-4">GMT-4 (Manaus)</SelectItem>
                  <SelectItem value="GMT-5">GMT-5 (Nova York)</SelectItem>
                  <SelectItem value="GMT">GMT (Londres)</SelectItem>
                  <SelectItem value="GMT+1">GMT+1 (Paris)</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label htmlFor="moeda-padrao">Moeda padrão</Label>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Globe className="h-4 w-4 text-muted-foreground" />
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>Moeda padrão usada em novas lojas e relatórios</p>
                  </TooltipContent>
                </Tooltip>
              </div>
              <Select value={moedaPadrao} onValueChange={setMoedaPadrao}>
                <SelectTrigger id="moeda-padrao">
                  <SelectValue placeholder="Selecione uma moeda" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="BRL">BRL (Real Brasileiro)</SelectItem>
                  <SelectItem value="USD">USD (Dólar Americano)</SelectItem>
                  <SelectItem value="EUR">EUR (Euro)</SelectItem>
                  <SelectItem value="GBP">GBP (Libra Esterlina)</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label htmlFor="idioma-padrao">Idioma padrão</Label>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Languages className="h-4 w-4 text-muted-foreground" />
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>Idioma padrão para interface e e-mails do sistema</p>
                  </TooltipContent>
                </Tooltip>
              </div>
              <Select value={idiomaPadrao} onValueChange={setIdiomaPadrao}>
                <SelectTrigger id="idioma-padrao">
                  <SelectValue placeholder="Selecione um idioma" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="pt-BR">Português (Brasil)</SelectItem>
                  <SelectItem value="en-US">English (US)</SelectItem>
                  <SelectItem value="es">Español</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div className="flex items-center justify-between pt-6">
              <div>
                <Label htmlFor="modo-testes">Habilitar modo de testes</Label>
                <p className="text-sm text-muted-foreground mt-1">
                  Permite simular pagamentos fake nas lojas
                </p>
              </div>
              <Switch 
                id="modo-testes"
                checked={modoTestes}
                onCheckedChange={setModoTestes}
              />
            </div>
          </div>

          <Button onClick={handleSaveSystemDefaults}>Salvar padrões do sistema</Button>
        </CardContent>
      </Card>
      
      {/* Segurança e Controle */}
      <Card>
        <CardHeader className="pb-3">
          <div className="flex items-center">
            <Shield className="mr-2 text-primary" />
            <CardTitle>Segurança e Controle</CardTitle>
          </div>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <Label htmlFor="permitir-cadastros">Permitir novos cadastros</Label>
              <p className="text-sm text-muted-foreground mt-1">
                Se desativado, apenas com convites será possível criar novas contas
              </p>
            </div>
            <Switch 
              id="permitir-cadastros"
              checked={permitirNovosCadastros}
              onCheckedChange={setPermitirNovosCadastros}
            />
          </div>
          
          <div className="grid md:grid-cols-2 gap-4">
            <Button variant="outline" asChild>
              <a href="/admin/logs">
                Logs de sistema
              </a>
            </Button>
            
            <Button 
              variant="destructive" 
              onClick={handleResetIntegrations}
              className="flex items-center"
            >
              <RefreshCw className="mr-2 h-4 w-4" />
              Reiniciar integrações globalmente
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default AdminConfiguracoesGerais;
