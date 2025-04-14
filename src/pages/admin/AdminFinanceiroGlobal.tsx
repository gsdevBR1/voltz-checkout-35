
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  Search, 
  Calendar, 
  Download, 
  Store, 
  CheckCircle, 
  XCircle, 
  Clock, 
  ArrowDown, 
  ArrowUp, 
  Eye, 
  FileText, 
  CreditCard, 
  AlertCircle, 
  Percent, 
  CircleDollarSign, 
  Zap, 
  Settings
} from 'lucide-react';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { 
  Dialog, 
  DialogContent, 
  DialogDescription, 
  DialogFooter, 
  DialogHeader, 
  DialogTitle 
} from "@/components/ui/dialog";
import { 
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { useToast } from "@/hooks/use-toast";
import { formatCurrency, formatDateTime } from '@/lib/utils';
import { Pagination, PaginationContent, PaginationItem, PaginationLink, PaginationNext, PaginationPrevious } from "@/components/ui/pagination";

// Tipos de dados
type TransactionType = 'Venda' | 'Taxa VOLTZ' | 'Reembolso' | 'Estorno';
type TransactionStatus = 'Aprovado' | 'Pendente' | 'Recusado' | 'Em análise' | 'Confirmado' | 'Cancelado';
type CycleStatus = 'Em dia' | 'Estourado' | 'Sem cartão';

interface Transaction {
  id: string;
  date: Date;
  store: string;
  type: TransactionType;
  gateway: string;
  amount: number;
  status: TransactionStatus;
  isIncoming: boolean;
}

interface Refund {
  id: string;
  orderId: string;
  store: string;
  amount: number;
  reason: string;
  status: TransactionStatus;
  date: Date;
}

interface Chargeback {
  id: string;
  orderId: string;
  store: string;
  amount: number;
  date: Date;
  status: TransactionStatus;
}

interface BillingCycle {
  id: string;
  store: string;
  cycleLimit: number;
  accumulated: number;
  status: CycleStatus;
  nextCharge: Date;
  lastChargeAttempt?: {
    date: Date;
    status: 'Sucesso' | 'Falha';
    message?: string;
  };
}

// Dados de exemplo
const mockTransactions: Transaction[] = [
  {
    id: 'TR0001',
    date: new Date(2023, 3, 15, 14, 30),
    store: 'Loja Fashion',
    type: 'Venda',
    gateway: 'Mercado Pago',
    amount: 1299.90,
    status: 'Aprovado',
    isIncoming: true
  },
  {
    id: 'TR0002',
    date: new Date(2023, 3, 15, 14, 31),
    store: 'Loja Fashion',
    type: 'Taxa VOLTZ',
    gateway: 'Interno',
    amount: 32.50,
    status: 'Aprovado',
    isIncoming: false
  },
  {
    id: 'TR0003',
    date: new Date(2023, 3, 16, 10, 20),
    store: 'TechGadgets',
    type: 'Venda',
    gateway: 'Pix',
    amount: 4599.90,
    status: 'Aprovado',
    isIncoming: true
  },
  {
    id: 'TR0004',
    date: new Date(2023, 3, 16, 10, 21),
    store: 'TechGadgets',
    type: 'Taxa VOLTZ',
    gateway: 'Interno',
    amount: 115.00,
    status: 'Aprovado',
    isIncoming: false
  },
  {
    id: 'TR0005',
    date: new Date(2023, 3, 17, 9, 15),
    store: 'Loja Fashion',
    type: 'Reembolso',
    gateway: 'Mercado Pago',
    amount: 1299.90,
    status: 'Aprovado',
    isIncoming: false
  },
  {
    id: 'TR0006',
    date: new Date(2023, 3, 18, 15, 40),
    store: 'FitStore',
    type: 'Venda',
    gateway: 'Cielo',
    amount: 349.90,
    status: 'Pendente',
    isIncoming: true
  },
  {
    id: 'TR0007',
    date: new Date(2023, 3, 19, 11, 30),
    store: 'TechGadgets',
    type: 'Estorno',
    gateway: 'Pix',
    amount: 4599.90,
    status: 'Confirmado',
    isIncoming: false
  }
];

const mockRefunds: Refund[] = [
  {
    id: 'RF0001',
    orderId: 'PED8372',
    store: 'Loja Fashion',
    amount: 1299.90,
    reason: 'Cliente recebeu produto com defeito',
    status: 'Em análise',
    date: new Date(2023, 3, 17, 9, 15)
  },
  {
    id: 'RF0002',
    orderId: 'PED9021',
    store: 'TechGadgets',
    amount: 899.90,
    reason: 'Arrependimento de compra dentro do prazo',
    status: 'Aprovado',
    date: new Date(2023, 3, 18, 14, 25)
  },
  {
    id: 'RF0003',
    orderId: 'PED7651',
    store: 'FitStore',
    amount: 349.90,
    reason: 'Produto incompatível com descrição',
    status: 'Solicitado',
    date: new Date(2023, 3, 19, 10, 35)
  },
  {
    id: 'RF0004',
    orderId: 'PED8123',
    store: 'BeautyShop',
    amount: 459.90,
    reason: 'Produto não entregue no prazo acordado',
    status: 'Recusado',
    date: new Date(2023, 3, 20, 16, 40)
  }
];

const mockChargebacks: Chargeback[] = [
  {
    id: 'CB0001',
    orderId: 'PED6453',
    store: 'TechGadgets',
    amount: 4599.90,
    date: new Date(2023, 3, 19, 11, 30),
    status: 'Confirmado'
  },
  {
    id: 'CB0002',
    orderId: 'PED7125',
    store: 'Loja Fashion',
    amount: 899.90,
    date: new Date(2023, 3, 21, 15, 20),
    status: 'Pendente'
  },
  {
    id: 'CB0003',
    orderId: 'PED8914',
    store: 'FitStore',
    amount: 529.90,
    date: new Date(2023, 3, 22, 9, 45),
    status: 'Cancelado'
  }
];

const mockBillingCycles: BillingCycle[] = [
  {
    id: 'BC0001',
    store: 'Loja Fashion',
    cycleLimit: 1000.00,
    accumulated: 780.50,
    status: 'Em dia',
    nextCharge: new Date(2023, 4, 1),
    lastChargeAttempt: {
      date: new Date(2023, 3, 1),
      status: 'Sucesso'
    }
  },
  {
    id: 'BC0002',
    store: 'TechGadgets',
    cycleLimit: 1000.00,
    accumulated: 1250.75,
    status: 'Estourado',
    nextCharge: new Date(2023, 3, 25),
    lastChargeAttempt: {
      date: new Date(2023, 3, 20),
      status: 'Falha',
      message: 'Cartão expirado'
    }
  },
  {
    id: 'BC0003',
    store: 'FitStore',
    cycleLimit: 500.00,
    accumulated: 349.90,
    status: 'Em dia',
    nextCharge: new Date(2023, 4, 5)
  },
  {
    id: 'BC0004',
    store: 'BeautyShop',
    cycleLimit: 1000.00,
    accumulated: 459.90,
    status: 'Sem cartão',
    nextCharge: new Date(2023, 4, 10)
  }
];

// Componente principal
const AdminFinanceiroGlobal: React.FC = () => {
  // States para filtros e modais
  const [transactionSearchTerm, setTransactionSearchTerm] = useState('');
  const [transactionTypeFilter, setTransactionTypeFilter] = useState('all');
  const [transactionStatusFilter, setTransactionStatusFilter] = useState('all');
  const [transactionStoreFilter, setTransactionStoreFilter] = useState('all');
  const [refundSearchTerm, setRefundSearchTerm] = useState('');
  const [refundStatusFilter, setRefundStatusFilter] = useState('all');
  const [chargebackSearchTerm, setChargebackSearchTerm] = useState('');
  const [chargebackStatusFilter, setChargebackStatusFilter] = useState('all');
  const [cycleSearchTerm, setCycleSearchTerm] = useState('');
  const [cycleStatusFilter, setCycleStatusFilter] = useState('all');
  
  const [showRefundApprovalDialog, setShowRefundApprovalDialog] = useState(false);
  const [selectedRefund, setSelectedRefund] = useState<Refund | null>(null);
  const [showChargebackDetailDialog, setShowChargebackDetailDialog] = useState(false);
  const [selectedChargeback, setSelectedChargeback] = useState<Chargeback | null>(null);
  const [showCycleEditDialog, setShowCycleEditDialog] = useState(false);
  const [selectedCycle, setSelectedCycle] = useState<BillingCycle | null>(null);
  const [showForceChargeDialog, setShowForceChargeDialog] = useState(false);
  
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;
  
  const { toast } = useToast();
  
  // Filtrar transações
  const filteredTransactions = mockTransactions.filter(transaction => {
    const matchesSearch = 
      transaction.id.toLowerCase().includes(transactionSearchTerm.toLowerCase()) || 
      transaction.store.toLowerCase().includes(transactionSearchTerm.toLowerCase()) ||
      transaction.gateway.toLowerCase().includes(transactionSearchTerm.toLowerCase());
      
    const matchesType = transactionTypeFilter === 'all' || transaction.type === transactionTypeFilter;
    const matchesStatus = transactionStatusFilter === 'all' || transaction.status === transactionStatusFilter;
    const matchesStore = transactionStoreFilter === 'all' || transaction.store === transactionStoreFilter;
    
    return matchesSearch && matchesType && matchesStatus && matchesStore;
  });
  
  // Filtrar reembolsos
  const filteredRefunds = mockRefunds.filter(refund => {
    const matchesSearch = 
      refund.orderId.toLowerCase().includes(refundSearchTerm.toLowerCase()) || 
      refund.store.toLowerCase().includes(refundSearchTerm.toLowerCase());
      
    const matchesStatus = refundStatusFilter === 'all' || refund.status === refundStatusFilter;
    
    return matchesSearch && matchesStatus;
  });
  
  // Filtrar estornos
  const filteredChargebacks = mockChargebacks.filter(chargeback => {
    const matchesSearch = 
      chargeback.orderId.toLowerCase().includes(chargebackSearchTerm.toLowerCase()) || 
      chargeback.store.toLowerCase().includes(chargebackSearchTerm.toLowerCase());
      
    const matchesStatus = chargebackStatusFilter === 'all' || chargeback.status === chargebackStatusFilter;
    
    return matchesSearch && matchesStatus;
  });
  
  // Filtrar ciclos de cobrança
  const filteredCycles = mockBillingCycles.filter(cycle => {
    const matchesSearch = 
      cycle.store.toLowerCase().includes(cycleSearchTerm.toLowerCase());
      
    const matchesStatus = cycleStatusFilter === 'all' || cycle.status === cycleStatusFilter;
    
    return matchesSearch && matchesStatus;
  });
  
  // Funções de ação
  const handleExportData = () => {
    toast({
      title: "Extrato exportado",
      description: "O arquivo CSV foi gerado e está pronto para download.",
    });
  };
  
  const handleRefundAction = (refund: Refund, action: 'approve' | 'reject') => {
    setSelectedRefund(refund);
    setShowRefundApprovalDialog(true);
  };
  
  const confirmRefundAction = (action: 'approve' | 'reject') => {
    if (selectedRefund) {
      toast({
        title: action === 'approve' ? "Reembolso aprovado" : "Reembolso recusado",
        description: `Pedido ${selectedRefund.orderId} foi ${action === 'approve' ? 'aprovado' : 'recusado'} com sucesso.`,
        variant: action === 'approve' ? "default" : "destructive",
      });
    }
    setShowRefundApprovalDialog(false);
  };
  
  const handleViewChargebackDetails = (chargeback: Chargeback) => {
    setSelectedChargeback(chargeback);
    setShowChargebackDetailDialog(true);
  };
  
  const handleEditCycle = (cycle: BillingCycle) => {
    setSelectedCycle(cycle);
    setShowCycleEditDialog(true);
  };
  
  const handleForceCharge = (cycle: BillingCycle) => {
    setSelectedCycle(cycle);
    setShowForceChargeDialog(true);
  };
  
  const confirmForceCharge = () => {
    if (selectedCycle) {
      toast({
        title: "Cobrança iniciada",
        description: `A cobrança para a loja ${selectedCycle.store} foi iniciada manualmente.`,
      });
    }
    setShowForceChargeDialog(false);
  };
  
  const saveEditedCycle = () => {
    if (selectedCycle) {
      toast({
        title: "Ciclo atualizado",
        description: `O ciclo de cobrança para ${selectedCycle.store} foi atualizado com sucesso.`,
      });
    }
    setShowCycleEditDialog(false);
  };
  
  // Funções de renderização para status
  const getStatusBadge = (status: TransactionStatus) => {
    const statusMap: Record<string, { variant: "default" | "destructive" | "outline" | "secondary" | "warning" | "success"; label: string }> = {
      'Aprovado': { variant: 'success', label: 'Aprovado' },
      'Pendente': { variant: 'secondary', label: 'Pendente' },
      'Recusado': { variant: 'destructive', label: 'Recusado' },
      'Em análise': { variant: 'warning', label: 'Em análise' },
      'Confirmado': { variant: 'success', label: 'Confirmado' },
      'Cancelado': { variant: 'destructive', label: 'Cancelado' },
      'Solicitado': { variant: 'warning', label: 'Solicitado' },
    };
    
    const statusConfig = statusMap[status] || { variant: 'outline', label: status };
    
    return (
      <Badge variant={statusConfig.variant}>
        {statusConfig.label}
      </Badge>
    );
  };
  
  const getCycleStatusBadge = (status: CycleStatus) => {
    const statusMap: Record<string, { variant: "default" | "destructive" | "outline" | "secondary" | "warning" | "success"; label: string; icon: React.ReactNode; tooltip: string }> = {
      'Em dia': { 
        variant: 'success', 
        label: 'Em dia', 
        icon: <CheckCircle className="h-3.5 w-3.5 mr-1" />,
        tooltip: 'Todas as cobranças estão em dia e dentro do limite' 
      },
      'Estourado': { 
        variant: 'warning', 
        label: 'Estourado', 
        icon: <AlertCircle className="h-3.5 w-3.5 mr-1" />,
        tooltip: 'O valor acumulado ultrapassou o limite do ciclo e será cobrado em breve' 
      },
      'Sem cartão': { 
        variant: 'destructive', 
        label: 'Sem cartão', 
        icon: <CreditCard className="h-3.5 w-3.5 mr-1" />,
        tooltip: 'Não há cartão cadastrado para essa loja, a cobrança não pode ser realizada' 
      },
    };
    
    const statusConfig = statusMap[status];
    
    return (
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <Badge variant={statusConfig.variant} className="flex items-center">
              {statusConfig.icon}
              {statusConfig.label}
            </Badge>
          </TooltipTrigger>
          <TooltipContent>
            <p className="max-w-xs">{statusConfig.tooltip}</p>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
    );
  };
  
  const getTransactionTypeDisplay = (type: TransactionType) => {
    const typeMap: Record<string, { color: string; icon: React.ReactNode }> = {
      'Venda': { 
        color: 'text-blue-600 dark:text-blue-400',
        icon: <ArrowUp className="h-3.5 w-3.5 mr-1 text-blue-500" />
      },
      'Taxa VOLTZ': { 
        color: 'text-orange-600 dark:text-orange-400',
        icon: <Percent className="h-3.5 w-3.5 mr-1 text-orange-500" />
      },
      'Reembolso': { 
        color: 'text-red-600 dark:text-red-400',
        icon: <ArrowDown className="h-3.5 w-3.5 mr-1 text-red-500" />
      },
      'Estorno': { 
        color: 'text-purple-600 dark:text-purple-400',
        icon: <ArrowDown className="h-3.5 w-3.5 mr-1 text-purple-500" />
      },
    };
    
    const typeStyle = typeMap[type];
    
    return (
      <div className={`font-medium ${typeStyle.color} flex items-center`}>
        {typeStyle.icon}
        {type}
      </div>
    );
  };

  // Lista única de lojas para os filtros
  const uniqueStores = Array.from(new Set(mockTransactions.map(t => t.store)));
  
  return (
    <div className="space-y-6 p-6">
      <h1 className="text-2xl font-bold text-white">Financeiro Global</h1>
      
      <Tabs defaultValue="extrato" className="bg-[#121212] rounded-lg p-6">
        <TabsList className="grid grid-cols-4 mb-6">
          <TabsTrigger value="extrato">Extrato Geral</TabsTrigger>
          <TabsTrigger value="reembolsos">Reembolsos</TabsTrigger>
          <TabsTrigger value="estornos">Estornos</TabsTrigger>
          <TabsTrigger value="ciclos">Ciclos & Cobranças</TabsTrigger>
        </TabsList>
        
        {/* Aba: Extrato Geral */}
        <TabsContent value="extrato" className="space-y-6">
          <div className="flex flex-col sm:flex-row justify-between gap-4">
            <div className="relative w-full sm:w-64">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Buscar transação, loja..."
                className="pl-8"
                value={transactionSearchTerm}
                onChange={(e) => setTransactionSearchTerm(e.target.value)}
              />
            </div>
            
            <div className="flex flex-wrap gap-2">
              <Select value={transactionStoreFilter} onValueChange={setTransactionStoreFilter}>
                <SelectTrigger className="w-[140px]">
                  <Store className="h-4 w-4 mr-2" />
                  <SelectValue placeholder="Loja" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todas as Lojas</SelectItem>
                  {uniqueStores.map(store => (
                    <SelectItem key={store} value={store}>{store}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
              
              <Select value={transactionTypeFilter} onValueChange={setTransactionTypeFilter}>
                <SelectTrigger className="w-[140px]">
                  <SelectValue placeholder="Tipo" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todos os Tipos</SelectItem>
                  <SelectItem value="Venda">Venda</SelectItem>
                  <SelectItem value="Taxa VOLTZ">Taxa VOLTZ</SelectItem>
                  <SelectItem value="Reembolso">Reembolso</SelectItem>
                  <SelectItem value="Estorno">Estorno</SelectItem>
                </SelectContent>
              </Select>
              
              <Select value={transactionStatusFilter} onValueChange={setTransactionStatusFilter}>
                <SelectTrigger className="w-[140px]">
                  <SelectValue placeholder="Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todos os Status</SelectItem>
                  <SelectItem value="Aprovado">Aprovado</SelectItem>
                  <SelectItem value="Pendente">Pendente</SelectItem>
                  <SelectItem value="Recusado">Recusado</SelectItem>
                  <SelectItem value="Confirmado">Confirmado</SelectItem>
                </SelectContent>
              </Select>
              
              <Button variant="outline" size="icon" onClick={handleExportData} title="Exportar dados">
                <Download className="h-4 w-4" />
              </Button>
            </div>
          </div>
          
          <Card className="bg-[#1E1E1E] border-[#333333]">
            <CardHeader className="pb-3">
              <CardTitle className="text-white">Extrato de Transações Global</CardTitle>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow className="border-[#333333]">
                    <TableHead className="text-gray-400">Data/Hora</TableHead>
                    <TableHead className="text-gray-400">Loja</TableHead>
                    <TableHead className="text-gray-400">Tipo</TableHead>
                    <TableHead className="text-gray-400">Gateway</TableHead>
                    <TableHead className="text-gray-400">Valor</TableHead>
                    <TableHead className="text-gray-400">Status</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredTransactions.map((transaction) => (
                    <TableRow 
                      key={transaction.id}
                      className="border-[#333333]"
                    >
                      <TableCell className="font-medium text-gray-300">
                        {formatDateTime(transaction.date)}
                      </TableCell>
                      <TableCell className="text-gray-300">
                        {transaction.store}
                      </TableCell>
                      <TableCell>
                        {getTransactionTypeDisplay(transaction.type)}
                      </TableCell>
                      <TableCell className="text-gray-300">
                        {transaction.gateway}
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center">
                          {transaction.isIncoming ? (
                            <ArrowUp className="h-3.5 w-3.5 mr-1 text-green-500" />
                          ) : (
                            <ArrowDown className="h-3.5 w-3.5 mr-1 text-red-500" />
                          )}
                          <span className={transaction.isIncoming ? "text-green-500" : "text-red-500"}>
                            {formatCurrency(transaction.amount)}
                          </span>
                        </div>
                      </TableCell>
                      <TableCell>
                        {getStatusBadge(transaction.status)}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
              
              <div className="mt-4 flex justify-center">
                <Pagination>
                  <PaginationContent>
                    <PaginationItem>
                      <PaginationPrevious href="#" />
                    </PaginationItem>
                    <PaginationItem>
                      <PaginationLink href="#" isActive>1</PaginationLink>
                    </PaginationItem>
                    <PaginationItem>
                      <PaginationLink href="#">2</PaginationLink>
                    </PaginationItem>
                    <PaginationItem>
                      <PaginationLink href="#">3</PaginationLink>
                    </PaginationItem>
                    <PaginationItem>
                      <PaginationNext href="#" />
                    </PaginationItem>
                  </PaginationContent>
                </Pagination>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        {/* Aba: Reembolsos */}
        <TabsContent value="reembolsos" className="space-y-6">
          <div className="flex flex-col sm:flex-row justify-between gap-4">
            <div className="relative w-full sm:w-64">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Buscar pedido, loja..."
                className="pl-8"
                value={refundSearchTerm}
                onChange={(e) => setRefundSearchTerm(e.target.value)}
              />
            </div>
            
            <div className="flex flex-wrap gap-2">
              <Select value={refundStatusFilter} onValueChange={setRefundStatusFilter}>
                <SelectTrigger className="w-[140px]">
                  <SelectValue placeholder="Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todos os Status</SelectItem>
                  <SelectItem value="Solicitado">Solicitados</SelectItem>
                  <SelectItem value="Em análise">Em análise</SelectItem>
                  <SelectItem value="Aprovado">Aprovados</SelectItem>
                  <SelectItem value="Recusado">Recusados</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          
          <Card className="bg-[#1E1E1E] border-[#333333]">
            <CardHeader className="pb-3">
              <CardTitle className="text-white">Gerenciamento de Reembolsos</CardTitle>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow className="border-[#333333]">
                    <TableHead className="text-gray-400">Pedido</TableHead>
                    <TableHead className="text-gray-400">Loja</TableHead>
                    <TableHead className="text-gray-400">Valor</TableHead>
                    <TableHead className="text-gray-400">Motivo</TableHead>
                    <TableHead className="text-gray-400">Status</TableHead>
                    <TableHead className="text-gray-400">Data</TableHead>
                    <TableHead className="text-gray-400">Ações</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredRefunds.map((refund) => (
                    <TableRow 
                      key={refund.id}
                      className="border-[#333333]"
                    >
                      <TableCell className="font-medium text-gray-300">
                        {refund.orderId}
                      </TableCell>
                      <TableCell className="text-gray-300">
                        {refund.store}
                      </TableCell>
                      <TableCell className="text-gray-300">
                        {formatCurrency(refund.amount)}
                      </TableCell>
                      <TableCell className="text-gray-300 max-w-[200px] truncate">
                        <TooltipProvider>
                          <Tooltip>
                            <TooltipTrigger className="max-w-[200px] truncate text-left">
                              {refund.reason}
                            </TooltipTrigger>
                            <TooltipContent>
                              <p className="max-w-xs">{refund.reason}</p>
                            </TooltipContent>
                          </Tooltip>
                        </TooltipProvider>
                      </TableCell>
                      <TableCell>
                        {getStatusBadge(refund.status)}
                      </TableCell>
                      <TableCell className="text-gray-300">
                        {formatDateTime(refund.date)}
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center space-x-1">
                          {(refund.status === 'Solicitado' || refund.status === 'Em análise') && (
                            <>
                              <TooltipProvider>
                                <Tooltip>
                                  <TooltipTrigger asChild>
                                    <Button 
                                      variant="ghost" 
                                      size="icon"
                                      onClick={() => handleRefundAction(refund, 'approve')}
                                      className="text-green-500 hover:text-green-400 hover:bg-green-400/10"
                                    >
                                      <CheckCircle className="h-4 w-4" />
                                    </Button>
                                  </TooltipTrigger>
                                  <TooltipContent>
                                    <p>Aprovar reembolso</p>
                                  </TooltipContent>
                                </Tooltip>
                              </TooltipProvider>
                              
                              <TooltipProvider>
                                <Tooltip>
                                  <TooltipTrigger asChild>
                                    <Button 
                                      variant="ghost" 
                                      size="icon"
                                      onClick={() => handleRefundAction(refund, 'reject')}
                                      className="text-red-500 hover:text-red-400 hover:bg-red-400/10"
                                    >
                                      <XCircle className="h-4 w-4" />
                                    </Button>
                                  </TooltipTrigger>
                                  <TooltipContent>
                                    <p>Recusar reembolso</p>
                                  </TooltipContent>
                                </Tooltip>
                              </TooltipProvider>
                            </>
                          )}
                          
                          <TooltipProvider>
                            <Tooltip>
                              <TooltipTrigger asChild>
                                <Button 
                                  variant="ghost" 
                                  size="icon"
                                  className="text-blue-500 hover:text-blue-400 hover:bg-blue-400/10"
                                >
                                  <Eye className="h-4 w-4" />
                                </Button>
                              </TooltipTrigger>
                              <TooltipContent>
                                <p>Ver detalhes</p>
                              </TooltipContent>
                            </Tooltip>
                          </TooltipProvider>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>
        
        {/* Aba: Estornos */}
        <TabsContent value="estornos" className="space-y-6">
          <div className="flex flex-col sm:flex-row justify-between gap-4">
            <div className="relative w-full sm:w-64">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Buscar pedido, loja..."
                className="pl-8"
                value={chargebackSearchTerm}
                onChange={(e) => setChargebackSearchTerm(e.target.value)}
              />
            </div>
            
            <div className="flex flex-wrap gap-2">
              <Select value={chargebackStatusFilter} onValueChange={setChargebackStatusFilter}>
                <SelectTrigger className="w-[140px]">
                  <SelectValue placeholder="Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todos os Status</SelectItem>
                  <SelectItem value="Confirmado">Confirmados</SelectItem>
                  <SelectItem value="Pendente">Pendentes</SelectItem>
                  <SelectItem value="Cancelado">Cancelados</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          
          <Card className="bg-[#1E1E1E] border-[#333333]">
            <CardHeader className="pb-3">
              <CardTitle className="text-white">Auditoria de Estornos</CardTitle>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow className="border-[#333333]">
                    <TableHead className="text-gray-400">Pedido</TableHead>
                    <TableHead className="text-gray-400">Loja</TableHead>
                    <TableHead className="text-gray-400">Valor</TableHead>
                    <TableHead className="text-gray-400">Data</TableHead>
                    <TableHead className="text-gray-400">Status</TableHead>
                    <TableHead className="text-gray-400">Ações</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredChargebacks.map((chargeback) => (
                    <TableRow 
                      key={chargeback.id}
                      className="border-[#333333]"
                    >
                      <TableCell className="font-medium text-gray-300">
                        {chargeback.orderId}
                      </TableCell>
                      <TableCell className="text-gray-300">
                        {chargeback.store}
                      </TableCell>
                      <TableCell className="text-gray-300">
                        {formatCurrency(chargeback.amount)}
                      </TableCell>
                      <TableCell className="text-gray-300">
                        {formatDateTime(chargeback.date)}
                      </TableCell>
                      <TableCell>
                        {getStatusBadge(chargeback.status)}
                      </TableCell>
                      <TableCell>
                        <TooltipProvider>
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <Button 
                                variant="ghost" 
                                size="icon"
                                onClick={() => handleViewChargebackDetails(chargeback)}
                                className="text-blue-500 hover:text-blue-400 hover:bg-blue-400/10"
                              >
                                <FileText className="h-4 w-4" />
                              </Button>
                            </TooltipTrigger>
                            <TooltipContent>
                              <p>Ver histórico e adicionar nota</p>
                            </TooltipContent>
                          </Tooltip>
                        </TooltipProvider>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>
        
        {/* Aba: Ciclos & Cobranças */}
        <TabsContent value="ciclos" className="space-y-6">
          <div className="flex flex-col sm:flex-row justify-between gap-4">
            <div className="relative w-full sm:w-64">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Buscar loja..."
                className="pl-8"
                value={cycleSearchTerm}
                onChange={(e) => setCycleSearchTerm(e.target.value)}
              />
            </div>
            
            <div className="flex flex-wrap gap-2">
              <Select value={cycleStatusFilter} onValueChange={setCycleStatusFilter}>
                <SelectTrigger className="w-[140px]">
                  <SelectValue placeholder="Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todos os Status</SelectItem>
                  <SelectItem value="Em dia">Em dia</SelectItem>
                  <SelectItem value="Estourado">Estourado</SelectItem>
                  <SelectItem value="Sem cartão">Sem cartão</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          
          <Card className="bg-[#1E1E1E] border-[#333333]">
            <CardHeader className="pb-3">
              <CardTitle className="text-white">Ciclos de Cobrança</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="bg-[#262626] p-3 rounded mb-4 border border-[#333333]">
                <p className="text-sm text-gray-400 flex items-center">
                  <CircleDollarSign className="h-4 w-4 mr-2 text-blue-400" />
                  As taxas da VOLTZ são cobradas das lojas quando atingem o limite do ciclo ou na data programada. 
                  Lojas sem cartão cadastrado não podem ser cobradas automaticamente.
                </p>
              </div>
              
              <Table>
                <TableHeader>
                  <TableRow className="border-[#333333]">
                    <TableHead className="text-gray-400">Loja</TableHead>
                    <TableHead className="text-gray-400">Limite do Ciclo</TableHead>
                    <TableHead className="text-gray-400">Acumulado Atual</TableHead>
                    <TableHead className="text-gray-400">Status</TableHead>
                    <TableHead className="text-gray-400">Próxima Cobrança</TableHead>
                    <TableHead className="text-gray-400">Ações</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredCycles.map((cycle) => (
                    <TableRow 
                      key={cycle.id}
                      className="border-[#333333]"
                    >
                      <TableCell className="font-medium text-gray-300">
                        {cycle.store}
                      </TableCell>
                      <TableCell className="text-gray-300">
                        {formatCurrency(cycle.cycleLimit)}
                      </TableCell>
                      <TableCell>
                        <div className={cycle.accumulated > cycle.cycleLimit ? "text-amber-400" : "text-gray-300"}>
                          {formatCurrency(cycle.accumulated)}
                          {cycle.accumulated > cycle.cycleLimit && (
                            <span className="ml-2 text-xs px-1.5 py-0.5 bg-amber-500/20 text-amber-300 rounded-full">
                              Limite excedido
                            </span>
                          )}
                        </div>
                      </TableCell>
                      <TableCell>
                        {getCycleStatusBadge(cycle.status)}
                        {cycle.lastChargeAttempt?.status === 'Falha' && (
                          <TooltipProvider>
                            <Tooltip>
                              <TooltipTrigger asChild>
                                <Badge variant="destructive" className="ml-2 flex items-center">
                                  <AlertCircle className="h-3 w-3 mr-1" />
                                  Falha na cobrança
                                </Badge>
                              </TooltipTrigger>
                              <TooltipContent>
                                <div className="max-w-xs">
                                  <p className="font-medium">Falha na última tentativa</p>
                                  <p className="text-xs mt-1">{cycle.lastChargeAttempt.message}</p>
                                  <p className="text-xs text-gray-400 mt-1">
                                    {formatDateTime(cycle.lastChargeAttempt.date)}
                                  </p>
                                </div>
                              </TooltipContent>
                            </Tooltip>
                          </TooltipProvider>
                        )}
                      </TableCell>
                      <TableCell className="text-gray-300">
                        {formatDateTime(cycle.nextCharge)}
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center space-x-1">
                          <TooltipProvider>
                            <Tooltip>
                              <TooltipTrigger asChild>
                                <Button 
                                  variant="ghost" 
                                  size="icon"
                                  onClick={() => handleEditCycle(cycle)}
                                  className="text-gray-500 hover:text-gray-400 hover:bg-gray-400/10"
                                >
                                  <Settings className="h-4 w-4" />
                                </Button>
                              </TooltipTrigger>
                              <TooltipContent>
                                <p>Editar ciclo</p>
                              </TooltipContent>
                            </Tooltip>
                          </TooltipProvider>
                          
                          <TooltipProvider>
                            <Tooltip>
                              <TooltipTrigger asChild>
                                <Button 
                                  variant="ghost" 
                                  size="icon"
                                  onClick={() => handleForceCharge(cycle)}
                                  disabled={cycle.status === 'Sem cartão'}
                                  className="text-green-500 hover:text-green-400 hover:bg-green-400/10 disabled:opacity-30"
                                >
                                  <Zap className="h-4 w-4" />
                                </Button>
                              </TooltipTrigger>
                              <TooltipContent>
                                <p>Forçar cobrança agora</p>
                              </TooltipContent>
                            </Tooltip>
                          </TooltipProvider>
                          
                          <TooltipProvider>
                            <Tooltip>
                              <TooltipTrigger asChild>
                                <Button 
                                  variant="ghost" 
                                  size="icon"
                                  className="text-blue-500 hover:text-blue-400 hover:bg-blue-400/10"
                                >
                                  <Eye className="h-4 w-4" />
                                </Button>
                              </TooltipTrigger>
                              <TooltipContent>
                                <p>Ver detalhes e histórico</p>
                              </TooltipContent>
                            </Tooltip>
                          </TooltipProvider>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
      
      {/* Diálogos/Modais */}
      <Dialog open={showRefundApprovalDialog} onOpenChange={setShowRefundApprovalDialog}>
        <DialogContent className="bg-[#1E1E1E] border-[#333333] text-white">
          <DialogHeader>
            <DialogTitle>Confirmação de Reembolso</DialogTitle>
            <DialogDescription className="text-gray-400">
              Você está prestes a {selectedRefund ? 'aprovar' : 'rejeitar'} o reembolso para o pedido{' '}
              <span className="font-medium text-white">{selectedRefund?.orderId}</span>
            </DialogDescription>
          </DialogHeader>
          
          {selectedRefund && (
            <div className="space-y-4 py-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm font-medium text-gray-400">Loja</p>
                  <p className="mt-1">{selectedRefund.store}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-400">Valor</p>
                  <p className="mt-1">{formatCurrency(selectedRefund.amount)}</p>
                </div>
              </div>
              
              <div>
                <p className="text-sm font-medium text-gray-400">Motivo</p>
                <p className="mt-1 text-sm">{selectedRefund.reason}</p>
              </div>
            </div>
          )}
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowRefundApprovalDialog(false)}>
              Cancelar
            </Button>
            <Button onClick={() => confirmRefundAction('approve')} className="bg-green-600 hover:bg-green-700">
              Confirmar Aprovação
            </Button>
            <Button onClick={() => confirmRefundAction('reject')} variant="destructive">
              Rejeitar Reembolso
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      
      <Dialog open={showChargebackDetailDialog} onOpenChange={setShowChargebackDetailDialog}>
        <DialogContent className="bg-[#1E1E1E] border-[#333333] text-white">
          <DialogHeader>
            <DialogTitle>Detalhes do Estorno</DialogTitle>
            <DialogDescription className="text-gray-400">
              Visualizando informações do estorno para o pedido{' '}
              <span className="font-medium text-white">{selectedChargeback?.orderId}</span>
            </DialogDescription>
          </DialogHeader>
          
          {selectedChargeback && (
            <div className="space-y-4 py-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm font-medium text-gray-400">Loja</p>
                  <p className="mt-1">{selectedChargeback.store}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-400">Valor</p>
                  <p className="mt-1">{formatCurrency(selectedChargeback.amount)}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-400">Data</p>
                  <p className="mt-1">{formatDateTime(selectedChargeback.date)}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-400">Status</p>
                  <p className="mt-1">{getStatusBadge(selectedChargeback.status)}</p>
                </div>
              </div>
              
              <div>
                <p className="text-sm font-medium text-gray-400">Histórico</p>
                <div className="mt-2 bg-[#262626] rounded-md p-3 text-sm">
                  <div className="flex items-start space-x-2 pb-2 mb-2 border-b border-[#333333]">
                    <Clock className="h-4 w-4 mt-0.5 text-gray-400" />
                    <div>
                      <p className="text-gray-300">Estorno iniciado pela operadora</p>
                      <p className="text-xs text-gray-500">{formatDateTime(selectedChargeback.date)}</p>
                    </div>
                  </div>
                  <div className="flex items-start space-x-2">
                    <CheckCircle className="h-4 w-4 mt-0.5 text-green-500" />
                    <div>
                      <p className="text-gray-300">Estorno confirmado no sistema</p>
                      <p className="text-xs text-gray-500">{formatDateTime(new Date(selectedChargeback.date.getTime() + 3600000))}</p>
                    </div>
                  </div>
                </div>
              </div>
              
              <div>
                <label className="text-sm font-medium text-gray-400">Adicionar nota administrativa</label>
                <textarea 
                  className="mt-1 w-full h-24 bg-[#262626] border border-[#333333] rounded-md p-2 text-sm text-white placeholder:text-gray-500"
                  placeholder="Digite uma nota sobre este estorno..."
                />
              </div>
            </div>
          )}
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowChargebackDetailDialog(false)}>
              Cancelar
            </Button>
            <Button onClick={() => setShowChargebackDetailDialog(false)}>
              Salvar Nota
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      
      <Dialog open={showCycleEditDialog} onOpenChange={setShowCycleEditDialog}>
        <DialogContent className="bg-[#1E1E1E] border-[#333333] text-white">
          <DialogHeader>
            <DialogTitle>Editar Ciclo de Cobrança</DialogTitle>
            <DialogDescription className="text-gray-400">
              Ajuste as configurações do ciclo para{' '}
              <span className="font-medium text-white">{selectedCycle?.store}</span>
            </DialogDescription>
          </DialogHeader>
          
          {selectedCycle && (
            <div className="space-y-4 py-4">
              <div>
                <label className="text-sm font-medium text-gray-400">Valor do Limite de Ciclo</label>
                <div className="relative mt-1">
                  <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-gray-400">R$</span>
                  <Input 
                    type="number" 
                    defaultValue={selectedCycle.cycleLimit} 
                    className="pl-10"
                  />
                </div>
                <p className="mt-1 text-xs text-gray-500">
                  Valor mínimo de acúmulo para cobrança automática
                </p>
              </div>
              
              <div>
                <label className="text-sm font-medium text-gray-400">Data da Próxima Cobrança</label>
                <Input 
                  type="date" 
                  defaultValue={selectedCycle.nextCharge.toISOString().split('T')[0]} 
                  className="mt-1"
                />
                <p className="mt-1 text-xs text-gray-500">
                  Data em que a cobrança será realizada independente do valor acumulado
                </p>
              </div>
            </div>
          )}
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowCycleEditDialog(false)}>
              Cancelar
            </Button>
            <Button onClick={saveEditedCycle}>
              Salvar Alterações
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      
      <AlertDialog open={showForceChargeDialog} onOpenChange={setShowForceChargeDialog}>
        <AlertDialogContent className="bg-[#1E1E1E] border-[#333333] text-white">
          <AlertDialogHeader>
            <AlertDialogTitle>Forçar Cobrança</AlertDialogTitle>
            <AlertDialogDescription className="text-gray-400">
              Você está prestes a iniciar uma cobrança imediata para{' '}
              <span className="font-medium text-white">{selectedCycle?.store}</span>.
              <br />
              Valor a ser cobrado: <span className="font-medium text-white">{selectedCycle ? formatCurrency(selectedCycle.accumulated) : ''}</span>
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel className="bg-transparent border-[#333333] text-white hover:bg-[#262626] hover:text-white">Cancelar</AlertDialogCancel>
            <AlertDialogAction onClick={confirmForceCharge} className="bg-green-600 hover:bg-green-700 text-white">
              Iniciar Cobrança
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default AdminFinanceiroGlobal;

