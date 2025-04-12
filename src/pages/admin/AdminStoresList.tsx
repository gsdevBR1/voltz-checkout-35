
import React, { useState } from 'react';
import { 
  Eye, 
  Lock, 
  Unlock, 
  MoreHorizontal, 
  Repeat, 
  CreditCard, 
  Search,
  CheckCircle,
  AlertCircle,
  ClockIcon,
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { cn } from '@/lib/utils';
import { toast } from '@/hooks/use-toast';

// Mock store data
const mockStores = Array.from({ length: 10 }).map((_, i) => ({
  id: `store-${i+1}`,
  name: `Loja ${i+1}`,
  owner: `user${i+1}@example.com`,
  domain: `loja${i+1}.voltzcheckout.com`,
  status: i % 3 === 0 ? 'suspended' : i % 4 === 0 ? 'warning' : 'active',
  cycle: {
    value: Math.floor(Math.random() * 100),
    limit: 100,
    next: new Date(Date.now() + Math.floor(Math.random() * 10 * 24 * 60 * 60 * 1000))
  },
  created: new Date(Date.now() - Math.floor(Math.random() * 100 * 24 * 60 * 60 * 1000)),
}));

const AdminStoresList: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');

  const filteredStores = mockStores.filter(store => 
    store.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    store.owner.toLowerCase().includes(searchTerm.toLowerCase()) ||
    store.domain.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleForceCharge = (storeId: string) => {
    toast({
      title: "Cobrança forçada",
      description: `A cobrança para a loja ${storeId} foi iniciada.`,
    });
  };

  const handleToggleLock = (storeId: string, currentStatus: string) => {
    const newStatus = currentStatus === 'suspended' ? 'active' : 'suspended';
    toast({
      title: newStatus === 'suspended' ? "Loja bloqueada" : "Loja desbloqueada",
      description: `A loja ${storeId} foi ${newStatus === 'suspended' ? 'bloqueada' : 'desbloqueada'}.`,
    });
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-white">Lojas</h1>
        <div className="flex items-center gap-4">
          <div className="relative">
            <Search className="h-4 w-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <Input
              placeholder="Buscar lojas..."
              className="pl-10 w-64 bg-[#1E1E1E] border-white/5 focus:border-[#10B981]"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <Button size="sm">Exportar Lista</Button>
        </div>
      </div>
      
      <Card className="bg-[#1E1E1E] border-white/5 shadow-md">
        <CardHeader className="pb-2">
          <CardTitle className="text-white">Todas as Lojas</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader className="bg-[#262626]">
              <TableRow>
                <TableHead className="text-gray-300">Status</TableHead>
                <TableHead className="text-gray-300">Nome</TableHead>
                <TableHead className="text-gray-300">Proprietário</TableHead>
                <TableHead className="text-gray-300">Domínio</TableHead>
                <TableHead className="text-gray-300">Ciclo</TableHead>
                <TableHead className="text-gray-300">Criado em</TableHead>
                <TableHead className="text-gray-300 text-right">Ações</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredStores.map((store) => (
                <TableRow key={store.id} className="hover:bg-[#2A2A2A] border-t border-white/5">
                  <TableCell>
                    <StatusBadge status={store.status} />
                  </TableCell>
                  <TableCell className="font-medium text-white">{store.name}</TableCell>
                  <TableCell className="text-gray-300">{store.owner}</TableCell>
                  <TableCell className="text-gray-300">{store.domain}</TableCell>
                  <TableCell>
                    <div className="flex flex-col gap-1">
                      <div className="flex items-center justify-between text-xs text-gray-400">
                        <span>Uso: {store.cycle.value}%</span>
                        <span>R$ {store.cycle.value},00</span>
                      </div>
                      <div className="w-full bg-[#262626] rounded-full h-1.5">
                        <div 
                          className={cn(
                            "h-1.5 rounded-full",
                            store.cycle.value > 80 ? "bg-red-500" : "bg-[#10B981]"
                          )}
                          style={{ width: `${store.cycle.value}%` }}
                        ></div>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell className="text-gray-300 text-sm">
                    {store.created.toLocaleDateString()}
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-2">
                      <Button 
                        variant="ghost" 
                        size="icon" 
                        className="h-8 w-8 text-gray-400 hover:text-white hover:bg-[#262626]"
                      >
                        <Eye className="h-4 w-4" />
                      </Button>
                      
                      <Button 
                        variant="ghost" 
                        size="icon"
                        className="h-8 w-8 text-gray-400 hover:text-white hover:bg-[#262626]"
                        onClick={() => handleToggleLock(store.id, store.status)}
                      >
                        {store.status === 'suspended' ? (
                          <Unlock className="h-4 w-4" />
                        ) : (
                          <Lock className="h-4 w-4" />
                        )}
                      </Button>
                      
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button 
                            variant="ghost" 
                            size="icon"
                            className="h-8 w-8 text-gray-400 hover:text-white hover:bg-[#262626]"
                          >
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end" className="bg-[#262626] border-white/5">
                          <DropdownMenuItem 
                            className="cursor-pointer hover:bg-[#2A2A2A] text-gray-300 hover:text-white"
                            onClick={() => handleForceCharge(store.id)}
                          >
                            <CreditCard className="h-4 w-4 mr-2" />
                            Forçar Cobrança
                          </DropdownMenuItem>
                          <DropdownMenuItem className="cursor-pointer hover:bg-[#2A2A2A] text-gray-300 hover:text-white">
                            <Repeat className="h-4 w-4 mr-2" />
                            Editar Ciclo
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
};

type StatusBadgeProps = {
  status: string;
};

const StatusBadge: React.FC<StatusBadgeProps> = ({ status }) => {
  return (
    <div className={cn(
      "flex items-center gap-1.5 text-xs font-medium px-2 py-1 rounded-full w-fit",
      status === 'active' && "bg-emerald-500/10 text-emerald-500",
      status === 'warning' && "bg-yellow-500/10 text-yellow-500",
      status === 'suspended' && "bg-red-500/10 text-red-500"
    )}>
      {status === 'active' && <CheckCircle className="h-3 w-3" />}
      {status === 'warning' && <ClockIcon className="h-3 w-3" />}
      {status === 'suspended' && <AlertCircle className="h-3 w-3" />}
      <span>
        {status === 'active' && "Ativa"}
        {status === 'warning' && "Atenção"}
        {status === 'suspended' && "Suspensa"}
      </span>
    </div>
  );
};

export default AdminStoresList;
