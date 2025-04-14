
import React, { useState, useEffect } from 'react';
import { 
  Bell, 
  Search, 
  Filter,
  AlertTriangle, 
  CheckCircle2, 
  ExternalLink, 
  FilterX, 
  Clock,
  Calendar,
  Store,
  User,
  RefreshCcw,
  Info,
  ShieldAlert
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { DatePickerWithRange } from '@/components/ui/date-picker';
import { Checkbox } from '@/components/ui/checkbox';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Drawer,
  DrawerContent,
  DrawerDescription,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from '@/components/ui/drawer';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { Badge } from '@/components/ui/badge';
import { toast } from 'sonner';
import { DateRange } from 'react-day-picker';
import { format } from 'date-fns';
import { cn } from '@/lib/utils';
import { Notification, NotificationType } from '@/components/admin/NotificationCenter';

// Mock data for testing - Replace with real data in production
const mockNotifications: Notification[] = [
  {
    id: '1',
    type: 'cobranca',
    title: 'Cobrança falhou',
    description: 'Tentativa de cobrança em R$147 falhou (sem cartão válido)',
    storeName: 'ShopX',
    storeId: '1',
    timestamp: new Date(2025, 3, 14, 9, 12),
    read: false,
    resolved: false,
    actionUrl: '/admin/lojas/1',
    actionLabel: 'Ver loja'
  },
  {
    id: '2',
    type: 'integracao',
    title: 'Integração falhou',
    description: 'Mercado Pago retornou erro 401 ao tentar gerar Pix',
    storeName: 'ModaVip',
    storeId: '2',
    timestamp: new Date(2025, 3, 14, 9, 45),
    read: false,
    resolved: false,
    actionUrl: '/admin/lojas/2/integracoes',
    actionLabel: 'Revalidar integração'
  },
  {
    id: '3',
    type: 'seguranca',
    title: 'Tentativa de acesso bloqueada',
    description: 'Tentou acessar "Financeiro" sem permissão',
    userName: 'admin2@voltz.com (IP 191.x)',
    userId: '3',
    timestamp: new Date(2025, 3, 13, 18, 0),
    read: true,
    resolved: true,
    actionUrl: '/admin/logs',
    actionLabel: 'Ver logs'
  },
  {
    id: '4',
    type: 'configuracao',
    title: 'Erro de propagação DNS',
    description: 'Domínio não está apontando corretamente para os servidores',
    storeName: 'EletroMax',
    storeId: '4',
    timestamp: new Date(2025, 3, 13, 15, 30),
    read: false,
    resolved: false,
    actionUrl: '/admin/lojas/4/dominios',
    actionLabel: 'Verificar domínio'
  },
  {
    id: '5',
    type: 'status',
    title: 'Checkout suspenso',
    description: 'Loja com checkout suspenso por falta de pagamento',
    storeName: 'PetLand',
    storeId: '5',
    timestamp: new Date(2025, 3, 13, 10, 15),
    read: true,
    resolved: false,
    actionUrl: '/admin/lojas/5',
    actionLabel: 'Ver loja'
  },
  {
    id: '6',
    type: 'financeiro',
    title: 'Limite de ciclo atingido',
    description: 'Loja atingiu 90% do limite de ciclo mensal',
    storeName: 'TechGadgets',
    storeId: '6',
    timestamp: new Date(2025, 3, 12, 14, 22),
    read: true,
    resolved: false,
    actionUrl: '/admin/lojas/6/financeiro',
    actionLabel: 'Ver financeiro'
  },
  {
    id: '7',
    type: 'cobranca',
    title: 'Cobrança falhou',
    description: 'Cartão expirado, tentativa de cobrança R$299 falhou',
    storeName: 'CasaMais',
    storeId: '7',
    timestamp: new Date(2025, 3, 12, 8, 30),
    read: false,
    resolved: false,
    actionUrl: '/admin/lojas/7',
    actionLabel: 'Ver loja'
  },
  {
    id: '8',
    type: 'status',
    title: 'Checkout suspenso',
    description: 'Gateway de pagamento desconectado',
    storeName: 'MundoPet',
    storeId: '8',
    timestamp: new Date(2025, 3, 11, 16, 5),
    read: false,
    resolved: false,
    actionUrl: '/admin/lojas/8/gateways',
    actionLabel: 'Verificar gateway'
  },
  {
    id: '9',
    type: 'seguranca',
    title: 'Múltiplas tentativas de login',
    description: '5 tentativas falhas de login para conta admin',
    userName: 'admin@voltz.com (IP 186.x)',
    userId: '1',
    timestamp: new Date(2025, 3, 11, 11, 45),
    read: true,
    resolved: true,
    actionUrl: '/admin/logs/seguranca',
    actionLabel: 'Ver logs'
  },
  {
    id: '10',
    type: 'integracao',
    title: 'API Shopify desconectada',
    description: 'Token de acesso expirou, sincronização interrompida',
    storeName: 'FashionStore',
    storeId: '10',
    timestamp: new Date(2025, 3, 10, 19, 22),
    read: true,
    resolved: true,
    actionUrl: '/admin/lojas/10/integracoes',
    actionLabel: 'Reconectar'
  }
];

// Type for filter state
interface NotificationFilters {
  search: string;
  types: NotificationType[];
  dateRange: DateRange | undefined;
  readStatus: 'all' | 'read' | 'unread';
  resolvedStatus: 'all' | 'resolved' | 'pending';
  stores: string[];
}

// Get alert type label
const getAlertTypeLabel = (type: NotificationType): string => {
  switch (type) {
    case 'cobranca': return 'Alerta de cobrança';
    case 'financeiro': return 'Alerta financeiro';
    case 'configuracao': return 'Alerta de configuração';
    case 'status': return 'Alerta de status operacional';
    case 'integracao': return 'Alerta de integração';
    case 'seguranca': return 'Alerta de segurança';
    default: return 'Alerta';
  }
};

// Get alert type badge color
const getAlertTypeBadgeStyles = (type: NotificationType): string => {
  switch (type) {
    case 'cobranca': return 'bg-red-500/10 text-red-500 border-red-500/20';
    case 'financeiro': return 'bg-yellow-500/10 text-yellow-500 border-yellow-500/20';
    case 'configuracao': return 'bg-orange-500/10 text-orange-500 border-orange-500/20';
    case 'status': return 'bg-red-500/10 text-red-500 border-red-500/20';
    case 'integracao': return 'bg-blue-500/10 text-blue-500 border-blue-500/20';
    case 'seguranca': return 'bg-purple-500/10 text-purple-500 border-purple-500/20';
    default: return 'bg-gray-500/10 text-gray-500 border-gray-500/20';
  }
};

// Get alert type icon
const getAlertTypeIcon = (type: NotificationType) => {
  switch (type) {
    case 'cobranca': return <AlertTriangle className="h-4 w-4 text-red-500" />;
    case 'financeiro': return <AlertTriangle className="h-4 w-4 text-yellow-500" />;
    case 'configuracao': return <AlertTriangle className="h-4 w-4 text-orange-500" />;
    case 'status': return <Info className="h-4 w-4 text-red-500" />;
    case 'integracao': return <RefreshCcw className="h-4 w-4 text-blue-500" />;
    case 'seguranca': return <ShieldAlert className="h-4 w-4 text-purple-500" />;
    default: return <Bell className="h-4 w-4 text-gray-500" />;
  }
};

// Helper function to format the date
const formatDate = (date: Date): string => {
  return format(date, 'dd/MM/yyyy HH:mm');
};

// Component to add notes to a notification
interface AddNoteDrawerProps {
  notificationId: string;
  onAddNote: (id: string, note: string) => void;
}

const AddNoteDrawer: React.FC<AddNoteDrawerProps> = ({ notificationId, onAddNote }) => {
  const [note, setNote] = useState('');
  
  const handleSubmit = () => {
    if (note.trim()) {
      onAddNote(notificationId, note);
      setNote('');
    }
  };
  
  return (
    <Drawer>
      <DrawerTrigger asChild>
        <Button 
          variant="outline" 
          size="sm" 
          className="h-8 text-xs border-white/10 bg-transparent hover:bg-[#262626]"
        >
          Adicionar nota
        </Button>
      </DrawerTrigger>
      <DrawerContent className="bg-[#1E1E1E] border-t border-white/10">
        <div className="max-w-lg mx-auto p-4">
          <DrawerHeader>
            <DrawerTitle className="text-white">Adicionar nota administrativa</DrawerTitle>
            <DrawerDescription className="text-gray-400">
              Essa nota ficará visível apenas para administradores e será registrada no histórico.
            </DrawerDescription>
          </DrawerHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Input
                placeholder="Digite sua nota..."
                value={note}
                onChange={(e) => setNote(e.target.value)}
                className="bg-[#262626] border-white/10 text-white placeholder:text-gray-500"
              />
            </div>
            <div className="flex justify-end gap-3">
              <Button 
                variant="outline" 
                onClick={() => setNote('')}
                className="border-white/10 text-gray-400 hover:bg-[#262626]"
              >
                Cancelar
              </Button>
              <Button 
                onClick={handleSubmit}
                className="bg-green-600 hover:bg-green-700 text-white"
                disabled={!note.trim()}
              >
                Salvar nota
              </Button>
            </div>
          </div>
        </div>
      </DrawerContent>
    </Drawer>
  );
};

const AdminNotificacoes: React.FC = () => {
  const [notifications, setNotifications] = useState<Notification[]>(mockNotifications);
  const [loading, setLoading] = useState(false);
  const [showFilters, setShowFilters] = useState(false);
  
  const [filters, setFilters] = useState<NotificationFilters>({
    search: '',
    types: [],
    dateRange: undefined,
    readStatus: 'all',
    resolvedStatus: 'all',
    stores: []
  });
  
  // Get unique stores from notifications
  const uniqueStores = Array.from(
    new Set(
      notifications
        .filter(n => n.storeName)
        .map(n => ({ id: n.storeId!, name: n.storeName! }))
    )
  ).reduce((acc, current) => {
    if (!acc.some(item => item.id === current.id)) {
      acc.push(current);
    }
    return acc;
  }, [] as { id: string; name: string }[]);
  
  // Filter notifications based on filters
  const filteredNotifications = notifications.filter(notification => {
    // Search filter
    if (filters.search && !notification.title.toLowerCase().includes(filters.search.toLowerCase()) && 
        !notification.description.toLowerCase().includes(filters.search.toLowerCase())) {
      return false;
    }
    
    // Type filter
    if (filters.types.length > 0 && !filters.types.includes(notification.type)) {
      return false;
    }
    
    // Date range filter
    if (filters.dateRange && filters.dateRange.from) {
      const notificationDate = new Date(notification.timestamp);
      const fromDate = new Date(filters.dateRange.from);
      fromDate.setHours(0, 0, 0, 0);
      
      if (notificationDate < fromDate) {
        return false;
      }
      
      if (filters.dateRange.to) {
        const toDate = new Date(filters.dateRange.to);
        toDate.setHours(23, 59, 59, 999);
        
        if (notificationDate > toDate) {
          return false;
        }
      }
    }
    
    // Read status filter
    if (filters.readStatus === 'read' && !notification.read) {
      return false;
    }
    if (filters.readStatus === 'unread' && notification.read) {
      return false;
    }
    
    // Resolved status filter
    if (filters.resolvedStatus === 'resolved' && !notification.resolved) {
      return false;
    }
    if (filters.resolvedStatus === 'pending' && notification.resolved) {
      return false;
    }
    
    // Store filter
    if (filters.stores.length > 0 && notification.storeId && !filters.stores.includes(notification.storeId)) {
      return false;
    }
    
    return true;
  });
  
  // Mark notification as read
  const handleMarkAsRead = (id: string) => {
    setNotifications(prev => 
      prev.map(notification => 
        notification.id === id 
          ? { ...notification, read: true } 
          : notification
      )
    );
    
    toast.success('Notificação marcada como lida');
  };
  
  // Mark notification as resolved
  const handleMarkAsResolved = (id: string) => {
    setNotifications(prev => 
      prev.map(notification => 
        notification.id === id 
          ? { ...notification, resolved: true } 
          : notification
      )
    );
    
    toast.success('Alerta marcado como resolvido');
  };
  
  // Mark all as read
  const handleMarkAllAsRead = () => {
    setNotifications(prev => 
      prev.map(notification => ({ ...notification, read: true }))
    );
    
    toast.success('Todas as notificações marcadas como lidas');
  };
  
  // Add note to notification
  const handleAddNote = (id: string, note: string) => {
    // In a real app, you would send this to your API
    console.log(`Note added to notification ${id}: ${note}`);
    
    toast.success('Nota adicionada com sucesso');
  };
  
  // Reset filters
  const handleResetFilters = () => {
    setFilters({
      search: '',
      types: [],
      dateRange: undefined,
      readStatus: 'all',
      resolvedStatus: 'all',
      stores: []
    });
  };
  
  // Toggle type filter
  const toggleTypeFilter = (type: NotificationType) => {
    setFilters(prev => {
      if (prev.types.includes(type)) {
        return { ...prev, types: prev.types.filter(t => t !== type) };
      } else {
        return { ...prev, types: [...prev.types, type] };
      }
    });
  };
  
  // Toggle store filter
  const toggleStoreFilter = (storeId: string) => {
    setFilters(prev => {
      if (prev.stores.includes(storeId)) {
        return { ...prev, stores: prev.stores.filter(s => s !== storeId) };
      } else {
        return { ...prev, stores: [...prev.stores, storeId] };
      }
    });
  };
  
  return (
    <div className="space-y-6 p-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-white flex items-center gap-2">
            <Bell className="h-6 w-6 text-white" />
            Notificações & Alertas
          </h1>
          <p className="text-gray-400 mt-1">Monitore eventos críticos do sistema e responda rapidamente</p>
        </div>
        
        <div className="flex gap-2">
          <Button 
            variant="outline" 
            size="sm"
            className={cn(
              "border-white/10 text-gray-300",
              showFilters ? "bg-[#262626]" : "hover:bg-[#262626]"
            )}
            onClick={() => setShowFilters(!showFilters)}
          >
            <Filter className="h-4 w-4 mr-2" />
            {showFilters ? 'Ocultar filtros' : 'Mostrar filtros'}
          </Button>
          
          {filteredNotifications.some(n => !n.read) && (
            <Button 
              variant="outline" 
              size="sm"
              className="border-white/10 text-gray-300 hover:bg-[#262626]"
              onClick={handleMarkAllAsRead}
            >
              <CheckCircle2 className="h-4 w-4 mr-2" />
              Marcar tudo como lido
            </Button>
          )}
        </div>
      </div>
      
      {showFilters && (
        <div className="bg-[#1E1E1E] border border-white/10 rounded-lg p-4 space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-medium text-white">Filtros</h2>
            <Button 
              variant="ghost" 
              size="sm"
              className="text-gray-400 hover:text-white"
              onClick={handleResetFilters}
            >
              <FilterX className="h-4 w-4 mr-2" />
              Limpar filtros
            </Button>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-400 mb-1">Buscar</label>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500 h-4 w-4" />
                <Input 
                  placeholder="Buscar notificações..."
                  value={filters.search}
                  onChange={(e) => setFilters(prev => ({ ...prev, search: e.target.value }))}
                  className="pl-9 bg-[#262626] border-white/10 text-white placeholder:text-gray-500"
                />
              </div>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-400 mb-1">Período</label>
              <DatePickerWithRange
                selected={filters.dateRange}
                onSelect={(range) => setFilters(prev => ({ ...prev, dateRange: range }))}
              />
            </div>
            
            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-400 mb-1">Status de leitura</label>
              <Select 
                value={filters.readStatus}
                onValueChange={(value) => setFilters(prev => ({ ...prev, readStatus: value as any }))}
              >
                <SelectTrigger className="bg-[#262626] border-white/10 text-white">
                  <SelectValue placeholder="Selecionar status" />
                </SelectTrigger>
                <SelectContent className="bg-[#262626] border-white/10">
                  <SelectItem value="all">Todos</SelectItem>
                  <SelectItem value="read">Lidos</SelectItem>
                  <SelectItem value="unread">Não lidos</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-400 mb-1">Status de resolução</label>
              <Select 
                value={filters.resolvedStatus}
                onValueChange={(value) => setFilters(prev => ({ ...prev, resolvedStatus: value as any }))}
              >
                <SelectTrigger className="bg-[#262626] border-white/10 text-white">
                  <SelectValue placeholder="Selecionar status" />
                </SelectTrigger>
                <SelectContent className="bg-[#262626] border-white/10">
                  <SelectItem value="all">Todos</SelectItem>
                  <SelectItem value="resolved">Resolvidos</SelectItem>
                  <SelectItem value="pending">Pendentes</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-400 mb-1">Tipos de alerta</label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button 
                    variant="outline" 
                    className="w-full justify-between bg-[#262626] border-white/10 text-white"
                  >
                    <span>
                      {filters.types.length > 0 
                        ? `${filters.types.length} tipo(s) selecionado(s)` 
                        : 'Selecionar tipos'}
                    </span>
                    <Filter className="h-4 w-4 ml-2" />
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="bg-[#262626] border-white/10 w-64">
                  <div className="space-y-2">
                    <div className="flex items-center space-x-2">
                      <Checkbox 
                        id="filter-cobranca"
                        checked={filters.types.includes('cobranca')}
                        onCheckedChange={() => toggleTypeFilter('cobranca')}
                      />
                      <label 
                        htmlFor="filter-cobranca" 
                        className="text-sm text-white cursor-pointer flex items-center"
                      >
                        <AlertTriangle className="h-3.5 w-3.5 mr-1.5 text-red-500" />
                        Alerta de cobrança
                      </label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Checkbox 
                        id="filter-financeiro"
                        checked={filters.types.includes('financeiro')}
                        onCheckedChange={() => toggleTypeFilter('financeiro')}
                      />
                      <label 
                        htmlFor="filter-financeiro" 
                        className="text-sm text-white cursor-pointer flex items-center"
                      >
                        <AlertTriangle className="h-3.5 w-3.5 mr-1.5 text-yellow-500" />
                        Alerta financeiro
                      </label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Checkbox 
                        id="filter-configuracao"
                        checked={filters.types.includes('configuracao')}
                        onCheckedChange={() => toggleTypeFilter('configuracao')}
                      />
                      <label 
                        htmlFor="filter-configuracao" 
                        className="text-sm text-white cursor-pointer flex items-center"
                      >
                        <AlertTriangle className="h-3.5 w-3.5 mr-1.5 text-orange-500" />
                        Alerta de configuração
                      </label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Checkbox 
                        id="filter-status"
                        checked={filters.types.includes('status')}
                        onCheckedChange={() => toggleTypeFilter('status')}
                      />
                      <label 
                        htmlFor="filter-status" 
                        className="text-sm text-white cursor-pointer flex items-center"
                      >
                        <Info className="h-3.5 w-3.5 mr-1.5 text-red-500" />
                        Alerta de status operacional
                      </label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Checkbox 
                        id="filter-integracao"
                        checked={filters.types.includes('integracao')}
                        onCheckedChange={() => toggleTypeFilter('integracao')}
                      />
                      <label 
                        htmlFor="filter-integracao" 
                        className="text-sm text-white cursor-pointer flex items-center"
                      >
                        <RefreshCcw className="h-3.5 w-3.5 mr-1.5 text-blue-500" />
                        Alerta de integração
                      </label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Checkbox 
                        id="filter-seguranca"
                        checked={filters.types.includes('seguranca')}
                        onCheckedChange={() => toggleTypeFilter('seguranca')}
                      />
                      <label 
                        htmlFor="filter-seguranca" 
                        className="text-sm text-white cursor-pointer flex items-center"
                      >
                        <ShieldAlert className="h-3.5 w-3.5 mr-1.5 text-purple-500" />
                        Alerta de segurança
                      </label>
                    </div>
                  </div>
                </PopoverContent>
              </Popover>
            </div>
            
            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-400 mb-1">Lojas</label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button 
                    variant="outline" 
                    className="w-full justify-between bg-[#262626] border-white/10 text-white"
                  >
                    <span>
                      {filters.stores.length > 0 
                        ? `${filters.stores.length} loja(s) selecionada(s)` 
                        : 'Selecionar lojas'}
                    </span>
                    <Store className="h-4 w-4 ml-2" />
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="bg-[#262626] border-white/10 w-64 max-h-60 overflow-auto">
                  <div className="space-y-2">
                    {uniqueStores.map(store => (
                      <div key={store.id} className="flex items-center space-x-2">
                        <Checkbox 
                          id={`filter-store-${store.id}`}
                          checked={filters.stores.includes(store.id)}
                          onCheckedChange={() => toggleStoreFilter(store.id)}
                        />
                        <label 
                          htmlFor={`filter-store-${store.id}`} 
                          className="text-sm text-white cursor-pointer flex items-center"
                        >
                          <Store className="h-3.5 w-3.5 mr-1.5 text-gray-400" />
                          {store.name}
                        </label>
                      </div>
                    ))}
                  </div>
                </PopoverContent>
              </Popover>
            </div>
          </div>
        </div>
      )}
      
      <div className="bg-[#1E1E1E] border border-white/10 rounded-lg overflow-hidden">
        {loading ? (
          <div className="flex items-center justify-center p-8">
            <div className="animate-spin h-8 w-8 border-t-2 border-[#10B981] rounded-full" />
          </div>
        ) : filteredNotifications.length === 0 ? (
          <div className="text-center py-12 px-4">
            <Bell className="h-16 w-16 mx-auto mb-4 text-gray-500 opacity-30" />
            <h3 className="text-lg font-medium text-white mb-2">Nenhuma notificação encontrada</h3>
            <p className="text-gray-400 max-w-md mx-auto">
              Não encontramos notificações que correspondam aos seus filtros. Tente ajustar os critérios de busca.
            </p>
            {Object.values(filters).some(v => 
              (Array.isArray(v) && v.length > 0) || 
              (typeof v === 'string' && v !== '' && v !== 'all')
            ) && (
              <Button 
                variant="outline" 
                className="mt-4 border-white/10 text-gray-300 hover:bg-[#262626]"
                onClick={handleResetFilters}
              >
                <FilterX className="h-4 w-4 mr-2" />
                Limpar filtros
              </Button>
            )}
          </div>
        ) : (
          <div className="overflow-x-auto">
            <Table>
              <TableHeader sticky>
                <TableRow className="bg-[#262626] hover:bg-[#262626]">
                  <TableHead className="w-[180px]">Data/Hora</TableHead>
                  <TableHead className="w-[180px]">Tipo de Alerta</TableHead>
                  <TableHead className="w-[150px]">Loja/Usuário</TableHead>
                  <TableHead>Descrição do Evento</TableHead>
                  <TableHead className="text-right w-[280px]">Ações</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredNotifications.map((notification) => (
                  <TableRow 
                    key={notification.id}
                    className={cn(
                      !notification.read ? "bg-[#262626] hover:bg-[#2A2A2A]" : "",
                      notification.resolved ? "opacity-70" : ""
                    )}
                  >
                    <TableCell className="whitespace-nowrap">
                      <div className="flex items-center">
                        <Clock className="h-3.5 w-3.5 mr-2 text-gray-500" />
                        {formatDate(notification.timestamp)}
                      </div>
                      <div className="text-xs text-gray-500 mt-1">
                        {notification.read ? "Lido" : "Não lido"}
                        {" • "}
                        {notification.resolved ? "Resolvido" : "Pendente"}
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge 
                        variant="outline" 
                        className={cn(
                          "font-medium flex items-center whitespace-nowrap", 
                          getAlertTypeBadgeStyles(notification.type)
                        )}
                      >
                        {getAlertTypeIcon(notification.type)}
                        <span className="ml-1.5">{getAlertTypeLabel(notification.type)}</span>
                      </Badge>
                    </TableCell>
                    <TableCell>
                      {notification.storeName ? (
                        <div className="flex items-center text-sm">
                          <Store className="h-3.5 w-3.5 mr-1.5 text-gray-400" />
                          <Link to={`/admin/lojas/${notification.storeId}`} className="text-blue-400 hover:underline">
                            {notification.storeName}
                          </Link>
                        </div>
                      ) : notification.userName ? (
                        <div className="flex items-center text-sm">
                          <User className="h-3.5 w-3.5 mr-1.5 text-gray-400" />
                          <span>{notification.userName}</span>
                        </div>
                      ) : null}
                    </TableCell>
                    <TableCell>
                      <div className="font-medium text-white">{notification.title}</div>
                      <div className="text-sm text-gray-400 mt-1">{notification.description}</div>
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-2">
                        {notification.actionLabel && notification.actionUrl && (
                          <Button
                            variant="outline"
                            size="sm"
                            asChild
                            className="h-8 text-xs border-white/10 bg-transparent hover:bg-[#262626]"
                          >
                            <Link to={notification.actionUrl}>
                              <ExternalLink className="h-3.5 w-3.5 mr-1" />
                              {notification.actionLabel}
                            </Link>
                          </Button>
                        )}
                        
                        <AddNoteDrawer 
                          notificationId={notification.id} 
                          onAddNote={handleAddNote} 
                        />
                        
                        {!notification.read && (
                          <Button
                            variant="outline"
                            size="sm"
                            className="h-8 text-xs border-white/10 bg-transparent hover:bg-[#262626]"
                            onClick={() => handleMarkAsRead(notification.id)}
                          >
                            <CheckCircle2 className="h-3.5 w-3.5 mr-1" />
                            Marcar lido
                          </Button>
                        )}
                        
                        {!notification.resolved && (
                          <Button
                            variant="outline"
                            size="sm"
                            className="h-8 text-xs border-white/10 bg-transparent hover:bg-[#262626]"
                            onClick={() => handleMarkAsResolved(notification.id)}
                          >
                            <CheckCircle2 className="h-3.5 w-3.5 mr-1" />
                            Resolver
                          </Button>
                        )}
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminNotificacoes;
