import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import DashboardLayout from '@/components/DashboardLayout';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import { formatCurrency, formatDateTime } from "@/lib/utils";
import { useToast } from '@/hooks/use-toast';
import {
  Search,
  FileText,
  Download,
  ChevronLeft,
  Filter,
  CalendarIcon,
  CreditCard,
  ExternalLink,
  RefreshCw,
  AlertCircle,
} from "lucide-react";

// Mock customer data
const MOCK_CUSTOMERS = [
  {
    id: '1',
    name: 'João Silva',
    email: 'joao.silva@email.com',
  },
  {
    id: '2',
    name: 'Maria Oliveira',
    email: 'maria.oliveira@email.com',
  }
];

// Mock data for orders with more details
const MOCK_ORDERS = [
  {
    id: "00123",
    date: "2025-04-12T18:40:00",
    products: [
      { name: "Fone Bluetooth", type: "principal" }
    ],
    total: 199.90,
    paymentMethod: "Cartão de Crédito",
    status: "Aprovado",
    isRepurchase: false
  },
  {
    id: "00102",
    date: "2025-04-08T11:15:00",
    products: [
      { name: "Camiseta Branca", type: "principal" },
      { name: "Proteção Extra", type: "orderbump" }
    ],
    total: 109.90,
    paymentMethod: "Pix",
    status: "Reembolsado",
    isRepurchase: false
  },
  {
    id: "00098",
    date: "2025-04-01T09:30:00",
    products: [
      { name: "Notebook Dell", type: "principal" },
      { name: "Garantia Estendida", type: "orderbump" },
      { name: "Mouse sem fio", type: "upsell" }
    ],
    total: 4499.90,
    paymentMethod: "Boleto",
    status: "Aprovado",
    isRepurchase: false
  },
  {
    id: "00056",
    date: "2025-03-15T14:20:00",
    products: [
      { name: "Mouse sem fio", type: "principal" }
    ],
    total: 129.90,
    paymentMethod: "Cartão de Crédito",
    status: "Entregue",
    isRepurchase: true
  },
  {
    id: "00042",
    date: "2025-03-10T10:45:00",
    products: [
      { name: "Teclado Mecânico", type: "principal" }
    ],
    total: 349.90,
    paymentMethod: "Pix",
    status: "Aprovado",
    isRepurchase: false
  },
  {
    id: "00039",
    date: "2025-03-05T16:30:00",
    products: [
      { name: "Mousepad XL", type: "principal" }
    ],
    total: 49.90,
    paymentMethod: "Cartão de Crédito",
    status: "Entregue",
    isRepurchase: false
  },
  {
    id: "00027",
    date: "2025-02-20T13:15:00",
    products: [
      { name: "Monitor 24\"", type: "principal" },
      { name: "Suporte de Monitor", type: "upsell" }
    ],
    total: 899.90,
    paymentMethod: "Pix",
    status: "Entregue",
    isRepurchase: false
  }
];

const HistoricoCompras: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [customer, setCustomer] = useState<typeof MOCK_CUSTOMERS[0] | null>(null);
  const [orders, setOrders] = useState<typeof MOCK_ORDERS>([]);
  const [filteredOrders, setFilteredOrders] = useState<typeof MOCK_ORDERS>([]);
  const [loading, setLoading] = useState(true);
  
  // Filter state
  const [searchTerm, setSearchTerm] = useState('');
  const [dateFilter, setDateFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');
  
  // Calculate statistics
  const totalSpent = filteredOrders.reduce((sum, order) => {
    if (order.status !== 'Reembolsado' && order.status !== 'Chargeback') {
      return sum + order.total;
    }
    return sum;
  }, 0);
  
  const successfulOrders = filteredOrders.filter(order => 
    order.status === 'Aprovado' || order.status === 'Entregue'
  ).length;
  
  useEffect(() => {
    // In a real app, this would be API calls
    const foundCustomer = MOCK_CUSTOMERS.find(c => c.id === id);
    
    if (foundCustomer) {
      setCustomer(foundCustomer);
      // In a real app, this would filter orders based on customer ID
      setOrders(MOCK_ORDERS);
      setFilteredOrders(MOCK_ORDERS);
    } else {
      setOrders([]);
      setFilteredOrders([]);
    }
    
    setLoading(false);
  }, [id]);
  
  // Apply all filters
  useEffect(() => {
    let result = [...orders];
    
    // Apply search filter
    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      result = result.filter(order => 
        order.id.toLowerCase().includes(term) ||
        order.products.some(product => product.name.toLowerCase().includes(term)) ||
        order.paymentMethod.toLowerCase().includes(term) ||
        order.status.toLowerCase().includes(term)
      );
    }
    
    // Apply date filter
    const now = new Date();
    if (dateFilter !== 'all') {
      result = result.filter(order => {
        const orderDate = new Date(order.date);
        switch (dateFilter) {
          case 'today':
            return orderDate.toDateString() === now.toDateString();
          case 'week':
            const weekAgo = new Date();
            weekAgo.setDate(now.getDate() - 7);
            return orderDate >= weekAgo;
          case 'month':
            const monthAgo = new Date();
            monthAgo.setMonth(now.getMonth() - 1);
            return orderDate >= monthAgo;
          default:
            return true;
        }
      });
    }
    
    // Apply status filter
    if (statusFilter !== 'all') {
      result = result.filter(order => order.status.toLowerCase() === statusFilter.toLowerCase());
    }
    
    setFilteredOrders(result);
  }, [orders, searchTerm, dateFilter, statusFilter]);
  
  const getStatusClass = (status: string) => {
    switch (status.toLowerCase()) {
      case 'aprovado':
        return 'text-green-600 bg-green-100 dark:bg-green-950 dark:text-green-400';
      case 'entregue':
        return 'text-blue-600 bg-blue-100 dark:bg-blue-950 dark:text-blue-400';
      case 'reembolsado':
        return 'text-red-600 bg-red-100 dark:bg-red-950 dark:text-red-400';
      case 'chargeback':
        return 'text-amber-600 bg-amber-100 dark:bg-amber-950 dark:text-amber-400';
      default:
        return 'text-gray-600 bg-gray-100 dark:bg-gray-800 dark:text-gray-400';
    }
  };
  
  const getProductTypeClass = (type: string) => {
    switch (type.toLowerCase()) {
      case 'orderbump':
        return 'bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-400 border-amber-200';
      case 'upsell':
        return 'bg-purple-100 text-purple-800 dark:bg-purple-950 dark:text-purple-400 border-purple-200';
      default:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-300 border-gray-200';
    }
  };
  
  const exportData = () => {
    // In a real app, this would generate and download a CSV/Excel file
    alert('Exportando dados para CSV/Excel');
  };

  const handleRepurchase = (order: typeof MOCK_ORDERS[0]) => {
    // In a real app, we would check stock availability and create a new checkout
    // For now, we'll simulate this with mock data
    
    // Check if any products are unavailable (randomly for demo)
    const unavailableProduct = Math.random() > 0.8 
      ? order.products[Math.floor(Math.random() * order.products.length)]
      : null;
    
    if (unavailableProduct) {
      toast({
        variant: "destructive",
        title: "Produto indisponível",
        description: `${unavailableProduct.name} não está mais disponível em estoque.`,
        action: (
          <Button variant="outline" size="sm" onClick={() => navigate('/vendas/todas')}>
            Ver outras opções
          </Button>
        ),
      });
      return;
    }
    
    // Success path: create checkout and redirect
    toast({
      title: "Carrinho recriado com sucesso!",
      description: `${order.products.length} produto(s) adicionados ao seu carrinho.`,
    });
    
    // In a real app, this would create a checkout and redirect to it
    // For now, we'll just show another toast
    setTimeout(() => {
      toast({
        title: "Redirecionando para o checkout...",
        description: "Em um app real, isso abriria uma nova página de checkout.",
      });
    }, 1500);
  };
  
  if (loading) {
    return (
      <DashboardLayout>
        <div className="flex justify-center items-center min-h-[60vh]">
          <div className="animate-pulse text-lg">Carregando histórico de compras...</div>
        </div>
      </DashboardLayout>
    );
  }
  
  if (!customer) {
    return (
      <DashboardLayout>
        <div className="flex flex-col items-center justify-center min-h-[60vh] space-y-4">
          <h1 className="text-2xl font-bold">Cliente não encontrado</h1>
          <p className="text-muted-foreground">O cliente que você está procurando não existe ou foi removido.</p>
          <Button asChild>
            <Link to="/clientes/todos">
              <ChevronLeft className="mr-2 h-4 w-4" />
              Voltar para a lista de clientes
            </Link>
          </Button>
        </div>
      </DashboardLayout>
    );
  }
  
  return (
    <DashboardLayout>
      <div className="mb-6">
        <div className="flex flex-wrap gap-2 items-center justify-between mb-4">
          <Button variant="outline" size="sm" asChild>
            <Link to={`/clientes/perfil/${id}`}>
              <ChevronLeft className="mr-1 h-4 w-4" />
              Voltar ao perfil
            </Link>
          </Button>
          
          <Button variant="outline" size="sm" onClick={exportData}>
            <Download className="mr-1 h-4 w-4" />
            Exportar Histórico
          </Button>
        </div>
        
        <h1 className="text-3xl font-bold flex items-center gap-2">
          <FileText className="h-7 w-7 text-primary" />
          Histórico de Compras — {customer.name}
        </h1>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <Card>
          <CardContent className="pt-6">
            <div className="text-center">
              <p className="text-muted-foreground text-sm">Total Gasto</p>
              <p className="text-3xl font-bold">{formatCurrency(totalSpent)}</p>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="pt-6">
            <div className="text-center">
              <p className="text-muted-foreground text-sm">Pedidos Realizados</p>
              <p className="text-3xl font-bold">{filteredOrders.length}</p>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="pt-6">
            <div className="text-center">
              <p className="text-muted-foreground text-sm">Taxa de Sucesso</p>
              <p className="text-3xl font-bold">
                {filteredOrders.length > 0 
                  ? `${Math.round((successfulOrders / filteredOrders.length) * 100)}%`
                  : "0%"
                }
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
      
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-xl">
            <FileText className="h-5 w-5 text-primary" />
            Compras Realizadas
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col md:flex-row gap-4 mb-4">
            <div className="relative flex-1">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Buscar por número do pedido, produto..."
                className="pl-8"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            
            <div className="flex gap-2">
              <Select value={dateFilter} onValueChange={setDateFilter}>
                <SelectTrigger className="w-[140px] gap-1">
                  <CalendarIcon className="h-4 w-4" />
                  <SelectValue placeholder="Período" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todos períodos</SelectItem>
                  <SelectItem value="today">Hoje</SelectItem>
                  <SelectItem value="week">Últimos 7 dias</SelectItem>
                  <SelectItem value="month">Últimos 30 dias</SelectItem>
                </SelectContent>
              </Select>
              
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-[140px] gap-1">
                  <Filter className="h-4 w-4" />
                  <SelectValue placeholder="Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todos status</SelectItem>
                  <SelectItem value="aprovado">Aprovado</SelectItem>
                  <SelectItem value="entregue">Entregue</SelectItem>
                  <SelectItem value="reembolsado">Reembolsado</SelectItem>
                  <SelectItem value="chargeback">Chargeback</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Pedido</TableHead>
                  <TableHead>Data</TableHead>
                  <TableHead>Produtos</TableHead>
                  <TableHead>Pagamento</TableHead>
                  <TableHead className="text-right">Valor Total</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Ações</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredOrders.length > 0 ? (
                  filteredOrders.map((order) => (
                    <TableRow key={order.id}>
                      <TableCell className="font-medium">#{order.id}</TableCell>
                      <TableCell>{formatDateTime(new Date(order.date))}</TableCell>
                      <TableCell>
                        <div className="space-y-1">
                          {order.products.map((product, idx) => (
                            <div key={idx} className="flex items-center gap-1">
                              <span>{product.name}</span>
                              {product.type !== 'principal' && (
                                <Badge variant="outline" className={getProductTypeClass(product.type)}>
                                  {product.type === 'orderbump' ? 'OrderBump' : 'Upsell'}
                                </Badge>
                              )}
                              {order.isRepurchase && idx === 0 && (
                                <Badge variant="outline" className="bg-blue-100 text-blue-800 dark:bg-blue-950 dark:text-blue-400 border-blue-200">
                                  <RefreshCw className="h-3 w-3 mr-1" />
                                  Recompra
                                </Badge>
                              )}
                            </div>
                          ))}
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-1.5">
                          <CreditCard className="h-4 w-4 text-muted-foreground" />
                          <span>{order.paymentMethod}</span>
                        </div>
                      </TableCell>
                      <TableCell className="text-right font-medium">{formatCurrency(order.total)}</TableCell>
                      <TableCell>
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusClass(order.status)}`}>
                          {order.status}
                        </span>
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end gap-2">
                          <Button
                            variant="outline"
                            size="sm"
                            className="text-green-600 hover:text-green-700 hover:bg-green-50 dark:hover:bg-green-950"
                            onClick={() => handleRepurchase(order)}
                          >
                            <RefreshCw className="h-4 w-4 mr-1" />
                            Recomprar
                          </Button>
                          <Button 
                            variant="ghost" 
                            size="sm" 
                            asChild
                          >
                            <Link to={`/vendas/detalhe/${order.id}`}>
                              <ExternalLink className="h-4 w-4 mr-1" />
                              Ver detalhes
                            </Link>
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={7} className="text-center py-4 text-muted-foreground">
                      Nenhum pedido encontrado com os filtros aplicados.
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
          
          {filteredOrders.length > 10 && (
            <div className="mt-4">
              <Pagination>
                <PaginationContent>
                  <PaginationItem>
                    <PaginationPrevious href="#" />
                  </PaginationItem>
                  <PaginationItem>
                    <PaginationLink isActive href="#">1</PaginationLink>
                  </PaginationItem>
                  <PaginationItem>
                    <PaginationLink href="#">2</PaginationLink>
                  </PaginationItem>
                  <PaginationItem>
                    <PaginationLink href="#">3</PaginationLink>
                  </PaginationItem>
                  <PaginationItem>
                    <PaginationEllipsis />
                  </PaginationItem>
                  <PaginationItem>
                    <PaginationNext href="#" />
                  </PaginationItem>
                </PaginationContent>
              </Pagination>
            </div>
          )}
        </CardContent>
      </Card>
    </DashboardLayout>
  );
};

export default HistoricoCompras;
