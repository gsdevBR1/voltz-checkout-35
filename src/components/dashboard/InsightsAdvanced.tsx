
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  TrendingUp, TrendingDown, Package, Clock, Users,
  Map, Smartphone, Monitor, Tablet, Shield, CreditCard, AlertTriangle,
  CircleDollarSign, Activity, Search, ArrowUp, ArrowDown, BrainCircuit
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { format, subDays, isAfter } from 'date-fns';

interface InsightsAdvancedProps {
  dateRange: 'today' | 'yesterday' | '7days' | '30days' | '90days' | 'custom';
  startDate: Date;
  endDate: Date;
  gateway: string;
}

export function InsightsAdvanced({ 
  dateRange, 
  startDate, 
  endDate,
  gateway 
}: InsightsAdvancedProps) {
  // Generate random data based on date filters
  const generateRandomData = () => {
    const seed = startDate.getTime() + endDate.getTime();
    const rng = () => {
      return ((Math.sin(seed * 9999) + 1) / 2) * Math.random();
    };
    
    // Intelligence data
    const projectedRevenue = Math.floor(rng() * 20000) + 5000;
    const previousMonthAverage = Math.floor(rng() * 18000) + 5000;
    const isProjectedHigher = projectedRevenue > previousMonthAverage;
    
    const todayVsYesterday = Math.floor(rng() * 30) - 15; // -15% to +15%
    const weekOverWeek = Math.floor(rng() * 20) - 5; // -5% to +15%
    
    const lowStockItems = [
      { name: 'Curso de Marketing Digital Premium', qty: Math.floor(rng() * 10) + 1 },
      { name: 'Mentoria Exclusiva 1:1', qty: Math.floor(rng() * 8) + 1 },
      { name: 'Pacote Completo Avançado', qty: Math.floor(rng() * 12) + 1 },
    ].sort((a, b) => a.qty - b.qty).slice(0, 2);
    
    // User behavior
    const averageConversionTime = Math.floor(rng() * 15) + 3; // 3-18 minutes
    const abandonmentStages = [
      { stage: 'Dados Pessoais', percentage: Math.floor(rng() * 30) + 10 },
      { stage: 'Entrega', percentage: Math.floor(rng() * 25) + 5 },
      { stage: 'Pagamento', percentage: Math.floor(rng() * 40) + 20 },
    ].sort((a, b) => b.percentage - a.percentage);
    const repeatCustomers = Math.floor(rng() * 15) + 5; // 5-20%
    
    // Origin performance
    const topCampaigns = [
      { name: 'black_friday', conversions: Math.floor(rng() * 100) + 50 },
      { name: 'instagram_stories', conversions: Math.floor(rng() * 90) + 40 },
      { name: 'email_promo', conversions: Math.floor(rng() * 80) + 30 },
      { name: 'facebook_ads', conversions: Math.floor(rng() * 70) + 20 },
    ].sort((a, b) => b.conversions - a.conversions);
    
    const abTestResults = {
      variantA: { conversions: Math.floor(rng() * 100) + 100, rate: Math.floor(rng() * 10) + 5 },
      variantB: { conversions: Math.floor(rng() * 100) + 100, rate: Math.floor(rng() * 10) + 5 },
    };
    const abWinner = abTestResults.variantA.rate > abTestResults.variantB.rate ? 'A' : 'B';
    
    // Audience and device
    const topRegions = [
      { name: 'São Paulo', sales: Math.floor(rng() * 300) + 200 },
      { name: 'Rio de Janeiro', sales: Math.floor(rng() * 200) + 150 },
      { name: 'Minas Gerais', sales: Math.floor(rng() * 150) + 100 },
      { name: 'Paraná', sales: Math.floor(rng() * 100) + 80 },
      { name: 'Rio Grande do Sul', sales: Math.floor(rng() * 90) + 70 },
    ].sort((a, b) => b.sales - a.sales);
    
    const deviceData = {
      mobile: Math.floor(rng() * 60) + 30, // 30-90%
      desktop: Math.floor(rng() * 40) + 10, // 10-50%
      tablet: Math.floor(rng() * 15) + 2, // 2-17%
    };
    
    // Normalize device percentages to sum 100%
    const deviceTotal = deviceData.mobile + deviceData.desktop + deviceData.tablet;
    deviceData.mobile = Math.round((deviceData.mobile / deviceTotal) * 100);
    deviceData.desktop = Math.round((deviceData.desktop / deviceTotal) * 100);
    deviceData.tablet = 100 - deviceData.mobile - deviceData.desktop;
    
    // Security
    const declinedCards = Math.floor(rng() * 50) + 10;
    const declinedReasons = [
      { reason: 'Saldo Insuficiente', count: Math.floor(rng() * 30) + 5 },
      { reason: 'Cartão Expirado', count: Math.floor(rng() * 15) + 3 },
      { reason: 'Dados Inválidos', count: Math.floor(rng() * 10) + 2 },
    ].sort((a, b) => b.count - a.count);
    
    const chargebackAlerts = Math.floor(rng() * 8) + 1;
    const fraudAlerts = Math.floor(rng() * 5);
    const totalAlerts = chargebackAlerts + fraudAlerts;
    
    return {
      intelligence: {
        projectedRevenue,
        previousMonthAverage,
        isProjectedHigher,
        todayVsYesterday,
        weekOverWeek, 
        lowStockItems
      },
      behavior: {
        averageConversionTime,
        abandonmentStages,
        repeatCustomers
      },
      origin: {
        topCampaigns,
        abTest: {
          ...abTestResults,
          winner: abWinner
        }
      },
      audience: {
        topRegions,
        deviceData
      },
      security: {
        declinedCards,
        declinedReasons,
        chargebackAlerts,
        fraudAlerts,
        totalAlerts
      }
    };
  };
  
  const data = generateRandomData();
  
  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(value);
  };
  
  const getNextMonthEnd = () => {
    const today = new Date();
    const nextMonth = new Date(today.getFullYear(), today.getMonth() + 1, 0);
    return format(nextMonth, 'dd/MM');
  };
  
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold flex items-center gap-2">
          <Activity className="h-6 w-6 text-primary" />
          📊 Insights Avançados
        </h2>
      </div>
      
      {/* Inteligência Comercial */}
      <div className="space-y-3">
        <h3 className="text-lg font-semibold flex items-center gap-2">
          <BrainCircuit className="h-5 w-5 text-primary" />
          🧩 Inteligência Comercial
        </h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {/* Projeção de Faturamento */}
          <Card>
            <CardHeader className="py-3">
              <CardTitle className="text-sm font-medium flex items-center gap-2">
                <CircleDollarSign className="h-4 w-4 text-primary" />
                Projeção de Faturamento do Mês
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex flex-col gap-1">
                <div className={cn(
                  "text-2xl font-bold",
                  data.intelligence.isProjectedHigher ? "text-green-600 dark:text-green-500" : "text-red-600 dark:text-red-500"
                )}>
                  {formatCurrency(data.intelligence.projectedRevenue)}
                </div>
                <p className="text-xs text-muted-foreground">
                  previstos até {getNextMonthEnd()}
                </p>
                <div className={cn(
                  "flex items-center gap-1 mt-1 text-sm",
                  data.intelligence.isProjectedHigher ? "text-green-600 dark:text-green-500" : "text-red-600 dark:text-red-500"
                )}>
                  {data.intelligence.isProjectedHigher ? (
                    <ArrowUp className="h-4 w-4" />
                  ) : (
                    <ArrowDown className="h-4 w-4" />
                  )}
                  <span>
                    {data.intelligence.isProjectedHigher ? "+" : "-"}
                    {Math.abs(Math.round((data.intelligence.projectedRevenue - data.intelligence.previousMonthAverage) / 
                    data.intelligence.previousMonthAverage * 100))}% vs. mês anterior
                  </span>
                </div>
              </div>
            </CardContent>
          </Card>
          
          {/* Variação Percentual */}
          <Card>
            <CardHeader className="py-3">
              <CardTitle className="text-sm font-medium flex items-center gap-2">
                {data.intelligence.todayVsYesterday >= 0 ? (
                  <TrendingUp className="h-4 w-4 text-green-600 dark:text-green-500" />
                ) : (
                  <TrendingDown className="h-4 w-4 text-red-600 dark:text-red-500" />
                )}
                Variação Percentual
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="flex flex-col">
                  <div className={cn(
                    "flex items-center text-lg font-bold",
                    data.intelligence.todayVsYesterday >= 0 ? "text-green-600 dark:text-green-500" : "text-red-600 dark:text-red-500"
                  )}>
                    {data.intelligence.todayVsYesterday >= 0 ? (
                      <ArrowUp className="h-4 w-4 mr-1" />
                    ) : (
                      <ArrowDown className="h-4 w-4 mr-1" />
                    )}
                    {data.intelligence.todayVsYesterday >= 0 ? "+" : ""}
                    {data.intelligence.todayVsYesterday}%
                  </div>
                  <p className="text-xs text-muted-foreground">
                    comparado a ontem
                  </p>
                </div>
                
                <div className="flex flex-col">
                  <div className={cn(
                    "flex items-center text-lg font-bold",
                    data.intelligence.weekOverWeek >= 0 ? "text-green-600 dark:text-green-500" : "text-red-600 dark:text-red-500"
                  )}>
                    {data.intelligence.weekOverWeek >= 0 ? (
                      <ArrowUp className="h-4 w-4 mr-1" />
                    ) : (
                      <ArrowDown className="h-4 w-4 mr-1" />
                    )}
                    {data.intelligence.weekOverWeek >= 0 ? "+" : ""}
                    {data.intelligence.weekOverWeek}%
                  </div>
                  <p className="text-xs text-muted-foreground">
                    comparado à mesma data da semana passada
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
          
          {/* Estoque Crítico */}
          <Card>
            <CardHeader className="py-3">
              <CardTitle className="text-sm font-medium flex items-center gap-2">
                <Package className="h-4 w-4 text-orange-500" />
                Estoque Crítico
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                {data.intelligence.lowStockItems.length > 0 ? (
                  data.intelligence.lowStockItems.map((item, index) => (
                    <div key={index} className="flex items-start gap-2 py-1 border-b border-border last:border-0">
                      <AlertTriangle className="h-4 w-4 text-orange-500 mt-0.5 shrink-0" />
                      <div>
                        <p className="text-sm font-medium truncate">{item.name}</p>
                        <p className="text-xs text-red-600 dark:text-red-500">
                          Apenas {item.qty} unid. restantes
                        </p>
                      </div>
                    </div>
                  ))
                ) : (
                  <p className="text-sm text-muted-foreground">
                    Todos os produtos com estoque adequado
                  </p>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
      
      {/* Comportamento de Usuário */}
      <div className="space-y-3">
        <h3 className="text-lg font-semibold flex items-center gap-2">
          <Users className="h-5 w-5 text-primary" />
          🧠 Comportamento de Usuário
        </h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {/* Tempo Médio até Conversão */}
          <Card>
            <CardHeader className="py-3">
              <CardTitle className="text-sm font-medium flex items-center gap-2">
                <Clock className="h-4 w-4 text-primary" />
                Tempo Médio até Conversão
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex flex-col gap-1">
                <div className="text-2xl font-bold">
                  {data.behavior.averageConversionTime} min
                </div>
                <p className="text-xs text-muted-foreground">
                  entre entrada no checkout e pagamento
                </p>
                
                <div className="w-full h-2 bg-muted/30 rounded-full mt-2">
                  <div 
                    className="h-full bg-primary rounded-full"
                    style={{ 
                      width: `${Math.min(100, data.behavior.averageConversionTime * 6)}%`
                    }}
                  ></div>
                </div>
                <p className="text-xs text-muted-foreground mt-1">
                  Média do período selecionado
                </p>
              </div>
            </CardContent>
          </Card>
          
          {/* Etapa de Abandono */}
          <Card>
            <CardHeader className="py-3">
              <CardTitle className="text-sm font-medium flex items-center gap-2">
                <Activity className="h-4 w-4 text-primary" />
                Etapa de Abandono Mais Comum
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {data.behavior.abandonmentStages.slice(0, 1).map((stage, index) => (
                  <div key={index} className="space-y-1">
                    <div className="flex justify-between items-center">
                      <span className="font-medium">{stage.stage}</span>
                      <span className="text-red-600 dark:text-red-500 font-bold">{stage.percentage}%</span>
                    </div>
                    <div className="w-full h-2 bg-muted/30 rounded-full">
                      <div 
                        className="h-full bg-red-600 dark:bg-red-500 rounded-full"
                        style={{ width: `${stage.percentage}%` }}
                      ></div>
                    </div>
                    <p className="text-xs text-muted-foreground italic">
                      "{stage.percentage}% saíram aqui"
                    </p>
                  </div>
                ))}
                
                <div className="mt-2 pt-2 border-t border-border">
                  <p className="text-xs font-medium">Outros abandonos:</p>
                  {data.behavior.abandonmentStages.slice(1).map((stage, index) => (
                    <div key={index} className="flex justify-between text-xs mt-1">
                      <span>{stage.stage}</span>
                      <span>{stage.percentage}%</span>
                    </div>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>
          
          {/* Clientes com Recompra */}
          <Card>
            <CardHeader className="py-3">
              <CardTitle className="text-sm font-medium flex items-center gap-2">
                <Users className="h-4 w-4 text-primary" />
                Clientes com Recompra
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex flex-col gap-2">
                <div className="text-2xl font-bold">
                  {data.behavior.repeatCustomers}%
                </div>
                <p className="text-xs text-muted-foreground">
                  fizeram mais de uma compra
                </p>
                
                <div className="flex items-center gap-1 mt-2">
                  <div className="flex-1 h-3 bg-muted rounded-l-full overflow-hidden">
                    <div 
                      className="h-full bg-primary/30"
                      style={{ width: `${100 - data.behavior.repeatCustomers}%` }}
                    ></div>
                  </div>
                  <div className="flex-1 h-3 bg-muted rounded-r-full overflow-hidden">
                    <div 
                      className="h-full bg-primary"
                      style={{ width: `${data.behavior.repeatCustomers}%` }}
                    ></div>
                  </div>
                </div>
                
                <div className="flex justify-between text-xs text-muted-foreground mt-1">
                  <span>Compra única</span>
                  <span>Recompra</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
      
      {/* Performance por Origem */}
      <div className="space-y-3">
        <h3 className="text-lg font-semibold flex items-center gap-2">
          <Search className="h-5 w-5 text-primary" />
          🎯 Performance por Origem
        </h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Melhor Campanha */}
          <Card>
            <CardHeader className="py-3">
              <CardTitle className="text-sm font-medium flex items-center gap-2">
                <TrendingUp className="h-4 w-4 text-primary" />
                Melhor Campanha (UTM)
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {data.origin.topCampaigns.slice(0, 1).map((campaign, index) => (
                  <div key={index} className="rounded-lg bg-[#f0f9f0] dark:bg-green-950/20 p-3 border-l-4 border-primary">
                    <div className="flex justify-between items-center">
                      <div className="font-medium">{campaign.name}</div>
                      <div className="text-primary font-bold">{campaign.conversions} conversões</div>
                    </div>
                    <p className="text-xs text-muted-foreground mt-1">
                      Campanha com melhor desempenho no período
                    </p>
                  </div>
                ))}
                
                <div className="mt-2">
                  <p className="text-xs font-medium mb-2">Outras campanhas:</p>
                  {data.origin.topCampaigns.slice(1, 3).map((campaign, index) => (
                    <div key={index} className="flex justify-between text-sm py-1 border-b border-border last:border-0">
                      <span>{campaign.name}</span>
                      <span className="font-medium">{campaign.conversions}</span>
                    </div>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>
          
          {/* Teste A/B */}
          <Card>
            <CardHeader className="py-3">
              <CardTitle className="text-sm font-medium flex items-center gap-2">
                <Activity className="h-4 w-4 text-primary" />
                Teste A/B
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="bg-[#eef3fc] dark:bg-blue-950/20 p-3 rounded-lg">
                  <div className="flex justify-between items-center">
                    <div className="font-medium">Variante {data.origin.abTest.winner}</div>
                    <div className="text-blue-600 dark:text-blue-400 font-bold">
                      {data.origin.abTest.winner === 'A' 
                        ? data.origin.abTest.variantA.rate 
                        : data.origin.abTest.variantB.rate}% conversão
                    </div>
                  </div>
                  <div className="flex items-center gap-1 mt-2">
                    <span className="text-xs bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-300 px-2 py-0.5 rounded">
                      VENCEDOR
                    </span>
                  </div>
                </div>
                
                <div className="flex gap-3 mt-3">
                  <div className="flex-1 bg-muted/30 p-3 rounded-lg">
                    <div className="flex justify-between items-center">
                      <div className="font-medium">Variante A</div>
                      <div className="font-bold">{data.origin.abTest.variantA.rate}%</div>
                    </div>
                    <p className="text-xs text-muted-foreground mt-1">
                      {data.origin.abTest.variantA.conversions} conversões
                    </p>
                  </div>
                  
                  <div className="flex-1 bg-muted/30 p-3 rounded-lg">
                    <div className="flex justify-between items-center">
                      <div className="font-medium">Variante B</div>
                      <div className="font-bold">{data.origin.abTest.variantB.rate}%</div>
                    </div>
                    <p className="text-xs text-muted-foreground mt-1">
                      {data.origin.abTest.variantB.conversions} conversões
                    </p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
      
      {/* Público & Dispositivo */}
      <div className="space-y-3">
        <h3 className="text-lg font-semibold flex items-center gap-2">
          <Users className="h-5 w-5 text-primary" />
          🧑‍💼 Público & Dispositivo
        </h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Regiões */}
          <Card>
            <CardHeader className="py-3">
              <CardTitle className="text-sm font-medium flex items-center gap-2">
                <Map className="h-4 w-4 text-primary" />
                Regiões com Mais Compras
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                {data.audience.topRegions.slice(0, 3).map((region, index) => (
                  <div key={index} className="flex items-center justify-between py-1 border-b border-border last:border-0">
                    <div className="flex items-center gap-2">
                      <div className={cn(
                        "w-5 h-5 rounded-full flex items-center justify-center text-xs font-bold",
                        index === 0 ? "bg-yellow-200 text-yellow-800" :
                        index === 1 ? "bg-gray-200 text-gray-800" :
                        "bg-orange-200 text-orange-800"
                      )}>
                        {index + 1}
                      </div>
                      <span>{region.name}</span>
                    </div>
                    <span className="font-medium">{region.sales} vendas</span>
                  </div>
                ))}
                
                <p className="text-xs text-muted-foreground mt-1">
                  Top estados com mais vendas no período
                </p>
              </div>
            </CardContent>
          </Card>
          
          {/* Dispositivo */}
          <Card>
            <CardHeader className="py-3">
              <CardTitle className="text-sm font-medium flex items-center gap-2">
                <Smartphone className="h-4 w-4 text-primary" />
                Dispositivo
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Smartphone className="h-4 w-4 text-primary" />
                    <span>Mobile</span>
                  </div>
                  <span className="font-bold">{data.audience.deviceData.mobile}%</span>
                </div>
                <div className="w-full h-2 bg-muted/30 rounded-full">
                  <div 
                    className="h-full bg-primary rounded-full"
                    style={{ width: `${data.audience.deviceData.mobile}%` }}
                  ></div>
                </div>
                
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Desktop className="h-4 w-4 text-blue-600" />
                    <span>Desktop</span>
                  </div>
                  <span className="font-bold">{data.audience.deviceData.desktop}%</span>
                </div>
                <div className="w-full h-2 bg-muted/30 rounded-full">
                  <div 
                    className="h-full bg-blue-600 rounded-full"
                    style={{ width: `${data.audience.deviceData.desktop}%` }}
                  ></div>
                </div>
                
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Tablet className="h-4 w-4 text-purple-600" />
                    <span>Tablet</span>
                  </div>
                  <span className="font-bold">{data.audience.deviceData.tablet}%</span>
                </div>
                <div className="w-full h-2 bg-muted/30 rounded-full">
                  <div 
                    className="h-full bg-purple-600 rounded-full"
                    style={{ width: `${data.audience.deviceData.tablet}%` }}
                  ></div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
      
      {/* Segurança */}
      <div className="space-y-3">
        <h3 className="text-lg font-semibold flex items-center gap-2">
          <Shield className="h-5 w-5 text-primary" />
          🛡️ Segurança
        </h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Cartões Recusados */}
          <Card>
            <CardHeader className="py-3">
              <CardTitle className="text-sm font-medium flex items-center gap-2">
                <CreditCard className="h-4 w-4 text-primary" />
                Cartões Recusados
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <div className="text-2xl font-bold">{data.security.declinedCards}</div>
                <p className="text-xs text-muted-foreground">
                  transações recusadas no período
                </p>
                
                <div className="space-y-2 mt-3">
                  {data.security.declinedReasons.map((reason, index) => (
                    <div key={index} className="flex justify-between items-center text-sm py-1 border-b border-border last:border-0">
                      <span>{reason.reason}</span>
                      <span className="font-medium">{reason.count}</span>
                    </div>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>
          
          {/* Alertas de Chargeback */}
          <Card>
            <CardHeader className="py-3">
              <CardTitle className="text-sm font-medium flex items-center gap-2">
                <AlertTriangle className="h-4 w-4 text-orange-500" />
                Alertas de Chargeback ou MED
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex gap-3">
                  <div className="flex-1 bg-orange-50 dark:bg-orange-950/20 p-3 rounded-lg border-l-4 border-orange-500">
                    <div className="font-medium">Chargebacks</div>
                    <div className="text-2xl font-bold text-orange-600 dark:text-orange-500">
                      {data.security.chargebackAlerts}
                    </div>
                  </div>
                  
                  <div className="flex-1 bg-red-50 dark:bg-red-950/20 p-3 rounded-lg border-l-4 border-red-500">
                    <div className="font-medium">Fraude</div>
                    <div className="text-2xl font-bold text-red-600 dark:text-red-500">
                      {data.security.fraudAlerts}
                    </div>
                  </div>
                </div>
                
                <button className="w-full py-2 px-3 bg-muted hover:bg-muted/80 text-sm font-medium rounded-md flex items-center justify-center gap-1">
                  <Shield className="h-4 w-4" />
                  Ver detalhes dos {data.security.totalAlerts} alertas
                </button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
