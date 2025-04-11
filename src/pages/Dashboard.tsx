
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { ChartContainer, ChartTooltip, ChartTooltipContent } from '@/components/ui/chart';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { SidebarLayout } from '@/components/Sidebar';
import { Calendar, CreditCard, DollarSign, BarChart2, PieChart, Users, ArrowUpRight, 
         TrendingUp, Activity, Percent, Package, ShoppingCart } from 'lucide-react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
         BarChart, Bar, Legend, PieChart as RechartPieChart, Pie, Cell } from 'recharts';
import { format, subDays } from 'date-fns';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Calendar as CalendarComponent } from '@/components/ui/calendar';
import { cn } from '@/lib/utils';
import { ThemeToggle } from '@/components/ThemeToggle';

// Mock data generation functions
const generateRandomData = (days: number, min: number, max: number) => {
  return Array.from({ length: days }).map((_, i) => {
    const date = subDays(new Date(), days - i - 1);
    return {
      date: format(date, 'dd/MM'),
      value: Math.floor(Math.random() * (max - min + 1)) + min,
    };
  });
};

const generateFunnelData = () => {
  const initial = Math.floor(Math.random() * 500) + 1000;
  const personalData = Math.floor(initial * (Math.random() * 0.2 + 0.7));
  const delivery = Math.floor(personalData * (Math.random() * 0.2 + 0.7));
  const payment = Math.floor(delivery * (Math.random() * 0.2 + 0.7));
  const pixGenerated = Math.floor(payment * (Math.random() * 0.2 + 0.7));
  const purchased = Math.floor(pixGenerated * (Math.random() * 0.2 + 0.7));
  
  return [
    { name: 'Checkout', value: initial, percentage: 100 },
    { name: 'Dados Pessoais', value: personalData, percentage: Math.round((personalData / initial) * 100) },
    { name: 'Entrega', value: delivery, percentage: Math.round((delivery / initial) * 100) },
    { name: 'Pagamento', value: payment, percentage: Math.round((payment / initial) * 100) },
    { name: 'Gerou Pix', value: pixGenerated, percentage: Math.round((pixGenerated / initial) * 100) },
    { name: 'Comprou', value: purchased, percentage: Math.round((purchased / initial) * 100) },
  ];
};

const generatePaymentMethodData = () => {
  const pixTotal = Math.floor(Math.random() * 10000) + 5000;
  const pixCount = Math.floor(Math.random() * 100) + 50;
  const pixConversion = Math.floor(Math.random() * 30) + 40;
  
  const creditTotal = Math.floor(Math.random() * 15000) + 10000;
  const creditCount = Math.floor(Math.random() * 150) + 100;
  const creditConversion = Math.floor(Math.random() * 20) + 30;
  
  const boletoTotal = Math.floor(Math.random() * 5000) + 2000;
  const boletoCount = Math.floor(Math.random() * 50) + 20;
  const boletoConversion = Math.floor(Math.random() * 15) + 10;
  
  return {
    pix: { total: pixTotal, count: pixCount, conversion: pixConversion },
    credit: { total: creditTotal, count: creditCount, conversion: creditConversion },
    boleto: { total: boletoTotal, count: boletoCount, conversion: boletoConversion },
  };
};

const generateTopProducts = () => {
  const products = [
    { name: 'Curso de Marketing Digital', type: 'principal', total: Math.floor(Math.random() * 5000) + 10000 },
    { name: 'E-book de SEO', type: 'upsell', total: Math.floor(Math.random() * 3000) + 5000 },
    { name: 'Consultoria Express', type: 'orderbump', total: Math.floor(Math.random() * 2000) + 3000 },
    { name: 'Mentoria Avançada', type: 'principal', total: Math.floor(Math.random() * 4000) + 8000 },
    { name: 'Templates Premium', type: 'upsell', total: Math.floor(Math.random() * 1500) + 2000 },
  ];
  
  return products.sort((a, b) => b.total - a.total);
};

const generateTopUtms = () => {
  const utms = [
    { campaign: 'black_friday', total: Math.floor(Math.random() * 500) + 600 },
    { campaign: 'instagram_stories', total: Math.floor(Math.random() * 400) + 500 },
    { campaign: 'email_promo', total: Math.floor(Math.random() * 300) + 400 },
    { campaign: 'facebook_ads', total: Math.floor(Math.random() * 250) + 300 },
    { campaign: 'youtube_channel', total: Math.floor(Math.random() * 200) + 250 },
    { campaign: 'affiliate_links', total: Math.floor(Math.random() * 150) + 200 },
  ];
  
  return utms.sort((a, b) => b.total - a.total);
};

const pieColors = ['#4ade80', '#8b5cf6', '#f43f5e', '#f59e0b', '#3b82f6'];

const Dashboard = () => {
  const [dateRange, setDateRange] = useState<'today' | 'yesterday' | '7days' | '30days' | '90days' | 'custom'>('7days');
  const [startDate, setStartDate] = useState<Date>(subDays(new Date(), 7));
  const [endDate, setEndDate] = useState<Date>(new Date());
  const [gateway, setGateway] = useState<string>('all');
  const [chartMetric, setChartMetric] = useState<string>('faturamentoLiquido');
  const [chartData, setChartData] = useState(generateRandomData(7, 5000, 20000));
  const [kpiData, setKpiData] = useState({
    faturamento: Math.floor(Math.random() * 10000) + 10000,
    transacoes: Math.floor(Math.random() * 100) + 100,
    ticketMedio: 0,
    conversaoCheckout: Math.floor(Math.random() * 20) + 60,
    conversaoGateway: Math.floor(Math.random() * 20) + 40,
  });
  const [realtimeData, setRealtimeData] = useState(generateFunnelData());
  const [funnelData, setFunnelData] = useState(generateFunnelData());
  const [paymentData, setPaymentData] = useState(generatePaymentMethodData());
  const [topProducts, setTopProducts] = useState(generateTopProducts());
  const [topUtms, setTopUtms] = useState(generateTopUtms());
  
  // Calculate ticket medio when transacoes changes
  useEffect(() => {
    setKpiData(prev => ({
      ...prev,
      ticketMedio: prev.transacoes > 0 
        ? Math.round(prev.faturamento / prev.transacoes) 
        : 0
    }));
  }, [kpiData.faturamento, kpiData.transacoes]);
  
  // Update data when filters change
  useEffect(() => {
    let days = 7;
    
    switch(dateRange) {
      case 'today':
        days = 1;
        break;
      case 'yesterday':
        days = 1;
        break;
      case '7days':
        days = 7;
        break;
      case '30days':
        days = 30;
        break;
      case '90days':
        days = 90;
        break;
      case 'custom':
        // Calculate days between startDate and endDate
        const diffTime = Math.abs(endDate.getTime() - startDate.getTime());
        days = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
        break;
    }
    
    // Update chart data based on filters
    setChartData(generateRandomData(days, 5000, 20000));
    
    // Update KPIs
    setKpiData({
      faturamento: Math.floor(Math.random() * 10000 * days/7) + 10000,
      transacoes: Math.floor(Math.random() * 100 * days/7) + 100,
      conversaoCheckout: Math.floor(Math.random() * 20) + 60,
      conversaoGateway: Math.floor(Math.random() * 20) + 40,
      ticketMedio: 0, // Will be calculated in the useEffect above
    });
    
    // Update other data
    setFunnelData(generateFunnelData());
    setPaymentData(generatePaymentMethodData());
    setTopProducts(generateTopProducts());
    setTopUtms(generateTopUtms());
  }, [dateRange, gateway, startDate, endDate]);
  
  // Simulate realtime updates
  useEffect(() => {
    const interval = setInterval(() => {
      setRealtimeData(generateFunnelData());
    }, 10 * 60 * 1000); // Update every 10 minutes
    
    return () => clearInterval(interval);
  }, []);
  
  const handleDateRangeChange = (value: string) => {
    setDateRange(value as any);
    
    const today = new Date();
    switch(value) {
      case 'today':
        setStartDate(today);
        setEndDate(today);
        break;
      case 'yesterday':
        const yesterday = subDays(today, 1);
        setStartDate(yesterday);
        setEndDate(yesterday);
        break;
      case '7days':
        setStartDate(subDays(today, 7));
        setEndDate(today);
        break;
      case '30days':
        setStartDate(subDays(today, 30));
        setEndDate(today);
        break;
      case '90days':
        setStartDate(subDays(today, 90));
        setEndDate(today);
        break;
      // custom will be handled by the date picker
    }
  };
  
  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(value);
  };
  
  const getDateRangeLabel = () => {
    switch(dateRange) {
      case 'today':
        return 'Hoje';
      case 'yesterday':
        return 'Ontem';
      case '7days':
        return 'Últimos 7 dias';
      case '30days':
        return 'Últimos 30 dias';
      case '90days':
        return 'Últimos 90 dias';
      case 'custom':
        return `${format(startDate, 'dd/MM/yyyy')} - ${format(endDate, 'dd/MM/yyyy')}`;
    }
  };
  
  const getChartMetricLabel = () => {
    const metrics: Record<string, string> = {
      faturamentoBruto: 'Faturamento Bruto',
      faturamentoLiquido: 'Faturamento Líquido',
      pixGerados: 'Quantidade de Pix gerados',
      pixPagos: 'Quantidade de Pix pagos',
      carrinhosAbandonados: 'Carrinhos abandonados',
      aprovacaoCredito: 'Aprovação no Crédito',
      chargebacks: 'Chargebacks'
    };
    
    return metrics[chartMetric] || 'Faturamento Líquido';
  };
  
  return (
    <SidebarLayout>
      <div className="min-h-screen bg-background">
        <header className="bg-card border-b border-border sticky top-0 z-10">
          <div className="container mx-auto px-4 py-4">
            <div className="flex items-center justify-between">
              <h1 className="text-xl font-bold text-primary">Dashboard</h1>
              <div className="flex items-center gap-4">
                <ThemeToggle />
              </div>
            </div>
          </div>
        </header>
        
        <main className="container mx-auto px-4 py-6">
          {/* Section 1: KPIs */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4 mb-6">
            <Card>
              <CardHeader className="py-3">
                <CardTitle className="text-sm flex items-center gap-2">
                  <DollarSign className="h-4 w-4 text-primary" />
                  Faturamento
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{formatCurrency(kpiData.faturamento)}</div>
                <p className="text-xs text-muted-foreground">Vendas aprovadas</p>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="py-3">
                <CardTitle className="text-sm flex items-center gap-2">
                  <ShoppingCart className="h-4 w-4 text-primary" />
                  Transações
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{kpiData.transacoes}</div>
                <p className="text-xs text-muted-foreground">Vendas aprovadas</p>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="py-3">
                <CardTitle className="text-sm flex items-center gap-2">
                  <CreditCard className="h-4 w-4 text-primary" />
                  Ticket Médio
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{formatCurrency(kpiData.ticketMedio)}</div>
                <p className="text-xs text-muted-foreground">Valor médio por venda</p>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="py-3">
                <CardTitle className="text-sm flex items-center gap-2">
                  <TrendingUp className="h-4 w-4 text-primary" />
                  Conversão Checkout
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{kpiData.conversaoCheckout}%</div>
                <p className="text-xs text-muted-foreground">Pix gerados</p>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="py-3">
                <CardTitle className="text-sm flex items-center gap-2">
                  <Percent className="h-4 w-4 text-primary" />
                  Conversão Gateway
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{kpiData.conversaoGateway}%</div>
                <p className="text-xs text-muted-foreground">Pix pagos</p>
              </CardContent>
            </Card>
          </div>
          
          {/* Section 2: Filters */}
          <Card className="mb-6">
            <CardContent className="py-4">
              <div className="flex flex-col md:flex-row gap-4 items-start md:items-center">
                <div className="w-full md:w-auto">
                  <label className="text-sm font-medium mb-1 block">Gateway</label>
                  <Select value={gateway} onValueChange={setGateway}>
                    <SelectTrigger className="w-full md:w-[180px]">
                      <SelectValue placeholder="Selecione o gateway" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">Todos</SelectItem>
                      <SelectItem value="pagarme">Pagar.me</SelectItem>
                      <SelectItem value="mercadopago">MercadoPago</SelectItem>
                      <SelectItem value="iugu">Iugu</SelectItem>
                      <SelectItem value="shopify">Shopify Payments</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="w-full md:w-auto">
                  <label className="text-sm font-medium mb-1 block">Período</label>
                  <div className="flex gap-2 flex-wrap">
                    <Button 
                      size="sm" 
                      variant={dateRange === 'today' ? 'default' : 'outline'}
                      onClick={() => handleDateRangeChange('today')}
                    >
                      Hoje
                    </Button>
                    <Button 
                      size="sm" 
                      variant={dateRange === 'yesterday' ? 'default' : 'outline'}
                      onClick={() => handleDateRangeChange('yesterday')}
                    >
                      Ontem
                    </Button>
                    <Button 
                      size="sm" 
                      variant={dateRange === '7days' ? 'default' : 'outline'}
                      onClick={() => handleDateRangeChange('7days')}
                    >
                      7 dias
                    </Button>
                    <Button 
                      size="sm" 
                      variant={dateRange === '30days' ? 'default' : 'outline'}
                      onClick={() => handleDateRangeChange('30days')}
                    >
                      30 dias
                    </Button>
                    <Button 
                      size="sm" 
                      variant={dateRange === '90days' ? 'default' : 'outline'}
                      onClick={() => handleDateRangeChange('90days')}
                    >
                      90 dias
                    </Button>
                    
                    <Popover>
                      <PopoverTrigger asChild>
                        <Button 
                          size="sm" 
                          variant={dateRange === 'custom' ? 'default' : 'outline'}
                          className="flex gap-2 items-center"
                        >
                          <Calendar className="h-4 w-4" />
                          Personalizado
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0" align="start">
                        <div className="px-4 py-2 border-b border-border">
                          <h4 className="text-sm font-medium">Selecione o período</h4>
                        </div>
                        <div className="p-4">
                          <div className="flex gap-2 mb-2">
                            <div>
                              <p className="text-xs mb-1">Data inicial</p>
                              <CalendarComponent
                                mode="single"
                                selected={startDate}
                                onSelect={(date) => {
                                  if (date) {
                                    setStartDate(date);
                                    setDateRange('custom');
                                  }
                                }}
                                initialFocus
                              />
                            </div>
                            <div>
                              <p className="text-xs mb-1">Data final</p>
                              <CalendarComponent
                                mode="single"
                                selected={endDate}
                                onSelect={(date) => {
                                  if (date) {
                                    setEndDate(date);
                                    setDateRange('custom');
                                  }
                                }}
                                initialFocus
                              />
                            </div>
                          </div>
                        </div>
                      </PopoverContent>
                    </Popover>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
          
          {/* Section 3: Dynamic Chart */}
          <Card className="mb-6">
            <CardHeader className="py-4 flex flex-row items-center justify-between">
              <CardTitle className="flex items-center gap-2">
                <BarChart2 className="h-5 w-5 text-primary" />
                {getChartMetricLabel()}
                <span className="text-xs font-normal text-muted-foreground ml-2">
                  {getDateRangeLabel()}
                </span>
              </CardTitle>
              <Select value={chartMetric} onValueChange={setChartMetric}>
                <SelectTrigger className="w-[220px]">
                  <SelectValue placeholder="Selecione a métrica" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="faturamentoBruto">Faturamento Bruto</SelectItem>
                  <SelectItem value="faturamentoLiquido">Faturamento Líquido</SelectItem>
                  <SelectItem value="pixGerados">Quantidade de Pix gerados</SelectItem>
                  <SelectItem value="pixPagos">Quantidade de Pix pagos</SelectItem>
                  <SelectItem value="carrinhosAbandonados">Carrinhos abandonados</SelectItem>
                  <SelectItem value="aprovacaoCredito">Aprovação no Crédito</SelectItem>
                  <SelectItem value="chargebacks">Chargebacks</SelectItem>
                </SelectContent>
              </Select>
            </CardHeader>
            <CardContent className="pt-0">
              <div className="h-80">
                <ChartContainer config={{ data: { theme: { light: '#3b82f6', dark: '#60a5fa' } } }}>
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={chartData} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
                      <defs>
                        <linearGradient id="colorValue" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="hsl(var(--primary))" stopOpacity={0.8}/>
                          <stop offset="95%" stopColor="hsl(var(--primary))" stopOpacity={0}/>
                        </linearGradient>
                      </defs>
                      <XAxis dataKey="date" />
                      <YAxis />
                      <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                      <ChartTooltip content={<ChartTooltipContent />} />
                      <Area 
                        type="monotone" 
                        dataKey="value" 
                        stroke="hsl(var(--primary))" 
                        fillOpacity={1} 
                        fill="url(#colorValue)" 
                      />
                    </AreaChart>
                  </ResponsiveContainer>
                </ChartContainer>
              </div>
            </CardContent>
          </Card>
          
          {/* Section 4: Realtime Behavior */}
          <Card className="mb-6">
            <CardHeader className="py-4">
              <CardTitle className="flex items-center gap-2">
                <Activity className="h-5 w-5 text-primary" />
                Comportamento em Tempo Real
                <span className="text-xs font-normal text-muted-foreground ml-2">
                  Últimos 10 minutos
                </span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {realtimeData.map((step) => (
                  <div key={step.name} className="space-y-1">
                    <div className="flex justify-between text-sm">
                      <span>{step.name}</span>
                      <span className="font-medium">{step.value}</span>
                    </div>
                    <Progress value={step.percentage} className="h-2" />
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
          
          {/* Section 5: Conversion Funnel */}
          <Card className="mb-6">
            <CardHeader className="py-4">
              <CardTitle className="flex items-center gap-2">
                <PieChart className="h-5 w-5 text-primary" />
                Funil de Conversão
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="flex flex-col">
                  <div className="grid grid-cols-3 gap-2 text-sm font-medium mb-3 text-muted-foreground">
                    <div>Etapa</div>
                    <div className="text-right">Quantidade</div>
                    <div className="text-right">Conversão</div>
                  </div>
                  {funnelData.map((step) => (
                    <div key={step.name} className="grid grid-cols-3 gap-2 py-2 border-t border-border text-sm">
                      <div>{step.name}</div>
                      <div className="text-right">{step.value}</div>
                      <div className="text-right">{step.percentage}%</div>
                    </div>
                  ))}
                </div>
                
                <div className="h-80 flex items-center justify-center">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart
                      layout="vertical"
                      data={[...funnelData].reverse()}
                      margin={{ top: 20, right: 30, left: 50, bottom: 5 }}
                    >
                      <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                      <XAxis type="number" />
                      <YAxis type="category" dataKey="name" />
                      <Tooltip formatter={(value) => [`${value}`, 'Quantidade']} />
                      <Bar dataKey="value" fill="hsl(var(--primary))" radius={[0, 4, 4, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </div>
            </CardContent>
          </Card>
          
          {/* Section 6: Payment Methods Conversion */}
          <Card className="mb-6">
            <CardHeader className="py-4">
              <CardTitle className="flex items-center gap-2">
                <CreditCard className="h-5 w-5 text-primary" />
                Conversão por Método de Pagamento
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <Card className="bg-card/50 shadow-none">
                  <CardHeader className="py-3">
                    <CardTitle className="text-base">PIX</CardTitle>
                  </CardHeader>
                  <CardContent className="pb-4">
                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <span className="text-sm text-muted-foreground">Valor vendido:</span>
                        <span className="font-medium">{formatCurrency(paymentData.pix.total)}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm text-muted-foreground">Quantidade:</span>
                        <span className="font-medium">{paymentData.pix.count}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm text-muted-foreground">Conversão:</span>
                        <span className="font-medium text-success">
                          {paymentData.pix.conversion}%
                          <ArrowUpRight className="h-3 w-3 inline ml-1" />
                        </span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
                
                <Card className="bg-card/50 shadow-none">
                  <CardHeader className="py-3">
                    <CardTitle className="text-base">Cartão de Crédito</CardTitle>
                  </CardHeader>
                  <CardContent className="pb-4">
                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <span className="text-sm text-muted-foreground">Valor vendido:</span>
                        <span className="font-medium">{formatCurrency(paymentData.credit.total)}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm text-muted-foreground">Quantidade:</span>
                        <span className="font-medium">{paymentData.credit.count}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm text-muted-foreground">Conversão:</span>
                        <span className="font-medium text-success">
                          {paymentData.credit.conversion}%
                          <ArrowUpRight className="h-3 w-3 inline ml-1" />
                        </span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
                
                <Card className="bg-card/50 shadow-none">
                  <CardHeader className="py-3">
                    <CardTitle className="text-base">Boleto</CardTitle>
                  </CardHeader>
                  <CardContent className="pb-4">
                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <span className="text-sm text-muted-foreground">Valor vendido:</span>
                        <span className="font-medium">{formatCurrency(paymentData.boleto.total)}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm text-muted-foreground">Quantidade:</span>
                        <span className="font-medium">{paymentData.boleto.count}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm text-muted-foreground">Conversão:</span>
                        <span className="font-medium text-success">
                          {paymentData.boleto.conversion}%
                          <ArrowUpRight className="h-3 w-3 inline ml-1" />
                        </span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </CardContent>
          </Card>
          
          {/* Section 7: Products and UTMs */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
            <Card>
              <CardHeader className="py-4">
                <CardTitle className="flex items-center gap-2">
                  <Package className="h-5 w-5 text-primary" />
                  Top Produtos
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-1">
                  <div className="grid grid-cols-3 gap-2 text-sm font-medium mb-2 text-muted-foreground">
                    <div>Produto</div>
                    <div>Tipo</div>
                    <div className="text-right">Total</div>
                  </div>
                  {topProducts.map((product, index) => (
                    <div 
                      key={index} 
                      className="grid grid-cols-3 gap-2 py-2 border-t border-border text-sm"
                    >
                      <div className="truncate">{product.name}</div>
                      <div className="capitalize">
                        <span 
                          className={cn(
                            "inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium",
                            product.type === 'principal' ? "bg-blue-100 text-blue-800 dark:bg-blue-800/30 dark:text-blue-300" :
                            product.type === 'upsell' ? "bg-green-100 text-green-800 dark:bg-green-800/30 dark:text-green-300" :
                            "bg-purple-100 text-purple-800 dark:bg-purple-800/30 dark:text-purple-300"
                          )}
                        >
                          {product.type}
                        </span>
                      </div>
                      <div className="text-right">{formatCurrency(product.total)}</div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="py-4">
                <CardTitle className="flex items-center gap-2">
                  <Users className="h-5 w-5 text-primary" />
                  Top UTMs
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-1">
                  <div className="grid grid-cols-2 gap-2 text-sm font-medium mb-2 text-muted-foreground">
                    <div>Campanha</div>
                    <div className="text-right">Conversões</div>
                  </div>
                  {topUtms.map((utm, index) => (
                    <div 
                      key={index} 
                      className="grid grid-cols-2 gap-2 py-2 border-t border-border text-sm"
                    >
                      <div className="truncate">{utm.campaign}</div>
                      <div className="text-right">{utm.total}</div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </main>
      </div>
    </SidebarLayout>
  );
};

export default Dashboard;
