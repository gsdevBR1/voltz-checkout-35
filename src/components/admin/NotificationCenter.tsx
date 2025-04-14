
import React, { useState } from 'react';
import { 
  Bell, 
  Clock, 
  CheckCircle2, 
  AlertTriangle, 
  ShieldAlert, 
  RefreshCcw, 
  ExternalLink,
  Info
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuGroup, 
  DropdownMenuItem, 
  DropdownMenuLabel, 
  DropdownMenuSeparator, 
  DropdownMenuTrigger 
} from '@/components/ui/dropdown-menu';
import { cn } from '@/lib/utils';

// Types for notifications
export type NotificationType = 
  | 'cobranca' 
  | 'financeiro' 
  | 'configuracao' 
  | 'status' 
  | 'integracao' 
  | 'seguranca';

export interface Notification {
  id: string;
  type: NotificationType;
  title: string;
  description: string;
  storeName?: string;
  storeId?: string;
  userId?: string;
  userName?: string;
  timestamp: Date;
  read: boolean;
  resolved: boolean;
  actionUrl?: string;
  actionLabel?: string;
}

interface NotificationCenterProps {
  notifications?: Notification[];
  loading?: boolean;
  onViewAll?: () => void;
  onMarkAsRead?: (id: string) => void;
  onMarkAllAsRead?: () => void;
}

// Helper function to format the timestamp
const formatTimestamp = (date: Date): string => {
  const now = new Date();
  const diffInMinutes = Math.floor((now.getTime() - date.getTime()) / (1000 * 60));
  
  if (diffInMinutes < 1) {
    return 'agora mesmo';
  } else if (diffInMinutes < 60) {
    return `${diffInMinutes} ${diffInMinutes === 1 ? 'minuto' : 'minutos'} atrás`;
  } else if (diffInMinutes < 1440) {
    const hours = Math.floor(diffInMinutes / 60);
    return `${hours} ${hours === 1 ? 'hora' : 'horas'} atrás`;
  } else {
    const days = Math.floor(diffInMinutes / 1440);
    if (days < 2) {
      return 'ontem';
    }
    return `${days} dias atrás`;
  }
};

// Helper function to get icon by notification type
const getNotificationIcon = (type: NotificationType) => {
  switch (type) {
    case 'cobranca':
      return <AlertTriangle className="h-4 w-4 text-red-500" />;
    case 'financeiro':
      return <AlertTriangle className="h-4 w-4 text-yellow-500" />;
    case 'configuracao':
      return <AlertTriangle className="h-4 w-4 text-orange-500" />;
    case 'status':
      return <Info className="h-4 w-4 text-red-500" />;
    case 'integracao':
      return <RefreshCcw className="h-4 w-4 text-yellow-500" />;
    case 'seguranca':
      return <ShieldAlert className="h-4 w-4 text-purple-500" />;
    default:
      return <Bell className="h-4 w-4 text-gray-500" />;
  }
};

// Helper function to get notification item bg color
const getNotificationBg = (read: boolean, type: NotificationType) => {
  if (!read) {
    return 'bg-[#262626] hover:bg-[#2A2A2A]';
  }
  return 'bg-[#1E1E1E] hover:bg-[#262626]';
};

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
  }
];

export const NotificationCenter: React.FC<NotificationCenterProps> = ({
  notifications = mockNotifications,
  loading = false,
  onViewAll,
  onMarkAsRead,
  onMarkAllAsRead
}) => {
  const [open, setOpen] = useState(false);
  
  const unreadCount = notifications.filter(n => !n.read).length;
  
  const handleMarkAsRead = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (onMarkAsRead) {
      onMarkAsRead(id);
    }
  };
  
  const handleViewAll = () => {
    setOpen(false);
    if (onViewAll) {
      onViewAll();
    }
  };
  
  return (
    <DropdownMenu open={open} onOpenChange={setOpen}>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon" className="relative text-gray-400 hover:text-white">
          <Bell className="h-5 w-5" />
          {unreadCount > 0 && (
            <span className="absolute -top-1 -right-1 flex h-5 w-5 items-center justify-center rounded-full bg-red-500 text-[10px] font-medium text-white">
              {unreadCount > 9 ? '9+' : unreadCount}
            </span>
          )}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent 
        align="end" 
        className="w-80 bg-[#1E1E1E] border-white/10 p-0 max-h-[70vh] overflow-hidden flex flex-col"
      >
        <div className="py-2 px-3 flex items-center justify-between border-b border-white/10">
          <DropdownMenuLabel className="text-gray-300 py-1">Notificações</DropdownMenuLabel>
          {unreadCount > 0 && (
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={onMarkAllAsRead} 
              className="text-xs text-gray-400 hover:text-white h-7"
            >
              Marcar todas como lidas
            </Button>
          )}
        </div>
        
        <div className="overflow-y-auto py-1 max-h-[50vh]">
          {loading ? (
            <div className="flex items-center justify-center p-4">
              <div className="animate-spin h-6 w-6 border-t-2 border-[#10B981] rounded-full" />
            </div>
          ) : notifications.length === 0 ? (
            <div className="text-center py-6 px-4 text-gray-400">
              <Bell className="h-10 w-10 mx-auto mb-3 text-gray-500 opacity-50" />
              <p>Nenhuma notificação disponível</p>
            </div>
          ) : (
            <DropdownMenuGroup>
              {notifications.slice(0, 5).map((notification) => (
                <DropdownMenuItem
                  key={notification.id}
                  className={cn(
                    "px-3 py-2 cursor-pointer flex flex-col transition-colors",
                    getNotificationBg(notification.read, notification.type)
                  )}
                  onClick={() => notification.actionUrl && (window.location.href = notification.actionUrl)}
                >
                  <div className="flex items-start gap-2 w-full">
                    <div className="mt-0.5">
                      {getNotificationIcon(notification.type)}
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center justify-between">
                        <span className={cn(
                          "text-sm font-medium",
                          notification.read ? "text-gray-300" : "text-white"
                        )}>
                          {notification.title}
                        </span>
                        <span className="text-xs text-gray-500 flex items-center">
                          <Clock className="h-3 w-3 mr-1" />
                          {formatTimestamp(notification.timestamp)}
                        </span>
                      </div>
                      <p className="text-xs text-gray-400 mt-1">
                        {notification.description}
                      </p>
                      {(notification.storeName || notification.userName) && (
                        <p className="text-xs text-gray-500 mt-0.5">
                          {notification.storeName && `Loja: ${notification.storeName}`}
                          {notification.userName && `Usuário: ${notification.userName}`}
                        </p>
                      )}
                      <div className="flex items-center justify-between mt-2">
                        {notification.actionLabel && notification.actionUrl && (
                          <Button
                            variant="ghost"
                            size="sm"
                            className="h-6 text-xs text-[#10B981] hover:text-[#0D9668] flex items-center px-2"
                            onClick={(e) => {
                              e.stopPropagation();
                              window.location.href = notification.actionUrl!;
                            }}
                          >
                            <ExternalLink className="h-3 w-3 mr-1" />
                            {notification.actionLabel}
                          </Button>
                        )}
                        {!notification.read && (
                          <Button
                            variant="ghost"
                            size="sm"
                            className="h-6 text-xs text-gray-400 hover:text-white flex items-center px-2"
                            onClick={(e) => handleMarkAsRead(notification.id, e)}
                          >
                            <CheckCircle2 className="h-3 w-3 mr-1" />
                            Marcar como lido
                          </Button>
                        )}
                      </div>
                    </div>
                  </div>
                </DropdownMenuItem>
              ))}
            </DropdownMenuGroup>
          )}
        </div>
        
        <DropdownMenuSeparator className="bg-white/10 m-0" />
        <div className="p-2">
          <Button 
            variant="outline" 
            size="sm" 
            className="w-full border-white/10 text-gray-300 hover:bg-[#262626]"
            onClick={handleViewAll}
            asChild
          >
            <Link to="/admin/notificacoes">Ver todas as notificações</Link>
          </Button>
        </div>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};
