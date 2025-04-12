
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { DatePicker } from "@/components/ui/date-picker";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { MessageCircle, Mail, MessageSquare, TrendingUp, Download, Calendar, Filter } from "lucide-react";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, LineChart, Line } from 'recharts';

// Mock data for demonstration
const mockEmailData = [
  { date: '2025-03-12', sends: 45, opens: 32, clicks: 18, recovered: 8 },
  { date: '2025-03-13', sends: 50, opens: 38, clicks: 21, recovered: 10 },
  { date: '2025-03-14', sends: 42, opens: 30, clicks: 17, recovered: 7 },
  { date: '2025-03-15', sends: 48, opens: 35, clicks: 20, recovered: 9 },
  { date: '2025-03-16', sends: 55, opens: 40, clicks: 25, recovered: 12 },
  { date: '2025-03-17', sends: 60, opens: 45, clicks: 28, recovered: 15 },
  { date: '2025-03-18', sends: 52, opens: 39, clicks: 24, recovered: 11 },
];

const mockSmsData = [
  { date: '2025-03-12', sends: 30, delivered: 29, clicks: 12, recovered: 6 },
  { date: '2025-03-13', sends: 35, delivered: 33, clicks: 15, recovered: 8 },
  { date: '2025-03-14', sends: 28, delivered: 27, clicks: 10, recovered: 5 },
  { date: '2025-03-15', sends: 32, delivered: 30, clicks: 14, recovered: 7 },
  { date: '2025-03-16', sends: 38, delivered: 36, clicks: 18, recovered: 9 },
  { date: '2025-03-17', sends: 40, delivered: 39, clicks: 19, recovered: 10 },
  { date: '2025-03-18', sends: 36, delivered: 34, clicks: 16, recovered: 8 },
];

// Map date strings to more readable format
const formatChartData = (data: any[]) => {
  return data.map(item => ({
    ...item,
    date: new Date(item.date).toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit' })
  }));
};

// Calculate conversion rate
const calculateConversionRate = (recovered: number, sends: number) => {
  return sends > 0 ? ((recovered / sends) * 100).toFixed(2) : '0.00';
};

// Sum up totals from data
const calculateTotals = (data: any[]) => {
  return data.reduce((acc, curr) => {
    Object.keys(curr).forEach(key => {
      if (key !== 'date' && typeof curr[key] === 'number') {
        acc[key] = (acc[key] || 0) + curr[key];
      }
    });
    return acc;
  }, {});
};

interface StatCardProps {
  title: string;
  value: number | string;
  icon: React.ReactNode;
  description?: string;
  trend?: number;
}

const StatCard: React.FC<StatCardProps> = ({ title, value, icon, description, trend }) => (
  <Card>
    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
      <CardTitle className="text-sm font-medium">{title}</CardTitle>
      <div className="h-8 w-8 rounded-full bg-primary/10 p-1 text-primary">{icon}</div>
    </CardHeader>
    <CardContent>
      <div className="text-2xl font-bold">{value}</div>
      {description && (
        <p className="text-xs text-muted-foreground mt-1">
          {description}
          {trend !== undefined && (
            <span className={`ml-1 ${trend >= 0 ? 'text-green-500' : 'text-red-500'}`}>
              {trend >= 0 ? `+${trend}%` : `${trend}%`}
            </span>
          )}
        </p>
      )}
    </CardContent>
  </Card>
);

export const RecoveryStats: React.FC = () => {
  const [activeTab, setActiveTab] = useState<string>("email");
  const [dateRange, setDateRange] = useState<{ startDate?: Date; endDate?: Date }>({ startDate: undefined, endDate: undefined });
  const [periodFilter, setPeriodFilter] = useState<string>("7d");
  const [channelFilter, setChannelFilter] = useState<string>("all");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [chartType, setChartType] = useState<string>("bar");

  // Get data based on active tab
  const data = activeTab === "email" ? mockEmailData : mockSmsData;
  const formattedData = formatChartData(data);
  const totals = calculateTotals(data);
  
  // Calculate conversion rate for the selected channel
  const conversionRate = activeTab === "email" 
    ? calculateConversionRate(totals.recovered, totals.sends) 
    : calculateConversionRate(totals.recovered, totals.sends);

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row justify-between gap-4 items-start md:items-center">
        <h2 className="text-2xl font-bold tracking-tight">Estatísticas de Recuperação</h2>
        
        <div className="flex flex-wrap gap-2">
          <Select value={periodFilter} onValueChange={setPeriodFilter}>
            <SelectTrigger className="w-[140px]">
              <Calendar className="h-4 w-4 mr-2" />
              <SelectValue placeholder="Período" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="today">Hoje</SelectItem>
              <SelectItem value="yesterday">Ontem</SelectItem>
              <SelectItem value="7d">Últimos 7 dias</SelectItem>
              <SelectItem value="30d">Últimos 30 dias</SelectItem>
              <SelectItem value="90d">Últimos 90 dias</SelectItem>
              <SelectItem value="custom">Personalizado</SelectItem>
            </SelectContent>
          </Select>
          
          {periodFilter === "custom" && (
            <div className="flex gap-2">
              <div>
                <DatePicker 
                  date={dateRange.startDate}
                  setDate={(date) => setDateRange(prev => ({ ...prev, startDate: date }))}
                />
              </div>
              <div>
                <DatePicker 
                  date={dateRange.endDate}
                  setDate={(date) => setDateRange(prev => ({ ...prev, endDate: date }))}
                />
              </div>
            </div>
          )}
          
          <Select value={channelFilter} onValueChange={setChannelFilter}>
            <SelectTrigger className="w-[140px]">
              <Filter className="h-4 w-4 mr-2" />
              <SelectValue placeholder="Canal" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Todos os canais</SelectItem>
              <SelectItem value="email">Email</SelectItem>
              <SelectItem value="sms">SMS</SelectItem>
            </SelectContent>
          </Select>
          
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-[180px]">
              <TrendingUp className="h-4 w-4 mr-2" />
              <SelectValue placeholder="Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Todos os status</SelectItem>
              <SelectItem value="recovered">Vendas recuperadas</SelectItem>
              <SelectItem value="not_recovered">Não recuperadas</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>
      
      <Separator />
      
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="email" className="flex items-center gap-2">
            <Mail className="h-4 w-4" /> Email
          </TabsTrigger>
          <TabsTrigger value="sms" className="flex items-center gap-2">
            <MessageSquare className="h-4 w-4" /> SMS
          </TabsTrigger>
          <TabsTrigger value="whatsapp" className="flex items-center gap-2" disabled>
            <MessageCircle className="h-4 w-4" /> WhatsApp
            <Badge variant="outline" className="ml-1 py-0 h-5">Em breve</Badge>
          </TabsTrigger>
        </TabsList>

        {/* Email Statistics */}
        <TabsContent value="email" className="space-y-6">
          <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-5">
            <StatCard 
              title="Envios" 
              value={totals.sends || 0} 
              icon={<Mail className="h-4 w-4" />} 
              description="Total de emails enviados"
              trend={5}
            />
            <StatCard 
              title="Aberturas" 
              value={totals.opens || 0} 
              icon={<Mail className="h-4 w-4" />} 
              description={`${((totals.opens / totals.sends) * 100).toFixed(2)}% dos envios`}
              trend={3}
            />
            <StatCard 
              title="Cliques" 
              value={totals.clicks || 0} 
              icon={<Mail className="h-4 w-4" />} 
              description={`${((totals.clicks / totals.opens) * 100).toFixed(2)}% das aberturas`}
              trend={2}
            />
            <StatCard 
              title="Vendas Recuperadas" 
              value={totals.recovered || 0} 
              icon={<TrendingUp className="h-4 w-4" />} 
              description="Vendas concluídas"
              trend={8}
            />
            <StatCard 
              title="Taxa de Conversão" 
              value={`${conversionRate}%`} 
              icon={<TrendingUp className="h-4 w-4" />} 
              description="Das aberturas para vendas"
              trend={4}
            />
          </div>
          
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>Desempenho por Dia</CardTitle>
                <div className="flex gap-2">
                  <Button 
                    variant={chartType === "bar" ? "default" : "outline"} 
                    size="sm"
                    onClick={() => setChartType("bar")}
                  >
                    Barras
                  </Button>
                  <Button 
                    variant={chartType === "line" ? "default" : "outline"} 
                    size="sm"
                    onClick={() => setChartType("line")}
                  >
                    Linha
                  </Button>
                  <Button variant="outline" size="sm" disabled>
                    <Download className="h-4 w-4 mr-2" />
                    Exportar
                  </Button>
                </div>
              </div>
              <CardDescription>
                Comparação entre emails enviados e vendas recuperadas por dia
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-[300px] w-full">
                <ChartContainer config={{
                  send: { color: "#3B82F6" },
                  recovered: { color: "#10B981" }
                }}>
                  {chartType === "bar" ? (
                    <BarChart data={formattedData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="date" />
                      <YAxis />
                      <Tooltip content={<ChartTooltipContent />} />
                      <Legend />
                      <Bar dataKey="sends" name="Envios" fill="var(--color-send)" />
                      <Bar dataKey="recovered" name="Recuperados" fill="var(--color-recovered)" />
                    </BarChart>
                  ) : (
                    <LineChart data={formattedData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="date" />
                      <YAxis />
                      <Tooltip content={<ChartTooltipContent />} />
                      <Legend />
                      <Line type="monotone" dataKey="sends" name="Envios" stroke="var(--color-send)" activeDot={{ r: 8 }} />
                      <Line type="monotone" dataKey="recovered" name="Recuperados" stroke="var(--color-recovered)" />
                    </LineChart>
                  )}
                </ChartContainer>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle>Detalhamento dos Envios</CardTitle>
              <CardDescription>
                Listagem dos últimos 10 envios de email para recuperação
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Data</TableHead>
                    <TableHead>Assunto</TableHead>
                    <TableHead>Enviados</TableHead>
                    <TableHead>Abertos</TableHead>
                    <TableHead>Cliques</TableHead>
                    <TableHead>Recuperados</TableHead>
                    <TableHead>Taxa</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  <TableRow>
                    <TableCell>12/03/2025</TableCell>
                    <TableCell>Esqueceu algo no carrinho?</TableCell>
                    <TableCell>45</TableCell>
                    <TableCell>32</TableCell>
                    <TableCell>18</TableCell>
                    <TableCell>8</TableCell>
                    <TableCell>17.8%</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell>13/03/2025</TableCell>
                    <TableCell>Seu carrinho está esperando por você</TableCell>
                    <TableCell>50</TableCell>
                    <TableCell>38</TableCell>
                    <TableCell>21</TableCell>
                    <TableCell>10</TableCell>
                    <TableCell>20.0%</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell>14/03/2025</TableCell>
                    <TableCell>Finalize sua compra com 10% de desconto</TableCell>
                    <TableCell>42</TableCell>
                    <TableCell>30</TableCell>
                    <TableCell>17</TableCell>
                    <TableCell>7</TableCell>
                    <TableCell>16.7%</TableCell>
                  </TableRow>
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        {/* SMS Statistics */}
        <TabsContent value="sms" className="space-y-6">
          <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-5">
            <StatCard 
              title="Envios" 
              value={totals.sends || 0} 
              icon={<MessageSquare className="h-4 w-4" />} 
              description="Total de SMS enviados"
              trend={4}
            />
            <StatCard 
              title="Entregues" 
              value={totals.delivered || 0} 
              icon={<MessageSquare className="h-4 w-4" />} 
              description={`${((totals.delivered / totals.sends) * 100).toFixed(2)}% dos envios`}
              trend={2}
            />
            <StatCard 
              title="Cliques" 
              value={totals.clicks || 0} 
              icon={<MessageSquare className="h-4 w-4" />} 
              description={`${((totals.clicks / totals.delivered) * 100).toFixed(2)}% dos entregues`}
              trend={3}
            />
            <StatCard 
              title="Vendas Recuperadas" 
              value={totals.recovered || 0} 
              icon={<TrendingUp className="h-4 w-4" />} 
              description="Vendas concluídas"
              trend={6}
            />
            <StatCard 
              title="Taxa de Conversão" 
              value={`${conversionRate}%`} 
              icon={<TrendingUp className="h-4 w-4" />} 
              description="Dos cliques para vendas"
              trend={5}
            />
          </div>
          
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>Desempenho por Dia</CardTitle>
                <div className="flex gap-2">
                  <Button 
                    variant={chartType === "bar" ? "default" : "outline"} 
                    size="sm"
                    onClick={() => setChartType("bar")}
                  >
                    Barras
                  </Button>
                  <Button 
                    variant={chartType === "line" ? "default" : "outline"} 
                    size="sm"
                    onClick={() => setChartType("line")}
                  >
                    Linha
                  </Button>
                  <Button variant="outline" size="sm" disabled>
                    <Download className="h-4 w-4 mr-2" />
                    Exportar
                  </Button>
                </div>
              </div>
              <CardDescription>
                Comparação entre SMS enviados e vendas recuperadas por dia
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-[300px] w-full">
                <ChartContainer config={{
                  send: { color: "#3B82F6" },
                  recovered: { color: "#10B981" }
                }}>
                  {chartType === "bar" ? (
                    <BarChart data={formattedData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="date" />
                      <YAxis />
                      <Tooltip content={<ChartTooltipContent />} />
                      <Legend />
                      <Bar dataKey="sends" name="Envios" fill="var(--color-send)" />
                      <Bar dataKey="recovered" name="Recuperados" fill="var(--color-recovered)" />
                    </BarChart>
                  ) : (
                    <LineChart data={formattedData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="date" />
                      <YAxis />
                      <Tooltip content={<ChartTooltipContent />} />
                      <Legend />
                      <Line type="monotone" dataKey="sends" name="Envios" stroke="var(--color-send)" activeDot={{ r: 8 }} />
                      <Line type="monotone" dataKey="recovered" name="Recuperados" stroke="var(--color-recovered)" />
                    </LineChart>
                  )}
                </ChartContainer>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle>Detalhamento dos Envios</CardTitle>
              <CardDescription>
                Listagem dos últimos 10 envios de SMS para recuperação
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Data</TableHead>
                    <TableHead>Mensagem</TableHead>
                    <TableHead>Enviados</TableHead>
                    <TableHead>Entregues</TableHead>
                    <TableHead>Cliques</TableHead>
                    <TableHead>Recuperados</TableHead>
                    <TableHead>Taxa</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  <TableRow>
                    <TableCell>12/03/2025</TableCell>
                    <TableCell>Olá, você deixou itens no carrinho...</TableCell>
                    <TableCell>30</TableCell>
                    <TableCell>29</TableCell>
                    <TableCell>12</TableCell>
                    <TableCell>6</TableCell>
                    <TableCell>20.0%</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell>13/03/2025</TableCell>
                    <TableCell>Finalize sua compra agora e ganhe...</TableCell>
                    <TableCell>35</TableCell>
                    <TableCell>33</TableCell>
                    <TableCell>15</TableCell>
                    <TableCell>8</TableCell>
                    <TableCell>22.9%</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell>14/03/2025</TableCell>
                    <TableCell>Seu carrinho ainda está disponível...</TableCell>
                    <TableCell>28</TableCell>
                    <TableCell>27</TableCell>
                    <TableCell>10</TableCell>
                    <TableCell>5</TableCell>
                    <TableCell>17.9%</TableCell>
                  </TableRow>
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        {/* WhatsApp Statistics (Coming Soon) */}
        <TabsContent value="whatsapp">
          <Card className="min-h-[500px] flex flex-col items-center justify-center text-center p-10">
            <MessageCircle className="h-16 w-16 text-muted-foreground mb-4" />
            <h3 className="text-lg font-medium mb-2">Estatísticas de WhatsApp em breve</h3>
            <p className="text-muted-foreground max-w-md">
              Estamos trabalhando para disponibilizar estatísticas detalhadas para as recuperações via WhatsApp.
              Em breve você poderá acompanhar o desempenho deste canal.
            </p>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default RecoveryStats;
