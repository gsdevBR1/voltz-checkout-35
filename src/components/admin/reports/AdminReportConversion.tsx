
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
import { FunnelChart } from '@/components/ui/funnel-chart';
import { formatCurrency } from '@/lib/utils';

interface AdminReportConversionProps {
  dateRange?: DateRange;
  selectedStore: string;
  selectedGateway: string;
  selectedPaymentType: string;
}

const mockData = [
  { id: 1, checkoutName: 'Checkout A', storeName: 'Loja A', visits: 12500, carts: 4375, checkouts: 2187, sales: 1421, conversionRate: 11.37 },
  { id: 2, checkoutName: 'Checkout B', storeName: 'Loja B', visits: 8900, carts: 2848, checkouts: 1282, sales: 731, conversionRate: 8.21 },
  { id: 3, checkoutName: 'Checkout C', storeName: 'Loja C', visits: 7550, carts: 2793, checkouts: 1538, sales: 1123, conversionRate: 14.87 },
  { id: 4, checkoutName: 'Checkout D', storeName: 'Loja D', visits: 6320, carts: 2086, checkouts: 1054, sales: 685, conversionRate: 10.84 },
  { id: 5, checkoutName: 'Checkout E', storeName: 'Loja E', visits: 5480, carts: 1808, checkouts: 921, sales: 526, conversionRate: 9.60 },
  { id: 6, checkoutName: 'Checkout F', storeName: 'Loja F', visits: 4730, carts: 1419, checkouts: 638, sales: 243, conversionRate: 5.14 },
  { id: 7, checkoutName: 'Checkout G', storeName: 'Loja G', visits: 3850, carts: 1309, checkouts: 723, sales: 498, conversionRate: 12.94 },
];

// Prepare funnel data
const prepareFunnelData = (data: any) => {
  // Get totals for each stage
  const visits = data.reduce((sum: number, item: any) => sum + item.visits, 0);
  const carts = data.reduce((sum: number, item: any) => sum + item.carts, 0);
  const checkouts = data.reduce((sum: number, item: any) => sum + item.checkouts, 0);
  const sales = data.reduce((sum: number, item: any) => sum + item.sales, 0);
  
  return [
    { name: 'Visitas', value: visits, percentage: 100 },
    { name: 'Carrinho Iniciado', value: carts, percentage: Math.round((carts / visits) * 100) },
    { name: 'Checkout Iniciado', value: checkouts, percentage: Math.round((checkouts / visits) * 100) },
    { name: 'Vendas Concluídas', value: sales, percentage: Math.round((sales / visits) * 100) },
  ];
};

export const AdminReportConversion: React.FC<AdminReportConversionProps> = ({ 
  dateRange,
  selectedStore,
  selectedGateway,
  selectedPaymentType
}) => {
  // In a real app, we would filter the data based on the provided filters
  const filteredData = mockData.sort((a, b) => b.conversionRate - a.conversionRate);
  
  // Calculate overall conversion rate
  const totalVisits = filteredData.reduce((sum, item) => sum + item.visits, 0);
  const totalSales = filteredData.reduce((sum, item) => sum + item.sales, 0);
  const overallConversionRate = ((totalSales / totalVisits) * 100).toFixed(2);
  
  const funnelData = prepareFunnelData(filteredData);
  
  return (
    <div className="space-y-6">
      <div className="text-sm text-gray-400">
        <p>Mostrando dados {dateRange?.from && `de ${dateRange.from.toLocaleDateString('pt-BR')}`} {dateRange?.to && `até ${dateRange.to.toLocaleDateString('pt-BR')}`}</p>
      </div>
      
      {/* Overall Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-[#262626] border border-white/5 rounded-lg p-6">
          <div className="text-gray-400 text-sm">Taxa de Conversão Média</div>
          <div className="text-3xl font-bold text-white mt-2">{overallConversionRate}%</div>
          <div className="text-sm text-gray-400 mt-1">Visitas para Vendas</div>
        </div>
        
        <div className="bg-[#262626] border border-white/5 rounded-lg p-6">
          <div className="text-gray-400 text-sm">Total de Visitas</div>
          <div className="text-3xl font-bold text-white mt-2">{totalVisits.toLocaleString()}</div>
          <div className="text-sm text-gray-400 mt-1">No período selecionado</div>
        </div>
        
        <div className="bg-[#262626] border border-white/5 rounded-lg p-6">
          <div className="text-gray-400 text-sm">Total de Vendas</div>
          <div className="text-3xl font-bold text-white mt-2">{totalSales.toLocaleString()}</div>
          <div className="text-sm text-gray-400 mt-1">No período selecionado</div>
        </div>
      </div>
      
      {/* Funnel Chart */}
      <div className="bg-[#262626] border border-white/5 rounded-lg p-6">
        <h3 className="text-lg font-medium text-white mb-4">Funil de Conversão</h3>
        <FunnelChart data={funnelData} className="max-w-xl mx-auto" />
      </div>
      
      {/* Table */}
      <div>
        <Table>
          <TableHeader className="bg-[#262626]">
            <TableRow>
              <TableHead className="text-gray-300">Checkout</TableHead>
              <TableHead className="text-gray-300">Loja</TableHead>
              <TableHead className="text-gray-300 text-right">Visitas</TableHead>
              <TableHead className="text-gray-300 text-right">Carrinhos</TableHead>
              <TableHead className="text-gray-300 text-right">Checkouts</TableHead>
              <TableHead className="text-gray-300 text-right">Vendas</TableHead>
              <TableHead className="text-gray-300 text-right">Taxa de Conversão</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredData.map((checkout) => (
              <TableRow key={checkout.id} className="hover:bg-[#2A2A2A] border-t border-white/5">
                <TableCell className="font-medium text-white">{checkout.checkoutName}</TableCell>
                <TableCell className="text-white">{checkout.storeName}</TableCell>
                <TableCell className="text-white text-right">{checkout.visits.toLocaleString()}</TableCell>
                <TableCell className="text-white text-right">{checkout.carts.toLocaleString()}</TableCell>
                <TableCell className="text-white text-right">{checkout.checkouts.toLocaleString()}</TableCell>
                <TableCell className="text-white text-right">{checkout.sales.toLocaleString()}</TableCell>
                <TableCell className="text-white text-right">
                  <span className={`font-medium ${checkout.conversionRate > 10 ? 'text-emerald-500' : 'text-white'}`}>
                    {checkout.conversionRate}%
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
