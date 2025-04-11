
import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useStores } from '@/contexts/StoreContext';
import { 
  DollarSign, CreditCard, ShoppingCart, TrendingUp, Percent, 
  ArrowUpRight, Users, Activity, BarChart2, PieChart, 
  Clock, Package, MapPin, Smartphone, AlertTriangle, RefreshCw,
  BoxesIcon, LineChart, Gauge, ArrowUp, TimerIcon, Trophy, PercentIcon
} from 'lucide-react';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { Separator } from '@/components/ui/separator';

export type KpiCategory = 'financial' | 'conversion' | 'traffic' | 'insights';

export interface KpiSetting {
  id: string;
  name: string;
  category: KpiCategory;
  subcategory: 'primary' | 'secondary' | 'advanced';
  default: boolean;
  description: string;
  icon: React.ReactNode;
}

export const availableKpis: KpiSetting[] = [
  // Primary KPIs
  { 
    id: 'faturamento', 
    name: 'Faturamento (Dia)', 
    category: 'financial', 
    subcategory: 'primary',
    default: true,
    description: 'Total de vendas aprovadas no período',
    icon: <DollarSign className="h-4 w-4" />
  },
  { 
    id: 'transacoes', 
    name: 'Transações Aprovadas', 
    category: 'financial', 
    subcategory: 'primary',
    default: true,
    description: 'Número total de transações bem-sucedidas',
    icon: <ShoppingCart className="h-4 w-4" />
  },
  { 
    id: 'ticketMedio', 
    name: 'Ticket Médio', 
    category: 'financial', 
    subcategory: 'primary',
    default: true,
    description: 'Valor médio por venda aprovada',
    icon: <CreditCard className="h-4 w-4" />
  },
  { 
    id: 'conversaoCheckout', 
    name: 'Conversão do Checkout', 
    category: 'conversion', 
    subcategory: 'primary',
    default: true,
    description: 'Taxa de conclusão do processo de checkout',
    icon: <TrendingUp className="h-4 w-4" />
  },
  { 
    id: 'conversaoGateway', 
    name: 'Conversão do Gateway', 
    category: 'conversion', 
    subcategory: 'primary',
    default: true,
    description: 'Taxa de aprovação de pagamentos',
    icon: <Percent className="h-4 w-4" />
  },
  
  // Secondary KPIs
  { 
    id: 'pixGerado', 
    name: 'Pix Gerado', 
    category: 'conversion', 
    subcategory: 'secondary',
    default: false,
    description: 'Quantidade de Pix gerados no período',
    icon: <Activity className="h-4 w-4" />
  },
  { 
    id: 'pixPago', 
    name: 'Pix Pago', 
    category: 'conversion', 
    subcategory: 'secondary',
    default: false,
    description: 'Quantidade de Pix efetivamente pagos',
    icon: <Activity className="h-4 w-4" />
  },
  { 
    id: 'reembolsos', 
    name: 'Reembolsos', 
    category: 'financial', 
    subcategory: 'secondary',
    default: true,
    description: 'Total de vendas reembolsadas no período',
    icon: <ArrowUpRight className="h-4 w-4" />
  },
  { 
    id: 'chargebacks', 
    name: 'Chargebacks', 
    category: 'financial', 
    subcategory: 'secondary',
    default: false,
    description: 'Total de contestações de pagamento',
    icon: <ArrowUpRight className="h-4 w-4" />
  },
  { 
    id: 'visitas', 
    name: 'Visitas no Checkout', 
    category: 'traffic', 
    subcategory: 'secondary',
    default: true,
    description: 'Total de visitantes que iniciaram o checkout',
    icon: <Users className="h-4 w-4" />
  },
  { 
    id: 'abandono', 
    name: 'Carrinhos Abandonados', 
    category: 'conversion', 
    subcategory: 'secondary',
    default: false,
    description: 'Quantidade de carrinhos não finalizados',
    icon: <ShoppingCart className="h-4 w-4" />
  },
  
  // Advanced Insights
  { 
    id: 'projecaoFaturamento', 
    name: 'Projeção de Faturamento', 
    category: 'insights', 
    subcategory: 'advanced',
    default: true,
    description: 'Estimativa de faturamento para o próximo período',
    icon: <LineChart className="h-4 w-4" />
  },
  { 
    id: 'variacaoPercentual', 
    name: 'Variação Percentual', 
    category: 'insights', 
    subcategory: 'advanced',
    default: true,
    description: 'Variação em relação ao período anterior',
    icon: <PercentIcon className="h-4 w-4" />
  },
  { 
    id: 'estoqueCritico', 
    name: 'Estoque Crítico', 
    category: 'insights', 
    subcategory: 'advanced',
    default: true,
    description: 'Produtos com estoque baixo ou em falta',
    icon: <BoxesIcon className="h-4 w-4" />
  },
  { 
    id: 'etapaAbandonoComum', 
    name: 'Etapa com Maior Abandono', 
    category: 'insights', 
    subcategory: 'advanced',
    default: true,
    description: 'Identifica onde os clientes desistem da compra',
    icon: <AlertTriangle className="h-4 w-4" />
  },
  { 
    id: 'tempoConversao', 
    name: 'Tempo Médio até Compra', 
    category: 'insights', 
    subcategory: 'advanced',
    default: true,
    description: 'Duração média do processo de checkout',
    icon: <TimerIcon className="h-4 w-4" />
  },
  { 
    id: 'clientesRecompra', 
    name: 'Clientes com Recompra', 
    category: 'insights', 
    subcategory: 'advanced',
    default: true,
    description: 'Quantidade de clientes que voltaram a comprar',
    icon: <RefreshCw className="h-4 w-4" />
  },
  { 
    id: 'melhorUtm', 
    name: 'Melhor UTM', 
    category: 'insights', 
    subcategory: 'advanced',
    default: true,
    description: 'Campanha com melhor desempenho',
    icon: <Trophy className="h-4 w-4" />
  },
  { 
    id: 'testeAB', 
    name: 'Teste A/B', 
    category: 'insights', 
    subcategory: 'advanced',
    default: false,
    description: 'Resultados de testes A/B ativos',
    icon: <Activity className="h-4 w-4" />
  },
  { 
    id: 'regioesMaisCompras', 
    name: 'Regiões com Mais Compras', 
    category: 'insights', 
    subcategory: 'advanced',
    default: true,
    description: 'Distribuição geográfica das vendas',
    icon: <MapPin className="h-4 w-4" />
  },
  { 
    id: 'dispositivo', 
    name: 'Dispositivo', 
    category: 'insights', 
    subcategory: 'advanced',
    default: true,
    description: 'Origem das compras por tipo de dispositivo',
    icon: <Smartphone className="h-4 w-4" />
  },
  { 
    id: 'cartoesRecusados', 
    name: 'Cartões Recusados', 
    category: 'insights', 
    subcategory: 'advanced',
    default: true,
    description: 'Total e motivos de recusa de cartões',
    icon: <CreditCard className="h-4 w-4" />
  },
  { 
    id: 'alertaMed', 
    name: 'Alerta de MED', 
    category: 'insights', 
    subcategory: 'advanced',
    default: true,
    description: 'Alertas de monitoramento de disputas',
    icon: <AlertTriangle className="h-4 w-4" />
  },
];

export interface CustomizeDashboardDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function CustomizeDashboardDialog({ open, onOpenChange }: CustomizeDashboardDialogProps) {
  const { currentStore, updateStore } = useStores();
  const [activeKpis, setActiveKpis] = React.useState<Record<string, boolean>>({});
  const [activeTab, setActiveTab] = React.useState<string>("kpis-principais");

  React.useEffect(() => {
    // Initialize KPI settings from store or defaults
    if (currentStore) {
      const initialKpis: Record<string, boolean> = {};
      
      availableKpis.forEach(kpi => {
        const storeKpiSettings = currentStore.dashboardSettings?.kpis || {};
        initialKpis[kpi.id] = storeKpiSettings[kpi.id] !== undefined 
          ? storeKpiSettings[kpi.id] 
          : kpi.default;
      });
      
      setActiveKpis(initialKpis);
    }
  }, [currentStore]);

  const handleToggleKpi = (kpiId: string) => {
    setActiveKpis(prev => ({
      ...prev,
      [kpiId]: !prev[kpiId]
    }));
  };

  const handleSave = () => {
    if (currentStore) {
      updateStore(currentStore.id, {
        dashboardSettings: {
          ...currentStore.dashboardSettings,
          kpis: activeKpis
        }
      });
      onOpenChange(false);
    }
  };

  const handleResetToDefaults = () => {
    const defaultKpis: Record<string, boolean> = {};
    availableKpis.forEach(kpi => {
      defaultKpis[kpi.id] = kpi.default;
    });
    setActiveKpis(defaultKpis);
  };

  // Group KPIs by subcategory
  const primaryKpis = availableKpis.filter(kpi => kpi.subcategory === 'primary');
  const secondaryKpis = availableKpis.filter(kpi => kpi.subcategory === 'secondary');
  const advancedInsights = availableKpis.filter(kpi => kpi.subcategory === 'advanced');

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[580px]">
        <DialogHeader>
          <DialogTitle>Personalizar Dashboard</DialogTitle>
          <DialogDescription>
            Selecione os indicadores que deseja visualizar em sua Dashboard. 
            Você pode ativar ou desativar qualquer KPI ou Insight a qualquer momento.
          </DialogDescription>
        </DialogHeader>
        
        <Tabs defaultValue="kpis-principais" value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid grid-cols-3 mb-4">
            <TabsTrigger value="kpis-principais">KPIs Principais</TabsTrigger>
            <TabsTrigger value="conversoes-totais">Conversões & Totais</TabsTrigger>
            <TabsTrigger value="insights-avancados">Insights Avançados</TabsTrigger>
          </TabsList>
          
          <div className="space-y-4 py-2 max-h-[60vh] overflow-y-auto">
            <TabsContent value="kpis-principais" className="space-y-4 mt-0">
              <div className="space-y-3">
                {primaryKpis.map(kpi => (
                  <div key={kpi.id} className="flex items-center justify-between p-2 rounded-md hover:bg-muted/50">
                    <div className="flex items-center gap-2">
                      <div className="flex-shrink-0 text-primary">
                        {kpi.icon}
                      </div>
                      <TooltipProvider>
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <Label htmlFor={kpi.id} className="cursor-pointer">{kpi.name}</Label>
                          </TooltipTrigger>
                          <TooltipContent side="right">
                            <p className="max-w-[200px] text-xs">{kpi.description}</p>
                          </TooltipContent>
                        </Tooltip>
                      </TooltipProvider>
                    </div>
                    <Switch 
                      id={kpi.id}
                      checked={activeKpis[kpi.id] || false}
                      onCheckedChange={() => handleToggleKpi(kpi.id)}
                    />
                  </div>
                ))}
              </div>
            </TabsContent>
            
            <TabsContent value="conversoes-totais" className="space-y-4 mt-0">
              <div className="space-y-3">
                {secondaryKpis.map(kpi => (
                  <div key={kpi.id} className="flex items-center justify-between p-2 rounded-md hover:bg-muted/50">
                    <div className="flex items-center gap-2">
                      <div className="flex-shrink-0 text-primary">
                        {kpi.icon}
                      </div>
                      <TooltipProvider>
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <Label htmlFor={kpi.id} className="cursor-pointer">{kpi.name}</Label>
                          </TooltipTrigger>
                          <TooltipContent side="right">
                            <p className="max-w-[200px] text-xs">{kpi.description}</p>
                          </TooltipContent>
                        </Tooltip>
                      </TooltipProvider>
                    </div>
                    <Switch 
                      id={kpi.id}
                      checked={activeKpis[kpi.id] || false}
                      onCheckedChange={() => handleToggleKpi(kpi.id)}
                    />
                  </div>
                ))}
              </div>
            </TabsContent>
            
            <TabsContent value="insights-avancados" className="space-y-4 mt-0">
              <div className="space-y-3">
                {advancedInsights.map(kpi => (
                  <div key={kpi.id} className="flex items-center justify-between p-2 rounded-md hover:bg-muted/50">
                    <div className="flex items-center gap-2">
                      <div className="flex-shrink-0 text-primary">
                        {kpi.icon}
                      </div>
                      <TooltipProvider>
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <Label htmlFor={kpi.id} className="cursor-pointer">{kpi.name}</Label>
                          </TooltipTrigger>
                          <TooltipContent side="right">
                            <p className="max-w-[200px] text-xs">{kpi.description}</p>
                          </TooltipContent>
                        </Tooltip>
                      </TooltipProvider>
                    </div>
                    <Switch 
                      id={kpi.id}
                      checked={activeKpis[kpi.id] || false}
                      onCheckedChange={() => handleToggleKpi(kpi.id)}
                    />
                  </div>
                ))}
              </div>
            </TabsContent>
          </div>
        </Tabs>
        
        <DialogFooter className="flex sm:justify-between">
          <Button 
            variant="outline" 
            onClick={handleResetToDefaults}
          >
            Restaurar padrão
          </Button>
          <Button onClick={handleSave}>Salvar</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
