
import React from 'react';
import { DateRange } from 'react-day-picker';
import { 
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { formatCurrency } from '@/lib/utils';
import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';

interface AdminReportTrafficSourcesProps {
  dateRange?: DateRange;
  selectedStore: string;
  selectedGateway: string;
  selectedPaymentType: string;
}

const mockData = [
  { id: 1, source: 'Google / Organic', utmSource: 'google', utmMedium: 'organic', visits: 8500, sales: 723, conversionRate: 8.51, revenue: 67890 },
  { id: 2, source: 'Facebook Ads', utmSource: 'facebook', utmMedium: 'cpc', visits: 6200, sales: 418, conversionRate: 6.74, revenue: 41352 },
  { id: 3, source: 'Instagram Ads', utmSource: 'instagram', utmMedium: 'cpc', visits: 5100, sales: 356, conversionRate: 6.98, revenue: 35247 },
  { id: 4, source: 'Email Campaign', utmSource: 'email', utmMedium: 'email', visits: 3200, sales: 389, conversionRate: 12.16, revenue: 38721 },
  { id: 5, source: 'Direct', utmSource: 'direct', utmMedium: 'none', visits: 2950, sales: 236, conversionRate: 8.00, revenue: 21432 },
  { id: 6, source: 'Google Ads', utmSource: 'google', utmMedium: 'cpc', visits: 2800, sales: 197, conversionRate: 7.04, revenue: 19874 },
  { id: 7, source: 'TikTok Ads', utmSource: 'tiktok', utmMedium: 'cpc', visits: 2300, sales: 142, conversionRate: 6.17, revenue: 15321 },
  { id: 8, source: 'Referral', utmSource: 'referral', utmMedium: 'referral', visits: 1750, sales: 164, conversionRate: 9.37, revenue: 16892 },
];

// Prepare chart data
const chartData = mockData
  .sort((a, b) => b.sales - a.sales)
  .map(item => ({
    name: item.source,
    value: item.sales,
  }));

const COLORS = ['#10B981', '#0E9F6E', '#0C8A5B', '#0A7548', '#096040', '#075038', '#064030', '#053025'];

export const AdminReportTrafficSources: React.FC<AdminReportTrafficSourcesProps> = ({ 
  dateRange,
  selectedStore,
  selectedGateway,
  selectedPaymentType
}) => {
  // In a real app, we would filter the data based on the provided filters
  const filteredData = mockData.sort((a, b) => b.conversionRate - a.conversionRate);
  
  // Calculate overall conversion rate and revenue
  const totalVisits = filteredData.reduce((sum, item) => sum + item.visits, 0);
  const totalSales = filteredData.reduce((sum, item) => sum + item.sales, 0);
  const totalRevenue = filteredData.reduce((sum, item) => sum + item.revenue, 0);
  const overallConversionRate = ((totalSales / totalVisits) * 100).toFixed(2);
  
  return (
    <div className="space-y-6">
      <div className="text-sm text-gray-400">
        <p>Mostrando dados {dateRange?.from && `de ${dateRange.from.toLocaleDateString('pt-BR')}`} {dateRange?.to && `até ${dateRange.to.toLocaleDateString('pt-BR')}`}</p>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Overall Conversion Rate Card */}
        <div className="bg-[#262626] border border-white/5 rounded-lg p-6">
          <div className="text-gray-400 text-sm">Taxa de Conversão Média</div>
          <div className="text-3xl font-bold text-white mt-2">{overallConversionRate}%</div>
          <div className="text-sm text-gray-400 mt-1">Entre todos os canais</div>
        </div>
        
        {/* Total Revenue Card */}
        <div className="bg-[#262626] border border-white/5 rounded-lg p-6">
          <div className="text-gray-400 text-sm">Receita Total</div>
          <div className="text-3xl font-bold text-white mt-2">{formatCurrency(totalRevenue)}</div>
          <div className="text-sm text-gray-400 mt-1">No período selecionado</div>
        </div>
        
        {/* Total Visits Card */}
        <div className="bg-[#262626] border border-white/5 rounded-lg p-6">
          <div className="text-gray-400 text-sm">Visitas Totais</div>
          <div className="text-3xl font-bold text-white mt-2">{totalVisits.toLocaleString()}</div>
          <div className="text-sm text-gray-400 mt-1">Todos os canais</div>
        </div>
      </div>
      
      {/* Chart */}
      <div className="bg-[#262626] border border-white/5 rounded-lg p-4 h-80">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={chartData}
              cx="50%"
              cy="50%"
              labelLine={false}
              outerRadius={80}
              fill="#8884d8"
              dataKey="value"
              label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
            >
              {chartData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
              ))}
            </Pie>
            <Tooltip 
              formatter={(value) => [`${value} vendas`, 'Conversões']}
              contentStyle={{ backgroundColor: '#333', border: 'none' }}
            />
            <Legend />
          </PieChart>
        </ResponsiveContainer>
      </div>
      
      {/* Table */}
      <div>
        <Table>
          <TableHeader className="bg-[#262626]">
            <TableRow>
              <TableHead className="text-gray-300">Fonte</TableHead>
              <TableHead className="text-gray-300">UTM Source</TableHead>
              <TableHead className="text-gray-300">UTM Medium</TableHead>
              <TableHead className="text-gray-300 text-right">Visitas</TableHead>
              <TableHead className="text-gray-300 text-right">Vendas</TableHead>
              <TableHead className="text-gray-300 text-right">Taxa de Conversão</TableHead>
              <TableHead className="text-gray-300 text-right">Receita</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredData.map((source) => (
              <TableRow key={source.id} className="hover:bg-[#2A2A2A] border-t border-white/5">
                <TableCell className="font-medium text-white">{source.source}</TableCell>
                <TableCell className="text-white">{source.utmSource}</TableCell>
                <TableCell className="text-white">{source.utmMedium}</TableCell>
                <TableCell className="text-white text-right">{source.visits.toLocaleString()}</TableCell>
                <TableCell className="text-white text-right">{source.sales.toLocaleString()}</TableCell>
                <TableCell className="text-white text-right">
                  <span className={`font-medium ${source.conversionRate > 10 ? 'text-emerald-500' : 'text-white'}`}>
                    {source.conversionRate}%
                  </span>
                </TableCell>
                <TableCell className="text-white text-right">{formatCurrency(source.revenue)}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
};
