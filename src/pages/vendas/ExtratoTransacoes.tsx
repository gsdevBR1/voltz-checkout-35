
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import DashboardLayout from '@/components/DashboardLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { 
  Search, 
  Calendar, 
  Download, 
  ArrowUp, 
  ArrowDown, 
  CheckCircle, 
  Clock, 
  XCircle,
  Info,
  FileText,
  Percent
} from 'lucide-react';
import { formatCurrency, formatDateTime } from '@/lib/utils';
import { Pagination, PaginationContent, PaginationItem, PaginationLink, PaginationNext, PaginationPrevious } from "@/components/ui/pagination";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/hooks/use-toast";

// Mock data for transactions
const mockTransactions = [
  {
    id: 'TR0001',
    date: new Date(2023, 3, 15, 14, 30),
    type: 'Venda',
    product: 'Smartphone XYZ Pro',
    amount: 1299.90,
    status: 'Aprovado',
    isIncoming: true,
    details: 'Venda processada via Mercado Pago'
  },
  {
    id: 'TR0002',
    date: new Date(2023, 3, 15, 14, 31),
    type: 'Taxa da VOLTZ',
    product: 'Taxa de processamento (2.5%) - Smartphone XYZ Pro',
    amount: 32.50,
    status: 'Aprovado',
    isIncoming: false,
    details: 'Taxa de 2.5% sobre venda'
  },
  {
    id: 'TR0003',
    date: new Date(2023, 3, 16, 10, 20),
    type: 'Venda',
    product: 'Notebook Ultra',
    amount: 4599.90,
    status: 'Aprovado',
    isIncoming: true,
    details: 'Venda processada via Pix'
  },
  {
    id: 'TR0004',
    date: new Date(2023, 3, 16, 10, 21),
    type: 'Taxa da VOLTZ',
    product: 'Taxa de processamento (2.5%) - Notebook Ultra',
    amount: 115.00,
    status: 'Aprovado',
    isIncoming: false,
    details: 'Taxa de 2.5% sobre venda'
  },
  {
    id: 'TR0005',
    date: new Date(2023, 3, 17, 9, 15),
    type: 'Reembolso',
    product: 'Smartphone XYZ Pro',
    amount: 1299.90,
    status: 'Aprovado',
    isIncoming: false,
    details: 'Reembolso solicitado pelo cliente'
  },
  {
    id: 'TR0006',
    date: new Date(2023, 3, 18, 15, 40),
    type: 'Venda',
    product: 'Fone de Ouvido Premium',
    amount: 349.90,
    status: 'Pendente',
    isIncoming: true,
    details: 'Aguardando confirmação do pagamento'
  },
  {
    id: 'TR0007',
    date: new Date(2023, 3, 19, 11, 30),
    type: 'Estorno',
    product: 'Notebook Ultra',
    amount: 4599.90,
    status: 'Aprovado',
    isIncoming: false,
    details: 'Estorno por contestação de cobrança'
  },
  {
    id: 'TR0008',
    date: new Date(2023, 3, 20, 16, 20),
    type: 'Venda',
    product: 'Smart TV 55"',
    amount: 3299.90,
    status: 'Cancelado',
    isIncoming: true,
    details: 'Cancelado por falta de estoque'
  },
  {
    id: 'TR0009',
    date: new Date(2023, 3, 21, 13, 45),
    type: 'Cobrança de Taxas',
    product: 'Ciclo de taxas Abril/2023',
    amount: 147.50,
    status: 'Aprovado',
    isIncoming: false,
    details: 'Cobrança automática de taxas acumuladas do ciclo'
  }
];

const getStatusBadge = (status: string) => {
  const statusMap: Record<string, { variant: "default" | "destructive" | "outline" | "secondary"; label: string }> = {
    'Aprovado': { variant: 'default', label: 'Aprovado' },
    'Pendente': { variant: 'secondary', label: 'Pendente' },
    'Cancelado': { variant: 'destructive', label: 'Cancelado' },
  };
  
  const statusConfig = statusMap[status] || { variant: 'outline', label: status };
  
  return (
    <Badge variant={statusConfig.variant}>
      {statusConfig.label}
    </Badge>
  );
};

const getStatusIcon = (status: string) => {
  if (status === 'Aprovado') {
    return <CheckCircle className="h-4 w-4 mr-1 text-green-500" />;
  } else if (status === 'Pendente') {
    return <Clock className="h-4 w-4 mr-1 text-amber-500" />;
  } else {
    return <XCircle className="h-4 w-4 mr-1 text-red-500" />;
  }
};

const getTransactionTypeDisplay = (type: string) => {
  const typeMap: Record<string, { color: string; icon: React.ReactNode }> = {
    'Venda': { 
      color: 'text-blue-600 dark:text-blue-400',
      icon: <ArrowUp className="h-3.5 w-3.5 mr-1 text-blue-500" />
    },
    'Taxa da VOLTZ': { 
      color: 'text-orange-600 dark:text-orange-400',
      icon: <Percent className="h-3.5 w-3.5 mr-1 text-orange-500" />
    },
    'Cobrança de Taxas': { 
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
  
  const typeStyle = typeMap[type] || { 
    color: 'text-gray-600 dark:text-gray-400',
    icon: <Info className="h-3.5 w-3.5 mr-1 text-gray-500" />
  };
  
  return (
    <div className={`font-medium ${typeStyle.color} flex items-center`}>
      {typeStyle.icon}
      {type}
    </div>
  );
};

const ExtratoTransacoes: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [typeFilter, setTypeFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');
  const [periodFilter, setPeriodFilter] = useState('all');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;
  const navigate = useNavigate();
  const { toast } = useToast();
  
  const filteredTransactions = mockTransactions.filter(transaction => {
    const matchesSearch = 
      transaction.id.toLowerCase().includes(searchTerm.toLowerCase()) || 
      transaction.product.toLowerCase().includes(searchTerm.toLowerCase());
      
    const matchesType = typeFilter === 'all' || transaction.type === typeFilter;
    const matchesStatus = statusFilter === 'all' || transaction.status === statusFilter;
    
    let matchesPeriod = true;
    const now = new Date();
    
    if (periodFilter === 'today') {
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      matchesPeriod = transaction.date >= today && transaction.date <= now;
    } else if (periodFilter === 'yesterday') {
      const yesterday = new Date();
      yesterday.setDate(yesterday.getDate() - 1);
      yesterday.setHours(0, 0, 0, 0);
      
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      
      matchesPeriod = transaction.date >= yesterday && transaction.date < today;
    } else if (periodFilter === '7days') {
      const sevenDaysAgo = new Date();
      sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
      matchesPeriod = transaction.date >= sevenDaysAgo && transaction.date <= now;
    } else if (periodFilter === '30days') {
      const thirtyDaysAgo = new Date();
      thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
      matchesPeriod = transaction.date >= thirtyDaysAgo && transaction.date <= now;
    }
    
    return matchesSearch && matchesType && matchesStatus && matchesPeriod;
  });

  const totalPages = Math.ceil(filteredTransactions.length / itemsPerPage);
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredTransactions.slice(indexOfFirstItem, indexOfLastItem);

  const handleExportData = () => {
    toast({
      title: "Extrato exportado",
      description: "O arquivo CSV foi gerado e está pronto para download.",
    });
  };
  
  const handleViewDetails = (transactionId: string) => {
    toast({
      title: "Detalhes da transação",
      description: `Visualizando detalhes da transação ${transactionId}`,
    });
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row justify-between gap-4">
          <div className="relative w-full sm:w-64">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Buscar transação, produto..."
              className="pl-8"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          
          <div className="flex flex-wrap gap-2">
            <Select value={periodFilter} onValueChange={setPeriodFilter}>
              <SelectTrigger className="w-[140px]">
                <Calendar className="h-4 w-4 mr-2" />
                <SelectValue placeholder="Período" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todos</SelectItem>
                <SelectItem value="today">Hoje</SelectItem>
                <SelectItem value="yesterday">Ontem</SelectItem>
                <SelectItem value="7days">Últimos 7 dias</SelectItem>
                <SelectItem value="30days">Últimos 30 dias</SelectItem>
              </SelectContent>
            </Select>
            
            <Select value={typeFilter} onValueChange={setTypeFilter}>
              <SelectTrigger className="w-[140px]">
                <SelectValue placeholder="Tipo" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todos os Tipos</SelectItem>
                <SelectItem value="Venda">Venda</SelectItem>
                <SelectItem value="Taxa da VOLTZ">Taxa da VOLTZ</SelectItem>
                <SelectItem value="Cobrança de Taxas">Cobrança de Taxas</SelectItem>
                <SelectItem value="Reembolso">Reembolso</SelectItem>
                <SelectItem value="Estorno">Estorno</SelectItem>
              </SelectContent>
            </Select>
            
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-[140px]">
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todos os Status</SelectItem>
                <SelectItem value="Aprovado">Aprovado</SelectItem>
                <SelectItem value="Pendente">Pendente</SelectItem>
                <SelectItem value="Cancelado">Cancelado</SelectItem>
              </SelectContent>
            </Select>
            
            <Button variant="outline" size="icon" onClick={handleExportData} title="Exportar dados">
              <Download className="h-4 w-4" />
            </Button>
          </div>
        </div>
        
        <Card>
          <CardHeader className="pb-3">
            <CardTitle>Extrato de Transações</CardTitle>
          </CardHeader>
          <CardContent>
            {filteredTransactions.length > 0 ? (
              <>
                <div className="rounded-md border mb-4 p-3 bg-slate-50">
                  <p className="text-sm text-muted-foreground flex items-center">
                    <Info className="h-4 w-4 mr-2 text-blue-500" />
                    As Taxas da VOLTZ (2,5%) são cobradas automaticamente a cada transação aprovada e acumuladas 
                    até atingir R$ 100. Estas taxas não afetam o valor recebido pelo cliente final, sendo visíveis 
                    apenas no seu painel administrativo.
                  </p>
                </div>
                
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="w-[120px]">Data/Hora</TableHead>
                      <TableHead>Tipo</TableHead>
                      <TableHead className="min-w-[250px]">Descrição</TableHead>
                      <TableHead>Valor</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead className="w-[80px]">Ações</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {currentItems.map((transaction) => (
                      <TableRow 
                        key={transaction.id}
                        className={transaction.type.includes('Taxa') ? 'bg-orange-50/30' : ''}
                      >
                        <TableCell className="font-medium">
                          {formatDateTime(transaction.date)}
                        </TableCell>
                        <TableCell>
                          {getTransactionTypeDisplay(transaction.type)}
                        </TableCell>
                        <TableCell className="max-w-[250px]">
                          <div className="truncate" title={transaction.product}>
                            {transaction.product}
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center">
                            {transaction.isIncoming ? (
                              <ArrowUp className="h-3.5 w-3.5 mr-1 text-green-500" />
                            ) : (
                              <ArrowDown className="h-3.5 w-3.5 mr-1 text-red-500" />
                            )}
                            <span className={transaction.isIncoming ? "text-green-600" : "text-red-600"}>
                              {formatCurrency(transaction.amount)}
                            </span>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center">
                            {getStatusIcon(transaction.status)}
                            {getStatusBadge(transaction.status)}
                          </div>
                        </TableCell>
                        <TableCell>
                          <TooltipProvider>
                            <Tooltip>
                              <TooltipTrigger asChild>
                                <Button 
                                  variant="ghost" 
                                  size="icon"
                                  onClick={() => handleViewDetails(transaction.id)}
                                >
                                  <Info className="h-4 w-4" />
                                </Button>
                              </TooltipTrigger>
                              <TooltipContent>
                                <p>Ver detalhes</p>
                              </TooltipContent>
                            </Tooltip>
                          </TooltipProvider>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
                
                {totalPages > 1 && (
                  <div className="mt-4 flex justify-center">
                    <Pagination>
                      <PaginationContent>
                        <PaginationItem>
                          <PaginationPrevious 
                            onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                            className={currentPage === 1 ? "pointer-events-none opacity-50" : ""}
                          />
                        </PaginationItem>
                        
                        {Array.from({ length: totalPages }).map((_, idx) => (
                          <PaginationItem key={idx}>
                            <PaginationLink 
                              isActive={currentPage === idx + 1}
                              onClick={() => setCurrentPage(idx + 1)}
                            >
                              {idx + 1}
                            </PaginationLink>
                          </PaginationItem>
                        ))}
                        
                        <PaginationItem>
                          <PaginationNext 
                            onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                            className={currentPage === totalPages ? "pointer-events-none opacity-50" : ""}
                          />
                        </PaginationItem>
                      </PaginationContent>
                    </Pagination>
                  </div>
                )}
              </>
            ) : (
              <div className="flex flex-col items-center justify-center py-12 text-center">
                <div className="bg-muted/50 p-4 rounded-full mb-4">
                  <FileText className="h-8 w-8 text-muted-foreground" />
                </div>
                <h3 className="text-lg font-medium mb-2">Nenhuma transação encontrada</h3>
                <p className="text-muted-foreground max-w-md">
                  Você ainda não possui movimentações financeiras. As transações aparecerão aqui assim que houver vendas.
                </p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
};

export default ExtratoTransacoes;
