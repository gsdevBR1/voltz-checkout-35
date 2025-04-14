
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
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';

interface AdminReportStoresSalesProps {
  dateRange?: DateRange;
  selectedStore: string;
  selectedGateway: string;
  selectedPaymentType: string;
}

const mockData = [
  { id: 1, storeName: 'Loja A', totalSales: 150000, orders: 347, avgOrderValue: 432.27, growth: 24 },
  { id: 2, storeName: 'Loja B', totalSales: 89000, orders: 201, avgOrderValue: 442.78, growth: 12 },
  { id: 3, storeName: 'Loja C', totalSales: 72500, orders: 158, avgOrderValue: 458.86, growth: -8 },
  { id: 4, storeName: 'Loja D', totalSales: 54300, orders: 136, avgOrderValue: 399.26, growth: 5 },
  { id: 5, storeName: 'Loja E', totalSales: 45800, orders: 117, avgOrderValue: 391.45, growth: -2 },
  { id: 6, storeName: 'Loja F', totalSales: 35600, orders: 95, avgOrderValue: 374.73, growth: 7 },
  { id: 7, storeName: 'Loja G', totalSales: 27400, orders: 78, avgOrderValue: 351.28, growth: 3 },
];

// Prepare chart data
const chartData = mockData.map(item => ({
  name: item.storeName,
  value: item.totalSales,
})).sort((a, b) => b.value - a.value);

export const AdminReportStoresSales: React.FC<AdminReportStoresSalesProps> = ({ 
  dateRange,
  selectedStore,
  selectedGateway,
  selectedPaymentType
}) => {
  // In a real app, we would filter the data based on the provided filters
  const filteredData = mockData.sort((a, b) => b.totalSales - a.totalSales);
  
  return (
    <div className="space-y-6">
      <div className="text-sm text-gray-400">
        <p>Mostrando dados {dateRange?.from && `de ${dateRange.from.toLocaleDateString('pt-BR')}`} {dateRange?.to && `até ${dateRange.to.toLocaleDateString('pt-BR')}`}</p>
      </div>
      
      {/* Chart */}
      <div className="bg-[#262626] border border-white/5 rounded-lg p-4 h-80">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart
            data={chartData}
            margin={{
              top: 20,
              right: 30,
              left: 20,
              bottom: 5,
            }}
          >
            <CartesianGrid strokeDasharray="3 3" stroke="#444" />
            <XAxis dataKey="name" stroke="#888" />
            <YAxis 
              stroke="#888" 
              tickFormatter={(value) => value >= 1000 
                ? `R$${(value / 1000).toFixed(0)}k` 
                : `R$${value}`} 
            />
            <Tooltip 
              formatter={(value) => [`${formatCurrency(Number(value))}`, 'Vendas']}
              contentStyle={{ backgroundColor: '#333', border: 'none' }}
            />
            <Bar dataKey="value" fill="#10B981" radius={[4, 4, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>
      
      {/* Table */}
      <div>
        <Table>
          <TableHeader className="bg-[#262626]">
            <TableRow>
              <TableHead className="text-gray-300">Loja</TableHead>
              <TableHead className="text-gray-300 text-right">Total de Vendas</TableHead>
              <TableHead className="text-gray-300 text-right">Pedidos</TableHead>
              <TableHead className="text-gray-300 text-right">Valor Médio</TableHead>
              <TableHead className="text-gray-300 text-right">Crescimento</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredData.map((store) => (
              <TableRow key={store.id} className="hover:bg-[#2A2A2A] border-t border-white/5">
                <TableCell className="font-medium text-white">{store.storeName}</TableCell>
                <TableCell className="text-white text-right">{formatCurrency(store.totalSales)}</TableCell>
                <TableCell className="text-white text-right">{store.orders}</TableCell>
                <TableCell className="text-white text-right">{formatCurrency(store.avgOrderValue)}</TableCell>
                <TableCell className="text-right">
                  <span className={`inline-flex items-center gap-1 font-medium ${store.growth >= 0 ? 'text-emerald-500' : 'text-red-500'}`}>
                    {store.growth >= 0 ? '+' : ''}{store.growth}%
                  </span>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
};
