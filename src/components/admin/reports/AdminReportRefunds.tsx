
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
  ComposedChart,
  Line,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';

interface AdminReportRefundsProps {
  dateRange?: DateRange;
  selectedStore: string;
  selectedGateway: string;
  selectedPaymentType: string;
}

const mockData = [
  { id: 1, storeName: 'Loja A', totalSales: 150000, refunds: 3750, refundRate: 2.5, refundCount: 8 },
  { id: 2, storeName: 'Loja B', totalSales: 89000, refunds: 4450, refundRate: 5.0, refundCount: 11 },
  { id: 3, storeName: 'Loja C', totalSales: 72500, refunds: 2175, refundRate: 3.0, refundCount: 6 },
  { id: 4, storeName: 'Loja D', totalSales: 54300, refunds: 3258, refundRate: 6.0, refundCount: 9 },
  { id: 5, storeName: 'Loja E', totalSales: 45800, refunds: 1374, refundRate: 3.0, refundCount: 4 },
  { id: 6, storeName: 'Loja F', totalSales: 35600, refunds: 2848, refundRate: 8.0, refundCount: 7 },
  { id: 7, storeName: 'Loja G', totalSales: 27400, refunds: 548, refundRate: 2.0, refundCount: 2 },
];

// Prepare chart data
const chartData = mockData.map(item => ({
  name: item.storeName,
  refunds: item.refunds,
  rate: item.refundRate,
})).sort((a, b) => b.refunds - a.refunds);

export const AdminReportRefunds: React.FC<AdminReportRefundsProps> = ({ 
  dateRange,
  selectedStore,
  selectedGateway,
  selectedPaymentType
}) => {
  // In a real app, we would filter the data based on the provided filters
  const filteredData = mockData.sort((a, b) => b.refundRate - a.refundRate);
  
  // Calculate total refunds
  const totalRefunds = filteredData.reduce((sum, item) => sum + item.refunds, 0);
  const avgRefundRate = (filteredData.reduce((sum, item) => sum + item.refundRate, 0) / filteredData.length).toFixed(1);
  
  return (
    <div className="space-y-6">
      <div className="text-sm text-gray-400">
        <p>Mostrando dados {dateRange?.from && `de ${dateRange.from.toLocaleDateString('pt-BR')}`} {dateRange?.to && `até ${dateRange.to.toLocaleDateString('pt-BR')}`}</p>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Total Refunds Card */}
        <div className="bg-[#262626] border border-white/5 rounded-lg p-6">
          <div className="text-gray-400 text-sm">Total de Reembolsos</div>
          <div className="text-3xl font-bold text-white mt-2">{formatCurrency(totalRefunds)}</div>
          <div className="text-sm text-gray-400 mt-1">No período selecionado</div>
        </div>
        
        {/* Avg Refund Rate Card */}
        <div className="bg-[#262626] border border-white/5 rounded-lg p-6">
          <div className="text-gray-400 text-sm">Taxa Média de Reembolso</div>
          <div className="text-3xl font-bold text-white mt-2">{avgRefundRate}%</div>
          <div className="text-sm text-gray-400 mt-1">Média entre todas as lojas</div>
        </div>
      </div>
      
      {/* Chart */}
      <div className="bg-[#262626] border border-white/5 rounded-lg p-4 h-80">
        <ResponsiveContainer width="100%" height="100%">
          <ComposedChart
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
              yAxisId="left" 
              orientation="left" 
              stroke="#888" 
              tickFormatter={(value) => `R$${(value / 1000).toFixed(0)}k`} 
            />
            <YAxis yAxisId="right" orientation="right" stroke="#888" unit="%" />
            <Tooltip contentStyle={{ backgroundColor: '#333', border: 'none' }} />
            <Legend />
            <Bar yAxisId="left" dataKey="refunds" name="Valor de Reembolsos" fill="#F97316" radius={[4, 4, 0, 0]} />
            <Line yAxisId="right" type="monotone" dataKey="rate" name="Taxa de Reembolso (%)" stroke="#9333EA" strokeWidth={2} />
          </ComposedChart>
        </ResponsiveContainer>
      </div>
      
      {/* Table */}
      <div>
        <Table>
          <TableHeader className="bg-[#262626]">
            <TableRow>
              <TableHead className="text-gray-300">Loja</TableHead>
              <TableHead className="text-gray-300 text-right">Total de Vendas</TableHead>
              <TableHead className="text-gray-300 text-right">Valor de Reembolsos</TableHead>
              <TableHead className="text-gray-300 text-right">Taxa de Reembolso</TableHead>
              <TableHead className="text-gray-300 text-right">Qtd de Reembolsos</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredData.map((store) => (
              <TableRow key={store.id} className="hover:bg-[#2A2A2A] border-t border-white/5">
                <TableCell className="font-medium text-white">{store.storeName}</TableCell>
                <TableCell className="text-white text-right">{formatCurrency(store.totalSales)}</TableCell>
                <TableCell className="text-white text-right">{formatCurrency(store.refunds)}</TableCell>
                <TableCell className="text-white text-right">
                  <span className={`font-medium ${store.refundRate > 5 ? 'text-red-500' : 'text-white'}`}>
                    {store.refundRate}%
                  </span>
                </TableCell>
                <TableCell className="text-white text-right">{store.refundCount}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
};
