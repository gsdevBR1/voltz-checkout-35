import React, { useState } from 'react';
import { ArrowUp, ArrowDown, Store, DollarSign, Calculator, AlertCircle, Calendar, Filter } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  AreaChart, 
  LineChart, 
  BarChart, 
  CartesianGrid, 
  XAxis, 
  YAxis, 
  Tooltip, 
  Area, 
  Line, 
  Legend, 
  ResponsiveContainer,
  Bar
} from 'recharts';

const cn = (...classes: string[]) => {
  return classes.filter(Boolean).join(' ');
};

const StatsCard = ({ 
  title, 
  value, 
  change, 
  icon, 
  trendUp = true 
}: { 
  title: string; 
  value: string; 
  change: string;
  icon: React.ReactNode; 
  trendUp?: boolean; 
}) => {
  return (
    <Card className="bg-[#1E1E1E] border-white/5 shadow-md">
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle className="text-sm font-medium text-gray-400">{title}</CardTitle>
        <div className="h-8 w-8 rounded-md bg-[#262626] flex items-center justify-center">
          {icon}
        </div>
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold text-white">{value}</div>
        <div className={cn(
          "flex items-center text-xs mt-1",
          trendUp ? "text-emerald-500" : "text-red-500"
        )}>
          {trendUp ? <ArrowUp className="h-3 w-3 mr-1" /> : <ArrowDown className="h-3 w-3 mr-1" />}
          <span>{change} em relação ao período anterior</span>
        </div>
      </CardContent>
    </Card>
  );
};

const generateChartData = (days: number) => {
  return Array.from({ length: days }).map((_, i) => {
    const date = new Date();
    date.setDate(date.getDate() - (days - 1) + i);
    const dateStr = date.toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit' });
    
    const baseValue = 1000 + (i * 200);
    const randomVariation = () => Math.random() * 500 - 250;
    
    return {
      name: dateStr,
      vendas: Math.max(baseValue + randomVariation(), 500),
      acessos: Math.max((baseValue * 5) + randomVariation() * 5, 3000),
      transacionado: Math.max(baseValue * 80 + randomVariation() * 80, 50000),
    };
  });
};

type AlertItemProps = {
  type: string;
  count: number;
  status: 'critical' | 'warning';
};

const AlertItem: React.FC<AlertItemProps> = ({ type, count, status }) => {
  return (
    <div className="flex justify-between items-center p-3 rounded-md bg-[#262626] hover:bg-[#2A2A2A] transition-colors">
      <div className="flex items-center gap-3">
        <div className={cn(
          "w-2 h-2 rounded-full",
          status === 'critical' ? "bg-red-500" : "bg-yellow-500"
        )} />
        <div className="font-medium text-sm text-white">{type}</div>
      </div>
      <div className="flex items-center">
        <span className={cn(
          "px-2 py-0.5 rounded-md text-xs font-medium",
          status === 'critical' ? "bg-red-500/20 text-red-300" : "bg-yellow-500/20 text-yellow-300"
        )}>
          {count} {count === 1 ? 'loja' : 'lojas'}
        </span>
      </div>
    </div>
  );
};

const AdminDashboard: React.FC = () => {
  const [timeRange, setTimeRange] = useState('7d');
  const [chartData, setChartData] = useState(() => generateChartData(7));
  
  const handleTimeRangeChange = (value: string) => {
    setTimeRange(value);
    switch (value) {
      case '1d':
        setChartData(generateChartData(1));
        break;
      case '7d':
        setChartData(generateChartData(7));
        break;
      case '30d':
        setChartData(generateChartData(30));
        break;
      default:
        setChartData(generateChartData(7));
    }
  };

  return (
    <div className="space-y-6 p-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-white">Dashboard Admin</h1>
        <div className="text-sm text-gray-400 flex items-center gap-2">
          <Calendar className="h-4 w-4" />
          Última atualização: {new Date().toLocaleDateString('pt-BR', { 
            day: '2-digit', 
            month: '2-digit', 
            year: 'numeric',

            hour: '2-digit', 
            minute: '2-digit' 
          })}
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatsCard
          title="Lojas Ativas"
          value="156"
          change="12%"
          icon={<Store className="h-5 w-5 text-[#10B981]" />}
          trendUp={true}
        />
        
        <StatsCard
          title="Vendas Hoje"
          value="R$ 24.890,00"
          change="8%"
          icon={<DollarSign className="h-5 w-5 text-blue-500" />}
          trendUp={true}
        />
        
        <StatsCard
          title="Taxas Coletadas Hoje"
          value="R$ 622,25"
          change="15%"
          icon={<Calculator className="h-5 w-5 text-purple-500" />}
          trendUp={true}
        />
        
        <StatsCard
          title="Ciclos Estourados"
          value="7"
          change="3%"
          icon={<AlertCircle className="h-5 w-5 text-red-500" />}
          trendUp={false}
        />
      </div>
      
      <Card className="bg-[#1E1E1E] border-white/5 shadow-md">
        <CardHeader className="pb-2">
          <div className="flex items-center justify-between">
            <CardTitle className="text-white">Atividade Global da Plataforma</CardTitle>
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-2 text-sm text-gray-400">
                <Filter className="h-4 w-4" />
                <span>Período:</span>
              </div>
              <Select value={timeRange} onValueChange={handleTimeRangeChange}>
                <SelectTrigger className="w-32 h-8 bg-[#262626] border-white/10 text-sm">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="bg-[#262626] border-white/10">
                  <SelectItem value="1d">Hoje</SelectItem>
                  <SelectItem value="7d">7 dias</SelectItem>
                  <SelectItem value="30d">30 dias</SelectItem>
                  <SelectItem value="custom">Personalizado</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="vendas" className="w-full">
            <TabsList className="grid w-full grid-cols-3 bg-[#262626] mb-4">
              <TabsTrigger value="vendas">Volume de Vendas</TabsTrigger>
              <TabsTrigger value="acessos">Acessos aos Checkouts</TabsTrigger>
              <TabsTrigger value="transacionado">Valor Transacionado</TabsTrigger>
            </TabsList>
            
            <TabsContent value="vendas" className="h-64 md:h-72">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={chartData} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
                  <defs>
                    <linearGradient id="colorVendas" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#10B981" stopOpacity={0.8}/>
                      <stop offset="95%" stopColor="#10B981" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="#333" />
                  <XAxis dataKey="name" stroke="#666" />
                  <YAxis stroke="#666" />
                  <Tooltip contentStyle={{ backgroundColor: '#262626', borderColor: '#444', color: '#fff' }} />
                  <Area type="monotone" dataKey="vendas" stroke="#10B981" fillOpacity={1} fill="url(#colorVendas)" />
                </AreaChart>
              </ResponsiveContainer>
            </TabsContent>
            
            <TabsContent value="acessos" className="h-64 md:h-72">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={chartData} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#333" />
                  <XAxis dataKey="name" stroke="#666" />
                  <YAxis stroke="#666" />
                  <Tooltip contentStyle={{ backgroundColor: '#262626', borderColor: '#444', color: '#fff' }} />
                  <Line type="monotone" dataKey="acessos" stroke="#3B82F6" strokeWidth={2} dot={{ r: 2 }} />
                </LineChart>
              </ResponsiveContainer>
            </TabsContent>
            
            <TabsContent value="transacionado" className="h-64 md:h-72">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={chartData} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#333" />
                  <XAxis dataKey="name" stroke="#666" />
                  <YAxis stroke="#666" />
                  <Tooltip 
                    formatter={(value: number) => [`R$ ${value.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}`, 'Valor']}
                    contentStyle={{ backgroundColor: '#262626', borderColor: '#444', color: '#fff' }} 
                  />
                  <Bar dataKey="transacionado" fill="#8B5CF6" />
                </BarChart>
              </ResponsiveContainer>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
      
      <Card className="bg-[#1E1E1E] border-white/5 shadow-md">
        <CardHeader>
          <CardTitle className="text-white">Alertas Rápidos</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <AlertItem
            type="Lojas com cobrança falha"
            count={5}
            status="critical"
          />
          <AlertItem
            type="Domínios com erro de propagação"
            count={3}
            status="warning"
          />
          <AlertItem
            type="Checkouts suspensos por falta de cartão"
            count={8}
            status="critical"
          />
          <AlertItem
            type="Checkouts com erro de integração"
            count={2}
            status="warning"
          />
          
          <div className="pt-2">
            <Button variant="outline" className="w-full mt-2 border-white/10 hover:bg-[#262626] text-gray-300">
              Ver todos os alertas
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default AdminDashboard;
