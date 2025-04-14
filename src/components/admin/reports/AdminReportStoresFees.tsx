
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
  ResponsiveContainer,
  Legend
} from 'recharts';

interface AdminReportStoresFeesProps {
  dateRange?: DateRange;
  selectedStore: string;
  selectedGateway: string;
  selectedPaymentType: string;
}

const mockData = [
  { id: 1, storeName: 'Loja A', totalSales: 150000, fees: 7500, feesPercentage: 5, planName: 'Premium' },
  { id: 2, storeName: 'Loja B', totalSales: 89000, fees: 5340, feesPercentage: 6, planName: 'Basic' },
  { id: 3, storeName: 'Loja C', totalSales: 72500, fees: 3625, feesPercentage: 5, planName: 'Premium' },
  { id: 4, storeName: 'Loja D', totalSales: 54300, fees: 3258, feesPercentage: 6, planName: 'Basic' },
  { id: 5, storeName: 'Loja E', totalSales: 45800, fees: 1832, feesPercentage: 4, planName: 'Enterprise' },
  { id: 6, storeName: 'Loja F', totalSales: 35600, fees: 2136, feesPercentage: 6, planName: 'Basic' },
  { id: 7, storeName: 'Loja G', totalSales: 27400, fees: 1370, feesPercentage: 5, planName: 'Premium' },
];

// Prepare chart data for fees by store
const chartData = mockData.map(item => ({
  name: item.storeName,
  value: item.fees,
})).sort((a, b) => b.value - a.value);

const COLORS = ['#10B981', '#0E9F6E', '#0C8A5B', '#0A7548', '#096040', '#075038', '#064030'];

export const AdminReportStoresFees: React.FC<AdminReportStoresFeesProps> = ({ 
  dateRange,
  selectedStore,
  selectedGateway,
  selectedPaymentType
}) => {
  // In a real app, we would filter the data based on the provided filters
  const filteredData = mockData.sort((a, b) => b.fees - a.fees);
  
  // Calculate total fees
  const totalFees = filteredData.reduce((sum, item) => sum + item.fees, 0);
  
  return (
    <div className="space-y-6">
      <div className="text-sm text-gray-400">
        <p>Mostrando dados {dateRange?.from && `de ${dateRange.from.toLocaleDateString('pt-BR')}`} {dateRange?.to && `até ${dateRange.to.toLocaleDateString('pt-BR')}`}</p>
      </div>
      
      <div className="flex flex-col md:flex-row gap-6">
        {/* Total Fees Card */}
        <div className="bg-[#262626] border border-white/5 rounded-lg p-6 md:w-1/4">
          <div className="text-gray-400 text-sm">Total de Taxas Arrecadadas</div>
          <div className="text-3xl font-bold text-white mt-2">{formatCurrency(totalFees)}</div>
          <div className="text-sm text-gray-400 mt-1">No período selecionado</div>
        </div>
        
        {/* Chart */}
        <div className="bg-[#262626] border border-white/5 rounded-lg p-4 flex-1 h-72 md:h-auto">
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
                formatter={(value) => [`${formatCurrency(Number(value))}`, 'Taxas']}
                contentStyle={{ backgroundColor: '#333', border: 'none' }}
              />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>
      
      {/* Table */}
      <div>
        <Table>
          <TableHeader className="bg-[#262626]">
            <TableRow>
              <TableHead className="text-gray-300">Loja</TableHead>
              <TableHead className="text-gray-300">Plano</TableHead>
              <TableHead className="text-gray-300 text-right">Total de Vendas</TableHead>
              <TableHead className="text-gray-300 text-right">Taxa (%)</TableHead>
              <TableHead className="text-gray-300 text-right">Taxas Arrecadadas</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredData.map((store) => (
              <TableRow key={store.id} className="hover:bg-[#2A2A2A] border-t border-white/5">
                <TableCell className="font-medium text-white">{store.storeName}</TableCell>
                <TableCell className="text-white">{store.planName}</TableCell>
                <TableCell className="text-white text-right">{formatCurrency(store.totalSales)}</TableCell>
                <TableCell className="text-white text-right">{store.feesPercentage}%</TableCell>
                <TableCell className="text-white text-right">{formatCurrency(store.fees)}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
};
