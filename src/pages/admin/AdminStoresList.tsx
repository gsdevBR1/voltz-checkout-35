import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
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
  Download,
  Calendar,
  Filter as FilterIcon,
  DollarSign,
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import { toast } from '@/hooks/use-toast';

const mockStores = Array.from({ length: 20 }).map((_, i) => ({
  id: `store-${i+1}`,
  name: `Loja ${i+1}`,
  owner: {
    name: `Usuário ${i+1}`,
    email: `user${i+1}@example.com`
  },
  billing: {
    current: Math.floor(Math.random() * 5000),
    fees: Math.floor(Math.random() * 200),
    limit: (i % 3 === 0) ? 100 : (i % 2 === 0) ? 200 : 500,
  },
  status: i % 5 === 0 ? 'suspended' : i % 4 === 0 ? 'no_card' : 'active',
  cycle: {
    value: Math.floor(Math.random() * 100),
    limit: 100,
    next: new Date(Date.now() + Math.floor(Math.random() * 10 * 24 * 60 * 60 * 1000))
  },
  created: new Date(Date.now() - Math.floor(Math.random() * 100 * 24 * 60 * 60 * 1000)),
}));

const AdminStoresList: React.FC = () => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [minBillingFilter, setMinBillingFilter] = useState('');
  const [startDateFilter, setStartDateFilter] = useState('');
  const [selectedStore, setSelectedStore] = useState<any>(null);
  const [cycleDialogOpen, setCycleDialogOpen] = useState(false);
  const [newCycleLimit, setNewCycleLimit] = useState('');
  const [chargeAlertOpen, setChargeAlertOpen] = useState(false);
  
  const filteredStores = mockStores.filter(store => {
    const matchesSearch = searchTerm === '' || 
      store.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      store.owner.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      store.owner.name.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = statusFilter === 'all' || 
      (statusFilter === 'active' && store.status === 'active') ||
      (statusFilter === 'suspended' && store.status === 'suspended') ||
      (statusFilter === 'no_card' && store.status === 'no_card');
    
    const matchesMinBilling = minBillingFilter === '' || 
      store.billing.current >= parseInt(minBillingFilter);
    
    const matchesStartDate = startDateFilter === '' || 
      (store.created >= new Date(startDateFilter));
    
    return matchesSearch && matchesStatus && matchesMinBilling && matchesStartDate;
  });

  const handleForceCharge = (store: any) => {
    setSelectedStore(store);
    setChargeAlertOpen(true);
  };

  const confirmForceCharge = () => {
    if (selectedStore) {
      toast({
        title: "Cobrança forçada",
        description: `A cobrança para a loja ${selectedStore.name} foi iniciada.`,
      });
      setChargeAlertOpen(false);
    }
  };

  const handleToggleLock = (store: any) => {
    const newStatus = store.status === 'suspended' ? 'active' : 'suspended';
    toast({
      title: newStatus === 'suspended' ? "Loja bloqueada" : "Loja desbloqueada",
      description: `A loja ${store.name} foi ${newStatus === 'suspended' ? 'bloqueada' : 'desbloqueada'}.`,
    });
  };

  const handleEditCycle = (store: any) => {
    setSelectedStore(store);
    setNewCycleLimit(store.billing.limit.toString());
    setCycleDialogOpen(true);
  };

  const confirmEditCycle = () => {
    if (selectedStore && newCycleLimit) {
      toast({
        title: "Ciclo atualizado",
        description: `O ciclo da loja ${selectedStore.name} foi atualizado para R$ ${newCycleLimit}.`,
      });
      setCycleDialogOpen(false);
    }
  };

  const handleExportCsv = () => {
    toast({
      title: "Exportação iniciada",
      description: "A lista de lojas será baixada em formato CSV em instantes.",
    });
  };

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', { 
      style: 'currency', 
      currency: 'BRL' 
    }).format(value);
  };

  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat('pt-BR').format(date);
  };

  const calculateCyclePercentage = (current: number, limit: number) => {
    return Math.min(Math.round((current / limit) * 100), 100);
  };

  return (
    <div className="space-y-6 p-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-white">Gestão de Lojas</h1>
        <Button 
          size="sm" 
          onClick={handleExportCsv}
          className="gap-2"
        >
          <Download size={16} />
          Exportar CSV
        </Button>
      </div>
      
      <Card className="bg-[#1E1E1E] border-white/5 shadow-md">
        <CardHeader className="pb-2">
          <CardTitle className="text-white flex items-center gap-2">
            <FilterIcon size={18} />
            Filtros
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="space-y-2">
              <label htmlFor="search" className="text-sm text-gray-400">Buscar por nome ou email</label>
              <div className="relative">
                <Search className="h-4 w-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                <Input
                  id="search"
                  placeholder="Buscar lojas..."
                  className="pl-10 bg-[#262626] border-white/5 focus:border-[#10B981]"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
            </div>
            
            <div className="space-y-2">
              <label htmlFor="status" className="text-sm text-gray-400">Status</label>
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger id="status" className="bg-[#262626] border-white/5">
                  <SelectValue placeholder="Todos os status" />
                </SelectTrigger>
                <SelectContent className="bg-[#262626] border-white/5">
                  <SelectItem value="all">Todos os status</SelectItem>
                  <SelectItem value="active">Ativas</SelectItem>
                  <SelectItem value="suspended">Suspensas</SelectItem>
                  <SelectItem value="no_card">Sem cartão</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div className="space-y-2">
              <label htmlFor="minBilling" className="text-sm text-gray-400">Faturamento mínimo (R$)</label>
              <div className="relative">
                <DollarSign className="h-4 w-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                <Input
                  id="minBilling"
                  type="number"
                  placeholder="Valor mínimo"
                  className="pl-10 bg-[#262626] border-white/5 focus:border-[#10B981]"
                  value={minBillingFilter}
                  onChange={(e) => setMinBillingFilter(e.target.value)}
                />
              </div>
            </div>
            
            <div className="space-y-2">
              <label htmlFor="startDate" className="text-sm text-gray-400">Data de criação (a partir de)</label>
              <div className="relative">
                <Calendar className="h-4 w-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                <Input
                  id="startDate"
                  type="date"
                  className="pl-10 bg-[#262626] border-white/5 focus:border-[#10B981]"
                  value={startDateFilter}
                  onChange={(e) => setStartDateFilter(e.target.value)}
                />
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
      
      <Card className="bg-[#1E1E1E] border-white/5 shadow-md">
        <CardHeader className="pb-2">
          <CardTitle className="text-white">Lista de Lojas ({filteredStores.length})</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader className="bg-[#262626]">
              <TableRow>
                <TableHead className="text-gray-300">Status</TableHead>
                <TableHead className="text-gray-300">Nome</TableHead>
                <TableHead className="text-gray-300">Proprietário</TableHead>
                <TableHead className="text-gray-300">Faturamento</TableHead>
                <TableHead className="text-gray-300">Ciclo</TableHead>
                <TableHead className="text-gray-300">Taxas</TableHead>
                <TableHead className="text-gray-300">Criado em</TableHead>
                <TableHead className="text-gray-300 text-right">Ações</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredStores.map((store) => {
                const cyclePercentage = calculateCyclePercentage(store.billing.current, store.billing.limit);
                const isCycleExceeded = cyclePercentage >= 100;
                
                return (
                  <TableRow key={store.id} className="hover:bg-[#2A2A2A] border-t border-white/5">
                    <TableCell>
                      <StatusBadge status={store.status} />
                    </TableCell>
                    <TableCell className="font-medium text-white">
                      {store.name}
                      {isCycleExceeded && (
                        <Badge variant="destructive" className="ml-2 text-[10px]">
                          Ciclo estourado
                        </Badge>
                      )}
                    </TableCell>
                    <TableCell>
                      <div className="flex flex-col">
                        <span className="text-gray-300">{store.owner.name}</span>
                        <span className="text-xs text-gray-500">{store.owner.email}</span>
                      </div>
                    </TableCell>
                    <TableCell className="text-gray-300">
                      {formatCurrency(store.billing.current)}
                    </TableCell>
                    <TableCell>
                      <div className="flex flex-col gap-1">
                        <div className="flex items-center justify-between text-xs text-gray-400">
                          <span>{cyclePercentage}%</span>
                          <span>{formatCurrency(store.billing.limit)}</span>
                        </div>
                        <div className="w-full bg-[#262626] rounded-full h-1.5">
                          <div 
                            className={cn(
                              "h-1.5 rounded-full",
                              cyclePercentage > 80 ? "bg-red-500" : "bg-[#10B981]"
                            )}
                            style={{ width: `${cyclePercentage}%` }}
                          ></div>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell className="text-gray-300">
                      {formatCurrency(store.billing.fees)}
                    </TableCell>
                    <TableCell className="text-gray-300 text-sm">
                      {formatDate(store.created)}
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-2">
                        <Button 
                          variant="ghost" 
                          size="icon" 
                          className="h-8 w-8 text-gray-400 hover:text-white hover:bg-[#262626]"
                          onClick={() => navigate(`/admin/lojas/${store.id}`)}
                        >
                          <Eye className="h-4 w-4" />
                        </Button>
                        
                        <Button 
                          variant="ghost" 
                          size="icon"
                          className="h-8 w-8 text-gray-400 hover:text-white hover:bg-[#262626]"
                          onClick={() => handleToggleLock(store)}
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
                              onClick={() => handleForceCharge(store)}
                            >
                              <CreditCard className="h-4 w-4 mr-2" />
                              Forçar Cobrança
                            </DropdownMenuItem>
                            <DropdownMenuItem 
                              className="cursor-pointer hover:bg-[#2A2A2A] text-gray-300 hover:text-white"
                              onClick={() => handleEditCycle(store)}
                            >
                              <Repeat className="h-4 w-4 mr-2" />
                              Editar Ciclo
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </div>
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
      
      <Dialog open={cycleDialogOpen} onOpenChange={setCycleDialogOpen}>
        <DialogContent className="bg-[#1E1E1E] border-white/5 text-white">
          <DialogHeader>
            <DialogTitle>Editar Ciclo de Cobrança</DialogTitle>
            <DialogDescription className="text-gray-400">
              Altere o valor máximo do ciclo de cobrança para a loja {selectedStore?.name}.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <label className="text-sm text-gray-400">Valor Atual</label>
              <Input 
                value={selectedStore?.billing.limit ? formatCurrency(selectedStore.billing.limit) : ''} 
                disabled 
                className="bg-[#262626] border-white/5"
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm text-gray-400">Novo Valor (R$)</label>
              <Input 
                value={newCycleLimit} 
                onChange={(e) => setNewCycleLimit(e.target.value)}
                type="number" 
                className="bg-[#262626] border-white/5 focus:border-[#10B981]"
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setCycleDialogOpen(false)}>Cancelar</Button>
            <Button onClick={confirmEditCycle}>Salvar alterações</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      
      <AlertDialog open={chargeAlertOpen} onOpenChange={setChargeAlertOpen}>
        <AlertDialogContent className="bg-[#1E1E1E] border-white/5 text-white">
          <AlertDialogHeader>
            <AlertDialogTitle>Confirmar cobrança manual</AlertDialogTitle>
            <AlertDialogDescription className="text-gray-400">
              Você está prestes a iniciar uma cobrança manual para a loja{" "}
              <span className="font-medium text-white">{selectedStore?.name}</span>.<br /><br />
              
              Valor a ser cobrado: <span className="font-medium text-white">
                {selectedStore?.billing.current ? formatCurrency(selectedStore.billing.current) : "R$ 0,00"}
              </span><br />
              
              Esta ação irá debitar o cartão cadastrado imediatamente.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel className="bg-transparent border-white/10 hover:bg-[#262626] text-gray-300">Cancelar</AlertDialogCancel>
            <AlertDialogAction onClick={confirmForceCharge} className="bg-[#10B981] hover:bg-[#0D9669]">
              Confirmar Cobrança
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
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
      status === 'no_card' && "bg-yellow-500/10 text-yellow-500",
      status === 'suspended' && "bg-red-500/10 text-red-500"
    )}>
      {status === 'active' && <CheckCircle className="h-3 w-3" />}
      {status === 'no_card' && <AlertCircle className="h-3 w-3" />}
      {status === 'suspended' && <AlertCircle className="h-3 w-3" />}
      <span>
        {status === 'active' && "Ativa"}
        {status === 'no_card' && "Sem cartão"}
        {status === 'suspended' && "Suspensa"}
      </span>
    </div>
  );
};

export default AdminStoresList;
