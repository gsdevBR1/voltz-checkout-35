import React, { useState } from 'react';
import DashboardLayout from '@/components/DashboardLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Eye, Search, Filter } from 'lucide-react';
import { formatCurrency, formatDateTime } from '@/lib/utils';

const mockOrders = [
  {
    id: '000123',
    product: 'Smartphone XYZ Pro',
    customer: 'João Silva',
    email: 'joao.silva@example.com',
    total: 1299.90,
    paymentMethod: 'Cartão de Crédito',
    status: 'Aprovado',
    date: new Date(2023, 3, 15, 14, 30),
  },
  {
    id: '000124',
    product: 'Notebook Ultra',
    customer: 'Maria Souza',
    email: 'maria.souza@example.com',
    total: 4599.90,
    paymentMethod: 'Pix',
    status: 'Aprovado',
    date: new Date(2023, 3, 15, 15, 45),
  },
  {
    id: '000125',
    product: 'Fone de Ouvido Premium',
    customer: 'Carlos Oliveira',
    email: 'carlos.oliveira@example.com',
    total: 349.90,
    paymentMethod: 'Boleto',
    status: 'Pendente',
    date: new Date(2023, 3, 16, 9, 20),
  },
  {
    id: '000126',
    product: 'Smart TV 55"',
    customer: 'Ana Pereira',
    email: 'ana.pereira@example.com',
    total: 3299.90,
    paymentMethod: 'Cartão de Crédito',
    status: 'Reembolsado',
    date: new Date(2023, 3, 16, 11, 15),
  },
  {
    id: '000127',
    product: 'Câmera DSLR',
    customer: 'Pedro Santos',
    email: 'pedro.santos@example.com',
    total: 2899.90,
    paymentMethod: 'Pix',
    status: 'Aprovado',
    date: new Date(2023, 3, 17, 13, 40),
  },
];

const getStatusBadge = (status: string) => {
  const statusMap: Record<string, { variant: "default" | "destructive" | "outline" | "secondary"; label: string }> = {
    'Aprovado': { variant: 'default', label: 'Aprovado' },
    'Pendente': { variant: 'secondary', label: 'Pendente' },
    'Reembolsado': { variant: 'destructive', label: 'Reembolsado' },
    'Chargeback': { variant: 'destructive', label: 'Chargeback' },
  };
  
  const statusConfig = statusMap[status] || { variant: 'outline', label: status };
  
  return (
    <Badge variant={statusConfig.variant}>
      {statusConfig.label}
    </Badge>
  );
};

const TodasVendas: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [paymentFilter, setPaymentFilter] = useState('all');
  
  const filteredOrders = mockOrders.filter(order => {
    const matchesSearch = 
      order.id.includes(searchTerm) || 
      order.customer.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.product.toLowerCase().includes(searchTerm.toLowerCase());
      
    const matchesStatus = statusFilter === 'all' || order.status === statusFilter;
    const matchesPayment = paymentFilter === 'all' || order.paymentMethod === paymentFilter;
    
    return matchesSearch && matchesStatus && matchesPayment;
  });
  
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
          
          <div className="flex flex-col sm:flex-row gap-2">
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-full sm:w-[180px]">
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todos os Status</SelectItem>
                <SelectItem value="Aprovado">Aprovado</SelectItem>
                <SelectItem value="Pendente">Pendente</SelectItem>
                <SelectItem value="Reembolsado">Reembolsado</SelectItem>
                <SelectItem value="Chargeback">Chargeback</SelectItem>
              </SelectContent>
            </Select>
            
            <Select value={paymentFilter} onValueChange={setPaymentFilter}>
              <SelectTrigger className="w-full sm:w-[180px]">
                <SelectValue placeholder="Forma de Pagamento" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todas as Formas</SelectItem>
                <SelectItem value="Pix">Pix</SelectItem>
                <SelectItem value="Cartão de Crédito">Cartão de Crédito</SelectItem>
                <SelectItem value="Boleto">Boleto</SelectItem>
              </SelectContent>
            </Select>
            
            <Button variant="outline" size="icon">
              <Filter className="h-4 w-4" />
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
                    <TableHead>Nº Pedido</TableHead>
                    <TableHead>Produto</TableHead>
                    <TableHead>Cliente</TableHead>
                    <TableHead>Valor Total</TableHead>
                    <TableHead>Forma de Pagamento</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Data/Hora</TableHead>
                    <TableHead>Ações</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredOrders.length > 0 ? (
                    filteredOrders.map((order) => (
                      <TableRow key={order.id}>
                        <TableCell className="font-medium">#{order.id}</TableCell>
                        <TableCell className="max-w-[200px] truncate" title={order.product}>
                          {order.product}
                        </TableCell>
                        <TableCell>
                          <div className="font-medium">{order.customer}</div>
                          <div className="text-sm text-muted-foreground">{order.email}</div>
                        </TableCell>
                        <TableCell>{formatCurrency(order.total)}</TableCell>
                        <TableCell>{order.paymentMethod}</TableCell>
                        <TableCell>{getStatusBadge(order.status)}</TableCell>
                        <TableCell>{formatDateTime(order.date)}</TableCell>
                        <TableCell>
                          <Button variant="outline" size="sm">
                            <Eye className="h-3.5 w-3.5 mr-1" />
                            Ver detalhes
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))
                  ) : (
                    <TableRow>
                      <TableCell colSpan={8} className="text-center py-6 text-muted-foreground">
                        Nenhuma venda encontrada com os filtros aplicados.
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
};

export default TodasVendas;
