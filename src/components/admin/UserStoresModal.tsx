
import React from 'react';
import { 
  Dialog, 
  DialogContent, 
  DialogDescription, 
  DialogHeader, 
  DialogTitle 
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Store, ExternalLink, AlertCircle, Info, Clock, Shield } from 'lucide-react';
import { 
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import { toast } from 'sonner';

interface UserStore {
  id: string;
  name: string;
  status: 'active' | 'suspended' | 'trial';
  createdAt: Date;
  domain: string;
}

interface UserStoresModalProps {
  isOpen: boolean;
  onClose: () => void;
  userName: string;
  userId: string;
  userEmail: string;
  stores: UserStore[];
}

export const UserStoresModal: React.FC<UserStoresModalProps> = ({
  isOpen,
  onClose,
  userName,
  userId,
  userEmail,
  stores
}) => {
  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
    }).format(date);
  };

  const accessStoreAsUser = (store: UserStore) => {
    // In a real app, this would call an API to create a special session
    console.log(`Accessing store ${store.id} as user ${userId}`);
    
    // Creating an audit log entry
    const auditData = {
      adminEmail: localStorage.getItem('admin_email') || 'admin@example.com',
      action: 'accessed_store_as_user',
      userId: userId,
      userEmail: userEmail,
      storeId: store.id,
      storeName: store.name,
      timestamp: new Date()
    };
    
    // In a real app, this would be sent to the server
    console.log('Audit log:', auditData);
    
    // Show success message
    toast.success(
      <div className="flex flex-col">
        <span className="font-medium">Acesso concedido</span>
        <span className="text-sm text-gray-400 mt-1">
          Você está acessando a loja como {userName}
        </span>
      </div>
    );
    
    // In a real app, this would redirect to the store dashboard with a special session token
    window.open(`/dashboard?store=${store.id}&impersonate=${userId}`, '_blank');
  };

  const viewStoreDetails = (store: UserStore) => {
    window.open(`/admin/lojas/${store.id}`, '_blank');
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'active':
        return (
          <Badge variant="success" className="gap-1">
            <span className="h-2 w-2 rounded-full bg-green-500"></span>
            Ativa
          </Badge>
        );
      case 'suspended':
        return (
          <Badge variant="warning" className="gap-1">
            <AlertCircle className="h-3 w-3" />
            Suspensa
          </Badge>
        );
      case 'trial':
        return (
          <Badge variant="secondary" className="gap-1 bg-blue-500/10 text-blue-500 hover:bg-blue-500/20">
            <Clock className="h-3 w-3" />
            Trial
          </Badge>
        );
      default:
        return (
          <Badge variant="outline">
            Desconhecido
          </Badge>
        );
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="bg-[#1E1E1E] border-white/5 text-white max-w-4xl">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Store className="h-5 w-5 text-[#10B981]" />
            Lojas do Usuário
          </DialogTitle>
          <DialogDescription className="text-gray-400">
            Lista de lojas vinculadas a <span className="text-white">{userName}</span> ({userEmail})
          </DialogDescription>
        </DialogHeader>

        {stores.length > 0 ? (
          <div className="mt-4">
            <div className="bg-[#262626] p-3 rounded-md mb-4 flex items-center gap-2 text-sm text-amber-400">
              <Shield className="h-4 w-4" />
              <p>Acessos às lojas são registrados no log de auditoria e são identificados como administrador.</p>
            </div>
            
            <Table>
              <TableHeader className="bg-[#262626]">
                <TableRow>
                  <TableHead className="text-gray-300">Nome da Loja</TableHead>
                  <TableHead className="text-gray-300">Status</TableHead>
                  <TableHead className="text-gray-300">Data de Criação</TableHead>
                  <TableHead className="text-gray-300">Domínio</TableHead>
                  <TableHead className="text-gray-300 text-right">Ações</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {stores.map((store) => (
                  <TableRow key={store.id} className="hover:bg-[#2A2A2A] border-t border-white/5">
                    <TableCell className="font-medium text-white">
                      {store.name}
                    </TableCell>
                    <TableCell>
                      {getStatusBadge(store.status)}
                    </TableCell>
                    <TableCell className="text-gray-300">
                      {formatDate(store.createdAt)}
                    </TableCell>
                    <TableCell className="text-gray-300">
                      {store.domain}
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-2">
                        <Button 
                          variant="outline" 
                          size="sm" 
                          className="h-8 bg-[#262626] hover:bg-[#333] border-white/10 text-gray-300 hover:text-white"
                          onClick={() => viewStoreDetails(store)}
                        >
                          <Info className="h-4 w-4 mr-2" />
                          Ver Detalhes
                        </Button>
                        <Button 
                          variant="outline" 
                          size="sm" 
                          className="h-8 bg-[#262626] hover:bg-[#333] border-white/10 text-emerald-500 hover:text-emerald-400"
                          onClick={() => accessStoreAsUser(store)}
                        >
                          <ExternalLink className="h-4 w-4 mr-2" />
                          Acessar Loja
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        ) : (
          <div className="text-center py-8">
            <Store className="h-12 w-12 text-gray-500 mx-auto mb-3" />
            <h3 className="text-lg font-medium text-white mb-1">Nenhuma loja encontrada</h3>
            <p className="text-gray-400">Este usuário não possui lojas vinculadas.</p>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
};
