import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { ChartContainer, ChartTooltip, ChartTooltipContent } from '@/components/ui/chart';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { SidebarLayout } from '@/components/Sidebar';
import { Calendar, CreditCard, DollarSign, BarChart2, PieChart, Users, ArrowUpRight, 
         TrendingUp, Activity, Percent, Package, ShoppingCart, Circle, Settings, Clock } from 'lucide-react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
         BarChart, Bar, Legend, PieChart as RechartPieChart, Pie, Cell } from 'recharts';
import { format, subDays, addHours, startOfDay, endOfDay } from 'date-fns';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Calendar as CalendarComponent } from '@/components/ui/calendar';
import { cn } from '@/lib/utils';
import { ThemeToggle } from '@/components/ThemeToggle';
import { CustomizeDashboardDialog, availableKpis } from '@/components/dashboard/CustomizeDashboardDialog';
import { useStores } from '@/contexts/StoreContext';
import { FunnelChart } from '@/components/ui/funnel-chart';

const generateRandomData = (days: number, min: number, max: number) => {
  return Array.from({ length: days }).map((_, i) => {
    const date = subDays(new Date(), days - i - 1);
    return {
      date: format(date, 'dd/MM'),
      value: Math.floor(Math.random() * (max - min + 1)) + min,
    };
  });
};

const generateHourlyData = (isToday: boolean, min: number, max: number) => {
  const baseDate = isToday ? new Date() : subDays(new Date(), 1);
  const currentHour = baseDate.getHours();
  
  return Array.from({ length: 24 }).map((_, i) => {
    const hourValue = isToday && i > currentHour 
      ? 0 // Futuras horas hoje terão valor zero
      : Math.floor(Math.random() * (max - min + 1)) + min;
    
    const hourDate = startOfDay(baseDate);
    const dateWithHour = addHours(hourDate, i);
    
    return {
      date: format(dateWithHour, 'HH:00'),
      hour: i,
      value: hourValue,
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
  const [isHourlyView, setIsHourlyView] = useState(false);
  const [kpiData, setKpiData] = useState({
    faturamento: Math.floor(Math.random() * 10000) + 10000,
    transacoes: Math.floor(Math.random() * 100) + 100,
    ticketMedio: 0,
    conversaoCheckout: Math.floor(Math.random() * 20) + 60,
    conversaoGateway: Math.floor(Math.random() * 20) + 40,
    reembolsos: Math.floor(Math.random() * 1000) + 500,
    chargebacks: Math.floor(Math.random() * 500) + 100,
    visitas: Math.floor(Math.random() * 500) + 1000,
  });
  const [realtimeData, setRealtimeData] = useState(generateFunnelData());
  const [funnelData, setFunnelData] = useState(generateFunnelData());
  const [paymentData, setPaymentData] = useState(generatePaymentMethodData());
  const [topProducts, setTopProducts] = useState(generateTopProducts());
  const [topUtms, setTopUtms] = useState(generateTopUtms());
  const [customizeDialogOpen, setCustomizeDialogOpen] = useState(false);
  const { currentStore } = useStores();

  useEffect(() => {
    setKpiData(prev => ({
      ...prev,
      ticketMedio: prev.transacoes > 0 
        ? Math.round(prev.faturamento / prev.transacoes) 
        : 0
    }));
  }, [kpiData.faturamento, kpiData.transacoes]);
  
  useEffect(() => {
    let days = 7;
    let isOneDay = false;
    
    switch(dateRange) {
      case 'today':
        days = 1;
        isOneDay = true;
        break;
      case 'yesterday':
        days = 1;
        isOneDay = true;
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
        const diffTime = Math.abs(endDate.getTime() - startDate.getTime());
        days = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
        isOneDay = days === 1;
        break;
    }
    
    setIsHourlyView(isOneDay);
    
    if (isOneDay) {
      const isToday = dateRange === 'today' || 
        (dateRange === 'custom' && format(startDate, 'yyyy-MM-dd') === format(new Date(), 'yyyy-MM-dd'));
      setChartData(generateHourlyData(isToday, 1000, 8000));
    } else {
      setChartData(generateRandomData(days, 5000, 20000));
    }
    
    setKpiData({
      faturamento: Math.floor(Math.random() * 10000 * days/7) + 10000,
      transacoes: Math.floor(Math.random() * 100 * days/7) + 100,
      conversaoCheckout: Math.floor(Math.random() * 20) + 60,
      conversaoGateway: Math.floor(Math.random() * 20) + 40,
      ticketMedio: 0,
      reembolsos: Math.floor(Math.random() * 1000) + 500,
      chargebacks: Math.floor(Math.random() * 500) + 100,
      visitas: Math.floor(Math.random() * 500) + 1000,
    });
    
    setFunnelData(generateFunnelData());
    setPaymentData(generatePaymentMethodData());
    setTopProducts(generateTopProducts());
    setTopUtms(generateTopUtms());
  }, [dateRange, gateway, startDate, endDate]);
  
  useEffect(() => {
    const interval = setInterval(() => {
      setRealtimeData(generateFunnelData());
    }, 10 * 60 * 1000);
    
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
  
  const getActiveKpis = () => {
    if (!currentStore || !currentStore.dashboardSettings?.kpis) {
      return availableKpis.filter(kpi => kpi.default).map(kpi => kpi.id);
    }
    
    return Object.entries(currentStore.dashboardSettings.kpis)
      .filter(([_, isActive]) => isActive)
      .map(([kpiId]) => kpiId);
  };
  
  const activeKpis = getActiveKpis();
  
  const kpiComponents = {
    faturamento: (
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
    ),
    transacoes: (
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
    ),
    ticketMedio: (
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
    ),
    conversaoCheckout: (
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
    ),
    conversaoGateway: (
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
    ),
    reembolsos: (
      <Card>
        <CardHeader className="py-3">
          <CardTitle className="text-sm flex items-center gap-2">
            <ArrowUpRight className="h-4 w-4 text-destructive" />
            Reembolsos
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{formatCurrency(kpiData.reembolsos)}</div>
          <p className="text-xs text-muted-foreground">Total reembolsado</p>
        </CardContent>
      </Card>
    ),
    chargebacks: (
      <Card>
        <CardHeader className="py-3">
          <CardTitle className="text-sm flex items-center gap-2">
            <ArrowUpRight className="h-4 w-4 text-destructive" />
            Chargebacks
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{formatCurrency(kpiData.chargebacks)}</div>
          <p className="text-xs text-muted-foreground">Total contestado</p>
        </CardContent>
      </Card>
    ),
    visitas: (
      <Card>
        <CardHeader className="py-3">
          <CardTitle className="text-sm flex items-center gap-2">
            <Users className="h-4 w-4 text-primary" />
            Visitas
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{kpiData.visitas}</div>
          <p className="text-xs text-muted-foreground">Visitas no checkout</p>
        </CardContent>
      </Card>
    ),
  };
  
  return (
    <SidebarLayout>
      <div className="min-h-screen bg-background">
        <header className="bg-card border-b border-border sticky top-0 z-10">
          <div className="container mx-auto px-4 py-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <h1 className="text-xl font-bold text-primary">Dashboard</h1>
                <Button 
                  variant="ghost" 
                  size="icon" 
                  onClick={() => setCustomizeDialogOpen(true)}
                  className="rounded-full"
                  title="Personalizar Dashboard"
                >
                  <Settings className="h-4 w-4" />
                </Button>
              </div>
              <div className="flex items-center gap-4">
                <ThemeToggle />
              </div>
            </div>
          </div>
        </header>
        
        <main className="container mx-auto px-4 py-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4 mb-6">
            {activeKpis.map(kpiId => (
              kpiComponents[kpiId as keyof typeof kpiComponents] && (
                <div key={kpiId} className="col-span-1">
                  {kpiComponents[kpiId as keyof typeof kpiComponents]}
                </div>
              )
            ))}
          </div>
          
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
                                className="pointer-events-auto"
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
                                className="pointer-events-auto"
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
          
          <Card className="mb-6">
            <CardHeader className="py-4 flex flex-row items-center justify-between">
              <CardTitle className="flex items-center gap-2">
                {isHourlyView ? (
                  <Clock className="h-5 w-5 text-primary" />
                ) : (
                  <BarChart2 className="h-5 w-5 text-primary" />
                )}
                {getChartMetricLabel()}
                <span className="text-xs font-normal text-muted-foreground ml-2">
                  {getDateRangeLabel()}
                </span>
                {isHourlyView && (
                  <span className="text-xs font-normal text-muted-foreground ml-2 bg-secondary/50 px-2 py-0.5 rounded-full">
                    Visualização por hora
                  </span>
                )}
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
            <CardContent className="pt-0 pb-6">
              <div className="h-72 min-h-[220px] w-full overflow-hidden rounded-md">
                <ChartContainer 
                  config={{ data: { theme: { light: '#2BBA00', dark: '#2BBA00' } }}}
                  className="overflow-visible"
                >
                  <AreaChart 
                    data={chartData} 
                    margin={{ top: 20, right: 30, left: 20, bottom: 40 }}
                  >
                    <defs>
                      <linearGradient id="colorValue" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#2BBA00" stopOpacity={0.8}/>
                        <stop offset="80%" stopColor="#2BBA00" stopOpacity={0.2}/>
                        <stop offset="100%" stopColor="#2BBA00" stopOpacity={0}/>
                      </linearGradient>
                    </defs>
                    <XAxis 
                      dataKey="date" 
                      axisLine={false}
                      tickLine={false}
                      dy={10}
                      tick={{ fill: 'hsl(var(--muted-foreground))' }}
                      tickMargin={10}
                      label={{ 
                        value: isHourlyView ? 'Hora' : 'Período', 
                        position: 'insideBottom', 
                        offset: -20,
                        fill: 'hsl(var(--muted-foreground))'
                      }}
                      height={60}
                    />
                    <YAxis 
                      axisLine={false}
                      tickLine={false}
                      dx={-10}
                      tick={{ fill: 'hsl(var(--muted-foreground))' }}
                      tickFormatter={(value) => 
                        new Intl.NumberFormat('pt-BR', {
                          notation: 'compact',
                          compactDisplay: 'short',
                          maximumFractionDigits: 1
                        }).format(value)
                      }
                      label={{
                        value: 'Valores (R$)',
                        angle: -90,
                        position: 'insideLeft',
                        style: { textAnchor: 'middle' },
                        fill: 'hsl(var(--muted-foreground))'
                      }}
                      allowDecimals={false}
                      width={60}
                    />
                    <CartesianGrid 
                      strokeDasharray="3 3" 
                      className="stroke-muted/50" 
                      vertical={false} 
                      horizontal={true}
                    />
                    <ChartTooltip 
                      cursor={{ stroke: 'hsl(var(--muted-foreground))', strokeWidth: 1, strokeDasharray: '5 5' }}
                      content={
                        <ChartTooltipContent 
                          formatter={(value) => [
                            formatCurrency(Number(value)), 
                            getChartMetricLabel()
                          ]} 
                        />
                      } 
                      wrapperStyle={{ zIndex: 100 }}
                    />
                    <Area 
                      type="monotone" 
                      dataKey="value" 
                      stroke="#2BBA00" 
                      fillOpacity={1} 
                      fill="url(#colorValue)" 
                      strokeWidth={2}
                      activeDot={{ r: 6, strokeWidth: 0, fill: '#2BBA00' }}
                    />
                  </AreaChart>
                </ChartContainer>
              </div>
            </CardContent>
          </Card>
          
          <Card className="mb-6">
            <CardHeader className="py-4">
              <div className="flex items-center justify-between">
                <CardTitle className="flex items-center gap-2">
                  <Activity className="h-5 w-5 text-primary" />
                  Comportamento do Cliente
                </CardTitle>
                <div className="bg-secondary/50 text-muted-foreground px-4 py-1 rounded-full text-sm">
                  10 minutos
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="flex flex-col space-y-8">
                <div className="relative flex justify-between items-center">
                  <div className="absolute left-0 right-0 h-[2px] bg-gray-200 dark:bg-gray-700 top-1/2 transform -translate-y-1/2"></div>
                  {realtimeData.map((step) => (
                    <div key={step.name} className="relative flex flex-col items-center z-10">
                      <div className="w-10 h-10 rounded-full bg-gray-200 dark:bg-gray-700 flex items-center justify-center">
                        <Circle className="h-8 w-8 text-muted-foreground" />
                      </div>
                      <div className="mt-6 flex flex-col items-center">
                        <span className="text-3xl font-bold">{step.value}</span>
                        <span className="text-sm text-center mt-1 max-w-[100px]">{step.name}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            <Card>
              <CardHeader className="py-4">
                <CardTitle className="flex items-center gap-2">
                  <PieChart className="h-5 w-5 text-primary" />
                  Funil de Conversão
                </CardTitle>
              </CardHeader>
              <CardContent>
                <FunnelChart data={funnelData} compact />
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="py-4">
                <CardTitle className="flex items-center gap-2">
                  <CreditCard className="h-5 w-5 text-primary" />
                  Meios de Pagamento
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  <div className="rounded-lg bg-[#f1fcf3] dark:bg-green-950/20 p-4">
                    <div className="flex justify-between items-center">
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 rounded-lg bg-[#e1f8e5] dark:bg-green-900/20 flex items-center justify-center">
                          <div className="text-primary">
                            <DollarSign className="h-6 w-6" />
                          </div>
                        </div>
                        <div>
                          <div className="font-medium text-lg">PIX</div>
                          <div className="text-sm text-muted-foreground">{paymentData.pix.count} vendas</div>
                        </div>
                      </div>
                      <div className="text-lg font-medium text-primary">{paymentData.pix.conversion}%</div>
                    </div>
                    <div className="mt-3 w-full h-2 bg-[#e1f8e5] dark:bg-green-900/20 rounded-full overflow-hidden">
                      <div 
                        className="h-full bg-primary rounded-full"
                        style={{ width: `${paymentData.pix.conversion}%` }}
                      ></div>
                    </div>
                    <div className="mt-2 text-right font-medium">
                      {formatCurrency(paymentData.pix.total)}
                    </div>
                  </div>
                  
                  <div className="rounded-lg bg-[#eef3fc] dark:bg-blue-950/20 p-4">
                    <div className="flex justify-between items-center">
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 rounded-lg bg-[#dee7f8] dark:bg-blue-900/20 flex items-center justify-center">
                          <div className="text-blue-600 dark:text-blue-400">
                            <CreditCard className="h-6 w-6" />
                          </div>
                        </div>
                        <div>
                          <div className="font-medium text-lg">Cartão de Crédito</div>
                          <div className="text-sm text-muted-foreground">{paymentData.credit.count} vendas</div>
                        </div>
                      </div>
                      <div className="text-lg font-medium text-blue-600 dark:text-blue-400">{paymentData.credit.conversion}%</div>
                    </div>
                    <div className="mt-3 w-full h-2 bg-[#dee7f8] dark:bg-blue-900/20 rounded-full overflow-hidden">
                      <div 
                        className="h-full bg-blue-600 dark:bg-blue-400 rounded-full"
                        style={{ width: `${paymentData.credit.conversion}%` }}
                      ></div>
                    </div>
                    <div className="mt-2 text-right font-medium">
                      {formatCurrency(paymentData.credit.total)}
                    </div>
                  </div>
                  
                  <div className="rounded-lg bg-[#f5f0ff] dark:bg-purple-950/20 p-4">
                    <div className="flex justify-between items-center">
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 rounded-lg bg-[#ede4ff] dark:bg-purple-900/20 flex items-center justify-center">
                          <div className="text-purple-600 dark:text-purple-400">
                            <Package className="h-6 w-6" />
                          </div>
                        </div>
                        <div>
                          <div className="font-medium text-lg">Boleto</div>
                          <div className="text-sm text-muted-foreground">{paymentData.boleto.count} vendas</div>
                        </div>
                      </div>
                      <div className="text-lg font-medium text-purple-600 dark:text-purple-400">{paymentData.boleto.conversion}%</div>
                    </div>
                    <div className="mt-3 w-full h-2 bg-[#ede4ff] dark:bg-purple-900/20 rounded-full overflow-hidden">
                      <div 
                        className="h-full bg-purple-600 dark:bg-purple-400 rounded-full"
                        style={{ width: `${paymentData.boleto.conversion}%` }}
                      ></div>
                    </div>
                    <div className="mt-2 text-right font-medium">
                      {formatCurrency(paymentData.boleto.total)}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </main>
      </div>
      
      <CustomizeDashboardDialog 
        open={customizeDialogOpen}
        onOpenChange={setCustomizeDialogOpen}
      />
    </SidebarLayout>
  );
};

export default Dashboard;
