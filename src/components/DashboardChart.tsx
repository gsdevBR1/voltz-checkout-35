import React, { useState } from 'react';
import { ChartContainer, ChartTooltip, ChartTooltipContent, ChartLegend, ChartLegendContent } from '@/components/ui/chart';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar, LineChart, Line } from 'recharts';
import { format } from 'date-fns';
import { Button } from '@/components/ui/button';
import { ArrowLeft, ArrowRight, LineChart as LineChartIcon, BarChart2, TrendingUp } from 'lucide-react';

// Tipos para as métricas e configurações
type ChartMetric = {
  id: string;
  name: string;
  color: string;
  active: boolean;
};

type ChartView = 'area' | 'bar' | 'line';

// Componente principal do gráfico
interface DashboardChartProps {
  data: any[];
  dateRangeLabel: string;
  formatCurrency: (value: number) => string;
}

const DashboardChart: React.FC<DashboardChartProps> = ({ 
  data, 
  dateRangeLabel,
  formatCurrency 
}) => {
  // Estado para métricas disponíveis
  const [metrics, setMetrics] = useState<ChartMetric[]>([
    { id: 'value', name: 'Faturamento', color: '#2BBA00', active: true },
    { id: 'pixValue', name: 'Pix gerado', color: '#3B82F6', active: false },
    { id: 'abandonedValue', name: 'Carrinhos abandonados', color: '#F87171', active: false },
  ]);

  // Estado para o tipo de visualização
  const [chartView, setChartView] = useState<ChartView>('area');
  
  // Estado para configurar o scroll horizontal
  const [scrollPosition, setScrollPosition] = useState(0);
  const maxVisibleItems = 10; // Número máximo de itens visíveis no gráfico
  
  // Filtrar apenas métricas ativas
  const activeMetrics = metrics.filter(metric => metric.active);
  
  // Dados filtrados para scroll horizontal
  const visibleData = data.length > maxVisibleItems 
    ? data.slice(scrollPosition, scrollPosition + maxVisibleItems)
    : data;
  
  // Verificar se há mais dados para scrollar
  const canScrollLeft = scrollPosition > 0;
  const canScrollRight = data.length > maxVisibleItems && scrollPosition < data.length - maxVisibleItems;
  
  // Função para alternar a ativação de uma métrica
  const toggleMetric = (metricId: string) => {
    setMetrics(prev => 
      prev.map(metric => 
        metric.id === metricId 
          ? { ...metric, active: !metric.active } 
          : metric
      )
    );
  };

  // Renderização do gráfico com base no tipo selecionado
  const renderChart = () => {
    // Props comuns para todos os tipos de gráficos
    const commonProps = {
      data: visibleData,
      margin: { top: 20, right: 30, left: 10, bottom: 20 },
    };

    // Componentes comuns para todos os tipos de gráficos
    const commonComponents = (
      <>
        <defs>
          {metrics.map((metric) => (
            <linearGradient 
              key={`gradient-${metric.id}`} 
              id={`color-${metric.id}`} 
              x1="0" 
              y1="0" 
              x2="0" 
              y2="1"
            >
              <stop offset="5%" stopColor={metric.color} stopOpacity={0.8} />
              <stop offset="95%" stopColor={metric.color} stopOpacity={0.1} />
            </linearGradient>
          ))}
        </defs>
        
        <XAxis 
          dataKey="date" 
          axisLine={false}
          tickLine={false}
          dy={10}
          tick={{ fill: 'hsl(var(--muted-foreground))' }}
          tickMargin={10}
          label={{ 
            value: 'Período', 
            position: 'insideBottom', 
            offset: -10,
            fill: 'hsl(var(--muted-foreground))'
          }}
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
            fill: 'hsl(var(--muted-foreground))'
          }}
        />
        
        <CartesianGrid 
          strokeDasharray="3 3" 
          className="stroke-muted/50" 
          vertical={false} 
          horizontal={true}
        />
        
        <ChartTooltip 
          cursor={{ 
            stroke: 'hsl(var(--muted-foreground))', 
            strokeWidth: 1, 
            strokeDasharray: '5 5' 
          }}
          content={
            <ChartTooltipContent 
              formatter={(value, name) => {
                const metric = metrics.find(m => m.id === name);
                return [
                  formatCurrency(Number(value)), 
                  metric?.name || name
                ];
              }}
              labelFormatter={(label) => (
                <div className="font-medium mb-1">
                  <span className="text-muted-foreground">Data: </span>{label}
                </div>
              )}
            />
          } 
        />
      </>
    );

    // Renderizar com base no tipo de gráfico selecionado
    switch (chartView) {
      case 'area':
        return (
          <AreaChart {...commonProps}>
            {commonComponents}
            {activeMetrics.map(metric => (
              <Area 
                key={metric.id}
                type="monotone" 
                dataKey={metric.id} 
                name={metric.id}
                stroke={metric.color} 
                fill={`url(#color-${metric.id})`} 
                fillOpacity={1}
                strokeWidth={2}
                activeDot={{ 
                  r: 6, 
                  strokeWidth: 0, 
                  fill: metric.color,
                  className: "animate-pulse"
                }}
              />
            ))}
          </AreaChart>
        );
        
      case 'bar':
        return (
          <BarChart {...commonProps}>
            {commonComponents}
            {activeMetrics.map(metric => (
              <Bar 
                key={metric.id}
                dataKey={metric.id} 
                name={metric.id}
                fill={metric.color} 
                radius={[4, 4, 0, 0]}
                maxBarSize={50}
                opacity={0.8}
              />
            ))}
          </BarChart>
        );
        
      case 'line':
        return (
          <LineChart {...commonProps}>
            {commonComponents}
            {activeMetrics.map(metric => (
              <Line 
                key={metric.id}
                type="monotone" 
                dataKey={metric.id} 
                name={metric.id}
                stroke={metric.color} 
                strokeWidth={3}
                dot={{ 
                  r: 4, 
                  strokeWidth: 0, 
                  fill: metric.color 
                }}
                activeDot={{ 
                  r: 6, 
                  strokeWidth: 0, 
                  fill: metric.color,
                  className: "animate-pulse"
                }}
              />
            ))}
          </LineChart>
        );
    }
  };

  return (
    <div className="space-y-4">
      {/* Controles de métrica e visualização */}
      <div className="flex flex-wrap justify-between items-center gap-3">
        <div className="flex flex-wrap gap-2">
          {metrics.map((metric) => (
            <Button 
              key={metric.id}
              size="sm" 
              variant={metric.active ? "default" : "outline"}
              onClick={() => toggleMetric(metric.id)}
              className="gap-2 transition-all"
              style={{ 
                backgroundColor: metric.active ? metric.color : 'transparent',
                borderColor: metric.color,
                color: metric.active ? 'white' : metric.color
              }}
            >
              {metric.name}
            </Button>
          ))}
        </div>
        
        <div className="flex items-center gap-2">
          <span className="text-sm text-muted-foreground mr-1">Visualizar como:</span>
          <Button
            size="sm"
            variant={chartView === 'area' ? "default" : "outline"}
            onClick={() => setChartView('area')}
            className="gap-2"
          >
            <TrendingUp className="h-4 w-4" />
            Área
          </Button>
          <Button
            size="sm"
            variant={chartView === 'line' ? "default" : "outline"}
            onClick={() => setChartView('line')}
            className="gap-2"
          >
            <LineChartIcon className="h-4 w-4" />
            Linha
          </Button>
          <Button
            size="sm"
            variant={chartView === 'bar' ? "default" : "outline"}
            onClick={() => setChartView('bar')}
            className="gap-2"
          >
            <BarChart2 className="h-4 w-4" />
            Colunas
          </Button>
        </div>
      </div>
      
      {/* Gráfico com controles de scroll */}
      <div className="relative h-80 w-full overflow-hidden rounded-md">
        <div className="absolute w-full h-full mb-5">
          <ChartContainer config={{ 
            value: { theme: { light: '#2BBA00', dark: '#2BBA00' } },
            pixValue: { theme: { light: '#3B82F6', dark: '#3B82F6' } },
            abandonedValue: { theme: { light: '#F87171', dark: '#F87171' } },
          }}>
            <ResponsiveContainer width="100%" height="100%">
              {renderChart()}
            </ResponsiveContainer>
          </ChartContainer>
        </div>
        
        {/* Controles de navegação (apenas exibidos se necessário) */}
        {data.length > maxVisibleItems && (
          <div className="absolute bottom-0 left-0 right-0 flex justify-center gap-2 py-2">
            <Button 
              size="icon"
              variant="outline"
              onClick={() => setScrollPosition(prev => Math.max(0, prev - 5))}
              disabled={!canScrollLeft}
              className="h-8 w-8 rounded-full"
            >
              <ArrowLeft className="h-4 w-4" />
            </Button>
            <Button 
              size="icon"
              variant="outline"
              onClick={() => setScrollPosition(prev => Math.min(data.length - maxVisibleItems, prev + 5))}
              disabled={!canScrollRight}
              className="h-8 w-8 rounded-full"
            >
              <ArrowRight className="h-4 w-4" />
            </Button>
          </div>
        )}
      </div>
      
      {/* Legenda */}
      <div className="flex justify-center">
        <ChartLegend 
          payload={activeMetrics.map(metric => ({
            value: metric.name,
            color: metric.color,
            dataKey: metric.id
          }))}
          content={<ChartLegendContent className="gap-6" />}
        />
      </div>
    </div>
  );
};

export default DashboardChart;
