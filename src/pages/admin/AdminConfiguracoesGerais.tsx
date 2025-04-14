
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
  Languages,
  TrendingUp,
  Plus,
  Trash2,
  Save
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
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

interface CycleThreshold {
  id: string;
  minRevenue: number;
  maxRevenue: number | null;
  cycleValue: number;
}

const AdminConfiguracoesGerais: React.FC = () => {
  // Financial parameters
  const [taxaPadrao, setTaxaPadrao] = useState<string>("2.5");
  const [valorCiclo, setValorCiclo] = useState<string>("100.00");
  const [permitirEdicaoCiclo, setPermitirEdicaoCiclo] = useState<boolean>(true);
  
  // Auto cycle upgrade configuration
  const [autoCycleUpgrade, setAutoCycleUpgrade] = useState<boolean>(true);
  const [cycleThresholds, setCycleThresholds] = useState<CycleThreshold[]>([
    { id: '1', minRevenue: 0, maxRevenue: 5000, cycleValue: 100 },
    { id: '2', minRevenue: 5001, maxRevenue: 15000, cycleValue: 200 },
    { id: '3', minRevenue: 15001, maxRevenue: 30000, cycleValue: 300 },
    { id: '4', minRevenue: 30001, maxRevenue: 50000, cycleValue: 400 },
    { id: '5', minRevenue: 50001, maxRevenue: null, cycleValue: 500 },
  ]);
  
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

  const handleAddThreshold = () => {
    const lastThreshold = cycleThresholds[cycleThresholds.length - 1];
    const newMinRevenue = lastThreshold.maxRevenue ? lastThreshold.maxRevenue + 1 : 50001;
    
    const newThreshold: CycleThreshold = {
      id: Date.now().toString(),
      minRevenue: newMinRevenue,
      maxRevenue: newMinRevenue + 20000,
      cycleValue: lastThreshold.cycleValue + 100,
    };
    
    // Update the previous "unlimited" threshold to have a max value
    const updatedThresholds = cycleThresholds.map(threshold => {
      if (threshold.maxRevenue === null) {
        return { ...threshold, maxRevenue: newMinRevenue - 1 };
      }
      return threshold;
    });
    
    // Add the new threshold as the last one with null maxRevenue
    setCycleThresholds([...updatedThresholds, { ...newThreshold, maxRevenue: null }]);
    
    toast({
      title: "Nova faixa adicionada",
      description: "A nova faixa de faturamento foi adicionada com sucesso.",
    });
  };

  const handleRemoveThreshold = (id: string) => {
    if (cycleThresholds.length <= 1) {
      toast({
        title: "Não é possível remover",
        description: "É necessário manter pelo menos uma faixa de faturamento.",
        variant: "destructive",
      });
      return;
    }
    
    // Find the threshold to remove
    const thresholdToRemove = cycleThresholds.find(t => t.id === id);
    if (!thresholdToRemove) return;
    
    // Find the previous threshold
    const thresholdIndex = cycleThresholds.findIndex(t => t.id === id);
    const previousThreshold = thresholdIndex > 0 ? cycleThresholds[thresholdIndex - 1] : null;
    
    // Create new thresholds array without the removed one
    let newThresholds = cycleThresholds.filter(t => t.id !== id);
    
    // If removing a threshold with null maxRevenue, update the new last threshold
    if (thresholdToRemove.maxRevenue === null && previousThreshold) {
      newThresholds = newThresholds.map((t, idx) => {
        if (idx === newThresholds.length - 1) {
          return { ...t, maxRevenue: null };
        }
        return t;
      });
    }
    
    setCycleThresholds(newThresholds);
    
    toast({
      title: "Faixa removida",
      description: "A faixa de faturamento foi removida com sucesso.",
    });
  };

  const handleUpdateThreshold = (id: string, field: keyof CycleThreshold, value: string) => {
    // Find the threshold index
    const thresholdIndex = cycleThresholds.findIndex(t => t.id === id);
    if (thresholdIndex === -1) return;
    
    // Create a copy of the threshold
    const threshold = { ...cycleThresholds[thresholdIndex] };
    
    // Update the field
    if (field === 'minRevenue' || field === 'cycleValue') {
      threshold[field] = parseFloat(value) || 0;
    } else if (field === 'maxRevenue') {
      threshold[field] = value ? parseFloat(value) : null;
    }
    
    // Create a new array with the updated threshold
    const newThresholds = [...cycleThresholds];
    newThresholds[thresholdIndex] = threshold;
    
    setCycleThresholds(newThresholds);
  };

  const handleSaveCycleThresholds = () => {
    // Validate thresholds logic
    let isValid = true;
    let validationMessage = "";
    
    // Check for overlapping ranges
    for (let i = 0; i < cycleThresholds.length - 1; i++) {
      const current = cycleThresholds[i];
      const next = cycleThresholds[i + 1];
      
      if (current.maxRevenue !== null && next.minRevenue <= current.maxRevenue) {
        isValid = false;
        validationMessage = "As faixas de faturamento não podem se sobrepor.";
        break;
      }
      
      if (current.minRevenue >= (current.maxRevenue || Infinity)) {
        isValid = false;
        validationMessage = "O valor mínimo deve ser menor que o valor máximo em cada faixa.";
        break;
      }
    }
    
    if (!isValid) {
      toast({
        title: "Erro de validação",
        description: validationMessage,
        variant: "destructive",
      });
      return;
    }
    
    // Save thresholds (in a real app, this would call an API)
    toast({
      title: "Faixas de ciclo salvas",
      description: "As faixas de faturamento para upgrade automático foram atualizadas com sucesso.",
    });
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
      
      {/* Ciclo por Faixas de Faturamento */}
      <Card>
        <CardHeader className="pb-3">
          <div className="flex items-center">
            <TrendingUp className="mr-2 text-primary" />
            <CardTitle>Ciclo por Faixas de Faturamento</CardTitle>
          </div>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="flex items-center justify-between">
            <div className="flex-1">
              <Label htmlFor="auto-cycle">Ativar ajuste automático de ciclo por faturamento</Label>
              <p className="text-sm text-muted-foreground mt-1">
                Quando ativado, o sistema atualizará o valor do ciclo automaticamente quando 
                uma loja atingir determinado faturamento total.
              </p>
            </div>
            <Switch 
              id="auto-cycle"
              checked={autoCycleUpgrade}
              onCheckedChange={setAutoCycleUpgrade}
            />
          </div>
          
          <Separator />
          
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <h3 className="text-lg font-medium">Faixas de Faturamento</h3>
              <Button 
                onClick={handleAddThreshold}
                size="sm"
                className="flex items-center"
              >
                <Plus className="mr-1 h-4 w-4" />
                Adicionar nova faixa
              </Button>
            </div>
            
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Faturamento Mínimo (R$)</TableHead>
                  <TableHead>Faturamento Máximo (R$)</TableHead>
                  <TableHead>Valor do Ciclo (R$)</TableHead>
                  <TableHead className="w-[80px]">Ações</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {cycleThresholds.map((threshold) => (
                  <TableRow key={threshold.id}>
                    <TableCell>
                      <Input 
                        type="number" 
                        value={threshold.minRevenue}
                        onChange={(e) => handleUpdateThreshold(threshold.id, 'minRevenue', e.target.value)}
                        min="0"
                        step="100"
                        className="max-w-[150px]"
                      />
                    </TableCell>
                    <TableCell>
                      <Input 
                        type="number" 
                        value={threshold.maxRevenue === null ? '' : threshold.maxRevenue}
                        onChange={(e) => handleUpdateThreshold(threshold.id, 'maxRevenue', e.target.value)}
                        min={threshold.minRevenue + 1}
                        step="100"
                        className="max-w-[150px]"
                        placeholder={threshold.maxRevenue === null ? "Sem limite" : ""}
                      />
                    </TableCell>
                    <TableCell>
                      <Input 
                        type="number" 
                        value={threshold.cycleValue}
                        onChange={(e) => handleUpdateThreshold(threshold.id, 'cycleValue', e.target.value)}
                        min="50"
                        step="50"
                        className="max-w-[150px]"
                      />
                    </TableCell>
                    <TableCell>
                      <Button 
                        variant="ghost" 
                        size="icon"
                        onClick={() => handleRemoveThreshold(threshold.id)}
                      >
                        <Trash2 className="h-4 w-4 text-destructive" />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
            
            <div className="flex justify-end mt-4">
              <Button onClick={handleSaveCycleThresholds} className="bg-green-600 hover:bg-green-700">
                <Save className="mr-2 h-4 w-4" />
                Salvar Faixas de Ciclo
              </Button>
            </div>
            
            <div className="bg-muted p-4 rounded-md mt-2">
              <h4 className="font-medium mb-2 flex items-center">
                <Info className="h-4 w-4 mr-2 text-muted-foreground" />
                Como funciona o escalonamento automático
              </h4>
              <p className="text-sm text-muted-foreground">
                Quando o faturamento total da loja atingir o valor mínimo de uma faixa, o valor do 
                ciclo será automaticamente ajustado para o novo valor definido. O sistema verifica 
                isso diariamente e aplica o novo valor na próxima cobrança.
              </p>
            </div>
          </div>
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
