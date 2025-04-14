
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
  Legend
} from 'recharts';

interface AdminReportGatewaysProps {
  dateRange?: DateRange;
  selectedStore: string;
  selectedGateway: string;
  selectedPaymentType: string;
}

const mockData = [
  { id: 1, gateway: 'Mercado Pago', totalSales: 235000, orders: 587, conversionRate: 92.4, avgFee: 2.99 },
  { id: 2, gateway: 'PagSeguro', totalSales: 178000, orders: 402, conversionRate: 88.7, avgFee: 3.49 },
  { id: 3, gateway: 'Stripe', totalSales: 136500, orders: 309, conversionRate: 95.2, avgFee: 3.19 },
  { id: 4, gateway: 'PayPal', totalSales: 98700, orders: 245, conversionRate: 87.5, avgFee: 4.29 },
  { id: 5, gateway: 'Pix Direto', totalSales: 75200, orders: 185, conversionRate: 98.3, avgFee: 0.99 },
];

// Prepare chart data
const chartData = [
  {
    name: 'Volume de Vendas',
    'Mercado Pago': 235000,
    'PagSeguro': 178000,
    'Stripe': 136500,
    'PayPal': 98700,
    'Pix Direto': 75200,
  },
  {
    name: 'Número de Pedidos',
    'Mercado Pago': 587,
    'PagSeguro': 402,
    'Stripe': 309,
    'PayPal': 245,
    'Pix Direto': 185,
  },
];

const COLORS = ['#10B981', '#0E9F6E', '#0C8A5B', '#0A7548', '#096040'];

export const AdminReportGateways: React.FC<AdminReportGatewaysProps> = ({ 
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
            <YAxis stroke="#888" />
            <Tooltip contentStyle={{ backgroundColor: '#333', border: 'none' }} />
            <Legend />
            {filteredData.map((item, index) => (
              <Bar 
                key={item.gateway}
                dataKey={item.gateway} 
                fill={COLORS[index % COLORS.length]} 
                radius={[4, 4, 0, 0]}
              />
            ))}
          </BarChart>
        </ResponsiveContainer>
      </div>
      
      {/* Table */}
      <div>
        <Table>
          <TableHeader className="bg-[#262626]">
            <TableRow>
              <TableHead className="text-gray-300">Gateway</TableHead>
              <TableHead className="text-gray-300 text-right">Volume Processado</TableHead>
              <TableHead className="text-gray-300 text-right">Pedidos</TableHead>
              <TableHead className="text-gray-300 text-right">Taxa de Conversão</TableHead>
              <TableHead className="text-gray-300 text-right">Taxa Média</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredData.map((gateway) => (
              <TableRow key={gateway.id} className="hover:bg-[#2A2A2A] border-t border-white/5">
                <TableCell className="font-medium text-white">{gateway.gateway}</TableCell>
                <TableCell className="text-white text-right">{formatCurrency(gateway.totalSales)}</TableCell>
                <TableCell className="text-white text-right">{gateway.orders}</TableCell>
                <TableCell className="text-white text-right">{gateway.conversionRate}%</TableCell>
                <TableCell className="text-white text-right">{gateway.avgFee}%</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
};
