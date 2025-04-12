
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
  FileText,
  Info
} from 'lucide-react';
import { formatCurrency, formatDateTime } from '@/lib/utils';
import { Pagination, PaginationContent, PaginationItem, PaginationLink, PaginationNext, PaginationPrevious } from "@/components/ui/pagination";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { useToast } from "@/hooks/use-toast";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

// Mock data for chargebacks
const mockChargebacks = [
  {
    id: 'CHB0001',
    orderId: '000123',
    value: 1299.90,
    status: 'Confirmado',
    date: new Date(2023, 3, 16, 10, 15),
    notes: 'Estorno solicitado pelo emissor do cartão. Motivo: Transação não reconhecida pelo cliente.'
  },
  {
    id: 'CHB0002',
    orderId: '000124',
    value: 4599.90,
    status: 'Pendente',
    date: new Date(2023, 3, 17, 14, 30),
    notes: 'Contestação em análise pela adquirente. Aguardando posicionamento.'
  },
  {
    id: 'CHB0003',
    orderId: '000125',
    value: 349.90,
    status: 'Cancelado',
    date: new Date(2023, 3, 18, 9, 45),
    notes: 'Estorno cancelado após comprovação de entrega. Cliente retirou a contestação.'
  },
  {
    id: 'CHB0004',
    orderId: '000126',
    value: 3299.90,
    status: 'Confirmado',
    date: new Date(2023, 3, 19, 16, 20),
    notes: 'Estorno processado após contestação do titular. Produto não entregue.'
  },
  {
    id: 'CHB0005',
    orderId: '000127',
    value: 2899.90,
    status: 'Pendente',
    date: new Date(2023, 3, 20, 11, 10),
    notes: 'Adquirente solicitou documentação adicional. Prazo para envio: 5 dias úteis.'
  }
];

const getStatusBadge = (status: string) => {
  const statusMap: Record<string, { variant: "default" | "destructive" | "outline" | "secondary"; label: string }> = {
    'Confirmado': { variant: 'default', label: 'Confirmado' },
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

const Estornos: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [periodFilter, setPeriodFilter] = useState('all');
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedChargeback, setSelectedChargeback] = useState<typeof mockChargebacks[0] | null>(null);
  const [showDetailsDialog, setShowDetailsDialog] = useState(false);
  const itemsPerPage = 5;
  const { toast } = useToast();
  
  const filteredChargebacks = mockChargebacks.filter(chargeback => {
    const matchesSearch = 
      chargeback.orderId.includes(searchTerm) || 
      chargeback.id.toLowerCase().includes(searchTerm.toLowerCase());
      
    const matchesStatus = statusFilter === 'all' || chargeback.status === statusFilter;
    
    let matchesPeriod = true;
    const now = new Date();
    
    if (periodFilter === 'today') {
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      matchesPeriod = chargeback.date >= today && chargeback.date <= now;
    } else if (periodFilter === 'yesterday') {
      const yesterday = new Date();
      yesterday.setDate(yesterday.getDate() - 1);
      yesterday.setHours(0, 0, 0, 0);
      
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      
      matchesPeriod = chargeback.date >= yesterday && chargeback.date < today;
    } else if (periodFilter === '7days') {
      const sevenDaysAgo = new Date();
      sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
      matchesPeriod = chargeback.date >= sevenDaysAgo && chargeback.date <= now;
    } else if (periodFilter === '30days') {
      const thirtyDaysAgo = new Date();
      thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
      matchesPeriod = chargeback.date >= thirtyDaysAgo && chargeback.date <= now;
    }
    
    return matchesSearch && matchesStatus && matchesPeriod;
  });

  const totalPages = Math.ceil(filteredChargebacks.length / itemsPerPage);
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredChargebacks.slice(indexOfFirstItem, indexOfLastItem);

  const handleViewDetails = (chargeback: typeof mockChargebacks[0]) => {
    setSelectedChargeback(chargeback);
    setShowDetailsDialog(true);
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row justify-between gap-4">
          <div className="relative w-full sm:w-64">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Buscar pedido, ID estorno..."
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
                <SelectItem value="Confirmado">Confirmado</SelectItem>
                <SelectItem value="Pendente">Pendente</SelectItem>
                <SelectItem value="Cancelado">Cancelado</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
        
        <Card>
          <CardHeader className="pb-3">
            <CardTitle>Estornos</CardTitle>
          </CardHeader>
          <CardContent>
            {filteredChargebacks.length > 0 ? (
              <>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="w-[120px]">ID Estorno</TableHead>
                      <TableHead className="w-[100px]">Pedido ID</TableHead>
                      <TableHead>Valor</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Data do Estorno</TableHead>
                      <TableHead className="w-[80px]">Ações</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {currentItems.map((chargeback) => (
                      <TableRow key={chargeback.id}>
                        <TableCell className="font-medium">
                          {chargeback.id}
                        </TableCell>
                        <TableCell>
                          #{chargeback.orderId}
                        </TableCell>
                        <TableCell>
                          {formatCurrency(chargeback.value)}
                        </TableCell>
                        <TableCell>
                          {getStatusBadge(chargeback.status)}
                        </TableCell>
                        <TableCell>
                          {formatDateTime(chargeback.date)}
                        </TableCell>
                        <TableCell>
                          <TooltipProvider>
                            <Tooltip>
                              <TooltipTrigger asChild>
                                <Button 
                                  variant="ghost" 
                                  size="icon"
                                  onClick={() => handleViewDetails(chargeback)}
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
                <h3 className="text-lg font-medium mb-2">Nenhum estorno encontrado</h3>
                <p className="text-muted-foreground max-w-md">
                  Você ainda não possui estornos registrados. Os estornos aparecerão aqui quando ocorrerem.
                </p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      <Dialog open={showDetailsDialog} onOpenChange={setShowDetailsDialog}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Detalhes do Estorno</DialogTitle>
            <DialogDescription>
              Informações detalhadas sobre o estorno #{selectedChargeback?.id}
            </DialogDescription>
          </DialogHeader>
          
          {selectedChargeback && (
            <div className="space-y-4 py-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <h4 className="text-sm font-semibold text-muted-foreground mb-1">ID do Estorno</h4>
                  <p>{selectedChargeback.id}</p>
                </div>
                <div>
                  <h4 className="text-sm font-semibold text-muted-foreground mb-1">ID do Pedido</h4>
                  <p>#{selectedChargeback.orderId}</p>
                </div>
                <div>
                  <h4 className="text-sm font-semibold text-muted-foreground mb-1">Valor</h4>
                  <p>{formatCurrency(selectedChargeback.value)}</p>
                </div>
                <div>
                  <h4 className="text-sm font-semibold text-muted-foreground mb-1">Status</h4>
                  <p>{getStatusBadge(selectedChargeback.status)}</p>
                </div>
                <div>
                  <h4 className="text-sm font-semibold text-muted-foreground mb-1">Data</h4>
                  <p>{formatDateTime(selectedChargeback.date)}</p>
                </div>
              </div>
              
              <div>
                <h4 className="text-sm font-semibold text-muted-foreground mb-1">Observações</h4>
                <div className="p-3 bg-muted rounded-md text-sm">
                  {selectedChargeback.notes}
                </div>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </DashboardLayout>
  );
};

export default Estornos;
