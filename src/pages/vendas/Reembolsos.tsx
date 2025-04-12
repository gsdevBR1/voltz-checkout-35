
import React, { useState } from 'react';
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
  Eye, 
  ArrowUpRight,
  FileText,
  Loader2
} from 'lucide-react';
import { formatCurrency, formatDateTime } from '@/lib/utils';
import { Pagination, PaginationContent, PaginationItem, PaginationLink, PaginationNext, PaginationPrevious } from "@/components/ui/pagination";
import { useToast } from "@/hooks/use-toast";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";

// Mock data for refunds
const mockRefunds = [
  {
    id: 'REF0001',
    orderId: '000123',
    product: 'Smartphone XYZ Pro',
    value: 1299.90,
    status: 'Aprovado',
    requestDate: new Date(2023, 3, 16, 10, 15),
    reason: 'Produto com defeito'
  },
  {
    id: 'REF0002',
    orderId: '000124',
    product: 'Notebook Ultra',
    value: 4599.90,
    status: 'Recusado',
    requestDate: new Date(2023, 3, 17, 14, 30),
    reason: 'Fora do prazo de garantia'
  },
  {
    id: 'REF0003',
    orderId: '000125',
    product: 'Fone de Ouvido Premium',
    value: 349.90,
    status: 'Solicitado',
    requestDate: new Date(2023, 3, 18, 9, 45),
    reason: 'Produto não atendeu às expectativas'
  },
  {
    id: 'REF0004',
    orderId: '000126',
    product: 'Smart TV 55"',
    value: 3299.90,
    status: 'Em Análise',
    requestDate: new Date(2023, 3, 19, 16, 20),
    reason: 'Produto diferente do anunciado'
  },
  {
    id: 'REF0005',
    orderId: '000127',
    product: 'Câmera DSLR',
    value: 2899.90,
    status: 'Aprovado',
    requestDate: new Date(2023, 3, 20, 11, 10),
    reason: 'Cliente recebeu produto danificado'
  }
];

const getStatusBadge = (status: string) => {
  const statusMap: Record<string, { variant: "default" | "destructive" | "outline" | "secondary"; label: string }> = {
    'Aprovado': { variant: 'default', label: 'Aprovado' },
    'Solicitado': { variant: 'secondary', label: 'Solicitado' },
    'Em Análise': { variant: 'outline', label: 'Em Análise' },
    'Recusado': { variant: 'destructive', label: 'Recusado' },
  };
  
  const statusConfig = statusMap[status] || { variant: 'outline', label: status };
  
  return (
    <Badge variant={statusConfig.variant}>
      {statusConfig.label}
    </Badge>
  );
};

const Reembolsos: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [periodFilter, setPeriodFilter] = useState('all');
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedOrderId, setSelectedOrderId] = useState('');
  const [refundReason, setRefundReason] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showRefundDialog, setShowRefundDialog] = useState(false);
  const itemsPerPage = 5;
  const { toast } = useToast();
  
  const filteredRefunds = mockRefunds.filter(refund => {
    const matchesSearch = 
      refund.orderId.includes(searchTerm) || 
      refund.product.toLowerCase().includes(searchTerm.toLowerCase());
      
    const matchesStatus = statusFilter === 'all' || refund.status === statusFilter;
    
    let matchesPeriod = true;
    const now = new Date();
    
    if (periodFilter === 'today') {
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      matchesPeriod = refund.requestDate >= today && refund.requestDate <= now;
    } else if (periodFilter === 'yesterday') {
      const yesterday = new Date();
      yesterday.setDate(yesterday.getDate() - 1);
      yesterday.setHours(0, 0, 0, 0);
      
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      
      matchesPeriod = refund.requestDate >= yesterday && refund.requestDate < today;
    } else if (periodFilter === '7days') {
      const sevenDaysAgo = new Date();
      sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
      matchesPeriod = refund.requestDate >= sevenDaysAgo && refund.requestDate <= now;
    } else if (periodFilter === '30days') {
      const thirtyDaysAgo = new Date();
      thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
      matchesPeriod = refund.requestDate >= thirtyDaysAgo && refund.requestDate <= now;
    }
    
    return matchesSearch && matchesStatus && matchesPeriod;
  });

  const totalPages = Math.ceil(filteredRefunds.length / itemsPerPage);
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredRefunds.slice(indexOfFirstItem, indexOfLastItem);

  const handleViewDetails = (refundId: string) => {
    toast({
      title: "Detalhes do reembolso",
      description: `Visualizando detalhes do reembolso ${refundId}`,
    });
  };
  
  const handleSubmitRefund = () => {
    if (!refundReason.trim()) {
      toast({
        variant: "destructive",
        title: "Erro na solicitação",
        description: "Por favor, informe o motivo do reembolso."
      });
      return;
    }
    
    setIsSubmitting(true);
    
    // Simulate API request
    setTimeout(() => {
      setIsSubmitting(false);
      setShowRefundDialog(false);
      setRefundReason('');
      
      toast({
        title: "Reembolso solicitado",
        description: `Reembolso para o pedido #${selectedOrderId} foi solicitado com sucesso.`,
      });
    }, 1500);
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row justify-between gap-4">
          <div className="relative w-full sm:w-64">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Buscar pedido, produto..."
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
                <SelectItem value="Solicitado">Solicitado</SelectItem>
                <SelectItem value="Em Análise">Em Análise</SelectItem>
                <SelectItem value="Aprovado">Aprovado</SelectItem>
                <SelectItem value="Recusado">Recusado</SelectItem>
              </SelectContent>
            </Select>
            
            <Dialog open={showRefundDialog} onOpenChange={setShowRefundDialog}>
              <DialogTrigger asChild>
                <Button variant="default" size="sm">
                  <ArrowUpRight className="h-4 w-4 mr-2" />
                  Solicitar Reembolso
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                  <DialogTitle>Solicitar Reembolso</DialogTitle>
                  <DialogDescription>
                    Informe o ID do pedido e o motivo do reembolso. Nosso time irá analisar sua solicitação.
                  </DialogDescription>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                  <div className="grid gap-2">
                    <Label htmlFor="orderId">ID do Pedido</Label>
                    <Input
                      id="orderId"
                      placeholder="Ex: 000123"
                      value={selectedOrderId}
                      onChange={(e) => setSelectedOrderId(e.target.value)}
                    />
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="reason">Motivo do Reembolso</Label>
                    <Textarea
                      id="reason"
                      placeholder="Descreva detalhadamente o motivo do reembolso..."
                      value={refundReason}
                      onChange={(e) => setRefundReason(e.target.value)}
                      rows={4}
                    />
                  </div>
                </div>
                <DialogFooter>
                  <Button variant="outline" onClick={() => setShowRefundDialog(false)}>
                    Cancelar
                  </Button>
                  <Button onClick={handleSubmitRefund} disabled={isSubmitting}>
                    {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                    {isSubmitting ? 'Enviando...' : 'Solicitar Reembolso'}
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </div>
        </div>
        
        <Card>
          <CardHeader className="pb-3">
            <CardTitle>Reembolsos</CardTitle>
          </CardHeader>
          <CardContent>
            {filteredRefunds.length > 0 ? (
              <>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="w-[100px]">Pedido ID</TableHead>
                      <TableHead className="min-w-[250px]">Produto</TableHead>
                      <TableHead>Valor</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Data da Solicitação</TableHead>
                      <TableHead className="w-[80px]">Ações</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {currentItems.map((refund) => (
                      <TableRow key={refund.id}>
                        <TableCell className="font-medium">
                          #{refund.orderId}
                        </TableCell>
                        <TableCell className="max-w-[250px]">
                          <div className="truncate" title={refund.product}>
                            {refund.product}
                          </div>
                        </TableCell>
                        <TableCell>
                          {formatCurrency(refund.value)}
                        </TableCell>
                        <TableCell>
                          {getStatusBadge(refund.status)}
                        </TableCell>
                        <TableCell>
                          {formatDateTime(refund.requestDate)}
                        </TableCell>
                        <TableCell>
                          <Button 
                            variant="ghost" 
                            size="icon"
                            onClick={() => handleViewDetails(refund.id)}
                          >
                            <Eye className="h-4 w-4" />
                          </Button>
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
                <h3 className="text-lg font-medium mb-2">Nenhum reembolso encontrado</h3>
                <p className="text-muted-foreground max-w-md">
                  Você ainda não possui reembolsos. Os reembolsos aparecerão aqui quando forem solicitados.
                </p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
};

export default Reembolsos;
