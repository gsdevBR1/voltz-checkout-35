
import React, { useState } from 'react';
import { 
  Calendar, 
  Download, 
  FileSpreadsheet, 
  FilePdf, 
  Store, 
  CreditCard,
  BarChart3,
  Filter,
  Save,
  Clock,
  RefreshCcw,
  ChevronDown
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { DatePickerWithRange } from '@/components/ui/date-picker';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { DateRange } from 'react-day-picker';
import { FunnelChart } from '@/components/ui/funnel-chart';
import { formatCurrency } from '@/lib/utils';
import { ChartContainer, ChartLegend, ChartLegendContent } from '@/components/ui/chart';
import { 
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { AdminReportStoresSales } from '@/components/admin/reports/AdminReportStoresSales';
import { AdminReportStoresFees } from '@/components/admin/reports/AdminReportStoresFees';
import { AdminReportGateways } from '@/components/admin/reports/AdminReportGateways';
import { AdminReportRefunds } from '@/components/admin/reports/AdminReportRefunds';
import { AdminReportConversion } from '@/components/admin/reports/AdminReportConversion';
import { AdminReportTrafficSources } from '@/components/admin/reports/AdminReportTrafficSources';
import { toast } from 'sonner';

type ReportPeriod = 'today' | '7days' | '30days' | 'custom';

const reportTabs = [
  { id: 'sales', label: 'Vendas por Loja', description: 'Total vendido por loja em um período' },
  { id: 'fees', label: 'Taxas Arrecadadas', description: 'Total de taxas geradas (baseado na % do plano ativo)' },
  { id: 'gateways', label: 'Gateways com Maior Volume', description: 'Comparativo entre gateways utilizados' },
  { id: 'refunds', label: 'Lojas com Mais Reembolsos', description: 'Indicador de qualidade operacional por loja' },
  { id: 'conversion', label: 'Checkouts com Maior Conversão', description: 'Mostra os checkouts com melhor desempenho de conversão' },
  { id: 'traffic', label: 'Conversão por Canal de Tráfego', description: 'Lista os parâmetros UTM e taxas de conversão por campanha' },
];

// Mock data for stores
const mockStores = [
  { id: 'store-1', name: 'Loja 1' },
  { id: 'store-2', name: 'Loja 2' },
  { id: 'store-3', name: 'Loja 3' },
  { id: 'all', name: 'Todas as lojas' },
];

// Mock data for gateways
const mockGateways = [
  { id: 'mercadopago', name: 'Mercado Pago' },
  { id: 'pagseguro', name: 'PagSeguro' },
  { id: 'stripe', name: 'Stripe' },
  { id: 'all', name: 'Todos os gateways' },
];

// Mock data for payment types
const mockPaymentTypes = [
  { id: 'pix', name: 'Pix' },
  { id: 'card', name: 'Cartão' },
  { id: 'boleto', name: 'Boleto' },
  { id: 'all', name: 'Todos os tipos' },
];

const AdminReportsExports: React.FC = () => {
  const [activeTab, setActiveTab] = useState('sales');
  const [period, setPeriod] = useState<ReportPeriod>('30days');
  const [dateRange, setDateRange] = useState<DateRange | undefined>({
    from: new Date(new Date().setDate(new Date().getDate() - 30)),
    to: new Date(),
  });
  const [selectedStore, setSelectedStore] = useState('all');
  const [selectedGateway, setSelectedGateway] = useState('all');
  const [selectedPaymentType, setSelectedPaymentType] = useState('all');
  const [saveFilterDialogOpen, setSaveFilterDialogOpen] = useState(false);
  const [filterName, setFilterName] = useState('');
  const [savedFilters, setSavedFilters] = useState<string[]>([]);
  
  const handleExportCsv = () => {
    toast.success("Seu relatório foi gerado com sucesso", {
      description: "O arquivo será baixado em instantes.",
    });
  };
  
  const handleExportPdf = () => {
    toast.success("Seu relatório foi gerado com sucesso", {
      description: "O arquivo será baixado em instantes.",
    });
  };
  
  const handleSaveFilter = () => {
    if (filterName.trim()) {
      setSavedFilters([...savedFilters, filterName.trim()]);
      setFilterName('');
      setSaveFilterDialogOpen(false);
      toast.success("Filtro salvo com sucesso", {
        description: `O filtro "${filterName}" foi salvo e está disponível para uso.`,
      });
    }
  };
  
  const handlePeriodChange = (value: string) => {
    setPeriod(value as ReportPeriod);
    
    const today = new Date();
    let from = today;
    
    switch (value) {
      case 'today':
        from = today;
        break;
      case '7days':
        from = new Date(today);
        from.setDate(today.getDate() - 7);
        break;
      case '30days':
        from = new Date(today);
        from.setDate(today.getDate() - 30);
        break;
      case 'custom':
        // Don't change the date range for custom
        return;
    }
    
    setDateRange({ from, to: today });
  };
  
  return (
    <div className="space-y-6 p-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-white">Relatórios & Exportações</h1>
          <p className="text-gray-400 mt-1">Visualize e exporte dados consolidados da plataforma</p>
        </div>
      </div>
      
      {/* Global Filters */}
      <Card className="bg-[#1E1E1E] border-white/5 shadow-md">
        <CardHeader className="pb-3">
          <CardTitle className="text-white flex items-center gap-2">
            <Filter className="h-5 w-5" />
            Filtros
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
            {/* Period Filter */}
            <div className="space-y-2">
              <label className="text-sm text-gray-400">Período</label>
              <Select value={period} onValueChange={handlePeriodChange}>
                <SelectTrigger className="bg-[#262626] border-white/5">
                  <div className="flex items-center">
                    <Calendar className="h-4 w-4 mr-2 text-gray-400" />
                    <SelectValue placeholder="Selecione o período" />
                  </div>
                </SelectTrigger>
                <SelectContent className="bg-[#262626] border-white/5">
                  <SelectItem value="today">Hoje</SelectItem>
                  <SelectItem value="7days">Últimos 7 dias</SelectItem>
                  <SelectItem value="30days">Últimos 30 dias</SelectItem>
                  <SelectItem value="custom">Personalizado</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            {/* Date Range Picker (visible only when period is 'custom') */}
            <div className={`space-y-2 ${period !== 'custom' ? 'hidden' : ''}`}>
              <label className="text-sm text-gray-400">Intervalo de datas</label>
              <DatePickerWithRange
                selected={dateRange}
                onSelect={setDateRange}
                className="bg-[#262626] border-white/5"
              />
            </div>
            
            {/* Store Filter */}
            <div className="space-y-2">
              <label className="text-sm text-gray-400">Loja</label>
              <Select value={selectedStore} onValueChange={setSelectedStore}>
                <SelectTrigger className="bg-[#262626] border-white/5">
                  <div className="flex items-center">
                    <Store className="h-4 w-4 mr-2 text-gray-400" />
                    <SelectValue placeholder="Selecione a loja" />
                  </div>
                </SelectTrigger>
                <SelectContent className="bg-[#262626] border-white/5">
                  {mockStores.map(store => (
                    <SelectItem key={store.id} value={store.id}>{store.name}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            {/* Gateway Filter */}
            <div className="space-y-2">
              <label className="text-sm text-gray-400">Gateway</label>
              <Select value={selectedGateway} onValueChange={setSelectedGateway}>
                <SelectTrigger className="bg-[#262626] border-white/5">
                  <div className="flex items-center">
                    <CreditCard className="h-4 w-4 mr-2 text-gray-400" />
                    <SelectValue placeholder="Selecione o gateway" />
                  </div>
                </SelectTrigger>
                <SelectContent className="bg-[#262626] border-white/5">
                  {mockGateways.map(gateway => (
                    <SelectItem key={gateway.id} value={gateway.id}>{gateway.name}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            {/* Payment Type Filter */}
            <div className="space-y-2">
              <label className="text-sm text-gray-400">Tipo de Pagamento</label>
              <Select value={selectedPaymentType} onValueChange={setSelectedPaymentType}>
                <SelectTrigger className="bg-[#262626] border-white/5">
                  <div className="flex items-center">
                    <BarChart3 className="h-4 w-4 mr-2 text-gray-400" />
                    <SelectValue placeholder="Selecione o tipo" />
                  </div>
                </SelectTrigger>
                <SelectContent className="bg-[#262626] border-white/5">
                  {mockPaymentTypes.map(type => (
                    <SelectItem key={type.id} value={type.id}>{type.name}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
          
          {/* Filter Actions */}
          <div className="flex justify-between mt-6">
            <div className="flex items-center gap-2">
              <Button 
                variant="outline" 
                size="sm" 
                className="gap-2 bg-[#262626] border-white/10 hover:bg-[#333]"
                onClick={() => setSaveFilterDialogOpen(true)}
              >
                <Save className="h-4 w-4" />
                Salvar Filtro
              </Button>
              
              {savedFilters.length > 0 && (
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button 
                      variant="outline" 
                      size="sm" 
                      className="gap-2 bg-[#262626] border-white/10 hover:bg-[#333]"
                    >
                      <Clock className="h-4 w-4" />
                      Filtros Salvos
                      <ChevronDown className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent className="bg-[#262626] border-white/10">
                    <DropdownMenuLabel className="text-gray-300">Seus filtros salvos</DropdownMenuLabel>
                    <DropdownMenuSeparator className="bg-white/10" />
                    {savedFilters.map((filter, index) => (
                      <DropdownMenuItem 
                        key={index} 
                        className="cursor-pointer hover:bg-[#333] text-gray-300"
                      >
                        {filter}
                      </DropdownMenuItem>
                    ))}
                  </DropdownMenuContent>
                </DropdownMenu>
              )}
            </div>
            
            <Button 
              variant="outline" 
              size="sm" 
              className="gap-2 bg-[#262626] border-white/10 hover:bg-[#333]"
              onClick={() => {
                // Reset filters
                setPeriod('30days');
                setSelectedStore('all');
                setSelectedGateway('all');
                setSelectedPaymentType('all');
                setDateRange({
                  from: new Date(new Date().setDate(new Date().getDate() - 30)),
                  to: new Date(),
                });
              }}
            >
              <RefreshCcw className="h-4 w-4" />
              Limpar Filtros
            </Button>
          </div>
        </CardContent>
      </Card>
      
      {/* Reports Content */}
      <Card className="bg-[#1E1E1E] border-white/5 shadow-md overflow-hidden">
        <CardHeader>
          <div className="flex justify-between items-center mb-2">
            <CardTitle className="text-white">Relatórios</CardTitle>
            <div className="flex gap-2">
              <Button 
                variant="outline" 
                className="gap-2 bg-[#262626] border-white/10 hover:bg-[#333]"
                onClick={handleExportCsv}
              >
                <FileSpreadsheet className="h-4 w-4" />
                Exportar CSV
              </Button>
              <Button 
                variant="outline" 
                className="gap-2 bg-[#262626] border-white/10 hover:bg-[#333]"
                onClick={handleExportPdf}
              >
                <FilePdf className="h-4 w-4" />
                Exportar PDF
              </Button>
            </div>
          </div>
        </CardHeader>
        
        <Tabs defaultValue="sales" value={activeTab} onValueChange={setActiveTab}>
          <div className="px-6">
            <TabsList className="bg-[#262626] w-full justify-start overflow-x-auto">
              {reportTabs.map(tab => (
                <TabsTrigger 
                  key={tab.id} 
                  value={tab.id}
                  className="data-[state=active]:bg-[#333] data-[state=active]:text-white"
                >
                  {tab.label}
                </TabsTrigger>
              ))}
            </TabsList>
          </div>
          
          <CardContent className="pt-6">
            <TabsContent value="sales" className="m-0">
              <AdminReportStoresSales 
                dateRange={dateRange} 
                selectedStore={selectedStore}
                selectedGateway={selectedGateway}
                selectedPaymentType={selectedPaymentType}
              />
            </TabsContent>
            
            <TabsContent value="fees" className="m-0">
              <AdminReportStoresFees 
                dateRange={dateRange} 
                selectedStore={selectedStore}
                selectedGateway={selectedGateway}
                selectedPaymentType={selectedPaymentType}
              />
            </TabsContent>
            
            <TabsContent value="gateways" className="m-0">
              <AdminReportGateways 
                dateRange={dateRange} 
                selectedStore={selectedStore}
                selectedGateway={selectedGateway}
                selectedPaymentType={selectedPaymentType}
              />
            </TabsContent>
            
            <TabsContent value="refunds" className="m-0">
              <AdminReportRefunds 
                dateRange={dateRange} 
                selectedStore={selectedStore}
                selectedGateway={selectedGateway}
                selectedPaymentType={selectedPaymentType}
              />
            </TabsContent>
            
            <TabsContent value="conversion" className="m-0">
              <AdminReportConversion 
                dateRange={dateRange} 
                selectedStore={selectedStore}
                selectedGateway={selectedGateway}
                selectedPaymentType={selectedPaymentType}
              />
            </TabsContent>
            
            <TabsContent value="traffic" className="m-0">
              <AdminReportTrafficSources 
                dateRange={dateRange} 
                selectedStore={selectedStore}
                selectedGateway={selectedGateway}
                selectedPaymentType={selectedPaymentType}
              />
            </TabsContent>
          </CardContent>
        </Tabs>
      </Card>
      
      {/* Save Filter Dialog */}
      <Dialog open={saveFilterDialogOpen} onOpenChange={setSaveFilterDialogOpen}>
        <DialogContent className="bg-[#1E1E1E] border-white/5 text-white">
          <DialogHeader>
            <DialogTitle>Salvar Filtro</DialogTitle>
            <DialogDescription className="text-gray-400">
              Dê um nome para este conjunto de filtros para reutilizá-lo no futuro.
            </DialogDescription>
          </DialogHeader>
          <div className="flex items-center gap-2 py-4">
            <input 
              type="text" 
              placeholder="Nome do filtro" 
              className="flex-1 bg-[#262626] border border-white/10 rounded-md py-2 px-3 text-white placeholder-gray-500 focus:outline-none focus:ring-1 focus:ring-[#10B981] focus:border-[#10B981]"
              value={filterName}
              onChange={(e) => setFilterName(e.target.value)}
            />
          </div>
          <DialogFooter>
            <Button 
              variant="ghost" 
              onClick={() => setSaveFilterDialogOpen(false)}
              className="text-gray-300 hover:bg-[#2A2A2A] hover:text-white"
            >
              Cancelar
            </Button>
            <Button onClick={handleSaveFilter}>Salvar</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default AdminReportsExports;
