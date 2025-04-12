
import React, { useState } from 'react';
import { 
  Eye, 
  Lock, 
  Unlock, 
  MoreHorizontal, 
  Search,
  CheckCircle,
  AlertCircle,
  Shield,
  ShieldCheck,
  ShieldAlert,
  Mail,
  Calendar,
  Filter as FilterIcon,
  Clock,
  Building,
  UserCheck,
  Store,
  Info,
  History,
  MapPin,
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
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import { toast } from '@/hooks/use-toast';
import { Switch } from '@/components/ui/switch';

// Mock user data
const mockUsers = Array.from({ length: 30 }).map((_, i) => ({
  id: `user-${i+1}`,
  name: `Usuário ${i+1}`,
  email: `usuario${i+1}@exemplo.com${i % 5 === 0 ? '' : '.br'}`,
  stores: i % 3 === 0 
    ? [{ id: `store-1`, name: 'Loja Principal' }] 
    : i % 5 === 0 
    ? [{ id: `store-2`, name: 'Loja Secundária' }, { id: `store-3`, name: 'Loja Terciária' }]
    : [{ id: `store-${i % 7 + 1}`, name: `Loja ${i % 7 + 1}` }],
  lastAccess: i % 4 === 0 ? null : new Date(Date.now() - Math.floor(Math.random() * 10 * 24 * 60 * 60 * 1000)),
  status: i % 10 === 0 ? 'blocked' : 'active',
  permission: i % 15 === 0 ? 'admin_global' : i % 7 === 0 ? 'admin_store' : 'standard',
  created: new Date(Date.now() - Math.floor(Math.random() * 300 * 24 * 60 * 60 * 1000)),
  emailVerified: i % 3 !== 0,
  loginHistory: Array.from({ length: 5 }).map((_, j) => ({
    date: new Date(Date.now() - Math.floor(Math.random() * (j+1) * 24 * 60 * 60 * 1000)),
    ip: `192.168.${Math.floor(Math.random() * 255)}.${Math.floor(Math.random() * 255)}`,
    device: ['Chrome / Windows', 'Safari / iOS', 'Firefox / MacOS', 'Edge / Windows', 'Chrome / Android'][Math.floor(Math.random() * 5)]
  }))
}));

// Define user permission types and descriptions
const permissionTypes = [
  {
    value: 'standard',
    label: 'Usuário Padrão',
    description: 'Acesso apenas aos recursos básicos da plataforma e suas próprias lojas.',
    icon: <Shield className="h-4 w-4" />
  },
  {
    value: 'admin_store',
    label: 'Admin da Loja',
    description: 'Gerencia todos os aspectos da loja, incluindo outros usuários associados.',
    icon: <ShieldCheck className="h-4 w-4" />
  },
  {
    value: 'admin_global',
    label: 'Admin Global',
    description: 'Acesso completo a todas as funcionalidades administrativas e todas as lojas da plataforma.',
    icon: <ShieldAlert className="h-4 w-4" />
  }
];

const AdminUsersList: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [storeFilter, setStoreFilter] = useState('');
  const [createdDateFilter, setCreatedDateFilter] = useState('');
  const [selectedUser, setSelectedUser] = useState<any>(null);
  const [profileDialogOpen, setProfileDialogOpen] = useState(false);
  const [permissionDialogOpen, setPermissionDialogOpen] = useState(false);
  const [resetPasswordAlertOpen, setResetPasswordAlertOpen] = useState(false);
  const [blockUserAlertOpen, setBlockUserAlertOpen] = useState(false);
  const [newPermission, setNewPermission] = useState('');
  
  // Apply all filters to the users list
  const filteredUsers = mockUsers.filter(user => {
    // Search filter (name or email)
    const matchesSearch = searchTerm === '' || 
      user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email.toLowerCase().includes(searchTerm.toLowerCase());
    
    // Status filter
    const matchesStatus = statusFilter === 'all' || 
      (statusFilter === 'active' && user.status === 'active') ||
      (statusFilter === 'blocked' && user.status === 'blocked');
    
    // Store filter
    const matchesStore = storeFilter === '' || 
      user.stores.some(store => store.name.toLowerCase().includes(storeFilter.toLowerCase()));
    
    // Created date filter
    const matchesCreatedDate = createdDateFilter === '' || 
      (user.created >= new Date(createdDateFilter));
    
    return matchesSearch && matchesStatus && matchesStore && matchesCreatedDate;
  });

  const handleResetPassword = (user: any) => {
    setSelectedUser(user);
    setResetPasswordAlertOpen(true);
  };

  const confirmResetPassword = () => {
    if (selectedUser) {
      toast({
        title: "Link de redefinição enviado",
        description: `Um e-mail foi enviado para ${selectedUser.email} com instruções para redefinir a senha.`,
      });
      setResetPasswordAlertOpen(false);
    }
  };

  const handleChangePermissions = (user: any) => {
    setSelectedUser(user);
    setNewPermission(user.permission);
    setPermissionDialogOpen(true);
  };

  const confirmChangePermissions = () => {
    if (selectedUser && newPermission) {
      const permissionLabel = permissionTypes.find(p => p.value === newPermission)?.label;
      toast({
        title: "Permissões atualizadas",
        description: `O usuário ${selectedUser.name} agora tem permissão de "${permissionLabel}".`,
      });
      setPermissionDialogOpen(false);
    }
  };

  const handleToggleBlock = (user: any) => {
    if (user.status === 'blocked') {
      toast({
        title: "Usuário desbloqueado",
        description: `A conta de ${user.name} foi desbloqueada.`,
      });
    } else {
      setSelectedUser(user);
      setBlockUserAlertOpen(true);
    }
  };

  const confirmBlockUser = () => {
    if (selectedUser) {
      toast({
        title: "Usuário bloqueado",
        description: `A conta de ${selectedUser.name} foi bloqueada. O usuário será desconectado em sua próxima requisição.`,
      });
      setBlockUserAlertOpen(false);
    }
  };

  const handleViewProfile = (user: any) => {
    setSelectedUser(user);
    setProfileDialogOpen(true);
  };

  const formatDate = (date: Date | null) => {
    if (!date) return 'Nunca acessou';
    return new Intl.DateTimeFormat('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    }).format(date);
  };

  const getPermissionLabel = (permission: string) => {
    return permissionTypes.find(p => p.value === permission)?.label || 'Desconhecido';
  };

  const getPermissionIcon = (permission: string) => {
    return permissionTypes.find(p => p.value === permission)?.icon || <Shield className="h-4 w-4" />;
  };

  return (
    <div className="space-y-6 p-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-white">Gestão de Usuários</h1>
      </div>
      
      {/* Filters */}
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
                  placeholder="Buscar usuários..."
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
                  <SelectItem value="active">Ativo</SelectItem>
                  <SelectItem value="blocked">Bloqueado</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div className="space-y-2">
              <label htmlFor="storeFilter" className="text-sm text-gray-400">Loja associada</label>
              <Input
                id="storeFilter"
                placeholder="Nome da loja"
                className="bg-[#262626] border-white/5 focus:border-[#10B981]"
                value={storeFilter}
                onChange={(e) => setStoreFilter(e.target.value)}
              />
            </div>
            
            <div className="space-y-2">
              <label htmlFor="createdDate" className="text-sm text-gray-400">Data de criação (a partir de)</label>
              <div className="relative">
                <Calendar className="h-4 w-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                <Input
                  id="createdDate"
                  type="date"
                  className="pl-10 bg-[#262626] border-white/5 focus:border-[#10B981]"
                  value={createdDateFilter}
                  onChange={(e) => setCreatedDateFilter(e.target.value)}
                />
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
      
      {/* Users Table */}
      <Card className="bg-[#1E1E1E] border-white/5 shadow-md">
        <CardHeader className="pb-2">
          <CardTitle className="text-white">Lista de Usuários ({filteredUsers.length})</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader className="bg-[#262626]">
              <TableRow>
                <TableHead className="text-gray-300">Status</TableHead>
                <TableHead className="text-gray-300">Nome</TableHead>
                <TableHead className="text-gray-300">E-mail</TableHead>
                <TableHead className="text-gray-300">Loja(s)</TableHead>
                <TableHead className="text-gray-300">Último Acesso</TableHead>
                <TableHead className="text-gray-300">Permissão</TableHead>
                <TableHead className="text-gray-300 text-right">Ações</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredUsers.map((user) => (
                <TableRow key={user.id} className="hover:bg-[#2A2A2A] border-t border-white/5">
                  <TableCell>
                    <div className={cn(
                      "flex items-center gap-1.5 text-xs font-medium px-2 py-1 rounded-full w-fit",
                      user.status === 'active' && "bg-emerald-500/10 text-emerald-500",
                      user.status === 'blocked' && "bg-red-500/10 text-red-500"
                    )}>
                      {user.status === 'active' ? (
                        <CheckCircle className="h-3 w-3" />
                      ) : (
                        <AlertCircle className="h-3 w-3" />
                      )}
                      <span>
                        {user.status === 'active' ? "Ativo" : "Bloqueado"}
                      </span>
                    </div>
                  </TableCell>
                  <TableCell className="font-medium text-white">
                    <div className="flex items-center gap-2">
                      {user.name}
                      {user.emailVerified && (
                        <Badge variant="success" className="text-[10px] py-0 h-5">
                          <CheckCircle className="h-3 w-3 mr-1" />
                          Verificado
                        </Badge>
                      )}
                      {!user.lastAccess && (
                        <Badge variant="warning" className="text-[10px] py-0 h-5">
                          Nunca acessou
                        </Badge>
                      )}
                    </div>
                  </TableCell>
                  <TableCell className="text-gray-300">{user.email}</TableCell>
                  <TableCell>
                    <div className="flex flex-wrap gap-1">
                      {user.stores.map((store, index) => (
                        <Badge 
                          key={store.id} 
                          variant="secondary" 
                          className="bg-[#303030] text-gray-300 hover:bg-[#404040]"
                        >
                          {store.name}
                        </Badge>
                      ))}
                    </div>
                  </TableCell>
                  <TableCell className="text-gray-300 text-sm">
                    <div className="flex items-center gap-1.5">
                      <Clock className="h-3.5 w-3.5 text-gray-400" />
                      {formatDate(user.lastAccess)}
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-1.5 text-xs font-medium px-2 py-1 rounded-full w-fit bg-[#303030]">
                      {getPermissionIcon(user.permission)}
                      <span className="text-gray-300">{getPermissionLabel(user.permission)}</span>
                    </div>
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-2">
                      <Button 
                        variant="ghost" 
                        size="icon" 
                        className="h-8 w-8 text-gray-400 hover:text-white hover:bg-[#262626]"
                        onClick={() => handleViewProfile(user)}
                      >
                        <Eye className="h-4 w-4" />
                      </Button>
                      
                      <Button 
                        variant="ghost" 
                        size="icon"
                        className={cn(
                          "h-8 w-8 hover:bg-[#262626]",
                          user.status === 'blocked' 
                            ? "text-amber-500 hover:text-amber-400" 
                            : "text-red-500 hover:text-red-400"
                        )}
                        onClick={() => handleToggleBlock(user)}
                      >
                        {user.status === 'blocked' ? (
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
                            onClick={() => handleResetPassword(user)}
                          >
                            <Mail className="h-4 w-4 mr-2" />
                            Resetar Senha
                          </DropdownMenuItem>
                          <DropdownMenuItem 
                            className="cursor-pointer hover:bg-[#2A2A2A] text-gray-300 hover:text-white"
                            onClick={() => handleChangePermissions(user)}
                          >
                            <ShieldCheck className="h-4 w-4 mr-2" />
                            Alterar Permissões
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
      
      {/* User Profile Dialog */}
      <Dialog open={profileDialogOpen} onOpenChange={setProfileDialogOpen}>
        <DialogContent className="bg-[#1E1E1E] border-white/5 text-white max-w-3xl">
          <DialogHeader>
            <DialogTitle className="text-xl">
              Perfil do Usuário
            </DialogTitle>
            <DialogDescription className="text-gray-400">
              Informações detalhadas sobre {selectedUser?.name}
            </DialogDescription>
          </DialogHeader>
          
          {selectedUser && (
            <Tabs defaultValue="personal" className="mt-4">
              <TabsList className="bg-[#262626] border-white/5">
                <TabsTrigger value="personal" className="data-[state=active]:bg-[#3E3E3E]">
                  <UserCheck className="h-4 w-4 mr-2" />
                  Dados Pessoais
                </TabsTrigger>
                <TabsTrigger value="stores" className="data-[state=active]:bg-[#3E3E3E]">
                  <Store className="h-4 w-4 mr-2" />
                  Lojas Vinculadas
                </TabsTrigger>
                <TabsTrigger value="access" className="data-[state=active]:bg-[#3E3E3E]">
                  <History className="h-4 w-4 mr-2" />
                  Histórico de Acessos
                </TabsTrigger>
              </TabsList>
              
              {/* Dados Pessoais */}
              <TabsContent value="personal" className="border-none p-0 mt-4">
                <Card className="bg-[#262626] border-white/5">
                  <CardContent className="p-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-4">
                        <div>
                          <p className="text-gray-400 text-sm">Nome</p>
                          <p className="text-white font-medium">{selectedUser.name}</p>
                        </div>
                        <div>
                          <p className="text-gray-400 text-sm">E-mail</p>
                          <div className="flex items-center gap-2">
                            <p className="text-white font-medium">{selectedUser.email}</p>
                            {selectedUser.emailVerified && (
                              <Badge variant="success" className="text-[10px] py-0 h-5">
                                <CheckCircle className="h-3 w-3 mr-1" />
                                Verificado
                              </Badge>
                            )}
                          </div>
                        </div>
                        <div>
                          <p className="text-gray-400 text-sm">Status</p>
                          <div className={cn(
                            "inline-flex items-center gap-1.5 text-xs font-medium px-2 py-1 rounded-full mt-1",
                            selectedUser.status === 'active' && "bg-emerald-500/10 text-emerald-500",
                            selectedUser.status === 'blocked' && "bg-red-500/10 text-red-500"
                          )}>
                            {selectedUser.status === 'active' ? (
                              <CheckCircle className="h-3 w-3" />
                            ) : (
                              <AlertCircle className="h-3 w-3" />
                            )}
                            <span>
                              {selectedUser.status === 'active' ? "Ativo" : "Bloqueado"}
                            </span>
                          </div>
                        </div>
                      </div>
                      
                      <div className="space-y-4">
                        <div>
                          <p className="text-gray-400 text-sm">Nível de Permissão</p>
                          <div className="flex items-center gap-2 mt-1">
                            {getPermissionIcon(selectedUser.permission)}
                            <p className="text-white font-medium">{getPermissionLabel(selectedUser.permission)}</p>
                          </div>
                        </div>
                        <div>
                          <p className="text-gray-400 text-sm">Data de Criação</p>
                          <div className="flex items-center gap-1.5 mt-1">
                            <Calendar className="h-4 w-4 text-gray-400" />
                            <p className="text-white">{formatDate(selectedUser.created)}</p>
                          </div>
                        </div>
                        <div>
                          <p className="text-gray-400 text-sm">Último Acesso</p>
                          <div className="flex items-center gap-1.5 mt-1">
                            <Clock className="h-4 w-4 text-gray-400" />
                            <p className="text-white">{formatDate(selectedUser.lastAccess)}</p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
              
              {/* Lojas Vinculadas */}
              <TabsContent value="stores" className="border-none p-0 mt-4">
                <Card className="bg-[#262626] border-white/5">
                  <CardContent className="p-4">
                    {selectedUser.stores.length > 0 ? (
                      <div className="space-y-4">
                        {selectedUser.stores.map((store: any) => (
                          <div key={store.id} className="p-3 bg-[#2A2A2A] rounded-md flex items-center justify-between">
                            <div className="flex items-center gap-2">
                              <Store className="h-5 w-5 text-gray-400" />
                              <div>
                                <p className="text-white font-medium">{store.name}</p>
                                <p className="text-xs text-gray-400">ID: {store.id}</p>
                              </div>
                            </div>
                            <Button variant="ghost" size="sm">
                              <Eye className="h-4 w-4 mr-2" />
                              Ver Loja
                            </Button>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="text-center py-6">
                        <Info className="h-10 w-10 text-gray-500 mx-auto mb-2" />
                        <p className="text-gray-400">Este usuário não está vinculado a nenhuma loja.</p>
                      </div>
                    )}
                  </CardContent>
                </Card>
              </TabsContent>
              
              {/* Histórico de Acessos */}
              <TabsContent value="access" className="border-none p-0 mt-4">
                <Card className="bg-[#262626] border-white/5">
                  <CardContent className="p-4">
                    {selectedUser.loginHistory.length > 0 ? (
                      <div className="space-y-3">
                        {selectedUser.loginHistory.map((login: any, index: number) => (
                          <div key={index} className="p-3 bg-[#2A2A2A] rounded-md">
                            <div className="flex justify-between items-start">
                              <div className="flex items-center gap-2">
                                <Clock className="h-4 w-4 text-gray-400" />
                                <p className="text-white">{formatDate(login.date)}</p>
                              </div>
                              <Badge variant="secondary" className="bg-[#3E3E3E]">
                                {login.device}
                              </Badge>
                            </div>
                            <div className="flex items-center gap-2 mt-2 text-sm text-gray-400">
                              <MapPin className="h-4 w-4" />
                              <p>IP: {login.ip}</p>
                            </div>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="text-center py-6">
                        <History className="h-10 w-10 text-gray-500 mx-auto mb-2" />
                        <p className="text-gray-400">Não há registros de acesso para este usuário.</p>
                      </div>
                    )}
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          )}
          
          <DialogFooter>
            <Button onClick={() => setProfileDialogOpen(false)}>Fechar</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      
      {/* Change Permission Dialog */}
      <Dialog open={permissionDialogOpen} onOpenChange={setPermissionDialogOpen}>
        <DialogContent className="bg-[#1E1E1E] border-white/5 text-white">
          <DialogHeader>
            <DialogTitle>Alterar Permissões</DialogTitle>
            <DialogDescription className="text-gray-400">
              Defina o nível de acesso para o usuário {selectedUser?.name}.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            {permissionTypes.map((permission) => (
              <div 
                key={permission.value}
                className={cn(
                  "flex items-start p-3 rounded-md cursor-pointer border",
                  newPermission === permission.value 
                    ? "border-[#10B981] bg-[#10B981]/5" 
                    : "border-white/5 hover:bg-[#262626]"
                )}
                onClick={() => setNewPermission(permission.value)}
              >
                <div className="mr-3 mt-0.5">
                  <Switch 
                    checked={newPermission === permission.value}
                    onCheckedChange={() => setNewPermission(permission.value)}
                  />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    {permission.icon}
                    <h4 className="font-medium text-white">{permission.label}</h4>
                  </div>
                  <p className="text-sm text-gray-400 mt-1">{permission.description}</p>
                </div>
              </div>
            ))}
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setPermissionDialogOpen(false)}>Cancelar</Button>
            <Button onClick={confirmChangePermissions}>Salvar alterações</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      
      {/* Reset Password Alert Dialog */}
      <AlertDialog open={resetPasswordAlertOpen} onOpenChange={setResetPasswordAlertOpen}>
        <AlertDialogContent className="bg-[#1E1E1E] border-white/5 text-white">
          <AlertDialogHeader>
            <AlertDialogTitle>Redefinir senha do usuário</AlertDialogTitle>
            <AlertDialogDescription className="text-gray-400">
              Um e-mail com instruções para redefinição de senha será enviado para{" "}
              <span className="font-medium text-white">{selectedUser?.email}</span>.
              <br /><br />
              O link de redefinição é válido por 24 horas.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel className="bg-transparent border-white/10 hover:bg-[#262626] text-gray-300">Cancelar</AlertDialogCancel>
            <AlertDialogAction onClick={confirmResetPassword} className="bg-[#10B981] hover:bg-[#0D9669]">
              Enviar E-mail
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
      
      {/* Block User Alert Dialog */}
      <AlertDialog open={blockUserAlertOpen} onOpenChange={setBlockUserAlertOpen}>
        <AlertDialogContent className="bg-[#1E1E1E] border-white/5 text-white">
          <AlertDialogHeader>
            <AlertDialogTitle>Bloquear usuário</AlertDialogTitle>
            <AlertDialogDescription className="text-gray-400">
              Você está prestes a bloquear o usuário{" "}
              <span className="font-medium text-white">{selectedUser?.name}</span>.
              <br /><br />
              O usuário perderá acesso imediatamente à plataforma e seus dados serão preservados.
              <br />
              Você poderá desbloquear a conta a qualquer momento.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel className="bg-transparent border-white/10 hover:bg-[#262626] text-gray-300">Cancelar</AlertDialogCancel>
            <AlertDialogAction onClick={confirmBlockUser} className="bg-red-600 hover:bg-red-700">
              Bloquear Usuário
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default AdminUsersList;
