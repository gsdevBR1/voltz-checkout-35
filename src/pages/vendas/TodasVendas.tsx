
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import DashboardLayout from '@/components/DashboardLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Checkbox } from '@/components/ui/checkbox';
import { Eye, Search, Filter, Download, Calendar } from 'lucide-react';
import { formatCurrency, formatDateTime } from '@/lib/utils';
import { Pagination, PaginationContent, PaginationItem, PaginationLink, PaginationNext, PaginationPrevious } from "@/components/ui/pagination";

// Extended mock data with more fields
const mockOrders = [
  {
    id: '000123',
    products: [
      { name: 'Smartphone XYZ Pro', isUpsell: false, isOrderBump: false }
    ],
    customer: 'João Silva',
    email: 'joao.silva@example.com',
    phone: '(11) 98765-4321',
    total: 1299.90,
    paymentMethod: 'Cartão de Crédito',
    gateway: 'Mercado Pago',
    status: 'Aprovado',
    createdAt: new Date(2023, 3, 15, 14, 30),
    paidAt: new Date(2023, 3, 15, 14, 35),
    isRecurring: false,
    isManual: false,
  },
  {
    id: '000124',
    products: [
      { name: 'Notebook Ultra', isUpsell: false, isOrderBump: false },
      { name: 'Garantia Estendida', isUpsell: true, isOrderBump: false }
    ],
    customer: 'Maria Souza',
    email: 'maria.souza@example.com',
    phone: '(11) 97654-3210',
    total: 4599.90,
    paymentMethod: 'Pix',
    gateway: 'Pagar.me',
    status: 'Aprovado',
    createdAt: new Date(2023, 3, 15, 15, 45),
    paidAt: new Date(2023, 3, 15, 15, 50),
    isRecurring: false,
    isManual: false,
  },
  {
    id: '000125',
    products: [
      { name: 'Fone de Ouvido Premium', isUpsell: false, isOrderBump: false },
      { name: 'Case Protetora', isUpsell: false, isOrderBump: true }
    ],
    customer: 'Carlos Oliveira',
    email: 'carlos.oliveira@example.com',
    phone: '(11) 96543-2109',
    total: 349.90,
    paymentMethod: 'Boleto',
    gateway: 'Iugu',
    status: 'Pendente',
    createdAt: new Date(2023, 3, 16, 9, 20),
    paidAt: null,
    isRecurring: false,
    isManual: false,
  },
  {
    id: '000126',
    products: [
      { name: 'Smart TV 55"', isUpsell: false, isOrderBump: false }
    ],
    customer: 'Ana Pereira',
    email: 'ana.pereira@example.com',
    phone: '(11) 95432-1098',
    total: 3299.90,
    paymentMethod: 'Cartão de Crédito',
    gateway: 'Mercado Pago',
    status: 'Reembolsado',
    createdAt: new Date(2023, 3, 16, 11, 15),
    paidAt: new Date(2023, 3, 16, 11, 20),
    isRecurring: false,
    isManual: false,
  },
  {
    id: '000127',
    products: [
      { name: 'Câmera DSLR', isUpsell: false, isOrderBump: false }
    ],
    customer: 'Pedro Santos',
    email: 'pedro.santos@example.com',
    phone: '(11) 94321-0987',
    total: 2899.90,
    paymentMethod: 'Pix',
    gateway: 'Pagar.me',
    status: 'Aprovado',
    createdAt: new Date(2023, 3, 17, 13, 40),
    paidAt: new Date(2023, 3, 17, 13, 45),
    isRecurring: true,
    isManual: false,
  },
  {
    id: '000128',
    products: [
      { name: 'Console de Games', isUpsell: false, isOrderBump: false }
    ],
    customer: 'Lucia Ferreira',
    email: 'lucia.ferreira@example.com',
    phone: '(11) 93210-9876',
    total: 2499.90,
    paymentMethod: 'Cartão de Crédito',
    gateway: 'Iugu',
    status: 'Chargeback',
    createdAt: new Date(2023, 3, 18, 10, 10),
    paidAt: new Date(2023, 3, 18, 10, 15),
    isRecurring: false,
    isManual: false,
  },
  {
    id: '000129',
    products: [
      { name: 'Tablet 10"', isUpsell: false, isOrderBump: false },
      { name: 'Capa com Teclado', isUpsell: false, isOrderBump: true }
    ],
    customer: 'Roberto Almeida',
    email: 'roberto.almeida@example.com',
    phone: '(11) 92109-8765',
    total: 1899.90,
    paymentMethod: 'Pix',
    gateway: 'Mercado Pago',
    status: 'Aprovado',
    createdAt: new Date(2023, 3, 19, 16, 20),
    paidAt: new Date(2023, 3, 19, 16, 25),
    isRecurring: false,
    isManual: true,
  },
];

const getStatusBadge = (status: string) => {
  const statusMap: Record<string, { variant: "default" | "destructive" | "outline" | "secondary"; label: string }> = {
    'Aprovado': { variant: 'default', label: 'Aprovado' },
    'Pendente': { variant: 'secondary', label: 'Pendente' },
    'Reembolsado': { variant: 'destructive', label: 'Reembolsado' },
    'Chargeback': { variant: 'destructive', label: 'Chargeback' },
    'Cancelado': { variant: 'outline', label: 'Cancelado' },
  };
  
  const statusConfig = statusMap[status] || { variant: 'outline', label: status };
  
  return (
    <Badge variant={statusConfig.variant}>
      {statusConfig.label}
    </Badge>
  );
};

// Component to display product tags
const ProductTag = ({ type }: { type: string }) => {
  if (type === 'upsell') {
    return <Badge variant="outline" className="ml-1 text-xs bg-blue-50 text-blue-700 border-blue-200">Upsell</Badge>;
  } else if (type === 'orderbump') {
    return <Badge variant="outline" className="ml-1 text-xs bg-purple-50 text-purple-700 border-purple-200">OrderBump</Badge>;
  }
  return null;
};

// Component to display transaction tags
const TransactionTag = ({ isRecurring, isManual }: { isRecurring: boolean; isManual: boolean }) => {
  if (isRecurring) {
    return <Badge variant="outline" className="ml-1 text-xs bg-green-50 text-green-700 border-green-200">Recorrente</Badge>;
  } else if (isManual) {
    return <Badge variant="outline" className="ml-1 text-xs bg-amber-50 text-amber-700 border-amber-200">Manual</Badge>;
  }
  return null;
};

const TodasVendas: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [paymentFilter, setPaymentFilter] = useState('all');
  const [gatewayFilter, setGatewayFilter] = useState('all');
  const [periodFilter, setPeriodFilter] = useState('all');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;
  const navigate = useNavigate();
  
  // Apply all filters
  const filteredOrders = mockOrders.filter(order => {
    const matchesSearch = 
      order.id.includes(searchTerm) || 
      order.customer.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.products.some(p => p.name.toLowerCase().includes(searchTerm.toLowerCase()));
      
    const matchesStatus = statusFilter === 'all' || order.status === statusFilter;
    const matchesPayment = paymentFilter === 'all' || order.paymentMethod === paymentFilter;
    const matchesGateway = gatewayFilter === 'all' || order.gateway === gatewayFilter;
    
    // Period filter logic would go here (today, yesterday, 7 days, 30 days)
    let matchesPeriod = true;
    const now = new Date();
    
    if (periodFilter === 'today') {
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      matchesPeriod = order.createdAt >= today && order.createdAt <= now;
    } else if (periodFilter === 'yesterday') {
      const yesterday = new Date();
      yesterday.setDate(yesterday.getDate() - 1);
      yesterday.setHours(0, 0, 0, 0);
      
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      
      matchesPeriod = order.createdAt >= yesterday && order.createdAt < today;
    } else if (periodFilter === '7days') {
      const sevenDaysAgo = new Date();
      sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
      matchesPeriod = order.createdAt >= sevenDaysAgo && order.createdAt <= now;
    } else if (periodFilter === '30days') {
      const thirtyDaysAgo = new Date();
      thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
      matchesPeriod = order.createdAt >= thirtyDaysAgo && order.createdAt <= now;
    }
    
    return matchesSearch && matchesStatus && matchesPayment && matchesGateway && matchesPeriod;
  });

  // Pagination
  const totalPages = Math.ceil(filteredOrders.length / itemsPerPage);
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredOrders.slice(indexOfFirstItem, indexOfLastItem);

  const handleViewDetails = (orderId: string) => {
    navigate(`/vendas/detalhe/${orderId}`);
  };

  const handleExportData = () => {
    // Logic to export data would go here
    console.log("Exporting data...");
    // In a real implementation, we would generate and download a CSV/Excel file
  };
  
  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row justify-between gap-4">
          <div className="relative w-full sm:w-64">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Buscar pedido, cliente..."
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
            
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-[140px]">
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todos os Status</SelectItem>
                <SelectItem value="Aprovado">Aprovado</SelectItem>
                <SelectItem value="Pendente">Pendente</SelectItem>
                <SelectItem value="Reembolsado">Reembolsado</SelectItem>
                <SelectItem value="Chargeback">Chargeback</SelectItem>
                <SelectItem value="Cancelado">Cancelado</SelectItem>
              </SelectContent>
            </Select>
            
            <Select value={paymentFilter} onValueChange={setPaymentFilter}>
              <SelectTrigger className="w-[160px]">
                <SelectValue placeholder="Forma de Pagamento" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todas as Formas</SelectItem>
                <SelectItem value="Pix">Pix</SelectItem>
                <SelectItem value="Cartão de Crédito">Cartão de Crédito</SelectItem>
                <SelectItem value="Boleto">Boleto</SelectItem>
              </SelectContent>
            </Select>
            
            <Select value={gatewayFilter} onValueChange={setGatewayFilter}>
              <SelectTrigger className="w-[140px]">
                <SelectValue placeholder="Adquirente" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todos</SelectItem>
                <SelectItem value="Mercado Pago">Mercado Pago</SelectItem>
                <SelectItem value="Pagar.me">Pagar.me</SelectItem>
                <SelectItem value="Iugu">Iugu</SelectItem>
              </SelectContent>
            </Select>
            
            <Button variant="outline" size="icon" onClick={handleExportData} title="Exportar dados">
              <Download className="h-4 w-4" />
            </Button>
          </div>
        </div>
        
        <Card>
          <CardHeader className="pb-3">
            <CardTitle>Vendas Finalizadas</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Transação</TableHead>
                    <TableHead>Descrição</TableHead>
                    <TableHead>Cliente</TableHead>
                    <TableHead>Forma</TableHead>
                    <TableHead>Adquirente</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Iniciada em</TableHead>
                    <TableHead>Pagamento</TableHead>
                    <TableHead>Valor</TableHead>
                    <TableHead>Ações</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {currentItems.length > 0 ? (
                    currentItems.map((order) => (
                      <TableRow key={order.id}>
                        <TableCell className="font-medium">
                          #{order.id}
                          <TransactionTag isRecurring={order.isRecurring} isManual={order.isManual} />
                        </TableCell>
                        <TableCell className="max-w-[180px]">
                          <div className="flex flex-col">
                            {order.products.map((product, idx) => (
                              <div key={idx} className="flex flex-wrap items-center">
                                <span className="truncate" title={product.name}>{product.name}</span>
                                {product.isUpsell && <ProductTag type="upsell" />}
                                {product.isOrderBump && <ProductTag type="orderbump" />}
                              </div>
                            ))}
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="font-medium">{order.customer}</div>
                          <div className="text-sm text-muted-foreground truncate">{order.email}</div>
                        </TableCell>
                        <TableCell>{order.paymentMethod}</TableCell>
                        <TableCell>{order.gateway}</TableCell>
                        <TableCell>{getStatusBadge(order.status)}</TableCell>
                        <TableCell>{formatDateTime(order.createdAt)}</TableCell>
                        <TableCell>
                          {order.paidAt ? formatDateTime(order.paidAt) : 
                           <span className="text-muted-foreground">Não pago</span>}
                        </TableCell>
                        <TableCell>{formatCurrency(order.total)}</TableCell>
                        <TableCell>
                          <Button 
                            variant="outline" 
                            size="sm"
                            onClick={() => handleViewDetails(order.id)}
                          >
                            <Eye className="h-3.5 w-3.5 mr-1" />
                            Ver detalhes
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))
                  ) : (
                    <TableRow>
                      <TableCell colSpan={10} className="text-center py-6 text-muted-foreground">
                        Nenhuma venda encontrada com os filtros aplicados.
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </div>
            
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
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
};

export default TodasVendas;
