
import React, { useState } from 'react';
import { format } from 'date-fns';
import { 
  Drawer,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
  DrawerDescription,
  DrawerFooter
} from '@/components/ui/drawer';
import { Button } from '@/components/ui/button';
import { Webhook, WebhookEvent, WebhookLog, WebhookLogFilters } from '@/types/webhook';
import { Badge } from '@/components/ui/badge';
import { 
  CheckCircle2, 
  XCircle, 
  Clock, 
  ArrowDown, 
  ArrowUp, 
  Calendar, 
  Filter, 
  Copy, 
  RefreshCw,
  ChevronLeft,
  ChevronRight,
  Download,
  Search
} from 'lucide-react';
import { 
  Popover,
  PopoverContent,
  PopoverTrigger
} from '@/components/ui/popover';
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
  DialogDescription,
  DialogFooter 
} from '@/components/ui/dialog';
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { DatePicker } from '@/components/ui/date-picker';
import { useToast } from '@/hooks/use-toast';

const eventLabels: Record<WebhookEvent, string> = {
  'cart.abandoned': 'Carrinho abandonado',
  'order.created': 'Pedido criado',
  'order.updated': 'Atualização do pedido',
  'order.status_updated': 'Atualização do status',
  'order.approved': 'Pedido aprovado',
  'order.rejected': 'Pedido recusado',
};

interface WebhookLogsDrawerProps {
  webhook: Webhook;
  open: boolean;
  onClose: () => void;
}

export const WebhookLogsDrawer: React.FC<WebhookLogsDrawerProps> = ({
  webhook,
  open,
  onClose
}) => {
  // State for filters
  const [filters, setFilters] = useState<WebhookLogFilters>({
    page: 1,
    perPage: 10,
    status: null,
    event: null,
  });
  
  // State for search term
  const [searchTerm, setSearchTerm] = useState<string>('');
  
  // State for loading
  const [isLoading, setIsLoading] = useState<boolean>(false);
  
  // State for selected log
  const [selectedLog, setSelectedLog] = useState<WebhookLog | null>(null);
  
  // State for log detail dialog
  const [isDetailOpen, setIsDetailOpen] = useState<boolean>(false);
  
  const { toast } = useToast();

  // Mock logs data - in a real app, this would come from an API with filters applied
  const mockLogs: WebhookLog[] = [
    {
      id: '1',
      webhookId: webhook.id,
      timestamp: new Date(Date.now() - 1000 * 60 * 5).toISOString(),
      status: 200,
      duration: 320,
      event: 'order.created',
      payload: JSON.stringify({ orderId: '12345', total: 199.90, customer: { name: 'João Silva' } }),
      response: JSON.stringify({ success: true, message: "Webhook received" }),
      headers: { 'x-voltz-token': webhook.token, 'content-type': 'application/json' }
    },
    {
      id: '2',
      webhookId: webhook.id,
      timestamp: new Date(Date.now() - 1000 * 60 * 20).toISOString(),
      status: 200,
      duration: 285,
      event: 'order.created',
      payload: JSON.stringify({ orderId: '12344', total: 99.90, customer: { name: 'Maria Santos' } }),
      response: JSON.stringify({ success: true, message: "Order created" }),
      headers: { 'x-voltz-token': webhook.token, 'content-type': 'application/json' }
    },
    {
      id: '3',
      webhookId: webhook.id,
      timestamp: new Date(Date.now() - 1000 * 60 * 60).toISOString(),
      status: 404,
      duration: 1200,
      event: 'order.approved',
      payload: JSON.stringify({ orderId: '12343', status: 'approved' }),
      response: JSON.stringify({ error: "Endpoint not found" }),
      headers: { 'x-voltz-token': webhook.token, 'content-type': 'application/json' }
    },
    {
      id: '4',
      webhookId: webhook.id,
      timestamp: new Date(Date.now() - 1000 * 60 * 90).toISOString(),
      status: 500,
      duration: 2500,
      event: 'cart.abandoned',
      payload: JSON.stringify({ cartId: '45678', items: [{ product: 'Produto ABC', quantity: 1 }] }),
      response: JSON.stringify({ error: "Internal server error" }),
      headers: { 'x-voltz-token': webhook.token, 'content-type': 'application/json' },
      retried: true
    },
    {
      id: '5',
      webhookId: webhook.id,
      timestamp: new Date(Date.now() - 1000 * 60 * 120).toISOString(),
      status: 200,
      duration: 310,
      event: 'order.updated',
      payload: JSON.stringify({ orderId: '12342', status: 'processing' }),
      response: JSON.stringify({ success: true }),
      headers: { 'x-voltz-token': webhook.token, 'content-type': 'application/json' }
    }
  ];

  // Filter logs by search term and filters
  const filteredLogs = mockLogs.filter(log => {
    // Filter by event
    if (filters.event && log.event !== filters.event) {
      return false;
    }
    
    // Filter by status
    if (filters.status && log.status !== filters.status) {
      return false;
    }
    
    // Filter by start date
    if (filters.startDate && new Date(log.timestamp) < filters.startDate) {
      return false;
    }
    
    // Filter by end date
    if (filters.endDate && new Date(log.timestamp) > filters.endDate) {
      return false;
    }
    
    // Filter by search term (in payload or response)
    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      return (
        log.payload.toLowerCase().includes(term) || 
        (log.response && log.response.toLowerCase().includes(term))
      );
    }
    
    return true;
  });

  // Paginate logs
  const paginatedLogs = filteredLogs.slice(
    (filters.page - 1) * filters.perPage,
    filters.page * filters.perPage
  );

  const totalPages = Math.ceil(filteredLogs.length / filters.perPage);

  const formatTimestamp = (timestamp: string) => {
    try {
      return format(new Date(timestamp), "dd/MM/yyyy HH:mm:ss");
    } catch {
      return 'Data inválida';
    }
  };

  const formatDuration = (duration: number) => {
    return duration >= 1000 ? `${(duration / 1000).toFixed(1)}s` : `${duration}ms`;
  };

  const getStatusBadge = (status: number) => {
    if (status >= 200 && status < 300) {
      return (
        <Badge variant="outline" className="bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200 flex items-center gap-1">
          <CheckCircle2 className="w-3 h-3" />
          {status} OK
        </Badge>
      );
    } else if (status >= 400 && status < 500) {
      return (
        <Badge variant="outline" className="bg-amber-100 text-amber-800 dark:bg-amber-900 dark:text-amber-200 flex items-center gap-1">
          <XCircle className="w-3 h-3" />
          {status} Erro
        </Badge>
      );
    } else {
      return (
        <Badge variant="outline" className="bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200 flex items-center gap-1">
          <XCircle className="w-3 h-3" />
          {status} Erro
        </Badge>
      );
    }
  };

  const handleViewDetails = (log: WebhookLog) => {
    setSelectedLog(log);
    setIsDetailOpen(true);
  };

  const handleCopyToClipboard = (text: string, label: string) => {
    navigator.clipboard.writeText(text);
    toast({
      title: "Copiado!",
      description: `${label} copiado para a área de transferência.`
    });
  };

  const handleExportCsv = () => {
    toast({
      title: "Exportação iniciada",
      description: "Os logs serão exportados em formato CSV."
    });
    // In a real app, this would trigger a CSV download
  };

  const handleChangePage = (newPage: number) => {
    setFilters(prev => ({
      ...prev,
      page: newPage
    }));
  };

  const handleChangePerPage = (value: string) => {
    setFilters(prev => ({
      ...prev,
      perPage: parseInt(value),
      page: 1 // Reset to first page when changing items per page
    }));
  };

  const handleFilterChange = (key: keyof WebhookLogFilters, value: any) => {
    setFilters(prev => ({
      ...prev,
      [key]: value,
      page: 1 // Reset to first page when applying filters
    }));
  };

  const handleResetFilters = () => {
    setFilters({
      page: 1,
      perPage: 10,
      status: null,
      event: null,
      startDate: undefined,
      endDate: undefined
    });
    setSearchTerm('');
  };

  return (
    <>
      <Drawer open={open} onClose={onClose}>
        <DrawerContent className="max-h-[90vh]">
          <DrawerHeader>
            <DrawerTitle>Logs de Entrega - {webhook.name}</DrawerTitle>
            <DrawerDescription>
              {webhook.url}
            </DrawerDescription>
          </DrawerHeader>

          <div className="px-4 py-2">
            {/* Search and filter bar */}
            <div className="flex flex-col md:flex-row gap-2 mb-4">
              <div className="relative flex-1">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Pesquisar nos logs..."
                  className="pl-8"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
              
              <div className="flex gap-2">
                <Popover>
                  <PopoverTrigger asChild>
                    <Button variant="outline" size="sm" className="h-10">
                      <Filter className="h-4 w-4 mr-2" />
                      Filtros
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-80">
                    <div className="space-y-4">
                      <h4 className="font-medium">Filtrar logs</h4>
                      
                      <div className="space-y-2">
                        <label className="text-sm font-medium">Evento</label>
                        <Select
                          value={filters.event || ""}
                          onValueChange={(value) => handleFilterChange('event', value || null)}
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Todos os eventos" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="">Todos os eventos</SelectItem>
                            {Object.entries(eventLabels).map(([value, label]) => (
                              <SelectItem key={value} value={value}>{label}</SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                      
                      <div className="space-y-2">
                        <label className="text-sm font-medium">Status HTTP</label>
                        <Select
                          value={filters.status?.toString() || ""}
                          onValueChange={(value) => handleFilterChange('status', value ? parseInt(value) : null)}
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Todos os status" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="">Todos os status</SelectItem>
                            <SelectItem value="200">200 - OK</SelectItem>
                            <SelectItem value="400">400 - Bad Request</SelectItem>
                            <SelectItem value="404">404 - Not Found</SelectItem>
                            <SelectItem value="500">500 - Server Error</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      
                      <div className="space-y-2">
                        <label className="text-sm font-medium">Data inicial</label>
                        <DatePicker
                          date={filters.startDate}
                          setDate={(date) => handleFilterChange('startDate', date)}
                        />
                      </div>
                      
                      <div className="space-y-2">
                        <label className="text-sm font-medium">Data final</label>
                        <DatePicker
                          date={filters.endDate}
                          setDate={(date) => handleFilterChange('endDate', date)}
                        />
                      </div>
                      
                      <Button 
                        variant="outline" 
                        size="sm" 
                        className="w-full"
                        onClick={handleResetFilters}
                      >
                        Limpar filtros
                      </Button>
                    </div>
                  </PopoverContent>
                </Popover>
                
                <Button variant="outline" size="sm" className="h-10" onClick={handleExportCsv}>
                  <Download className="h-4 w-4 mr-2" />
                  Exportar
                </Button>
              </div>
            </div>

            <div className="space-y-4">
              {isLoading ? (
                <div className="flex justify-center py-8">
                  <div className="flex flex-col items-center">
                    <div className="animate-spin">
                      <RefreshCw className="h-8 w-8 text-muted-foreground" />
                    </div>
                    <p className="mt-2 text-sm text-muted-foreground">Carregando logs...</p>
                  </div>
                </div>
              ) : paginatedLogs.length === 0 ? (
                <p className="text-center text-muted-foreground py-4">
                  Nenhum log encontrado com os filtros aplicados.
                </p>
              ) : (
                <div className="space-y-3">
                  {paginatedLogs.map((log) => (
                    <div key={log.id} className="p-4 border rounded-lg">
                      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 mb-2">
                        <div className="flex items-center space-x-2">
                          <Badge>{eventLabels[log.event]}</Badge>
                          {getStatusBadge(log.status)}
                          {log.retried && (
                            <Badge variant="outline" className="bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200 flex items-center gap-1">
                              <RefreshCw className="w-3 h-3" />
                              Reenvio
                            </Badge>
                          )}
                        </div>
                        <div className="flex items-center text-sm text-muted-foreground">
                          <Clock className="w-3 h-3 mr-1" />
                          <span>{formatDuration(log.duration)}</span>
                        </div>
                      </div>
                      <div className="text-sm text-muted-foreground mb-2">
                        {formatTimestamp(log.timestamp)}
                      </div>
                      <div className="flex justify-end mt-2">
                        <Button 
                          variant="outline" 
                          size="sm" 
                          onClick={() => handleViewDetails(log)}
                        >
                          Ver detalhes
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {/* Pagination controls */}
              {filteredLogs.length > 0 && (
                <div className="flex items-center justify-between py-4">
                  <div className="flex items-center text-sm text-muted-foreground">
                    Mostrando {(filters.page - 1) * filters.perPage + 1} a {Math.min(filters.page * filters.perPage, filteredLogs.length)} de {filteredLogs.length} logs
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    <Select
                      value={filters.perPage.toString()}
                      onValueChange={handleChangePerPage}
                    >
                      <SelectTrigger className="w-[100px]">
                        <SelectValue placeholder="10 por página" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="5">5 por página</SelectItem>
                        <SelectItem value="10">10 por página</SelectItem>
                        <SelectItem value="20">20 por página</SelectItem>
                        <SelectItem value="50">50 por página</SelectItem>
                      </SelectContent>
                    </Select>
                    
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleChangePage(filters.page - 1)}
                      disabled={filters.page === 1}
                    >
                      <ChevronLeft className="h-4 w-4" />
                    </Button>
                    
                    <span className="text-sm">
                      Página {filters.page} de {totalPages}
                    </span>
                    
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleChangePage(filters.page + 1)}
                      disabled={filters.page === totalPages}
                    >
                      <ChevronRight className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              )}
            </div>
          </div>

          <DrawerFooter>
            <Button onClick={onClose}>Fechar</Button>
          </DrawerFooter>
        </DrawerContent>
      </Drawer>

      {/* Log Detail Dialog */}
      {selectedLog && (
        <Dialog open={isDetailOpen} onOpenChange={setIsDetailOpen}>
          <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Detalhes do Evento: {eventLabels[selectedLog.event]}</DialogTitle>
              <DialogDescription>
                Enviado em: {formatTimestamp(selectedLog.timestamp)}
              </DialogDescription>
            </DialogHeader>

            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <h4 className="text-sm font-semibold">URL de destino:</h4>
                  <div className="p-2 bg-muted rounded flex justify-between">
                    <span className="text-sm break-all">{webhook.url}</span>
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      className="h-6 w-6 p-0"
                      onClick={() => handleCopyToClipboard(webhook.url, 'URL')}
                    >
                      <Copy className="h-3 w-3" />
                      <span className="sr-only">Copiar URL</span>
                    </Button>
                  </div>
                </div>
                
                <div className="space-y-2">
                  <h4 className="text-sm font-semibold">Informações da resposta:</h4>
                  <div className="flex items-center space-x-3">
                    <div className="text-sm">{getStatusBadge(selectedLog.status)}</div>
                    <div className="text-sm">Tempo: {formatDuration(selectedLog.duration)}</div>
                  </div>
                </div>
              </div>

              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <h4 className="text-sm font-semibold">Headers enviados:</h4>
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    className="h-6"
                    onClick={() => handleCopyToClipboard(JSON.stringify(selectedLog.headers, null, 2), 'Headers')}
                  >
                    <Copy className="h-3 w-3 mr-1" />
                    Copiar
                  </Button>
                </div>
                <pre className="text-xs bg-muted p-3 rounded overflow-x-auto">
                  {JSON.stringify(selectedLog.headers, null, 2)}
                </pre>
              </div>

              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <h4 className="text-sm font-semibold">Payload enviado:</h4>
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    className="h-6"
                    onClick={() => handleCopyToClipboard(selectedLog.payload, 'Payload')}
                  >
                    <Copy className="h-3 w-3 mr-1" />
                    Copiar
                  </Button>
                </div>
                <pre className="text-xs bg-muted p-3 rounded overflow-x-auto">
                  {JSON.stringify(JSON.parse(selectedLog.payload), null, 2)}
                </pre>
              </div>

              {selectedLog.response && (
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <h4 className="text-sm font-semibold">Resposta recebida:</h4>
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      className="h-6"
                      onClick={() => handleCopyToClipboard(selectedLog.response, 'Resposta')}
                    >
                      <Copy className="h-3 w-3 mr-1" />
                      Copiar
                    </Button>
                  </div>
                  <pre className="text-xs bg-muted p-3 rounded overflow-x-auto">
                    {JSON.stringify(JSON.parse(selectedLog.response), null, 2)}
                  </pre>
                </div>
              )}
            </div>

            <DialogFooter>
              <Button variant="outline" onClick={() => setIsDetailOpen(false)}>Fechar</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      )}
    </>
  );
};
